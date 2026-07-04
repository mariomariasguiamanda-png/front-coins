import { IsIn } from 'class-validator';

export class UpdateStatusChamadoDto {
  @IsIn(['aberto', 'respondido', 'fechado'])
  status: string;
}
