import { IsString, IsOptional, IsEnum, MinLength } from 'class-validator';
import { PriorityLevel } from '../../domain/value-objects/Priority';
import { TicketStatus } from '../../domain/value-objects/Status';

export class UpdateTicketDTO {
  @IsString()
  @IsOptional()
  @MinLength(5)
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  description?: string;

  @IsEnum(PriorityLevel)
  @IsOptional()
  priority?: PriorityLevel;

  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;
}
