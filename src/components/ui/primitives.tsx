import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "glass" | "ghost" | "ink";

const buttonBase =
  "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition disabled:opacity-60";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground shadow-[var(--shadow-brand)] hover:bg-primary/90",
  glass: "frost border border-white/50 bg-white/50 text-foreground/80 hover:bg-white/70",
  ghost: "text-foreground/60 hover:text-primary",
  ink: "bg-foreground text-background hover:bg-foreground/90",
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button className={cn(buttonBase, buttonVariants[variant], className)} {...props} />;
}

export function Card({
  children,
  className,
  elevated = false,
}: {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
}) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-5",
        elevated ? "edge rounded-3xl p-6" : "edge-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

type BadgeTone = "brand" | "success" | "neutral";

const badgeTones: Record<BadgeTone, string> = {
  brand: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  neutral: "bg-foreground/5 text-foreground/60",
};

export function Badge({
  children,
  tone = "brand",
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Alert({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "frost rounded-2xl border border-warning-border bg-warning-surface/60 p-4 text-sm text-warning-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

const fieldClass =
  "mt-2 w-full rounded-xl border border-white/60 bg-white/70 px-4 py-3 text-sm text-foreground outline-none placeholder:text-foreground/30 focus:border-primary/40";

export function Field({
  label,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="text-xs font-semibold text-foreground/50">{label}</span>
      <input className={fieldClass} {...props} />
    </label>
  );
}

export function TextField({
  label,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="text-xs font-semibold text-foreground/50">{label}</span>
      <textarea className={cn(fieldClass, "resize-none")} {...props} />
    </label>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm">
      <div className="glass edge w-full max-w-md rounded-3xl p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-bold tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-lg px-2 text-foreground/50 transition hover:text-primary"
          >
            ✕
          </button>
        </div>
        <div className="mt-3 text-sm text-foreground/70">{children}</div>
        <Button className="mt-5 w-full" onClick={onClose}>
          Got it
        </Button>
      </div>
    </div>
  );
}
