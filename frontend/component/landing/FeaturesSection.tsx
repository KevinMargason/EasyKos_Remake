'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

const features = [
  {
    icon: '/Asset/icon/icon-house-search.svg',
    title: 'Room Booking & Rent',
    description: 'Easily browse, select, and book your dream room with just a few taps.',
  },
  {
    icon: '/Asset/icon/icon-chart.svg',
    title: 'Owner Dashboard',
    description: 'Comprehensive management tools for boarding house owners.',
  },
  {
    icon: '/Asset/icon/icon-shield.svg',
    title: 'Secure Payments',
    description: '100% safe transactions integrated with leading payment gateways.',
  },
  {
    icon: '/Asset/icon/icon-chat.svg',
    title: 'In-App Direct Chat',
    description: 'Communicate directly with property owners securely within the app.',
  },
  {
    icon: '/Asset/icon/icon-play.svg',
    title: 'Video Content Feed',
    description: 'Watch property tours and tips in a scrollable video feed format.',
  },
  {
    icon: '/Asset/icon/icon-squirrel.svg',
    title: 'Virtual Pet Game',
    description: 'Care for your digital squirrel by completing app milestones!',
  },
];

export default function FeaturesSection() {
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
    <section
      id="features"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#fffaf6] py-20 dark:bg-slate-900 sm:py-24 lg:py-[108px]"
    >
      <div className="absolute left-1/2 top-0 h-[480px] w-[760px] -translate-x-1/2 rounded-full bg-[#ffbe8f26] blur-3xl dark:bg-[#ba60541a]" />
      <div className="relative mx-auto w-full max-w-[1358px] px-5 sm:px-8 lg:px-[72px]">
        <div className="mx-auto max-w-[760px] text-center">
          <h2 className="reveal text-[31px] font-extrabold leading-tight text-slate-900 dark:text-slate-50 sm:text-[36px] md:text-[44px]">
            Core Features For Better Kos Living
          </h2>
          <p className="reveal delay-1 mt-4 text-[15px] leading-8 text-slate-500 dark:text-slate-400 sm:text-base">
            From discovery to daily management, everything you need lives in one seamless platform.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-14 sm:grid-cols-2 lg:gap-7 lg:grid-cols-3">
          {features.map(({ icon, title, description }, i) => (
            <article
              key={title}
              className={`reveal delay-${i + 1} glass-card group relative mt-5 rounded-[22px] p-6 transition hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(186,96,84,0.22)] dark:hover:shadow-[0_18px_42px_rgba(2,6,23,0.65)] lg:min-h-[258px]`}
            >
              <span className="glass-card absolute left-3 -top-5 inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/70 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.2)] dark:border-slate-700 dark:bg-slate-800 sm:-left-6 sm:-top-6 sm:h-16 sm:w-16">
                <Image src={icon} alt={`${title} icon`} width={30} height={30} className="h-[30px] w-[30px] object-contain sm:h-[34px] sm:w-[34px]" />
              </span>
              <h3 className="mt-8 text-lg font-extrabold text-slate-900 dark:text-slate-100">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
