"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TopBarProps {
  workspace: "park" | "expert";
  orgName?: string;
}

export function TopBar({ workspace, orgName = "示例园区" }: TopBarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const workspaceMenuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstItemRef = useRef<HTMLAnchorElement | null>(null);
  const menuId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      setOpen(false);
      queueMicrotask(() => triggerRef.current?.focus());
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      const el = workspaceMenuRef.current;
      if (!el || el.contains(e.target as Node)) return;
      setOpen(false);
      queueMicrotask(() => triggerRef.current?.focus());
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => firstItemRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">当前组织</span>
        <span className="font-medium text-gray-900">{orgName}</span>
      </div>

      <div className="flex items-center gap-4">
        <div ref={workspaceMenuRef} className="relative">
          <button
            ref={triggerRef}
            id={`${menuId}-trigger`}
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
            aria-expanded={open}
            aria-haspopup="menu"
            aria-controls={`${menuId}-panel`}
          >
            <span className={workspace === "park" ? "text-blue-600" : "text-emerald-600"}>
              {workspace === "park" ? "园区/机构工作面" : "OPC专家工作面"}
            </span>
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {open && (
            <div
              id={`${menuId}-panel`}
              role="menu"
              aria-labelledby={`${menuId}-trigger`}
              className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
            >
              <Link
                ref={firstItemRef}
                href="/park"
                role="menuitem"
                tabIndex={0}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              >
                园区/机构工作面
              </Link>
              <Link
                href="/expert"
                role="menuitem"
                tabIndex={0}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              >
                OPC专家工作面
              </Link>
            </div>
          )}
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-700">
          用
        </div>
      </div>
    </header>
  );
}
