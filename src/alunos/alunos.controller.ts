/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AlunosService } from './alunos.service';
import { JwtGuard } from '../common/guards/jwt.guard';

@Controller('alunos')
@UseGuards(JwtGuard)
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
