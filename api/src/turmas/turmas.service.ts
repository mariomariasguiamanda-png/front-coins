import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';

@Injectable()
export class TurmasService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    return this.db.turmas.findMany({
      where: { ativo: true },
      include: { _count: { select: { alunos: true } } },
    });
  }

  async findOne(id: bigint) {
    const turma = await this.db.turmas.findUnique({
      where: { id_turma: id },
      include: { _count: { select: { alunos: true } } },
    });
    if (!turma) throw new NotFoundException('Turma não encontrada');
    return turma;
  }

  async create(dto: CreateTurmaDto) {
    return this.db.turmas.create({ data: dto });
  }

  async update(id: bigint, dto: UpdateTurmaDto) {
    await this.findOne(id);
    return this.db.turmas.update({ where: { id_turma: id }, data: dto });
  }

  async remove(id: bigint) {
    await this.findOne(id);
    return this.db.turmas.update({ where: { id_turma: id }, data: { ativo: false } });
  }
}
