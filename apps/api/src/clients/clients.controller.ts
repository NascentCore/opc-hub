import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ClientsService } from './clients.service';

class CreateClientDto {
  organizationId!: string;
  name!: string;
  contactName?: string;
  contactEmail?: string;
  status?: string;
  notes?: string;
}

class UpdateClientDto {
  name?: string;
  contactName?: string;
  contactEmail?: string;
  status?: string;
  notes?: string;
}

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  async list(
    @Query('name') name?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const result = await this.clientsService.findAll(
      name,
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20,
    );
    return { data: result };
  }

  @Post()
  async create(@Body() dto: CreateClientDto) {
    const result = await this.clientsService.create(dto);
    return { data: result };
  }

  @Get(':clientId')
  async detail(@Param('clientId') clientId: string) {
    const result = await this.clientsService.findOne(clientId);
    return { data: result };
  }

  @Patch(':clientId')
  async update(
    @Param('clientId') clientId: string,
    @Body() dto: UpdateClientDto,
  ) {
    const result = await this.clientsService.update(clientId, dto);
    return { data: result };
  }
}
