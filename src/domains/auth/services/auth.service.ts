import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@user/services/user.service';
import { FirebaseAuthService } from './firebase-auth.service';
import { Web3AuthService } from './web3-auth.service';
import { EmailService } from '@infrastructure/email/services/email.service';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { FirebaseAuthDto } from '../dtos/firebase-auth.dto';
import { Web3AuthDto } from '../dtos/web3-auth.dto';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly firebaseAuthService: FirebaseAuthService,
    private readonly web3AuthService: Web3AuthService,
    private readonly emailService: EmailService,
  ) {}

  async login(loginDto: LoginDto, clientIP: string) {
    // 1. Find user by email
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 2. Verify password
    const isPasswordValid = await this.verifyPassword(
      loginDto.password,
      user.encryptedPassword,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. Check if user is confirmed
    if (!user.confirmedAt) {
      throw new UnauthorizedException('Please confirm your email first');
    }

    // 4. Check if user is locked
    if (user.lockedAt) {
      throw new UnauthorizedException(
        'Account is locked. Please contact support.',
      );
    }

    // 5. Generate JWT token
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };
    const token = this.jwtService.sign(payload);

    // 6. Update sign in info
    await this.userService.updateSignInInfo(user.id, clientIP);

    // 7. Check if user has talent profile
    const hasProfile = await this.userService.hasTalentProfile(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token_type: 'Bearer',
      access_token: token,
      expires_in: 7200, // 2 hours
      has_profile: hasProfile,
    };
  }

  async register(registerDto: RegisterDto) {
    // 1. Check if user already exists
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // 2. Generate confirmation token
    const confirmationToken = this.generateConfirmationToken();

    // 3. Create user (password will be hashed by UserService)
    const user = await this.userService.create({
      name: registerDto.name,
      email: registerDto.email,
      password: registerDto.password,
      locationCityId: registerDto.location_city_id,
      refCode: registerDto.ref_code,
    });

    // 5. Update user with confirmation token (after creation)
    await this.userService.update(user.id, {
      confirmationToken,
      confirmedAt: null,
    });

    // 6. Send confirmation email (temporarily disabled for testing)
    // await this.emailService.sendConfirmationEmail(user.email, user.name, confirmationToken);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        confirmed_at: user.confirmedAt,
      },
      message: 'Confirmation email sent',
    };
  }

  async firebaseAuth(firebaseAuthDto: FirebaseAuthDto) {
    return this.firebaseAuthService.authenticate(firebaseAuthDto);
  }

  async web3Auth(web3AuthDto: Web3AuthDto) {
    return this.web3AuthService.authenticate(web3AuthDto);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userService.findByEmail(forgotPasswordDto.email);
    if (user) {
      // Check if user is confirmed
      if (!user.confirmedAt) {
        throw new BadRequestException(
          'Please confirm your email first before requesting password reset',
        );
      }

      // Check if user is locked
      if (user.lockedAt) {
        throw new BadRequestException(
          'Account is locked. Please contact support.',
        );
      }

      // Generate reset token
      const resetToken = this.generateResetToken();
      await this.userService.updateResetToken(user.id, resetToken);

      // Send reset email
      await this.emailService.sendPasswordResetEmail(
        user.email,
        user.name,
        resetToken,
      );
    }

    // Always return success message for security (don't reveal if email exists)
    return {
      message:
        'If an account with that email exists, a password reset link has been sent',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userService.findByResetPasswordToken(
      resetPasswordDto.token,
    );
    if (!user) {
      throw new BadRequestException('Invalid or expired reset password token');
    }

    // Check if token is expired (24 hours)
    if (user.resetPasswordSentAt) {
      const tokenAge = Date.now() - user.resetPasswordSentAt.getTime();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      if (tokenAge > maxAge) {
        // Clear expired token
        await this.userService.clearResetToken(user.id);
        throw new BadRequestException(
          'Reset password token has expired. Please request a new one.',
        );
      }
    }

    // Check if user is locked
    if (user.lockedAt) {
      throw new BadRequestException(
        'Account is locked. Please contact support.',
      );
    }

    // Validate password strength
    if (resetPasswordDto.password.length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters long',
      );
    }

    const hashedPassword = await this.hashPassword(resetPasswordDto.password);
    await this.userService.resetPassword(user.id, hashedPassword);

    return { message: 'Password updated successfully' };
  }

  async validateResetToken(token: string) {
    const user = await this.userService.findByResetPasswordToken(token);
    if (!user) {
      return { valid: false, message: 'Invalid reset password token' };
    }

    // Check if token is expired (24 hours)
    if (user.resetPasswordSentAt) {
      const tokenAge = Date.now() - user.resetPasswordSentAt.getTime();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      if (tokenAge > maxAge) {
        // Clear expired token
        await this.userService.clearResetToken(user.id);
        return { valid: false, message: 'Reset password token has expired' };
      }
    }

    return { valid: true, email: user.email };
  }

  async confirmEmail(token: string) {
    const user = await this.userService.findByConfirmationToken(token);
    if (!user) {
      throw new BadRequestException('Invalid confirmation token');
    }

    if (user.confirmedAt) {
      throw new ConflictException('Email already confirmed');
    }

    await this.userService.confirmUser(user.id);
    return { message: 'Email confirmed successfully' };
  }

  async socialCallback(body: any) {
    // TODO: Implement social callback logic
    throw new UnauthorizedException('Social callback not implemented yet');
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  private async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private generateConfirmationToken(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  private generateResetToken(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}
