import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OAuth2Strategy extends PassportStrategy(Strategy, 'oauth2') {
  constructor(private configService: ConfigService) {
    super({
      authorizationURL: configService.get('OAUTH2_AUTHORIZATION_URL'),
      tokenURL: configService.get('OAUTH2_TOKEN_URL'),
      clientID: configService.get('OAUTH2_CLIENT_ID'),
      clientSecret: configService.get('OAUTH2_CLIENT_SECRET'),
      callbackURL: configService.get('OAUTH2_CALLBACK_URL'),
      scope: configService.get('OAUTH2_SCOPE', 'read'),
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    // Handle OAuth2 profile validation
    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      accessToken,
    };
  }
} 