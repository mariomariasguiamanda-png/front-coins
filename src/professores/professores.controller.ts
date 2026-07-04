/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ProfessoresService } from './professores.service';
import { JwtGuard } from '../common/guards/jwt.guard';

@Controller('professores')
@UseGuards(JwtGuard)
export class ProfessoresController {
  constructor(private readonly professoresService: ProfessoresService) {}

  @Get()
  findAll() {
    return this.professoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.professoresService.findOne(BigInt(id));
  }
}
