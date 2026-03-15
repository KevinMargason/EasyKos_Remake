'use client';

import { Building2, Camera, ChartNoAxesColumn, CreditCard, MessageCircleMore, Squirrel } from 'lucide-react';
import { useEffect, useRef } from 'react';

const features = [
  {
    icon: Building2,
    title: 'Room Discovery',
    description: 'Browse curated room listings complete with photos, prices, and real facilities.',
  },
  {
    icon: ChartNoAxesColumn,
    title: 'Owner Dashboard',
    description: 'Manage room occupancy, monitor tenant activity, and update listings in one panel.',
  },
  {
    icon: CreditCard,
    title: 'Secure Payment',
    description: 'Pay rent and booking fees safely with integrated and encrypted payment options.',
  },
  {
    icon: MessageCircleMore,
    title: 'In-App Chat',
    description: 'Communicate directly with property owners before booking and during your stay.',
  },
  {
    icon: Camera,
    title: 'Video Feed',
    description: 'Explore room tours and neighborhood highlights in a short video experience.',
  },
  {
    icon: Squirrel,
    title: 'Virtual Squirrel',
    description: 'Complete missions, keep streaks, and unlock mascot moods while using EasyKos.',
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
          {features.map(({ icon: Icon, title, description }, i) => (
            <article
              key={title}
              className={`reveal delay-${i + 1} glass-card group rounded-[22px] p-6 transition hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(186,96,84,0.22)] dark:hover:shadow-[0_18px_42px_rgba(2,6,23,0.65)] lg:min-h-[258px]`}
            >
              <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff1e7] text-[#BA6054] transition group-hover:scale-110 dark:bg-[#3d2820] dark:text-[#e07b6d]">
                <Icon size={22} />
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
