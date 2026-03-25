'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, X } from 'lucide-react';

interface RoomOption {
	id: number | string;
	nomor_kamar?: string;
	harga?: number;
}

interface PaymentModalProps {
	isOpen: boolean;
	booking: {
		kosName: string;
		kosNumber: string;
		price: number;
		totalPrice: number;
		startDate: string;
		duration: number;
	};
	availableRooms: RoomOption[];
	onClose: () => void;
	onBack: () => void;
	onConfirm: (data: { paymentMethod: string; roomsId: string; amount: number }) => void;
}

interface PaymentMethod {
	id: string;
	name: string;
	icon?: string;
	iconSize?: number;
	logo?: string;
	text?: string;
	logoSize?: number;
	textSize?: number;
}

const paymentMethods: PaymentMethod[] = [
	{ id: 'ovo', name: 'OVO', icon: '/Asset/ovo.svg', iconSize: 60 },
	{ id: 'qris', name: 'QRIS', icon: '/Asset/qris.svg', iconSize: 60 },
	{ id: 'transfer', name: 'Transfer Bank', icon: '/Asset/icon/icon-transfer.svg', iconSize: 24 },
	{ id: 'gopay', name: 'GoPay', logo: '/Asset/gopay-logo.svg', text: '/Asset/gopay-teks.svg', logoSize: 25, textSize: 70 },
];

export default function PaymentModal({ isOpen, booking, availableRooms, onClose, onBack, onConfirm }: PaymentModalProps) {
	const [selectedPayment, setSelectedPayment] = useState<string>('');
	const [selectedRoomId, setSelectedRoomId] = useState<string>('');
	const [isProcessing, setIsProcessing] = useState(false);
	const [promoCode, setPromoCode] = useState('');

	if (!isOpen) return null;

	const handleConfirm = async () => {
		if (selectedPayment && selectedRoomId) {
			setIsProcessing(true);

			// Cari data kamar yang dipilih untuk mendapatkan harga spesifik kamar itu
			const selectedRoom = availableRooms.find(r => String(r.id) === selectedRoomId);
			const finalPrice = selectedRoom?.harga ? Number(selectedRoom.harga) * booking.duration : booking.totalPrice;

			setTimeout(() => {
				onConfirm({
					paymentMethod: selectedPayment,
					roomsId: selectedRoomId,
					amount: finalPrice, // Mengirim harga yang sesuai kamar dipilih
				});
				setIsProcessing(false);
			}, 1000);
		}
	};

	const priceFormatted = `Rp ${Number(booking.price).toLocaleString('id-ID')}`;
	const totalPriceFormatted = `Rp ${Number(booking.totalPrice).toLocaleString('id-ID')}`;

	return (
		<div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
			<div className="flex min-h-screen items-center justify-center p-4">
				<div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
					{/* Header */}
					<div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
						<button
							onClick={onBack}
							className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
						>
							<ChevronLeft size={24} />
						</button>
						<h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Pembayaran</h2>
						<button
							onClick={onClose}
							className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
						>
							<X size={24} />
						</button>
					</div>

					<div className="space-y-6 p-6">
						{/* Booking Summary */}
						<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
							<div className="space-y-3">
								<div>
									<p className="text-xs text-slate-600 dark:text-slate-400">Kos {booking.kosNumber}</p>
									<p className="font-semibold text-slate-900 dark:text-slate-100">{booking.kosName}</p>
								</div>

								<div className="flex items-end justify-between">
									<div>
										<p className="text-xs text-slate-600 dark:text-slate-400">Durasi</p>
										<p className="font-semibold text-slate-900 dark:text-slate-100">{booking.duration} Bulan</p>
									</div>
									<div className="text-right">
										<p className="text-xs text-slate-600 dark:text-slate-400">Total Harga</p>
										<p className="text-2xl font-bold text-[#c86654]">{totalPriceFormatted}</p>
									</div>
								</div>
							</div>
						</div>

						{/* Payment Methods */}
						<div className="space-y-3">
							<h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Pilih Metode Pembayaran</h3>

							<div className="grid grid-cols-2 gap-3">
								{paymentMethods.map((method) => (
									<button
										key={method.id}
										onClick={() => setSelectedPayment(method.id)}
										className={`rounded-xl border-2 px-4 py-6 transition ${selectedPayment === method.id
												? 'border-[#c86654] bg-[#fff5f0] dark:bg-slate-800'
												: 'border-slate-200 hover:border-[#c86654] dark:border-slate-700 dark:hover:border-[#c86654]'
											}`}
									>
										<div
											className={`flex items-center justify-center gap-2 ${method.id === 'transfer' ? 'flex-row' : 'flex-col'
												}`}
										>
											{method.id === 'gopay' ? (
												<div className="flex flex-row items-center justify-center gap-2">
													<Image
														src={method.logo!}
														alt="GoPay Logo"
														width={method.logoSize!}
														height={method.logoSize!}
													/>
													<Image
														src={method.text!}
														alt="GoPay Text"
														width={method.textSize!}
														height={method.textSize!}
														className="dark:brightness-0 dark:invert"
													/>
												</div>
											) : (
												<Image
													src={method.icon!}
													alt={method.name}
													width={method.iconSize!}
													height={method.iconSize!}
													className={`${method.id === 'qris' || method.id === 'transfer'
															? 'dark:brightness-0 dark:invert'
															: 'dark:brightness-150'
														}`}
												/>
											)}
											{method.id === 'transfer' && (
												<span className="text-sm font-medium text-slate-900 dark:text-slate-100">
													{method.name}
												</span>
											)}
										</div>
									</button>
								))}
							</div>
						</div>

						{/* Room ID Selection */}
						<div className="space-y-2">
							<label className="text-xs font-semibold text-slate-700 dark:text-slate-300">ID Kamar (Room ID)</label>
							<select
								value={selectedRoomId}
								onChange={(e) => setSelectedRoomId(e.target.value)}
								className="..."
							>
								<option value="">Pilih nomor kamar</option>
								{availableRooms.map((room: any) => (
									<option key={room.id} value={String(room.id)}>
										Kamar {room.nomor_kamar} - Rp {Number(room.harga).toLocaleString('id-ID')}
									</option>
								))}
							</select>
							{availableRooms.length === 0 && (
								<p className="text-xs text-red-500">Tidak ada kamar tersedia. Silakan hubungi owner.</p>
							)}
						</div>

						{/* Promo Code Section (Optional) */}
						<div className="space-y-2">
							<label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Kode Promo (Opsional)</label>
							<div className="flex gap-2">
								<input
									type="text"
									placeholder="Masukkan kode promo"
									value={promoCode}
									onChange={(e) => setPromoCode(e.target.value)}
									className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-[#c86654] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
								/>
								<button
									onClick={() => {
										if (promoCode.trim()) {
											console.log('Applying promo code:', promoCode);
										}
									}}
									className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
								>
									Terapkan
								</button>
							</div>
						</div>

						{/* Price Breakdown */}
						<div className="space-y-2 border-t border-slate-200 pt-4 dark:border-slate-700">
							<div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
								<span>Harga per Bulan</span>
								<span>{priceFormatted}</span>
							</div>
							<div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
								<span>Durasi ({booking.duration} Bulan)</span>
								<span>x {booking.duration}</span>
							</div>
							<div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
								<span>Biaya Admin</span>
								<span>Rp 0</span>
							</div>
							<div className="flex justify-between pt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
								<span>Total Pembayaran</span>
								<span>{totalPriceFormatted}</span>
							</div>
						</div>

						{/* Confirm Button */}
						<button
							onClick={handleConfirm}
							disabled={!selectedPayment || !selectedRoomId || isProcessing || availableRooms.length === 0}
							className="w-full rounded-xl bg-[#c86654] px-6 py-3 font-semibold text-white transition hover:bg-[#b85d47] disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isProcessing ? 'Memproses...' : 'Bayar Sekarang'}
						</button>

						<p className="text-center text-xs text-slate-500 dark:text-slate-400">Dengan melanjutkan, Anda menyetujui syarat dan ketentuan kami.</p>
					</div>
				</div>
			</div>
		</div>
	);
}
