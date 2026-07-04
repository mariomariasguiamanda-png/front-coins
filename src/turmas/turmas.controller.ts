import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TurmasService } from './turmas.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';

@Controller('turmas')
@UseGuards(JwtGuard, RolesGuard)
export class TurmasController {
  constructor(private readonly turmasService: TurmasService) {}

  @Get()
  findAll() {
    return this.turmasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.turmasService.findOne(BigInt(id));
  }

  @Post()
  @Roles('professor', 'admin')
  create(@Body() body: CreateTurmaDto) {
    return this.turmasService.create(body);
  }

  @Patch(':id')
  @Roles('professor', 'admin')
  update(@Param('id') id: string, @Body() body: UpdateTurmaDto) {
    return this.turmasService.update(BigInt(id), body);
  }

  @Delete(':id')
  @Roles('professor', 'admin')
  remove(@Param('id') id: string) {
    return this.turmasService.remove(BigInt(id));
  }
}
