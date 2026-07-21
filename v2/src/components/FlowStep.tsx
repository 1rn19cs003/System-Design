import { ReactNode } from 'react';

export interface FlowStepProps {
  /** Anchor id — must match the matching TopicSidebar toc entry so "On this page" links still work */
  id: string;
  /** 1-indexed position of this step */
  step: number;
  /** Total number of flow steps on the page (for the "Step X of N" sub-label) */
  total: number;
  /** Heading text shown in the collapsed/expanded summary row */
  title: string;
  /** First step on a page should default open so the page doesn't look empty on load */
  defaultOpen?: boolean;
  children: ReactNode;
}

/**
 * A single collapsible "step" in a guided, top-to-bottom reading flow.
 * Built on native <details>/<summary> so it works with zero client JS and
 * survives static export — only the optional "Continue" CTA (FlowContinue)
 * needs the browser.
 */
export default function FlowStep({ id, step, total, title, defaultOpen = false, children }: FlowStepProps) {
  return (
    <section id={id} className="flow-step">
      <details className="flow-details" open={defaultOpen}>
        <summary className="flow-summary">
          <span className="flow-badge">{step}</span>
          <span className="flow-summary-text">
            <span className="flow-summary-title">{title}</span>
            <span className="flow-summary-sub">
              Step {step} of {total}
            </span>
          </span>
          <span className="flow-chevron" aria-hidden="true">
            ▸
          </span>
        </summary>
        <div className="flow-body">{children}</div>
      </details>
    </section>
  );
}
