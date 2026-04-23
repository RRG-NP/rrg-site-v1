import { First, Second, Third, Fourth, Fifth } from '@/icons/ApproachIcons';

export const NAV_ITEMS = [
  {
    title: 'Main',
    href: 'main',
  },
  {
    title: 'About',
    href: 'about',
  },
  {
    title: 'Services',
    href: 'services',
  },
  {
    title: 'Approach',
    href: 'approach',
  },
  {
    title: 'Contact',
    href: 'contact',
  },
];

export const CARDS = [
  {
    title: 'Design',
    description:
      'We create impactful visual identities and intuitive user experiences that elevate your brand and engage your audience.',
    services: [
      ['Web app', 'Branding'],
      ['Mobile app', 'Logo'],
    ],
    number: '01.',
    classes: '',
  },
  {
    title: 'Fullstack development',
    description:
      'We build scalable, high-performance web applications with seamless frontend and backend integration tailored to your needs.',
    services: [
      ['Online shop', 'Web application'],
      ['CMS', 'API Development'],
    ],
    number: '02.',
    classes: 'border-t border-gray-1/50',
  },
  {
    title: 'Mobile development',
    description:
      'We deliver reliable, high-quality mobile apps for Android and iOS that drive engagement and long-term user retention.',
    services: [['Android', 'IOS']],
    number: '03.',
    classes: 'border-t border-gray-1/50',
  },
];

export const APPROACH_CARDS = [
  {
    icon: First,
    title: 'Consultation',
    description:
      'We align on your vision through focused discussions, combining your goals with our expertise to define a clear direction.',
  },
  {
    icon: Second,
    title: 'Joint review',
    description:
      'We design with precision and review together, refining details to ensure the outcome meets your expectations.',
  },
  {
    icon: Third,
    title: 'Development',
    description:
      'We transform approved designs into robust, scalable products built with performance and reliability in mind.',
  },
  {
    icon: Fourth,
    title: 'Testing',
    description:
      'We rigorously test every component and validate with user feedback to ensure a seamless, high-quality experience.',
  },
  {
    icon: Fifth,
    title: 'Final result',
    description:
      'We deliver a polished, production-ready product with clear documentation, smooth handover, and ongoing support.',
  },
];

export const RADIO_FIELDS = [
  {
    title: 'What type of services you want?*',
    classes: 'mr-[2.25vw]',
    radioArray: [
      { name: 'Design/Branding', value: 'design/branding' },
      { name: 'Web Development', value: 'web-dev' },
      { name: 'Mobile Development', value: 'mobile-dev' },
      { name: 'All of the above', value: 'all-types' },
      { name: 'Other', value: 'other-service' },
    ],
    formKey: '_service',
  },
  {
    title: 'What is your budget category?*',
    classes: '',
    radioArray: [
      { name: '< $1000', value: '<1' },
      { name: '$2000 - $4000', value: '2-4' },
      { name: '$4000 - $8000', value: '4-8' },
      { name: '$8000 - $10000', value: '8-10' },
      { name: '> $10000', value: '10+' },
    ],
    formKey: '_budget',
  },
  {
    title: 'Approximately how many pages will your project have?*',
    classes: 'mr-[2.25vw]',
    radioArray: [
      { name: 'Less than 5', value: '<5' },
      { name: '6-10', value: '6-10' },
      { name: '11-20', value: '11-20' },
      { name: '20+', value: '20+' },
    ],
    formKey: '_pages',
  },
  {
    title: 'How quickly do you need the project?*',
    classes: '',
    radioArray: [
      { name: 'As fast as possible', value: 'max-fast' },
      { name: 'High priority ', value: 'high-prio ' },
      { name: 'Regular time', value: 'regular' },
      { name: 'Take your time ', value: 'take-your-time' },
    ],
    formKey: '_quickness',
  },
];

export const INPUT_FIELDS = [
  { label: 'Your name*', name: 'first', classes: 'inline-block !w-[calc(50%-2vw)] mr-[4vw]', required: true },
  { label: 'Phone*', name: 'phone', classes: 'inline-block !w-[calc(50%-2vw)]', type: 'number', required: true },
  { label: 'Email*', name: 'email', classes: '', type: 'email' },
  { label: 'Company name*', name: 'company', classes: '', required: true },
  { label: 'Company website', name: 'websiteUrl', classes: '' },
];

export const BOOK_FORM_DEFAULT_STATE = {
  _service: null,
  _budget: null,
  _pages: null,
  _quickness: null,

  first: '',
  phone: '',
  email: '',
  company: '',
  websiteUrl: '',
  message: '',
};
