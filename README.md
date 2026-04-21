# OPC 统一平台

OPC Token 权益中台 + OPC 专家经营操作工具的全栈项目底座。

## 项目定位

**一套系统，两个工作面**

- **园区/机构工作面** (`Workspace.PARK`)：面向园区和机构的运营管理界面，聚焦权益发放、团队管理、使用看板与结算报表。
- **OPC 专家工作面** (`Workspace.EXPERT`)：面向 OPC 专家的经营操作工具，聚焦客户经营、项目交付、Scope 管理、利润核算与发布证明。

## 当前版本

**V1.5 Pilot（Sprint 1-6 已完成）**

## 技术栈

- **前端**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **后端**: NestJS + TypeScript + Prisma ORM + PostgreSQL
- **包管理**: pnpm workspace (monorepo)
- **任务编排**: Turbo

## 项目结构

```
coding/
├── package.json          # workspace root
├── pnpm-workspace.yaml   # pnpm workspace 配置
├── turbo.json            # Turbo pipeline 配置
├── README.md             # 项目说明（本文件）
├── API.md                # 后端 API 接口清单
├── ROUTES.md             # 前端路由清单
├── apps/
│   ├── web/              # Next.js 前端
│   └── api/              # NestJS 后端
└── packages/
    └── shared/           # 共享类型和常量
```

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

分别启动前后端（推荐开两个终端）：

```bash
# 终端 1：启动前端
pnpm dev:web

# 终端 2：启动后端
pnpm dev:api
```

或使用 Turbo 同时启动：

```bash
pnpm dev
```

### 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev:web` | 启动 Next.js 开发服务器 (默认 http://localhost:3000) |
| `pnpm dev:api` | 启动 NestJS 开发服务器 (默认 http://localhost:3001) |
| `pnpm build` | 构建所有项目 |
| `pnpm lint` | 运行所有项目的 lint |
| `pnpm test` | 运行所有项目的测试 |
| `pnpm db:generate` | 生成 Prisma Client |
| `pnpm db:migrate` | 执行 Prisma 迁移 |
| `pnpm db:seed` | 运行数据库 seed |
| `pnpm db:studio` | 打开 Prisma Studio |

## 环境变量

后端需要在 `apps/api/.env` 中配置以下变量（参考 `apps/api/.env.example`）：

```env
DATABASE_URL="postgresql://user:password@localhost:5432/opc_db?schema=public"
PORT=3001
```

- `DATABASE_URL`：PostgreSQL 连接字符串
- `PORT`：NestJS 服务端口（默认 3001）

## API 前缀说明

所有后端接口统一前缀为 `/api/v1`，例如：

```
GET /api/v1/health
POST /api/v1/auth/login
GET /api/v1/wallet
```

完整接口列表请查看 [API.md](./API.md)。

## 前端路由说明

系统采用双工作面结构，路由前缀区分如下：

- **公共页面**：`/`、`/login`、`/switch-org`
- **园区工作面**：`/park/*`
- **OPC 专家工作面**：`/expert/*`

完整路由列表请查看 [ROUTES.md](./ROUTES.md)。

## Sprint 进度

- Sprint 1 ✅ 底座骨架
- Sprint 2 ✅ 权益中台
- Sprint 3 ✅ 项目与 Scope
- Sprint 4 ✅ 交付与验收
- Sprint 5 ✅ 利润账本与发布证明
- Sprint 6 ✅ ROI 报表与试点版收口
