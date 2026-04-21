# OPC Token 权益中台

一句话：这个仓库是 OPC Token 权益中台与 OPC 专家经营/交付操作工具合在一个 monorepo 里的全栈底座（Next.js 前端 + NestJS 后端），分别支撑园区/机构侧和专家侧两套工作面。

## 系统架构

**顶层形态**：pnpm workspace + Turbo 编排的 TypeScript monorepo。前端 `apps/web`（Next.js 14 App Router、React、Tailwind）通过 **REST**（统一前缀 `/api/v1`）调用后端 `apps/api`（NestJS、默认 Express 适配器）；后端用 **Prisma** 访问 **PostgreSQL**；前后端共用 **`@opc/shared`**（`packages/shared`）中的类型与常量；前端 E2E 使用 **Playwright**。

**分层职责**：

| 层级 | 位置 / 技术 | 职责 |
|------|----------------|------|
| 编排 | pnpm、Turbo | 多包依赖、构建与开发流水线 |
| 表现层 | `apps/web`：Next.js 14 | UI；路由按工作面划分（园区 `/park/*`，专家 `/expert/*`；另有公共页如 `/`、`/login`、`/switch-org`） |
| API 层 | `apps/api`：NestJS | 业务接口、`class-validator` 等校验 |
| 数据访问 | Prisma + PostgreSQL | ORM、迁移、持久化 |

**约定**：后端统一 API 前缀 `/api/v1`；开发与默认端口一般为前端 3000、后端 3001（以项目配置为准）。
