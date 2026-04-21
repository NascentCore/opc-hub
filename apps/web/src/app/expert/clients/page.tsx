"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/ui/EmptyState";

interface Client {
  id: string;
  name: string;
  contact: string;
  email: string;
  status: "active" | "inactive";
}

const mockClients: Client[] = [
  {
    id: "client-001",
    name: "云智科技",
    contact: "张经理",
    email: "zhang@yunzhi.com",
    status: "active",
  },
  {
    id: "client-002",
    name: "海潮贸易",
    contact: "李总监",
    email: "li@haichao.com",
    status: "active",
  },
  {
    id: "client-003",
    name: "星影传媒",
    contact: "王主管",
    email: "wang@xingying.com",
    status: "inactive",
  },
];

export default function ExpertClientsPage() {
  const router = useRouter();
  const [clients] = useState<Client[]>(mockClients);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">客户与交付</h1>
          <p className="mt-1 text-sm text-gray-500">
            维护客户关系、跟踪交付物与里程碑
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
          新建客户
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                客户名称
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                联系人
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                联系邮箱
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {clients.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <EmptyState title="暂无客户" description="当前没有客户数据，可以先新建客户。" />
                </td>
              </tr>
            ) : (
              clients.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                <td
                  onClick={() => router.push(`/expert/clients/${c.id}`)}
                  className="cursor-pointer whitespace-nowrap px-6 py-4 text-sm font-medium text-emerald-700 hover:underline"
                >
                  {c.name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                  {c.contact}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                  {c.email}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span
                    className={[
                      "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                      c.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700",
                    ].join(" ")}
                  >
                    {c.status === "active" ? "活跃" : "停用"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <Link
                    href={`/expert/clients/${c.id}`}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    查看
                  </Link>
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
