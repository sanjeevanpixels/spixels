import {CircleHelp, Heart} from "lucide-react";
export default function HeroSection03() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#ffffff] text-[#11121a]">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-15 [background-image:radial-gradient(circle,#11121a_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="relative z-10 px-5 pb-32 pt-16 sm:px-8 sm:pt-20">
        <div className="flex w-full flex-col items-start justify-center gap-2 md:items-center">
          <div className="items-center md:flex md:gap-6">
            <p className="mb-3 max-w-[220px] text-xs leading-5 text-[#11121a]/55 md:max-w-[180px] md:text-right md:text-sm">
              I am a product designer based in Sri Lanka.
            </p>
            <h1 className="text-[clamp(3.25rem,14vw,7rem)] font-light leading-[0.9] tracking-[0.08em] md:text-7xl xl:text-[10rem]">
              DIGITAL
            </h1>
          </div>

          <div className="items-center md:flex md:gap-6">
            <h1 className="flex items-center text-[clamp(3.25rem,14vw,7rem)] font-light leading-[0.9] tracking-[0.08em] md:text-7xl xl:text-[10rem]">
              <span>PR</span>
              <CircleHelp className="mx-1 size-14 text-[#FF2056] sm:size-18 md:size-18 lg:size-40" strokeWidth={1.6} />
              <span>DUCTS</span>
            </h1>
            <p className="mt-5 max-w-[250px] text-xs leading-5 text-[#11121a]/55 md:mt-8 md:max-w-[180px] md:text-sm">
              Open to all forms of design collaboration, regardless of location and language.
            </p>
          </div>

          <div className="items-center md:flex md:gap-6">
            <h1 className="flex flex-wrap items-center text-[clamp(3.25rem,14vw,7rem)] font-light leading-[0.9] tracking-[0.08em] md:text-7xl xl:text-[10rem]">
              <span>DESIGN</span>
              <Heart className="mx-2 size-[70px] fill-[#FF2056] text-[#FF2056] lg:size-40" strokeWidth={1.4} />
              <span>CODE</span>
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
