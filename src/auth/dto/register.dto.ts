import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import type { TipoUsuario } from '../../common/decorators/roles.decorator';

export class RegisterDto {
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

  // obrigatório quando tipo_usuario === 'aluno'
  @ValidateIf((dto: RegisterDto) => dto.tipo_usuario === 'aluno')
  @IsString()
  @IsNotEmpty()
  matricula?: string;

  @IsOptional()
  @IsString()
  especialidade?: string;
}
