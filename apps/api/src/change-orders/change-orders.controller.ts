import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ChangeOrdersService } from './change-orders.service';

class CreateChangeOrderDto {
  scopeVersionId?: string;
  title!: string;
  changeType!: string;
  amountDelta?: number;
  description?: string;
}

class UpdateChangeOrderDto {
  title?: string;
  changeType?: string;
  amountDelta?: number;
  description?: string;
  status?: string;
}

@Controller('projects/:projectId/change-orders')
export class ChangeOrdersController {
  constructor(private readonly changeOrdersService: ChangeOrdersService) {}

  @Get()
  async list(
    @Param('projectId') projectId: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const result = await this.changeOrdersService.findAll(
      projectId,
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20,
    );
    return { data: result };
  }

  @Post()
  async create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateChangeOrderDto,
  ) {
    const result = await this.changeOrdersService.create(projectId, dto);
    return { data: result };
  }

  @Patch(':changeOrderId')
  async update(
    @Param('projectId') projectId: string,
    @Param('changeOrderId') changeOrderId: string,
    @Body() dto: UpdateChangeOrderDto,
  ) {
    const result = await this.changeOrdersService.update(
      projectId,
      changeOrderId,
      dto,
    );
    return { data: result };
  }
}
