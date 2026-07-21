'use client';

export interface FlowContinueProps {
  /** id of the next FlowStep's <section> */
  nextId: string;
  /** Label of the next step, shown on the button */
  label: string;
}

/**
 * A small CTA at the end of a flow step's body that opens the next step and
 * smooth-scrolls to it — the thing that actually makes the accordion feel
 * like a guided flow instead of a pile of collapsible boxes.
 */
export default function FlowContinue({ nextId, label }: FlowContinueProps) {
  function handleClick() {
    const section = document.getElementById(nextId);
    const details = section?.querySelector('details');
    if (details) details.open = true;
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <button type="button" className="flow-continue" onClick={handleClick}>
      Continue: {label} <span aria-hidden="true">→</span>
    </button>
  );
}
