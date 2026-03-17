'use client';

import { Star } from 'lucide-react';
import { useEffect, useRef } from 'react';

const reviews = [
  {
    quote:
      'EasyKos helped me find a room in less than one day. The process felt clear, fast, and secure from start to finish.',
    name: 'Kevin Margason',
    role: 'Tenant',
  },
  {
    quote:
      'The dashboard saves a lot of time for property management. Payment tracking and tenant communication are much easier now.',
    name: 'Budi Santoso',
    role: 'Owner',
  },
  {
    quote:
      'I love the visual style and mascot missions. It makes routine tasks less stressful and keeps me engaged every day.',
    name: 'Mira Adelia',
    role: 'Tenant',
  },
];

export default function ReviewsSection() {
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
      id="reviews"
      ref={sectionRef}
      className="bg-white py-20 dark:bg-slate-950 sm:py-24 lg:py-[106px]"
    >
      <div className="mx-auto w-full max-w-[1358px] px-5 sm:px-8 lg:px-[72px]">
        <div className="mx-auto max-w-[760px] text-center">
          <h2 className="reveal text-[31px] font-extrabold leading-tight text-slate-900 dark:text-slate-50 sm:text-[36px] md:text-[44px]">
            Trusted by Tenants and Owners
          </h2>
          <p className="reveal delay-1 mt-4 text-[15px] leading-8 text-slate-500 dark:text-slate-400 sm:text-base">
            Real stories from people who now use EasyKos every day.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:mt-14 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <article
              key={review.name}
              className={`reveal delay-${index + 1} glass-card group rounded-[24px] p-8 transition hover:-translate-y-1.5 hover:shadow-[0_20px_44px_rgba(186,96,84,0.22)] dark:hover:shadow-[0_20px_44px_rgba(2,6,23,0.68)] lg:min-h-[306px] ${index === 1 ? 'lg:-mt-8' : ''}`}
            >
              <div className="mb-5 flex items-center gap-1 text-[#f59e0b]">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={`${review.name}-${starIndex}`} size={17} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">&ldquo;{review.quote}&rdquo;</p>
              <div className="mt-8 border-t border-[#efe5dd] pt-5 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-[#6f6f6f] to-[#4f4f4f] shadow-[0_10px_20px_rgba(15,23,42,0.26)] dark:from-slate-500 dark:to-slate-700">
                    <span className="absolute top-[10px] h-5 w-5 rounded-full bg-white/95 dark:bg-slate-100" />
                    <span className="absolute bottom-[8px] h-[18px] w-[30px] rounded-full bg-white/95 dark:bg-slate-100" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{review.name}</p>
                    <p className="text-xs font-semibold text-[#BA6054] dark:text-[#e07b6d]">{review.role}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


