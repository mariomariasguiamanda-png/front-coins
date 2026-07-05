import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateQuestaoDto {
  @IsIn(['vf', 'multipla', 'descritiva'])
  tipo: 'vf' | 'multipla' | 'descritiva';

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

  @IsOptional()
  @IsInt()
  @Min(1)
  peso?: number;
}
