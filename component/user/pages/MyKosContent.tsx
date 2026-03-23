'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import UserSectionTitle from '@/component/shared/UserSectionTitle';
import { useAppSelector } from '@/core/store/hooks';
import { useKos } from '@/core/hooks/useKos';
import { usePayments } from '@/core/hooks/usePayments';

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
	return <div className={`glass-card rounded-[18px] border border-[#e1c2b7] shadow-[0_10px_24px_rgba(15,23,42,0.05)] dark:border-slate-700/80 ${className}`}>{children}</div>;
}

function ContactOwner() {
	return (
		<Card className="flex min-h-[135px] flex-col items-center justify-center gap-3 p-5 text-center">
			<Image src="/Asset/icon/icon-chat3.svg" alt="Simbol chat" width={75} height={46} />
			<div className="text-[17px] font-semibold text-slate-900 dark:text-slate-100">Hubungi Pemilik</div>
		</Card>
	);
}

export default function MyKosContent() {
	const user = useAppSelector((state: any) => state.user.user);
	const { currentKos, roomsList, fetchCurrentKos, fetchRooms, isLoading: kosLoading } = useKos();
	const { payments, fetchPayments, isLoading: paymentsLoading } = usePayments();
	const [nextPayment, setNextPayment] = useState<any>(null);
	
	useEffect(() => {
		fetchCurrentKos();
		fetchRooms();
		fetchPayments();
	}, [fetchCurrentKos, fetchRooms, fetchPayments]);

	const activePayment = useMemo(() => {
		const userId = user?.id;
		const userPayments = (payments || []).filter((payment: any) => {
			if (!userId) return true;
			return String(payment.tenant) === String(userId);
		});

		return userPayments.sort((left: any, right: any) => {
			const leftDate = new Date(left.updated_at || left.created_at || 0).getTime();
			const rightDate = new Date(right.updated_at || right.created_at || 0).getTime();
			return rightDate - leftDate;
		})[0] || null;
	}, [payments, user?.id]);

	const derivedRoom = useMemo(() => {
		if (!activePayment?.rooms_id) return null;
		return roomsList.find((room: any) => String(room.id) === String(activePayment.rooms_id)) || null;
	}, [activePayment, roomsList]);

	const resolvedKos = currentKos || derivedRoom?.kos || null;
	const pageLoading = kosLoading || paymentsLoading;
	
	useEffect(() => {
		// Find the next unpaid invoice
		const unpaidPayment = (payments || []).find((payment: any) => String(payment.status || '').toUpperCase() === 'UNPAID' || String(payment.status || '').toLowerCase() === 'pending');
		setNextPayment(unpaidPayment || null);
	}, [payments]);
	
	if (pageLoading) {
		return (
			<div className="mx-auto flex max-w-[1180px] flex-col gap-5">
				<UserSectionTitle title="Kos Saya" />
				<p className="text-center text-slate-500">Memuat data...</p>
			</div>
		);
	}
	
	if (!resolvedKos) {
		return (
			<div className="mx-auto flex max-w-[1180px] flex-col gap-5">
				<UserSectionTitle title="Kos Saya" />
				<p className="text-center text-slate-500">Anda belum menyewa kos apapun</p>
			</div>
		);
	}
	
	const roomImages = (resolvedKos as any).foto?.split(',') || (resolvedKos as any).images || ['/Asset/kamar/kamar1.svg'];
	const kosName = (resolvedKos as any).nama || (resolvedKos as any).name || 'Kos Saya';
	const roomNumber = derivedRoom?.nomor_kamar || derivedRoom?.nomorKamar || (activePayment as any)?.rooms_id || 'N/A';
	const moveInDate = (resolvedKos as any).tanggal_masuk || (resolvedKos as any).tanggalMasuk || (resolvedKos as any).created_at || 'Belum ditentukan';
	const paymentDate = nextPayment?.tanggal_bayar || nextPayment?.tanggalBayar || null;
	const paymentAmount = nextPayment?.nominal || 0;
	
	return (
		<div className="mx-auto flex max-w-[1180px] flex-col gap-5">
			<UserSectionTitle title="Kos Saya" />

			<Card className="overflow-hidden">
				<div className="grid grid-cols-3 gap-0">
					{roomImages.slice(0, 3).map((src: string, index: number) => (
						<div key={`${src}-${index}`} className="relative h-[112px] sm:h-[132px]">
						<Image src={src || '/Asset/kamar/kamar1.svg'} alt={`Kos preview ${index + 1}`} fill className="object-cover" />
						</div>
					))}
				</div>

				<div className="space-y-2 px-5 py-4 sm:px-6 sm:py-5">
					<h3 className="text-[18px] font-semibold text-slate-900 dark:text-slate-100">
						{kosName} - Kamar {roomNumber}
					</h3>
					<p className="text-[15px] leading-6 text-slate-600 dark:text-slate-300">
						{(resolvedKos as any).alamat}
					</p>
					<p className="pt-3 text-[15px] font-medium text-slate-500 dark:text-slate-300">
						Mulai tinggal: {moveInDate}
					</p>
				</div>
			</Card>

			<div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
				<ContactOwner />
				{nextPayment ? (
					<Card className="flex min-h-[135px] flex-col justify-between p-5 sm:p-6">
						<div className="flex items-start justify-between gap-4">
							<div>
								<h3 className="text-[18px] font-semibold text-slate-900 dark:text-slate-100">
									Status pembayaran: {String(nextPayment.status || 'UNKNOWN')}
								</h3>
								<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
									Tanggal bayar: {paymentDate ? new Date(paymentDate).toLocaleDateString('id-ID') : 'Belum dibayar'}
								</p>
								<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
									Metode: {nextPayment.jenis_pembayaran || 'Belum tersedia'}
								</p>
							</div>
							<div className="text-[22px] font-semibold text-[#c35f46] dark:text-[#f0b2a7]">
								Rp {paymentAmount.toLocaleString('id-ID')}
							</div>
						</div>
						<button className="mt-6 rounded-md bg-[#ec8a3d] py-3 text-[15px] font-semibold text-white shadow-[0_8px_18px_rgba(236,138,61,0.25)] transition hover:bg-[#df7b2e] dark:text-slate-950">
							Bayar Sekarang
						</button>
					</Card>
				) : (
					<Card className="flex min-h-[135px] flex-col items-center justify-center gap-3 p-5 text-center">
						<p className="text-[17px] font-semibold text-slate-900 dark:text-slate-100">Pembayaran Terbaru</p>
						<p className="text-sm text-slate-500 dark:text-slate-400">Semua pembayaran Anda terkini</p>
					</Card>
				)}
			</div>
		</div>
	);
}
