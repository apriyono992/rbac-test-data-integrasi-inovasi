import { IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Matches(/^[a-z][^\s]*$/, {
    message:
      'username harus camelCase, diawali huruf kecil dan hanya boleh huruf, simbol & angka tanpa spasi',
  })
  username?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  fullName?: string;
}