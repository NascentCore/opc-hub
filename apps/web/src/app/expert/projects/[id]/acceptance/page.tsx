"use client";

import React, { useState } from "react";

type Decision = "approved" | "rejected" | "needs_change";

type AcceptanceRecord = {
  id: string;
  deliveryVersion: string;
  deliveryTitle: string;
  decision: Decision;
  notes: string;
  acceptedAt: string;
};

const decisionMap: Record<Decision, { label: string; className: string }> = {
  approved: { label: "通过", className: "bg-green-100 text-green-700" },
  rejected: { label: "打回", className: "bg-red-100 text-red-700" },
  needs_change: { label: "需修改", className: "bg-yellow-100 text-yellow-700" },
};

const deliveries = [
  { id: "dl-001", version: "v1.0.0", title: "首轮功能交付" },
  { id: "dl-002", version: "v1.1.0", title: "语音识别模块交付" },
  { id: "dl-003", version: "v1.2.0-beta", title: "报表定制功能交付" },
];

const initialRecords: AcceptanceRecord[] = [
  {
    id: "ar-001",
    deliveryVersion: "v1.0.0",
    deliveryTitle: "首轮功能交付",
    decision: "approved",
    notes: "功能符合预期，验收通过。",
    acceptedAt: "2025-04-09",
  },
  {
    id: "ar-002",
    deliveryVersion: "v1.1.0",
    deliveryTitle: "语音识别模块交付",
    decision: "needs_change",
    notes: "识别准确率未达到 95% 目标，需优化后重新提交。",
    acceptedAt: "2025-04-15",
  },
];

export default function ProjectAcceptancePage() {
  const [records, setRecords] = useState<AcceptanceRecord[]>(initialRecords);
  const [deliveryId, setDeliveryId] = useState("");
  const [decision, setDecision] = useState<Decision>("approved");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    const delivery = deliveries.find((d) => d.id === deliveryId);
    if (!delivery) {
      alert("请选择交付包");
      return;
    }
    const newRecord: AcceptanceRecord = {
      id: `ar-${String(records.length + 1).padStart(3, "0")}`,
      deliveryVersion: delivery.version,
      deliveryTitle: delivery.title,
      decision,
      notes,
      acceptedAt: new Date().toISOString().split("T")[0],
    };
    setRecords([newRecord, ...records]);
    setDeliveryId("");
    setDecision("approved");
    setNotes("");
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-base font-semibold text-gray-900">验收动作</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">选择交付包</label>
            <select
              value={deliveryId}
              onChange={(e) => setDeliveryId(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="">请选择</option>
              {deliveries.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.version} - {d.title}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">验收决策</label>
            <div className="mt-2 flex flex-wrap gap-4">
              {(
                [
                  ["approved", "通过"],
                  ["rejected", "打回"],
                  ["needs_change", "需修改"],
                ] as [Decision, string][]
              ).map(([value, label]) => (
                <label key={value} className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="decision"
                    value={value}
                    checked={decision === value}
                    onChange={() => setDecision(value)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">备注</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              placeholder="请输入验收备注"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSubmit}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            提交
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-base font-semibold text-gray-900">验收记录历史</h2>
        <div className="mt-4 overflow-hidden rounded-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">交付包</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">决策</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">备注</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">验收时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                    {r.deliveryVersion} - {r.deliveryTitle}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${decisionMap[r.decision].className}`}>
                      {decisionMap[r.decision].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{r.notes || "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{r.acceptedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
