'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useTheme } from '@/component/ThemeProvider';
import UserSectionTitle from '@/component/shared/UserSectionTitle';
import { BanknoteArrowUp, Coins } from 'lucide-react';

const userRewards = [
	{ title: 'Diskon Sewa 50rb', description: 'Berlaku di semua kos EasyKos', coins: '500 Koin' },
	{ title: 'Diskon Sewa 50rb', description: 'Berlaku di semua kos EasyKos', coins: '500 Koin' },
	{ title: 'Diskon Sewa 50rb', description: 'Berlaku di semua kos EasyKos', coins: '500 Koin' },
	{ title: 'Diskon Sewa 50rb', description: 'Berlaku di semua kos EasyKos', coins: '500 Koin' },
	{ title: 'Diskon Sewa 10rb', description: 'Berlaku di semua kos EasyKos', coins: '40 Koin' },
];

const ownerRewards = [
	{ title: 'Tukar Rp 50rb', description: 'Cairkan saldo koin untuk kebutuhan operasional', coins: '500 Koin' },
	{ title: 'Tukar Rp 100rb', description: 'Penukaran cepat untuk saldo kecil', coins: '900 Koin' },
	{ title: 'Tukar Rp 250rb', description: 'Cocok untuk top up pengeluaran kos', coins: '2.100 Koin' },
	{ title: 'Tukar Rp 500rb', description: 'Pilihan hemat untuk penukaran besar', coins: '4.000 Koin' },
];

type MyPetContentProps = {
	mode?: 'user' | 'owner';
};

export default function MyPetContent({ mode = 'user' }: MyPetContentProps) {
	const [state, setState] = useState<'hungry' | 'sleepy'>('hungry');
	const { theme } = useTheme();
	const isOwnerMode = mode === 'owner';
	const rewards = isOwnerMode ? ownerRewards : userRewards;

	const petMetrics = useMemo(
		() =>
			state === 'hungry'
				? {
					segar: 100,
					kenyang: 30,
					caption: 'Peliharaan sedang lapar dan butuh makan.',
					image: '/Asset/squirrel/squirrel-hungry.svg',
				}
				: {
					segar: 30,
					kenyang: 100,
					caption: 'Peliharaan sedang lelah, saatnya tidur.',
					image: theme === 'light' ? '/Asset/squirrel/squirrel-exhausted-light.svg' : '/Asset/squirrel/squirrel-exhausted-dark.svg',
				},
		[ state, theme ],
	);

	return (
		<div className="mx-auto flex max-w-[1180px] flex-col gap-5">
			<div className="flex items-center justify-between gap-4">
				<div>
					<p className="text-[14px] text-slate-500 dark:text-slate-400">Selamat pagi,</p>
					<h1 className="text-[26px] font-bold leading-none text-slate-900 dark:text-slate-100">Budi T.</h1>
				</div>

				<div className="flex items-center gap-3">
					<div className="glass-chip inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-[15px] font-semibold transition">
						<Image src="/Asset/icon/icon-fire.svg" alt="Streak" width={18} height={18} />
						<span>12 Hari</span>
					</div>
					<div className="glass-chip inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-[15px] font-semibold transition">
						<Image src="/Asset/icon/icon-coin.svg" alt="Koin" width={18} height={18} />
						<span>10 Koin</span>
					</div>
				</div>
			</div>

			<div className="rounded-[24px] border border-[#e3d0c9] bg-white p-5 shadow-[0_12px_26px_rgba(15,23,42,0.05)] dark:border-slate-700/80 dark:bg-slate-900 sm:p-6">
				<div className="grid gap-6 lg:grid-cols-[280px_1fr_auto] lg:items-center">
					<div className="relative mx-auto h-[200px] w-[290px]">
						<Image src={petMetrics.image} alt="Pet" fill className="object-contain" />
					</div>

					<div className="space-y-3">
						<div className="flex items-center gap-3">
							<h2 className="text-[26px] font-semibold text-slate-900 dark:text-slate-100">Peliharaan Anda</h2>
							<button type="button" aria-label="Edit peliharaan" title="Edit peliharaan" className="inline-flex h-8 w-8 items-center justify-center rounded-full transition duration-200 hover:bg-[#f4e0dd] dark:hover:bg-slate-800">
								<Image src="/Asset/icon/icon-edit.svg" alt="Edit peliharaan" width={16} height={16} className="h-4 w-4 transition duration-200 dark:brightness-0 dark:invert hover:brightness-0 hover:sepia hover:saturate-[5500%] hover:hue-rotate-[-10deg] hover:brightness-95" />
							</button>
						</div>
						<p className="text-sm text-slate-500 dark:text-slate-400">{petMetrics.caption}</p>

						<div className="space-y-4 pt-2">
							<div>
								<div className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
									<span>{petMetrics.segar}%</span>
									<span className="text-slate-500 dark:text-slate-400">Segar</span>
								</div>
								<div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
									<div className="h-2 rounded-full bg-[#24864d]" style={{ width: `${petMetrics.segar}%` }} />
								</div>
							</div>

							<div>
								<div className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
									<span>{petMetrics.kenyang}%</span>
									<span className="text-slate-500 dark:text-slate-400">Kenyang</span>
								</div>
								<div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
									<div className="h-2 rounded-full bg-[#d72532]" style={{ width: `${petMetrics.kenyang}%` }} />
								</div>
							</div>
						</div>
					</div>

					<div className="flex flex-col gap-4 lg:items-end">
						<button onClick={() => setState('sleepy')} className="inline-flex min-w-[168px] items-center justify-center gap-3 rounded-[24px] bg-[#f5ece8] px-8 py-4 text-[18px] font-semibold text-[#c2705f] shadow-[0_8px_18px_rgba(15,23,42,0.04)] transition hover:bg-[#f1e2dc] dark:bg-[#2b211f] dark:text-[#f0b2a7] dark:hover:bg-[#342826]">
							<Image src="/Asset/icon/icon-bowl.svg" alt="Makan" width={24} height={24} className="mt-1" />
							Makan
						</button>
						<button onClick={() => setState('hungry')} className="inline-flex min-w-[168px] items-center justify-center gap-3 rounded-[24px] bg-[#8d9bb9] px-8 py-4 text-[18px] font-semibold text-slate-900 shadow-[0_8px_18px_rgba(15,23,42,0.04)] transition hover:bg-[#7c8cab] dark:bg-[#55627e] dark:text-slate-100 dark:hover:bg-[#49566f]">
							<Image src="/Asset/icon/icon-moon.svg" alt="Tidur" width={24} height={24} />
							Tidur
						</button>
					</div>
				</div>
			</div>

			<UserSectionTitle title={isOwnerMode ? 'Tukar koin menjadi uang tunai' : 'Tukar koin dan dapatkan hadiah'} />

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
				{rewards.map((reward, index) => (
					<div key={`${reward.title}-${index}`} className="flex items-center justify-between gap-4 rounded-[16px] border border-[#e3d0c9] bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.04)] dark:border-slate-700/80 dark:bg-slate-900">
						<div>
							<h3 className="text-[16px] font-semibold text-slate-900 dark:text-slate-100">{reward.title}</h3>
							<p className="mt-2 text-[14px] leading-6 text-slate-600 dark:text-slate-400">{reward.description}</p>
						</div>
						<div className="inline-flex items-center gap-2 rounded-full bg-[#fff3ef] px-4 py-2 text-[14px] font-semibold text-[#d36b57] dark:bg-[#2f1b17] dark:text-[#f0b2a7]">
							{isOwnerMode ? <Coins size={16} /> : null}
							{reward.coins}
						</div>
					</div>
				))}
			</div>

			{isOwnerMode ? (
				<section className="rounded-[20px] border border-dashed border-[#e3d0c9] bg-[#fff9f7] p-5 shadow-[0_8px_20px_rgba(15,23,42,0.04)] dark:border-slate-700/80 dark:bg-slate-900/60">
					<div className="flex items-start gap-3">
						<BanknoteArrowUp className="mt-0.5 text-[#c86654]" size={20} />
						<div>
							<h3 className="text-[16px] font-semibold text-slate-900 dark:text-slate-100">Proses penukaran uang</h3>
							<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Pilih nominal yang sesuai, lalu lanjutkan ke proses pencairan saat saldo koin mencukupi.</p>
						</div>
					</div>
				</section>
			) : null}
		</div>
	);
}