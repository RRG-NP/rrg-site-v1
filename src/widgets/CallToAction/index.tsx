import { FC } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';
import SectionOpacity from '@/components/ui/SectionOpacity';

interface Props {}

const Index: FC<Props> = () => {
  const router = useRouter();

  const handleFormToggle = () => {
    router.push('/book');
  };

  return (
    <SectionOpacity classes="flex flex-col justify-center h-screen">

      <div className=" mx-auto flex w-full max-w-[60vw] md:max-w-[90%] flex-1 flex-col items-center justify-center text-center">
        <h3 className="text-[4vw] md:text-[8vw] font-medium">LET&apos;S CONNECT</h3>
        <p className="mt-[0.6vw] text-[1.7vw] md:text-[3.2vw] font-normal text-gray-300 md:leading-[1.3]">
          Ready to bring your vision to life? Let&apos;s discuss your project and create something extraordinary together.
        </p>
        
        <a 
          href="mailto:hi@rrg.com.np" 
          className="mt-[1.2vw] md:mt-[2vw] inline-flex items-center gap-[0.5vw] text-[1.5vw] md:text-[2.8vw] font-medium text-primary hover:text-primary/80 transition-colors duration-300"
        >
          <svg
            className="h-[1.5vw] w-[1.5vw] md:h-[2.8vw] md:w-[2.8vw]"
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

        <Button
          onClick={handleFormToggle}
          title="SUBMIT A REQUEST"
          classes="px-[1.8vw] py-[vw] w-[35vw] md:w-[45vw] min-h-[6vw] md:min-h-[8vw] text-[1.25vw] md:text-[2.25vw] bg-bg-1 hover:bg-bg-1/80"
          btnClasses="mt-[1.2vw]"
        />
      </div>

      <footer className="flex justify-between border-t border-t-gray-800 px-[5vw] py-[1.8vw] text-[1.6vw] md:text-[2vw] md:py-[2.4vw] md:px-[2vw] ">
        <div>© 2026. <a href="https://rrg.com.np/" target='_blank' rel="noreferrer">RRG Tech</a></div>
        <ul className="flex space-x-[3vw] ">
          <li>
            <a href="https://www.facebook.com/rrg.com.np" target="_blank" rel="noreferrer" className="hover:text-gray-400 transition">
              Facebook
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/company/rrgnepal/" target="_blank" rel="noreferrer" className="hover:text-gray-400 transition">
              LinkedIn
            </a>
          </li>
          <li>
            <a href="https://github.com/orgs/RRG-NP/dashboard" target="_blank" rel="noreferrer" className="hover:text-gray-400 transition">
              GitHub
            </a>
          </li>
        </ul>
      </footer>
    </SectionOpacity>
  );
};
export default Index;
