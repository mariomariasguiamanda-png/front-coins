import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AlunosService } from './alunos.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('alunos')
@UseGuards(JwtGuard, RolesGuard)
@Roles('professor', 'admin')
export class AlunosController {
  constructor(private readonly alunosService: AlunosService) {}

  @Get()
  findAll() {
    return this.alunosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alunosService.findOne(BigInt(id));
  }
}
