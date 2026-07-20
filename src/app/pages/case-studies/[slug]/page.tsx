import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SidebarTOC from '@/components/SidebarTOC';
import Breadcrumbs from '@/components/Breadcrumbs';
import { CASE_STUDIES_DATA } from '@/data/caseStudiesData';

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return Object.values(CASE_STUDIES_DATA).map((item) => ({
    slug: item.slug,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const item = CASE_STUDIES_DATA[params.slug];
  if (!item) return { title: 'Case Study — System Design' };
  return {
    title: `${item.title} — System Design Case Study`,
    description: item.description,
  };
}

const tocItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'architecture', label: 'Architecture Breakdown' },
  { id: 'decisions', label: 'Key Design Decisions' },
];

export default function CaseStudyPage({ params }: PageProps) {
  const item = CASE_STUDIES_DATA[params.slug];

  if (!item) {
    notFound();
  }

  return (
    <div className="layout">
      <SidebarTOC backLink={{ href: '/', label: '← Back to guide' }} items={tocItems} />
      <main className="content">
        <Breadcrumbs
          items={[
            { label: 'Case Studies', href: '/' },
            { label: item.title },
          ]}
        />

        <span className="tag">{item.tag}</span>
        <h1 id="overview">{item.title}</h1>
        <p className="subtitle">{item.description}</p>

        <section id="overview-section">
          <h2>Overview</h2>
          <p>{item.overview}</p>
        </section>

        <section id="architecture">
          <h2>Architecture Breakdown</h2>
          <ul>
            {item.architecturePoints.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
          {item.diagramSvg && (
            <figure style={{ marginTop: '20px' }}>
              <img
                className="diagram-img"
                src={item.diagramSvg}
                alt={`${item.title} Architecture Diagram`}
              />
              <figcaption>{item.title} Architecture Diagram</figcaption>
            </figure>
          )}
        </section>

        <section id="decisions">
          <h2>Key Design Decisions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {item.keyDesignDecisions.map((decision, idx) => (
              <div key={idx} className="callout" style={{ background: '#eaf1f8', borderColor: '#3b6ea5' }}>
                <div style={{ fontWeight: 600, color: '#3b6ea5', marginBottom: '4px' }}>
                  {decision.decision}
                </div>
                <p>{decision.why}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
