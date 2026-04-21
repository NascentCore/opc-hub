import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { ScopesService } from './scopes.service';

class CreateScopeDto {
  scopeSummary!: string;
  quotedAmount?: number;
  deliveryPlan?: string;
}

@Controller('projects/:projectId/scopes')
export class ScopesController {
  constructor(private readonly scopesService: ScopesService) {}

  @Get()
  async list(@Param('projectId') projectId: string) {
    const result = await this.scopesService.findAll(projectId);
    return { data: result };
  }

  @Post()
  async create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateScopeDto,
  ) {
    const result = await this.scopesService.create(projectId, dto);
    return { data: result };
  }

  @Post(':scopeId/freeze')
  async freeze(
    @Param('projectId') projectId: string,
    @Param('scopeId') scopeId: string,
  ) {
    const result = await this.scopesService.freeze(projectId, scopeId);
    return { data: result };
  }
}
