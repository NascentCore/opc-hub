import { Controller, Get, Post, Param } from '@nestjs/common';
import { ReleaseProofService } from './release-proof.service';

@Controller()
export class ReleaseProofController {
  constructor(private readonly releaseProofService: ReleaseProofService) {}

  @Get('projects/:projectId/release-proof')
  async getReleaseProof(@Param('projectId') projectId: string) {
    const result = this.releaseProofService.getReleaseProof(projectId);
    return { data: result };
  }

  @Post('projects/:projectId/release-proof/sync')
  async syncReleaseProof(@Param('projectId') projectId: string) {
    const result = this.releaseProofService.syncReleaseProof(projectId);
    return { data: result };
  }
}
