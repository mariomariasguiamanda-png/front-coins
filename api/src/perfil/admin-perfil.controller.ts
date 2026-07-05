import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PerfilService } from './perfil.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { AlterarSenhaDto } from './dto/alterar-senha.dto';

const EXTENSOES_PERMITIDAS = ['.jpg', '.jpeg', '.png', '.webp'];

@Controller('adm/perfil')
@UseGuards(JwtGuard, RolesGuard)
@Roles('admin')
export class AdminPerfilController {
  constructor(private readonly perfilService: PerfilService) {}

  @Get()
  getPerfil(@CurrentUser() user: AuthUser) {
    return this.perfilService.getPerfilAdmin(user.sub);
  }

  @Patch()
  updatePerfil(@CurrentUser() user: AuthUser, @Body() body: UpdatePerfilDto) {
    return this.perfilService.updatePerfilAdmin(user.sub, body);
  }

  @Patch('senha')
  alterarSenha(@CurrentUser() user: AuthUser, @Body() body: AlterarSenhaDto) {
    return this.perfilService.alterarSenha(user.sub, body);
  }

  @Post('foto')
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, callback) => {
          const user = (req as unknown as { user: AuthUser }).user;
          const ext = extname(file.originalname).toLowerCase();
          callback(null, `admin-${user.sub}-${Date.now()}${ext}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, callback) => {
        const ext = extname(file.originalname).toLowerCase();
        if (!EXTENSOES_PERMITIDAS.includes(ext)) {
          callback(new BadRequestException('Formato de imagem não suportado'), false);
          return;
        }
        callback(null, true);
      },
    }),
  )
  async uploadFoto(
    @CurrentUser() user: AuthUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Nenhum arquivo enviado');
    const fotoUrl = `/uploads/avatars/${file.filename}`;
    return this.perfilService.updateFotoAdmin(user.sub, fotoUrl);
  }
}
