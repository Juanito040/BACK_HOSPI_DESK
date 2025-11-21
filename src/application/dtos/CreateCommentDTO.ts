import { IsString, IsNotEmpty, IsBoolean, IsUUID, MinLength } from 'class-validator';

export class CreateCommentDTO {
  @IsUUID()
  @IsNotEmpty()
  ticketId!: string;

  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  content!: string;

  @IsBoolean()
  isInternal!: boolean;
}
