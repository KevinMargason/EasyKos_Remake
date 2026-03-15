'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

const mascots = [
  { src: '/Asset/squirrel-normal.svg',    alt: 'Squirrel normal',    className: 'top-4 right-1 rotate-[7deg]',   delay: '0s'    },
  { src: '/Asset/squirrel-happy.svg',     alt: 'Squirrel happy',     className: 'top-34 -left-3 -rotate-6',      delay: '1.2s'  },
  { src: '/Asset/squirrel-exhausted.svg', alt: 'Squirrel exhausted', className: 'bottom-28 right-4 -rotate-3',   delay: '0.6s'  },
  { src: '/Asset/squirrel-hungry.svg',    alt: 'Squirrel hungry',    className: 'bottom-4 left-4 rotate-6',      delay: '1.8s'  },
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
            EasyKos combines secure payments with a playful squirrel experience.
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
              className="inline-flex items-center gap-2 rounded-full border border-[#EAD1C7] bg-white/70 px-7 py-3.5 text-sm font-semibold text-[#BA6054] transition hover:scale-[1.04] hover:border-[#BA6054] dark:border-slate-700 dark:bg-slate-800/70 dark:text-[#e07b6d] dark:hover:border-[#e07b6d]"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* ── Right: card ── */}
        <div className="reveal delay-2 relative mx-auto h-[560px] w-full max-w-[560px] sm:h-[610px] sm:max-w-[620px] lg:h-[660px] lg:max-w-[624px]">
          <div className="absolute inset-x-8 inset-y-12 rounded-[34px] bg-gradient-to-b from-[#fff4ea] to-[#ffd8ba] shadow-[0_35px_80px_rgba(186,96,84,0.23)] dark:from-[#2d1f1a] dark:to-[#3d2820] lg:inset-x-10 lg:inset-y-14" />
          <div className="absolute left-1/2 top-1/2 w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-[30px] border border-[#f8d7c0] bg-white p-5 shadow-xl dark:border-slate-700 dark:bg-slate-800 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold tracking-[0.18em] text-[#BA6054] dark:text-[#e07b6d]">EASYKOS VIRTUAL PET</p>
              <span className="rounded-full bg-[#fff1e7] px-3 py-1 text-[11px] font-semibold text-[#BA6054] dark:bg-[#3d2820] dark:text-[#e07b6d]">ACTIVE</span>
            </div>
            <h3 className="text-[24px] font-extrabold leading-tight text-slate-900 dark:text-slate-50 sm:text-[26px]">One App, Four Moods.</h3>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Your squirrel evolves with daily actions, reminders, and rewards.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {mascots.map((mascot) => (
                <div key={mascot.src} className="rounded-2xl border border-slate-100 bg-[#faf7f5] p-2.5 dark:border-slate-700 dark:bg-slate-700/50">
                  <div className="relative h-20 w-full overflow-hidden rounded-xl bg-white dark:bg-slate-600/30">
                    <Image src={mascot.src} alt={mascot.alt} fill className="object-contain p-1.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating mascard cards */}
          {mascots.map((mascot) => (
            <div
              key={`${mascot.src}-floating`}
              className={`animate-float absolute hidden ${mascot.className} w-[136px] rounded-[24px] border border-white bg-white p-3 shadow-[0_20px_38px_rgba(15,23,42,0.14)] dark:border-slate-700 dark:bg-slate-800 xl:block`}
              style={{ animationDelay: mascot.delay }}
            >
              <div className="relative h-[110px] w-full">
                <Image src={mascot.src} alt={mascot.alt} fill className="object-contain" sizes="136px" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

