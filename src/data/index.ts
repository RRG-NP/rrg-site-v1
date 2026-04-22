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
      'We craft stunning visual identities and user experiences that captivate your audience. From modern web interfaces to memorable brand identities, our design team brings your vision to life with creativity and precision.',
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
      'Build powerful, scalable web applications with our expert full-stack development services. We deliver robust solutions from frontend to backend, including e-commerce platforms, custom CMS, and seamless API integrations.',
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
      'Transform your ideas into powerful mobile applications. We develop native and cross-platform mobile solutions for both Android and iOS, delivering exceptional user experiences that engage and retain your customers.',
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
      "We listen carefully to the customer's wishes and ideas about the project. Then we share our vision and, based on this exchange, come to a common agreement.",
  },
  {
    icon: Second,
    title: 'Joint review',
    description:
      'Then we start creating the design. After completion, we conduct a joint review, where the customer, if desired, can make changes.',
  },
  {
    icon: Third,
    title: 'Development',
    description: 'After the design is approved, we proceed to the actual development of the product.',
  },
  {
    icon: Fourth,
    title: 'Testing',
    description:
      'Once the development is complete, we thoroughly test each component of the product. Then we invite the customer for user testing.',
  },
  {
    icon: Fifth,
    title: 'Final result',
    description:
      'We deliver a polished, production-ready product that exceeds expectations. Along with comprehensive documentation and training, we ensure a smooth handover and provide ongoing support to help your project thrive.',
  },
];

export const RADIO_FIELDS = [
  {
    title: 'What type of services you want?',
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
    title: 'What is your budget category?',
    classes: '',
    radioArray: [
      { name: '$2000 - $4000', value: '2-4' },
      { name: '$4000 - $8000', value: '4-8' },
      { name: '$8000 - $10000', value: '8-10' },
      { name: '$10000', value: '10+' },
    ],
    formKey: '_budget',
  },
  {
    title: 'Approximately how many pages will your project have?',
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
    title: 'How quickly do you need the project?',
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
  { label: 'Your name', name: 'first', classes: 'inline-block !w-[calc(50%-2vw)] mr-[4vw]', required: true },
  { label: 'Phone', name: 'phone', classes: 'inline-block !w-[calc(50%-2vw)]', type: 'number', required: true },
  { label: 'Email', name: 'email', classes: '', type: 'email' },
  { label: 'Company name', name: 'company', classes: '', required: true },
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
