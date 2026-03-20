'use client';

import Image from 'next/image';
import { Flame, Wallet } from 'lucide-react';

const stats = [
	{ title: 'Total pendapatan bulan ini', value: 'Rp 15M', caption: 'Naik 12% dibandingkan bulan lalu' },
	{ title: 'Penghuni aktif', value: '2 / 3', caption: '1 kamar kosong' },
	{ title: 'Pembayaran tertunda', value: '2', caption: 'Perlu perhatian', danger: true },
];

export default function OwnerHomeContent() {
	return (
		<div className="mx-auto flex max-w-[1180px] flex-col gap-6">
			<header className="flex flex-col gap-4 rounded-[28px] bg-transparent sm:flex-row sm:items-start sm:justify-between">
				<div className="flex items-center gap-4">
						<Image src="/Asset/icon/icon-person.svg" alt="Akun pengguna" width={90} height={90} />
					<div className='mb-5'>
						<p className="text-[14px] text-slate-500 dark:text-slate-400">Selamat pagi,</p>
						<h1 className="text-[26px] font-bold leading-none text-slate-900 dark:text-slate-100">Budi T.</h1>
					</div>
				</div>

				<div className="flex items-center gap-3 self-start">
					<div className="glass-chip inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-[15px] font-semibold transition">
						<Image src="/Asset/icon/icon-fire.svg" alt="Streak" width={18} height={18} />
						<span>12 Hari</span>
					</div>
					<div className="glass-chip inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-[15px] font-semibold transition">
						<Image src="/Asset/icon/icon-coin.svg" alt="Koin" width={18} height={18} />
						<span>10 Koin</span>
					</div>
				</div>
			</header>

			<section className="grid gap-4 md:grid-cols-3">
				{stats.map((stat) => (
					<article key={stat.title} className="rounded-[22px] bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.08)] ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/5">
						<p className="text-[14px] text-slate-500 dark:text-slate-400">{stat.title}</p>
						<div className="mt-2 text-[28px] font-bold leading-none text-slate-900 dark:text-slate-100">{stat.value}</div>
						<p className={`mt-2 text-[14px] font-medium ${stat.danger ? 'text-[#e04e3a]' : 'text-[#2bb55d]'}`}>{stat.caption}</p>
					</article>
				))}
			</section>

			<section className="rounded-[18px] bg-[#c86654] px-6 py-7 text-white shadow-[0_14px_30px_rgba(15,23,42,0.10)] sm:px-7">
				<div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
					<div className="max-w-[640px]">
						<h2 className="text-[30px] font-bold leading-tight">Tingkatkan promosi kos Anda!</h2>
						<p className="mt-2 max-w-[440px] text-[16px] leading-7 text-white/85">Pasang kos Anda di bagian teratas hasil pencarian agar kamar kosong lebih cepat terisi.</p>
					</div>
					<button className="rounded-lg bg-white px-8 py-3 text-[15px] font-semibold text-[#c86654] shadow-[0_6px_14px_rgba(15,23,42,0.08)] transition hover:bg-[#fff7f5]">
						Pasang Iklan
					</button>
				</div>
			</section>
		</div>
	);
}