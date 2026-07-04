import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';
import type { TipoUsuario } from '../../common/decorators/roles.decorator';

export class CreateUsuarioDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  senha: string;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsIn(['aluno', 'professor', 'admin'])
  tipo_usuario: TipoUsuario;

  @IsOptional()
  @IsString()
  telefone?: string;

  @ValidateIf((dto: CreateUsuarioDto) => dto.tipo_usuario === 'aluno')
  @IsString()
  @IsNotEmpty()
  matricula?: string;

  @IsOptional()
  @IsString()
  especialidade?: string;
}
