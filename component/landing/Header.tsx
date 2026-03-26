'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from '@/component/ThemeProvider';
import { AUTH_ROUTES } from '@/lib/routes';

const navItems = [
  { label: 'Beranda', href: '#home' },
  { label: 'Fitur', href: '#features' },
  { label: 'Ulasan', href: '#reviews' },
  { label: 'Tanya Jawab', href: '#faq' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy: watch each section and mark it active when it occupies the top area
  useEffect(() => {
    const sectionIds = navItems.map((item) => item.href.replace('#', ''));
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      // Fire when the top ~20% of the viewport is occupied by a section
      { rootMargin: '-10% 0px -80% 0px', threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur transition-shadow duration-300 dark:border-slate-800 dark:bg-slate-900/95 ${
        scrolled ? 'shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]' : ''
      }`}
    >
      <div className="mx-auto flex h-[72px] w-full max-w-[1358px] items-center justify-between px-5 sm:px-8 lg:h-[78px] lg:px-[72px]">
        <Link href="#home" className="flex items-center gap-2.5">
          <Image src="/Asset/easykos-logo.svg" alt="EasyKos" width={150} height={44} priority />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.replace('#', '');
            return (
              <a
                key={item.label}
                href={item.href}
                className={`group relative text-[15px] font-semibold transition-colors hover:text-[#BA6054] dark:hover:text-[#e07b6d] ${
                  isActive ? 'text-[#BA6054] dark:text-[#e07b6d]' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-[2px] rounded-full bg-[#BA6054] transition-all duration-300 dark:bg-[#e07b6d] ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {/* Dark mode toggle */}
          <button
            type="button"
            aria-label="Toggle dark mode"
            onClick={toggle}
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-[#BA6054] hover:text-[#BA6054] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-[#e07b6d] dark:hover:text-[#e07b6d] md:flex"
          >
            <Sun size={17} className="hidden dark:block" />
            <Moon size={17} className="block dark:hidden" />
          </button>

          <Link
            href={AUTH_ROUTES.REGISTER}
            className="hidden rounded-full bg-[#BA6054] px-7 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(186,96,84,0.25)] transition hover:scale-[1.03] hover:bg-[#9f4f45] hover:shadow-[0_12px_28px_rgba(186,96,84,0.35)] md:inline-flex"
          >
            Daftar
          </Link>

          {/* Mobile: dark toggle + hamburger */}
          <button
            type="button"
            aria-label="Toggle dark mode"
            onClick={toggle}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400 md:hidden"
          >
            <Sun size={15} className="hidden dark:block" />
            <Moon size={15} className="block dark:hidden" />
          </button>

          <button
            type="button"
            aria-label="Toggle menu"
            className="inline-flex text-slate-700 dark:text-slate-300 md:hidden"
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="animate-slide-down border-t border-slate-100 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900 md:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`text-sm font-semibold transition hover:text-[#BA6054] dark:hover:text-[#e07b6d] ${
                    isActive ? 'text-[#BA6054] dark:text-[#e07b6d]' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <Link
              href={AUTH_ROUTES.REGISTER}
              onClick={() => setOpen(false)}
              className="mt-1 inline-flex w-fit rounded-full bg-[#BA6054] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9f4f45]"
            >
              Daftar
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
