import { IsString, IsNotEmpty, IsEnum, IsOptional, IsUUID, MinLength } from 'class-validator';
import { PriorityLevel } from '../../domain/value-objects/Priority';

export class CreateTicketDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description!: string;

  @IsEnum(PriorityLevel)
  priority!: PriorityLevel;

  @IsUUID('all')
  @IsNotEmpty()
  areaId!: string;

  @IsUUID('all')
  @IsNotEmpty()
  requesterId!: string;

  @IsUUID('all')
  @IsOptional()
  assignedToId?: string;
}
