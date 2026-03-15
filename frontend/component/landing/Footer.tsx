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

  return (
    <footer ref={footerRef} className="bg-[#0d1422] text-slate-400">
      <div className="mx-auto grid w-full max-w-[1358px] grid-cols-1 gap-10 px-5 py-14 sm:px-8 sm:py-16 md:grid-cols-3 lg:px-[72px] lg:py-[74px]">
        <div>
          <div className="mb-5 flex items-center gap-2.5">
            <Image src="/Asset/easykos-logo.svg" alt="EasyKos" width={150} height={44} />
          </div>
          <p className="max-w-[380px] text-sm leading-7">
            EasyKos simplifies finding, booking, and managing boarding houses with secure digital tools and delightful mascot interactions.
          </p>
        </div>

        <div>
          <h3 className="mb-5 text-base font-bold text-white">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            {[
              { label: 'Home', href: '#home' },
              { label: 'Feature', href: '#features' },
              { label: 'Review', href: '#reviews' },
              { label: 'FAQ', href: '#faq' },
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

        <div>
          <h3 className="mb-5 text-base font-bold text-white">Contact</h3>
          <ul className="space-y-3 text-sm leading-7">
            <li>abc@easykos.com</li>
            <li>+62 812 3456 7890</li>
            <li>Surabaya, Indonesia</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex w-full max-w-[1358px] flex-col items-center justify-between gap-3 px-5 py-5 text-xs sm:px-8 md:flex-row lg:px-[72px] lg:py-6">
          <p>© 2026 EasyKos. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="transition-colors hover:text-[#e07b6d]">Privacy Policy</Link>
            <span>|</span>
            <Link href="#" className="transition-colors hover:text-[#e07b6d]">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
