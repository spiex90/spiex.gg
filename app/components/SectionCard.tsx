import { ReactNode } from "react";

export default function SectionCard({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <section className="glass-card gradient-border p-5 sm:p-6">
      {title && (
        <h2 className="text-lg font-bold mb-4">{title}</h2>
      )}
      <div>{children}</div>
    </section>
  );
}
