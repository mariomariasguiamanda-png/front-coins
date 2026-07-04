import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class ProfessorDisciplinaService {
  constructor(private db: DatabaseService) {}

  async verificar(id_professor: number, id_disciplina: bigint) {
    const vinculo = await this.db.professor_disciplina.findUnique({
      where: { id_professor_id_disciplina: { id_professor, id_disciplina } },
    });
    if (!vinculo) {
      throw new ForbiddenException('Você não leciona essa disciplina');
    }
  }
}
