"use client";

import React, { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

interface EntitlementGrant {
  id: string;
  name: string;
  type: string;
  source: string;
  total: number;
  available: number;
  priority: number;
  expireAt: string;
  status: "active" | "inactive" | "expired";
}

const mockGrants: EntitlementGrant[] = [
  {
    id: "1",
    name: "新手 OPC 权益包",
    type: "token",
    source: "平台赠送",
    total: 10000,
    available: 8200,
    priority: 1,
    expireAt: "2025-12-31T23:59:59Z",
    status: "active",
  },
  {
    id: "2",
    name: "季度补贴券",
    type: "coupon",
    source: "园区发放",
    total: 5000,
    available: 1200,
    priority: 2,
    expireAt: "2025-09-30T23:59:59Z",
    status: "active",
  },
  {
    id: "3",
    name: "老用户回馈包",
    type: "token",
    source: "活动奖励",
    total: 3000,
    available: 0,
    priority: 3,
    expireAt: "2025-03-01T00:00:00Z",
    status: "expired",
  },
  {
    id: "4",
    name: "测试权益包",
    type: "token",
    source: "平台赠送",
    total: 2000,
    available: 2000,
    priority: 1,
    expireAt: "2026-06-30T23:59:59Z",
    status: "inactive",
  },
];

function defaultExpireLocalOneYearAhead() {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function ParkEntitlementsPage() {
  const [grants, setGrants] = useState<EntitlementGrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [createOpen, setCreateOpen] = useState(false);
  const [createFlash, setCreateFlash] = useState(false);
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<"token" | "coupon">("token");
  const [formSource, setFormSource] = useState("园区发放");
  const [formTotal, setFormTotal] = useState(5000);
  const [formPriority, setFormPriority] = useState(1);
  const [formStatus, setFormStatus] = useState<EntitlementGrant["status"]>("active");
  const [formExpireLocal, setFormExpireLocal] = useState(defaultExpireLocalOneYearAhead);

  useEffect(() => {
    if (!createOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setCreateOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [createOpen]);

  useEffect(() => {
    // Demo load only: filters apply client-side on `grants`. When wiring a real API, call with
    // query params (statusFilter, typeFilter), setLoading(true) before fetch, and debounce if needed.
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      setGrants(mockGrants);
      setLoading(false);
    }, 400);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  const filtered = useMemo(() => {
    return grants.filter((g) => {
      const matchStatus = statusFilter ? g.status === statusFilter : true;
      const matchType = typeFilter ? g.type === typeFilter : true;
      return matchStatus && matchType;
    });
  }, [grants, statusFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  function resetCreateForm() {
    setFormName("");
    setFormType("token");
    setFormSource("园区发放");
    setFormTotal(5000);
    setFormPriority(1);
    setFormStatus("active");
    setFormExpireLocal(defaultExpireLocalOneYearAhead());
  }

  function handleOpenCreate() {
    resetCreateForm();
    setCreateOpen(true);
  }

  function handleSubmitCreate(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = formName.trim();
    if (!trimmed) return;

    const total = Math.max(0, Math.floor(Number(formTotal)));
    const priority = Math.max(1, Math.floor(Number(formPriority)));
    const expireAt = new Date(formExpireLocal).toISOString();

    const row: EntitlementGrant = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name: trimmed,
      type: formType,
      source: formSource.trim() || "园区发放",
      total,
      available: total,
      priority,
      expireAt,
      status: formStatus,
    };

    setGrants((prev) => [row, ...prev]);
    setPage(1);
    setCreateOpen(false);
    setCreateFlash(true);
    window.setTimeout(() => setCreateFlash(false), 2200);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">权益管理</h1>
          <p className="mt-1 text-sm text-gray-500">管理 OPC 权益包、配额与发放规则</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {createFlash && (
            <span className="text-sm text-green-600" role="status">
              已创建权益包（演示，未接入接口）
            </span>
          )}
          <button
            type="button"
            onClick={handleOpenCreate}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            新建权益包
          </button>
        </div>
      </div>

      {createOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-entitlement-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-gray-900/40"
            aria-label="关闭对话框"
            onClick={() => setCreateOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
            <div className="mb-4">
              <h2 id="create-entitlement-title" className="text-lg font-semibold text-gray-900">
                新建权益包
              </h2>
              <p className="mt-1 text-sm text-gray-500">填写后将在列表顶部展示，便于演示发放与筛选效果</p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmitCreate}>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">名称</span>
                <input
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className={inputClass}
                  placeholder="例如：春季园区补贴包"
                  autoFocus
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-gray-700">类型</span>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as "token" | "coupon")}
                    className={inputClass}
                  >
                    <option value="token">Token</option>
                    <option value="coupon">Coupon</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-gray-700">状态</span>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as EntitlementGrant["status"])}
                    className={inputClass}
                  >
                    <option value="active">生效中</option>
                    <option value="inactive">未生效</option>
                    <option value="expired">已过期</option>
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">来源</span>
                <input
                  value={formSource}
                  onChange={(e) => setFormSource(e.target.value)}
                  className={inputClass}
                  placeholder="平台赠送 / 园区发放 / 活动奖励"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-gray-700">总量</span>
                  <input
                    type="number"
                    min={0}
                    value={formTotal}
                    onChange={(e) => setFormTotal(Number(e.target.value))}
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-gray-700">优先级</span>
                  <input
                    type="number"
                    min={1}
                    value={formPriority}
                    onChange={(e) => setFormPriority(Number(e.target.value))}
                    className={inputClass}
                  />
                </label>
              </div>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">过期时间</span>
                <input
                  type="datetime-local"
                  value={formExpireLocal}
                  onChange={(e) => setFormExpireLocal(e.target.value)}
                  className={inputClass}
                />
              </label>
              <div className="flex flex-wrap items-center justify-end gap-2 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  创建
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <select
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">全部状态</option>
          <option value="active">生效中</option>
          <option value="inactive">未生效</option>
          <option value="expired">已过期</option>
        </select>

        <select
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">全部类型</option>
          <option value="token">Token</option>
          <option value="coupon">Coupon</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">名称</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">类型</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">来源</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">总量</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">可用量</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">优先级</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">过期时间</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">
                  加载中…
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <EmptyState title="暂无权益包" description="当前没有符合条件的权益包，可以尝试调整筛选条件或新建权益包。" />
                </td>
              </tr>
            ) : (
              paged.map((g) => (
                <tr key={g.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{g.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{g.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{g.source}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{g.total.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{g.available.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{g.priority}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatDate(g.expireAt)}</td>
                  <td className="px-4 py-3 text-sm">
                    <StatusBadge status={g.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="text-sm text-gray-500">
          共 {filtered.length} 条，第 {page} / {totalPages} 页
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            上一页
          </button>
          <button
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: EntitlementGrant["status"] }) {
  const map: Record<string, { label: string; cls: string }> = {
    active: { label: "生效中", cls: "bg-green-100 text-green-700" },
    inactive: { label: "未生效", cls: "bg-gray-100 text-gray-700" },
    expired: { label: "已过期", cls: "bg-red-100 text-red-700" },
  };
  const item = map[status] || { label: status, cls: "bg-gray-100 text-gray-700" };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${item.cls}`}>{item.label}</span>;
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}
