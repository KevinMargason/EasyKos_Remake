'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Plus, Edit3, History } from 'lucide-react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { ROUTES } from '@/lib/routes';
import { useKos } from '@/core/hooks/useKos';
import { usePayments } from '@/core/hooks/usePayments';
import AddRoomPage from './management/AddRoomPage';
import UpdateStatusPage from './management/UpdateStatusPage';
import ResidentHistoryPage from './management/ResidentHistoryPage';

export default function OwnerManagementContent() {
	const [activeMenu, setActiveMenu] = useState<'home' | 'add-room' | 'update-status' | 'resident-history'>('home');
	const { kosList, roomsList, fetchKos, fetchRooms } = useKos();
	const { invoices, fetchPayments } = usePayments();
	const [isLoading, setIsLoading] = useState(true);

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);
			await Promise.all([fetchKos(), fetchRooms(), fetchPayments()]);
		} finally {
			setIsLoading(false);
		}
	}, [fetchKos, fetchRooms, fetchPayments]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	type AmenityKey = 'wifi' | 'cctv' | 'kulkas' | 'laundry' | 'ruangTamu' | 'dapur' | 'lemari' | 'meja' | 'kursi' | 'kasur' | 'kamarMandiDalam' | 'kamarMandiLuar' | 'tambah';

	const amenitiesIcons: Record<AmenityKey, { icon: string; label: string }> = {
		wifi: { icon: '/Asset/icon/icon-wifi.svg', label: 'Wifi' },
		cctv: { icon: '/Asset/icon/icon-cctv.svg', label: 'CCTV' },
		kulkas: { icon: '/Asset/icon/icon-fridge.svg', label: 'Kulkas' },
		laundry: { icon: '/Asset/icon/icon-laundry.svg', label: 'Laundry' },
		ruangTamu: { icon: '/Asset/icon/icon-sofa.svg', label: 'Ruang Tamu' },
		dapur: { icon: '/Asset/icon/icon-kitchen-set.svg', label: 'Dapur' },
		lemari: { icon: '/Asset/icon/icon-wardrobe.svg', label: 'Lemari' },
		meja: { icon: '/Asset/icon/icon-table.svg', label: 'Meja' },
		kursi: { icon: '/Asset/icon/icon-chair.svg', label: 'Kursi' },
		kasur: { icon: '/Asset/icon/icon-bed.svg', label: 'Kasur' },
		kamarMandiDalam: { icon: '/Asset/icon/icon-bathroom.svg', label: 'Kamar Mandi Dalam' },
		kamarMandiLuar: { icon: '/Asset/icon/icon-bathroom.svg', label: 'Kamar Mandi Luar' },
		tambah: { icon: '/Asset/icon/icon-add.svg', label: 'Tambah' },
	};

	// Calculate statistics from real data
	const { paymentWarnings, roomStats, kosOptions, roomOptions } = useMemo(() => {
		// Get unpaid payments for warnings
		const warnings = invoices
			?.filter((inv: any) => inv.status === 'UNPAID' || inv.status === 'pending')
			.slice(0, 3)
			.map((inv: any) => ({
				name: inv.invoice_number ? `Invoice #${inv.invoice_number}` : `Payment #${inv.id}`,
				detail: `Room ${inv.rooms_id || '-'} • ${inv.jenis_pembayaran || 'bulanan'}`,
				status: 'Chat'
			})) || [];

		// Calculate room statistics
		const totalRooms = roomsList.length || kosList.reduce((sum: number, kos: any) => sum + (kos.jumlah_kamar || 0), 0);
		const occupiedRooms = roomsList.filter((room: any) => room.users_id).length;
		const availableRooms = Math.max(totalRooms - occupiedRooms, 0);

		const stats = [
			{ label: 'Total Kamar', value: totalRooms.toString() },
			{ label: 'Tersedia', value: availableRooms.toString() },
			{ label: 'Terisi', value: occupiedRooms.toString() },
		];

		const kosListForDropdown = kosList.map((kos: any) => ({
			label: kos.nama || kos.name || `Kos ${kos.id}`,
			value: String(kos.id),
		}));

		const roomListForDropdown = roomsList.map((room: any) => ({
			label: `${room.kos?.nama || room.kos?.name || `Kos ${room.kos_id}`} - ${room.nomor_kamar || room.nomor || room.id}`,
			value: String(room.id),
			kosId: String(room.kos_id),
		}));

		return {
			paymentWarnings: warnings,
			roomStats: stats,
			kosOptions: kosListForDropdown,
			roomOptions: roomListForDropdown,
		};
	}, [kosList, roomsList, invoices]);

	if (isLoading) {
		return (
			<div className="mx-auto flex max-w-[1180px] flex-col gap-6">
				<div className="animate-pulse space-y-4">
					<div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
					<div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto flex max-w-[1180px] flex-col gap-6">
			<h1 className="text-[26px] font-semibold text-slate-900 dark:text-slate-100">Manajemen Properti</h1>

			{activeMenu === 'home' ? (
				<>
					<div className="grid gap-5 md:grid-cols-2">
						<article className="relative overflow-hidden rounded-[24px] bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.08)] ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/5">
							<div className="absolute right-4 top-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fef8f6] shadow-[0_10px_20px_rgba(15,23,42,0.08)] ring-1 ring-black/5 dark:bg-slate-800">
								<Image src="/Asset/icon/icon-chart.svg" alt="Ikon grafik" width={34} height={34} />
							</div>
							<div className="max-w-[360px]">
								<h2 className="text-[28px] font-bold leading-tight text-[#c86654]">Peringatan Pembayaran</h2>
								<p className="mt-3 text-[14px] font-medium text-slate-500 dark:text-slate-400">
									{paymentWarnings.length > 0 
										? `Terdapat ${paymentWarnings.length} kamar yang belum membayar` 
										: 'Semua pembayaran sudah lunas'}
								</p>
							</div>

							<div className="mt-6 space-y-4">
								{paymentWarnings.length > 0 ? (
									paymentWarnings.map((warning: any) => (
										<Link
											key={warning.name}
											href={ROUTES.OWNER.CHAT}
											className="flex items-center justify-between gap-4 rounded-[16px] transition hover:bg-[#fff9f7] dark:hover:bg-slate-800/60"
											aria-label={`Buka chat untuk ${warning.name}`}
										>
											<div>
												<div className="text-[18px] font-bold text-slate-900 dark:text-slate-100">{warning.name}</div>
												<div className="text-[14px] text-slate-500 dark:text-slate-400">{warning.detail}</div>
											</div>
											<div className="inline-flex items-center gap-2 rounded-full border border-[#f1ddd8] bg-white px-3 py-2 text-[12px] font-semibold text-[#c86654] shadow-[0_4px_10px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800">
												<Image src="/Asset/icon/icon-chat3.svg" alt="Ikon chat" width={14} height={14} />
												<span>{warning.status}</span>
											</div>
										</Link>
									))
								) : (
									<p className="text-center text-slate-500 py-4">Tidak ada pembayaran yang tertunda</p>
								)}
							</div>
						</article>

						<article className="relative overflow-hidden rounded-[24px] bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.08)] ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/5">
							<div className="absolute right-4 top-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fef8f6] shadow-[0_10px_20px_rgba(15,23,42,0.08)] ring-1 ring-black/5 dark:bg-slate-800">
								<Image src="/Asset/icon/icon-apartment.svg" alt="Ikon apartemen" width={34} height={34} />
							</div>
							<div className="max-w-[360px]">
								<h2 className="text-[28px] font-bold leading-tight text-[#c86654]">Manajemen Kosan</h2>
								<p className="mt-3 text-[14px] font-medium text-slate-500 dark:text-slate-400">Pantau total kamar yang Anda miliki</p>
							</div>

							<div className="mt-6 space-y-4">
								{roomStats.map((stat: any) => (
									<div key={stat.label} className="flex items-center justify-between gap-4">
										<div className="text-[18px] font-bold text-slate-900 dark:text-slate-100">{stat.label}</div>
										<div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#f1ddd8] bg-white text-[14px] font-semibold text-[#c86654] shadow-[0_4px_10px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800 dark:text-[#f0b2a7]">
											{stat.value}
										</div>
									</div>
								))}
							</div>
						</article>
					</div>

					{/* Manajemen Kos Section */}
					<section className="rounded-[24px] bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.08)] ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/5">
						<h2 className="text-[28px] font-bold text-[#c86654]">Manajemen Kos</h2>
						<div className="mt-6 grid gap-4 md:grid-cols-3">
							{/* Tambah Kamar Baru */}
							<button
								onClick={() => setActiveMenu('add-room')}
								className="glass-card group flex flex-col items-center gap-4 rounded-[18px] border border-[#e1c2b7] p-6 text-center transition hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(15,23,42,0.12)] dark:border-slate-700/80 dark:hover:shadow-[0_10px_24px_rgba(0,0,0,0.32)]"
							>
								<div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#fef8f6] ring-1 ring-[#e6b3a8] dark:bg-slate-800 dark:ring-slate-600">
									<Plus size={20} className="text-[#c86654]" />
								</div>
								<div>
									<h3 className="font-semibold text-slate-900 dark:text-slate-100">Tambah Kamar Baru</h3>
									<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Tambahkan kamar baru ke properti</p>
								</div>
							</button>

							{/* Perbarui Status Kamar */}
							<button
								onClick={() => setActiveMenu('update-status')}
								className="glass-card group flex flex-col items-center gap-4 rounded-[18px] border border-[#e1c2b7] p-6 text-center transition hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(15,23,42,0.12)] dark:border-slate-700/80 dark:hover:shadow-[0_10px_24px_rgba(0,0,0,0.32)]"
							>
								<div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#fef8f6] ring-1 ring-[#e6b3a8] dark:bg-slate-800 dark:ring-slate-600">
									<Edit3 size={20} className="text-[#c86654]" />
								</div>
								<div>
									<h3 className="font-semibold text-slate-900 dark:text-slate-100">Perbarui Status Kamar</h3>
									<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Ubah status ketersediaan kamar</p>
								</div>
							</button>

							{/* Riwayat Penghuni */}
							<button
								onClick={() => setActiveMenu('resident-history')}
								className="glass-card group flex flex-col items-center gap-4 rounded-[18px] border border-[#e1c2b7] p-6 text-center transition hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(15,23,42,0.12)] dark:border-slate-700/80 dark:hover:shadow-[0_10px_24px_rgba(0,0,0,0.32)]"
							>
								<div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#fef8f6] ring-1 ring-[#e6b3a8] dark:bg-slate-800 dark:ring-slate-600">
									<History size={20} className="text-[#c86654]" />
								</div>
								<div>
									<h3 className="font-semibold text-slate-900 dark:text-slate-100">Riwayat Penghuni</h3>
									<p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Kelola data penghuni kos</p>
								</div>
							</button>
						</div>
					</section>
				</>
			) : activeMenu === 'add-room' ? (
				<AddRoomPage onBack={() => setActiveMenu('home')} onSaved={loadData} amenitiesIcons={amenitiesIcons} />
			) : activeMenu === 'update-status' ? (
				<UpdateStatusPage onBack={() => setActiveMenu('home')} onSaved={loadData} kosList={kosOptions} roomsList={roomOptions} amenitiesIcons={amenitiesIcons} />
			) : (
				<ResidentHistoryPage onBack={() => setActiveMenu('home')} kosList={kosOptions} />
			)}
		</div>
	);
}
