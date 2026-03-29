import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';

@Controller('auth')
export class AuthController {

  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    this.logger.log("masuk")
    const user = await this.usersService.findByUsername(body.username);
    this.logger.log(user)
    if (!user) return { message: 'Invalid credentials' };

    const valid = await bcrypt.compare(body.password, user.password);
    if (!valid) return { message: 'Invalid credentials' };

    if (user.roles.length === 1) {
      return this.authService.login(user, user.roles[0]);
    } else {
      return {
        message: 'Select role',
        roles: user.roles.map(r => ({ id: r.id, name: r.name })),
        userId: user.id,
      };
    }
  }

  @Post('select-role')
  async selectRole(@Body() body: { userId: string; roleId: string }) {
    const user = await this.usersService.findOne(body.userId);
    if (!user) return { message: 'User not found' };

    const role = user.roles.find(r => r.id === body.roleId);
    if (!role) return { message: 'Invalid role selection' };

    return this.authService.login(user, role);
  }
}
