"use client";

import React, { useState } from "react";

type ChangeOrderStatus = "draft" | "submitted" | "approved" | "rejected";

type ChangeOrder = {
  id: string;
  title: string;
  changeType: string;
  amountChange: number;
  status: ChangeOrderStatus;
  submittedAt: string;
  resolvedAt?: string;
};

const statusMap: Record<ChangeOrderStatus, { label: string; className: string }> = {
  draft: { label: "草稿", className: "bg-gray-100 text-gray-700" },
  submitted: { label: "已提交", className: "bg-blue-100 text-blue-700" },
  approved: { label: "已通过", className: "bg-green-100 text-green-700" },
  rejected: { label: "已驳回", className: "bg-red-100 text-red-700" },
};

const changeTypeOptions = [
  { value: "scope_increase", label: "范围增加" },
  { value: "scope_decrease", label: "范围减少" },
  { value: "schedule_change", label: "进度变更" },
  { value: "cost_change", label: "成本变更" },
];

const initialMockData: ChangeOrder[] = [
  {
    id: "co-001",
    title: "增加语音识别模块",
    changeType: "scope_increase",
    amountChange: 15000,
    status: "approved",
    submittedAt: "2025-04-05",
    resolvedAt: "2025-04-07",
  },
  {
    id: "co-002",
    title: "延后交付两周",
    changeType: "schedule_change",
    amountChange: 0,
    status: "submitted",
    submittedAt: "2025-04-10",
  },
  {
    id: "co-003",
    title: "减少报表定制功能",
    changeType: "scope_decrease",
    amountChange: -8000,
    status: "draft",
    submittedAt: "2025-04-12",
  },
];

export default function ProjectChangeOrdersPage() {
  const [orders, setOrders] = useState<ChangeOrder[]>(initialMockData);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    changeType: "scope_increase",
    amountChange: "",
    description: "",
  });

  const handleCreate = () => {
    const newOrder: ChangeOrder = {
      id: `co-${String(orders.length + 1).padStart(3, "0")}`,
      title: form.title || "未命名变更单",
      changeType: form.changeType,
      amountChange: Number(form.amountChange || 0),
      status: "draft",
      submittedAt: new Date().toISOString().split("T")[0],
    };
    setOrders([newOrder, ...orders]);
    setForm({ title: "", changeType: "scope_increase", amountChange: "", description: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">变更单</h2>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            {showForm ? "取消" : "新建变更单"}
          </button>
        </div>

        {showForm && (
          <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">标题</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder="请输入变更单标题"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">变更类型</label>
                <select
                  value={form.changeType}
                  onChange={(e) => setForm({ ...form, changeType: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                >
                  {changeTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">金额变动</label>
                <input
                  type="number"
                  value={form.amountChange}
                  onChange={(e) => setForm({ ...form, amountChange: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder="正数表示增加，负数表示减少"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">描述</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder="请输入变更描述"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleCreate}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                保存
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 overflow-hidden rounded-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">标题</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">变更类型</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">金额变动</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">状态</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">提交时间</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">解决时间</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{o.title}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {changeTypeOptions.find((x) => x.value === o.changeType)?.label || o.changeType}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {o.amountChange >= 0 ? `+¥${o.amountChange.toLocaleString()}` : `-¥${Math.abs(o.amountChange).toLocaleString()}`}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusMap[o.status].className}`}>
                      {statusMap[o.status].label}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{o.submittedAt}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{o.resolvedAt || "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <button className="text-sm text-emerald-600 hover:text-emerald-700">编辑</button>
                      {o.status === "draft" && (
                        <button className="text-sm text-blue-600 hover:text-blue-700">提交</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
