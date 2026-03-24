'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MessageCircle, X } from 'lucide-react';
import PaymentModal from './PaymentModal';
import { useAppSelector } from '@/core/store/hooks';

interface KosDetailPageProps {
	kos: {
		id: string;
		name?: string;
		nama?: string;
		location?: string;
		alamat?: string;
		price?: string;
		harga: number;
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
			email?: string;
			no_hp?: string;
		} | null;
	};
	owner?: {
		id?: number | string;
		name?: string;
		avatar?: string;
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

// Helper function to capitalize facility names
const capitalizeFacility = (text: string): string => {
	return text
		.replace(/([A-Z])/g, ' $1')
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ')
		.trim();
};

export default function KosDetailPage({ kos, owner, onBack }: KosDetailPageProps) {
	const user = useAppSelector((state: any) => state.user.user);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [selectedDate, setSelectedDate] = useState('');
	const [selectedDuration, setSelectedDuration] = useState('1');
	const [paymentModalOpen, setPaymentModalOpen] = useState(false);
	const [showContactModal, setShowContactModal] = useState(false);
	const [availableRooms, setAvailableRooms] = useState<Array<{id:string|number; nomor_kamar?:string;}>>([]);
	const [loadingRooms, setLoadingRooms] = useState(false);
	const [bookingData, setBookingData] = useState<{
		kosName: string;
		kosNumber: string;
		price: number;
		totalPrice: number;
		startDate: string;
		duration: number;
		roomsId?: string;
	} | null>(null);
	const [isProcessingPayment, setIsProcessingPayment] = useState(false);

	const handleNext = () => {
		setCurrentImageIndex((prev) => (prev + 1) % kos.images.length);
	};

	const handlePrev = () => {
		setCurrentImageIndex((prev) => (prev - 1 + kos.images.length) % kos.images.length);
	};

	const handleBook = () => {
		if (selectedDate && selectedDuration) {
			const pricePerMonth = Number(kos.harga) || 0;
			const duration = parseInt(selectedDuration);
			const totalPrice = pricePerMonth * duration;
			
			setBookingData({
				kosName: kos.name || kos.nama || 'Kos',
				kosNumber: kos.id,
				price: pricePerMonth,
				totalPrice: totalPrice,
				startDate: selectedDate,
				duration: duration,
				roomsId: '', // Will be selected in payment modal
			});
			setPaymentModalOpen(true);
		}
	};

	const kosName = kos.name || kos.nama || 'Kos';
	const kosLocation = kos.location || kos.alamat || '-';
	const kosPrice = kos.price || (kos.harga ? `Rp ${Number(kos.harga).toLocaleString('id-ID')}` : 'Harga belum tersedia');
	const resolvedOwnerName = kos.owner?.name || kos.owner?.nama || owner?.name || 'Nama pemilik belum tersedia';
	const generalFacilities = kos.facilities?.umum || [];
	const roomFacilities = kos.facilities?.kamar || [];

	const fetchRoomsForKos = async () => {
		if (!kos.id) return;

		setLoadingRooms(true);
		try {
			const response = await fetch(`/api/kos/${kos.id}/rooms`);
			if (!response.ok) throw new Error('Gagal load rooms');
			const body = await response.json();
			// Assuming response format { data: [...] }
			setAvailableRooms(Array.isArray(body.data) ? body.data : []);
		} catch (error) {
			console.error('fetchRoomsForKos error: ', error);
			setAvailableRooms([]);
		} finally {
			setLoadingRooms(false);
		}
	};

	useEffect(() => {
		if (paymentModalOpen) {
			fetchRoomsForKos();
		}
	}, [paymentModalOpen, kos.id]);

	// DEBUG
	console.log('KosDetailPage - owner data:', {
		kosOwner: kos.owner,
		propOwner: owner,
		resolvedName: resolvedOwnerName,
	});

	return (
		<div className="min-h-screen bg-white dark:bg-slate-950">
			{/* Header with Back Button */}
			<div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-900">
				<button
					onClick={onBack}
					className="flex items-center gap-2 rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
				>
					<X size={24} />
				</button>
				<h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Detail Kos</h2>
				<div className="w-10" /> {/* Spacer for alignment */}
			</div>

			{/* Image Carousel */}
			<div className="relative h-96 w-full bg-slate-200 dark:bg-slate-800">
				<Image
					src={kos.images[currentImageIndex] || '/Asset/kamar/kamar1.svg'}
					alt={kosName || 'Kos image'}
					fill
					className="object-cover"
				/>

				{/* Navigation Buttons */}
				{kos.images.length > 1 && (
					<>
						<button
							onClick={handlePrev}
							className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800"
						>
							<ChevronLeft size={24} />
						</button>
						<button
							onClick={handleNext}
							className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800"
						>
							<ChevronRight size={24} />
						</button>

						{/* Image indicators */}
						<div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
							{kos.images.map((_, index) => (
								<button
									key={index}
									onClick={() => setCurrentImageIndex(index)}
									className={`h-2 rounded-full transition ${
										index === currentImageIndex
											? 'w-8 bg-[#c86654]'
											: 'w-2 bg-white/60'
									}`}
								/>
							))}
						</div>
					</>
				)}

				{/* Thumbnail Images */}
				<div className="absolute bottom-0 left-0 right-0 flex gap-2 bg-gradient-to-t from-black/40 to-transparent px-4 pb-4 pt-12">
					{kos.images.map((image, index) => (
						<button
							key={index}
							onClick={() => setCurrentImageIndex(index)}
							className={`relative h-16 w-20 overflow-hidden rounded-lg border-2 transition ${
								index === currentImageIndex
									? 'border-[#c86654]'
									: 'border-transparent hover:border-white/50'
							}`}
						>
							<Image
								src={image || '/Asset/kamar/kamar1.svg'}
								alt={`thumbnail-${index}`}
								fill
								className="object-cover"
							/>
						</button>
					))}
				</div>
			</div>

			{/* Main Content */}
			<div className="space-y-6 px-6 py-8">
				{/* Header Info */}
				<div className="space-y-2">
					<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{kosName}</h1>
					<p className="text-sm text-slate-600 dark:text-slate-400">{kosLocation}</p>
					<div className="flex items-baseline gap-2">
						<span className="text-3xl font-bold text-[#c86654]">{kosPrice}</span>
						<span className="text-sm text-slate-600 dark:text-slate-400">{kos.period}</span>
					</div>
				</div>

				{/* Content Grid - 3 Columns */}
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
					{/* Left Column - Rules */}
					<div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800">
						<h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
							Peraturan Kos
						</h3>
						{kos.rules.length > 0 ? (
							<ul className="space-y-3">
								{kos.rules.map((rule, index) => (
									<li
										key={index}
										className="flex gap-3 text-sm text-slate-700 dark:text-slate-300"
									>
										<span className="mt-0.5 flex-shrink-0">•</span>
										<span>{rule}</span>
									</li>
								))}
							</ul>
						) : (
							<p className="text-sm text-slate-500 dark:text-slate-400">Peraturan kos belum tersedia</p>
						)}
					</div>

					{/* Middle Column - Facilities */}
					<div className="space-y-6">
						{/* Fasilitas Umum */}
						<div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800">
							<h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
								Fasilitas Umum
							</h3>
							<div className="grid grid-cols-3 gap-3">
								{generalFacilities.length > 0 ? generalFacilities.map((facility) => (
									<div
										key={facility}
										className="flex h-24 w-full flex-col items-center justify-center gap-1.5 rounded-xl bg-white p-3 dark:bg-slate-700"
									>
										<div className="flex items-center justify-center">
											<Image
												src={facilityIcons[facility] || '/Asset/icon/icon-apartment.svg'}
												alt={facility}
												width={28}
												height={28}
											/>
										</div>
										<span className="w-full text-center text-xs font-medium text-slate-700 dark:text-slate-300 px-0.5">
											{capitalizeFacility(facility)}
										</span>
									</div>
							)) : (
								<p className="col-span-3 text-sm text-slate-500 dark:text-slate-400">Fasilitas umum belum tersedia</p>
							)}
							</div>
						</div>

						{/* Fasilitas Kamar */}
						<div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800">
							<h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
								Fasilitas Kamar
							</h3>
							<div className="grid grid-cols-3 gap-3">
								{roomFacilities.length > 0 ? roomFacilities.map((facility) => (
									<div
										key={facility}
										className="flex h-24 w-full flex-col items-center justify-center gap-1.5 rounded-xl bg-white p-3 dark:bg-slate-700"
									>
										<div className="flex items-center justify-center">
											<Image
												src={facilityIcons[facility] || '/Asset/icon/icon-bed.svg'}
												alt={facility}
												width={28}
												height={28}
											/>
										</div>
										<span className="w-full text-center text-xs font-medium text-slate-700 dark:text-slate-300 px-0.5">
											{capitalizeFacility(facility)}
										</span>
									</div>
							)) : (
								<p className="col-span-3 text-sm text-slate-500 dark:text-slate-400">Fasilitas kamar belum tersedia</p>
							)}
							</div>
						</div>
					</div>

					{/* Right Column - Owner Card & Booking */}
					<div className="space-y-4">
						{/* Owner Card */}
						<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
							<div className="mb-6 space-y-4">
								<div className="flex items-center gap-4">
									<div className=" relative mt-2 h-20 w-15 overflow-hidden">
										<Image
											src={owner?.avatar || '/Asset/icon/icon-person.svg'}
												alt={resolvedOwnerName}
											fill
											className="object-cover"
										/>
									</div>
									<div>
										<p className="text-sm text-slate-600 dark:text-slate-400">Pemilik Kos</p>
										<h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
											{resolvedOwnerName}
										</h4>
									</div>
								</div>
							</div>

							{/* Contact Button */}
						<button 
							onClick={() => setShowContactModal(true)}
							className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">
								Contact Owner
							</button>

							{/* Booking Info */}
							<div className="mb-4 space-y-3 border-b border-slate-200 pb-4 dark:border-slate-700">
								<div>
									<label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
										Tanggal Mulai Pesan
									</label>
									<div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 dark:border-slate-600 dark:bg-slate-700">
										<Image
											src="/Asset/icon/icon-calendar.svg"
											alt="Calendar"
											width={18}
											height={18}
										/>
										<input
											type="date"
											value={selectedDate}
											onChange={(e) => setSelectedDate(e.target.value)}
											className="w-full bg-transparent text-sm text-slate-900 outline-none dark:text-slate-100"
										/>
									</div>
								</div>

								<div>
									<label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
										Durasi Pemesanan (Bulan)
									</label>
									<div className="mt-2 grid grid-cols-4 gap-2">
										{['1', '3', '6', '12'].map((duration) => (
											<button
												key={duration}
												onClick={() => setSelectedDuration(duration)}
												className={`rounded-lg px-2 py-2 text-xs font-semibold transition ${
													selectedDuration === duration
														? 'bg-[#c86654] text-white'
														: 'border border-slate-300 text-slate-900 hover:border-[#c86654] dark:border-slate-600 dark:text-slate-100'
												}`}
											>
												{duration}
											</button>
										))}
									</div>
								</div>
							</div>

							{/* Pesan Button */}
							<button
								onClick={handleBook}
								disabled={!selectedDate || !selectedDuration}
								className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff6b3d] px-4 py-3 font-semibold text-white transition hover:bg-[#e85a2f] disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<Image src="/Asset/icon/icon-calendar.svg" alt="Calendar" width={20} height={20} />
								Pesan Sekarang
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Payment Modal */}
			{bookingData && (
				<PaymentModal
					isOpen={paymentModalOpen}
					booking={bookingData}
					availableRooms={availableRooms}
					onClose={() => {
						setPaymentModalOpen(false);
						setBookingData(null);
					}}
					onBack={() => {
						setPaymentModalOpen(false);
					}}
					onConfirm={async (data) => {
						try {
							setIsProcessingPayment(true);
							console.log('Payment confirmation:', data);

							// 1. Save payment record
							const paymentPayload = {
								rooms_id: data.roomsId,
								tenant: user?.name || 'User',
								jenis_pembayaran: 'bulanan',
								voucher_id: null,
								amount: data.amount,
								payment_method: data.paymentMethod,
								start_date: bookingData.startDate,
								duration: bookingData.duration,
							};

							console.log('Saving payment with payload:', paymentPayload);
							const paymentResponse = await fetch('/api/payments', {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify(paymentPayload),
							});

							if (!paymentResponse.ok) {
								throw new Error('Gagal menyimpan pembayaran');
							}

							const paymentData = await paymentResponse.json();
							const paymentId = paymentData?.data?.[0]?.id || paymentData?.id;

							if (!paymentId) {
								throw new Error('Payment ID tidak ditemukan dari response');
							}

							console.log('Payment saved with ID:', paymentId);

							// 2. Check room capacity
							const roomsCheckResponse = await fetch(`/api/kos/${kos.id}/rooms`);
							if (!roomsCheckResponse.ok) {
								throw new Error('Gagal mengecek data kamar');
							}

							const roomsData = await roomsCheckResponse.json();
							const totalRooms = roomsData?.data?.length || 0;
							const bookedRooms = roomsData?.data?.filter((r: any) => r.status === 'booked' || r.status === 'occupied')?.length || 0;

							console.log(`Total rooms: ${totalRooms}, Booked: ${bookedRooms}`);

							// 3. Update payment status
							const updatePaymentResponse = await fetch(`/api/payments/${paymentId}/pay`, {
								method: 'PATCH',
								headers: { 'Content-Type': 'application/json' },
							});

							if (!updatePaymentResponse.ok) {
								throw new Error('Gagal mengupdate status pembayaran');
							}

							// 4. Check if full and show notification
							if (bookedRooms >= totalRooms) {
								alert('⚠️ Kamar sudah penuh!');
							} else {
								alert('✅ Pembayaran berhasil! Kamar masih tersedia.');
							}

							// Close modal
							setPaymentModalOpen(false);
							setBookingData(null);
						} catch (error) {
							console.error('Payment error:', error);
							alert(`❌ Error: ${error instanceof Error ? error.message : 'Terjadi kesalahan'}`);
						} finally {
							setIsProcessingPayment(false);
						}
					}}
				/>
			)}

			{/* Contact Owner Modal */}
			{showContactModal && (
				<div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
					<div className="flex min-h-screen items-center justify-center p-4">
						<div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
							<div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
								<h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Hubungi Pemilik</h2>
								<button
									onClick={() => setShowContactModal(false)}
									className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
								>
									<X size={24} />
								</button>
							</div>

							<div className="space-y-6 p-6">
								<div className="flex flex-col items-center gap-4">
									<div className="relative h-20 w-20 overflow-hidden rounded-full">
										<Image
											src={owner?.avatar || '/Asset/icon/icon-person.svg'}
											alt={resolvedOwnerName}
											fill
											className="object-cover"
										/>
									</div>
									<div className="text-center">
										<h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{resolvedOwnerName}</h3>
										<p className="text-sm text-slate-500 dark:text-slate-400">Pemilik Kos</p>
									</div>
								</div>

								<div className="space-y-3">
									<button
										onClick={() => {
											console.log('Open chat with', resolvedOwnerName);
											setShowContactModal(false);
											// TODO: Navigate to chat with owner
										}}
										className="w-full rounded-lg bg-[#c86654] px-4 py-3 font-semibold text-white transition hover:bg-[#b85d47]"
									>
										Buka Chat
									</button>
									<button
										onClick={() => {
											console.log('Call owner');
											// TODO: Implement call functionality
										}}
										className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
									>
										Hubungi via WhatsApp
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
