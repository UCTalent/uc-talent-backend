import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@user/services/user.service';
import { Web3AuthDto } from '../dtos/web3-auth.dto';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';

@Injectable()
export class Web3AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async authenticate(web3AuthDto: Web3AuthDto) {
    const { jwt } = web3AuthDto;

    try {
      // Decode and validate JWT token
      const payload = await this.decodeJwt(jwt);
      
      // Extract user information
      const userInfo = this.extractUserInfo(payload);
      
      // Find or create user
      const user = await this.findOrCreateUser(userInfo);

      return {
        access_token: 'mock_access_token', // In real app, generate OAuth token
        token_type: 'Bearer',
        expires_in: 7200,
        refresh_token: 'mock_refresh_token',
        scope: 'public',
        created_at: Math.floor(Date.now() / 1000)
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid JWT token');
    }
  }

  private async decodeJwt(token: string): Promise<any> {
    try {
      // In a real implementation, you would verify the JWT with JWKS
      // For now, we'll create a mock implementation
      if (token === 'valid_jwt_token') {
        return {
          sub: 'user123',
          user: {
            profiles: [
              {
                type: 'google',
                details: {
                  email: 'test@example.com',
                  name: 'Test User'
                }
              }
            ]
          }
        };
      }
      throw new Error('Invalid token');
    } catch (error) {
      throw new UnauthorizedException('Invalid JWT token');
    }
  }

  private extractUserInfo(payload: any): any {
    const user = payload.user;
    
    if (user && user.profiles && user.profiles.length > 0) {
      const profile = user.profiles[0];
      const userDetails = profile.details;
      
      let email: string;
      let name: string;
      let autoConfirmed = false;

      switch (profile.type) {
        case 'telegram':
          email = `generated_email+${userDetails.username}.telegram.${this.generateRandomHex(10)}@yourdomain.com`;
          name = `${userDetails.firstName} ${userDetails.lastName}`;
          break;
        case 'google':
          email = userDetails.email;
          name = userDetails.name;
          autoConfirmed = true;
          break;
        case 'github':
          email = `generated_email+${userDetails.username}.github.${this.generateRandomHex(10)}@yourdomain.com`;
          name = userDetails.name;
          break;
        case 'discord':
          email = userDetails.email;
          name = userDetails.username;
          break;
        case 'x':
          email = `generated_email+${userDetails.username}.x.${this.generateRandomHex(10)}@yourdomain.com`;
          name = userDetails.name;
          break;
        case 'email':
          email = userDetails.email;
          name = userDetails.email.split('@')[0];
          break;
        case 'phone':
          email = `generated_email+${userDetails.phone}.phone.${this.generateRandomHex(10)}@yourdomain.com`;
          name = 'Phone User';
          break;
        case 'passkey':
          email = `generated_email+${userDetails.id}.passkey.${this.generateRandomHex(10)}@yourdomain.com`;
          name = 'Passkey User';
          break;
        default:
          throw new Error('Unsupported profile type');
      }

      return {
        email,
        name,
        autoConfirmed,
        thirdwebMetadata: user,
        type: 'social'
      };
    } else {
      // Wallet authentication
      const address = payload.sub;
      return {
        email: `generated_email+wallet.thirdweb.${this.generateRandomHex(10)}@yourdomain.com`,
        name: 'Wallet User',
        autoConfirmed: false,
        thirdwebMetadata: {
          type: 'wallet',
          address: address
        },
        type: 'wallet'
      };
    }
  }

  private async findOrCreateUser(userInfo: any): Promise<any> {
    const { email, name, autoConfirmed, thirdwebMetadata, type } = userInfo;
    
    // Check for existing user by email or thirdweb metadata
    let existingUser = await this.userService.findByEmail(email);
    
    if (!existingUser) {
      // Create new user
      existingUser = await this.userService.create({
        name,
        email,
        password: this.generateRandomPassword(),
        thirdwebMetadata
      });

      // Auto-confirm if needed
      if (autoConfirmed) {
        await this.userService.update(existingUser.id, {
          confirmedAt: new Date()
        });
      }
    } else {
      // Update existing user if needed
      const updates: any = {};
      
      if (existingUser.thirdwebMetadata !== thirdwebMetadata) {
        updates.thirdwebMetadata = thirdwebMetadata;
      }
      
      if (!existingUser.confirmedAt && autoConfirmed) {
        updates.confirmedAt = new Date();
      }
      
      if (Object.keys(updates).length > 0) {
        await this.userService.update(existingUser.id, updates);
      }
    }

    return existingUser;
  }

  private generateRandomHex(length: number): string {
    return crypto.randomBytes(length).toString('hex');
  }

  private generateRandomPassword(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}
