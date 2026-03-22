'use client';

import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';

interface ResidentHistoryPageProps {
	onBack: () => void;
	kosList: string[];
}

export default function ResidentHistoryPage({ onBack, kosList }: ResidentHistoryPageProps) {
	const [statusFilter, setStatusFilter] = useState('semua');
	const residentData = [
		{ periode: '2025 (Jan-Feb)', nomor: '101', nama: 'Sharty', tanggalMasuk: '01/12/2023', tanggalKeluar: '03/01/2024', status: 'Selesai' },
		{ periode: '2025 (Jan-Feb)', nomor: '102', nama: 'Megan', tanggalMasuk: '01/01/2024', tanggalKeluar: '-', status: 'AKTIF' },
		{ periode: '2025 (Jan-Feb)', nomor: '103', nama: 'Putu', tanggalMasuk: '01/06/2023', tanggalKeluar: '-', status: 'AKTIF' },
		{ periode: '2025 (Jan-Feb)', nomor: '101', nama: 'Putu', tanggalMasuk: '01/01/2024', tanggalKeluar: '03/02/2024', status: 'Selesai' },
		{ periode: '2025 (Jan-Feb)', nomor: '101', nama: 'Putu', tanggalMasuk: '01/01/2024', tanggalKeluar: '03/02/2024', status: 'Selesai' },
		{ periode: '2025 (Jan-Feb)', nomor: '101', nama: 'Putu', tanggalMasuk: '01/01/2024', tanggalKeluar: '03/02/2024', status: 'Selesai' },
	];

	return (
		<div className="mx-auto w-full max-w-[1180px]">
			<button
				onClick={onBack}
				className="mb-6 flex items-center gap-2 text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
			>
				<ChevronLeft size={20} />
				<span>Kembali</span>
			</button>

			<div className="rounded-[24px] bg-white p-8 shadow-[0_14px_30px_rgba(15,23,42,0.08)] ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/5">
				<h2 className="text-[28px] font-bold text-[#c86654]">Riwayat Penghuni Kos</h2>

				<div className="mt-8 grid gap-4 lg:grid-cols-4">
					{/* Pilih Kamar */}
					<div>
						<h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">Pilih Kamar Kos</h3>
						<div className="space-y-2">
							<div className="relative">
								<input
									type="text"
									placeholder="Cari Kamar...."
									className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 transition focus:border-[#c86654] focus:outline-none focus:ring-1 focus:ring-[#c86654] dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
								/>
								<Image src="/Asset/icon/icon-search-home.svg" alt="search" width={20} height={20} className="absolute right-3 top-3.5" />
							</div>
							{kosList.map((kos) => (
								<button
									key={kos}
									className="w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-900 transition hover:border-[#c86654] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
								>
									{kos}
								</button>
							))}
						</div>
					</div>

					{/* Pencarian */}
					<div className="lg:col-span-3">
						<h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">Cari Nama Penghuni</h3>
						<div className="mb-6 flex gap-2">
							<div className="relative flex-1">
								<input
									type="text"
									placeholder="Cari Nama"
									className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 transition focus:border-[#c86654] focus:outline-none focus:ring-1 focus:ring-[#c86654] dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
								/>
								<Image src="/Asset/icon/icon-search-home.svg" alt="search" width={20} height={20} className="absolute right-3 top-3.5" />
							</div>

							<div className="flex gap-2">
								{['semua', 'selesai', 'aktif'].map((status) => (
									<button
										key={status}
										onClick={() => {
											setStatusFilter(status);
											console.log('Filter by status:', status);
										}}
										className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
											statusFilter === status
												? 'border-[#c86654] bg-[#fff5f0] text-[#c86654] dark:border-[#f0b2a7] dark:bg-slate-800 dark:text-[#f0b2a7]'
												: 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
										}`}
									>
										{status}
									</button>
								))}
							</div>
						</div>

						{/* Tabel */}
						<div className="overflow-x-auto">
							<table className="w-full border-collapse text-sm">
								<thead>
									<tr className="border-b border-slate-200 dark:border-slate-700">
										<th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">PERIODE</th>
										<th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">NOMOR KAMAR</th>
										<th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">NAMA PENGHUNI</th>
										<th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">TANGGAL MASUK</th>
										<th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">TANGGAL KELUAR</th>
										<th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">STATUS</th>
									</tr>
								</thead>
								<tbody>
									{residentData.map((resident, idx) => (
										<tr key={idx} className="border-b border-slate-200 dark:border-slate-700">
											<td className="px-4 py-3 text-slate-700 dark:text-slate-400">{resident.periode}</td>
											<td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{resident.nomor}</td>
											<td className="px-4 py-3 text-slate-700 dark:text-slate-400">{resident.nama}</td>
											<td className="px-4 py-3 text-slate-700 dark:text-slate-400">{resident.tanggalMasuk}</td>
											<td className="px-4 py-3 text-slate-700 dark:text-slate-400">{resident.tanggalKeluar}</td>
											<td className="px-4 py-3">
												<span
													className={`rounded px-3 py-1 text-xs font-semibold ${
														resident.status === 'AKTIF'
															? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
															: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
													}`}
												>
													{resident.status}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>

				<div className="mt-8">
					<button
						onClick={onBack}
						className="w-full rounded-lg bg-[#c86654] py-3 font-semibold text-white transition hover:bg-[#b8533d]"
					>
						Kembali
					</button>
				</div>
			</div>
		</div>
	);
}
