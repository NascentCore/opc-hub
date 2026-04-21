import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';

class CreateProjectDto {
  organizationId!: string;
  clientId!: string;
  name!: string;
  industryPack!: string;
  status?: string;
  budgetAmount?: number;
  startDate?: string;
  dueDate?: string;
  repoBindingId?: string;
  createdBy!: string;
}

class UpdateProjectDto {
  name?: string;
  clientId?: string;
  industryPack?: string;
  status?: string;
  budgetAmount?: number;
  startDate?: string;
  dueDate?: string;
  repoBindingId?: string;
}

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async list(
    @Query('status') status?: string,
    @Query('client_id') clientId?: string,
    @Query('industry_pack') industryPack?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const result = await this.projectsService.findAll(
      { status, clientId, industryPack },
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20,
    );
    return { data: result };
  }

  @Post()
  async create(@Body() dto: CreateProjectDto) {
    const result = await this.projectsService.create(dto);
    return { data: result };
  }

  @Get(':projectId')
  async detail(@Param('projectId') projectId: string) {
    const result = await this.projectsService.findOne(projectId);
    return { data: result };
  }

  @Patch(':projectId')
  async update(
    @Param('projectId') projectId: string,
    @Body() dto: UpdateProjectDto,
  ) {
    const result = await this.projectsService.update(projectId, dto);
    return { data: result };
  }
}
