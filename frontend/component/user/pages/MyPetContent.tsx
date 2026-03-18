'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { MoonStar, UtensilsCrossed, Pencil, Coins, Sparkles } from 'lucide-react';
import UserSectionTitle from '../UserSectionTitle';

const rewards = [
	{ title: 'Diskon Sewa 50rb', description: 'Berlaku semua kos EasyKos', coins: '500 Coins' },
	{ title: 'Diskon Sewa 50rb', description: 'Berlaku semua kos EasyKos', coins: '500 Coins' },
	{ title: 'Diskon Sewa 50rb', description: 'Berlaku semua kos EasyKos', coins: '500 Coins' },
	{ title: 'Diskon Sewa 50rb', description: 'Berlaku semua kos EasyKos', coins: '500 Coins' },
	{ title: 'Diskon Sewa 10rb', description: 'Berlaku semua kos EasyKos', coins: '40 coins' },
];

export default function MyPetContent() {
	const [state, setState] = useState<'happy' | 'sleepy'>('happy');

	const petMetrics = useMemo(
		() =>
			state === 'happy'
				? {
					segar: 100,
					kenyang: 30,
					caption: 'Pet sedang ceria dan siap main.',
					image: '/Asset/squirrel/squirrel-happy.svg',
				}
				: {
					segar: 30,
					kenyang: 100,
					caption: 'Pet sedang lelah, waktunya tidur.',
					image: '/Asset/squirrel/squirrel-exhausted.svg',
				},
			[ state ],
		);

	return (
		<div className="mx-auto flex max-w-[1180px] flex-col gap-5">
			<div className="flex items-center justify-between gap-4">
				<div>
					<p className="text-[14px] text-slate-500 dark:text-slate-400">Good Morning,</p>
					<h1 className="text-[26px] font-bold leading-none text-slate-900 dark:text-slate-100">Budi T.</h1>
				</div>

				<div className="flex items-center gap-3">
					<div className="inline-flex items-center gap-2 rounded-full border border-[#edc29b] bg-[#fff1e2] px-5 py-2.5 text-[14px] font-semibold text-[#e26d3e] shadow-sm dark:border-[#7f4b3d] dark:bg-[#2f1b17] dark:text-[#f0b2a7]">
						<Sparkles size={16} className="text-[#e26d3e]" />
						<span>12 Days</span>
					</div>
					<div className="inline-flex items-center gap-2 rounded-full border border-[#e1a392] bg-white px-5 py-2.5 text-[14px] font-semibold text-[#cf5b49] shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-[#f0b2a7]">
						<Coins size={16} className="text-[#e1a392]" />
						<span>10 Coins</span>
					</div>
				</div>
			</div>

			<div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_26px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900 sm:p-6">
			<div className="grid gap-6 lg:grid-cols-[280px_1fr_auto] lg:items-center">
				<div className="relative mx-auto h-[190px] w-[190px] rounded-[28px] border-[8px] border-[#52c2ac] bg-[#f6fffb] p-3 dark:bg-slate-800">
					<div className="absolute left-[-10px] top-[-8px] rounded-full bg-[#efe8e3] p-2 text-[#b76556] shadow-sm dark:bg-slate-700 dark:text-[#f0b2a7]">
						<Pencil size={18} />
					</div>
					<Image src={petMetrics.image} alt="Pet" fill className="object-contain p-8" />
				</div>

				<div className="space-y-3">
					<div className="flex items-center gap-3">
						<h2 className="text-[26px] font-semibold text-slate-900 dark:text-slate-100">Your Pet</h2>
						<span className="text-slate-500 dark:text-slate-400">↗</span>
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
					<button
						onClick={() => setState('happy')}
						className="inline-flex min-w-[168px] items-center justify-center gap-3 rounded-[24px] bg-[#f5ece8] px-8 py-4 text-[18px] font-semibold text-[#c2705f] shadow-[0_8px_18px_rgba(15,23,42,0.04)] transition hover:bg-[#f1e2dc] dark:bg-[#2b211f] dark:text-[#f0b2a7] dark:hover:bg-[#342826]"
					>
						<UtensilsCrossed size={24} />
						Feed
					</button>
					<button
						onClick={() => setState('sleepy')}
						className="inline-flex min-w-[168px] items-center justify-center gap-3 rounded-[24px] bg-[#8d9bb9] px-8 py-4 text-[18px] font-semibold text-slate-900 shadow-[0_8px_18px_rgba(15,23,42,0.04)] transition hover:bg-[#7c8cab] dark:bg-[#55627e] dark:text-slate-100 dark:hover:bg-[#49566f]"
					>
						<MoonStar size={24} />
						Sleep
					</button>
				</div>
			</div>
		</div>

		<UserSectionTitle title="Tukar Koin & Dapatkan Reward!" />

		<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
			{rewards.map((reward, index) => (
				<div key={`${reward.title}-${index}`} className="flex items-center justify-between gap-4 rounded-[16px] border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900">
					<div>
						<h3 className="text-[16px] font-semibold text-slate-900 dark:text-slate-100">{reward.title}</h3>
						<p className="mt-2 text-[14px] leading-6 text-slate-600 dark:text-slate-400">{reward.description}</p>
					</div>
					<div className="rounded-full bg-[#fff3ef] px-4 py-2 text-[14px] font-semibold text-[#d36b57] dark:bg-[#2f1b17] dark:text-[#f0b2a7]">{reward.coins}</div>
				</div>
			))}
		</div>
	</div>
	);
}
