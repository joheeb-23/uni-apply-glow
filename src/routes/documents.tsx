import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Badge, Button, Card } from "@/components/ui/primitives";
import { requiredDocuments } from "@/data/documents";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Document Upload | Northbridge University" },
      {
        name: "description",
        content:
          "Upload your passport photograph, O'Level result, JAMB result, birth certificate, NIN slip and other required documents.",
      },
      { property: "og:title", content: "Document Upload | Northbridge University" },
      {
        property: "og:description",
        content:
          "Upload your passport photograph, O'Level result, JAMB result, birth certificate, NIN slip and other required documents.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DocumentsPage,
});

type UploadedFile = { name: string; previewUrl: string | null };

const initialUploads: Record<string, UploadedFile> = {
  passport: { name: "passport-photo.jpg", previewUrl: null },
  olevel: { name: "waec-result.pdf", previewUrl: null },
  jamb: { name: "jamb-result-slip.pdf", previewUrl: null },
};

function DocumentsPage() {
  const [uploads, setUploads] = useState<Record<string, UploadedFile>>(initialUploads);
  const [notice, setNotice] = useState<string | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const uploadedCount = requiredDocuments.filter((d) => d.required && uploads[d.key]).length;
  const requiredCount = requiredDocuments.filter((d) => d.required).length;

  const handleFile = (key: string, name: string, file: File | null) => {
    const previewUrl = file && file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
    setUploads((u) => ({ ...u, [key]: { name, previewUrl } }));
    setNotice(`"${name}" uploaded successfully.`);
  };

  const pickFile = (key: string) => {
    inputRefs.current[key]?.click();
  };

  const onFileChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFile(key, file.name, file);
    e.target.value = "";
  };

  const simulateUpload = (key: string, name: string) => {
    handleFile(key, name, null);
  };

  const remove = (key: string) => {
    setUploads((u) => {
      const next = { ...u };
      delete next[key];
      return next;
    });
    setNotice(null);
  };

  return (
    <DashboardShell active="Documents">
      <div className="space-y-6">
        <Card elevated>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Documents</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Document Upload</h1>
              <p className="mt-1 text-sm text-foreground/60">
                Upload clear scans of each required document. Files are simulated in this prototype.
              </p>
            </div>
            <Badge tone={uploadedCount === requiredCount ? "success" : "brand"}>
              {uploadedCount}/{requiredCount} required uploaded
            </Badge>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.round((uploadedCount / requiredCount) * 100)}%` }}
            />
          </div>
        </Card>

        {notice && (
          <div className="frost rounded-2xl border border-success/30 bg-success/10 p-4 text-sm font-semibold text-success">
            {notice}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          {requiredDocuments.map((doc) => {
            const upload = uploads[doc.key];
            return (
              <Card key={doc.key}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold tracking-tight">{doc.name}</p>
                    <p className="mt-0.5 text-xs text-foreground/50">{doc.hint}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <Badge tone={doc.required ? "brand" : "neutral"}>
                      {doc.required ? "Required" : "Optional"}
                    </Badge>
                    <Badge tone={upload ? "success" : "neutral"}>
                      {upload ? "Uploaded" : "Pending"}
                    </Badge>
                  </div>
                </div>

                <input
                  ref={(el) => {
                    inputRefs.current[doc.key] = el;
                  }}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  aria-label={`Upload ${doc.name}`}
                  onChange={onFileChange(doc.key)}
                />

                <button
                  type="button"
                  onClick={() => pickFile(doc.key)}
                  className={cn(
                    "mt-4 flex w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed p-6 text-center transition",
                    upload
                      ? "border-success/40 bg-success/5"
                      : "border-primary/30 bg-white/50 hover:border-primary/50 hover:bg-white/70",
                  )}
                >
                  {upload?.previewUrl ? (
                    <img
                      src={upload.previewUrl}
                      alt={`Preview of ${upload.name}`}
                      className="mb-2 size-16 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="text-xl" aria-hidden>
                      {upload ? "✓" : "⬆"}
                    </span>
                  )}
                  <span className="text-sm font-semibold text-foreground/70">
                    {upload ? upload.name : "Click to choose a file"}
                  </span>
                  <span className="text-xs text-foreground/40">
                    {upload ? "Uploaded successfully" : "PDF, JPG or PNG · demo only, nothing is sent anywhere"}
                  </span>
                </button>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {upload ? (
                    <>
                      <Button variant="glass" className="px-4 py-2" onClick={() => pickFile(doc.key)}>
                        Replace
                      </Button>
                      <Button
                        variant="ghost"
                        className="px-4 py-2 text-destructive hover:text-destructive"
                        onClick={() => remove(doc.key)}
                      >
                        Remove
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button className="px-4 py-2" onClick={() => pickFile(doc.key)}>
                        Upload
                      </Button>
                      <Button
                        variant="ghost"
                        className="px-4 py-2"
                        onClick={() => simulateUpload(doc.key, `${doc.name.toLowerCase().replace(/[^a-z]+/g, "-")}.pdf`)}
                      >
                        Simulate upload
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <p className="text-center text-xs text-foreground/50">
          Prototype only — selected files stay in your browser and are never uploaded.
        </p>
      </div>
    </DashboardShell>
  );
}
