import Link from 'next/link';
import { CATEGORIES } from '@/data/navigation';
import SidebarTOC from '@/components/SidebarTOC';

export default function HomePage() {
  const tocItems = CATEGORIES.map((cat) => ({
    id: cat.id,
    label: cat.title.replace(/ \(.*\)/, ''),
  }));

  return (
    <div className="layout">
      <SidebarTOC title="SECTIONS" items={tocItems} />
      <main className="content">
        <h1>System Design Architectures</h1>
        <p className="subtitle" style={{ color: 'var(--muted)', fontSize: '16px', marginBottom: '32px' }}>
          A focused, self-study guide for High-Level Design (HLD), Low-Level Design (LLD), and Design Patterns.
          Includes working code in Java, Python, JavaScript, and C++ for every pattern.
        </p>

        {CATEGORIES.map((category) => (
          <section key={category.id} id={category.id}>
            <h2>{category.title}</h2>
            <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '20px' }}>
              {category.description}
            </p>
            <div className="cards-grid">
              {category.items.map((item) => (
                <div key={item.id} className="card">
                  <span className="tag">{item.tag}</span>
                  <h3>
                    <Link href={item.href}>{item.title} &rarr;</Link>
                  </h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
