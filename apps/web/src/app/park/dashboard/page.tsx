"use client";

import React, { useEffect, useState } from "react";

interface DashboardStats {
  issuedTotal: number;
  activeTeams: number;
  redemptionRate: number;
  workflowConversion: number;
  monthlySubsidy: number;
}

interface ActiveTeam {
  id: string;
  name: string;
  activeProjects: number;
  monthlySpend: number;
  status: "active" | "inactive";
}

const mockStats: DashboardStats = {
  issuedTotal: 12480,
  activeTeams: 36,
  redemptionRate: 78.5,
  workflowConversion: 64.2,
  monthlySubsidy: 452000,
};

const mockActiveTeams: ActiveTeam[] = [
  { id: "t1", name: "云智交付团队", activeProjects: 5, monthlySpend: 128000, status: "active" },
  { id: "t2", name: "海潮电商组", activeProjects: 3, monthlySpend: 86000, status: "active" },
  { id: "t3", name: "星影内容引擎", activeProjects: 2, monthlySpend: 54000, status: "active" },
  { id: "t4", name: "创新工场 B", activeProjects: 0, monthlySpend: 0, status: "inactive" },
];

const riskAlerts = [
  { id: 1, title: "权益包 A 即将过期", level: "high" },
  { id: 2, title: "团队 B 核销率连续 7 天低于 50%", level: "medium" },
  { id: 3, title: "本月补贴支出接近预算上限", level: "medium" },
];

export default function ParkDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">园区总览</h1>
        <p className="mt-1 text-sm text-gray-500">园区/机构工作面总览</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="已发权益总量"
          value={stats?.issuedTotal ?? 0}
          loading={loading}
          format="number"
        />
        <StatCard
          label="已激活团队数"
          value={stats?.activeTeams ?? 0}
          loading={loading}
          format="number"
        />
        <StatCard
          label="核销率"
          value={stats?.redemptionRate ?? 0}
          loading={loading}
          format="percent"
        />
        <StatCard
          label="工作流转化率"
          value={stats?.workflowConversion ?? 0}
          loading={loading}
          format="percent"
        />
        <StatCard
          label="本月补贴支出"
          value={stats?.monthlySubsidy ?? 0}
          loading={loading}
          format="currency"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex h-60 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 text-center">
          <span className="text-sm font-medium text-gray-700">权益发放趋势图</span>
          <span className="mt-1 text-xs text-gray-500">占位：后续接入图表组件</span>
        </div>
        <div className="flex h-60 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 text-center">
          <span className="text-sm font-medium text-gray-700">激活/核销趋势图</span>
          <span className="mt-1 text-xs text-gray-500">占位：后续接入图表组件</span>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">活跃 OPC 团队</h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">团队名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">活跃项目数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">本月消耗</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {mockActiveTeams.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{t.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{t.activeProjects}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">¥{t.monthlySpend.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={[
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                        t.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700",
                      ].join(" ")}
                    >
                      {t.status === "active" ? "活跃" : "停用"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">风险提醒</h2>
        <ul className="mt-4 space-y-3">
          {riskAlerts.map((alert) => (
            <li
              key={alert.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
            >
              <span className="text-sm text-gray-700">{alert.title}</span>
              <span
                className={[
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  alert.level === "high"
                    ? "bg-red-100 text-red-700"
                    : alert.level === "medium"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-blue-100 text-blue-700",
                ].join(" ")}
              >
                {alert.level === "high" ? "高" : alert.level === "medium" ? "中" : "低"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  loading,
  format,
}: {
  label: string;
  value: number;
  loading: boolean;
  format: "number" | "percent" | "currency";
}) {
  const display = loading
    ? "-"
    : format === "percent"
    ? `${value}%`
    : format === "currency"
    ? `¥${value.toLocaleString()}`
    : value.toLocaleString();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-2 text-3xl font-bold text-gray-900">{display}</div>
    </div>
  );
}
