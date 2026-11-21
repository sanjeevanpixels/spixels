import { AtSign, CircleHelp, Heart, MessageCircle, Send } from "lucide-react";

export default function HeroSection03() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f7f4ef] text-[#11121a]">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-15 [background-image:radial-gradient(circle,#11121a_1px,transparent_1px)] [background-size:20px_20px]" />

      <header className="relative z-10 flex items-center justify-between px-5 pt-5 sm:px-8 sm:pt-6">
        <div className="text-xl font-bold italic sm:text-2xl">aliimam.in</div>
        <nav className="hidden items-center gap-6 text-sm md:flex" aria-label="Hero navigation">
          {["Index", "About", "Work", "Archive", "Contact"].map((label, index) => (
            <a
              key={label}
              href={index === 0 ? "#top" : `#${label.toLowerCase()}`}
              className={index === 0 ? "font-semibold transition-opacity hover:opacity-60" : "text-[#11121a]/45 transition-colors hover:text-[#11121a]"}
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      <main className="relative z-10 px-5 pb-32 pt-16 sm:px-8 sm:pt-20">
        <div className="flex w-full flex-col items-start justify-center gap-2 md:items-center">
          <div className="items-center md:flex md:gap-6">
            <p className="mb-3 max-w-[220px] text-xs leading-5 text-[#11121a]/55 md:max-w-[180px] md:text-right md:text-sm">
              I am india digital product designer based in Bokaro Steel City, India.
            </p>
            <h1 className="text-[clamp(3.25rem,14vw,7rem)] font-light leading-[0.9] tracking-[0.08em] md:text-7xl xl:text-[10rem]">
              DIGITAL
            </h1>
          </div>

          <div className="items-center md:flex md:gap-6">
            <h1 className="flex items-center text-[clamp(3.25rem,14vw,7rem)] font-light leading-[0.9] tracking-[0.08em] md:text-7xl xl:text-[10rem]">
              <span>PR</span>
              <CircleHelp className="mx-1 size-14 text-rose-500 sm:size-18 md:size-18 lg:size-40" strokeWidth={1.6} />
              <span>DUCTS</span>
            </h1>
            <p className="mt-5 max-w-[250px] text-xs leading-5 text-[#11121a]/55 md:mt-8 md:max-w-[180px] md:text-sm">
              Open to all forms of design collaboration, regardless of location and language.
            </p>
          </div>

          <div className="items-center md:flex md:gap-6">
            <h1 className="flex flex-wrap items-center text-[clamp(3.25rem,14vw,7rem)] font-light leading-[0.9] tracking-[0.08em] md:text-7xl xl:text-[10rem]">
              <span>DESIGN</span>
              <Heart className="mx-2 size-[70px] fill-rose-500 text-rose-500 lg:size-40" strokeWidth={1.4} />
              <span>CODE</span>
            </h1>
          </div>
        </div>

        <div className="mx-auto mt-6 w-full max-w-7xl sm:mt-10">
          <div className="grid items-center gap-3 md:flex md:justify-end md:px-8">
            <div className="mx-auto my-6 h-px w-full max-w-3xl bg-[#11121a]/15" />
            <div className="whitespace-nowrap text-xs md:text-sm">BOKARO STEEL CITY, INDIA 827010</div>
            <div className="flex w-full items-end gap-3 md:w-auto">
              <span className="text-2xl font-thin md:text-4xl">DESIGNER</span>
              <span className="text-3xl font-bold italic text-orange-600 md:text-5xl">ali</span>
            </div>
          </div>
        </div>

        <div className="items-end gap-6 pt-12 md:flex md:px-12 lg:px-20">
          <div className="mb-8 h-48 w-full overflow-hidden rounded-md border shadow-lg md:mb-0 md:w-[336px] md:shrink-0">
            <img
              src="https://cdn.21st.dev/assets/localized/74e550b9690bacf66ebd69b3516ef9c8734a44a247d4b6b6de2b86919aa367b3.jpg"
              alt="Designer portfolio preview"
              className="h-full w-full object-cover"
            />
          </div>
          <p className="max-w-xs text-xs leading-5 text-[#11121a]/55 md:text-sm">
            Open to all forms of design collaboration, regardless of location and language.
          </p>
        </div>

        <div className="absolute bottom-8 right-5 flex gap-5 sm:right-12" aria-label="Social links">
          <AtSign className="size-5" />
          <Send className="size-5" />
          <MessageCircle className="size-5" />
        </div>
      </main>

      <div className="absolute right-0 top-1/2 hidden h-36 -translate-y-1/2 items-center md:flex">
        <div className="bg-[#11121a] px-3 py-6 text-sm font-bold text-[#f7f4ef]">
          <span className="rotate-180 [writing-mode:vertical-rl]">Design Award</span>
        </div>
      </div>
    </section>
  );
}
