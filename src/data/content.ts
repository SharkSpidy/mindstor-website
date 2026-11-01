/** Site copy lives here so it can be edited without touching components. */

export interface NavLink {
  readonly label: string;
  readonly href: string;
}

export const NAV_LINKS: readonly NavLink[] = [
  { label: 'What We Make', href: '#make' },
  { label: 'Our Products', href: '#product' },
  { label: 'Core Values', href: '#values' },
  { label: 'Careers', href: '#careers' },
];

export interface MakeCard {
  readonly title: string;
  readonly text: string;
  /** CSS color for the card's glow dot. */
  readonly color: string;
}

export const MAKE_CARDS: readonly MakeCard[] = [
  {
    title: 'Web products',
    text: 'Fast, carefully tested sites and web apps people can use without a manual.',
    color: 'var(--purple)',
  },
  {
    title: 'Mobile apps',
    text: 'Apps for the phones people already carry, shipped early and improved from real use.',
    color: 'var(--pink)',
  },
  {
    title: 'SaaS',
    text: 'Software that grows with its users, with their data protected from the first release.',
    color: 'var(--bright)',
  },
  {
    title: 'AI in your product',
    text: 'Smart features built into the product, with a plain statement of what they can and cannot do.',
    color: 'var(--orange)',
  },
];

export interface CoreValue {
  /** Two-digit badge, in order. */
  readonly num: '01' | '02' | '03' | '04' | '05';
  readonly title: string;
  readonly text: string;
}

export const CORE_VALUES: readonly CoreValue[] = [
  {
    num: '01',
    title: 'Skill First',
    text: 'We back people for what they can do and how they learn, not for degrees or titles.',
  },
  {
    num: '02',
    title: 'Build It Right',
    text: 'We build carefully, test properly, protect user data, and state plainly what our systems can and cannot do.',
  },
  {
    num: '03',
    title: 'Straight Talk',
    text: 'We tell customers, partners, and teammates the truth about timelines, limits, and mistakes.',
  },
  {
    num: '04',
    title: 'Whole Product',
    text: 'Design, engineering, and AI under one roof. We own the whole solution.',
  },
  {
    num: '05',
    title: 'Better Every Release',
    text: 'We ship early, learn from real usage, and iterate quickly. Building better is a habit.',
  },
];

export interface Role {
  readonly title: string;
  readonly text: string;
}

export const ROLES: readonly Role[] = [
  {
    title: 'Founders',
    text: 'Set the direction, talk to clients and theatres, and work hands-on with the team.',
  },
  {
    title: 'Lead SDE',
    text: 'Owns the technical direction, shapes architecture, sets code quality standards, and helps engineers grow.',
  },
  {
    title: 'SDE 2',
    text: 'Takes features from idea to delivery, keeps code quality high, and works closely with the Lead SDE and Founders.',
  },
  {
    title: 'SDE 1',
    text: 'Builds and ships features, writes clean and documented code, fixes issues, and levels up by learning from senior engineers.',
  },
  {
    title: 'Data Analyst',
    text: 'Builds dashboards and turns product and business data into plain-language insights for the Founders.',
  },
];
