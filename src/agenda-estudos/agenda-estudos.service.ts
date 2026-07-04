import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateAgendaEventoDto } from './dto/create-agenda-evento.dto';

@Injectable()
export class AgendaEstudosService {
  constructor(private db: DatabaseService) {}

  async findByAluno(id_aluno: number) {
    return this.db.agenda_estudos.findMany({
      where: { id_aluno },
      orderBy: { data_estudo: 'asc' },
    });
  }

  async criar(id_aluno: number, dto: CreateAgendaEventoDto) {
    return this.db.agenda_estudos.create({
      data: {
        id_aluno,
        titulo: dto.titulo,
        data_estudo: new Date(dto.data_estudo),
        assunto: dto.assunto,
        tipo: dto.tipo,
        link_type: dto.link_type,
        disciplina_id: dto.disciplina_id ? BigInt(dto.disciplina_id) : undefined,
        item_id: dto.item_id ? BigInt(dto.item_id) : undefined,
      },
    });
  }

  async concluir(id_evento: bigint, id_aluno: number) {
    const evento = await this.db.agenda_estudos.findUnique({ where: { id_evento } });
    if (!evento) throw new NotFoundException('Evento não encontrado');
    if (Number(evento.id_aluno) !== id_aluno) {
      throw new ForbiddenException('Este evento não pertence ao aluno logado');
    }

    return this.db.agenda_estudos.update({
      where: { id_evento },
      data: { concluido: true },
    });
  }
}
