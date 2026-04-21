"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/ui/EmptyState";
// import { apiGet } from "@/lib/api";

type ProjectStatus =
  | "draft"
  | "scoped"
  | "in_progress"
  | "pending_acceptance"
  | "accepted"
  | "archived";

interface Project {
  id: string;
  name: string;
  client: string;
  industryPackage: string;
  status: ProjectStatus;
  budget: number;
  deadline: string;
}

const mockProjects: Project[] = [
  {
    id: "proj-001",
    name: "AI 客服系统升级",
    client: "云智科技",
    industryPackage: "开发交付",
    status: "in_progress",
    budget: 120000,
    deadline: "2025-06-30",
  },
  {
    id: "proj-002",
    name: "跨境电商独立站",
    client: "海潮贸易",
    industryPackage: "跨境电商",
    status: "scoped",
    budget: 85000,
    deadline: "2025-07-15",
  },
  {
    id: "proj-003",
    name: "短剧内容推荐引擎",
    client: "星影传媒",
    industryPackage: "AI短剧",
    status: "pending_acceptance",
    budget: 200000,
    deadline: "2025-05-20",
  },
];

const statusMap: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
  draft: { label: "草稿", className: "bg-gray-100 text-gray-700" },
  scoped: { label: "已Scope", className: "bg-blue-100 text-blue-700" },
  in_progress: { label: "进行中", className: "bg-yellow-100 text-yellow-700" },
  pending_acceptance: {
    label: "待验收",
    className: "bg-orange-100 text-orange-700",
  },
  accepted: { label: "已验收", className: "bg-green-100 text-green-700" },
  archived: { label: "已归档", className: "bg-gray-100 text-gray-700" },
};

export default function ExpertProjectsPage() {
  const router = useRouter();
  const [projects] = useState<Project[]>(mockProjects);
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [loading] = useState(false);

  // Fetch skeleton for future API integration
  // useEffect(() => {
  //   setLoading(true);
  //   apiGet<Project[]>("/projects")
  //     .then((data) => setProjects(data))
  //     .catch(() => setProjects(mockProjects))
  //     .finally(() => setLoading(false));
  // }, []);

  const industryOptions = useMemo(
    () => Array.from(new Set(projects.map((p) => p.industryPackage))),
    [projects]
  );

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      const matchIndustry =
        industryFilter === "all" || p.industryPackage === industryFilter;
      return matchStatus && matchIndustry;
    });
  }, [projects, statusFilter, industryFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">项目</h1>
          <p className="mt-1 text-sm text-gray-500">
            管理您参与或负责的所有项目
          </p>
        </div>
        <Link
          href="/expert/projects/new"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          新建项目
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">状态</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | "all")}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">全部</option>
            {Object.entries(statusMap).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">行业包</label>
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">全部</option>
            {industryOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="ml-auto text-sm text-gray-500">
          共 {filteredProjects.length} 条
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                项目名称
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                客户
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                行业包
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                预算
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                截止日期
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                  加载中…
                </td>
              </tr>
            ) : filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState title="暂无项目" description="当前没有符合条件的项目，可以尝试调整筛选条件或新建项目。" />
                </td>
              </tr>
            ) : (
              filteredProjects.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => router.push(`/expert/projects/${p.id}`)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {p.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {p.client}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {p.industryPackage}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span
                      className={[
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                        statusMap[p.status].className,
                      ].join(" ")}
                    >
                      {statusMap[p.status].label}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    ¥{p.budget.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {p.deadline}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50">
          上一页
        </button>
        <span className="text-sm text-gray-500">第 1 页</span>
        <button className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50">
          下一页
        </button>
      </div>
    </div>
  );
}
