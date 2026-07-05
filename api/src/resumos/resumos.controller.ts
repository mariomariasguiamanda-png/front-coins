import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ResumosService } from './resumos.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user';
import { CreateResumoDto } from './dto/create-resumo.dto';
import { UpdateResumoDto } from './dto/update-resumo.dto';

const EXTENSOES_PERMITIDAS = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.zip'];

@Controller()
@UseGuards(JwtGuard, RolesGuard)
export class ResumosController {
  constructor(private readonly resumosService: ResumosService) {}

  @Get('aluno/resumos')
  @Roles('aluno')
  findByAluno(@CurrentUser() user: AuthUser, @Query('disciplina') disciplinaId?: string) {
    return this.resumosService.findByAluno(
      user.id_aluno as number,
      disciplinaId ? BigInt(disciplinaId) : undefined,
    );
  }

  @Get('aluno/resumos/:id')
  @Roles('aluno')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.resumosService.findOne(BigInt(id), user.id_aluno as number);
  }

  @Post('aluno/resumos/:id/concluir')
  @Roles('aluno')
  concluir(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.resumosService.concluir(BigInt(id), user.id_aluno as number);
  }

  @Get('professor/resumos')
  @Roles('professor')
  findByProfessor(@CurrentUser() user: AuthUser) {
    return this.resumosService.findByProfessor(user.id_professor as number);
  }

  @Post('professor/resumos')
  @Roles('professor')
  create(@Body() body: CreateResumoDto, @CurrentUser() user: AuthUser) {
    return this.resumosService.create(body, user);
  }

  @Patch('professor/resumos/:id')
  @Roles('professor')
  update(
    @Param('id') id: string,
    @Body() body: UpdateResumoDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.resumosService.update(BigInt(id), body, user);
  }

  @Delete('professor/resumos/:id')
  @Roles('professor')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.resumosService.remove(BigInt(id), user);
  }

  @Post('professor/resumos/:id/anexos')
  @Roles('professor')
  @UseInterceptors(
    FilesInterceptor('anexos', 5, {
      storage: diskStorage({
        destination: './uploads/resumos',
        filename: (_req, file, callback) => {
          const ext = extname(file.originalname).toLowerCase();
          callback(null, `resumo-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, callback) => {
        const ext = extname(file.originalname).toLowerCase();
        if (!EXTENSOES_PERMITIDAS.includes(ext)) {
          callback(new BadRequestException('Formato de arquivo não suportado'), false);
          return;
        }
        callback(null, true);
      },
    }),
  )
  adicionarAnexos(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: AuthUser,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }
    const caminhos = files.map((f) => `/uploads/resumos/${f.filename}`);
    return this.resumosService.adicionarAnexos(BigInt(id), user, caminhos);
  }

  @Delete('professor/resumos/:id/anexos')
  @Roles('professor')
  removerAnexo(
    @Param('id') id: string,
    @Body('caminho') caminho: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.resumosService.removerAnexo(BigInt(id), user, caminho);
  }
}
