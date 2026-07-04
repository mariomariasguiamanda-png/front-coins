import {
  BadRequestException,
  Body,
  Controller,
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
}
