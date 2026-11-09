// [section id, label]
export const NAV = [
  ['projects', 'Projects'],
  ['services', 'Services'],
  ['about', 'About'],
  ['experience', 'Experience'],
  ['contact', 'Contact'],
];

export const NAV_IDS = NAV.map(([id]) => id);

// Which nav item to highlight for each page section (sections without a nav link borrow a neighbour's)
export const SECTION_TO_NAV = {
  home: null, about: 'about', experience: 'experience', projects: 'projects', services: 'services', testimonials: 'testimonials', contact: 'contact',
};
