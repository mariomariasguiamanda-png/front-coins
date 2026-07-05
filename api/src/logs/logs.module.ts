import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LogsController } from './logs.controller';
import { DatabaseModule } from '../database/database.module';
import { AuditLogService } from '../common/services/audit-log.service';
import { AuditLogInterceptor } from '../common/interceptors/audit-log.interceptor';

@Module({
  imports: [DatabaseModule],
  controllers: [LogsController],
  providers: [
    AuditLogService,
    { provide: APP_INTERCEPTOR, useClass: AuditLogInterceptor },
  ],
})
export class LogsModule {}
