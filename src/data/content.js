export const ROLES = [
  {
    icon: 'pen-tool',
    label: 'Software Developer',
    text: 'Bridging design and code to build things people love to use',
    bg: 'bg-[#FFFC8C] dark:bg-[#2D2342]'
  },
  {
    icon: 'code',
    label: 'UI/UX Designer',
    text: 'Designing interfaces that feel clear, fast, and a little delightful',
    bg: 'bg-[#98E8DE] dark:bg-[#182C3D]'
  },
  {
    icon: 'pen-line',
    label: 'Logo Designer',
    text: 'Turning ideas into simple marks that people remember',
    bg: 'bg-[#9FED72] dark:bg-[#3B2C1A]'
  },
];

export const PROJECTS = [
  {
    name: 'Flyra',
    slug: 'flyra',
    status: 'Case Study',
    year: '2026',
    description: 'A country explorer app that makes discovering countries simple and engaging through essential information about geography, culture, population, languages, and currencies.',
    tags: ['Figma', 'Mobile App', 'Travel & Exploration'],
    image: '/images/projects/flyra.png',
    alt: 'Flyra country explorer app interface showcasing country details',
    behanceUrl: 'https://www.behance.net/gallery/257581893/Flyra',
  },
  {
    name: 'Guardian',
    slug: 'guardian',
    status: 'Case Study',
    year: '2023',
    description: 'A women’s safety mobile application that provides emergency assistance, real-time location sharing, and quick access to essential safety features.',
    tags: ['Figma', 'Mobile App', 'Safety Tech'],
    image: '/images/projects/guardian.png',
    alt: 'Guardian women’s safety app interface showcasing emergency assistance and safety features',
    behanceUrl: 'https://www.behance.net/gallery/184801135/Guardian-Women-Safety-App',
    },
  {
    name: 'TIC',
    slug: 'tic',
    status: 'Case Study',
    year: '2021',
    description: 'A teacher performance management mobile application that streamlines attendance tracking, lesson delivery, and teaching activities to improve accountability and consistency in education.',
    tags: ['Figma', 'Mobile App', 'Education'],
    image: '/images/projects/tic.png',
    alt: 'TIC teacher performance management app interface showcasing attendance and teaching activity tracking',
  },
  {
    name: 'TIC',
    slug: 'tic',
    status: 'Case Study',
    year: '2021',
    description: 'A teacher performance management mobile application that streamlines attendance tracking, lesson delivery, and teaching activities to improve accountability and consistency in education.',
    tags: ['Figma', 'Mobile App', 'Education'],
    image: '/images/projects/tic.png',
    alt: 'TIC teacher performance management app interface showcasing attendance and teaching activity tracking',
    behanceUrl: 'https://www.behance.net/gallery/251760215/TIC-Teaching-Tracker',
  },
  {
    name: 'TIC',
    slug: 'tic',
    status: 'Case Study',
    year: '2021',
    description: 'A teacher performance management mobile application that streamlines attendance tracking, lesson delivery, and teaching activities to improve accountability and consistency in education.',
    tags: ['Figma', 'Mobile App', 'Education'],
    image: '/images/projects/tic.png',
    alt: 'TIC teacher performance management app interface showcasing attendance and teaching activity tracking',
    behanceUrl: 'https://www.behance.net/gallery/251760215/TIC-Teaching-Tracker',
  },
];


// [title, description, icon, gradient]
export const PROCESS = [
  ['Understand the Need', 'Listen, ask the right questions, and understand what people really need.', 'from-indigo-600 to-slate-900', '/images/Idea.png'],
  ['Keep It Simple', 'Turn complicated ideas into simple, clear, and easy-to-use experiences.', 'from-sky-600 to-slate-900', '/images/Make.png'],
  ['Create & Refine', 'Bring ideas to life, explore what works, and keep improving every detail.', 'from-emerald-600 to-slate-900', '/images/Refine.png'],
];

export const EXP = [
  {
    co: 'Webtezza',
    logo: '/logos/webtezza.png',
    role: 'Associate UI/UX Designer',
    loc: 'Kurunegala, Sri Lanka',
    when: 'Oct 2025 – Oct 2026 ',
    front: 'Designed 23+ websites and SaaS products, creating responsive, user-centered experiences through consistent design systems, AI-powered workflows, user research, and client collaboration.',
    tags: ['Full-time', 'Remote']
  },

  {
    co: 'Misscode',
    logo: '/logos/misscode.png',
    role: 'Logo & Brand Designer',
    loc: 'Jaffna, Sri Lanka',
    when: 'May 2026 – July 2026',
    front: 'Created 3 complete brand identity kits, developing cohesive visual identities through logo design, typography, color systems, marketing assets, and client collaboration.',
    tags: ['Freelance', 'Remote']
  },

  {
    co: 'Pineapple AI',
    logo: '/logos/pineappleai.jpg',
    role: 'Associate UI/UX Designer',
    loc: 'Jaffna, Sri Lanka',
    when: 'Apr 2025 – Aug 2025',
    front: 'Designed end-to-end UX solutions for 5 projects, creating user flows, wireframes, prototypes, and responsive interfaces while mentoring interns, improving design consistency, and collaborating with cross-functional teams.',
    tags: ['Full-time', 'Remote']
  },

  {
    co: 'Accron Revolutions',
    logo: '/logos/accron.ico',
    role: 'Intern UI/UX Designer',
    loc: 'Vavuniya, Sri Lanka',
    when: 'Dec 2023 – Apr 2024',
    front: 'Analyzed project requirements and translated user needs into high-fidelity wireframes and responsive interfaces, while collaborating with cross-functional teams and refining designs through feedback.',
    tags: ['Fulltime', 'Remote']
  },
];

// Small, editable skill groups for the Tools section.
export const SOFT_SKILLS = [
  ['Product Strategy', [
    ['SaaS Product Design', 'Design scalable and intuitive software experiences.'],
    ['B2B Product Design', 'Simplify complex workflows for business users.'],
  ]],

  ['UX Research & Strategy', [
    ['User Research', 'Understand user behaviors, needs, and pain points.'],
    ['User Interviews', 'Gather qualitative insights through direct user conversations.'],
    ['Usability Testing', 'Evaluate experiences and identify usability improvements.'],
    ['Competitive Analysis', 'Identify opportunities through competitor and market research.'],
    ['Information Architecture', 'Organize content and functionality into intuitive structures.'],
    ['User Flows', 'Map user journeys and simplify task completion.'],
   
  ]],

  ['UI/UX Design', [
    ['User Experience Design', 'Create intuitive and seamless end-to-end user experiences.'],
    ['User Interface Design', 'Build clear, consistent, and visually engaging interfaces.'],
    ['Interaction Design', 'Design meaningful interactions and intuitive interface behaviors.'],
    ['Wireframing & Prototyping', 'Translate ideas into structured interface layouts and interactive prototypes.'],
    ['Responsive Design', 'Create adaptable experiences across different screen sizes.'],
  ]],

  ['Product & Design Practices', [
    ['Design Systems', 'Build reusable components and maintain design consistency.'],
    ['Design Thinking', 'Approach complex problems through structured, user-centered thinking.'],
    ['Accessibility (WCAG)', 'Design inclusive experiences aligned with accessibility standards.'],
    ['UX Writing', 'Create clear, consistent, and user-friendly product communication.'],
    ['Design Handoff', 'Communicate design specifications for smooth implementation.'],
    ['Agile / Scrum', 'Collaborate effectively within iterative product teams.'],
  ]],

  ['Core Strengths', [
    ['Problem Solving', 'Break complex challenges into practical solutions.'],
    ['Critical Thinking', 'Evaluate ideas and make informed design decisions.'],
    ['Communication', 'Express ideas clearly and communicate design decisions.'],
    ['Collaboration', 'Work effectively with designers, developers, and stakeholders.'],
    ['Attention to Detail', 'Maintain consistency and quality across design work.'],
  ]],
];



export const SERVICES = [
  [
    'UI/UX Design',
    'User-centered digital experiences with intuitive interfaces, seamless interactions, and thoughtful user flows.',
    'pen-tool',
  ],
  [
    'Web Design & Development',
    'Modern, responsive websites designed and developed for performance, accessibility, and usability.',
    'code',
  ],
  [
    'Mobile App Design',
    'Intuitive mobile experiences with carefully crafted user journeys, interfaces, and interactive prototypes.',
    'smartphone',
  ],
  [
    'Mobile App Development',
    'Functional mobile applications built with modern technologies and user-focused development practices.',
    'smartphone',
  ],
  [
    'Product Revamping',
    'Improving existing digital products through better usability, refined interfaces, and enhanced user experiences.',
    'refresh',
  ],
  [
    'Logo & Brand Identity',
    "Memorable logos and cohesive visual identities that communicate a brand's personality and values.",
    'palette',
  ],
];


export const WORDS = [
  'Stay curious',
  'Create with purpose',
  'Think deeply',
  'Keep exploring',
  'Trust the journey',
  'Always grateful',
  'Find your balance',
  'Guided by grace',
  'Follow your Dharma',
  'Choose kindness',
  'Peace within',
  'Keep growing',
];

export const TESTIMONIALS = [
  {
    id: 'sample-logika',
    name: 'K. Logika',
    role: 'Founder',
    company: 'Misscode',
    quote: 'If you need top-quality design work, I highly recommend Sanjeevan. He made our logo redesign process effortless with his clear communication, cooperative nature, and timely delivery. The final design was spot-on!',
    portrait: '/images/Petties.png',
  },

  {
    id: 'sample-abinaya',
    name: 'S. Abinaya',
    role: 'UI/UX Designer',
    company: 'Pineapple AI',
    quote: 'He brought thoughtful questions to every review and turned feedback into a stronger design.',
    portrait: '/images/Veggies.png'
  },

  {
    id: 'sample-daniel',
    name: 'Daniel Silva', role: 'Engineering Lead',
    company: 'Mosaic Works',
    quote: 'The handoff was detailed and practical, which helped our team move from design to build smoothly.',
    portrait: '/images/Orderista.png'
  },

  {
    id: 'sample-vaishnavi',
    name: 'Vaishnavi', role: 'Creative Director',
    company: 'Common Ground (sample)',
    quote: 'A careful eye for detail and a generous way of collaborating made the project better.',
    portrait: '/images/Chiliz.png'
  },

  {
    id: 'sample-ashini',
    name: 'Ashini', role: 'Project Manager',
    company: 'Webtezza',
    quote: 'Sanjeevan brought structure to an open-ended brief without losing the original creative idea.',
    portrait: '/images/SB Banking App.png'
  },

  {
    id: 'sample-mathumila',
    name: 'Mathumila',
    role: 'Software Developer',
    company: 'Lumina',
    quote: 'Great experience working with you. The design was creative, professional, and delivered on time. I’m very satisfied with the final result.',
    portrait: '/images/Readify.png'
  },
];
