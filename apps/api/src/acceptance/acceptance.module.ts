import { Module } from '@nestjs/common';
import { AcceptanceController } from './acceptance.controller';
import { AcceptanceService } from './acceptance.service';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [AuditLogsModule],
  controllers: [AcceptanceController],
  providers: [AcceptanceService],
})
export class AcceptanceModule {}
