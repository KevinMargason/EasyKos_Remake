'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Bagaimana cara memesan kamar melalui EasyKos?',
    answer:
      'Pilih daftar kamar yang Anda inginkan, tinjau detail kamar, lalu lanjutkan melalui alur pemesanan terpandu dengan konfirmasi pembayaran yang jelas.',
  },
  {
    question: 'Apakah pembayaran di EasyKos aman?',
    answer:
      'Ya. EasyKos menggunakan kanal pembayaran terverifikasi dengan penanganan transaksi yang aman dan catatan pemesanan yang transparan.',
  },
  {
    question: 'Apakah saya bisa menghubungi pemilik properti terlebih dahulu?',
    answer:
      'Anda dapat mengirim pesan langsung di aplikasi untuk menanyakan ketersediaan, fasilitas, dan peraturan kos sebelum memutuskan untuk memesan.',
  },
  {
    question: 'Untuk apa fitur tupai virtual?',
    answer:
      'Fitur ini mengubah aktivitas harian menjadi progres dan hadiah, sehingga membantu pengguna tetap konsisten menggunakan aplikasi dan menyelesaikan aktivitas terkait sewa.',
  },
];

export default function FAQSection() {
  const [opened, setOpened] = useState<number | null>(null);
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
      id="faq"
      ref={sectionRef}
      className="bg-[#fff7f1] py-24 dark:bg-slate-900 sm:py-28 lg:py-[126px]"
    >
      <div className="mx-auto w-full max-w-[1358px] px-5 sm:px-8 lg:px-[72px]">
        <div className="mx-auto max-w-[900px] text-center">
          <h2 className="reveal text-[34px] font-extrabold leading-tight text-slate-900 dark:text-slate-50 sm:text-[40px] md:text-[50px] lg:text-[56px]">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="reveal delay-1 mt-5 text-[15px] leading-8 text-slate-500 dark:text-slate-400 sm:text-base lg:text-[16px]">
            Semua hal yang perlu Anda ketahui sebelum memesan dan mengelola masa tinggal Anda.
          </p>
        </div>

        <div className="mx-auto mt-14 flex w-full max-w-[1000px] flex-col gap-6 lg:mt-16">
          {faqs.map((faq, index) => {
            const isOpen = opened === index;
            return (
              <article
                key={faq.question}
                className={`reveal delay-${index + 1} glass-card rounded-[20px] transition`}
              >
                <button
                  type="button"
                  onClick={() => setOpened(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-6 py-6 text-left sm:px-8 sm:py-7 lg:px-9 lg:py-8"
                >
                  <span className="pr-6 text-sm font-semibold text-slate-900 dark:text-slate-100 sm:text-base lg:text-[17px]">
                    {faq.question}
                  </span>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${isOpen ? 'bg-[#BA6054] text-white dark:bg-[#e07b6d]' : 'bg-[#fff1e7] text-[#BA6054] dark:bg-slate-700 dark:text-[#e07b6d]'}`}>
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </span>
                </button>

                {/* Smooth accordion — inline styles guarantee grid-row animation works */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transition: 'grid-template-rows 0.35s ease',
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <p className="px-5 pb-5 text-sm leading-7 text-slate-500 dark:text-slate-400 sm:px-8 sm:pb-7">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
