import { DashboardLayout } from "@/components/DashboardLayout";
import { VideoSettingsPage } from "./VideoSettingsPage";

export function SettingsPage() {
  return (
    <DashboardLayout 
      title="Settings" 
      breadcrumbs={[{ label: "Settings" }]}
    >
      <VideoSettingsPage />
    </DashboardLayout>
  );
}