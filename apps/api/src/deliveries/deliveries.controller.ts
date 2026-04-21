import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';

class CreateDeliveryDto {
  versionNo!: string;
  title!: string;
  summary?: string;
  artifactUrl?: string;
  releaseProofUrl?: string;
  createdBy!: string;
}

@Controller('projects/:projectId/deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Get()
  async list(
    @Param('projectId') projectId: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const result = await this.deliveriesService.findAll(
      projectId,
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20,
    );
    return { data: result };
  }

  @Post()
  async create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateDeliveryDto,
  ) {
    const result = await this.deliveriesService.create(projectId, dto);
    return { data: result };
  }

  @Get(':deliveryId')
  async detail(
    @Param('projectId') projectId: string,
    @Param('deliveryId') deliveryId: string,
  ) {
    const result = await this.deliveriesService.findOne(projectId, deliveryId);
    return { data: result };
  }

  @Post(':deliveryId/submit')
  async submit(
    @Param('projectId') projectId: string,
    @Param('deliveryId') deliveryId: string,
  ) {
    const result = await this.deliveriesService.submit(projectId, deliveryId);
    return { data: result };
  }
}
