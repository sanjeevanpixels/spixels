import {
  ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Check, CircleAlert, Download, LoaderCircle,
  Atom, Bot, BookOpen, Braces, Briefcase, Brush, Calendar, Code, Coffee, Compass, Contrast, Copy,
  Cpu, Eye, Feather, FileText, Flower2, GitBranch, GitFork, Globe, GraduationCap, Hammer, HandHeart,
  Heart, Image, Layers, LayoutDashboard, LayoutTemplate, Lightbulb, Mail, MapPin, Menu,
  MessageCircle, Moon, Newspaper, NotebookPen, Palette, PenLine, PenTool, RefreshCw, Rocket,
  RotateCw, Search, Send, Shapes, Smartphone, Sparkles, Sun, Users, Video, Wind, X,
} from 'lucide-react';

// Maps the kebab-case icon names used in src/data/* to components (keeps the bundle tree-shaken).
const MAP = {
  // Arrows & actions
  'arrow-up': ArrowUp,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-up-right': ArrowUpRight,
  check: Check,
  download: Download,
  copy: Copy,
  send: Send,
  search: Search,
  menu: Menu,
  x: X,
  'rotate-cw': RotateCw,
  'alert-circle': CircleAlert,
  'loader-circle': LoaderCircle,

  // Services (new)
  layout: LayoutDashboard,
  smartphone: Smartphone,
  refresh: RefreshCw,
  cpu: Cpu,
  globe: Globe,
  rocket: Rocket,

  // Design & dev
  code: Code,
  braces: Braces,
  'git-branch': GitBranch,
  github: GitFork,
  figma: Shapes,
  framer: LayoutTemplate,
  palette: Palette,
  brush: Brush,
  'pen-tool': PenTool,
  'pen-line': PenLine,
  layers: Layers,
  image: Image,
  video: Video,
  contrast: Contrast,
  feather: Feather,
  rose: Flower2,

  // General
  atom: Atom,
  bot: Bot,
  'book-open': BookOpen,
  briefcase: Briefcase,
  calendar: Calendar,
  coffee: Coffee,
  compass: Compass,
  eye: Eye,
  'file-text': FileText,
  'graduation-cap': GraduationCap,
  hammer: Hammer,
  'hand-heart': HandHeart,
  heart: Heart,
  lightbulb: Lightbulb,
  mail: Mail,
  'map-pin': MapPin,
  'message-circle': MessageCircle,
  moon: Moon,
  newspaper: Newspaper,
  'notebook-pen': NotebookPen,
  sparkles: Sparkles,
  sun: Sun,
  users: Users,
  wind: Wind,
};

export default function Icon({ name, className = 'ico', ...props }) {
  const Cmp = MAP[name];
  if (!Cmp) {
    if (import.meta.env?.DEV) console.warn(`[Icon] Unknown icon name: "${name}"`);
    return null;
  }
  return <Cmp strokeWidth={1.75} className={className} aria-hidden="true" {...props} />;
}