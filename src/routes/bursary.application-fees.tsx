import { createFileRoute } from "@tanstack/react-router";
import { BursaryView } from "@/components/BursaryView";

export const Route = createFileRoute("/bursary/application-fees")({
  head: () => ({
    meta: [
      { title: "Application Fees | Northbridge Bursary" },
      { name: "description", content: "Post-UTME application fee payments and revenue." },
      { property: "og:title", content: "Application Fees | Northbridge Bursary" },
      { property: "og:description", content: "Post-UTME application fee payments and revenue." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <BursaryView active="Application Fees" title="Application Fees" presetType="Post-UTME Application Fee" />,
});
