import type { ReactNode } from "react";

type AppHeaderProps = {
  title: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  variant?: "light" | "dark";
};

const variants = {
  light: { bar: "bg-t-surface border-t-border-subtle", title: "text-t-text-primary" },
  dark: { bar: "bg-zinc-900 border-white/10", title: "text-white" },
};

// Shared top-level header: equal-width side slots keep the title optically centered.
export function AppHeader({ title, left, right, variant = "light" }: AppHeaderProps) {
  const v = variants[variant];
  return (
    <header
      className={`${v.bar} border-b px-4 flex items-center justify-between flex-none`}
      style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)", paddingBottom: "12px" }}
    >
      <div className="w-12 flex items-center justify-start">{left}</div>
      <div className={`min-w-0 flex-1 flex items-center justify-center ${v.title}`}>
        {typeof title === "string" ? <h1 className="text-lg truncate">{title}</h1> : title}
      </div>
      <div className="w-12 flex items-center justify-end">{right}</div>
    </header>
  );
}
