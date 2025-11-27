import { IsString, IsOptional, IsBoolean, MinLength } from 'class-validator';

export class UpdateAreaDTO {
  @IsString()
  @IsOptional()
  @MinLength(3)
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
