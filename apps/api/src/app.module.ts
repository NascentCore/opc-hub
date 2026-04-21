import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { MembersModule } from './members/members.module';
import { WalletsModule } from './wallets/wallets.module';
import { EntitlementsModule } from './entitlements/entitlements.module';
import { UsageModule } from './usage/usage.module';
import { ClientsModule } from './clients/clients.module';
import { ProjectsModule } from './projects/projects.module';
import { ScopesModule } from './scopes/scopes.module';
import { ChangeOrdersModule } from './change-orders/change-orders.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { AcceptanceModule } from './acceptance/acceptance.module';
import { ProfitModule } from './profit/profit.module';
import { ReleaseProofModule } from './release-proof/release-proof.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';

@Module({
  imports: [PrismaModule, AuthModule, OrganizationsModule, MembersModule, WalletsModule, EntitlementsModule, UsageModule, ClientsModule, ProjectsModule, ScopesModule, ChangeOrdersModule, DeliveriesModule, AcceptanceModule, ProfitModule, ReleaseProofModule, AuditLogsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
