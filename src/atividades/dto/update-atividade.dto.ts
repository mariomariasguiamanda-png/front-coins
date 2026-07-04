import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateAtividadeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  titulo?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  recompensa_moedas?: number;

  @IsOptional()
  @IsIn(['exercicio', 'trabalho', 'prova'])
  tipo?: string;

  @IsOptional()
  @IsString()
  data_vencimento?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
