import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
  ) {
  }
  async login(user: User, role: Role) {
    const payload = {
      sub: user.id,
      username: user.username,
      role: role.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
