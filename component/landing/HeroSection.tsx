'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

const roomPreviews = [
  {
    src: '/Asset/kamar/kamar1.svg',
    alt: 'Pratinjau kamar 1',
    className: 'top-4 right-[22%] h-[300px] w-[300px] sm:h-[360px] sm:w-[360px] lg:h-[420px] lg:w-[420px]',
  },
  {
    src: '/Asset/kamar/kamar2.svg',
    alt: 'Pratinjau kamar 2',
    className: 'top-[132px] -right-6 h-[280px] w-[280px] sm:top-[168px] sm:-right-7 sm:h-[330px] sm:w-[330px] lg:top-[192px] lg:-right-42 lg:h-[390px] lg:w-[390px]',
  },
  {
    src: '/Asset/kamar/kamar3.svg',
    alt: 'Pratinjau kamar 3',
    className: 'bottom-0 right-[20%] h-[250px] w-[250px] sm:h-[300px] sm:w-[300px] lg:h-[415px] lg:w-[370px]',
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
    <section id="home" ref={sectionRef} className="relative overflow-hidden bg-white dark:bg-slate-900 scroll-mt-[90px]">
      <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_10%_25%,rgba(255,221,192,0.45),transparent_60%),radial-gradient(45%_55%_at_88%_30%,rgba(255,169,105,0.25),transparent_70%)] dark:bg-[radial-gradient(70%_70%_at_10%_25%,rgba(186,96,84,0.15),transparent_60%),radial-gradient(45%_55%_at_88%_30%,rgba(186,96,84,0.1),transparent_70%)]" />

      <div className="relative mx-auto grid w-full max-w-[1358px] grid-cols-1 items-center gap-12 px-5 pb-24 pt-8 sm:px-8 md:pb-28 md:pt-12 lg:min-h-[920px] lg:grid-cols-[0.98fr_1.02fr] lg:gap-12 lg:px-[72px] lg:py-25 lg:pt-8">

        {/* ── Left: text ── */}
        <div className="lg:-mr-12 lg:pr-8">
          <div className="reveal mb-8 inline-flex items-center rounded-full bg-[#ba60541a] px-6 py-2 text-[13px] font-semibold text-[#BA6054] dark:bg-[#ba60542a] dark:text-[#e07b6d]">
            Platform pencari kos nomor 1 di Indonesia
          </div>

          <h1 className="reveal delay-1 max-w-[700px] text-[40px] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#111827] dark:text-slate-50 sm:text-[56px] lg:text-[72px]">
            Temukan kos yang nyaman dan terjangkau.
          </h1>

          <p className="reveal delay-2 mt-8 max-w-[600px] text-[15px] leading-[1.95] text-slate-500 dark:text-slate-400 sm:text-base lg:text-[16px]">
            Jelajahi kamar terverifikasi, bandingkan fasilitas, dan pesan tempat ideal Anda dalam hitungan menit.
            EasyKos menggabungkan pembayaran aman dengan pengalaman digital yang menyenangkan.
          </p>

          <div className="reveal delay-3 mt-14 flex flex-wrap items-center gap-5">
            <Link
              href="#features"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#c66e5f] to-[#BA6054] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(186,96,84,0.3)] transition hover:scale-[1.04] hover:shadow-[0_16px_36px_rgba(186,96,84,0.42)]"
            >
              Mulai Sekarang
              <ArrowRight size={16} />
            </Link>
            <Link
              href="#features"
              className="glass-card inline-flex items-center gap-2 rounded-full border border-[#EAD1C7] bg-white/70 px-7 py-3.5 text-sm font-semibold text-[#BA6054] transition hover:scale-[1.04] hover:border-[#BA6054] dark:border-slate-700 dark:bg-slate-800/70 dark:text-[#e07b6d] dark:hover:border-[#e07b6d]"
            >
              Pelajari Lebih Lanjut
            </Link>
          </div>
        </div>

        {/* ── Right: room collage ── */}
        <div className="reveal delay-2 relative mx-auto h-[600px] w-full max-w-[600px] sm:h-[660px] sm:max-w-[680px] lg:h-[720px] lg:max-w-[700px]">
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

