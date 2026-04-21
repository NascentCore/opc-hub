# OPC 统一平台 - 前端路由清单

---

## 公共页面

```
/                         首页（登录前入口或重定向）
/login                    登录页
/switch-org               切换当前组织
```

## 园区工作面

```
/park                     园区首页
/park/dashboard           园区总览
/park/entitlements        权益管理
/park/grant-records       发放记录
/park/usage               使用记录
/park/teams               团队管理
/park/settlements         结算报表
/park/settings            园区设置
```

## OPC 专家工作面

```
/expert                   专家首页
/expert/workspace         专家工作台
/expert/wallet            钱包总览
/expert/clients           客户列表
/expert/clients/:id       客户详情
/expert/projects          项目列表
/expert/projects/new      新建项目
/expert/profit            利润总览
/expert/assets            资产管理
```

## 项目详情页签

```
/expert/projects/:id                    项目详情（默认重定向到 overview）
/expert/projects/:id/overview           项目概览
/expert/projects/:id/scope              Scope / 报价
/expert/projects/:id/change-orders      变更单
/expert/projects/:id/deliveries         交付管理
/expert/projects/:id/acceptance         验收记录
/expert/projects/:id/release-proof      发布证明
/expert/projects/:id/profit             项目利润
```
