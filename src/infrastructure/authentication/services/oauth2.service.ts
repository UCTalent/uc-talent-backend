import { Injectable } from '@nestjs/common';

import { UserService } from '@user/services/user.service';

@Injectable()
export class OAuth2Service {
  constructor(private readonly userService: UserService) {}

  async handleOAuth2Callback(profile: any): Promise<any> {
    // Handle OAuth2 callback and create/update user
    const existingUser = await this.userService.findByEmail(profile.email);

    if (existingUser) {
      return existingUser;
    }

    // Create new user from OAuth2 profile
    return this.userService.create({
      email: profile.email,
      name: profile.name,
    });
  }
}
