import { createFileRoute } from "@tanstack/react-router";
import { BursaryView } from "@/components/BursaryView";

export const Route = createFileRoute("/bursary/acceptance-fees")({
  head: () => ({
    meta: [
      { title: "Acceptance Fees | Northbridge Bursary" },
      { name: "description", content: "Admission acceptance fee payments and revenue." },
      { property: "og:title", content: "Acceptance Fees | Northbridge Bursary" },
      { property: "og:description", content: "Admission acceptance fee payments and revenue." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <BursaryView active="Acceptance Fees" title="Acceptance Fees" presetType="Acceptance Fee" />,
});
