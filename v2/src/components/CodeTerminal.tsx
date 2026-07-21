'use client';

import { useState } from 'react';

export interface LangSnippet {
  code: string;
  output: string;
}

export interface CodeTerminalProps {
  snippets: {
    java: LangSnippet;
    python: LangSnippet;
    javascript: LangSnippet;
    cpp: LangSnippet;
  };
  note?: React.ReactNode;
}

const TABS: Array<{ key: keyof CodeTerminalProps['snippets']; label: string }> = [
  { key: 'java', label: 'Java' },
  { key: 'python', label: 'Python' },
  { key: 'javascript', label: 'JavaScript' },
  { key: 'cpp', label: 'C++' },
];

export default function CodeTerminal({ snippets, note }: CodeTerminalProps) {
  const [lang, setLang] = useState<keyof CodeTerminalProps['snippets']>('java');
  const [copied, setCopied] = useState(false);

  const current = snippets[lang];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(current.code);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = current.code;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="terminal">
      <div className="terminal-tabs">
        <div className="terminal-tabs-group">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`terminal-tab${lang === tab.key ? ' active' : ''}`}
              onClick={() => setLang(tab.key)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button className={`copy-btn${copied ? ' copied' : ''}`} onClick={handleCopy} type="button">
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="terminal-body">
        <pre>
          <code>{current.code}</code>
        </pre>
        <div className="terminal-output-label">Output</div>
        <div className="terminal-output">{current.output}</div>
      </div>
      {note ? <div className="terminal-note">{note}</div> : null}
    </div>
  );
}
