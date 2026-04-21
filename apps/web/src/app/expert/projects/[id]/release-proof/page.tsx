"use client";

import React from "react";

type CheckStatus = "passed" | "failed" | "pending";

interface CheckItem {
  id: string;
  name: string;
  status: CheckStatus;
}

interface Blocker {
  id: string;
  title: string;
  severity: "high" | "medium" | "low";
}

const version = "v1.1.0";
const releaseStatus: CheckStatus = "passed";

const checkItems: CheckItem[] = [
  { id: "chk-001", name: "CI 构建", status: "passed" },
  { id: "chk-002", name: "单元测试", status: "passed" },
  { id: "chk-003", name: "集成测试", status: "passed" },
  { id: "chk-004", name: "安全扫描", status: "passed" },
  { id: "chk-005", name: "代码审查", status: "pending" },
  { id: "chk-006", name: "性能基线", status: "passed" },
];

const blockers: Blocker[] = [
  { id: "blk-001", title: "代码审查覆盖率未达 80%", severity: "medium" },
];

function statusBadge(status: CheckStatus) {
  if (status === "passed") {
    return (
      <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
        已通过
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
        未通过
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
      待处理
    </span>
  );
}

function statusIcon(status: CheckStatus) {
  if (status === "passed") {
    return (
      <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  if (status === "failed") {
    return (
      <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  return (
    <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default function ProjectReleaseProofPage() {
  const hasBlockers = blockers.length > 0;

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">发布证明</h2>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-sm text-gray-500">版本号</span>
              <span className="text-sm font-medium text-gray-900">{version}</span>
              <span className="text-sm text-gray-500">·</span>
              {statusBadge(releaseStatus)}
            </div>
          </div>
          <button
            onClick={() => alert("同步状态（占位）")}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            同步状态
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-gray-900">检查项列表</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {checkItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-4 py-3"
            >
              <span className="text-sm text-gray-700">{item.name}</span>
              <div className="flex items-center gap-2">
                {statusIcon(item.status)}
                <span className="text-xs text-gray-500">
                  {item.status === "passed" ? "通过" : item.status === "failed" ? "未通过" : "待处理"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {hasBlockers && (
        <section className="rounded-lg border border-red-200 bg-red-50 p-5">
          <h3 className="text-sm font-semibold text-red-800">Blocker 列表</h3>
          <ul className="mt-3 space-y-2">
            {blockers.map((b) => (
              <li key={b.id} className="flex items-center gap-2 text-sm text-red-700">
                <span className="inline-flex rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                  {b.severity === "high" ? "高" : b.severity === "medium" ? "中" : "低"}
                </span>
                <span>{b.title}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-gray-900">门禁对接说明</h3>
        <p className="mt-2 text-sm text-gray-500">
          此页面数据来自 LaunchGate / 发布门禁系统，自动校验发布前置条件与合规检查。
        </p>
      </section>
    </div>
  );
}
