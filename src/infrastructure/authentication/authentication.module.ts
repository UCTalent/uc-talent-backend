import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '@user/user.module';

import { AuthenticationService } from './services/authentication.service';
import { OAuth2Service } from './services/oauth2.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OAuth2Strategy } from './strategies/oauth2.strategy';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '24h'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthenticationService,
    OAuth2Service,
    JwtStrategy,
    OAuth2Strategy,
  ],
  exports: [AuthenticationService, OAuth2Service],
})
export class AuthenticationModule {}
