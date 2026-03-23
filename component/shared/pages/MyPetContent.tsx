'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { BanknoteArrowUp, Coins } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/component/ThemeProvider';
import UserSectionTitle from '@/component/shared/UserSectionTitle';
import { useAppSelector } from '@/core/store/hooks';
import { useTupai } from '@/core/hooks/useTupai';
import { useWallet } from '@/core/hooks/useWallet';
import { usePayments } from '@/core/hooks/usePayments';
import { useMissions } from '@/core/hooks/useMissions';
import { getFullGreeting } from '@/lib/greetings';

const userRewards = [
	{ title: 'Diskon Sewa 10rb', value: 10000, coins: 250 },
	{ title: 'Diskon Sewa 25rb', value: 25000, coins: 500 },
	{ title: 'Diskon Sewa 50rb', value: 50000, coins: 900 },
	{ title: 'Diskon Sewa 100rb', value: 100000, coins: 1800 },
];

const ownerRewards = [
	{ title: 'Tukar Rp 50rb', value: 50000, coins: 250 },
	{ title: 'Tukar Rp 100rb', value: 100000, coins: 500 },
	{ title: 'Tukar Rp 250rb', value: 250000, coins: 1200 },
	{ title: 'Tukar Rp 500rb', value: 500000, coins: 2400 },
];

type MyPetContentProps = {
	mode?: 'user' | 'owner';
};

export default function MyPetContent({ mode = 'user' }: MyPetContentProps) {
	const { theme } = useTheme();
	const isOwnerMode = mode === 'owner';
	const rewards = isOwnerMode ? ownerRewards : userRewards;

	const [mounted, setMounted] = useState(false);
	const [isFeeding, setIsFeeding] = useState(false);
	const [isSleeping, setIsSleeping] = useState(false);
	const [displayMetrics, setDisplayMetrics] = useState<any>(null);
	const pollingRef = useRef<NodeJS.Timeout | null>(null);

	const user = useAppSelector((state: any) => state.user.user);
	const { totalKoin, redeemVoucher, redemptionLoading } = useWallet();
	const { vouchers, fetchVouchers } = usePayments();
	const { missions } = useMissions();
	const { tupai, loading, adoptNewTupai, feedTupai, sleepTupai } = useTupai();

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;
		fetchVouchers().catch(() => {
			// Optional data only.
		});
	}, [fetchVouchers, mounted]);

	useEffect(() => {
		if (!mounted) return;
		if (!tupai && !loading) {
			adoptNewTupai().catch(() => null);
		}
	}, [mounted, tupai, loading, adoptNewTupai]);

	const calculateMetricsFromTimestamps = (pet: any) => {
		if (!pet) return null;

		const now = new Date().getTime();
		const decayRate = 1;

		let kenyangValue = 100;
		if (pet.last_fed_at) {
			const timeSinceFed = (now - new Date(pet.last_fed_at).getTime()) / 60000;
			kenyangValue = Math.max(0, 100 - (timeSinceFed * decayRate));
		}

		let segarValue = 100;
		if (pet.last_slept_at) {
			const timeSinceSlept = (now - new Date(pet.last_slept_at).getTime()) / 60000;
			segarValue = Math.max(0, 100 - (timeSinceSlept * decayRate));
		}

		return { kenyang: kenyangValue, segar: segarValue };
	};

	const getPetExpression = (metrics: any) => {
		if (!metrics) return null;

		const { segar, kenyang } = metrics;

		if (segar < 40) {
			return {
				expression: 'exhausted',
				segar: Math.round(segar),
				kenyang: Math.round(kenyang),
				caption: 'Peliharaan Anda kelelahan, butuh istirahat sekarang.',
				image: theme === 'light' ? '/Asset/squirrel/squirrel-exhausted-light.svg' : '/Asset/squirrel/squirrel-exhausted-dark.svg',
			};
		}

		if (kenyang < 40) {
			return {
				expression: 'hungry',
				segar: Math.round(segar),
				kenyang: Math.round(kenyang),
				caption: 'Peliharaan sedang lapar dan butuh makan.',
				image: '/Asset/squirrel/squirrel-hungry.svg',
			};
		}

		if (segar >= 70 && kenyang >= 70) {
			return {
				expression: 'happy',
				segar: Math.round(segar),
				kenyang: Math.round(kenyang),
				caption: 'Peliharaan Anda sangat bahagia dan sehat!',
				image: '/Asset/squirrel/squirrel-happy.svg',
			};
		}

		return {
			expression: 'normal',
			segar: Math.round(segar),
			kenyang: Math.round(kenyang),
			caption: 'Peliharaan Anda dalam kondisi normal.',
			image: '/Asset/squirrel/squirrel-normal.svg',
		};
	};

	useEffect(() => {
		if (!mounted || !tupai) return;

		const updateMetrics = () => {
			const metrics = calculateMetricsFromTimestamps(tupai);
			setDisplayMetrics(getPetExpression(metrics));
		};

		updateMetrics();
		pollingRef.current = setInterval(updateMetrics, 60000);

		return () => {
			if (pollingRef.current) clearInterval(pollingRef.current);
		};
	}, [mounted, tupai, theme]);

	const handleFeed = async () => {
		if (!tupai) return;
		setIsFeeding(true);
		try {
			await feedTupai(tupai.id);
			toast.success('Peliharaan Anda sekarang sedang makan!');
		} catch {
			toast.error('Gagal memberi makan peliharaan');
		} finally {
			setIsFeeding(false);
		}
	};

	const handleSleep = async () => {
		if (!tupai) return;
		setIsSleeping(true);
		try {
			await sleepTupai(tupai.id);
			toast.success('Peliharaan Anda sekarang sedang tidur!');
		} catch {
			toast.error('Gagal membuat peliharaan tidur');
		} finally {
			setIsSleeping(false);
		}
	};

	const handleRedeem = async (reward: typeof userRewards[0]) => {
		try {
			if (totalKoin < reward.coins) {
				toast.error('Koin Anda tidak cukup');
				return;
			}
			const matchedVoucher = vouchers?.find((voucher: any) => Number(voucher.nominal_diskon) === reward.value);
			if (!matchedVoucher) {
				toast.error('Voucher backend untuk nominal ini belum tersedia');
				return;
			}
			if (!user?.id) {
				toast.error('Data pengguna belum tersedia');
				return;
			}
			await redeemVoucher({
				users_id: user.id,
				voucher_id: matchedVoucher.id,
				harga_koin: reward.coins,
			});
			toast.success(`Berhasil menukar ${reward.title}!`);
		} catch {
			toast.error('Gagal menukar voucher');
		}
	};

	if (!mounted) {
		return (
			<div className="mx-auto flex max-w-[1180px] flex-col gap-5">
				<div className="flex items-center justify-between gap-4">
					<div>
						<p className="text-[14px] text-slate-500 dark:text-slate-400">Memuat...</p>
						<h1 className="text-[26px] font-bold leading-none text-slate-900 dark:text-slate-100">Memuat data...</h1>
					</div>
				</div>
			</div>
		);
	}

	const { greeting, userName } = getFullGreeting(user?.name);

	return (
		<div className="mx-auto flex max-w-[1180px] flex-col gap-5">
			<div className="flex items-center justify-between gap-4">
				<div>
					<p className="text-[14px] text-slate-500 dark:text-slate-400">{greeting}</p>
					<h1 className="text-[26px] font-bold leading-none text-slate-900 dark:text-slate-100">{userName}</h1>
				</div>

				<div className="flex items-center gap-3">
					<div className="glass-chip inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-[15px] font-semibold transition">
						<Image src="/Asset/icon/icon-fire.svg" alt="Streak" width={18} height={18} />
						<span>--</span>
					</div>
					<div className="glass-chip inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-[15px] font-semibold transition">
						<Image src="/Asset/icon/icon-coin.svg" alt="Koin" width={18} height={18} />
						<span>{totalKoin || 0} Koin</span>
					</div>
				</div>
			</div>

			<div className="rounded-[24px] border border-[#e3d0c9] bg-white p-5 shadow-[0_12px_26px_rgba(15,23,42,0.05)] dark:border-slate-700/80 dark:bg-slate-900 sm:p-6">
				<div className="grid gap-6 lg:grid-cols-[280px_1fr_auto] lg:items-center">
					<div className="relative mx-auto h-[200px] w-[290px]">
						<Image src={displayMetrics?.image || '/Asset/squirrel/squirrel-normal.svg'} alt="Pet" fill className="object-contain" />
					</div>

					<div className="space-y-3">
						<div className="flex items-center gap-3">
							<h2 className="text-[26px] font-semibold text-slate-900 dark:text-slate-100">
								{tupai?.nama || 'Peliharaan Anda'}
							</h2>
							<button type="button" aria-label="Edit peliharaan" title="Edit peliharaan" className="inline-flex h-8 w-8 items-center justify-center rounded-full transition duration-200 hover:bg-[#f4e0dd] dark:hover:bg-slate-800">
								<Image src="/Asset/icon/icon-edit.svg" alt="Edit peliharaan" width={16} height={16} className="h-4 w-4 transition duration-200 dark:brightness-0 dark:invert hover:brightness-0 hover:sepia hover:saturate-[5500%] hover:hue-rotate-[-10deg] hover:brightness-95" />
							</button>
						</div>
						<p className="text-sm text-slate-500 dark:text-slate-400">{displayMetrics?.caption || 'Memuat...'}</p>

						<div className="space-y-4 pt-2">
							<div>
								<div className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
									<span>{displayMetrics?.segar || 0}%</span>
									<span className="text-slate-500 dark:text-slate-400">Segar</span>
								</div>
								<div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
									<div className="h-2 rounded-full bg-[#24864d] transition-all duration-500" style={{ width: `${displayMetrics?.segar || 0}%` }} />
								</div>
							</div>

							<div>
								<div className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
									<span>{displayMetrics?.kenyang || 0}%</span>
									<span className="text-slate-500 dark:text-slate-400">Kenyang</span>
								</div>
								<div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
									<div className="h-2 rounded-full bg-[#d72532] transition-all duration-500" style={{ width: `${displayMetrics?.kenyang || 0}%` }} />
								</div>
							</div>
						</div>
					</div>

					<div className="flex flex-col gap-4 lg:items-end">
						<button
							onClick={handleFeed}
							disabled={isFeeding}
							className="inline-flex min-w-[168px] items-center justify-center gap-3 rounded-[24px] bg-[#f5ece8] px-8 py-4 text-[18px] font-semibold text-[#c2705f] shadow-[0_8px_18px_rgba(15,23,42,0.04)] transition hover:bg-[#f1e2dc] disabled:opacity-50 dark:bg-[#2b211f] dark:text-[#f0b2a7] dark:hover:bg-[#342826]">
							<Image src="/Asset/icon/icon-bowl.svg" alt="Makan" width={24} height={24} className="mt-1" />
							{isFeeding ? 'Sedang makan...' : 'Makan'}
						</button>
						<button
							onClick={handleSleep}
							disabled={isSleeping}
							className="inline-flex min-w-[168px] items-center justify-center gap-3 rounded-[24px] bg-[#8d9bb9] px-8 py-4 text-[18px] font-semibold text-slate-900 shadow-[0_8px_18px_rgba(15,23,42,0.04)] transition hover:bg-[#7c8cab] disabled:opacity-50 dark:bg-[#55627e] dark:text-slate-100 dark:hover:bg-[#49566f]">
							<Image src="/Asset/icon/icon-moon.svg" alt="Tidur" width={24} height={24} />
							{isSleeping ? 'Sedang tidur...' : 'Tidur'}
						</button>
					</div>
				</div>
			</div>

			<UserSectionTitle title={isOwnerMode ? 'Tukar koin menjadi uang tunai' : 'Tukar koin dan dapatkan hadiah'} />

			<div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
				{rewards.map((reward, index) => (
					<div key={`${reward.title}-${index}`} className="flex flex-col justify-between gap-4 rounded-[16px] border border-[#e3d0c9] bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.04)] dark:border-slate-700/80 dark:bg-slate-900">
						<div className="flex items-start justify-between gap-4">
							<div>
								<h3 className="text-[16px] font-semibold text-slate-900 dark:text-slate-100">{reward.title}</h3>
								<p className="mt-2 text-[14px] leading-6 text-slate-600 dark:text-slate-400">
									{isOwnerMode ? `Dapatkan uang tunai Rp ${reward.value.toLocaleString('id-ID')}` : `Dapatkan diskon Rp ${reward.value.toLocaleString('id-ID')}`}
								</p>
							</div>
							<div className="inline-flex items-center gap-2 rounded-full bg-[#fff3ef] px-4 py-2 text-[14px] font-semibold text-[#d36b57] dark:bg-[#2f1b17] dark:text-[#f0b2a7]">
								{isOwnerMode ? <Coins size={16} /> : null}
								{reward.coins} Koin
							</div>
						</div>
						<button
							onClick={() => handleRedeem(reward)}
							disabled={redemptionLoading || totalKoin < reward.coins}
							className="rounded-lg bg-[#c86654] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b85d47] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#d97d6d] dark:hover:bg-[#e89080]">
							{redemptionLoading ? 'Sedang ditukar...' : totalKoin < reward.coins ? 'Koin tidak cukup' : 'Tukar Sekarang'}
						</button>
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
