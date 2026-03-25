'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { toast } from 'sonner';
import { PaymentModal } from './PaymentModal';
import { useAppSelector } from '@/core/store/hooks';
import { ROUTES } from '@/lib/routes';

interface KosDetailPageProps {
    kos: {
        id: string;
        name?: string;
        nama?: string;
        location?: string;
        alamat?: string;
        price?: string;
        harga?: number | string;
        period: string;
        images: string[];
        description: string;
        facilities: {
            umum: string[];
            kamar: string[];
        };
        rules: string[];
        owner?: {
            id?: number | string;
            name?: string;
            nama?: string;
            avatar?: string;
        } | null;
    };
    onBack: () => void;
}

const facilityIcons: Record<string, string> = {
    wifi: '/Asset/icon/icon-wifi.svg',
    cctv: '/Asset/icon/icon-cctv.svg',
    kulkas: '/Asset/icon/icon-fridge.svg',
    laundry: '/Asset/icon/icon-laundry.svg',
    ruangTamu: '/Asset/icon/icon-sofa.svg',
    dapur: '/Asset/icon/icon-kitchen-set.svg',
    kamarMandiLuar: '/Asset/icon/icon-bathroom.svg',
    lemari: '/Asset/icon/icon-wardrobe.svg',
    meja: '/Asset/icon/icon-table.svg',
    kursi: '/Asset/icon/icon-chair.svg',
    kasur: '/Asset/icon/icon-bed.svg',
    kamarMandiDalam: '/Asset/icon/icon-bathroom.svg',
};

const capitalizeFacility = (text: string): string => {
    return text
        .replace(/([A-Z])/g, ' $1')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
        .trim();
};

export default function KosDetailPage({ kos, onBack }: KosDetailPageProps) {
    const router = useRouter();
    const user = useAppSelector((state: any) => state.user.user);
    const dateInputRef = useRef<HTMLInputElement>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedDuration, setSelectedDuration] = useState('1');
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [availableRooms, setAvailableRooms] = useState<any[]>([]);
    const [bookingData, setBookingData] = useState<any>(null);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // Resolving Data
    const kosName = kos.name || kos.nama || 'Kos';
    const kosLocation = kos.location || kos.alamat || '-';
    const pricePerMonth = Number(kos.harga) || 0;
    const resolvedOwnerName = kos.owner?.name || kos.owner?.nama || 'Pemilik';
    const finalImages = kos.images?.length ? kos.images : ['/Asset/kamar/kamar1.svg'];
    const rulesList = kos.rules || [];

    useEffect(() => {
        setCurrentImageIndex(0);
    }, [kos.id]);

    useEffect(() => {
        if (currentImageIndex >= finalImages.length) {
            setCurrentImageIndex(0);
        }
    }, [currentImageIndex, finalImages.length]);

    const currentImage = finalImages[currentImageIndex] || finalImages[0];

    const handlePreviousImage = () => {
        setCurrentImageIndex((current) => (current - 1 + finalImages.length) % finalImages.length);
    };

    const handleNextImage = () => {
        setCurrentImageIndex((current) => (current + 1) % finalImages.length);
    };

    // Fetch rooms saat modal dibuka
    const fetchRoomsForKos = async () => {
        try {
            const response = await fetch(`https://easykosbackend-production.up.railway.app/api/kos/${kos.id}/rooms`);
            const body = await response.json();
            if (body.success && Array.isArray(body.data)) {
                // Hanya ambil yang users_id null (kosong)
                const emptyRooms = body.data.filter((room: any) => !room.users_id);
                setAvailableRooms(emptyRooms);
            }
        } catch (error) {
            console.error('Fetch rooms error:', error);
        }
    };

    useEffect(() => {
        if (paymentModalOpen) fetchRoomsForKos();
    }, [paymentModalOpen, kos.id]);

    const handleBook = () => {
        if (selectedDate && selectedDuration) {
            const duration = parseInt(selectedDuration);
            setBookingData({
                kosName,
                kosId: kos.id,
                price: pricePerMonth,
                totalPrice: pricePerMonth * duration,
                startDate: selectedDate,
                duration: duration,
            });
            setPaymentModalOpen(true);
        }
    };

    const handleContactOwner = () => {
        router.push('/user/chat');
    };

    const openDatePicker = () => {
        const input = dateInputRef.current;

        if (!input) return;

        if (typeof input.showPicker === 'function') {
            input.showPicker();
            return;
        }

        input.focus();
        input.click();
    };

    const handleConfirmPayment = async (modalData: any) => {
        if (!modalData.roomsId) {
            toast.error("Pilih nomor kamar terlebih dahulu!");
            return;
        }

        setIsProcessingPayment(true);
        try {
            const RAILWAY_BASE = "https://easykosbackend-production.up.railway.app";

            // Payload Diperbaiki: tenant & users_id menggunakan ID (Number)
            const paymentPayload = {
                rooms_id: parseInt(modalData.roomsId),
                users_id: user?.id || 160423046, // NRP Erich fallback
                tenant: user?.id || 160423046,   // Harus ID (Number)
                jenis_pembayaran: 'bulanan',
                amount: bookingData.totalPrice,
                payment_method: modalData.paymentMethod,
                start_date: bookingData.startDate,
                duration: bookingData.duration,
                voucher_id: null
            };

            const response = await fetch(`${RAILWAY_BASE}/api/payments`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(paymentPayload),
            });

            if (!response.ok) throw new Error('Gagal membuat transaksi di server');

            const result = await response.json();
            const paymentId = result?.data?.id || result?.id;

            // 2. Tandai sebagai Paid
            if (paymentId) {
                await fetch(`${RAILWAY_BASE}/api/payments/${paymentId}/pay`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            toast.success('Pesanan berhasil dibuat!');
            setPaymentModalOpen(false);
            router.push(ROUTES.USER.MYKOS);

        } catch (error: any) {
            toast.error(error?.message || 'Terjadi kesalahan saat memproses pembayaran.');
        } finally {
            setIsProcessingPayment(false);
        }
    };

    return (
       
            <div className="flex w-full flex-col gap-3">
                <div className="flex items-center justify-between rounded-[22px] border border-[#ead9cf] bg-white px-4 py-3 shadow-[0_10px_28px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_10px_28px_rgba(0,0,0,0.24)]">
                    <button
                        onClick={onBack}
                        aria-label="Kembali"
                        className="grid h-10 w-10 place-items-center rounded-full border border-[#ead9cf] bg-white text-slate-700 transition hover:border-[#c35f46] hover:text-[#c35f46] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-[#f0b2a7] dark:hover:text-[#f0b2a7]"
                    >
                        <X size={18} />
                    </button>
                    <h1 className="text-base font-semibold tracking-wide text-slate-800 dark:text-slate-100 sm:text-lg">Detail Kos</h1>
                    <div className="w-10" />
                </div>

                <section className="relative overflow-hidden rounded-[22px] border border-[#ead9cf] bg-white shadow-[0_14px_36px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_14px_36px_rgba(0,0,0,0.26)]">
                    <div className="relative h-[220px] w-full sm:h-[300px] lg:h-[360px]">
                        <Image src={currentImage} alt={kosName} fill priority className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent dark:from-slate-950/50" />

                        <button
                            onClick={handlePreviousImage}
                            aria-label="Gambar sebelumnya"
                            className="absolute left-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-slate-950/30 text-white backdrop-blur-md transition hover:bg-slate-950/55"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={handleNextImage}
                            aria-label="Gambar berikutnya"
                            className="absolute right-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-slate-950/35 text-white backdrop-blur-md transition hover:bg-slate-950/55"
                        >
                            <ChevronRight size={20} />
                        </button>

                        <div className="absolute left-4 bottom-4 flex gap-2 overflow-x-auto pr-4 sm:left-6 sm:bottom-6">
                            {finalImages.slice(0, 4).map((image, index) => (
                                <button
                                    key={`${image}-${index}`}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`relative h-12 w-12 overflow-hidden rounded-[12px] border-2 transition sm:h-14 sm:w-14 ${currentImageIndex === index
                                        ? 'border-[#cf7461] shadow-[0_0_0_3px_rgba(207,116,97,0.20)]'
                                        : 'border-white/35 opacity-75 hover:opacity-100'
                                    }`}
                                >
                                    <Image src={image} alt={`Pratinjau ${index + 1}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="rounded-[22px] border border-[#ead9cf] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_14px_36px_rgba(0,0,0,0.24)] sm:p-7">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div className="min-w-0">
                            <h2 className="text-[30px] font-semibold leading-tight text-slate-950 dark:text-white sm:text-[38px]">{kosName}</h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{kosLocation}</p>
                        </div>
                        <div className="shrink-0 text-left sm:text-right">
                            <span className="block text-[28px] font-semibold tracking-tight text-[#c55f4a] dark:text-[#f0b2a7] sm:text-[34px]">
                                Rp {pricePerMonth.toLocaleString('id-ID')}
                            </span>
                            <span className="text-sm text-slate-500 dark:text-slate-400">/ {kos.period?.replace(/^\//, '').trim() || 'Bulan'}</span>
                        </div>
                    </div>
                </section>

                <div className="grid gap-3 lg:grid-cols-[1.05fr_1fr_0.95fr]">
                    <section className="rounded-[22px] border border-[#ead9cf] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_14px_36px_rgba(0,0,0,0.24)]">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Peraturan Kos</h3>
                        <div className="mt-4">
                            {rulesList.length > 0 ? (
                                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                                    {rulesList.map((rule, index) => (
                                        <li key={`${rule}-${index}`} className="flex gap-3">
                                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c55f4a] dark:bg-[#f0b2a7]" />
                                            <span>{rule}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-slate-500 italic dark:text-slate-400">Belum ada peraturan kos.</p>
                            )}
                        </div>
                    </section>

                    <div className="space-y-3">
                        <section className="rounded-[22px] border border-[#ead9cf] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_14px_36px_rgba(0,0,0,0.24)]">
                            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Fasilitas Umum</h3>
                            <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
                                {kos.facilities.umum.map((facility) => (
                                    <div
                                        key={facility}
                                        className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                                    >
                                        <div className="grid h-12 w-12 place-items-center rounded-2xl  text-[#c55f4a]  dark:text-[#f0b2a7]">
                                            <Image src={facilityIcons[facility] || '/Asset/icon/icon-apartment.svg'} alt={facility} width={24} height={24} />
                                        </div>
                                        <span className="text-[11px] font-medium leading-tight text-slate-600 dark:text-slate-300">{capitalizeFacility(facility)}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-[22px] border border-[#ead9cf] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_14px_36px_rgba(0,0,0,0.24)]">
                            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Fasilitas Kamar</h3>
                            <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
                                {kos.facilities.kamar.map((facility) => (
                                    <div
                                        key={facility}
                                        className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                                    >
                                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0eb] text-[#c55f4a] dark:bg-[#29374f] dark:text-[#f0b2a7]">
                                            <Image src={facilityIcons[facility] || '/Asset/icon/icon-bed.svg'} alt={facility} width={24} height={24} />
                                        </div>
                                        <span className="text-[11px] font-medium leading-tight text-slate-600 dark:text-slate-300">{capitalizeFacility(facility)}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <aside className="lg:sticky lg:top-6">
                        <div className="rounded-[22px] border border-[#ead9cf] bg-white p-6 shadow-[0_14px_36px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_14px_36px_rgba(0,0,0,0.24)]">
                            <div className="flex items-center gap-4">
                                <div className="relative h-25 w-25 mt-4 shrink-0 overflow-hidden">
                                    <Image src={kos.owner?.avatar || '/Asset/icon/icon-person.svg'} alt="Owner" fill className="object-cover" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Pemilik Kos</p>
                                    <p className="mt-1 truncate text-lg font-semibold text-slate-950 dark:text-white">{resolvedOwnerName}</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleContactOwner}
                                className="mt-5 w-full rounded-2xl border border-[#ead9cf] bg-white py-3.5 text-sm font-semibold text-slate-800 shadow-[0_8px_20px_rgba(15,23,42,0.05)] transition hover:border-[#c35f46] hover:text-[#c35f46] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-[#f0b2a7] dark:hover:text-[#f0b2a7]"
                            >
                                Contact Owner
                            </button>

                            <div className="mt-6 space-y-5 border-t border-[#ead9cf] pt-5 dark:border-slate-800">
                                <div>
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Tanggal Mulai Pesan</label>
                                    <div className="relative">
                                        <input
                                            ref={dateInputRef}
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="w-full rounded-xl border border-[#ead9cf] bg-[#fbf9f7] px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#c35f46] focus:ring-2 focus:ring-[#c35f46]/15 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50 dark:focus:border-[#f0b2a7] dark:focus:ring-[#f0b2a7]/20"
                                        />
                                        <button
                                            type="button"
                                            onClick={openDatePicker}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition hover:opacity-80 active:scale-95 text-black dark:text-white brightness-0 dark:brightness-100 dark:invert"
                                        >
                                            <Image
                                                src="/Asset/icon/icon-calendar.svg"
                                                alt="Tanggal"
                                                width={18}
                                                height={18}
                                                className="w-[18px] h-[18px]"
                                                unoptimized
                                            />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Durasi Pemesanan (Bulan)</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {['1', '3', '6', '12'].map((duration) => {
                                            const active = selectedDuration === duration;
                                            return (
                                                <button
                                                    key={duration}
                                                    type="button"
                                                    onClick={() => setSelectedDuration(duration)}
                                                    className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${active
                                                        ? 'border-[#cf7461] bg-[#cf7461] text-white shadow-[0_8px_18px_rgba(207,116,97,0.25)] dark:border-[#f0b2a7] dark:bg-[#f0b2a7] dark:text-slate-950'
                                                        : 'border-slate-200 bg-white text-slate-600 hover:border-[#d08b7d] hover:text-[#ba6054] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-[#f0b2a7] dark:hover:text-[#f0b2a7]'
                                                    }`}
                                                >
                                                    {duration}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <button
                                    onClick={handleBook}
                                    disabled={!selectedDate}
                                    className="w-full rounded-2xl bg-[#c35f46] py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(195,95,70,0.24)] transition hover:bg-[#b8533d] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#e07b6d] dark:text-slate-950 dark:shadow-[0_12px_28px_rgba(224,123,109,0.20)] dark:hover:bg-[#f0b2a7]"
                                >
                                    Pesan Sekarang
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            

            {/* Modals */}
            {paymentModalOpen && (
                <PaymentModal
                    isOpen={paymentModalOpen}
                    booking={bookingData}
                    availableRooms={availableRooms || []}
                    onClose={() => setPaymentModalOpen(false)}
                    onConfirm={handleConfirmPayment}
                    isProcessing={isProcessingPayment}
					onBack={() => setPaymentModalOpen(false)}
                />
            )}
        </div>
    );
}