/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TurmasService } from './turmas.service';
import { JwtGuard } from '../common/guards/jwt.guard';

@Controller('turmas')
@UseGuards(JwtGuard)
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
}
