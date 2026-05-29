'use client';

import { useRef, useState, type HTMLAttributes } from 'react';
import { Check, Copy } from 'lucide-react';

/**
 * Wraps the <pre> emitted by rehype-pretty-code and adds an accessible
 * copy-to-clipboard button. The code text is read from the rendered DOM so it
 * works regardless of how the highlighter splits tokens into spans.
 */
export default function CodeBlock({ children, ...props }: HTMLAttributes<HTMLPreElement>) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const code = preRef.current?.querySelector('code')?.textContent ?? '';
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (e.g. insecure context); fail silently.
    }
  };

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Copied' : 'Copy code to clipboard'}
        className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-stroke bg-bg-1/80 text-text-1/70 opacity-0 backdrop-blur transition hover:text-text-1 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-primary group-hover:opacity-100"
      >
        {copied ? (
          <Check className="h-4 w-4 text-emerald-300" aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
      <pre ref={preRef} {...props}>
        {children}
      </pre>
    </div>
  );
}
