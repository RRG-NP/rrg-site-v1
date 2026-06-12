import { FC } from 'react';

import { siteConfig } from '@/lib/site';

const SOCIAL_LINKS = [
  { title: 'Facebook', href: siteConfig.social.facebook },
  { title: 'LinkedIn', href: siteConfig.social.linkedin },
  { title: 'GitHub', href: siteConfig.social.github },
];

interface Props {
  classes?: string;
}

const SiteFooter: FC<Props> = ({ classes }) => {
  return (
    <footer
      className={`flex justify-between border-t border-gray-1/60 px-[5vw] py-[1.8vw] text-[1.1vw] text-text-1/60 md:flex-col md:gap-4 md:px-6 md:py-5 md:text-[3.2vw] tab:text-[0.85rem] ${classes ?? ''}`}
    >
      <div>
        © 2026.{' '}
        <a href="https://rrg.com.np/" target="_blank" rel="noreferrer" className="transition hover:text-primary">
          RRG Tech
        </a>
      </div>
      <ul className="flex space-x-[3vw] md:space-x-6">
        {SOCIAL_LINKS.map((link) => (
          <li key={link.title}>
            <a href={link.href} target="_blank" rel="noreferrer" className="transition hover:text-primary">
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
};
export default SiteFooter;
