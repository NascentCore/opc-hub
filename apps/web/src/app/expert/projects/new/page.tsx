"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { apiPost } from "@/lib/api";

const mockClients = [
  { id: "client-001", name: "云智科技" },
  { id: "client-002", name: "海潮贸易" },
  { id: "client-003", name: "星影传媒" },
];

const industryPackages = ["开发交付", "跨境电商", "AI短剧"];

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [clientId, setClientId] = useState("");
  const [industryPackage, setIndustryPackage] = useState(industryPackages[0]);
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);

    // Skeleton for real API call:
    // try {
    //   const res = await apiPost<{ id: string }>("/projects", {
    //     name,
    //     clientId,
    //     industryPackage,
    //     budget: Number(budget),
    //     deadline,
    //   });
    //   router.push(`/expert/projects/${res.id}`);
    // } catch (err) {
    //   alert("创建失败，请重试");
    // } finally {
    //   setSubmitting(false);
    // }

    // Mock success flow
    setTimeout(() => {
      setSuccess(true);
      setSubmitting(false);
      setTimeout(() => {
        router.push("/expert/projects/mock-new-id");
      }, 800);
    }, 600);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">新建项目</h1>
        <p className="mt-1 text-sm text-gray-500">填写项目基本信息并创建项目</p>
      </div>

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          项目创建成功，正在跳转…
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              项目名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              placeholder="请输入项目名称"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">选择客户</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="">请选择客户</option>
              {mockClients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">行业包</label>
            <div className="mt-2 flex flex-wrap gap-3">
              {industryPackages.map((pkg) => (
                <label
                  key={pkg}
                  className={[
                    "inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm",
                    industryPackage === pkg
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name="industryPackage"
                    value={pkg}
                    checked={industryPackage === pkg}
                    onChange={() => setIndustryPackage(pkg)}
                    className="hidden"
                  />
                  {pkg}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">预算金额</label>
            <input
              type="number"
              min={0}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              placeholder="请输入预算金额"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">截止日期</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/expert/projects"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            取消
          </Link>
          <button
            type="submit"
            disabled={submitting || !name.trim()}
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {submitting ? "提交中…" : "提交"}
          </button>
        </div>
      </form>
    </div>
  );
}
