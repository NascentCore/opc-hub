"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
// import { apiGet } from "@/lib/api";

interface ProjectProfit {
  id: string;
  name: string;
  revenue: number;
  tokenCost: number;
  toolCost: number;
  laborCost: number;
  otherCost: number;
}

const mockProjects: ProjectProfit[] = [
  {
    id: "proj-001",
    name: "AI 客服系统升级",
    revenue: 120000,
    tokenCost: 12700,
    toolCost: 1950,
    laborCost: 0,
    otherCost: 500,
  },
  {
    id: "proj-002",
    name: "跨境电商独立站",
    revenue: 85000,
    tokenCost: 3200,
    toolCost: 2800,
    laborCost: 0,
    otherCost: 0,
  },
  {
    id: "proj-003",
    name: "短剧内容推荐引擎",
    revenue: 200000,
    tokenCost: 18500,
    toolCost: 6200,
    laborCost: 0,
    otherCost: 1200,
  },
  {
    id: "proj-004",
    name: "智能合同审阅助手",
    revenue: 150000,
    tokenCost: 8600,
    toolCost: 3400,
    laborCost: 0,
    otherCost: 800,
  },
];

function formatMoney(n: number) {
  return `¥${n.toLocaleString()}`;
}

function grossProfit(p: ProjectProfit) {
  return p.revenue - p.tokenCost - p.toolCost - p.laborCost - p.otherCost;
}

function marginRate(p: ProjectProfit) {
  if (p.revenue === 0) return 0;
  return (grossProfit(p) / p.revenue) * 100;
}

export default function ExpertProfitPage() {
  const [projects] = useState<ProjectProfit[]>(mockProjects);
  // const [loading, setLoading] = useState(false);

  // Fetch skeleton for future API integration
  // useEffect(() => {
  //   setLoading(true);
  //   apiGet<ProjectProfit[]>("/profit/summary")
  //     .then((data) => setProjects(data))
  //     .catch(() => setProjects(mockProjects))
  //     .finally(() => setLoading(false));
  // }, []);

  const totals = useMemo(() => {
    const revenue = projects.reduce((s, p) => s + p.revenue, 0);
    const tokenCost = projects.reduce((s, p) => s + p.tokenCost, 0);
    const toolCost = projects.reduce((s, p) => s + p.toolCost, 0);
    const laborCost = projects.reduce((s, p) => s + p.laborCost, 0);
    const otherCost = projects.reduce((s, p) => s + p.otherCost, 0);
    const gross = revenue - tokenCost - toolCost - laborCost - otherCost;
    const avgMargin = revenue === 0 ? 0 : (gross / revenue) * 100;
    return { revenue, tokenCost, toolCost, laborCost, otherCost, gross, avgMargin };
  }, [projects]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">利润</h1>
        <p className="mt-1 text-sm text-gray-500">查看项目利润、成本结构与收益分析</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard label="总收入" value={formatMoney(totals.revenue)} tone="neutral" />
        <KpiCard label="总 Token 成本" value={formatMoney(totals.tokenCost)} tone="neutral" />
        <KpiCard label="总工具成本" value={formatMoney(totals.toolCost)} tone="neutral" />
        <KpiCard label="总毛利" value={formatMoney(totals.gross)} tone="success" />
        <KpiCard label="平均毛利率" value={`${totals.avgMargin.toFixed(1)}%`} tone="highlight" />
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-base font-semibold text-gray-900">项目利润列表</h2>
        <div className="mt-4 overflow-hidden rounded-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">项目名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">收入</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Token 成本</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">工具成本</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">毛利</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">毛利率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {projects.map((p) => {
                const gp = grossProfit(p);
                const rate = marginRate(p);
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      <Link href={`/expert/projects/${p.id}/profit`} className="text-emerald-700 hover:underline">
                        {p.name}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{formatMoney(p.revenue)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{formatMoney(p.tokenCost)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{formatMoney(p.toolCost)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{formatMoney(gp)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{rate.toFixed(1)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">毛利趋势图</h3>
            <p className="mt-1 text-sm text-gray-500">按月度/季度展示毛利变化趋势，后续将接入图表组件。</p>
          </div>
        </div>
        <div className="mt-4 h-40 rounded-md border border-dashed border-gray-300 bg-white" />
      </section>
    </div>
  );
}

function KpiCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "success" | "highlight";
}) {
  const toneClass =
    tone === "success"
      ? "bg-emerald-50 border-emerald-200"
      : tone === "highlight"
      ? "bg-blue-50 border-blue-200"
      : "bg-white border-gray-200";
  const valueClass =
    tone === "success" ? "text-emerald-800" : tone === "highlight" ? "text-blue-800" : "text-gray-900";
  const labelClass =
    tone === "success" ? "text-emerald-700" : tone === "highlight" ? "text-blue-700" : "text-gray-500";

  return (
    <div className={`rounded-lg border p-4 ${toneClass}`}>
      <p className={`text-sm ${labelClass}`}>{label}</p>
      <p className={`mt-1 text-xl font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}
