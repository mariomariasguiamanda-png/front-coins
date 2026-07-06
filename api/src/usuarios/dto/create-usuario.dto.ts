import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';
import type { TipoUsuario } from '../../common/decorators/roles.decorator';

export class CreateUsuarioDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  senha?: string;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsIn(['aluno', 'professor', 'admin'])
  tipo_usuario: TipoUsuario;

  @IsOptional()
  @IsString()
  telefone?: string;



  @IsOptional()
  @IsString()
  especialidade?: string;
}
