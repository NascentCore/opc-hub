import { RootLayoutWrapper, ExpertSidebar, TopBar } from "@/components/layout";

export default function ExpertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RootLayoutWrapper sidebar={<ExpertSidebar />} topBar={<TopBar workspace="expert" />}>
      {children}
    </RootLayoutWrapper>
  );
}
