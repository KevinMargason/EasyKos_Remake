'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useAppSelector } from '@/core/store/hooks';

export default function MyPetContent() {
    // Ambil data user dari Redux (Student ID: 160423046)
    const user = useAppSelector((state: any) => state.auth.user); 
    const [tupai, setTupai] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const API_BASE = 'https://easykosbackend-production.up.railway.app/api';

    // 1. Fungsi untuk Fetch/Check Status Tupai
    const fetchTupaiStatus = useCallback(async () => {
        if (!user?.id) return;
        try {
            // Menggunakan endpoint index dengan query parameter users_id
            const res = await fetch(`${API_BASE}/mytupai?users_id=${user.id}`);
            const result = await res.json();
            
            // Karena API index mereturn array, kita ambil data milik user ini
            if (result.success && result.data.length > 0) {
                const myPet = result.data.find((item: any) => item.users_id == user.id);
                setTupai(myPet || null);
            } else {
                setTupai(null);
            }
        } catch (error) {
            console.error("Error fetching pet:", error);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    // 2. Fungsi Adopsi (POST store)
    const handleAdopt = async () => {
        setIsActionLoading(true);
        try {
            const res = await fetch(`${API_BASE}/mytupai`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    users_id: user.id,
                    nama: `Tupai ${user.name || 'Erich'}`
                })
            });
            const result = await res.json();
            if (result.success) {
                setTupai(result.data);
                toast.success("Tupai berhasil diadopsi! Selamat!");
            }
        } catch (e) {
            toast.error("Gagal mengadopsi. Coba lagi nanti.");
        } finally {
            setIsActionLoading(false);
        }
    };

    // 3. Fungsi Interaksi (Feed / Sleep)
    const handleInteract = async (action: 'feed' | 'sleep') => {
        if (!tupai?.id || isActionLoading) return;
        setIsActionLoading(true);
        
        try {
            const res = await fetch(`${API_BASE}/mytupai/${tupai.id}/${action}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await res.json();
            
            if (result.success) {
                setTupai(result.data); // Update state dengan data terbaru (XP, Level, Lapar)
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        } catch (e) {
            toast.error("Gagal melakukan aksi.");
        } finally {
            setIsActionLoading(false);
        }
    };

    useEffect(() => {
        fetchTupaiStatus();
    }, [fetchTupaiStatus]);

    if (loading) return <div className="p-20 text-center font-bold">Memanggil Tupai...</div>;

    return (
        <div className="mx-auto max-w-[1200px] p-6">
            <h1 className="mb-8 text-3xl font-extrabold text-slate-900 dark:text-white">My Pet</h1>

            {!tupai ? (
                /* VIEW: BELUM PUNYA PET */
                <div className="flex flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-slate-200 bg-white p-16 text-center dark:bg-slate-900">
                    <div className="relative h-40 w-40 opacity-40 grayscale">
                        <Image src="/Asset/squirrel/squirrel-normal.svg" alt="Pet" fill />
                    </div>
                    <h2 className="mt-6 text-2xl font-bold">Kandang Masih Kosong</h2>
                    <p className="mt-2 text-slate-500">Kamu belum memiliki tupai. Adopsi sekarang untuk mulai petualangan!</p>
                    <button 
                        onClick={handleAdopt}
                        disabled={isActionLoading}
                        className="mt-8 rounded-full bg-orange-500 px-12 py-4 font-bold text-white shadow-lg hover:bg-orange-600 disabled:opacity-50"
                    >
                        {isActionLoading ? 'Sedang Adopsi...' : 'Adopsi Sekarang'}
                    </button>
                </div>
            ) : (
                /* VIEW: SUDAH ADA PET */
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Card Utama Pet */}
                    <div className="lg:col-span-2 rounded-[32px] bg-white p-8 shadow-sm dark:bg-slate-900 border border-slate-100">
                        <div className="flex flex-col items-center gap-8 md:flex-row">
                            <div className="relative h-48 w-48">
                                <Image 
                                    src={tupai.status === 'sleeping' ? '/Asset/squirrel/squirrel-sleep.svg' : '/Asset/squirrel/squirrel-normal.svg'} 
                                    alt="Pet" fill 
                                />
                            </div>
                            
                            <div className="flex-1 space-y-6 w-full">
                                <div>
                                    <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase">{tupai.nama}</h2>
                                    <p className="text-orange-500 font-bold">Level {tupai.level} — {tupai.status}</p>
                                </div>

                                {/* Progress Bars */}
                                <div className="space-y-4">
                                    <StatusProgress label="Kenyang" value={tupai.level_lapar} color="bg-orange-500" />
                                    <StatusProgress label="Stamina" value={tupai.level_stamina} color="bg-blue-500" />
                                    <StatusProgress label="XP" value={tupai.xp} color="bg-green-500" isXP />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card Aksi */}
                    <div className="rounded-[32px] bg-slate-50 p-8 dark:bg-slate-800 border border-slate-100 flex flex-col justify-center gap-4">
                        <h3 className="text-center font-bold text-slate-500 mb-2 text-sm uppercase tracking-widest">Aktivitas</h3>
                        <button 
                            onClick={() => handleInteract('feed')}
                            disabled={isActionLoading || tupai.status === 'sleeping'}
                            className="flex items-center justify-center gap-3 rounded-2xl bg-white p-5 font-bold text-orange-600 shadow-sm transition hover:bg-orange-50 disabled:opacity-50"
                        >
                            <span>🍎</span> Beri Makan (+10 XP)
                        </button>
                        <button 
                            onClick={() => handleInteract('sleep')}
                            disabled={isActionLoading || tupai.status === 'sleeping'}
                            className="flex items-center justify-center gap-3 rounded-2xl bg-[#2D336B] p-5 font-bold text-white shadow-sm transition hover:bg-[#1e234a] disabled:opacity-50"
                        >
                            <span>💤</span> Tidurkan (8 Jam)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Sub-component untuk Bar Status
function StatusProgress({ label, value, color, isXP = false }: { label: string, value: number, color: string, isXP?: boolean }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs font-black uppercase tracking-tighter">
                <span>{label}</span>
                <span>{value}{isXP ? '/100' : '%'}</span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                <div 
                    className={`h-full rounded-full transition-all duration-500 ${color}`} 
                    style={{ width: `${value}%` }} 
                />
            </div>
        </div>
    );
}