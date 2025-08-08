import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { FirebaseAuthService } from './services/firebase-auth.service';
import { Web3AuthService } from './services/web3-auth.service';
import { UserModule } from '@user/user.module';
import { EmailModule } from '@infrastructure/email/email.module';

@Module({
  imports: [
    UserModule,
    EmailModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'your-super-secret-jwt-key'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '7d'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    FirebaseAuthService,
    Web3AuthService,
  ],
  exports: [AuthService],
})
export class AuthModule {}