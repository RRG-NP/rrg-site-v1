# RRG Tech - Creative Digital Agency Website

A modern, adaptive landing page for RRG Tech, a creative digital agency based in Kathmandu, Nepal. Features stunning animations, interactive components, and comprehensive SEO optimization.

## 🌟 About RRG Tech

RRG Tech is a leading creative digital agency specializing in:
- Web Development (Full-stack)
- Mobile App Development (Android & iOS)
- UI/UX Design & Branding
- Custom Software Solutions

## Design
- **[Figma](https://www.figma.com/design/65gFXT6dvNfDjkX5osjZbu/Untitled?node-id=5-2&t=zgqFDE8HGEajkIoE-1)**

## ✨ Features

- **SEO Optimized**: Comprehensive meta tags, structured data (JSON-LD), and optimized for search engines
- **Adaptive Design**: Fully responsive and optimized for all devices and screen sizes
- **Animated Sidebar Menu**: Smooth animations with social media links (Facebook, LinkedIn, GitHub)
- **Smoke Cursor**: Spectacular WebGL-powered smoky cursor effect
- **Contact Form**: Interactive booking form with validation
- **Animated Components**: Dynamic transitions and scroll-based animations
- **Social Integration**: Connected to RRG Tech's social media profiles

## 🔍 SEO Features

- ✅ Comprehensive meta tags (title, description, keywords)
- ✅ Open Graph tags for social media sharing
- ✅ Twitter Card support
- ✅ Structured data (JSON-LD) for Organization and ProfessionalService
- ✅ Sitemap.xml for search engine crawling
- ✅ Robots.txt for crawler instructions
- ✅ Canonical URLs
- ✅ Optimized for keywords: RRG, RRG Tech, RRG Kathmandu, RRG Nepal

**Target Keywords**: RRG, RRG Tech, RRG Kathmandu, RRG Nepal, digital agency Nepal, web development Kathmandu, creative agency Nepal

## 📚 Libraries

- **[Next.js](https://nextjs.org/)** — React framework for production
- **[TailwindCSS](https://tailwindcss.com/)** — Utility-first CSS framework
- **[GSAP](https://greensock.com/gsap/)** — Professional-grade animation library
- **[Framer Motion](https://www.framer.com/motion/)** — Declarative animations for React
- **[Lenis](https://github.com/darkroomengineering/lenis)** — Smooth scroll library
- **[Edil Ozi](https://github.com/Edil-ozi/edil-ozi)** — Animated React components
- **[shadcn/ui](https://ui.shadcn.dev/)** — Customizable UI components

## 🚀 Running the Project

Clone the repository and run:

```bash
git clone <github_repo_url>
cd rrg-agency-site
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Favicon Setup

To complete the SEO setup, you need to add favicon files. See [FAVICON_INSTRUCTIONS.md](./FAVICON_INSTRUCTIONS.md) for detailed instructions on generating and adding:
- favicon.ico
- favicon-16x16.png & favicon-32x32.png
- apple-touch-icon.png
- android-chrome icons
- og-image.jpg (for social sharing)

## 🔗 Social Links

- **Website**: [https://rrg.com.np](https://rrg.com.np)
- **Facebook**: [https://www.facebook.com/rrg.com.np](https://www.facebook.com/rrg.com.np)
- **LinkedIn**: [https://www.linkedin.com/company/rrgnepal/](https://www.linkedin.com/company/rrgnepal/)
- **GitHub**: [https://github.com/orgs/RRG-NP](https://github.com/orgs/RRG-NP)

## ⚠️ Important Notes

**WebGL Cursor**: The smoke cursor is implemented using WebGL. On low-performance devices or outdated browsers, this effect may impact performance. To disable it locally, go to `app/page.tsx` and comment out the `<ShadowCursor />` component.

**VW Units**: This site uses VW (viewport width) units for responsive scaling. [Learn more about CSS viewport units](https://www.sitepoint.com/css-viewport-units-quick-start/)

## 📄 License

© 2026 RRG Tech. All rights reserved.
