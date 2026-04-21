"use client";

import React from "react";

function formatMoney(n: number) {
  return `¥${n.toLocaleString()}`;
}

export default function ParkSettlementsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">结算与报表</h1>
        <p className="mt-1 text-sm text-gray-500">查看结算周期、对账单与经营报表</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">本月补贴支出</p>
          <p className="mt-1 text-xl font-semibold text-gray-900">{formatMoney(124500)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">自费部分</p>
          <p className="mt-1 text-xl font-semibold text-gray-900">{formatMoney(38200)}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">对账金额</p>
          <p className="mt-1 text-xl font-semibold text-gray-900">{formatMoney(162700)}</p>
        </div>
      </section>

      <section className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">ROI 报表</h3>
            <p className="mt-1 text-sm text-gray-500">展示园区补贴投入与项目产出对比，后续将接入图表组件。</p>
          </div>
          <button
            onClick={() => alert("导出报表（占位）")}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            导出
          </button>
        </div>
        <div className="mt-4 h-48 rounded-md border border-dashed border-gray-300 bg-white" />
      </section>
    </div>
  );
}
