import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  create(@Body() createAuthDto: any) {
    return this.authService.create(createAuthDto);
  }

  @Post('select-role')
  findAll() {
    return this.authService.findAll();
  }

  @Get('logout')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }
}
