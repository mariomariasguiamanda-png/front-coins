import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UpdateStatusUsuarioDto } from './dto/update-status-usuario.dto';

@Controller('admin/usuarios')
@UseGuards(JwtGuard, RolesGuard)
@Roles('admin')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  findAll(@Query('tipo') tipo?: string, @Query('status') status?: string) {
    return this.usuariosService.findAll(tipo, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(BigInt(id));
  }

  @Post()
  create(@Body() body: CreateUsuarioDto) {
    return this.usuariosService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateUsuarioDto) {
    return this.usuariosService.update(BigInt(id), body);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: UpdateStatusUsuarioDto) {
    return this.usuariosService.updateStatus(BigInt(id), body);
  }
}
