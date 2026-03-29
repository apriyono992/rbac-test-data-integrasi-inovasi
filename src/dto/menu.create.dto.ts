import { IsString, IsNotEmpty, IsOptional, IsNumber, Matches } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama menu tidak boleh kosong' })
  name: string;

  @IsString()
  @IsOptional()
  @Matches(/^\//, { message: 'Path harus diawali dengan slash (/)' })
  path?: string;

  @IsNumber()
  @IsOptional()
  parentId?: number;
}