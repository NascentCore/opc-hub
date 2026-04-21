"use client";

import React from "react";

type CostType = "Token" | "工具" | "人工" | "其他";

interface CostRow {
  id: string;
  item: string;
  type: CostType;
  amount: number;
  note: string;
}

const costRows: CostRow[] = [
  { id: "c-001", item: "Claude API Token", type: "Token", amount: 8500, note: "4 月模型调用" },
  { id: "c-002", item: "OpenAI API Token", type: "Token", amount: 4200, note: "Embedding 与 GPT-4" },
  { id: "c-003", item: "Figma 订阅", type: "工具", amount: 300, note: "设计协作" },
  { id: "c-004", item: "Vercel 托管", type: "工具", amount: 450, note: "前端部署" },
  { id: "c-005", item: "测试云服务器", type: "工具", amount: 1200, note: "UAT 环境" },
  { id: "c-006", item: "第三方安全审计", type: "其他", amount: 2000, note: "代码审计服务" },
];

function formatMoney(n: number) {
  return `¥${n.toLocaleString()}`;
}

export default function ProjectProfitPage() {
  const revenue: number = 120000;
  const totalCost = costRows.reduce((sum, c) => sum + c.amount, 0);
  const tokenCost = costRows.filter((c) => c.type === "Token").reduce((sum, c) => sum + c.amount, 0);
  const toolCost = costRows.filter((c) => c.type === "工具").reduce((sum, c) => sum + c.amount, 0);
  const laborCost = costRows.filter((c) => c.type === "人工").reduce((sum, c) => sum + c.amount, 0);
  const otherCost = costRows.filter((c) => c.type === "其他").reduce((sum, c) => sum + c.amount, 0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _costs = { tokenCost, toolCost, laborCost, otherCost };
  const grossProfit = revenue - totalCost;
  const marginRate = revenue === 0 ? 0 : (grossProfit / revenue) * 100;

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">利润账本</h2>
          <button
            onClick={() => alert("重算利润（占位）")}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            重算利润
          </button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-500">收入</p>
            <p className="mt-1 text-xl font-semibold text-gray-900">{formatMoney(revenue)}</p>
          </div>
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Token 成本</p>
            <p className="mt-1 text-xl font-semibold text-gray-900">{formatMoney(tokenCost)}</p>
          </div>
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-500">工具成本</p>
            <p className="mt-1 text-xl font-semibold text-gray-900">{formatMoney(toolCost)}</p>
          </div>
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm text-emerald-700">毛利</p>
            <p className="mt-1 text-xl font-semibold text-emerald-800">
              {formatMoney(grossProfit)}
              <span className="ml-2 text-sm font-normal text-emerald-700">({marginRate.toFixed(1)}%)</span>
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-base font-semibold text-gray-900">成本明细</h2>
        <div className="mt-4 overflow-hidden rounded-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">类型</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">项目</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">金额</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">占比</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">备注</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {costRows.map((c) => {
                const pct = totalCost === 0 ? 0 : (c.amount / totalCost) * 100;
                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{c.type}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{c.item}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{formatMoney(c.amount)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{pct.toFixed(1)}%</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{c.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-base font-semibold text-gray-900">利润计算说明</h2>
        <div className="mt-3 space-y-2 text-sm text-gray-600">
          <p>1. 收入以项目合同金额或变更后金额为准。</p>
          <p>2. Token 成本按实际调用量与模型单价计算，每日自动归集。</p>
          <p>3. 工具成本包含订阅类与按量计费类服务，按月分摊到项目。</p>
          <p>4. 毛利 = 收入 - Token 成本 - 工具成本 - 人工成本 - 其他成本。</p>
          <p>5. 毛利率 = 毛利 / 收入 × 100%。</p>
        </div>
      </section>
    </div>
  );
}
