'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import UserSectionTitle from '@/component/shared/UserSectionTitle';
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
	const { currentKos, fetchCurrentKos, isLoading } = useKos();
	const { invoices } = usePayments();
	const [nextPayment, setNextPayment] = useState<any>(null);
	
	useEffect(() => {
		fetchCurrentKos();
	}, [fetchCurrentKos]);
	
	useEffect(() => {
		// Find the next unpaid invoice
		const unpaidInvoice = invoices?.find((inv: any) => inv.status !== 'paid');
		setNextPayment(unpaidInvoice);
	}, [invoices]);
	
	if (isLoading) {
		return (
			<div className="mx-auto flex max-w-[1180px] flex-col gap-5">
				<UserSectionTitle title="Kos Saya" />
				<p className="text-center text-slate-500">Memuat data...</p>
			</div>
		);
	}
	
	if (!currentKos) {
		return (
			<div className="mx-auto flex max-w-[1180px] flex-col gap-5">
				<UserSectionTitle title="Kos Saya" />
				<p className="text-center text-slate-500">Anda belum menyewa kos apapun</p>
			</div>
		);
	}
	
	const roomImages = (currentKos as any).kamarFoto?.split(',') || ['/Asset/kamar/kamar1.svg'];
	
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
						{(currentKos as any).name} - Kamar {(currentKos as any).nomorKamar || 'N/A'}
					</h3>
					<p className="text-[15px] leading-6 text-slate-600 dark:text-slate-300">
						{(currentKos as any).alamat}
					</p>
					<p className="pt-3 text-[15px] font-medium text-slate-500 dark:text-slate-300">
						Mulai tinggal: {(currentKos as any).tanggalMasuk || 'Belum ditentukan'}
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
									Jatuh tempo bulan {new Date(nextPayment.due_date).toLocaleString('id-ID', { month: 'long' })}
								</h3>
								<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
									Jatuh tempo dalam {Math.max(0, Math.ceil((new Date(nextPayment.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} hari
								</p>
							</div>
							<div className="text-[22px] font-semibold text-[#c35f46] dark:text-[#f0b2a7]">
								Rp {nextPayment.total_amount?.toLocaleString('id-ID') || '0'}
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
