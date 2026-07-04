import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateQuestaoDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  enunciado?: string;

  @IsOptional()
  @IsBoolean()
  correta?: boolean;

  @IsOptional()
  @IsString()
  alternativa_a?: string;

  @IsOptional()
  @IsString()
  alternativa_b?: string;

  @IsOptional()
  @IsString()
  alternativa_c?: string;

  @IsOptional()
  @IsString()
  alternativa_d?: string;

  @IsOptional()
  @IsIn(['A', 'B', 'C', 'D'])
  letra_correta?: string;

  @IsOptional()
  @IsInt()
  ordem?: number;
}
