'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { Coins, Edit3, Flame, MoonStar, Sparkles, Utensils } from 'lucide-react';
import { toast } from 'sonner';
import { useAppSelector } from '@/core/store/hooks';
import { getFullGreeting } from '@/lib/greetings';
import { useWallet } from '@/core/hooks/useWallet';

type MyPetContentProps = {
    mode?: 'user' | 'owner';
};

const rewardCards = [
    { title: 'Diskon Sewa 50rb', description: 'Berlaku semua kos EasyKos', price: '500 Coins' },
    { title: 'Diskon Sewa 50rb', description: 'Berlaku semua kos EasyKos', price: '500 Coins' },
    { title: 'Diskon Sewa 50rb', description: 'Berlaku semua kos EasyKos', price: '500 Coins' },
    { title: 'Diskon Sewa 50rb', description: 'Berlaku semua kos EasyKos', price: '500 Coins' },
    { title: 'Diskon Sewa 10rb', description: 'Berlaku semua kos EasyKos', price: '40 coins' },
];

const clampPercent = (value: unknown) => {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return 0;
    return Math.max(0, Math.min(100, numericValue));
};

function StatProgress({ label, value }: { label: string; value: number }) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>{label}</span>
                <span>{value}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                    className="h-full rounded-full bg-[#dd6f5d] transition-all duration-500 dark:bg-[#f0b2a7]"
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}

function MetricChip({ icon: Icon, label, accentClassName }: { icon: typeof Flame; label: string; accentClassName: string }) {
    return (
        <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold shadow-sm ${accentClassName}`}>
            <Icon size={14} />
            <span>{label}</span>
        </div>
    );
}

function ActionButton({
    label,
    icon: Icon,
    onClick,
    disabled,
    className,
}: {
    label: string;
    icon: typeof Utensils;
    onClick: () => void;
    disabled?: boolean;
    className: string;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex w-full max-w-[280px] items-center justify-center gap-2 rounded-full px-20 py-3 text-sm font-semibold shadow-sm transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        >
            <Icon size={16} />
            <span>{label}</span>
        </button>
    );
}

function RewardCard({ title, description, price }: { title: string; description: string; price: string }) {
    return (
        <div className="flex min-h-[96px] items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900">
            <div className="min-w-0 space-y-1">
                <h4 className="truncate text-[15px] font-bold text-slate-900 dark:text-slate-100">{title}</h4>
                <p className="text-sm leading-snug text-slate-600 dark:text-slate-300">{description}</p>
            </div>
            <div className="shrink-0 rounded-full bg-[#fbf0ed] px-4 py-2 text-sm font-semibold text-[#dd6f5d] dark:bg-[#2f1d18] dark:text-[#f0b2a7]">
                {price}
            </div>
        </div>
    );
}

export default function MyPetContent({ mode = 'user' }: MyPetContentProps) {
    const user = useAppSelector((state: any) => state.user.user);
    const { totalKoin } = useWallet();
    const [tupai, setTupai] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const API_BASE = 'https://easykosbackend-production.up.railway.app/api';

    const fetchTupaiStatus = useCallback(async () => {
        if (!user?.id) {
            setTupai(null);
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/mytupai?users_id=${user.id}`);
            const result = await res.json();

            if (result.success && result.data.length > 0) {
                const myPet = result.data.find((item: any) => item.users_id == user.id);
                setTupai(myPet || null);
            } else {
                setTupai(null);
            }
        } catch (error) {
            console.error('Error fetching pet:', error);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    const handleAdopt = async () => {
        if (!user?.id) {
            toast.error('Silakan login terlebih dahulu.');
            return;
        }

        setIsActionLoading(true);
        try {
            const res = await fetch(`${API_BASE}/mytupai`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    users_id: user.id,
                    nama: `Tupai ${user.name || 'Erich'}`,
                }),
            });
            const result = await res.json();
            if (result.success) {
                setTupai(result.data);
                toast.success('Tupai berhasil diadopsi! Selamat!');
            } else {
                toast.error(result.message || 'Gagal mengadopsi.');
            }
        } catch (e) {
            toast.error('Gagal mengadopsi. Coba lagi nanti.');
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleInteract = async (action: 'feed' | 'sleep') => {
        if (!tupai?.id || isActionLoading) return;
        setIsActionLoading(true);

        try {
            const res = await fetch(`${API_BASE}/mytupai/${tupai.id}/${action}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const result = await res.json();

            if (result.success) {
                setTupai(result.data);
                toast.success(result.message || 'Aksi berhasil dilakukan.');
            } else {
                toast.error(result.message || 'Gagal melakukan aksi.');
            }
        } catch (e) {
            toast.error('Gagal melakukan aksi.');
        } finally {
            setIsActionLoading(false);
        }
    };

    useEffect(() => {
        fetchTupaiStatus();
    }, [fetchTupaiStatus]);

    if (loading) {
        return <div className="mx-auto max-w-[1200px] p-6 text-center font-semibold text-slate-600 dark:text-slate-300">Memuat My Pet...</div>;
    }

    const greeting = getFullGreeting(user?.name || '');
    const displayName = user?.name || 'Pengguna';
    const petDays = Math.max(1, Number(tupai?.level) || 1);
    const stamina = clampPercent(tupai?.level_stamina);
    const hunger = clampPercent(tupai?.level_lapar);
    const petImage = tupai?.status === 'sleeping'
        ? '/Asset/squirrel/squirrel-exhausted-light.svg'
        : '/Asset/squirrel/squirrel-normal.svg';
    const pageLabel = mode === 'owner' ? 'My Pet Owner' : 'My Pet';

    return (
        <div className="mx-auto max-w-[1200px] space-y-6" aria-label={pageLabel}>
            <header className="flex flex-col gap-4 rounded-[28px] border border-transparent bg-transparent xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-center gap-4">
                    
                        <Image className="mt-5" src="/Asset/icon/icon-person.svg" alt="Akun pengguna" width={100} height={100} />
                 
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{greeting.greeting}</p>
                        <h1 className="text-[34px] font-bold leading-none text-slate-950 dark:text-white">{greeting.userName || displayName}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3 self-start xl:self-auto">
                    <MetricChip
                        icon={Flame}
                        label={`${petDays} Days`}
                        accentClassName="border-[#f6cfab] bg-[#fff2e3] text-[#e48a44] dark:border-[#5b4432] dark:bg-[#2a1f1b] dark:text-[#f0b2a7]"
                    />
                    <MetricChip
                        icon={Coins}
                        label={`${totalKoin || 0} Coins`}
                        accentClassName="border-[#e1ab9d] bg-[#fff5f2] text-[#dd6f5d] dark:border-[#5b342f] dark:bg-[#2a1f1b] dark:text-[#f0b2a7]"
                    />
                </div>
            </header>

            <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900 xl:p-8">
                {!tupai ? (
                    <div className="flex min-h-[320px] flex-col items-center justify-center gap-5 text-center">
                        <div className="relative h-44 w-44 opacity-75">
                            <Image src="/Asset/squirrel/squirrel-normal.svg" alt="Pet" fill className="object-contain" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Kandang Masih Kosong</h2>
                            <p className="mt-2 max-w-xl text-slate-500 dark:text-slate-400">Kamu belum memiliki tupai. Adopsi sekarang untuk mulai petualangan dan mengumpulkan koin reward.</p>
                        </div>
                        <button
                            onClick={handleAdopt}
                            disabled={isActionLoading}
                            className="inline-flex items-center justify-center rounded-full bg-[#dd6f5d] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(221,111,93,0.22)] transition hover:bg-[#cc5d4d] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#e07b6d] dark:text-slate-950 dark:hover:bg-[#f0b2a7]"
                        >
                            {isActionLoading ? 'Sedang Adopsi...' : 'Adopsi Sekarang'}
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(220px,260px)] xl:items-center xl:gap-4">
                        <div className="flex flex-col gap-6 md:flex-row md:items-center">
                            <div className="relative flex h-[320px] w-full max-w-[320px] items-center justify-center rounded-[28px] bg-[linear-gradient(180deg,#fff1df_0%,#fff7ee_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] md:h-[320px] md:w-[320px]">
                                <div className="relative aspect-square w-full max-w-[280px]">
                                    <Image src={petImage} alt="Pet" fill priority className="object-contain" />
                                </div>
                            </div>

                            <div className="w-full space-y-6">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-[28px] font-bold text-slate-950 dark:text-white">Your Pet</h2>
                                            <button className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700" aria-label="Edit pet name">
                                                <Edit3 size={14} />
                                            </button>
                                        </div>
                                        <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                            {tupai.nama || `Tupai ${displayName}`}
                                        </p>
                                    </div>
                                </div>

                                <div className="w-full max-w-[500px] space-y-4">
                                    <StatProgress label="Segar" value={stamina} />
                                    <StatProgress label="Kenyang" value={hunger} />
                                </div>
                            </div>
                        </div>

                        <div className="flex h-full items-center justify-center xl:justify-self-center">
                            <div className="grid w-full max-w-[300px] justify-items-center gap-4 sm:grid-cols-2 xl:grid-cols-1 xl:justify-items-center">
                                <ActionButton
                                    label="Feed"
                                    icon={Utensils}
                                    onClick={() => handleInteract('feed')}
                                    disabled={isActionLoading || tupai.status === 'sleeping'}
                                    className="bg-[#fff2ef] text-[#dd6f5d] hover:bg-[#fde6e1] dark:bg-[#2f1d18] dark:text-[#f0b2a7] dark:hover:bg-[#3a241e]"
                                />
                                <ActionButton
                                    label="Sleep"
                                    icon={MoonStar}
                                    onClick={() => handleInteract('sleep')}
                                    disabled={isActionLoading || tupai.status === 'sleeping'}
                                    className="bg-[#92a0bf] text-slate-950 hover:bg-[#8291af] dark:bg-[#6f7b97] dark:text-slate-950 dark:hover:bg-[#8792ab]"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <section className="space-y-4 pb-8">
                <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-[#dd6f5d] dark:text-[#f0b2a7]" />
                    <h3 className="text-[22px] font-semibold text-slate-950 dark:text-white">Tukar Koin & Dapatkan Reward!</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    {rewardCards.map((reward, index) => (
                        <RewardCard
                            key={`${reward.title}-${index}`}
                            title={reward.title}
                            description={reward.description}
                            price={reward.price}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}