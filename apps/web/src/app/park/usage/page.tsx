"use client";

import React from "react";
import Link from "next/link";

interface AlertItem {
  id: string;
  title: string;
  project: string;
  message: string;
}

const alertItems: AlertItem[] = [
  {
    id: "alt-001",
    title: "Token 消耗异常",
    project: "AI 客服系统升级",
    message: "近 7 日 Token 成本较上周增长 180%，建议排查调用链路。",
  },
  {
    id: "alt-002",
    title: "权益即将到期",
    project: "跨境电商独立站",
    message: "Figma 团队版权益将在 3 天后到期，请及时续费或替换。",
  },
];

export default function ParkUsagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">使用与核销</h1>
        <p className="mt-1 text-sm text-gray-500">跟踪权益使用记录、核销状态与审批流程</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">总使用量</p>
          <p className="mt-1 text-xl font-semibold text-gray-900">12,450</p>
          <p className="mt-1 text-xs text-gray-400">本月累计调用次数</p>
        </div>
        <Link
          href="/park/usage?dimension=org"
          className="rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-300"
        >
          <p className="text-sm text-gray-500">按组织查看</p>
          <p className="mt-1 text-xl font-semibold text-gray-900">6 个</p>
          <p className="mt-1 text-xs text-gray-400">已激活使用的组织</p>
        </Link>
        <Link
          href="/park/usage?dimension=project"
          className="rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-300"
        >
          <p className="text-sm text-gray-500">按项目查看</p>
          <p className="mt-1 text-xl font-semibold text-gray-900">18 个</p>
          <p className="mt-1 text-xs text-gray-400">关联项目数</p>
        </Link>
        <Link
          href="/park/usage?dimension=package"
          className="rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-300"
        >
          <p className="text-sm text-gray-500">按行业包查看</p>
          <p className="mt-1 text-xl font-semibold text-gray-900">4 个</p>
          <p className="mt-1 text-xs text-gray-400">已发放行业包</p>
        </Link>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-base font-semibold text-gray-900">异常消耗告警</h2>
        <div className="mt-4 space-y-3">
          {alertItems.map((a) => (
            <div
              key={a.id}
              className="flex flex-col gap-1 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{a.title}</span>
                  <span className="text-xs text-gray-500">· {a.project}</span>
                </div>
                <p className="mt-0.5 text-sm text-gray-600">{a.message}</p>
              </div>
              <button className="mt-2 rounded-md border border-yellow-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 sm:mt-0">
                查看详情
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
