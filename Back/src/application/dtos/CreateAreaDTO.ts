import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateAreaDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;
}
