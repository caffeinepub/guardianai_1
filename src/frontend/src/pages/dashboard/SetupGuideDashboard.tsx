import SetupGuidePage from "../SetupGuidePage";
import { useDashboard } from "./DashboardLayout";

export default function SetupGuideDashboard() {
  const { selectedChild } = useDashboard();
  return <SetupGuidePage selectedChild={selectedChild} />;
}
