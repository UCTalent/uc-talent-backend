import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@user/services/user.service';
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
  ) {}

  async login(loginDto: LoginDto) {
    // 1. Find user by email
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 2. Verify password
    const isPasswordValid = await this.verifyPassword(loginDto.password, user.encryptedPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. Check if user is confirmed
    if (!user.confirmedAt) {
      throw new UnauthorizedException('Please confirm your email first');
    }

    // 4. Check if user is locked
    if (user.lockedAt) {
      throw new UnauthorizedException('Account is locked. Please contact support.');
    }

    // 5. Generate JWT token
    const payload = { 
      sub: user.id, 
      email: user.email,
      name: user.name 
    };
    const token = this.jwtService.sign(payload);

    // 6. Update sign in info
    await this.userService.updateSignInInfo(user.id, '127.0.0.1'); // TODO: Get real IP

    // 7. Check if user has talent profile
    const hasProfile = await this.userService.hasTalentProfile(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token_type: 'Bearer',
      access_token: token,
      expires_in: 7200, // 2 hours
      has_profile: hasProfile
    };
  }

  async register(registerDto: RegisterDto) {
    // 1. Check if user already exists
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // 2. Hash password
    const hashedPassword = await this.hashPassword(registerDto.password);

    // 3. Generate confirmation token
    const confirmationToken = this.generateConfirmationToken();

    // 4. Create user
    const user = await this.userService.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      locationCityId: registerDto.location_city_id,
      refCode: registerDto.ref_code
    });

    // 5. Update user with confirmation token (after creation)
    await this.userService.update(user.id, {
      confirmationToken,
      confirmedAt: null
    });

    // 6. Send confirmation email (TODO: Implement email service)
    // await this.emailService.sendConfirmationEmail(user.email, confirmationToken);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        confirmed_at: user.confirmedAt
      },
      message: 'Confirmation email sent'
    };
  }

  async firebaseAuth(firebaseAuthDto: FirebaseAuthDto) {
    // TODO: Implement Firebase token verification
    // For now, return mock response
    throw new UnauthorizedException('Firebase authentication not implemented yet');
  }

  async web3Auth(web3AuthDto: Web3AuthDto) {
    // TODO: Implement Web3 token verification
    // For now, return mock response
    throw new UnauthorizedException('Web3 authentication not implemented yet');
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userService.findByEmail(forgotPasswordDto.email);
    if (user) {
      // Generate reset token
      const resetToken = this.generateResetToken();
      await this.userService.updateResetToken(user.id, resetToken);
      
      // Send reset email (TODO: Implement email service)
      // await this.emailService.sendPasswordResetEmail(user.email, resetToken);
    }
    
    return { message: 'Reset password email sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userService.findByResetPasswordToken(resetPasswordDto.token);
    if (!user) {
      throw new BadRequestException('Invalid reset password token');
    }

    const hashedPassword = await this.hashPassword(resetPasswordDto.password);
    await this.userService.resetPassword(user.id, hashedPassword);
    
    return { message: 'Password updated successfully' };
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

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private generateConfirmationToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  private generateResetToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}