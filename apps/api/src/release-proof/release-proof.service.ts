import { Injectable } from '@nestjs/common';

@Injectable()
export class ReleaseProofService {
  getReleaseProof(_projectId: string) {
    return {
      version: 'v1.2.0',
      status: 'passed',
      passedAt: '2025-04-10T08:00:00Z',
      summary: '所有门禁检查通过',
      blockers: [],
      readiness: { ci: true, tests: true, security: true },
    };
  }

  syncReleaseProof(_projectId: string) {
    return {
      version: 'v1.2.0',
      status: 'passed',
      passedAt: '2025-04-10T08:00:00Z',
      summary: '所有门禁检查通过',
      blockers: [],
      readiness: { ci: true, tests: true, security: true },
      refreshedAt: new Date().toISOString(),
    };
  }
}
