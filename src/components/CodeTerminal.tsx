'use client';

import { useState } from 'react';

export interface CodeSnippet {
  code: string;
  output: string;
}

export interface CodeTerminalProps {
  snippets: {
    java?: CodeSnippet;
    python?: CodeSnippet;
    javascript?: CodeSnippet;
    cpp?: CodeSnippet;
    [key: string]: CodeSnippet | undefined;
  };
  defaultLang?: string;
}

const LANG_LABELS: Record<string, string> = {
  java: 'Java',
  python: 'Python',
  javascript: 'JavaScript',
  cpp: 'C++',
};

export default function CodeTerminal({ snippets, defaultLang = 'java' }: CodeTerminalProps) {
  const availableLangs = Object.keys(snippets).filter((lang) => snippets[lang]);
  const [activeLang, setActiveLang] = useState<string>(
    snippets[defaultLang] ? defaultLang : availableLangs[0] || 'java'
  );
  const [copied, setCopied] = useState<boolean>(false);

  const currentSnippet = snippets[activeLang] || { code: '', output: '' };

  const handleCopy = () => {
    if (!currentSnippet.code) return;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(currentSnippet.code).then(showCopiedNotice);
    } else {
      fallbackCopy(currentSnippet.code);
      showCopiedNotice();
    }
  };

  const showCopiedNotice = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const fallbackCopy = (text: string) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } catch (e) {
      // ignore
    }
    document.body.removeChild(ta);
  };

  return (
    <div className="terminal">
      <div className="terminal-tabs">
        <div className="terminal-tabs-group">
          {availableLangs.map((lang) => (
            <button
              key={lang}
              className={`terminal-tab ${activeLang === lang ? 'active' : ''}`}
              onClick={() => setActiveLang(lang)}
              type="button"
            >
              {LANG_LABELS[lang] || lang.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          className={`copy-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          type="button"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="terminal-body">
        <pre>{currentSnippet.code}</pre>
        {currentSnippet.output && (
          <>
            <div className="terminal-output-label">Execution Output:</div>
            <div className="terminal-output">{currentSnippet.output}</div>
          </>
        )}
      </div>
    </div>
  );
}
