// import LensVideoCarousel from '../components/ui/LensVideoCarousel'
// import ScrollFlipText from '../components/ui/Scrollfliptext'
// import ArcPokeText from '../components/ui/Arcpoketext'
import StringPluckText from '../components/ui/StringPluckText'
// import TitleFlipReveal from '../components/ui/TitleFlipReveal'
// import ScrollScribblePath from '../components/ui/ScrollScribblePath'
// import AsciiKrishnaFooter from '../components/ui/AsciiKrishnaFooter'
// import HeroSection03 from '../components/ui/HeroSection03'

// const items = [
//   {
//     src: '/logos/devsha.jpeg',   // shows until the video has a frame
//     alt: 'Brand reel for Northwind',
//     title: 'Devsha',               // label that follows the cursor
//   },
//   {
//     src: '/logos/k6tatto.png',
//     alt: 'Animated logo study',
//     title: 'K6 Tattoo',
//   },
//    {
//     src: '/logos/misscode.png',
//     alt: 'Animated logo study',
//     title: 'Misscode',
//   },
//      {
//     src: '/logos/petties.png',
//     alt: 'Animated logo study',
//     title: 'Petties',
//   },
//      {
//     src: '/logos/veggies.png',
//     alt: 'Animated logo study',
//     title: 'Veggies',
//   },
//   {
//     src: '/logos/food-fashion.png',
//     alt: 'Animated logo study',
//     title: 'Food Fashion',
//   },
//   {
//     src: '/logos/readify.png',
//     alt: 'Animated logo study',
//     title: 'Readify',
//   },
//   {
//     src: '/logos/orderista.png',
//     alt: 'Animated logo study',
//     title: 'Orderista',
//   },
//   {
//     src: '/logos/chiliz.png',
//     alt: 'Animated logo study',
//     title: 'Chiliz',
//   },
//   {
//     src: '/logos/es.png',
//     alt: 'Animated logo study',
//     title: 'Eastern Spark',
//   },
// ]

export default function Page() {
  return (
    <main>
      {/* <HeroSection03 />
    
      <ScrollFlipText
        className="border-t border-white/10"
        statements={[
          { text: 'We find the idea', accent: 'then give it a point of view.' },
          { text: 'We shape the identity', accent: 'through type, color and motion.' },
          { text: 'We build the experience', accent: 'clear, useful and memorable.' },
        ]}
        ink="#f7f4ef"
        accent="#ff2056"
        background="#12131E"
      />

      <section className="h-screen">
        <LensVideoCarousel
          items={items}
          kicker="Portfolio 2026"
          title="Selected Home"
          highlight="Home"
        />
      </section> */}

{/* <ScrollScribblePath
        colors={['#11121a', '#6d28d9', '#ff2056']}
        backgrounds={['#f7f4ef', '#e7e1ff', '#ffede4']}
        className="min-h-[150vh]"
        loops={0.65}
        seed={19}
      >
        <section className="relative z-10 flex min-h-[150vh] items-center px-6 py-24 text-[#11121a] sm:px-10 md:px-12">
          <div className="mx-auto grid w-full max-w-6xl gap-24 sm:gap-32">
            {[
              ['01 / Discover', 'Start with the people, their needs, and the details that matter.'],
              ['02 / Shape', 'Bring a clear idea to life through considered design and interaction.'],
              ['03 / Deliver', 'Make the final experience feel effortless, useful, and unmistakably yours.'],
            ].map(([label, copy]) => (
              <article key={label} className="max-w-2xl rounded-[28px] border border-[#11121a]/10 bg-white/70 p-6 shadow-[0_20px_60px_rgba(17,18,26,0.08)] backdrop-blur-sm sm:p-10">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#6d28d9]">{label}</p>
                <p className="mt-5 text-2xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">{copy}</p>
              </article>
            ))}
          </div>
        </section>
      </ScrollScribblePath> */}

      <section className="flex min-h-[70vh] items-center overflow-hidden bg-[#21143D] px-6 py-20 text-white sm:py-24 md:px-12">
        <div className="mx-auto w-full max-w-6xl">
          <StringPluckText
            text="Ideas that resonate."
            stringColor="#ffb900"
            className="font-black tracking-[-0.06em]"
          />
        </div>
      </section>

  {/* <section aria-label="Closing artwork">
        <AsciiKrishnaFooter
          colors={['#4a42bb', '#f3d9a1']}
          accent="#ffb900"
          background="#05060f"
          cellSize={7}
          brushRadius={3}
          className="min-h-[560px]"
        />
      </section> */}

      {/* <section className="flex min-h-[75vh] items-center bg-[#e7e1ff] px-6 py-20 text-[#17151f] sm:py-24 md:px-12">
        <div className="mx-auto w-full max-w-6xl">
          <p className="mb-6 text-sm font-bold uppercase tracking-[0.18em] text-[#6d28d9]">
            The next chapter
          </p>
          <TitleFlipReveal
            lines={['Make it', 'clear.', 'Make it', 'matter.']}
            altLines={['Shape the', 'feeling.', 'Build the', 'future.']}
            flipOn="click"
            className="text-5xl font-black leading-[0.98] tracking-[-0.055em] sm:text-7xl md:text-8xl"
          />
          <p className="mt-8 text-sm text-[#17151f]/55">Tap or click the headline to flip it.</p>
        </div>
      </section> */}
      
      {/* <section id="projects" className="flex min-h-[85vh] items-center bg-[#ffede4] px-6 py-20 text-[#15110f] sm:px-10 md:px-12">
        <div className="mx-auto w-full max-w-6xl">
          <ArcPokeText
            lines={['DESIGN', 'WITH PULSE']}
            className="text-[clamp(68px,15vw,220px)] font-black uppercase tracking-[-0.055em]"
            style={{ color: '#15110f' }}
            arcDrop={0.065}
            arcTilt={8}
            poke
          />
        </div>
      </section> */}





      

    
    </main>
  )
}