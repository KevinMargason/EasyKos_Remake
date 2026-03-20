'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Clock3 } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

const paymentWarnings = [
	{ name: 'Putu', detail: 'Lantai 2 unit 1', status: 'Chat' },
	{ name: 'Putri', detail: 'Lantai 2 unit 3', status: 'Chat' },
	{ name: 'Megan', detail: 'Lantai 1 Unit 4', status: 'Chat' },
];

const roomStats = [
	{ label: 'Total Kamar', value: '20' },
	{ label: 'Tersedia', value: '16' },
	{ label: 'Terisi', value: '4' },
];

export default function OwnerManagementContent() {
	return (
		<div className="mx-auto flex max-w-[1180px] flex-col gap-6">
			<h1 className="text-[26px] font-semibold text-slate-900 dark:text-slate-100">Manajemen Properti</h1>

			<div className="grid gap-5 xl:grid-cols-2">
				<article className="relative overflow-hidden rounded-[24px] bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.08)] ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/5">
					<div className="absolute right-4 top-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fef8f6] shadow-[0_10px_20px_rgba(15,23,42,0.08)] ring-1 ring-black/5 dark:bg-slate-800">
						<Image src="/Asset/icon/icon-chart.svg" alt="Ikon grafik" width={34} height={34} />
					</div>
					<div className="max-w-[360px]">
						<h2 className="text-[28px] font-bold leading-tight text-[#c86654]">Peringatan Pembayaran</h2>
						<p className="mt-3 text-[14px] font-medium text-slate-500 dark:text-slate-400">Terdapat 3 kamar yang belum membayar bulan ini</p>
					</div>

					<div className="mt-6 space-y-4">
						{paymentWarnings.map((warning) => (
							<Link
								key={warning.name}
								href={ROUTES.OWNER.CHAT}
								className="flex items-center justify-between gap-4 rounded-[16px] transition hover:bg-[#fff9f7] dark:hover:bg-slate-800/60"
								aria-label={`Buka chat untuk ${warning.name}`}
							>
								<div>
									<div className="text-[18px] font-bold text-slate-900 dark:text-slate-100">{warning.name}</div>
									<div className="text-[14px] text-slate-500 dark:text-slate-400">{warning.detail}</div>
								</div>
								<div className="inline-flex items-center gap-2 rounded-full border border-[#f1ddd8] bg-white px-3 py-2 text-[12px] font-semibold text-[#c86654] shadow-[0_4px_10px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
									<Image src="/Asset/icon/icon-chat3.svg" alt="Ikon chat" width={14} height={14} />
									<span>{warning.status}</span>
								</div>
							</Link>
						))}
					</div>
				</article>

				<article className="relative overflow-hidden rounded-[24px] bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.08)] ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/5">
					<div className="absolute right-4 top-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fef8f6] shadow-[0_10px_20px_rgba(15,23,42,0.08)] ring-1 ring-black/5 dark:bg-slate-800">
						<Image src="/Asset/icon/icon-apartment.svg" alt="Ikon apartemen" width={34} height={34} />
					</div>
					<div className="max-w-[360px]">
						<h2 className="text-[28px] font-bold leading-tight text-[#c86654]">Manajemen Kosan</h2>
						<p className="mt-3 text-[14px] font-medium text-slate-500 dark:text-slate-400">Pantau total kamar yang Anda miliki</p>
					</div>

					<div className="mt-6 space-y-4">
						{roomStats.map((stat) => (
							<div key={stat.label} className="flex items-center justify-between gap-4">
								<div className="text-[18px] font-bold text-slate-900 dark:text-slate-100">{stat.label}</div>
								<div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#f1ddd8] bg-white text-[14px] font-semibold text-[#c86654] shadow-[0_4px_10px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800 dark:text-[#f0b2a7]">
									{stat.value}
								</div>
							</div>
						))}
					</div>
				</article>
			</div>

			<section className="rounded-[24px] bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.08)] ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/5">
				<h2 className="text-[28px] font-bold text-[#c86654]">Update Kosan Kamu</h2>
				<div className="mt-6 grid gap-4 md:grid-cols-3">
					{['Perbarui harga kamar harian dan bulanan.', 'Unggah foto baru agar tampilan properti lebih menarik.', 'Periksa kamar kosong sebelum status dipublikasikan.'].map((item) => (
						<div key={item} className="rounded-[18px] border border-dashed border-[#e6c8bf] bg-[#fff9f7] p-4 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
							<div className="mb-2 inline-flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
								<CheckCircle2 size={16} className="text-[#c86654]" />
								<span>Daftar periksa</span>
							</div>
							{item}
						</div>
					))}
				</div>
			</section>
		</div>
	);
}