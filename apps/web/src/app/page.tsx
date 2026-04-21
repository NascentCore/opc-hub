import { APP_NAME, Workspace } from "@opc/shared";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="w-full max-w-xl rounded-2xl border border-white/50 bg-white/80 p-10 shadow-xl backdrop-blur">
        <h1 className="text-center text-4xl font-extrabold tracking-tight text-gray-900">
          {APP_NAME}
        </h1>
        <p className="mt-3 text-center text-lg text-gray-600">
          Sprint 1 底座骨架已就绪
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a
            href="/park"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
          >
            园区/机构工作面
            <span className="ml-2 rounded-full bg-blue-500/30 px-2 py-0.5 text-xs">
              {Workspace.PARK}
            </span>
          </a>
          <a
            href="/expert"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md"
          >
            OPC 专家工作面
            <span className="ml-2 rounded-full bg-emerald-500/30 px-2 py-0.5 text-xs">
              {Workspace.EXPERT}
            </span>
          </a>
        </div>
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
          <a href="/login" className="hover:text-gray-900 hover:underline">
            登录
          </a>
          <span className="h-4 w-px bg-gray-300" />
          <a href="/switch-org" className="hover:text-gray-900 hover:underline">
            切换组织
          </a>
        </div>
      </div>
    </main>
  );
}
