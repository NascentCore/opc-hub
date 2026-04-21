"use client";

import React, { useEffect, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";

interface WalletSummary {
  balance: number;
  currency: string;
}

interface EntitlementItem {
  id: string;
  name: string;
  balance: number;
  unit: string;
}

interface UsageRecord {
  id: string;
  usedAt: string;
  project: string;
  amount: number;
  traceId: string;
}

const mockWallet: WalletSummary = {
  balance: 128500,
  currency: "CNY",
};

const mockEntitlements: EntitlementItem[] = [
  { id: "1", name: "OPC Token", balance: 8500, unit: "个" },
  { id: "2", name: "算力券", balance: 120, unit: "张" },
  { id: "3", name: "存储券", balance: 450, unit: "GB" },
];

const mockUsageRecords: UsageRecord[] = [
  { id: "1", usedAt: "2025-04-10T09:30:00Z", project: "项目 A", amount: 500, traceId: "trace-001" },
  { id: "2", usedAt: "2025-04-12T14:20:00Z", project: "项目 B", amount: 1200, traceId: "trace-002" },
  { id: "3", usedAt: "2025-04-14T11:00:00Z", project: "项目 A", amount: 300, traceId: "trace-003" },
];

export default function ExpertWalletPage() {
  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [entitlements, setEntitlements] = useState<EntitlementItem[]>([]);
  const [usageRecords, setUsageRecords] = useState<UsageRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: replace with real API calls
    // import { apiGet } from "@/lib/api";
    // Promise.all([
    //   apiGet<WalletSummary>("/wallet"),
    //   apiGet<EntitlementItem[]>("/wallet/entitlements"),
    //   apiGet<UsageRecord[]>("/usage-records"),
    // ]).then(([w, e, u]) => {
    //   setWallet(w);
    //   setEntitlements(e);
    //   setUsageRecords(u);
    // }).finally(() => setLoading(false));
    const timer = setTimeout(() => {
      setWallet(mockWallet);
      setEntitlements(mockEntitlements);
      setUsageRecords(mockUsageRecords);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">我的钱包</h1>
        <p className="mt-1 text-sm text-gray-500">查看余额、权益明细与使用记录</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-sm text-gray-500">余额总览</div>
        <div className="mt-2 text-4xl font-bold text-gray-900">
          {loading ? "-" : `¥${wallet?.balance.toLocaleString() ?? 0}`}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="text-sm text-gray-500">加载中…</div>
                <div className="mt-2 text-2xl font-bold text-gray-900">-</div>
              </div>
            ))
          : entitlements.map((e) => (
              <div key={e.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="text-sm text-gray-500">{e.name}</div>
                <div className="mt-2 text-2xl font-bold text-gray-900">
                  {e.balance.toLocaleString()} <span className="text-base font-normal text-gray-500">{e.unit}</span>
                </div>
              </div>
            ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">使用记录</h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">项目</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">用量</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">trace_id</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
                    加载中…
                  </td>
                </tr>
              ) : usageRecords.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <EmptyState title="暂无使用记录" description="当前没有权益使用记录。" />
                  </td>
                </tr>
              ) : (
                usageRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">{formatDate(r.usedAt)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{r.project}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{r.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-500">{r.traceId}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
        <div className="text-sm font-medium text-gray-700">项目维度消耗</div>
        <div className="mt-1 text-xs text-gray-500">占位卡片：后续将展示各项目下的权益消耗统计图表</div>
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
