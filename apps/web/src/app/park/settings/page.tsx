"use client";

import React, { useState } from "react";

type SettlementCycle = "monthly" | "biweekly" | "weekly";

export default function ParkSettingsPage() {
  const [parkDisplayName, setParkDisplayName] = useState("示例园区");
  const [parkShortName, setParkShortName] = useState("示例园");
  const [adminEmail, setAdminEmail] = useState("park-admin@example.com");
  const [supportLine, setSupportLine] = useState("400-000-0000");

  const [redemptionWarnPercent, setRedemptionWarnPercent] = useState(50);
  const [expiryRemindDays, setExpiryRemindDays] = useState(14);
  const [blockGrantWhenOverBudget, setBlockGrantWhenOverBudget] = useState(true);

  const [monthlySubsidyCap, setMonthlySubsidyCap] = useState(500000);
  const [settlementCycle, setSettlementCycle] = useState<SettlementCycle>("monthly");
  const [reportDayOfMonth, setReportDayOfMonth] = useState(5);

  const [notifySettlement, setNotifySettlement] = useState(true);
  const [notifyRisk, setNotifyRisk] = useState(true);
  const [notifyLowRedemption, setNotifyLowRedemption] = useState(false);
  const [notifyDigest, setNotifyDigest] = useState(true);

  const [grantRequiresApprovalAbove, setGrantRequiresApprovalAbove] = useState(100000);
  const [requireTwoPersonForGrant, setRequireTwoPersonForGrant] = useState(false);

  const [savedFlash, setSavedFlash] = useState(false);

  function handleSave() {
    // TODO: POST /api/v1/park/settings
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2200);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">系统设置</h1>
          <p className="mt-1 text-sm text-gray-500">
            配置园区信息、权限策略与通知偏好，并与权益、核销、结算等模块策略保持一致
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {savedFlash && (
            <span className="text-sm text-green-600" role="status">
              已保存（演示，未接入接口）
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            保存设置
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsCard
          title="园区档案"
          description="面向 OPC 团队与结算侧展示的园区标识与对外联络方式"
        >
          <Field label="园区展示名称">
            <input
              type="text"
              value={parkDisplayName}
              onChange={(e) => setParkDisplayName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </Field>
          <Field label="简称 / 缩写">
            <input
              type="text"
              value={parkShortName}
              onChange={(e) => setParkShortName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="用于报表与列表紧凑展示"
            />
          </Field>
          <Field label="园区运营邮箱">
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </Field>
          <Field label="对外客服热线">
            <input
              type="text"
              value={supportLine}
              onChange={(e) => setSupportLine(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </Field>
        </SettingsCard>

        <SettingsCard
          title="权益与核销策略"
          description="与「权益管理」「使用与核销」联动的预警与管控规则"
        >
          <Field label="核销率低于阈值时预警" hint={`当前：低于 ${redemptionWarnPercent}%`}>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={10}
                max={90}
                step={5}
                value={redemptionWarnPercent}
                onChange={(e) => setRedemptionWarnPercent(Number(e.target.value))}
                className="h-2 flex-1 cursor-pointer accent-blue-600"
              />
              <span className="w-12 text-right text-sm font-medium text-gray-900">
                {redemptionWarnPercent}%
              </span>
            </div>
          </Field>
          <Field label="权益到期提前提醒（天）">
            <input
              type="number"
              min={1}
              max={90}
              value={expiryRemindDays}
              onChange={(e) => setExpiryRemindDays(Number(e.target.value))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </Field>
          <ToggleRow
            checked={blockGrantWhenOverBudget}
            onChange={setBlockGrantWhenOverBudget}
            title="超出月度补贴预算时暂停新建发放"
            subtitle="避免透支园区补贴额度；可与下方预算上限联动"
          />
        </SettingsCard>

        <SettingsCard
          title="结算与预算"
          description="对接「结算与报表」与园区总览中的补贴与支出口径"
        >
          <Field label="月度补贴预算上限（元）">
            <input
              type="number"
              min={0}
              step={10000}
              value={monthlySubsidyCap}
              onChange={(e) => setMonthlySubsidyCap(Number(e.target.value))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </Field>
          <Field label="结算周期">
            <select
              value={settlementCycle}
              onChange={(e) => setSettlementCycle(e.target.value as SettlementCycle)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="monthly">按月结算</option>
              <option value="biweekly">按双周结算</option>
              <option value="weekly">按周结算</option>
            </select>
          </Field>
          <Field label="自动生成报表日（每月）" hint="结算确认后推送报表与通知">
            <input
              type="number"
              min={1}
              max={28}
              value={reportDayOfMonth}
              onChange={(e) => setReportDayOfMonth(Number(e.target.value))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </Field>
        </SettingsCard>

        <SettingsCard
          title="通知偏好"
          description="园区运营侧接收的关键事件；后续可对接邮件与站内信"
        >
          <ToggleRow
            checked={notifySettlement}
            onChange={setNotifySettlement}
            title="结算与对账完成"
            subtitle="生成结算单、对账差异时提醒"
          />
          <ToggleRow
            checked={notifyRisk}
            onChange={setNotifyRisk}
            title="风险与预算预警"
            subtitle="核销率异常、补贴接近预算上限等"
          />
          <ToggleRow
            checked={notifyLowRedemption}
            onChange={setNotifyLowRedemption}
            title="连续低核销"
            subtitle="与核销率阈值策略一致，避免静默恶化"
          />
          <ToggleRow
            checked={notifyDigest}
            onChange={setNotifyDigest}
            title="每周运营摘要"
            subtitle="汇总发放、核销与团队活跃概况"
          />
        </SettingsCard>

        <SettingsCard
          title="协作与审批"
          description="与「发放记录」「OPC 团队」协作时的最小管控策略"
          className="lg:col-span-2"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <Field
                label="单笔发放超过金额需审批（元）"
                hint="0 表示不启用金额门槛审批"
              >
                <input
                  type="number"
                  min={0}
                  step={10000}
                  value={grantRequiresApprovalAbove}
                  onChange={(e) => setGrantRequiresApprovalAbove(Number(e.target.value))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </Field>
            </div>
            <div className="flex items-end pb-1">
              <ToggleRow
                checked={requireTwoPersonForGrant}
                onChange={setRequireTwoPersonForGrant}
                title="大额发放双人复核"
                subtitle="超过审批门槛时，需另一名园区管理员确认"
              />
            </div>
          </div>
          <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-gray-600">
            说明：以上为园区侧策略占位，落地时需与组织成员角色、审计日志一并接入后端。
          </p>
        </SettingsCard>
      </div>
    </div>
  );
}

function SettingsCard({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        "rounded-xl border border-gray-200 bg-white p-5 shadow-sm",
        className,
      ].join(" ")}
    >
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {hint ? <span className="text-xs text-gray-400">{hint}</span> : null}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function ToggleRow({
  checked,
  onChange,
  title,
  subtitle,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  title: string;
  subtitle: string;
}) {
  const id = React.useId();
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 transition hover:bg-gray-100"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span>
        <span className="block text-sm font-medium text-gray-900">{title}</span>
        <span className="mt-0.5 block text-xs text-gray-500">{subtitle}</span>
      </span>
    </label>
  );
}
