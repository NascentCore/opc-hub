"use client";

import React from "react";

export default function ProjectOverviewPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <section className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="text-base font-semibold text-gray-900">项目基本信息</h2>
          <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-gray-500">项目名称</dt>
              <dd className="text-sm font-medium text-gray-900">AI 客服系统升级</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">客户</dt>
              <dd className="text-sm font-medium text-gray-900">云智科技</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">行业包</dt>
              <dd className="text-sm font-medium text-gray-900">开发交付</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">状态</dt>
              <dd className="text-sm font-medium text-gray-900">
                <span className="inline-flex rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
                  进行中
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">预算</dt>
              <dd className="text-sm font-medium text-gray-900">¥120,000</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">起止日期</dt>
              <dd className="text-sm font-medium text-gray-900">2025-04-01 至 2025-06-30</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="text-base font-semibold text-gray-900">当前 Scope 摘要</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">版本号</span>
              <span className="text-sm font-medium text-gray-900">v1.2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">报价</span>
              <span className="text-sm font-medium text-gray-900">¥120,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">范围摘要</span>
              <span className="text-sm font-medium text-gray-900">智能客服 NLP 模块升级 + 多渠道接入</span>
            </div>
          </div>
        </section>
      </div>

      <aside className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-base font-semibold text-gray-900">进度/状态时间线</h2>
        <ol className="mt-4 space-y-4">
          <li className="flex gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">项目创建</p>
              <p className="text-xs text-gray-500">2025-04-01</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Scope 确认</p>
              <p className="text-xs text-gray-500">2025-04-05</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-yellow-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">开发进行中</p>
              <p className="text-xs text-gray-500">2025-04-10</p>
            </div>
          </li>
          <li className="flex gap-3 opacity-50">
            <span className="mt-1 h-2 w-2 rounded-full bg-gray-300" />
            <div>
              <p className="text-sm font-medium text-gray-900">客户验收</p>
              <p className="text-xs text-gray-500">待定</p>
            </div>
          </li>
        </ol>
      </aside>
    </div>
  );
}
