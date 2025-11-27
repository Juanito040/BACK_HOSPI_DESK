import { IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class UpdateSLADTO {
  @IsNumber()
  @IsOptional()
  @Min(1)
  responseTimeMinutes?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  resolutionTimeMinutes?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
