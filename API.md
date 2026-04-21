# OPC 统一平台 - API 接口清单

> 前缀：所有接口均以 `/api/v1` 开头

---

## Auth

```
POST   /api/v1/auth/login                用户登录
GET    /api/v1/auth/me                   获取当前登录用户信息
```

## Organizations & Members

```
GET    /api/v1/organizations/current     获取当前组织信息
GET    /api/v1/members                   成员列表（支持分页）
POST   /api/v1/members                   创建成员
PATCH  /api/v1/members/:memberId         更新成员信息
```

## Wallets & Entitlements

```
GET    /api/v1/wallet                    当前组织钱包总览
GET    /api/v1/entitlements/grants       权益发放记录列表
POST   /api/v1/entitlements/grants       创建权益发放
POST   /api/v1/entitlements/batch-grants 批量创建权益发放
GET    /api/v1/entitlements/rules        权益规则列表
POST   /api/v1/entitlements/rules        创建权益规则
```

## Usage

```
GET    /api/v1/usage-records             使用记录列表（支持筛选与分页）
POST   /api/v1/usage-records/reserve     预留额度
POST   /api/v1/usage-records/consume     消费额度
POST   /api/v1/usage-records/rollback    回滚使用记录
```

## Clients

```
GET    /api/v1/clients                   客户列表（支持筛选与分页）
POST   /api/v1/clients                   创建客户
GET    /api/v1/clients/:clientId         客户详情
PATCH  /api/v1/clients/:clientId         更新客户信息
```

## Projects

```
GET    /api/v1/projects                  项目列表（支持筛选与分页）
POST   /api/v1/projects                  创建项目
GET    /api/v1/projects/:projectId       项目详情
PATCH  /api/v1/projects/:projectId       更新项目信息
```

## Scopes & Change Orders

```
GET    /api/v1/projects/:projectId/scopes           Scope 列表
POST   /api/v1/projects/:projectId/scopes           创建 Scope
POST   /api/v1/projects/:projectId/scopes/:scopeId/freeze  冻结 Scope
GET    /api/v1/projects/:projectId/change-orders    变更单列表
POST   /api/v1/projects/:projectId/change-orders    创建变更单
PATCH  /api/v1/projects/:projectId/change-orders/:changeOrderId  更新变更单
```

## Delivery & Acceptance

```
GET    /api/v1/projects/:projectId/deliveries       交付包列表
POST   /api/v1/projects/:projectId/deliveries       创建交付包
GET    /api/v1/projects/:projectId/deliveries/:deliveryId  交付包详情
POST   /api/v1/projects/:projectId/deliveries/:deliveryId/submit  提交交付包
GET    /api/v1/projects/:projectId/acceptance-records  验收记录列表
POST   /api/v1/projects/:projectId/acceptance-records  创建验收记录
```

## Profit & Reports

```
GET    /api/v1/projects/:projectId/profit           项目利润详情
POST   /api/v1/projects/:projectId/profit/recalculate  重新计算项目利润
GET    /api/v1/reports/park-overview                园区运营总览报表
GET    /api/v1/reports/usage-roi                    使用 ROI 报表
GET    /api/v1/reports/settlements                  结算报表
```

## Assets

```
（前端静态页面，暂无独立 API 接口）
```

## Audit Logs

```
（Sprint 6 规划中，接口待补充）
```

## Health

```
GET    /api/v1/health                    服务健康检查
```
