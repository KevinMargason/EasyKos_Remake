'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { PaymentModal } from './PaymentModal';
import { useAppSelector } from '@/core/store/hooks';

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
    const user = useAppSelector((state: any) => state.user.user);
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

    const handleConfirmPayment = async (modalData: any) => {
        if (!modalData.roomsId) {
            alert("Pilih nomor kamar terlebih dahulu!");
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

            alert('✅ Pembayaran Berhasil!');
            setPaymentModalOpen(false);
            onBack(); 

        } catch (error: any) {
            alert(`❌ Error: ${error.message}`);
        } finally {
            setIsProcessingPayment(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <button onClick={onBack} className="p-3 bg-slate-800 rounded-full">
                    <X size={24} />
                </button>
                <h1 className="text-2xl font-bold">Detail Kos</h1>
                <div className="w-12" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Kiri - Info Utama */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Nama & Alamat */}
                    <div>
                        <h2 className="text-4xl font-bold">{kosName}</h2>
                        <p className="text-slate-400 mt-1">{kosLocation}</p>
                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-[#ff6b3d]">
                                Rp {pricePerMonth.toLocaleString('id-ID')}
                            </span>
                            <span className="text-slate-500">// {kos.period}</span>
                        </div>
                    </div>

                    {/* Fasilitas & Peraturan - Desain Kartu Sesuai Screenshot */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Fasilitas Umum */}
                        <div className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800">
                            <h3 className="text-lg font-bold mb-5">Fasilitas Umum</h3>
                            <div className="grid grid-cols-3 gap-y-6 gap-x-2">
                                {kos.facilities.umum.map(f => (
                                    <div key={f} className="text-[10px] text-center">
                                        <Image src={facilityIcons[f] || '/Asset/icon/icon-apartment.svg'} alt={f} width={28} height={28} className="mx-auto mb-2" />
                                        <span className="text-slate-300">{capitalizeFacility(f)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Fasilitas Kamar */}
                        <div className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800">
                            <h3 className="text-lg font-bold mb-5">Fasilitas Kamar</h3>
                            <div className="grid grid-cols-3 gap-y-6 gap-x-2">
                                {kos.facilities.kamar.map(f => (
                                    <div key={f} className="text-[10px] text-center">
                                        <Image src={facilityIcons[f] || '/Asset/icon/icon-bed.svg'} alt={f} width={28} height={28} className="mx-auto mb-2" />
                                        <span className="text-slate-300">{capitalizeFacility(f)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Peraturan Kos - Muncul Kembali */}
                    <div className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800">
                        <h3 className="text-lg font-bold mb-4">Peraturan Kos</h3>
                        {rulesList.length > 0 ? (
                            <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
                                {rulesList.map((rule, index) => (
                                    <li key={index}>{rule}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-slate-500 italic">Belum ada peraturan kos.</p>
                        )}
                    </div>
                </div>

                {/* Kanan - Booking Card (Desain PWA) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-10 bg-[#1e293b] p-7 rounded-3xl border border-slate-800 shadow-xl space-y-6">
                        {/* Profile Pemilik - Desain Diperbaiki */}
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 relative rounded-full overflow-hidden border-2 border-slate-700 bg-slate-800">
                                <Image src={kos.owner?.avatar || '/Asset/icon/icon-person.svg'} alt="Owner" fill className="object-cover" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500">Pemilik</p>
                                <p className="text-lg font-bold uppercase">{resolvedOwnerName}</p>
                            </div>
                        </div>

                        {/* Form Booking */}
                        <div className="space-y-5 pt-4 border-t border-slate-800">
                            <div>
                                <label className="text-sm font-semibold text-slate-300 block mb-2">Tanggal Mulai</label>
                                <input 
                                    type="date" 
                                    value={selectedDate} 
                                    onChange={(e) => setSelectedDate(e.target.value)} 
                                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-[#ff6b3d]" 
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-300 block mb-2">Durasi (Bulan)</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {['1', '3', '6', '12'].map(d => (
                                        <button 
                                            key={d} 
                                            onClick={() => setSelectedDuration(d)} 
                                            className={`p-3 text-sm rounded-xl border transition ${selectedDuration === d ? 'bg-[#c86654] border-[#c86654] text-white font-bold' : 'border-slate-700 bg-slate-900 text-slate-400'}`}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button 
                                onClick={handleBook}
                                disabled={!selectedDate}
                                className="w-full py-4 mt-2 bg-[#ff6b3d] text-white font-bold rounded-2xl shadow-lg active:scale-[0.98] transition disabled:opacity-50"
                            >
                                Pesan Sekarang
                            </button>
                        </div>
                    </div>
                </div>
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