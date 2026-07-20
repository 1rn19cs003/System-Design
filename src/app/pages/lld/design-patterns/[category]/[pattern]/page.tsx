import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SidebarTOC from '@/components/SidebarTOC';
import Breadcrumbs from '@/components/Breadcrumbs';
import CodeTerminal from '@/components/CodeTerminal';
import { PATTERNS_DATA } from '@/data/patternsData';

interface PageProps {
  params: {
    category: string;
    pattern: string;
  };
}

export function generateStaticParams() {
  return Object.values(PATTERNS_DATA).map((item) => ({
    category: item.category,
    pattern: item.slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const item = PATTERNS_DATA[params.pattern];
  if (!item) return { title: 'Design Pattern — System Design' };
  return {
    title: `${item.title} — System Design Architectures`,
    description: item.description,
  };
}

const tocItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'plain-english', label: 'In Plain English' },
  { id: 'theory', label: 'Theory & Diagrams' },
  { id: 'trade-offs', label: 'Trade-offs' },
  { id: 'real-world', label: 'Real-World Examples' },
  { id: 'interview-questions', label: 'Interview Questions' },
  { id: 'code', label: 'Code & Output' },
];

export default function DesignPatternPage({ params }: PageProps) {
  const item = PATTERNS_DATA[params.pattern];

  if (!item) {
    notFound();
  }

  return (
    <div className="layout">
      <SidebarTOC backLink={{ href: '/', label: '← Back to guide' }} items={tocItems} />
      <main className="content">
        <Breadcrumbs
          items={[
            { label: 'LLD', href: '/pages/lld/oop-fundamentals' },
            { label: 'Design Patterns', href: '/' },
            { label: item.title },
          ]}
        />

        <span className="tag">{item.tag}</span>
        <h1 id="overview">{item.title}</h1>
        <p>{item.description}</p>

        <section id="plain-english">
          <h2>In Plain English</h2>
          <p>{item.plainEnglish}</p>
        </section>

        <section id="theory">
          <h2>Theory &amp; Diagrams</h2>
          <p>{item.theory}</p>
          {item.umlDiagramSvg && (
            <figure>
              <img className="diagram-img" src={item.umlDiagramSvg} alt={`${item.title} UML Diagram`} />
              <figcaption>{item.title} UML Class Diagram</figcaption>
            </figure>
          )}
        </section>

        <section id="trade-offs">
          <h2>Trade-offs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div className="callout" style={{ background: '#eef8f0', borderColor: '#bfe3c6' }}>
              <div style={{ fontWeight: 600, color: '#2f8f4e', marginBottom: '6px' }}>✓ Good Use Cases</div>
              <ul>
                {item.goodUseCases.map((useCase, index) => (
                  <li key={index}>{useCase}</li>
                ))}
              </ul>
            </div>
            <div className="callout" style={{ background: '#fdedec', borderColor: '#f3bcb8' }}>
              <div style={{ fontWeight: 600, color: '#c0392b', marginBottom: '6px' }}>✕ When NOT to Use</div>
              <ul>
                {item.badUseCases.map((useCase, index) => (
                  <li key={index}>{useCase}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="real-world">
          <h2>Real-World Examples</h2>
          <ul>
            {item.realWorldExamples.map((ex, index) => (
              <li key={index}>{ex}</li>
            ))}
          </ul>
        </section>

        <section id="interview-questions">
          <h2>Interview Questions</h2>
          {item.interviewQuestions.map((q, index) => (
            <details
              key={index}
              className="qa"
              style={{
                border: '1px solid var(--border)',
                borderRadius: '8px',
                marginBottom: '12px',
                padding: '12px 16px',
              }}
            >
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>{q.question}</summary>
              <p style={{ marginTop: '8px' }}>{q.answer}</p>
            </details>
          ))}
        </section>

        <section id="code">
          <h2>Code &amp; Output</h2>
          <CodeTerminal snippets={item.snippets} defaultLang="java" />
        </section>
      </main>
    </div>
  );
}
