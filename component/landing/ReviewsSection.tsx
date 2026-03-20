'use client';

import { Star } from 'lucide-react';
import { useEffect, useRef } from 'react';

const reviews = [
  {
    quote:
      'EasyKos membantu saya menemukan kamar dalam waktu kurang dari satu hari. Prosesnya terasa jelas, cepat, dan aman dari awal sampai akhir.',
    name: 'Kevin Margason',
    role: 'Penyewa',
  },
  {
    quote:
      'Dasbor ini menghemat banyak waktu untuk pengelolaan properti. Pelacakan pembayaran dan komunikasi dengan penyewa sekarang jauh lebih mudah.',
    name: 'Budi Santoso',
    role: 'Pemilik',
  },
  {
    quote:
      'Saya suka gaya visualnya dan misi maskotnya. Ini membuat tugas rutin terasa lebih ringan dan membuat saya tetap terlibat setiap hari.',
    name: 'Mira Adelia',
    role: 'Penyewa',
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
      className="bg-white py-24 dark:bg-slate-950 sm:py-28 lg:py-[128px]"
    >
      <div className="mx-auto w-full max-w-[1358px] px-5 sm:px-8 lg:px-[72px]">
        <div className="mx-auto max-w-[800px] text-center">
          <h2 className="reveal text-[34px] font-extrabold leading-tight text-slate-900 dark:text-slate-50 sm:text-[40px] md:text-[50px] lg:text-[56px]">
            Dipercaya oleh Penyewa dan Pemilik
          </h2>
          <p className="reveal delay-1 mt-5 text-[15px] leading-8 text-slate-500 dark:text-slate-400 sm:text-base lg:text-[16px]">
            Kisah nyata dari orang-orang yang kini menggunakan EasyKos setiap hari.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-9 lg:mt-16 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <article
              key={review.name}
              className={`reveal delay-${index + 1} glass-card group rounded-[26px] p-9 transition hover:-translate-y-2 hover:shadow-[0_24px_48px_rgba(186,96,84,0.24)] dark:hover:shadow-[0_24px_48px_rgba(2,6,23,0.7)] lg:min-h-[340px] ${index === 1 ? 'lg:-mt-10' : ''}`}
            >
              <div className="mb-6 flex items-center gap-1.5 text-[#f59e0b]">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={`${review.name}-${starIndex}`} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="text-base leading-8 text-slate-600 dark:text-slate-300">&ldquo;{review.quote}&rdquo;</p>
              <div className="mt-10 border-t border-[#efe5dd] pt-6 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-[#6f6f6f] to-[#4f4f4f] shadow-[0_10px_20px_rgba(15,23,42,0.24)] dark:from-slate-500 dark:to-slate-700">
                    <span className="absolute top-[10px] h-5 w-5 rounded-full bg-white/100 dark:bg-slate-100" />
                    <span className="absolute bottom-[8px] h-5 w-7 rounded-full bg-white/100 dark:bg-slate-100" />
                  </span>
                  <div>
                    <p className="text-base font-bold text-slate-900 dark:text-slate-100">{review.name}</p>
                    <p className="text-sm font-semibold text-[#BA6054] dark:text-[#e07b6d]">{review.role}</p>
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


