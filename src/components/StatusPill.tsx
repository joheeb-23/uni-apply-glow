import { Badge } from "@/components/ui/primitives";
import type { AppStatus } from "@/data/admin";

export function StatusPill({ status }: { status: AppStatus }) {
  const tone = status === "Admitted" || status === "Screening Completed" ? "success" : status === "Rejected" || status === "Pending" ? "neutral" : "brand";
  return <Badge tone={tone}>{status}</Badge>;
}
