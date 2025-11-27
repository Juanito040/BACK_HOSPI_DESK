import { IsString, IsNotEmpty, IsEmail, IsEnum, IsOptional, MinLength, IsBoolean } from 'class-validator';
import { UserRole } from '../../domain/entities/User';

export class UpdateUserDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsString()
  @IsOptional()
  areaId?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;
}
