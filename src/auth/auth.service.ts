import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(
      { username, password },
      { _id: 1, username: 1, password: 1 }, // nothing else
    );
    if (user && user.password === password) {
      const { password, ...result } = user; // extract pw
      return result;
    }
    return null;
  }

  async login(user: any): Promise<{ access_token: string }> {
    const payload = { username: user._doc.username, _id: user._doc._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
