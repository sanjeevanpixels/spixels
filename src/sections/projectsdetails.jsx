import LensVideoCarousel from '../components/ui/LensVideoCarousel'
import ScrollFlipText from '../components/ui/Scrollfliptext'
import ArcPokeText from '../components/ui/Arcpoketext'
import RopeCarousel from '../components/ui/RopeCarousel'

const items = [
  {
    video: '/clips/brand-reel.mp4',
    src: '/logos/devsha.jpeg',   // shows until the video has a frame
    alt: 'Brand reel for Northwind',
    title: 'Northwind',               // label that follows the cursor
    href: '/work/northwind',
  },
  {
    video: '/clips/logo-motion.mp4',
    src: '/logos/k6tatto.png',
    alt: 'Animated logo study',
    title: 'Logo Motion',
    href: '/work/logo-motion',
  },
   {
    video: '/clips/logo-motion.mp4',
    src: '/logos/misscode.png',
    alt: 'Animated logo study',
    title: 'Logo Motion',
    href: '/work/logo-motion',
  },
     {
    video: '/clips/logo-motion.mp4',
    src: '/logos/petties.png',
    alt: 'Animated logo study',
    title: 'Logo Motion',
    href: '/work/logo-motion',
  },
     {
    video: '/clips/logo-motion.mp4',
    src: '/logos/veggies.png',
    alt: 'Animated logo study',
    title: 'Logo Motion',
    href: '/work/logo-motion',
  },
     {
    video: '/clips/logo-motion.mp4',
    src: '/logos/sb.png',
    alt: 'Animated logo study',
    title: 'Logo Motion',
    href: '/work/logo-motion',
  },
     {
    video: '/clips/logo-motion.mp4',
    src: '/logos/food-fashion.png',
    alt: 'Animated logo study',
    title: 'Logo Motion',
    href: '/work/logo-motion',
  },
     {
    video: '/clips/logo-motion.mp4',
    src: '/logos/readify.png',
    alt: 'Animated logo study',
    title: 'Logo Motion',
    href: '/work/logo-motion',
  },
     {
    video: '/clips/logo-motion.mp4',
    src: '/logos/orderista.png',
    alt: 'Animated logo study',
    title: 'Logo Motion',
    href: '/work/logo-motion',
  },
     {
    video: '/clips/logo-motion.mp4',
    src: '/logos/chiliz.png',
    alt: 'Animated logo study',
    title: 'Logo Motion',
    href: '/work/logo-motion',
  },
     {
    video: '/clips/logo-motion.mp4',
    src: '/logos/es.png',
    alt: 'Animated logo study',
    title: 'Logo Motion',
    href: '/work/logo-motion',
  },
]

export default function Page() {
  return (
    <main>
      <section className="h-screen">
        <LensVideoCarousel
          items={items}
          kicker="Portfolio 2026"
          title="Selected Home"
          highlight="Home"
        />
      </section>

      <ScrollFlipText
        className="border-t border-white/10"
        statements={[
          { text: 'We find the idea', accent: 'then give it a point of view.' },
          { text: 'We shape the identity', accent: 'through type, color and motion.' },
          { text: 'We build the experience', accent: 'clear, useful and memorable.' },
        ]}
        ink="#f7f4ef"
        accent="#ff2056"
        background="#0d0d0f"
      />

      <section className="bg-[#f7f4ef] px-6 py-16 text-[#0d0d0f] sm:py-20 md:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e34723]">
            Selected identities
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
            Brands made to move.
          </h2>
        </div>
        <div className="mx-auto mt-8 h-[300px] max-w-6xl overflow-hidden rounded-[28px] bg-[#11121a] sm:mt-10 sm:h-[360px] sm:rounded-[36px]">
          <RopeCarousel
            items={items.map(({ src, title, alt }) => ({
              src,
              title,
              caption: alt,
            }))}
            cardWidth={184}
            gap={32}
            sag={42}
            speed={16}
            ropeColor="#756A88"
            clipColor="#A78BFA"
          />
        </div>
      </section>

      <section id="projects" className="flex min-h-[85vh] items-center bg-[#ffede4] px-6 py-20 text-[#15110f] sm:px-10 md:px-12">
        <div className="mx-auto w-full max-w-6xl">
          <p className="mb-6 text-sm font-bold uppercase tracking-[0.18em] text-[#e34723]">Selected expression</p>
          <ArcPokeText
            lines={['DESIGN', 'WITH PULSE']}
            className="text-[clamp(68px,15vw,220px)] font-black uppercase tracking-[-0.055em]"
            style={{ color: '#15110f' }}
            arcDrop={0.065}
            arcTilt={8}
            poke
          />
        </div>
      </section>
    </main>
  )
}