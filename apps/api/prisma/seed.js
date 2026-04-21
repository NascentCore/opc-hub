"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const organization = await prisma.organization.upsert({
        where: { id: 'seed-platform-org' },
        update: {},
        create: {
            id: 'seed-platform-org',
            type: 'platform',
            name: 'OPC 平台',
            status: 'active',
        },
    });
    const rolesData = [
        { code: 'platform_admin', name: '平台管理员', scopeType: 'platform' },
        { code: 'park_admin', name: '园区管理员', scopeType: 'park' },
        { code: 'park_finance', name: '园区财务', scopeType: 'park' },
        { code: 'opc_owner', name: 'OPC 负责人', scopeType: 'opc_team' },
        { code: 'opc_member', name: 'OPC 成员', scopeType: 'opc_team' },
        { code: 'client_user', name: '客户用户', scopeType: 'client' },
    ];
    const roles = {};
    for (const r of rolesData) {
        const role = await prisma.role.upsert({
            where: { code: r.code },
            update: {},
            create: r,
        });
        roles[r.code] = role;
    }
    await prisma.member.upsert({
        where: { email: 'admin@opc.local' },
        update: {},
        create: {
            organizationId: organization.id,
            name: '平台管理员',
            email: 'admin@opc.local',
            roleId: roles['platform_admin'].id,
            status: 'active',
        },
    });
    const wallet = await prisma.entitlementWallet.upsert({
        where: { organizationId: organization.id },
        update: {},
        create: {
            organizationId: organization.id,
            status: 'active',
            currency: 'TOKEN',
        },
    });
    const now = new Date();
    const grantsData = [
        {
            walletId: wallet.id,
            grantType: 'token',
            grantName: '平台启动额度',
            sourceType: 'park_grant',
            quantityTotal: 10000,
            quantityAvailable: 10000,
            priority: 0,
            expiresAt: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000),
            status: 'active',
        },
        {
            walletId: wallet.id,
            grantType: 'model_coupon',
            grantName: '模型体验券',
            sourceType: 'promo',
            quantityTotal: 500,
            quantityAvailable: 500,
            priority: 1,
            expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
            status: 'active',
        },
    ];
    for (const g of grantsData) {
        const existing = await prisma.entitlementGrant.findFirst({
            where: {
                walletId: g.walletId,
                grantName: g.grantName,
            },
        });
        if (!existing) {
            await prisma.entitlementGrant.create({ data: g });
        }
    }
    const clientsData = [
        {
            id: 'seed-client-1',
            organizationId: organization.id,
            name: '星辰科技',
            contactName: '张伟',
            contactEmail: 'zhangwei@xingchen.local',
            status: 'active',
            notes: '重点客户',
        },
        {
            id: 'seed-client-2',
            organizationId: organization.id,
            name: '蓝海电商',
            contactName: '李娜',
            contactEmail: 'lina@lanhai.local',
            status: 'active',
            notes: '跨境电商项目',
        },
        {
            id: 'seed-client-3',
            organizationId: organization.id,
            name: '微剧传媒',
            contactName: '王强',
            contactEmail: 'wangqiang@weiju.local',
            status: 'inactive',
            notes: '短剧出海',
        },
    ];
    const seededClients = {};
    for (const c of clientsData) {
        const client = await prisma.client.upsert({
            where: { id: c.id },
            update: {},
            create: c,
        });
        seededClients[c.id] = client;
    }
    const projectsData = [
        {
            id: 'seed-project-1',
            organizationId: organization.id,
            clientId: seededClients['seed-client-1'].id,
            name: '星辰官网重构',
            industryPack: 'dev',
            status: 'draft',
            budgetAmount: 50000,
            createdBy: 'admin@opc.local',
        },
        {
            id: 'seed-project-2',
            organizationId: organization.id,
            clientId: seededClients['seed-client-2'].id,
            name: '蓝海小程序商城',
            industryPack: 'ecommerce',
            status: 'scoped',
            budgetAmount: 120000,
            createdBy: 'admin@opc.local',
        },
    ];
    for (const p of projectsData) {
        const existingProject = await prisma.project.findUnique({
            where: { id: p.id },
        });
        if (!existingProject) {
            await prisma.project.create({
                data: {
                    ...p,
                    scopeVersions: {
                        create: {
                            versionNo: 1,
                            scopeSummary: `初始 Scope - ${p.name}`,
                            status: 'draft',
                        },
                    },
                },
            });
        }
    }
    const seededProjects = await prisma.project.findMany({
        where: { id: { in: projectsData.map((p) => p.id) } },
        include: { scopeVersions: true },
    });
    let firstDeliveryPackageId = null;
    for (const project of seededProjects) {
        const existingChangeOrder = await prisma.changeOrder.findFirst({
            where: { projectId: project.id },
        });
        if (!existingChangeOrder) {
            await prisma.changeOrder.create({
                data: {
                    projectId: project.id,
                    scopeVersionId: project.scopeVersions[0]?.id ?? null,
                    title: `变更 - ${project.name}`,
                    changeType: 'scope_add',
                    amountDelta: 5000,
                    description: '初始变更单示例',
                    status: 'draft',
                },
            });
        }
        const existingDelivery = await prisma.deliveryPackage.findFirst({
            where: { projectId: project.id },
        });
        if (!existingDelivery) {
            const delivery = await prisma.deliveryPackage.create({
                data: {
                    projectId: project.id,
                    versionNo: 'v1.0.0',
                    title: `交付包 - ${project.name}`,
                    summary: '初始交付包示例',
                    status: 'draft',
                    createdBy: 'admin@opc.local',
                },
            });
            if (!firstDeliveryPackageId) {
                firstDeliveryPackageId = delivery.id;
            }
        }
    }
    if (firstDeliveryPackageId) {
        const existingRecord = await prisma.acceptanceRecord.findFirst({
            where: { deliveryPackageId: firstDeliveryPackageId },
        });
        if (!existingRecord) {
            const delivery = await prisma.deliveryPackage.findUnique({
                where: { id: firstDeliveryPackageId },
            });
            if (delivery) {
                await prisma.acceptanceRecord.create({
                    data: {
                        projectId: delivery.projectId,
                        deliveryPackageId: delivery.id,
                        decision: 'approved',
                        comment: '验收通过示例',
                    },
                });
            }
        }
    }
    const seededProjectsForProfit = await prisma.project.findMany({
        where: { id: { in: projectsData.map((p) => p.id) } },
    });
    for (const project of seededProjectsForProfit) {
        const existingProfit = await prisma.profitLedger.findFirst({
            where: { projectId: project.id, periodType: 'project_total' },
        });
        if (!existingProfit) {
            const revenue = project.budgetAmount ? project.budgetAmount.toNumber() : 0;
            const tokenCost = Math.round(revenue * 0.15 * 100) / 100;
            const toolCost = Math.round(revenue * 0.1 * 100) / 100;
            const laborCost = Math.round(revenue * 0.3 * 100) / 100;
            const otherCost = Math.round(revenue * 0.05 * 100) / 100;
            const grossProfit = Math.round((revenue - tokenCost - toolCost - laborCost - otherCost) * 100) / 100;
            const grossMargin = revenue > 0 ? Math.round((grossProfit / revenue) * 10000) / 100 : 0;
            await prisma.profitLedger.create({
                data: {
                    projectId: project.id,
                    periodType: 'project_total',
                    tokenCostAmount: tokenCost,
                    toolCostAmount: toolCost,
                    laborCostAmount: laborCost,
                    otherCostAmount: otherCost,
                    revenueAmount: revenue,
                    grossProfitAmount: grossProfit,
                    grossMargin: grossMargin,
                },
            });
        }
    }
    const auditLogsData = [
        {
            organizationId: organization.id,
            entityType: 'EntitlementGrant',
            entityId: 'seed-audit-grant-1',
            action: 'grant_created',
            payloadJson: JSON.stringify({ grantName: '平台启动额度', quantityTotal: 10000 }),
        },
        {
            organizationId: organization.id,
            entityType: 'Project',
            entityId: 'seed-audit-project-1',
            action: 'project_created',
            payloadJson: JSON.stringify({ name: '星辰官网重构', clientId: 'seed-client-1' }),
        },
        {
            organizationId: organization.id,
            entityType: 'UsageRecord',
            entityId: 'seed-audit-usage-1',
            action: 'consume',
            payloadJson: JSON.stringify({ usageType: 'token_call', quantityUsed: 120 }),
        },
    ];
    for (const log of auditLogsData) {
        const existing = await prisma.auditLog.findFirst({
            where: { organizationId: log.organizationId, entityId: log.entityId, action: log.action },
        });
        if (!existing) {
            await prisma.auditLog.create({ data: log });
        }
    }
    console.log('Seed completed.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map