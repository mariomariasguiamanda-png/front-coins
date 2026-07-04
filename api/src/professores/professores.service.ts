import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ProfessoresService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    return this.db.professores.findMany();
  }

  async findOne(id: bigint) {
    const professor = await this.db.professores.findUnique({
      where: { id_professor: id },
    });
    if (!professor) throw new NotFoundException('Professor não encontrado');
    return professor;
  }
}
