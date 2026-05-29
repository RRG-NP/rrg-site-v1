import { AlertTriangle, Info, Lightbulb, StickyNote } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/shared/utils';

type CalloutType = 'note' | 'info' | 'tip' | 'warning';

const STYLES: Record<CalloutType, { wrap: string; icon: string; Icon: typeof Info; label: string }> = {
  note: {
    wrap: 'border-primary/40 bg-primary/10',
    icon: 'text-primary',
    Icon: StickyNote,
    label: 'Note',
  },
  info: {
    wrap: 'border-sky-400/40 bg-sky-400/10',
    icon: 'text-sky-300',
    Icon: Info,
    label: 'Info',
  },
  tip: {
    wrap: 'border-emerald-400/40 bg-emerald-400/10',
    icon: 'text-emerald-300',
    Icon: Lightbulb,
    label: 'Tip',
  },
  warning: {
    wrap: 'border-amber-400/40 bg-amber-400/10',
    icon: 'text-amber-300',
    Icon: AlertTriangle,
    label: 'Warning',
  },
};

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

/** Highlighted aside used inside MDX (also exposed as <Note>, <Info>, <Tip>, <Warning>). */
export default function Callout({ type = 'note', title, children }: CalloutProps) {
  const style = STYLES[type];
  const Icon = style.Icon;

  return (
    <div
      role="note"
      className={cn(
        'my-6 rounded-2xl border-l-4 px-4 py-3.5 text-text-1/90',
        style.wrap,
      )}
    >
      {/* Header */}
      <div className="my-2 flex items-center gap-2">
        <Icon
          className={cn('h-5 w-5 shrink-0', style.icon)}
          aria-hidden="true"
        />

        <p className={cn('font-semibold leading-none !m-0', style.icon)}>
          {title ?? style.label}
        </p>
      </div>

      {/* Content */}
      <div
        className={cn(
          'w-full text-[0.95rem] py-2 leading-relaxed',
          '[&>:first-child]:mt-0',
          '[&>:last-child]:mb-0',
        )}
      >
        {children}
      </div>
    </div>
  );
}

export const Note = (props: Omit<CalloutProps, 'type'>) => <Callout type="note" {...props} />;
export const Info_ = (props: Omit<CalloutProps, 'type'>) => <Callout type="info" {...props} />;
export const Tip = (props: Omit<CalloutProps, 'type'>) => <Callout type="tip" {...props} />;
export const Warning = (props: Omit<CalloutProps, 'type'>) => <Callout type="warning" {...props} />;
