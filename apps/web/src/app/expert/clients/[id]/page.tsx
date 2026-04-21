export default function ClientDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">客户详情</h1>
      <p className="text-sm text-gray-500">客户 ID: {params.id}</p>
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-600">客户详情页正在开发中，敬请期待。</p>
      </div>
    </div>
  );
}
