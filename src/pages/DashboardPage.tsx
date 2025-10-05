import { DashboardLayout } from "@/components/DashboardLayout"
import DashboardOverview from "./DashboardOverview"

export function DashboardPage() {
  return (
    <DashboardLayout 
      title="Dashboard" 
      breadcrumbs={[{ label: "Overview" }]}
    >
      <DashboardOverview />
    </DashboardLayout>
  )
}