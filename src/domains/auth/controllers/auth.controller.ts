import {
  Controller,
  Post,
  Body,
  Put,
  Get,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { FirebaseAuthDto } from '../dtos/firebase-auth.dto';
import { Web3AuthDto } from '../dtos/web3-auth.dto';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { ClientIP } from '../../../shared/cross-cutting/authorization/decorators/current-user.decorator';
import { Public } from '../../../shared/cross-cutting/authorization/decorators/public.decorator';
import { ResponseHandler } from '@shared/utils/response-handler';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body() loginDto: LoginDto, @ClientIP() clientIP: string) {
    const result = await this.authService.login(loginDto, clientIP);
    return ResponseHandler.success({
      data: result,
      message: 'Login successful',
    });
  }

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
  })
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return ResponseHandler.success({
      data: result,
      statusCode: HttpStatus.CREATED,
      message: 'User registered successfully',
    });
  }

  @Post('firebase')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with Firebase token' })
  @ApiBody({ type: FirebaseAuthDto })
  @ApiResponse({
    status: 200,
    description: 'Firebase authentication successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid Firebase token',
  })
  async firebaseAuth(@Body() firebaseAuthDto: FirebaseAuthDto) {
    const result = await this.authService.firebaseAuth(firebaseAuthDto);
    return ResponseHandler.success({
      data: result,
      message: 'Firebase authentication successful',
    });
  }

  @Post('web3')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with Web3 wallet' })
  @ApiBody({ type: Web3AuthDto })
  @ApiResponse({
    status: 200,
    description: 'Web3 authentication successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid Web3 signature',
  })
  async web3Auth(@Body() web3AuthDto: Web3AuthDto) {
    const result = await this.authService.web3Auth(web3AuthDto);
    return ResponseHandler.success({
      data: result,
      message: 'Web3 authentication successful',
    });
  }

  @Post('forgot-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const result = await this.authService.forgotPassword(forgotPasswordDto);
    return ResponseHandler.success({
      data: result,
      message: 'Password reset email sent',
    });
  }

  @Put('reset-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset successful',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired token',
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const result = await this.authService.resetPassword(resetPasswordDto);
    return ResponseHandler.success({
      data: result,
      message: 'Password reset successful',
    });
  }

  @Get('validate-reset-token')
  @Public()
  @ApiOperation({ summary: 'Validate password reset token' })
  @ApiResponse({
    status: 200,
    description: 'Token is valid',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired token',
  })
  async validateResetToken(@Query('token') token: string) {
    const result = await this.authService.validateResetToken(token);
    return ResponseHandler.success({
      data: result,
      message: 'Token is valid',
    });
  }

  @Get('confirm-email')
  @Public()
  @ApiOperation({ summary: 'Confirm email address' })
  @ApiResponse({
    status: 200,
    description: 'Email confirmed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired confirmation token',
  })
  async confirmEmail(@Query('confirmation_token') token: string) {
    const result = await this.authService.confirmEmail(token);
    return ResponseHandler.success({
      data: result,
      message: 'Email confirmed successfully',
    });
  }

  @Post('social/callback')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Social authentication callback' })
  @ApiResponse({
    status: 200,
    description: 'Social authentication successful',
  })
  async socialCallback(@Body() body: any) {
    const result = await this.authService.socialCallback(body);
    return ResponseHandler.success({
      data: result,
      message: 'Social authentication successful',
    });
  }
}
