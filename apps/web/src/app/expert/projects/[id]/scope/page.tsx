"use client";

import React, { useState } from "react";

const mockScopes = [
  { id: "scope-001", version: "v1.0", status: "accepted", price: 100000, createdAt: "2025-04-02" },
  { id: "scope-002", version: "v1.1", status: "accepted", price: 110000, createdAt: "2025-04-04" },
  { id: "scope-003", version: "v1.2", status: "draft", price: 120000, createdAt: "2025-04-06" },
];

export default function ProjectScopePage() {
  const [summary, setSummary] = useState("智能客服 NLP 模块升级 + 多渠道接入");
  const [price, setPrice] = useState("120000");
  const [plan, setPlan] = useState("第一阶段：需求确认\n第二阶段：原型设计\n第三阶段：开发实施\n第四阶段：上线验收");

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Scope 版本列表</h2>
          <div className="flex gap-2">
            <button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
              新建 Scope 草稿
            </button>
          </div>
        </div>
        <div className="mt-4 overflow-hidden rounded-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">版本号</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">状态</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">报价</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">创建时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {mockScopes.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{s.version}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <span
                      className={[
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                        s.status === "draft"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-green-100 text-green-700",
                      ].join(" ")}
                    >
                      {s.status === "draft" ? "草稿" : "已确认"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">¥{s.price.toLocaleString()}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{s.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">当前 Draft Scope 编辑</h2>
          <button className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700">
            冻结 Scope
          </button>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">范围摘要</label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">报价金额</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">交付计划</label>
            <textarea
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              保存草稿
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
