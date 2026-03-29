import { IsOptional, IsNumber, IsString, IsNotEmpty, Matches } from 'class-validator';

export class UpdateMenuDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama menu tidak boleh kosong' })
  name: string;

  @IsString()
  @IsOptional()
  @Matches(/^\//, { message: 'Path harus diawali dengan slash (/)' })
  path?: string;

  @IsOptional()
  @IsNumber()
  parentId?: number | null;
}