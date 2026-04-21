import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { AcceptanceService } from './acceptance.service';

class CreateAcceptanceRecordDto {
  deliveryPackageId!: string;
  decision!: string;
  comment?: string;
  clientMemberId?: string;
}

@Controller('projects/:projectId/acceptance-records')
export class AcceptanceController {
  constructor(private readonly acceptanceService: AcceptanceService) {}

  @Get()
  async list(
    @Param('projectId') projectId: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const result = await this.acceptanceService.findAll(
      projectId,
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20,
    );
    return { data: result };
  }

  @Post()
  async create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateAcceptanceRecordDto,
  ) {
    const result = await this.acceptanceService.create(projectId, dto);
    return { data: result };
  }
}
