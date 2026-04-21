"use client";

import React, { useState } from "react";
import FileUpload from "@/components/ui/FileUpload";

type DeliveryStatus = "draft" | "submitted" | "under_review" | "approved" | "rejected";

type Delivery = {
  id: string;
  version: string;
  title: string;
  status: DeliveryStatus;
  summary: string;
  artifactUrl?: string;
  releaseProofUrl?: string;
  createdAt: string;
};

const statusMap: Record<DeliveryStatus, { label: string; className: string }> = {
  draft: { label: "草稿", className: "bg-gray-100 text-gray-700" },
  submitted: { label: "已提交", className: "bg-blue-100 text-blue-700" },
  under_review: { label: "审核中", className: "bg-yellow-100 text-yellow-700" },
  approved: { label: "已通过", className: "bg-green-100 text-green-700" },
  rejected: { label: "已驳回", className: "bg-red-100 text-red-700" },
};

const initialMockData: Delivery[] = [
  {
    id: "dl-001",
    version: "v1.0.0",
    title: "首轮功能交付",
    status: "approved",
    summary: "完成 NLP 模块升级与多渠道接入基础功能。",
    artifactUrl: "https://example.com/artifacts/v1.0.0",
    releaseProofUrl: "https://example.com/proof/v1.0.0",
    createdAt: "2025-04-08",
  },
  {
    id: "dl-002",
    version: "v1.1.0",
    title: "语音识别模块交付",
    status: "under_review",
    summary: "新增语音识别与合成能力，包含 ASR 引擎集成。",
    artifactUrl: "https://example.com/artifacts/v1.1.0",
    createdAt: "2025-04-14",
  },
  {
    id: "dl-003",
    version: "v1.2.0-beta",
    title: "报表定制功能交付",
    status: "draft",
    summary: "支持自定义报表模板与定时推送。",
    createdAt: "2025-04-16",
  },
];

export default function ProjectDeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(initialMockData);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    version: "",
    title: "",
    summary: "",
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleCreate = () => {
    const newDelivery: Delivery = {
      id: `dl-${String(deliveries.length + 1).padStart(3, "0")}`,
      version: form.version || "v0.0.1",
      title: form.title || "未命名交付包",
      status: "draft",
      summary: form.summary,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setDeliveries([newDelivery, ...deliveries]);
    setForm({ version: "", title: "", summary: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">交付包</h2>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            {showForm ? "取消" : "新建交付包"}
          </button>
        </div>

        {showForm && (
          <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">版本号</label>
                <input
                  type="text"
                  value={form.version}
                  onChange={(e) => setForm({ ...form, version: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder="例如 v1.0.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">标题</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder="请输入交付包标题"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">摘要说明</label>
                <textarea
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder="请输入摘要说明"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">附件</label>
                <div className="mt-1">
                  <FileUpload label="上传交付附件" />
                </div>
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
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">版本号</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">标题</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">状态</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">创建时间</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {deliveries.map((d) => (
                <React.Fragment key={d.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{d.version}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{d.title}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusMap[d.status].className}`}>
                        {statusMap[d.status].label}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{d.createdAt}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleExpand(d.id)}
                          className="text-sm text-emerald-600 hover:text-emerald-700"
                        >
                          {expandedId === d.id ? "收起" : "查看详情"}
                        </button>
                        {d.status === "draft" && (
                          <button className="text-sm text-blue-600 hover:text-blue-700">提交验收</button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedId === d.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={5} className="px-4 py-4">
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">摘要说明：</span>
                            <span className="text-gray-600">{d.summary || "—"}</span>
                          </div>
                          <div className="flex flex-wrap gap-4">
                            {d.artifactUrl ? (
                              <a
                                href={d.artifactUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-600 hover:underline"
                              >
                                附件链接
                              </a>
                            ) : (
                              <span className="text-gray-400">附件链接：暂无</span>
                            )}
                            {d.releaseProofUrl ? (
                              <a
                                href={d.releaseProofUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-600 hover:underline"
                              >
                                发布证明链接
                              </a>
                            ) : (
                              <span className="text-gray-400">发布证明链接：暂无</span>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
