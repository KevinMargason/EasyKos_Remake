"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const features = [
  {
    icon: "/Asset/icon/icon-house-search.svg",
    title: "Pemesanan dan Sewa Kamar",
    description:
      "Telusuri, pilih, dan pesan kamar impian Anda dengan beberapa ketukan saja.",
  },
  {
    icon: "/Asset/icon/icon-chart.svg",
    title: "Dasbor Pemilik",
    description: "Perangkat pengelolaan lengkap untuk pemilik kos.",
  },
  {
    icon: "/Asset/icon/icon-shield.svg",
    title: "Pembayaran Aman",
    description:
      "Transaksi 100% aman yang terintegrasi dengan gerbang pembayaran terkemuka.",
  },
  {
    icon: "/Asset/icon/icon-chat.svg",
    title: "Obrolan Langsung di Aplikasi",
    description:
      "Berkomunikasi langsung dengan pemilik properti secara aman di dalam aplikasi.",
  },
  {
    icon: "/Asset/icon/icon-play.svg",
    title: "Umpan Konten Video",
    description:
      "Tonton tur properti dan tips dalam format umpan video yang dapat digulir.",
  },
  {
    icon: "/Asset/icon/icon-squirrel.svg",
    title: "Game Peliharaan Virtual",
    description:
      "Rawat tupai digital Anda dengan menyelesaikan target aplikasi!",
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reveals = section.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
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
      className="relative overflow-hidden bg-[#fffaf6] py-24 dark:bg-slate-900 sm:py-28 lg:py-[130px]"
    >
      <div className="absolute left-1/2 top-0 h-[480px] w-[760px] -translate-x-1/2 rounded-full bg-[#ffbe8f26] blur-3xl dark:bg-[#ba60541a]" />
      <div className="relative mx-auto w-full max-w-[1358px] px-5 sm:px-8 lg:px-[72px]">
        <div className="mx-auto max-w-[800px] text-center">
          <h2 className="reveal text-[34px] font-extrabold leading-tight text-slate-900 dark:text-slate-50 sm:text-[40px] md:text-[50px] lg:text-[56px]">
            Fitur Utama untuk Pengalaman Kos yang Lebih Baik
          </h2>
          <p className="reveal delay-1 mt-5 text-[15px] leading-8 text-slate-500 dark:text-slate-400 sm:text-base lg:text-[16px]">
            Dari pencarian hingga pengelolaan harian, semua yang Anda butuhkan
            tersedia dalam satu platform yang mulus.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:mt-16 sm:grid-cols-2 lg:gap-9 lg:grid-cols-3 lg:mt-18">
          {features.map(({ icon, title, description }, i) => (
            <article
              key={title}
              className={`reveal delay-${i + 1} glass-card group relative mt-6 rounded-[24px] p-7 lg:p-8 transition hover:-translate-y-1.5 hover:shadow-[0_20px_44px_rgba(186,96,84,0.22)] dark:hover:shadow-[0_20px_44px_rgba(2,6,23,0.65)] lg:min-h-[280px]`}
            >
              <span className="glass-chip absolute left-4 -top-6 inline-flex h-16 w-16 items-center justify-center rounded-full p-0 shadow-[0_12px_28px_rgba(15,23,42,0.2)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.28)] sm:-left-7 sm:-top-7 sm:h-[72px] sm:w-[72px]">
                <Image
                  src={icon}
                  alt={`${title} icon`}
                  fill
                  className="object-contain"
                />
              </span>
              <h3 className="mt-10 text-lg font-extrabold text-slate-900 dark:text-slate-100 sm:text-xl">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
