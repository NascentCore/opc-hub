import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { EntitlementsService } from './entitlements.service';
import { GrantStatus, GrantType } from '@prisma/client';

class CreateGrantDto {
  grantType!: GrantType;
  grantName!: string;
  sourceType!: 'park_grant' | 'promo' | 'purchase' | 'manual_adjustment';
  quantityTotal!: number;
  quantityAvailable!: number;
  priority?: number;
  expiresAt?: string;
}

class BatchGrantsDto {
  grants!: CreateGrantDto[];
}

@Controller('entitlements')
export class EntitlementsController {
  constructor(private readonly entitlementsService: EntitlementsService) {}

  @Get('grants')
  async list(
    @Query('status') status?: GrantStatus,
    @Query('grant_type') grantType?: GrantType,
    @Query('expires_before') expiresBefore?: string,
  ) {
    const result = await this.entitlementsService.listGrants({
      status,
      grantType,
      expiresBefore,
    });
    return { data: result };
  }

  @Post('grants')
  async create(@Body() dto: CreateGrantDto) {
    const result = await this.entitlementsService.createGrant(dto);
    return { data: result };
  }

  @Post('batch-grants')
  async batchCreate(@Body() dto: BatchGrantsDto) {
    const result = await this.entitlementsService.batchCreateGrants(dto.grants);
    return { data: result };
  }

  @Get('rules')
  listRules() {
    const result = this.entitlementsService.listRules();
    return { data: result };
  }

  @Post('rules')
  createRule() {
    const result = this.entitlementsService.createRule();
    return { data: result };
  }
}
