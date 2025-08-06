import { Controller, Post, Body, Put, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { FirebaseAuthDto } from '../dtos/firebase-auth.dto';
import { Web3AuthDto } from '../dtos/web3-auth.dto';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';

@ApiTags('auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' }
          }
        },
        token_type: { type: 'string', example: 'Bearer' },
        access_token: { type: 'string' },
        expires_in: { type: 'number', example: 7200 },
        has_profile: { type: 'boolean' }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials'
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            confirmed_at: { type: 'string', nullable: true }
          }
        },
        message: { type: 'string', example: 'Confirmation email sent' }
      }
    }
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists'
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('firebase')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with Firebase token' })
  @ApiBody({ type: FirebaseAuthDto })
  @ApiResponse({
    status: 200,
    description: 'Firebase authentication successful',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' }
          }
        },
        user_id: { type: 'string' },
        token_type: { type: 'string', example: 'Bearer' },
        access_token: { type: 'string' },
        has_profile: { type: 'boolean' },
        expires_in: { type: 'number' },
        created_at: { type: 'number' },
        refresh_token: { type: 'string' }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid Firebase token'
  })
  async firebaseAuth(@Body() firebaseAuthDto: FirebaseAuthDto) {
    return this.authService.firebaseAuth(firebaseAuthDto);
  }

  @Post('web3')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with Web3/Thirdweb' })
  @ApiBody({ type: Web3AuthDto })
  @ApiResponse({
    status: 200,
    description: 'Web3 authentication successful',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        token_type: { type: 'string', example: 'Bearer' },
        expires_in: { type: 'number' },
        refresh_token: { type: 'string' },
        scope: { type: 'string' },
        created_at: { type: 'number' }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid JWT token'
  })
  async web3Auth(@Body() web3AuthDto: Web3AuthDto) {
    return this.authService.web3Auth(web3AuthDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Reset password email sent',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Reset password email sent' }
      }
    }
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Put('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password updated successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Password updated successfully' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid reset password token'
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('confirm-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm email' })
  @ApiResponse({
    status: 200,
    description: 'Email confirmed successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Email confirmed successfully' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid confirmation token'
  })
  @ApiResponse({
    status: 409,
    description: 'Email already confirmed'
  })
  async confirmEmail(@Query('confirmation_token') token: string) {
    return this.authService.confirmEmail(token);
  }

  @Post('social/callback')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Social login callback' })
  @ApiResponse({
    status: 200,
    description: 'Social authentication successful',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' }
          }
        },
        token_type: { type: 'string', example: 'Bearer' },
        access_token: { type: 'string' },
        expires_in: { type: 'number' }
      }
    }
  })
  async socialCallback(@Body() body: any) {
    return this.authService.socialCallback(body);
  }
}