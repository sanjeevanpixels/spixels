import LensVideoCarousel from '../components/ui/LensVideoCarousel'

const items = [
  {
    video: '/clips/brand-reel.mp4',
    src: '/posters/brand-reel.jpg',   // shows until the video has a frame
    alt: 'Brand reel for Northwind',
    title: 'Northwind',               // label that follows the cursor
    href: '/work/northwind',
  },
  {
    video: '/clips/logo-motion.mp4',
    src: '/posters/logo-motion.jpg',
    alt: 'Animated logo study',
    title: 'Logo Motion',
    href: '/work/logo-motion',
  },
  // use 6+ items, otherwise the rows look sparse
]

export default function Page() {
  return (
    <section className="h-screen">
      <LensVideoCarousel
        items={items}
        kicker="Portfolio 2026"
        title="Selected Work"
        highlight="Work"
      />
    </section>
  )
}