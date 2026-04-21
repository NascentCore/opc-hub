"use client";

import React from "react";

interface RootLayoutWrapperProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  topBar?: React.ReactNode;
}

export function RootLayoutWrapper({ children, sidebar, topBar }: RootLayoutWrapperProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {sidebar}
      <div className="flex flex-1 flex-col min-w-0">
        {topBar}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
