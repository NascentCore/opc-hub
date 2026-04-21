"use client";

import React from "react";
import Link from "next/link";

interface RiskProject {
  id: string;
  name: string;
  reason: string;
}

interface PendingItem {
  id: string;
  title: string;
  project: string;
  deadline: string;
}

const riskProjects: RiskProject[] = [
  { id: "proj-002", name: "跨境电商独立站", reason: "预算超支 15%" },
  { id: "proj-003", name: "短剧内容推荐引擎", reason: "交付延期 5 天" },
];

const pendingItems: PendingItem[] = [
  { id: "acc-001", title: "阶段二交付验收", project: "AI 客服系统升级", deadline: "2025-04-20" },
  { id: "acc-002", title: "UI 设计稿确认", project: "跨境电商独立站", deadline: "2025-04-18" },
];

function formatMoney(n: number) {
  return `¥${n.toLocaleString()}`;
}

export default function ExpertWorkspacePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">工作台</h1>
        <p className="mt-1 text-sm text-gray-500">OPC 专家工作面工作台首页</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickCard href="/expert/projects" label="我的项目" value="6" sub="进行中 4 个" />
        <QuickCard href="/expert/projects?filter=pending" label="待验收事项" value="3" sub="本周截止 2 个" />
        <QuickCard href="/expert/profit" label="本月成本 / 利润" value={`${formatMoney(28400)} / ${formatMoney(95600)}`} sub="毛利率 77.1%" />
        <QuickCard href="/expert/wallet" label="钱包余额" value={formatMoney(42000)} sub="可提现" />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">风险项目</h2>
            <Link href="/expert/projects" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              查看全部
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {riskProjects.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{p.name}</p>
                  <p className="text-xs text-red-700">{p.reason}</p>
                </div>
                <Link
                  href={`/expert/projects/${p.id}`}
                  className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  处理
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">待验收事项</h2>
            <Link href="/expert/projects?filter=pending" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              查看全部
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {pendingItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-1 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">
                    {item.project} · 截止 {item.deadline}
                  </p>
                </div>
                <Link
                  href={`/expert/projects/${item.project === "AI 客服系统升级" ? "proj-001" : "proj-002"}/acceptance`}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  去验收
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function QuickCard({
  href,
  label,
  value,
  sub,
}: {
  href: string;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-gray-200 bg-white p-4 transition hover:border-emerald-300"
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
      <p className="mt-1 text-xs text-gray-400">{sub}</p>
    </Link>
  );
}
