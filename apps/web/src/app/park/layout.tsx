import { RootLayoutWrapper, ParkSidebar, TopBar } from "@/components/layout";

export default function ParkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RootLayoutWrapper sidebar={<ParkSidebar />} topBar={<TopBar workspace="park" />}>
      {children}
    </RootLayoutWrapper>
  );
}
