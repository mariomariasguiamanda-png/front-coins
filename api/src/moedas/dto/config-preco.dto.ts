import { IsInt, IsNumberString, IsOptional, Max, Min } from 'class-validator';

export class ConfigPrecoDto {
  @IsNumberString()
  id_disciplina: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  pontos_por_compra_max?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  preco_moedas_por_ponto?: number;
}
