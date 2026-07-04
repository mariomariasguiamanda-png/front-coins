import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Max, Min } from 'class-validator';

export class CorrigirAtividadeDto {
  @IsNumberString()
  id_aluno: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  nota: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  feedback?: string;
}
