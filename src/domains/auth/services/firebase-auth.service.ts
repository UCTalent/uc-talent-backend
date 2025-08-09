import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserService } from '@user/services/user.service';

import type { FirebaseAuthDto } from '../dtos/firebase-auth.dto';

@Injectable()
export class FirebaseAuthService {
  private firebaseAdmin: any;

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {
    // Initialize Firebase Admin SDK
    this.initializeFirebaseAdmin();
  }

  private initializeFirebaseAdmin() {
    try {
      // In a real implementation, you would use firebase-admin package
      // For now, we'll create a mock implementation
      this.firebaseAdmin = {
        auth: {
          verifyIdToken: async (token: string) => {
            // Mock implementation - in real app, this would verify with Firebase
            if (token === 'valid_firebase_token') {
              return {
                uid: 'user123',
                email: 'test@example.com',
                name: 'Test User',
                firebase: { sign_in_provider: 'google.com' },
              };
            }
            throw new Error('Invalid token');
          },
          getUser: async (uid: string) => {
            // Mock implementation
            return {
              uid,
              email: 'test@example.com',
              displayName: 'Test User',
              providerData: [
                {
                  email: 'test@example.com',
                  displayName: 'Test User',
                },
              ],
            };
          },
        },
      };
    } catch (error) {
      console.error('Failed to initialize Firebase Admin SDK:', error);
    }
  }

  async authenticate(firebaseAuthDto: FirebaseAuthDto) {
    const { firebase_token } = firebaseAuthDto;

    try {
      // Verify Firebase token
      const decodedToken =
        await this.firebaseAdmin.auth.verifyIdToken(firebase_token);

      // Extract user data
      const userData = await this.extractUserData(decodedToken);

      // Find or create user
      const user = await this.findOrCreateUser(userData);

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        user_id: user.id,
        token_type: 'Bearer',
        access_token: 'mock_access_token', // In real app, generate OAuth token
        expires_in: 7200,
        created_at: Math.floor(Date.now() / 1000),
        refresh_token: 'mock_refresh_token',
        has_profile: await this.userService.hasTalentProfile(user.id),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }

  private async extractUserData(decodedToken: any) {
    const user = await this.firebaseAdmin.auth.getUser(decodedToken.uid);

    let identifier: string;
    let name: string;

    if (decodedToken.email) {
      identifier = decodedToken.email;
      name = decodedToken.name || user.displayName || 'Firebase User';
    } else if (user.providerData?.[0]?.email) {
      identifier = user.providerData[0].email;
      name = user.providerData[0].displayName || 'Firebase User';
    } else if (this.isValidEmail(user.displayName)) {
      identifier = user.displayName;
      name = user.displayName;
    } else {
      identifier = `${user.displayName}@yourdomain.com`;
      name = user.displayName || 'Firebase User';
    }

    return {
      identifier,
      uid: decodedToken.uid,
      name,
      firebase_provider: decodedToken.firebase?.sign_in_provider || 'firebase',
    };
  }

  private async findOrCreateUser(userData: any) {
    // Check for existing user by email or Firebase UID
    let existingUser = await this.userService.findByEmail(userData.identifier);

    if (!existingUser) {
      // Create new user
      existingUser = await this.userService.create({
        name: userData.name,
        email: userData.identifier,
        firebaseUid: userData.uid,
        firebaseProvider: userData.firebase_provider,
        password: this.generateRandomPassword(),
      });

      // Auto-confirm Firebase users
      await this.userService.update(existingUser.id, {
        confirmedAt: new Date(),
      });
    } else {
      // Update existing user if needed
      if (!existingUser.confirmedAt) {
        await this.userService.update(existingUser.id, {
          confirmedAt: new Date(),
        });
      }
    }

    return existingUser;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private generateRandomPassword(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}
