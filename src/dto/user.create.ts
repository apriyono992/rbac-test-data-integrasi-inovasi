import { IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Matches(/^[a-z][^\s]*$/, {
    message:
      'username harus camelCase, diawali huruf kecil dan hanya boleh huruf, simbol & angka tanpa spasi',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  fullName?: string;
}