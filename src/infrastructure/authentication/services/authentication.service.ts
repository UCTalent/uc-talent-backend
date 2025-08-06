import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@user/services/user.service';
import { User } from '@user/entities/user.entity';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && await this.userService.verifyPassword(user, password)) {
      const { encryptedPassword, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async validateFirebaseToken(firebaseUid: string): Promise<User | null> {
    return this.userService.findByFirebaseUid(firebaseUid);
  }

  async createUserFromFirebase(firebaseUid: string, userData: any): Promise<User> {
    return this.userService.create({
      email: userData.email,
      name: userData.name,
      firebaseUid,
      firebaseProvider: userData.provider,
    });
  }
} 