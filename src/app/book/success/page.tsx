'use client';
import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import Button from '@/components/ui/Button';
import SectionOpacity from '@/components/ui/SectionOpacity';

interface Props {}

const SuccessPage: FC<Props> = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(20);

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
      <div className="mx-auto flex w-full max-w-[70vw] md:max-w-[92vw] flex-1 flex-col items-center justify-center text-center px-[4vw] md:px-5">
        {/* Success Icon Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            duration: 0.6,
          }}
          className="mb-[3vw] md:mb-8"
        >
          <div className="relative">
            {/* Outer glow ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute inset-0 rounded-full bg-primary/20 blur-2xl"
            />
            
            {/* Success checkmark circle */}
            <div className="relative flex h-[12vw] w-[12vw] md:h-24 md:w-24 items-center justify-center rounded-full border-[0.4vw] md:border-2 border-primary bg-bg-2/50 backdrop-blur-sm">
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.5, duration: 0.6, ease: 'easeInOut' }}
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
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <h1 className="mb-[1.5vw] md:mb-4 text-[4.5vw] md:text-[9vw] font-bold text-primary">
            Thank You!
          </h1>
          <h2 className="mb-[1vw] md:mb-3 text-[2.5vw] md:text-[5.5vw] font-medium text-text-1">
            Your Request Has Been Received
          </h2>
        </motion.div>

        {/* Appreciation Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mb-[3vw] md:mb-8 max-w-[55vw] md:max-w-full"
        >
          <p className="mb-[1.5vw] md:mb-4 text-[1.4vw] md:text-[3.8vw] leading-[1.6] text-text-1/90">
            We truly appreciate you taking the time to reach out to us. Your project details have been successfully
            submitted, and our team is excited to review them.
          </p>
          <p className="text-[1.2vw] md:text-[3.5vw] leading-[1.6] text-text-1/70">
            We&apos;ll get back to you within <span className="font-semibold text-primary">24-48 hours</span> to discuss
            your project in detail and explore how we can bring your vision to life.
          </p>
        </motion.div>

        {/* What's Next Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mb-[3vw] md:mb-8 w-full max-w-[60vw] md:max-w-full"
        >
          <h3 className="mb-[1.5vw] md:mb-5 text-[1.8vw] md:text-[5vw] font-semibold text-primary">
            What Happens Next?
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-1 gap-[2vw] md:gap-4">
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
                transition={{ delay: 1.4 + index * 0.1, duration: 0.4 }}
                className="rounded-[0.5vw] md:rounded-xl border border-stroke bg-bg-2/50 p-[1.5vw] md:p-5 backdrop-blur-sm text-left md:text-left"
              >
                <div className="mb-[0.5vw] md:mb-2 text-[2vw] md:text-[6vw] font-bold text-primary/50">
                  {item.step}
                </div>
                <h4 className="mb-[0.3vw] md:mb-1 text-[1.2vw] md:text-[4vw] font-semibold text-text-1">
                  {item.title}
                </h4>
                <p className="text-[0.9vw] md:text-[3.2vw] leading-[1.5] text-text-1/70">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.5 }}
          className="mb-[3vw] md:mb-8 rounded-[0.5vw] md:rounded-xl border border-stroke bg-bg-2/30 p-[2vw] md:p-5 backdrop-blur-sm w-full max-w-[60vw] md:max-w-full"
        >
          <p className="mb-[0.8vw] md:mb-3 text-[1.1vw] md:text-[3.5vw] text-text-1/80">
            Need immediate assistance? Feel free to reach out directly:
          </p>
          <a
            href="mailto:hi@rrg.com.np"
            className="inline-flex items-center gap-[0.5vw] md:gap-2 text-[1.3vw] md:text-[4vw] font-medium text-primary hover:text-primary/80 transition"
          >
            <svg
              className="h-[1.5vw] w-[1.5vw] md:h-5 md:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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
          transition={{ delay: 1.8, duration: 0.5 }}
          className="flex flex-col items-center gap-[1.5vw] md:gap-5"
        >
          <Button
            onClick={handleGoHome}
            title="BACK TO HOME"
            classes="px-[3vw] md:px-10 py-[1.2vw] md:py-4 min-h-[4vw] md:min-h-[12vw] text-[1.1vw] md:text-[3.5vw] bg-bg-1 hover:bg-bg-1/80"
            btnClasses=""
          />
          <p className="text-[1vw] md:text-[3.2vw] text-text-1/50 mb-2">
            Redirecting in <span className="font-semibold text-primary">{countdown}</span> seconds...
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="mt-auto flex justify-between border-t border-t-gray-800 px-[5vw] md:px-6 py-[1.8vw] md:py-5 text-[1.6vw] md:text-[3.2vw] md:flex-col md:gap-3"
      >
        <div>
          © 2026.{' '}
          <a href="https://rrg.com.np/" target="_blank" rel="noreferrer" className="hover:text-primary transition">
            RRG Tech
          </a>
        </div>
        <ul className="flex space-x-[3vw] md:space-x-6">
          <li>
            <a
              href="https://www.facebook.com/rrg.com.np"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition"
            >
              Facebook
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/company/rrgnepal/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href="https://github.com/orgs/RRG-NP/dashboard"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition"
            >
              GitHub
            </a>
          </li>
        </ul>
      </motion.footer>
    </SectionOpacity>
  );
};

export default SuccessPage;
