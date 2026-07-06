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
import { SuporteService } from './suporte.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user';
import { CreateChamadoDto } from './dto/create-chamado.dto';
import { ResponderChamadoDto } from './dto/responder-chamado.dto';
import { UpdateStatusChamadoDto } from './dto/update-status-chamado.dto';

const EXTENSOES_PERMITIDAS = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];

@Controller()
@UseGuards(JwtGuard, RolesGuard)
export class SuporteController {
  constructor(private readonly suporteService: SuporteService) {}

  @Post('suporte/chamados')
  @Roles('aluno', 'professor', 'admin')
  @UseInterceptors(
    FilesInterceptor('anexos', 5, {
      storage: diskStorage({
        destination: './uploads/suporte-anexos',
        filename: (req, file, callback) => {
          const user = (req as unknown as { user: AuthUser }).user;
          const ext = extname(file.originalname).toLowerCase();
          callback(null, `chamado-${user.sub}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, callback) => {
        const ext = extname(file.originalname).toLowerCase();
        if (!EXTENSOES_PERMITIDAS.includes(ext)) {
          callback(new BadRequestException('Formato de anexo não suportado'), false);
          return;
        }
        callback(null, true);
      },
    }),
  )
  criarChamado(
    @CurrentUser() user: AuthUser,
    @Body() body: CreateChamadoDto,
    @UploadedFiles() files: Express.Multer.File[] = [],
  ) {
    const anexos = files.map((f) => `/uploads/suporte-anexos/${f.filename}`);
    return this.suporteService.criarChamado(user.sub, body, anexos);
  }

  @Get('suporte/chamados')
  @Roles('aluno', 'professor', 'admin')
  meusChamados(@CurrentUser() user: AuthUser) {
    return this.suporteService.findMeusChamados(user.sub);
  }

  @Get('admin/suporte/chamados')
  @Roles('admin')
  findAll(@Query('status') status?: string) {
    return this.suporteService.findAll(status);
  }

  @Patch('admin/suporte/chamados/:id/responder')
  @Roles('admin')
  responder(@Param('id') id: string, @Body() body: ResponderChamadoDto) {
    return this.suporteService.responder(BigInt(id), body);
  }

  @Patch('admin/suporte/chamados/:id/status')
  @Roles('admin')
  atualizarStatus(@Param('id') id: string, @Body() body: UpdateStatusChamadoDto) {
    return this.suporteService.atualizarStatus(BigInt(id), body);
  }

  // ===== FAQs =====
  // Leitura liberada pra qualquer usuário logado (a Ajuda do aluno pode
  // consumir); escrita só admin.

  @Get('faqs')
  @Roles('aluno', 'professor', 'admin')
  listarFaqs() {
    return this.suporteService.listarFaqs();
  }

  @Post('admin/faqs/categorias')
  @Roles('admin')
  criarFaqCategoria(@Body('nome') nome: string) {
    if (!nome?.trim()) throw new BadRequestException('nome é obrigatório');
    return this.suporteService.criarFaqCategoria(nome.trim());
  }

  @Patch('admin/faqs/categorias/:id')
  @Roles('admin')
  renomearFaqCategoria(@Param('id') id: string, @Body('nome') nome: string) {
    if (!nome?.trim()) throw new BadRequestException('nome é obrigatório');
    return this.suporteService.renomearFaqCategoria(BigInt(id), nome.trim());
  }

  @Delete('admin/faqs/categorias/:id')
  @Roles('admin')
  excluirFaqCategoria(@Param('id') id: string) {
    return this.suporteService.excluirFaqCategoria(BigInt(id));
  }

  @Post('admin/faqs/categorias/:id/perguntas')
  @Roles('admin')
  criarFaq(
    @Param('id') id: string,
    @Body() body: { pergunta?: string; resposta?: string },
  ) {
    if (!body?.pergunta?.trim() || !body?.resposta?.trim()) {
      throw new BadRequestException('pergunta e resposta são obrigatórias');
    }
    return this.suporteService.criarFaq(BigInt(id), body.pergunta.trim(), body.resposta.trim());
  }

  @Patch('admin/faqs/:id')
  @Roles('admin')
  atualizarFaq(@Param('id') id: string, @Body() body: { pergunta?: string; resposta?: string }) {
    if (!body?.pergunta?.trim() || !body?.resposta?.trim()) {
      throw new BadRequestException('pergunta e resposta são obrigatórias');
    }
    return this.suporteService.atualizarFaq(BigInt(id), body.pergunta.trim(), body.resposta.trim());
  }

  @Delete('admin/faqs/:id')
  @Roles('admin')
  excluirFaq(@Param('id') id: string) {
    return this.suporteService.excluirFaq(BigInt(id));
  }

  // ===== Respostas padrão =====

  @Get('admin/suporte/respostas-padrao')
  @Roles('admin')
  listarRespostasPadrao() {
    return this.suporteService.listarRespostasPadrao();
  }

  @Post('admin/suporte/respostas-padrao')
  @Roles('admin')
  criarRespostaPadrao(
    @Body() body: { categoria?: string; titulo?: string; texto?: string; tags?: string[] },
  ) {
    if (!body?.categoria?.trim() || !body?.titulo?.trim() || !body?.texto?.trim()) {
      throw new BadRequestException('categoria, titulo e texto são obrigatórios');
    }
    return this.suporteService.criarRespostaPadrao({
      categoria: body.categoria.trim(),
      titulo: body.titulo.trim(),
      texto: body.texto.trim(),
      tags: body.tags,
    });
  }

  @Patch('admin/suporte/respostas-padrao/:id')
  @Roles('admin')
  atualizarRespostaPadrao(
    @Param('id') id: string,
    @Body() body: { categoria?: string; titulo?: string; texto?: string; tags?: string[] },
  ) {
    return this.suporteService.atualizarRespostaPadrao(BigInt(id), body);
  }

  @Delete('admin/suporte/respostas-padrao/:id')
  @Roles('admin')
  excluirRespostaPadrao(@Param('id') id: string) {
    return this.suporteService.excluirRespostaPadrao(BigInt(id));
  }
}
