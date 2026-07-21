export function Callout({
  kind,
  title,
  children,
}: {
  kind: 'good' | 'bad';
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`callout ${kind}`}>
      <div className="callout-title">{title}</div>
      {children}
    </div>
  );
}

export function TwoCol({ children }: { children: React.ReactNode }) {
  return <div className="two-col">{children}</div>;
}
