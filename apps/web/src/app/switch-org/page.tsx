import Link from "next/link";

export default function SwitchOrgPage() {
  const orgs = [
    { id: 1, name: "示例园区 A", role: "管理员" },
    { id: 2, name: "示例园区 B", role: "运营人员" },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-center text-2xl font-semibold text-gray-900">切换组织</h1>
        <p className="mt-2 text-center text-sm text-gray-500">请选择您要进入的组织</p>
        <div className="mt-6 space-y-3">
          {orgs.map((org) => (
            <Link
              key={org.id}
              href="/park"
              className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <div>
                <div className="font-medium text-gray-900">{org.name}</div>
                <div className="text-xs text-gray-500">{org.role}</div>
              </div>
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
