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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthService } from '@domains/auth/services/auth.service';
import { LoginDto } from '@domains/auth/dtos/login.dto';
import { RegisterDto } from '@domains/auth/dtos/register.dto';
import { FirebaseAuthDto } from '@domains/auth/dtos/firebase-auth.dto';
import { Web3AuthDto } from '@domains/auth/dtos/web3-auth.dto';
import { ForgotPasswordDto } from '@domains/auth/dtos/forgot-password.dto';
import { ResetPasswordDto } from '@domains/auth/dtos/reset-password.dto';
import { ClientIP } from '@shared/cross-cutting/authorization/decorators/current-user.decorator';
import { Public } from '@shared/cross-cutting/authorization/decorators/public.decorator';
import { ResponseHandler } from '@shared/utils/response-handler';
import { Docs } from '@documents/auth/auth.document';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation(Docs.login.operation)
  @ApiBody(Docs.login.body)
  @ApiResponse(Docs.login.responses.success[0])
  @ApiResponse(Docs.login.responses.error[0])
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
  @ApiOperation(Docs.register.operation)
  @ApiBody(Docs.register.body)
  @ApiResponse(Docs.register.responses.success[0])
  @ApiResponse(Docs.register.responses.error[0])
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
  @ApiOperation(Docs.firebaseAuth.operation)
  @ApiBody(Docs.firebaseAuth.body)
  @ApiResponse(Docs.firebaseAuth.responses.success[0])
  @ApiResponse(Docs.firebaseAuth.responses.error[0])
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
  @ApiOperation(Docs.web3Auth.operation)
  @ApiBody(Docs.web3Auth.body)
  @ApiResponse(Docs.web3Auth.responses.success[0])
  @ApiResponse(Docs.web3Auth.responses.error[0])
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
  @ApiOperation(Docs.forgotPassword.operation)
  @ApiBody(Docs.forgotPassword.body)
  @ApiResponse(Docs.forgotPassword.responses.success[0])
  @ApiResponse(Docs.forgotPassword.responses.error[0])
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
  @ApiOperation(Docs.resetPassword.operation)
  @ApiBody(Docs.resetPassword.body)
  @ApiResponse(Docs.resetPassword.responses.success[0])
  @ApiResponse(Docs.resetPassword.responses.error[0])
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const result = await this.authService.resetPassword(resetPasswordDto);
    return ResponseHandler.success({
      data: result,
      message: 'Password reset successful',
    });
  }

  @Get('validate-reset-token')
  @Public()
  @ApiOperation(Docs.validateResetToken.operation)
  @ApiQuery(Docs.validateResetToken.query)
  @ApiResponse(Docs.validateResetToken.responses.success[0])
  @ApiResponse(Docs.validateResetToken.responses.error[0])
  async validateResetToken(@Query('token') token: string) {
    const result = await this.authService.validateResetToken(token);
    return ResponseHandler.success({
      data: result,
      message: 'Token is valid',
    });
  }

  @Get('confirm-email')
  @Public()
  @ApiOperation(Docs.confirmEmail.operation)
  @ApiQuery(Docs.confirmEmail.query)
  @ApiResponse(Docs.confirmEmail.responses.success[0])
  @ApiResponse(Docs.confirmEmail.responses.error[0])
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
  @ApiOperation(Docs.socialCallback.operation)
  @ApiBody(Docs.socialCallback.body)
  @ApiResponse(Docs.socialCallback.responses.success[0])
  @ApiResponse(Docs.socialCallback.responses.error[0])
  async socialCallback(@Body() body: any) {
    const result = await this.authService.socialCallback(body);
    return ResponseHandler.success({
      data: result,
      message: 'Social authentication successful',
    });
  }
}
