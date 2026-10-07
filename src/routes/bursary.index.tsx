import { createFileRoute } from "@tanstack/react-router";
import { BursaryView } from "@/components/BursaryView";

export const Route = createFileRoute("/bursary/")({
  head: () => ({
    meta: [
      { title: "Bursary Dashboard | Northbridge University" },
      { name: "description", content: "Monitor Post-UTME application and acceptance fee transactions." },
      { property: "og:title", content: "Bursary Dashboard | Northbridge University" },
      { property: "og:description", content: "Monitor Post-UTME application and acceptance fee transactions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <BursaryView active="Dashboard" title="Bursary Dashboard" />,
});
