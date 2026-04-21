"use client";

import React, { useMemo, useState } from "react";

interface Team {
  id: string;
  name: string;
  leader: string;
  activeProjects: number;
  monthlySpend: number;
  totalBalance: number;
  status: "active" | "inactive";
}

const mockTeams: Team[] = [
  {
    id: "t1",
    name: "云智交付团队",
    leader: "张伟",
    activeProjects: 5,
    monthlySpend: 128000,
    totalBalance: 450000,
    status: "active",
  },
  {
    id: "t2",
    name: "海潮电商组",
    leader: "李娜",
    activeProjects: 3,
    monthlySpend: 86000,
    totalBalance: 210000,
    status: "active",
  },
  {
    id: "t3",
    name: "星影内容引擎",
    leader: "王强",
    activeProjects: 2,
    monthlySpend: 54000,
    totalBalance: 180000,
    status: "active",
  },
  {
    id: "t4",
    name: "创新工场 B",
    leader: "赵敏",
    activeProjects: 0,
    monthlySpend: 0,
    totalBalance: 95000,
    status: "inactive",
  },
  {
    id: "t5",
    name: "科技园 C 组",
    leader: "刘洋",
    activeProjects: 1,
    monthlySpend: 32000,
    totalBalance: 120000,
    status: "active",
  },
];

export default function ParkTeamsPage() {
  const [teams] = useState<Team[]>(mockTeams);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const filteredTeams = useMemo(() => {
    if (statusFilter === "all") return teams;
    return teams.filter((t) => t.status === statusFilter);
  }, [teams, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">OPC 团队</h1>
          <p className="mt-1 text-sm text-gray-500">查看与管理入驻园区的 OPC 专家团队</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          新建团队
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">状态</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="all">全部</option>
            <option value="active">活跃</option>
            <option value="inactive">停用</option>
          </select>
        </div>
        <div className="ml-auto text-sm text-gray-500">共 {filteredTeams.length} 条</div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">团队名称</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">负责人</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">活跃项目数</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">本月消耗</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">总余额</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">状态</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredTeams.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{t.name}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{t.leader}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{t.activeProjects}</td>
                <td className="px-4 py-3 text-sm text-gray-700">¥{t.monthlySpend.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-gray-700">¥{t.totalBalance.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={[
                      "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                      t.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700",
                    ].join(" ")}
                  >
                    {t.status === "active" ? "活跃" : "停用"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700">查看详情</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
