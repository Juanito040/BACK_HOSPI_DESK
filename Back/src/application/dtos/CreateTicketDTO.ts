import { IsString, IsNotEmpty, IsEnum, IsOptional, IsUUID, MinLength } from 'class-validator';
import { PriorityLevel } from '../../domain/value-objects/Priority';

export class CreateTicketDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres' })
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'La descripción debe tener al menos 5 caracteres' })
  description!: string;

  @IsEnum(PriorityLevel)
  priority!: PriorityLevel;

  @IsUUID('all')
  @IsOptional()
  areaId?: string;

  @IsUUID('all')
  @IsOptional()
  requesterId?: string;

  @IsUUID('all')
  @IsOptional()
  assignedToId?: string;
}
