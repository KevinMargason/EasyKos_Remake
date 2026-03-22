'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Plus, ChevronLeft } from 'lucide-react';

type AmenityKey = 'wifi' | 'cctv' | 'kulkas' | 'laundry' | 'ruangTamu' | 'dapur' | 'lemari' | 'meja' | 'kursi' | 'kasur' | 'kamarMandiDalam' | 'kamarMandiLuar';

interface UpdateStatusPageProps {
	onBack: () => void;
	kosList: string[];
	amenitiesIcons?: Record<AmenityKey, { icon: string; label: string }>;
}

export default function UpdateStatusPage({ onBack, kosList, amenitiesIcons }: UpdateStatusPageProps) {
	const [selectedKos, setSelectedKos] = useState<string | null>(null);
	const [selectedFasilitasUmum, setSelectedFasilitasUmum] = useState<string[]>([]);
	const [selectedFasilitasKamar, setSelectedFasilitasKamar] = useState<string[]>([]);
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
				<h2 className="text-[28px] font-bold text-[#c86654]">Update Status Kos</h2>

				<div className="mt-8 grid gap-4 md:grid-cols-[1fr_2fr] lg:grid-cols-3">
					<div>
						<h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">Daftar Kamar Kos</h3>
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
									onClick={() => setSelectedKos(kos)}
									className={`w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition ${
										selectedKos === kos ? 'border-[#c86654] bg-[#fef8f6] text-[#c86654] dark:bg-slate-800' : 'border-slate-200 bg-white text-slate-900 hover:border-[#c86654] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
									}`}
								>
									{kos}
								</button>
							))}
						</div>
					</div>

					{/* Detail Kamar */}
					<div className="lg:col-span-2">
						<h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">Jenis Kos</h3>
						<div className="mb-6 flex gap-3">
							{['Putra', 'Putri', 'Campur'].map((type) => (
								<label key={type} className="flex items-center gap-2">
									<input type="radio" name="type" className="h-4 w-4 accent-[#c86654]" />
									<span className="text-sm text-slate-700 dark:text-slate-300">{type}</span>
								</label>
							))}
						</div>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Fasilitas Umum</label>
								{amenitiesIcons ? (
									<div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
										{['wifi', 'cctv', 'kulkas', 'laundry', 'ruangTamu', 'dapur', 'kamarMandiLuar'].map((amenity) => (
											<button
												key={amenity}
												onClick={() => setSelectedFasilitasUmum(prev => prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity])}
												className={`glass-chip group relative ${selectedFasilitasUmum.includes(amenity) ? 'is-active' : ''} inline-flex h-20 w-20 flex-col items-center justify-center gap-1.5 rounded-full p-0 shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.16)] dark:hover:shadow-[0_6px_16px_rgba(0,0,0,0.20)]`}
												type="button"
											>
												<Image src={amenitiesIcons[amenity as AmenityKey].icon} alt={amenitiesIcons[amenity as AmenityKey].label} width={28} height={28} className={`h-7 w-7 object-contain transition ${selectedFasilitasUmum.includes(amenity) ? 'brightness-0 invert' : ''}`} />
												<span className="text-center text-[10px] font-semibold leading-tight">{amenitiesIcons[amenity as AmenityKey].label}</span>
											</button>
										))}
										<button
											onClick={() => {}}
											className="glass-chip inline-flex h-20 w-20 flex-col items-center justify-center gap-1.5 rounded-full p-0 shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.16)] dark:hover:shadow-[0_6px_16px_rgba(0,0,0,0.20)]"
											type="button"
										>
											<Image src="/Asset/icon/icon-add.svg" alt="Tambah" width={28} height={28} className="h-7 w-7 object-contain" />
											<span className="text-center text-[10px] font-semibold leading-tight">Tambah</span>
										</button>
									</div>
								) : (
									<div className="mt-3 flex flex-wrap gap-2">
										{['Wifi', 'CCTV', 'Kulkas', 'Laundry', 'Ruang Tamu', 'Dapur'].map((facility) => (
											<label key={facility} className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 transition dark:border-slate-700 dark:bg-slate-800">
												<input type="checkbox" className="h-4 w-4 accent-[#c86654]" />
												<span className="text-sm text-slate-700 dark:text-slate-300">{facility}</span>
											</label>
										))}
									</div>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Fasilitas Kamar</label>
								{amenitiesIcons ? (
									<div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
										{['lemari', 'meja', 'kursi', 'kasur', 'kamarMandiDalam'].map((amenity) => (
											<button
												key={amenity}
												onClick={() => setSelectedFasilitasKamar(prev => prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity])}
												className={`glass-chip group relative ${selectedFasilitasKamar.includes(amenity) ? 'is-active' : ''} inline-flex h-20 w-20 flex-col items-center justify-center gap-1.5 rounded-full p-0 shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.16)] dark:hover:shadow-[0_6px_16px_rgba(0,0,0,0.20)]`}
												type="button"
											>
												<Image src={amenitiesIcons[amenity as AmenityKey].icon} alt={amenitiesIcons[amenity as AmenityKey].label} width={28} height={28} className={`h-7 w-7 object-contain transition ${selectedFasilitasKamar.includes(amenity) ? 'brightness-0 invert' : ''}`} />
												<span className="text-center text-[10px] font-semibold leading-tight">{amenitiesIcons[amenity as AmenityKey].label}</span>
											</button>
										))}
										<button
											onClick={() => {}}
											className="glass-chip inline-flex h-20 w-20 flex-col items-center justify-center gap-1.5 rounded-full p-0 shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.16)] dark:hover:shadow-[0_6px_16px_rgba(0,0,0,0.20)]"
											type="button"
										>
											<Image src="/Asset/icon/icon-add.svg" alt="Tambah" width={28} height={28} className="h-7 w-7 object-contain" />
											<span className="text-center text-[10px] font-semibold leading-tight">Tambah</span>
										</button>
									</div>
								) : (
									<div className="mt-3 flex flex-wrap gap-2">
										{['Lemari', 'Meja', 'Kursi', 'Kasur', 'Kamar Mandi Dalam', 'Tambah'].map((facility) => (
											<label key={facility} className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 transition dark:border-slate-700 dark:bg-slate-800">
												<input type="checkbox" className="h-4 w-4 accent-[#c86654]" />
												<span className="text-sm text-slate-700 dark:text-slate-300">{facility}</span>
											</label>
										))}
									</div>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Harga Kamar</label>
								<div className="mt-2 flex items-center gap-2">
									<span className="text-slate-700 dark:text-slate-300">Rp</span>
									<input
										type="text"
										placeholder="Masukkan Harga Kamar Kos Anda"
										className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 transition focus:border-[#c86654] focus:outline-none focus:ring-1 focus:ring-[#c86654] dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Unggah Foto Kamar Kos</label>
								<div className="mt-3 flex gap-2">
									{[1, 2, 3].map((i) => (
										<button key={i} className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-[#c86654] dark:border-slate-600 dark:bg-slate-800">
											<Image src="/Asset/icon/icon-camera.svg" alt="camera" width={24} height={24} />
										</button>
									))}
									<button className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-[#c86654] bg-white transition hover:bg-[#fef8f6] dark:bg-slate-800">
										<Plus size={24} className="text-[#c86654]" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-8 flex gap-3">
					<button
						onClick={onBack}
						className="flex-1 rounded-lg border border-slate-300 bg-white py-3 font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
					>
						Simpan Perubahan
					</button>
					<button
						onClick={onBack}
						className="flex-1 rounded-lg bg-[#c86654] py-3 font-semibold text-white transition hover:bg-[#b8533d]"
					>
						Batal
					</button>
				</div>
			</div>
		</div>
	);
}
