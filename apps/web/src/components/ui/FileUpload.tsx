"use client";

import React from "react";

export default function FileUpload({ label = "上传文件" }: { label?: string }) {
  return (
    <div
      onClick={() => alert("文件选择功能占位")}
      className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center hover:bg-gray-100"
    >
      <svg
        className="mb-2 h-8 w-8 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="mt-1 text-xs text-gray-500">点击或拖拽上传文件</p>
    </div>
  );
}
