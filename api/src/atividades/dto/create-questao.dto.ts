import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateQuestaoDto {
  @IsIn(['vf', 'multipla'])
  tipo: 'vf' | 'multipla';

  @IsString()
  @IsNotEmpty()
  enunciado: string;

  @ValidateIf((dto: CreateQuestaoDto) => dto.tipo === 'vf')
  @IsBoolean()
  correta?: boolean;

  @ValidateIf((dto: CreateQuestaoDto) => dto.tipo === 'multipla')
  @IsString()
  @IsNotEmpty()
  alternativa_a?: string;

  @ValidateIf((dto: CreateQuestaoDto) => dto.tipo === 'multipla')
  @IsString()
  @IsNotEmpty()
  alternativa_b?: string;

  @IsOptional()
  @IsString()
  alternativa_c?: string;

  @IsOptional()
  @IsString()
  alternativa_d?: string;

  @ValidateIf((dto: CreateQuestaoDto) => dto.tipo === 'multipla')
  @IsIn(['A', 'B', 'C', 'D'])
  letra_correta?: string;

  @IsOptional()
  @IsInt()
  ordem?: number;
}
