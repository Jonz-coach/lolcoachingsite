import * as React from "react";
import { cn } from "./utils";

export function Badge({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "secondary" | "outline" }) {
  const base = "inline-flex items-center rounded-2xl px-2.5 py-1 text-xs font-medium";
  const styles = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-slate-900",
    outline: "border border-slate-200 text-slate-700",
  } as const;
  return <span className={cn(base, styles[variant], className)} {...props} />;
}
