import { Module } from '@nestjs/common';
import { ReleaseProofController } from './release-proof.controller';
import { ReleaseProofService } from './release-proof.service';

@Module({
  controllers: [ReleaseProofController],
  providers: [ReleaseProofService],
  exports: [ReleaseProofService],
})
export class ReleaseProofModule {}
