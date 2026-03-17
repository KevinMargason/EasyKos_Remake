'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

const roomPreviews = [
  {
    src: '/Asset/landing/kamar1.svg',
    alt: 'Preview kamar 1',
    className: 'top-4 right-[22%] h-[300px] w-[300px] sm:h-[360px] sm:w-[360px] lg:h-[420px] lg:w-[420px]',
  },
  {
    src: '/Asset/landing/kamar2.svg',
    alt: 'Preview kamar 2',
    className: 'top-[132px] -right-6 h-[280px] w-[280px] sm:top-[168px] sm:-right-7 sm:h-[330px] sm:w-[330px] lg:top-[192px] lg:-right-42 lg:h-[390px] lg:w-[390px]',
  },
  {
    src: '/Asset/landing/kamar3.svg',
    alt: 'Preview kamar 3',
    className: 'bottom-0 right-[12%] h-[250px] w-[250px] sm:h-[300px] sm:w-[300px] lg:h-[340px] lg:w-[340px]',
  },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reveals = section.querySelectorAll<HTMLElement>('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="home" ref={sectionRef} className="relative overflow-hidden bg-white dark:bg-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_10%_25%,rgba(255,221,192,0.45),transparent_60%),radial-gradient(45%_55%_at_88%_30%,rgba(255,169,105,0.25),transparent_70%)] dark:bg-[radial-gradient(70%_70%_at_10%_25%,rgba(186,96,84,0.15),transparent_60%),radial-gradient(45%_55%_at_88%_30%,rgba(186,96,84,0.1),transparent_70%)]" />

      <div className="relative mx-auto grid w-full max-w-[1358px] grid-cols-1 items-center gap-12 px-5 pb-18 pt-10 sm:px-8 md:pb-20 md:pt-12 lg:min-h-[836px] lg:grid-cols-[1.02fr_0.98fr] lg:gap-0 lg:px-[72px] lg:pt-0">

        {/* ── Left: text ── */}
        <div className="lg:pr-12">
          <div className="reveal mb-7 inline-flex items-center rounded-full bg-[#ba60541a] px-6 py-2 text-[13px] font-semibold text-[#BA6054] dark:bg-[#ba60542a] dark:text-[#e07b6d]">
            #1 Kost Finder Platform in Indonesia
          </div>

          <h1 className="reveal delay-1 max-w-[640px] text-[36px] font-extrabold leading-[1.03] tracking-[-0.03em] text-[#111827] dark:text-slate-50 sm:text-[52px] lg:text-[64px]">
            Find Comfortable &amp; Affordable Boarding.
          </h1>

          <p className="reveal delay-2 mt-6 max-w-[560px] text-[15px] leading-[1.95] text-slate-500 dark:text-slate-400 sm:text-base">
            Discover verified rooms, compare facilities, and book your ideal place in minutes.
            EasyKos combines secure payments with a playful digital experience.
          </p>

          <div className="reveal delay-3 mt-11 flex flex-wrap items-center gap-4">
            <Link
              href="#features"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#c66e5f] to-[#BA6054] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(186,96,84,0.3)] transition hover:scale-[1.04] hover:shadow-[0_16px_36px_rgba(186,96,84,0.42)]"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>
            <Link
              href="#features"
              className="glass-card inline-flex items-center gap-2 rounded-full border border-[#EAD1C7] bg-white/70 px-7 py-3.5 text-sm font-semibold text-[#BA6054] transition hover:scale-[1.04] hover:border-[#BA6054] dark:border-slate-700 dark:bg-slate-800/70 dark:text-[#e07b6d] dark:hover:border-[#e07b6d]"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* ── Right: room collage ── */}
        <div className="reveal delay-2 relative mx-auto h-[560px] w-full max-w-[560px] sm:h-[610px] sm:max-w-[620px] lg:h-[660px] lg:max-w-[624px]">
          {roomPreviews.map((room, index) => (
            <div
              key={room.src}
              className={`absolute ${room.className}`}
              style={{ zIndex: index + 1 }}
            >
              <Image src={room.src} alt={room.alt} fill className="object-contain" sizes="(max-width: 1024px) 50vw, 420px" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

