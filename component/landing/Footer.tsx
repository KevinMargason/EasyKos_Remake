'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in-view');
          observer.disconnect();
        }
      },
      { threshold: 0.05 },
    );
    el.classList.add('reveal');
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const socialLinks = [
    { icon: 'icon-tiktok.svg', href: 'https://www.tiktok.com', label: 'TikTok', ariaLabel: 'Ikuti kami di TikTok' },
    { icon: 'icon-instagram.svg', href: 'https://www.instagram.com', label: 'Instagram', ariaLabel: 'Ikuti kami di Instagram' },
    { icon: 'icon-facebook.svg', href: 'https://www.facebook.com', label: 'Facebook', ariaLabel: 'Ikuti kami di Facebook' },
    { icon: 'icon-youtube.svg', href: 'https://www.youtube.com', label: 'YouTube', ariaLabel: 'Langganan di YouTube' },
  ];

  return (
    <footer ref={footerRef} className="bg-[#0d1422] text-slate-400">
      <div className="mx-auto grid w-full max-w-[1358px] grid-cols-1 gap-10 px-5 py-14 sm:px-8 sm:py-16 md:grid-cols-3 lg:grid-cols-[1.2fr_0.9fr_1fr] lg:gap-16 lg:px-[72px] lg:py-[74px]">
        <div>
          <div className="mb-5 flex items-center gap-2.5">
            <Image src="/Asset/easykos-logo.svg" alt="EasyKos" width={150} height={44} />
          </div>
          <p className="max-w-[380px] text-sm leading-7 mb-6">
            Mengubah cara Anda mencari, memesan, dan mengelola kos. Nikmati pengalaman tinggal yang mulus dengan pembayaran aman, gamifikasi yang menarik, dan fitur komunitas yang kuat.
          </p>
          <div className="flex gap-4">
            {socialLinks.map(({ icon, href, label, ariaLabel }) => (
              <a
                key={label}
                href={href}
                aria-label={ariaLabel}
                className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-slate-700 hover:bg-[#e07b6d] transition-colors"
              >
                <Image
                  src={`/Asset/icon/${icon}`}
                  alt={label}
                  width={22}
                  height={22}
                  style={{ width: 'auto', height: 'auto' }}
                />
              </a>
            ))}
          </div>
        </div>

        <div className="lg:justify-self-center lg:pl-10 xl:pl-16">
          <h3 className="mb-5 text-base font-bold text-white">Tautan Cepat</h3>
          <ul className="space-y-3 text-sm">
            {[
              { label: 'Beranda', href: '#home' },
              { label: 'Fitur', href: '#features' },
              { label: 'Ulasan', href: '#reviews' },
              { label: 'Tanya Jawab', href: '#faq' },
            ].map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="transition-colors hover:text-[#e07b6d]"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:pl-6 xl:pl-10">
          <h3 className="mb-5 text-base font-bold text-white">Hubungi Kami</h3>
          <ul className="space-y-3 text-sm leading-7">
            <li className="flex items-center gap-3">
              <Image
                src="/Asset/icon/icon-mail.svg"
                alt="Email"
                width={20}
                height={20}
                style={{ width: 'auto', height: 'auto' }}
                className="flex-shrink-0"
              />
              <span>abc@easykos.com</span>
            </li>
            <li className="flex items-center gap-3">
              <Image
                src="/Asset/icon/icon-phone.svg"
                alt="Phone"
                width={20}
                height={20}
                style={{ width: 'auto', height: 'auto' }}
                className="flex-shrink-0"
              />
              <span>+62 812 3456 7890</span>
            </li>
            <li className="flex items-center gap-3">
              <Image
                src="/Asset/icon/icon-navigation.svg"
                alt="Location"
                width={20}
                style={{ width: 'auto', height: 'auto' }}
                height={20}
                className="flex-shrink-0"
              />
              <span>Surabaya, Indonesia</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex w-full max-w-[1358px] flex-col items-center justify-between gap-3 px-5 py-5 text-xs sm:px-8 md:flex-row lg:px-[72px] lg:py-6">
          <p>© 2026 EasyKos. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="transition-colors hover:text-[#e07b6d]">Kebijakan Privasi</Link>
            <span>|</span>
            <Link href="#" className="transition-colors hover:text-[#e07b6d]">Ketentuan Layanan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
