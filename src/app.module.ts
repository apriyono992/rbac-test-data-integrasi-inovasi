import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth.controller';
import { MenusController } from './controllers/menus.controller';
import { RolesController } from './controllers/roles.controller';
import { UsersController } from './controllers/users.controller';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { DatabaseConfig } from './configs/database.config';
import { EnvironmentConfig } from './configs/environment.config';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Menu } from './entities/menu.entity';
import { MenusService } from './services/menus.service';
import { RolesService } from './services/roles.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    DatabaseConfig,
    EnvironmentConfig,
    TypeOrmModule.forFeature([
      User,
      Role,
      Menu
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>('JWT_EXPIRES') || '1d'
        },
      }),
    })],
  controllers: [AppController,AuthController,MenusController,RolesController,UsersController],
  providers: [AppService,AuthService,MenusService,RolesService,UsersService,JwtStrategy],
})
export class AppModule {}
