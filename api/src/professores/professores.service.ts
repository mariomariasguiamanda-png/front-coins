import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ProfessoresService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    const professores = await this.db.professores.findMany({
      include: {
        usuarios: { select: { nome: true, email: true } },
        professor_disciplina: { select: { id_disciplina: true } },
      },
    });
    return professores.map((p) => ({
      id_professor: Number(p.id_professor),
      nome: p.usuarios.nome,
      email: p.usuarios.email,
      especialidade: p.especialidade,
      disciplinas: p.professor_disciplina.map((v) => Number(v.id_disciplina)),
    }));
  }

  async findOne(id: bigint) {
    const professor = await this.db.professores.findUnique({
      where: { id_professor: id },
    });
    if (!professor) throw new NotFoundException('Professor não encontrado');
    return professor;
  }
}
