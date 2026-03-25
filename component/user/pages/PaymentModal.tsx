import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';

interface Room {
  id: number;
  nomor_kamar: string;
  harga: number;
  users_id: number | null;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onConfirm: (data: any) => Promise<void>;
  availableRooms: any[]; // <--- Ubah ini dari Room[] ke any[]
  booking: {
    kosName: string;
    kosNumber: string;
    price: number;
    totalPrice: number;
    startDate: string;
    duration: number;
    roomsId?: string;
  } | null;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onBack,
  onConfirm,
  availableRooms,
  booking
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset pilihan saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setSelectedRoomId("");
      setSelectedPayment("");
    }
  }, [isOpen]);

  if (!isOpen || !booking) return null;

  const handleConfirmClick = async () => {
    if (selectedPayment && selectedRoomId) {
      setIsProcessing(true);
      try {
        await onConfirm({
          paymentMethod: selectedPayment,
          roomsId: selectedRoomId,
          // Mengirim data tambahan jika diperlukan oleh parent
        });
      } catch (error) {
        console.error("Payment failed:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0f172a] w-full max-w-md rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-bold text-white">Pembayaran</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Info Kos & Harga */}
          <div className="bg-[#1e293b] border border-gray-700 rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Kos {booking.kosNumber}</p>
                <p className="text-lg font-bold text-white">{booking.kosName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Total Harga</p>
                <p className="text-xl font-bold text-orange-500">
                  Rp {booking.totalPrice.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400">Durasi: <span className="text-white font-medium">{booking.duration} Bulan</span></p>
          </div>

          {/* Metode Pembayaran */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-300">Pilih Metode Pembayaran</p>
            <div className="grid grid-cols-2 gap-3">
              {['OVO', 'QRIS', 'Transfer Bank', 'GoPay'].map((method) => (
                <button
                  key={method}
                  onClick={() => setSelectedPayment(method)}
                  className={`p-3 rounded-lg border text-sm font-semibold transition-all ${
                    selectedPayment === method 
                    ? 'border-blue-500 bg-blue-500/20 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                    : 'border-gray-700 bg-[#0f172a] text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Pilih Kamar (Data dari API) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">ID Kamar (Room ID)</label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full bg-[#1e293b] text-white border border-gray-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="">Pilih kamar</option>
              {availableRooms.map((room) => (
                <option key={room.id} value={String(room.id)}>
                  Kamar {room.nomor_kamar} - Rp {Number(room.harga).toLocaleString('id-ID')}
                </option>
              ))}
            </select>
            {availableRooms.length === 0 && (
              <p className="text-xs text-red-400 italic font-medium">* Tidak ada kamar tersedia</p>
            )}
          </div>

          {/* Konfirmasi */}
          <button
            onClick={handleConfirmClick}
            disabled={!selectedRoomId || !selectedPayment || isProcessing}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
              !selectedRoomId || !selectedPayment || isProcessing
              ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
              : 'bg-[#ff6b3d] text-white hover:bg-[#e85a2c] active:scale-[0.98]'
            }`}
          >
            {isProcessing ? 'Memproses...' : 'Konfirmasi Pembayaran'}
          </button>
        </div>
      </div>
    </div>
  );
};