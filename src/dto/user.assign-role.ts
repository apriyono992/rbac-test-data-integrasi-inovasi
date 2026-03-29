import { IsArray, IsUUID, ArrayNotEmpty } from 'class-validator';

export class AssignRoleDto {
  @IsUUID()
  userId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  roleIds: string[];
}