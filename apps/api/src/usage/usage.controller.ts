import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { UsageService } from './usage.service';
import { UsageType } from '@prisma/client';

class ReserveDto {
  projectId?: string;
  grantId!: string;
  usageType!: UsageType;
  workflowContext?: string;
  quantityUsed!: number;
  costAmount?: number;
  traceId!: string;
}

class ConsumeDto {
  projectId?: string;
  usageType!: UsageType;
  workflowContext?: string;
  quantityUsed!: number;
  costAmount?: number;
  traceId!: string;
}

class RollbackDto {
  usageRecordId!: string;
  reason!: string;
  traceId!: string;
}

@Controller('usage-records')
export class UsageController {
  constructor(private readonly usageService: UsageService) {}

  @Get()
  async list(
    @Query('project_id') projectId?: string,
    @Query('grant_id') grantId?: string,
    @Query('usage_type') usageType?: UsageType,
    @Query('date_from') dateFrom?: string,
    @Query('date_to') dateTo?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const result = await this.usageService.listRecords({
      projectId,
      grantId,
      usageType,
      dateFrom,
      dateTo,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
    });
    return { data: result };
  }

  @Post('reserve')
  async reserve(@Body() dto: ReserveDto) {
    const result = await this.usageService.reserve(dto);
    return { data: result };
  }

  @Post('consume')
  async consume(@Body() dto: ConsumeDto) {
    const result = await this.usageService.consume(dto);
    return { data: result };
  }

  @Post('rollback')
  async rollback(@Body() dto: RollbackDto) {
    const result = await this.usageService.rollback(dto);
    return { data: result };
  }
}
