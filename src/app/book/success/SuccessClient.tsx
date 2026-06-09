'use client';
import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion, type Transition } from 'framer-motion';

import Button from '@/components/ui/Button';
import SectionOpacity from '@/components/ui/SectionOpacity';

interface Props {}

const SuccessClient: FC<Props> = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(20);
  const prefersReducedMotion = useReducedMotion();
  // Collapse every transition to instant for reduced-motion users. This only changes
  // animation timing, not the rendered `initial` DOM - so it stays hydration-safe.
  const t = (base: Transition): Transition => (prefersReducedMotion ? { duration: 0 } : base);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <SectionOpacity classes="flex flex-col justify-center min-h-screen bg-gradient-to-b from-bg-1 to-bg-2 my-10">
      <div className="mx-auto flex w-full max-w-[70vw] flex-1 flex-col items-center justify-center px-[4vw] text-center md:max-w-[92vw] md:px-5">
        {/* Success Icon Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={t({
            type: 'spring',
            stiffness: 260,
            damping: 20,
            duration: 0.6,
          })}
          className="mb-[3vw] md:mb-8"
        >
          <div className="relative">
            {/* Outer glow ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={t({ delay: 0.3, duration: 0.5 })}
              className="absolute inset-0 rounded-full bg-primary/20 blur-2xl"
            />

            {/* Success checkmark circle */}
            <div className="relative flex h-[12vw] w-[12vw] items-center justify-center rounded-full border-[0.4vw] border-primary bg-bg-2/50 backdrop-blur-sm md:h-24 md:w-24 md:border-2">
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={t({ delay: 0.5, duration: 0.6, ease: 'easeInOut' })}
                className="h-[6vw] w-[6vw] md:h-12 md:w-12"
                viewBox="0 0 24 24"
                fill="none"
              >
                <motion.path
                  d="M5 13l4 4L19 7"
                  stroke="#CCC2DC"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t({ delay: 0.8, duration: 0.5 })}
        >
          <h1 className="mb-[1.5vw] text-[4.5vw] font-bold text-primary md:mb-4 md:text-[9vw]">Thank You!</h1>
          <h2 className="mb-[1vw] text-[2.5vw] font-medium text-text-1 md:mb-3 md:text-[5.5vw]">
            Your Request Has Been Received
          </h2>
        </motion.div>

        {/* Appreciation Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t({ delay: 1, duration: 0.5 })}
          className="mb-[3vw] max-w-[55vw] md:mb-8 md:max-w-full"
        >
          <p className="mb-[1.5vw] text-[1.4vw] leading-[1.6] text-text-1/90 md:mb-4 md:text-[3.8vw]">
            We truly appreciate you taking the time to reach out to us. Your project details have been successfully
            submitted, and our team is excited to review them.
          </p>
          <p className="text-[1.2vw] leading-[1.6] text-text-1/70 md:text-[3.5vw]">
            We&rsquo;ll get back to you within <span className="font-semibold text-primary">24&ndash;48 hours</span> to
            discuss your project in detail and explore how we can bring your vision to life.
          </p>
        </motion.div>

        {/* What's Next Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t({ delay: 1.2, duration: 0.5 })}
          className="mb-[3vw] w-full max-w-[60vw] md:mb-8 md:max-w-full"
        >
          <h3 className="mb-[1.5vw] text-[1.8vw] font-semibold text-primary md:mb-5 md:text-[5vw]">
            What Happens Next?
          </h3>
          <div className="grid grid-cols-3 gap-[2vw] md:grid-cols-1 md:gap-4">
            {[
              {
                step: '01',
                title: 'Review',
                description: 'Our team reviews your project requirements',
              },
              {
                step: '02',
                title: 'Contact',
                description: 'We reach out to discuss details and timeline',
              },
              {
                step: '03',
                title: 'Proposal',
                description: 'You receive a detailed project proposal',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={t({ delay: 1.4 + index * 0.1, duration: 0.4 })}
                className="rounded-[0.5vw] border border-stroke bg-bg-2/50 p-[1.5vw] text-left backdrop-blur-sm md:rounded-xl md:p-5 md:text-left"
              >
                <div className="mb-[0.5vw] text-[2vw] font-bold text-primary/50 md:mb-2 md:text-[6vw]">{item.step}</div>
                <h4 className="mb-[0.3vw] text-[1.2vw] font-semibold text-text-1 md:mb-1 md:text-[4vw]">
                  {item.title}
                </h4>
                <p className="text-[0.9vw] leading-[1.5] text-text-1/70 md:text-[3.2vw]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t({ delay: 1.7, duration: 0.5 })}
          className="mb-[3vw] w-full max-w-[60vw] rounded-[0.5vw] border border-stroke bg-bg-2/30 p-[2vw] backdrop-blur-sm md:mb-8 md:max-w-full md:rounded-xl md:p-5"
        >
          <p className="mb-[0.8vw] text-[1.1vw] text-text-1/80 md:mb-3 md:text-[3.5vw]">
            Need immediate assistance? Feel free to reach out directly:
          </p>
          <a
            href="mailto:hi@rrg.com.np"
            className="inline-flex items-center gap-[0.5vw] text-[1.3vw] font-medium text-primary transition hover:text-primary/80 md:gap-2 md:text-[4vw]"
          >
            <svg
              className="h-[1.5vw] w-[1.5vw] md:h-5 md:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            hi@rrg.com.np
          </a>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t({ delay: 1.8, duration: 0.5 })}
          className="flex flex-col items-center gap-[1.5vw] md:gap-5"
        >
          <Button
            onClick={handleGoHome}
            title="BACK TO HOME"
            classes="px-[3vw] md:px-10 py-[1.2vw] md:py-4 min-h-[4vw] md:min-h-[12vw] text-[1.1vw] md:text-[3.5vw] bg-bg-1 hover:bg-bg-1/80"
            btnClasses=""
          />
          <p className="mb-2 text-[1vw] text-text-1/50 md:text-[3.2vw]">
            Redirecting in <span className="font-semibold text-primary">{countdown}</span> seconds…
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={t({ delay: 2, duration: 0.5 })}
        className="mt-auto flex justify-between border-t border-t-gray-800 px-[5vw] py-[1.8vw] text-[1.6vw] md:flex-col md:gap-3 md:px-6 md:py-5 md:text-[3.2vw]"
      >
        <div>
          © 2026.{' '}
          <a href="https://rrg.com.np/" target="_blank" rel="noreferrer" className="transition hover:text-primary">
            RRG Tech
          </a>
        </div>
        <ul className="flex space-x-[3vw] md:space-x-6">
          <li>
            <a
              href="https://www.facebook.com/rrg.com.np"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-primary"
            >
              Facebook
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/company/rrgnepal/"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-primary"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href="https://github.com/orgs/RRG-NP/dashboard"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-primary"
            >
              GitHub
            </a>
          </li>
        </ul>
      </motion.footer>
    </SectionOpacity>
  );
};

export default SuccessClient;
