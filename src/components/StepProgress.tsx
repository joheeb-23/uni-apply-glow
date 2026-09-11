import { Link } from "@tanstack/react-router";
import { applicationSteps, type StepKey } from "@/data/candidate";
import { cn } from "@/lib/utils";

const stepRoute: Record<StepKey, string> = {
  verification: "/verify",
  eligibility: "/eligibility",
  payment: "/payment",
  application: "/application",
  documents: "/eligibility",
  review: "/eligibility",
  submission: "/eligibility",
};

export function StepProgress({ current }: { current: StepKey }) {
  const currentIndex = applicationSteps.findIndex((s) => s.key === current);

  return (
    <div className="mx-auto max-w-7xl px-5 pt-10 lg:px-8">
      <ol className="flex flex-wrap items-center gap-y-2 gap-x-1 sm:flex-nowrap sm:overflow-x-auto">
        {applicationSteps.map((step, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <li key={step.key} className="flex items-center">
              <Link
                to={stepRoute[step.key] as "/verify"}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                  active
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-brand)]"
                    : done
                      ? "bg-primary/10 text-primary"
                      : "bg-foreground/5 text-foreground/40",
                )}
              >
                <span
                  className={cn(
                    "grid size-5 place-items-center rounded-full text-[10px] font-bold",
                    active
                      ? "bg-white/25"
                      : done
                        ? "bg-primary/20"
                        : "bg-foreground/10",
                  )}
                >
                  {done ? "✓" : i + 1}
                </span>
                {step.label}
              </Link>
              {i < applicationSteps.length - 1 && (
                <span
                  className={cn(
                    "mx-1 hidden h-px w-6 sm:block sm:w-8",
                    done ? "bg-primary/40" : "bg-foreground/10",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
