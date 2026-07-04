/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ProfessoresService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    return this.db.professores.findMany();
  }

  async findOne(id: bigint) {
    return this.db.professores.findUnique({ where: { id_professor: id } });
  }
}
