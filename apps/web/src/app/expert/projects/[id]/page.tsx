import { redirect } from "next/navigation";

export default function ProjectDetailIndexPage({
  params,
}: {
  params: { id: string };
}) {
  redirect(`/expert/projects/${params.id}/overview`);
}
