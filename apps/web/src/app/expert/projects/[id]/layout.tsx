"use client";

import React from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const tabs = [
  { key: "overview", label: "概览", href: "overview" },
  { key: "scope", label: "Scope/报价", href: "scope" },
  { key: "change-orders", label: "变更单", href: "change-orders" },
  { key: "deliveries", label: "交付包", href: "deliveries" },
  { key: "release-proof", label: "发布证明", href: "release-proof" },
  { key: "acceptance", label: "验收记录", href: "acceptance" },
  { key: "profit", label: "利润账本", href: "profit" },
];

export default function ProjectDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const projectId = params.id as string;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/expert/projects"
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
          >
            返回
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              AI 客服系统升级
            </h1>
            <p className="text-sm text-gray-500">项目编号: {projectId}</p>
          </div>
          <span className="inline-flex rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
            进行中
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
            编辑
          </button>
          <button className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700">
            操作
          </button>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto border-b border-gray-200 pb-1">
        {tabs.map((tab) => {
          const href = `/expert/projects/${projectId}/${tab.href}`;
          const active = pathname.startsWith(href);
          return (
            <Link
              key={tab.key}
              href={href}
              className={[
                "whitespace-nowrap rounded-t-lg px-4 py-2 text-sm font-medium transition",
                active
                  ? "border-b-2 border-emerald-600 text-emerald-700"
                  : "text-gray-600 hover:text-gray-900",
              ].join(" ")}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <div>{children}</div>
    </div>
  );
}
