"use client";

import React, { useEffect, useState } from "react";

interface GrantRecord {
  id: string;
  name: string;
  type: string;
  recipientOrg: string;
  quantity: number;
  grantedAt: string;
  operator: string;
}

const mockRecords: GrantRecord[] = [
  {
    id: "1",
    name: "Q1 补贴发放",
    type: "token",
    recipientOrg: "智慧园区 A",
    quantity: 5000,
    grantedAt: "2025-01-15T10:30:00Z",
    operator: "admin",
  },
  {
    id: "2",
    name: "新客户激励",
    type: "coupon",
    recipientOrg: "创新工场 B",
    quantity: 2000,
    grantedAt: "2025-02-10T14:20:00Z",
    operator: "liwei",
  },
  {
    id: "3",
    name: "季度奖励",
    type: "token",
    recipientOrg: "科技园 C",
    quantity: 8000,
    grantedAt: "2025-03-05T09:00:00Z",
    operator: "admin",
  },
];

export default function ParkGrantRecordsPage() {
  const [records, setRecords] = useState<GrantRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: replace with real API call
    // import { apiGet } from "@/lib/api";
    // apiGet<GrantRecord[]>("/grant-records").then(setRecords).finally(() => setLoading(false));
    const timer = setTimeout(() => {
      setRecords(mockRecords);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">发放记录</h1>
          <p className="mt-1 text-sm text-gray-500">查看权益发放历史与操作记录</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          新建发放
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">发放名称</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">类型</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">接收组织</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">数量</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">发放时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">操作人</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                  加载中…
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                  暂无数据
                </td>
              </tr>
            ) : (
              records.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{r.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{r.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{r.recipientOrg}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{r.quantity.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatDate(r.grantedAt)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{r.operator}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}
