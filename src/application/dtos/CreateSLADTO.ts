import { IsNotEmpty, IsEnum, IsNumber, IsUUID, Min } from 'class-validator';
import { PriorityLevel } from '../../domain/value-objects/Priority';

export class CreateSLADTO {
  @IsUUID('all')
  @IsNotEmpty()
  areaId!: string;

  @IsEnum(PriorityLevel)
  priority!: PriorityLevel;

  @IsNumber()
  @Min(1)
  responseTimeMinutes!: number;

  @IsNumber()
  @Min(1)
  resolutionTimeMinutes!: number;
}
