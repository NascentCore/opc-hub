import { Controller, Get, Post, Param } from '@nestjs/common';
import { ProfitService } from './profit.service';

@Controller()
export class ProfitController {
  constructor(private readonly profitService: ProfitService) {}

  @Get('projects/:projectId/profit')
  async getProjectProfit(@Param('projectId') projectId: string) {
    const result = await this.profitService.getProjectProfit(projectId);
    return { data: result };
  }

  @Post('projects/:projectId/profit/recalculate')
  async recalculateProjectProfit(@Param('projectId') projectId: string) {
    const result = await this.profitService.recalculateProjectProfit(projectId);
    return { data: result };
  }

  @Get('reports/park-overview')
  async getParkOverview() {
    const result = await this.profitService.getParkOverview();
    return { data: result };
  }

  @Get('reports/usage-roi')
  async getUsageRoi() {
    const result = await this.profitService.getUsageRoi();
    return { data: result };
  }

  @Get('reports/settlements')
  async getSettlements() {
    const result = this.profitService.getSettlements();
    return { data: result };
  }
}
