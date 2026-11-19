export const NAV = [
  ['projects', 'Projects'],
  ['services', 'Services'],
  ['about', 'About'],
  ['experience', 'Experience'],
  ['contact', 'Contact'],
];

export const NAV_IDS = NAV.map(([id]) => id);

export const SECTION_TO_NAV = {
  home: null,
  about: 'about',
  experience: 'experience',
  'design-philosophy': 'experience',
  achievements: 'experience',
  education: 'experience',
  projects: 'projects',
  services: 'services',
  testimonials: 'testimonials',
  faq: 'contact',
  contact: 'contact',
};
