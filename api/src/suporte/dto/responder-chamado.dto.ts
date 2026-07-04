import { IsNotEmpty, IsString } from 'class-validator';

export class ResponderChamadoDto {
  @IsString()
  @IsNotEmpty()
  resposta: string;
}
