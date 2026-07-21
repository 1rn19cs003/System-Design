export interface QAItem {
  q: string;
  a: React.ReactNode;
}

export default function QA({ items }: { items: QAItem[] }) {
  return (
    <>
      {items.map((item, i) => (
        <details className="qa" key={i}>
          <summary>{item.q}</summary>
          <div className="qa-answer">
            <p>{item.a}</p>
          </div>
        </details>
      ))}
    </>
  );
}
