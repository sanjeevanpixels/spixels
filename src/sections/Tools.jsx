import { useState } from 'react';
import SectionHeading from '../components/ui/SectionHeading';
import { SOFT_SKILLS } from '../data/content';

/* Tool categories */
const GROUPS = [
  {
    id: 'design',
    title: 'Design & Creativity',
    blurb: 'Where ideas, interfaces and visual identities take shape.',
    tools: [
      'Figma',
      'Adobe XD',
      'Framer',
      'Penpot',
      'Adobe Illustrator',
      'Adobe Photoshop',
      'Canva',
      'Behance',
      'Dribbble',
      'Awwwards',
      'Pinterest',
    ],
  },
  {
    id: 'development',
    title: 'Development & Technology',
    blurb: 'Technologies I use to bring digital experiences to life.',
    tools: [
      'HTML5',
      'CSS3',
      'Sass',
      'Tailwind CSS',
      'JavaScript',
      'React.js',
      'React Native',
      'Flutter',
      'Material Design',
      'Git',
      'GitHub',
      'VS Code',
      'Google Antigravity',
    ],
  },
  {
    id: 'research',
    title: 'Research & AI',
    blurb: 'Tools for exploring ideas, researching problems and gathering insights.',
    tools: [
      'ChatGPT',
      'Claude',
      'Gemini',
      'Perplexity',
      'Google Forms',
    ],
  },
  {
    id: 'productivity',
    title: 'Productivity & Collaboration',
    blurb: 'Tools for managing projects, sharing feedback and working together.',
    tools: [
      'ClickUp',
      'Trello',
      'Jira',
      'Slack',
      'Gmail',
      'Google Meet',
      'Zoom',
      'Microsoft Teams',
    ],
  },
];

/* Local SVG icon mapping */
const TOOL_ICONS = {
  Figma: '/icons/figma.svg',
  FigJam: '/icons/figjam.svg',
  'Adobe Illustrator': '/icons/illustrator.svg',
  'Adobe Photoshop': '/icons/photoshop.svg',
  Canva: '/icons/canva.svg',
  Behance: '/icons/behance.svg',
  Dribbble: '/icons/dribbble.svg',
  Pinterest: '/icons/pinterest.svg',
  HTML5: '/icons/html5.svg',
  'Google Antigravity': '/icons/google-antigravity.svg',
  'Google Chat': '/icons/google-chat.svg',
  'Google Keep': '/icons/google-chat.svg',
  CSS3: '/icons/css3.svg',
  Sass: '/icons/sass.svg',
  JavaScript: '/icons/javascript.svg',
  'React.js': '/icons/react.svg',
  'React Native': '/icons/react-native.svg',
  Flutter: '/icons/flutter.svg',
  'Tailwind CSS': '/icons/tailwind.svg',
  Git: '/icons/git.svg',
  GitHub: '/icons/github.svg',
  'VS Code': '/icons/vs-code.svg',
  ChatGPT: '/icons/chatgpt.svg',
  Claude: '/icons/claude.svg',
  Gemini: '/icons/gemini.svg',
  Perplexity: '/icons/perplexity.svg',
  'Google Forms': '/icons/google-forms.svg',
  ClickUp: '/icons/clickup.svg',
  Trello: '/icons/trello.svg',
  Jira: '/icons/jira.svg',
  Slack: '/icons/slack.svg',
  Gmail: '/icons/gmail.svg',
  'Google Meet': '/icons/google-meet.svg',
  Zoom: '/icons/zoom.svg',
  'Microsoft Teams': '/icons/microsoft-teams.svg',
  'Microsoft Copilot': '/icons/microsoft-copilot.svg',
  'Material Design': '/icons/material-design.svg',
  Awwwards: '/icons/awwwards.svg',
  'Adobe XD': '/icons/xd.svg',
  Framer: '/icons/framer.svg',
  Penpot: '/icons/penpot.svg',
};

/* Main section */
export default function Tools() {
  return (
    <section
      id="tools"
      className="sec overflow-hidden !py-10 bg-[#FBFBFB] dark:bg-[#0D0F17] sm:!py-14 lg:!py-16"
    >
      <div className="wrap">

        {/* Section heading */}
        <div className="mx-auto text-center mb-7 sm:mb-10">
          <SectionHeading
            title="Tools & Capabilities"
            subtitle="A mix of tools I use to generate ideas, research, create, design, and build faster."
            className="mb-0"
            subClassName="mx-auto max-w-md"
          />
        </div>

        {/* Tool categories */}
        <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
          {GROUPS.map((group) => (
            <ToolCard key={group.id} group={group} />
          ))}
        </div>

        {/* Soft skills section */}
        <section
          aria-labelledby="soft-skills-heading"
          className="mx-auto mt-6 w-full max-w-[1600px] rounded-2xl border border-violet-100/80 bg-white p-4 dark:border-white/10 dark:bg-[#151826] dark:shadow-none sm:mt-8 sm:rounded-[28px] sm:p-6 lg:p-8"
        >
          <div className="mb-5 sm:mb-6">
            <p className="mb-1 text-sm font-semibold text-pink-600 dark:text-pink-400">
              Skills &amp; Approach
            </p>

            <h3
              id="soft-skills-heading"
              className="text-2xl font-bold tracking-tight font-bricolage sm:text-3xl"
            >
              Beyond the Design
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {SOFT_SKILLS.map(([group, skills]) => (
              <div key={group} className="min-w-0">
                <h4 className="mb-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {group}
                </h4>

                <ul className="flex flex-wrap gap-2">
                  {skills.map(([skill, detail]) => (
                    <li key={skill}>
                      <SkillChip skill={skill} detail={detail} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

      </div>
    </section>
  );
}

/* Category card */
function ToolCard({ group }) {
  const headingId = `tools-${group.id}`;

  return (
    <article
      aria-labelledby={headingId}
      className="flex h-full flex-col rounded-2xl border border-slate-200/70 bg-white p-4 dark:border-white/10 dark:bg-[#151826] sm:rounded-3xl sm:p-6"
    >
      <header className="flex items-center gap-3 mb-5">
        <div className="min-w-0">
          <h3
            id={headingId}
            className="text-base font-semibold leading-tight sm:text-lg"
          >
            {group.title}
          </h3>

          <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {group.blurb}
          </p>
        </div>
      </header>

      <ul className="grid grid-cols-4 mt-auto gap-x-2 gap-y-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8">
        {group.tools.map((name) => (
          <li key={name} className="min-w-0">
            <ToolTile name={name} />
          </li>
        ))}
      </ul>
    </article>
  );
}

/* Tool tile */
function ToolTile({ name }) {
  return (
    <div className="flex flex-col items-center min-w-0 gap-2 text-center group">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white ring-1 ring-slate-200 transition-transform motion-safe:group-hover:-translate-y-0.5 dark:ring-white/15 sm:h-14 sm:w-14 sm:rounded-2xl">
        <ToolIcon name={name} />
      </span>

      <span className="w-full break-words text-[10px] font-medium leading-tight text-slate-600 dark:text-slate-300 sm:text-xs">
        {name}
      </span>
    </div>
  );
}

/* Tool icon */
function ToolIcon({ name }) {
  const [failed, setFailed] = useState(false);

  const iconSrc = TOOL_ICONS[name];

  if (!iconSrc || failed) {
    const initials = name
      .replace(/[^A-Za-z0-9 ]/g, '')
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    return (
      <span aria-hidden="true" className="text-sm font-bold text-slate-500">
        {initials}
      </span>
    );
  }

  return (
    <img
      src={iconSrc}
      alt=""
      width={32}
      height={32}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="object-contain w-6 h-6 sm:h-7 sm:w-7"
    />
  );
}

/* Soft skill chip */
function SkillChip({ skill, detail }) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const detailId = `skill-${skill.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  const open = (hovered || focused) && !dismissed;

  const onKeyDown = (event) => {
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      setDismissed(true);
    }
  };

  return (
    <span
      className="skill-item"
      onMouseEnter={() => {
        setHovered(true);
        setDismissed(false);
      }}
      onMouseLeave={() => {
        setHovered(false);
        if (!focused) setDismissed(false);
      }}
    >
      <span
        tabIndex={0}
        className="skill-chip"
        onFocus={() => {
          setFocused(true);
          setDismissed(false);
        }}
        onBlur={() => {
          setFocused(false);
          if (!hovered) setDismissed(false);
        }}
        onKeyDown={onKeyDown}
        aria-describedby={detailId}
      >
        {skill}
      </span>

      <span id={detailId} className="sr-only">
        {detail}
      </span>

      <span
        role="tooltip"
        aria-hidden="true"
        className={`skill-tooltip ${open ? 'is-visible' : ''}`}
      >
        {detail}
      </span>
    </span>
  );
}