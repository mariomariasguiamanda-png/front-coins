import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditLogService } from '../common/services/audit-log.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('admin/logs')
@UseGuards(JwtGuard, RolesGuard)
@Roles('admin')
export class LogsController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  findAll(@Query('usuario') usuarioId?: string) {
    return this.auditLogService.findAll(usuarioId ? BigInt(usuarioId) : undefined);
  }
}
