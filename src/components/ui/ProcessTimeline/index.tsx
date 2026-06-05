import { FC, SVGProps } from 'react';

interface Step {
  icon: FC<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

interface Props {
  steps: Step[];
}

const ProcessTimeline: FC<Props> = ({ steps }) => {
  return (
    <ol className="relative mx-auto max-w-[78vw] tab:max-w-full">
      {steps.map((step, i) => {
        const n = String(i + 1).padStart(2, '0');
        const isLast = i === steps.length - 1;

        return (
          <li
            key={step.title}
            className="group relative flex items-start gap-[2.5vw] tab:gap-7 md:gap-[5vw] pb-[3.2vw] tab:pb-11 md:pb-[10vw] last:pb-0"
          >
            {/* Connecting spine to the next badge */}
            {!isLast && (
              <span
                aria-hidden
                className="pointer-events-none absolute left-[1.85vw] tab:left-7 md:left-[6.5vw] top-[3.7vw] tab:top-14 md:top-[13vw] bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-stroke/70 via-gray-1/60 to-gray-1/20"
              />
            )}

            {/* Number badge — sits on the spine */}
            <span className="relative z-[1] grid h-[3.7vw] w-[3.7vw] tab:h-14 tab:w-14 md:h-[13vw] md:w-[13vw] shrink-0 place-items-center rounded-full border-[0.1vw] tab:border-2 md:border-[1.5px] border-stroke bg-bg-1 text-[1.2vw] tab:text-base md:text-[3.6vw] font-semibold tabular-nums tracking-tight text-text-1/80 transition-all duration-300 group-hover:border-primary group-hover:bg-primary/5 group-hover:text-primary group-hover:shadow-[0_0_0_0.35vw_rgba(204,194,220,0.12)] tab:group-hover:shadow-[0_0_0_5px_rgba(204,194,220,0.12)]">
              {n}
            </span>

            {/* Content */}
            <div className="flex flex-1 items-start justify-between gap-[3vw] pt-[0.5vw] tab:pt-1.5 md:pt-[1vw]">
              <div className="max-w-[46vw] tab:max-w-[46ch] md:max-w-full">
                <h4 className="text-[1.75vw] tab:text-xl md:text-[5vw] font-semibold leading-[1.1] tracking-tight transition-transform duration-300 group-hover:translate-x-[0.3vw] md:group-hover:translate-x-0">
                  {step.title}
                </h4>
                <p className="mt-[0.7vw] tab:mt-2 md:mt-[1.5vw] text-[1vw] tab:text-[0.95rem] md:text-[3.6vw] font-light leading-[1.65] text-white/45 transition-colors duration-300 group-hover:text-white/75 text-balance">
                  {step.description}
                </p>
              </div>

              {/* Muted icon accent (hidden on phone to avoid clutter) */}
              <span
                aria-hidden
                className="shrink-0 pt-[0.4vw] tab:pt-1 opacity-25 transition-opacity duration-300 group-hover:opacity-90 md:hidden"
              >
                <step.icon className="h-[2.4vw] w-[2.4vw] tab:h-7 tab:w-7" />
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
};
export default ProcessTimeline;
