import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';

class CreateAuditLogDto {
  organizationId!: string;
  memberId?: string;
  entityType!: string;
  entityId!: string;
  action!: string;
  payload?: Record<string, unknown>;
}

@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  async list(
    @Query('organization_id') organizationId?: string,
    @Query('entity_type') entityType?: string,
    @Query('action') action?: string,
    @Query('date_from') dateFrom?: string,
    @Query('date_to') dateTo?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const result = await this.auditLogsService.findAll({
      organizationId,
      entityType,
      action,
      dateFrom,
      dateTo,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
    });
    return { data: result };
  }

  @Post()
  async create(@Body() dto: CreateAuditLogDto) {
    const result = await this.auditLogsService.create(dto);
    return { data: result };
  }
}
