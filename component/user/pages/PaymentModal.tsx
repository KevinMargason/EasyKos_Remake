import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { X, ChevronLeft } from 'lucide-react';

// 1. Definisikan Interface Kamar agar lebih rapi
interface Room {
  id: number;
  nomor_kamar: string;
  harga: number;
  users_id: number | null;
}

// 2. Perbaikan Interface Props (Menghilangkan redundansi isProcessing)
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onConfirm: (data: any) => Promise<void>;
  availableRooms: Room[]; 
  booking: {
    kosName: string;
    kosNumber: string;
    price: number;
    totalPrice: number;
    startDate: string;
    duration: number;
  } | null;
  isProcessing: boolean; // Props ini dikontrol oleh parent (KosDetailPage)
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onBack,
  onConfirm,
  availableRooms = [], // Default value untuk cegah .find error
  booking,
  isProcessing: isParentProcessing, // Rename agar tidak bentrok dengan state lokal jika ada
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState<string>("");

  // Reset pilihan saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setSelectedRoomId("");
      setSelectedPayment("");
    }
  }, [isOpen]);

  // LOGIKA HARGA DINAMIS
  const selectedRoomData = useMemo(() => {
    return availableRooms.find(room => String(room.id) === selectedRoomId);
  }, [selectedRoomId, availableRooms]);

  const currentTotalPrice = useMemo(() => {
    if (selectedRoomData && booking) {
      return Number(selectedRoomData.harga) * booking.duration;
    }
    return booking?.totalPrice || 0;
  }, [selectedRoomData, booking]);

  const paymentMethods = [
    {
      key: 'OVO',
      label: 'OVO',
      icon: '/Asset/ovo.svg',
      iconClassName: 'h-8 w-auto',
    },
    {
      key: 'Transfer Bank',
      label: 'Transfer Bank',
      icon: '/Asset/icon/icon-transfer.svg',
      iconClassName: 'h-8 w-8',
    },
    {
      key: 'QRIS',
      label: 'QRIS',
      icon: '/Asset/qris.svg',
      iconClassName: 'h-10 w-auto',
    },
    {
      key: 'GoPay',
      label: 'GoPay',
      icon: '/Asset/gopay-teks.svg',
      logo: '/Asset/gopay-logo.svg',
      iconClassName: 'h-8 w-auto',
    },
  ] as const;

  if (!isOpen || !booking) return null;

  const handleConfirmClick = async () => {
    if (selectedPayment && selectedRoomId) {
      // Mengirim data ke parent
      await onConfirm({
        roomsId: selectedRoomId, // Pastikan nama property ini sama dengan yang di handleConfirmPayment parent
        paymentMethod: selectedPayment,
        totalHarga: currentTotalPrice
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md dark:bg-black/70">
      <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-slate-950 dark:shadow-[0_24px_70px_rgba(0,0,0,0.42)]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800">
          <button onClick={onBack} className="text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Pembayaran</h2>
          <button onClick={onClose} className="text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Info Kos & Harga */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/90">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">ID Kos: {booking.kosNumber}</p>
                <p className="text-lg font-bold text-slate-950 dark:text-white">{booking.kosName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400">Total Harga</p>
                <p className="text-xl font-bold text-[#c55f4a] dark:text-[#f0b2a7]">
                  Rp {currentTotalPrice.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Durasi: <span className="font-medium text-slate-800 dark:text-slate-100">{booking.duration} Bulan</span></p>
          </div>

          {/* Metode Pembayaran */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Pilih Metode Pembayaran</p>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.key}
                  type="button"
                  onClick={() => setSelectedPayment(method.key)}
                  className={`flex h-[72px] items-center justify-center rounded-2xl border bg-white px-4 py-3 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)] dark:bg-[#f8fafc] dark:hover:shadow-[0_10px_24px_rgba(0,0,0,0.22)] ${
                    selectedPayment === method.key
                      ? 'border-[#c35f46] shadow-[0_0_0_1px_rgba(195,95,70,0.10),0_10px_24px_rgba(195,95,70,0.12)] dark:border-[#f0b2a7] dark:shadow-[0_0_0_1px_rgba(240,178,167,0.10),0_10px_24px_rgba(0,0,0,0.18)]'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className="sr-only">{method.label}</span>
                  {method.key === 'GoPay' ? (
                     <div className="flex items-center justify-center gap-2">
                      <Image
                        src={method.logo}
                        alt="GoPay logo"
                        width={26}
                        height={26}
                        className="h-9 w-9"
                        unoptimized
                      />
                     
                      <Image
                        src={method.icon}
                        alt={method.label}
                        width={100}
                        height={34}
                        className="h-7 w-auto"
                        unoptimized
                      />
                    </div>
                  ) : (
                   
                      <Image
                        src={method.icon}
                        alt={method.label}
                        width={160}
                        height={56}
                        className={method.iconClassName}
                        unoptimized
                      />

                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Pilih Kamar */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Pilih Kamar</label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full cursor-pointer rounded-2xl border border-slate-200 bg-white p-3 text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-[#cf7461]/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-[#f0b2a7]/20"
            >
              <option value="">-- Pilih Kamar Tersedia --</option>
              {availableRooms.map((room) => (
                <option key={room.id} value={String(room.id)}>
                  Kamar {room.nomor_kamar} - Rp {Number(room.harga).toLocaleString('id-ID')}
                </option>
              ))}
            </select>
          </div>

          {/* Konfirmasi */}
          <button
            onClick={handleConfirmClick}
            disabled={!selectedRoomId || !selectedPayment || isParentProcessing}
            className={`w-full rounded-2xl py-4 text-lg font-bold transition-all shadow-lg ${
              !selectedRoomId || !selectedPayment || isParentProcessing
              ? 'cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
              : 'bg-[#c55f4a] text-white hover:bg-[#b95643] active:scale-[0.98] dark:bg-[#e07b6d] dark:text-slate-950 dark:hover:bg-[#f0b2a7]'
            }`}
          >
            {isParentProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                <span>Memproses...</span>
              </div>
            ) : (
              <span>Konfirmasi Pesanan</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};