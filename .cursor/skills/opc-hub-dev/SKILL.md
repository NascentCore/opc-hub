---
name: opc-hub-dev
description: >-
  Runs and explains opc-hub monorepo commands (pnpm workspace, Turbo, NestJS,
  Next.js, Prisma). Use when developing in this repository, starting dev servers,
  building, linting, testing, database workflows, or when the user mentions opc-hub,
  OPC 统一平台, apps/web, apps/api, or @opc/shared.
---

# opc-hub 开发命令

在**仓库根目录**（含根级 `package.json`、`pnpm-workspace.yaml`）执行下列命令。**包管理**：`pnpm`（根 `package.json` 中 `packageManager: pnpm@10.33.0`）。**编排**：Turbo 2.x + pnpm workspace（`apps/*`、`packages/*`）。

## 安装

```bash
pnpm install
```

在仓库根目录执行；不要混用 npm/yarn，以免锁文件不一致。

## 开发服务器（前端 + 后端）

**全栈日常推荐（两个终端）**：

```bash
pnpm dev:web    # Next.js → 默认 http://localhost:3000
pnpm dev:api    # NestJS  → 默认 http://localhost:3001
```

API 前缀约定：`/api/v1`（见仓库 `README.md`、`AGENTS.md`）。

### `pnpm dev`（Turbo）与全栈的区别

`pnpm dev` 等价于 `turbo run dev`，会在**所有定义了 `dev` 脚本的包**里并行执行：

- `apps/web`：`next dev`
- `packages/shared`：`tsc --watch`
- **`apps/api` 没有名为 `dev` 的脚本**（开发用 `start:dev`），因此 **不会被 `pnpm dev` 拉起**。

需要前后端一起跑时，用 **`dev:web` + `dev:api`**，不要误以为单独的 `pnpm dev` 已包含 Nest。

## 根目录脚本一览

| 命令 | 作用 |
|------|------|
| `pnpm dev:web` | 仅前端开发服务器 |
| `pnpm dev:api` | 仅后端 watch 模式 |
| `pnpm dev` | `turbo run dev`（web + shared，不含 api） |
| `pnpm build` | `turbo run build`（全仓构建） |
| `pnpm lint` | `turbo run lint` |
| `pnpm test` | `turbo run test` |
| `pnpm db:generate` | Prisma Client 生成（`api` 包） |
| `pnpm db:migrate` | Prisma 迁移（`api` 包） |
| `pnpm db:seed` | 数据库 seed（`api` 包） |
| `pnpm db:studio` | Prisma Studio（`api` 包） |

数据库类命令需在 **`apps/api`** 配置好环境（通常 `apps/api/.env`，参考 `apps/api/.env.example`）。

## 单包执行（pnpm filter）

```bash
pnpm --filter web <script>      # 例：pnpm --filter web build
pnpm --filter api <script>      # 例：pnpm --filter api test
pnpm --filter @opc/shared <script>
```

`web` / `api` 的 `package.json` 里还有各自脚本（如 api 的 `start:prod`、`test:cov`；web 的 `e2e` / `e2e:ui` 等），需要时直接查看对应文件。

## 环境与文档指针

- 后端：`apps/api/.env`、`PORT`（默认 3001）、`DATABASE_URL`
- 接口清单：`API.md`
- 前端路由：`ROUTES.md`

## macOS 与 Turbo 二进制

若运行 `turbo` 触发 Gatekeeper，可在系统「隐私与安全性」中放行，或对**已信任的**安装使用 Finder 右键「打开」；详见 Apple 对未公证 CLI 的说明。也可用 `pnpm exec turbo run ...` 走与 `pnpm` 相同的本地依赖。
