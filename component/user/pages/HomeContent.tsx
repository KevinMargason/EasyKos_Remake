'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bell, Search } from 'lucide-react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import UserSectionTitle from '@/component/shared/UserSectionTitle';
import { ROUTES } from '@/lib/routes';
import { getFullGreeting } from '@/lib/greetings';
import KosDetailPage from './KosDetailPage';
import { useAppSelector } from '@/core/store/hooks';
import { useWallet } from '@/core/hooks/useWallet';
import { useKos } from '@/core/hooks/useKos';

const filters = ['Semua', 'Putri', 'Putra', 'Campuran', 'Dekat Kampus', 'Surabaya', 'Terjangkau'];

const properties = [
	{
		id: '1',
		name: 'Kos Mawar Indah',
		location: 'Sudirman, Jakarta',
		price: 'Rp 1.500.000',
		period: '/ Bulan',
		image: '/Asset/kamar/kamar1.svg',
		description: 'Kos nyaman dengan fasilitas lengkap',
		images: ['/Asset/kamar/kamar1.svg', '/Asset/kamar/kamar2.svg', '/Asset/kamar/kamar3.svg'],
		facilities: {
			umum: ['wifi', 'cctv', 'kulkas', 'laundry', 'ruangTamu', 'dapur', 'kamarMandiLuar'],
			kamar: ['lemari', 'meja', 'kursi', 'kasur', 'kamarMandiDalam'],
		},
		rules: [
			'Tidak boleh membawa hewan peliharaan',
			'Tidak boleh pulang malam (Max 23:00)',
			'Larangan menggunakan obat-obatan terlarang',
			'Dilarang membuat keributan di luar jam operasional',
		],
	},
	{
		id: '2',
		name: 'Kos Bunga',
		location: 'Sudirman, Jakarta',
		price: 'Rp 1.500.000',
		period: '/ Bulan',
		image: '/Asset/kamar/kamar2.svg',
		description: 'Kos berkualitas tinggi',
		images: ['/Asset/kamar/kamar2.svg', '/Asset/kamar/kamar3.svg', '/Asset/kamar/kamar1.svg'],
		facilities: {
			umum: ['wifi', 'cctv', 'kulkas', 'laundry', 'ruangTamu', 'dapur'],
			kamar: ['lemari', 'meja', 'kursi', 'kasur'],
		},
		rules: [
			'Tidak boleh membawa hewan peliharaan',
			'Tidak boleh pulang malam (Max 23:00)',
		],
	},
	{
		id: '3',
		name: 'Kos Lily',
		location: 'Sudirman, Jakarta',
		price: 'Rp 1.500.000',
		period: '/ Bulan',
		image: '/Asset/kamar/kamar3.svg',
		description: 'Lokasi strategis',
		images: ['/Asset/kamar/kamar3.svg', '/Asset/kamar/kamar1.svg', '/Asset/kamar/kamar2.svg'],
		facilities: {
			umum: ['wifi', 'cctv', 'laundry', 'dapur'],
			kamar: ['lemari', 'meja', 'kasur'],
		},
		rules: [
			'Tidak boleh pulang malam',
		],
	},
];

function PropertyCard({
	id,
	name,
	location,
	price,
	period,
	image,
	onClick,
}: {
	id: string;
	name: string;
	location: string;
	price: string;
	period: string;
	image: string;
	onClick: () => void;
}) {
	return (
		<button
			onClick={onClick}
			className="glass-card group overflow-hidden rounded-[24px] shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(15,23,42,0.12)] dark:hover:shadow-[0_18px_30px_rgba(0,0,0,0.32)] text-left"
		>
			<div className="relative h-[165px] w-full overflow-hidden bg-[#d9aa7d]">
				<Image
					src={image || '/Asset/kamar/kamar1.svg'}
					alt={name || 'Gambar kos'}
					fill
					className="object-cover transition duration-500 group-hover:scale-105"
					sizes="(max-width: 1280px) 100vw, 33vw"
				/>
			</div>
			<div className="space-y-1 px-4 py-4">
				<h3 className="text-[15px] font-semibold text-slate-900 dark:text-slate-100">{name}</h3>
				<p className="text-sm text-slate-500 dark:text-slate-400">{location}</p>
				<p className="text-[15px] font-semibold text-[#b85d47] dark:text-[#f0b2a7]">
					{price}
					<span className="font-normal text-slate-500 dark:text-slate-400">{period}</span>
				</p>
			</div>
		</button>
	);
}

export default function HomeContent() {
	const [activeFilter, setActiveFilter] = useState(filters[0]);
	const [activeKosId, setActiveKosId] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState('');

	// Get real data from Redux and hooks
	const user = useAppSelector((state: any) => state.user.user);
	const { totalKoin } = useWallet();
	const { kosList, currentKos, roomsList, fasilitas, aturan, fetchKos, fetchKosDetail, fetchRooms, fetchFasilitas, fetchAturan, isLoading } = useKos();

	const loadHomeData = useCallback(async () => {
		await fetchKos();
		await fetchRooms();
		await fetchFasilitas();
		await fetchAturan();
	}, [fetchKos, fetchRooms, fetchFasilitas, fetchAturan]);

	useEffect(() => {
		void loadHomeData();
	}, [loadHomeData]);

	useEffect(() => {
		if (!activeKosId) return;

		fetchKosDetail(activeKosId).catch((err) => {
			console.warn('fetchKosDetail failed', err);
		});
	}, [activeKosId, fetchKosDetail]);

	useEffect(() => {
		const handleFocus = () => {
			void loadHomeData();
		};

		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible') {
				void loadHomeData();
			}
		};

		window.addEventListener('focus', handleFocus);
		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			window.removeEventListener('focus', handleFocus);
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, [loadHomeData]);

	const activeFasilitas = useMemo(() => {
		if (!Array.isArray(fasilitas)) return [];

		return fasilitas
			.filter((item: any) => item && item.status !== false)
			.map((item: any) => item.nama_fasilitas || item.nama || '')
			.filter(Boolean);
	}, [fasilitas]);

	const fasilitasUmumBackend = useMemo(() => {
		if (!Array.isArray(fasilitas)) return [];

		return fasilitas
			.filter((item: any) => item && item.status !== false && String(item.kategori || '').toLowerCase() === 'publik')
			.map((item: any) => item.nama_fasilitas || item.nama || '')
			.filter(Boolean);
	}, [fasilitas]);

	const fasilitasKamarBackend = useMemo(() => {
		if (!Array.isArray(fasilitas)) return [];

		return fasilitas
			.filter((item: any) => item && item.status !== false && String(item.kategori || '').toLowerCase() === 'privat')
			.map((item: any) => item.nama_fasilitas || item.nama || '')
			.filter(Boolean);
	}, [fasilitas]);

	const activeAturan = useMemo(() => {
		if (!Array.isArray(aturan)) return [];

		return aturan
			.filter((item: any) => item && item.status !== false)
			.map((item: any) => item.nama_aturan || item.nama || '')
			.filter(Boolean);
	}, [aturan]);

	const normalizeText = (value: any) => String(value ?? '').toLowerCase();

	const mapKosForCard = (property: any, room: any = null) => {
		// Map HANYA dari API response - NO FALLBACK
		
		// Fasilitas dari API response kos - filter by kategori
		const kosiFasilitas = Array.isArray(property.fasilitas) ? property.fasilitas : [];
		const fasilitasUmum = kosiFasilitas
			.filter((f: any) => f && String(f.kategori || '').toLowerCase() === 'publik' && f.status !== false)
			.map((f: any) => f.nama_fasilitas || '')
			.filter(Boolean);
		const fasilitasKamar = kosiFasilitas
			.filter((f: any) => f && String(f.kategori || '').toLowerCase() === 'privat' && f.status !== false)
			.map((f: any) => f.nama_fasilitas || '')
			.filter(Boolean);

		// Aturan HANYA dari API response kos - NO FALLBACK
		let ruleValues: string[] = [];
		if (Array.isArray(property.aturans)) {
			ruleValues = property.aturans
				.filter((a: any) => a && a.status !== false && a.nama_aturan)
				.map((a: any) => a.nama_aturan)
				.filter(Boolean);
		}

		const roomPrice = room?.harga ?? property.harga;

		return {
			id: String(property.id),
			name: property.nama || property.name || 'Kos',
			location: property.alamat || property.location || '-',
			price: roomPrice ? `Rp ${Number(roomPrice).toLocaleString('id-ID')}` : 'Harga belum tersedia',
			period: property.period || '/ Bulan',
			image: property.foto || property.image || '/Asset/kamar/kamar1.svg',
			description: property.deskripsi || property.description || 'Detail kos belum lengkap dari backend',
			images: property.images || (property.foto ? [property.foto] : ['/Asset/kamar/kamar1.svg']),
			facilities: {
				umum: fasilitasUmum,
				kamar: fasilitasKamar,
			},
			rules: ruleValues,
			owner: property.owner || null,
		};
	};

	const selectedKosFromList = activeKosId && kosList ? kosList.find((p: any) => String(p.id) === String(activeKosId)) : null;
	const selectedKos = activeKosId && currentKos && String(currentKos.id) === String(activeKosId) ? currentKos : selectedKosFromList;
	const selectedRoom = selectedKos && roomsList ? roomsList.find((room: any) => String(room.kos_id) === String(selectedKos.id) || String(room.kosId) === String(selectedKos.id)) : null;
	const selectedKosView = selectedKos ? mapKosForCard(selectedKos, selectedRoom) : null;

	const filteredProperties = useMemo(() => {
		if (!kosList || !Array.isArray(kosList)) return [];

		const query = searchQuery.trim().toLowerCase();

		return kosList.filter((prop: any) => {
			if (!prop) return false;

			const kosName = normalizeText(prop.nama || prop.name);
			const alamat = normalizeText(prop.alamat || prop.location);
			const gender = normalizeText(prop.gender);
			const harga = Number(prop.harga || 0);

			const matchesSearch =
				!query ||
				kosName.includes(query) ||
				alamat.includes(query) ||
				gender.includes(query);

			const matchesFilter = (() => {
				if (activeFilter === 'Semua') return true;
				if (activeFilter === 'Putri') return gender === 'putri';
				if (activeFilter === 'Putra') return gender === 'putra';
				if (activeFilter === 'Campuran') return gender === 'campur';
				if (activeFilter === 'Dekat Kampus') {
					return ['kampus', 'universitas', 'univ', 'uin', 'itb', 'ugm', 'ui', 'politeknik', 'sekolah'].some((keyword) =>
						kosName.includes(keyword) || alamat.includes(keyword)
					);
				}
				if (activeFilter === 'Surabaya') {
					const regionId = Number(prop.region_idregion || 0);
					return regionId === 1 || alamat.includes('surabaya');
				}
				if (activeFilter === 'Terjangkau') return harga ? harga <= 1500000 : true;
				return true;
			})();

			return matchesSearch && matchesFilter;
		});
	}, [kosList, searchQuery, activeFilter]);

	const filteredPropertiesWithRooms = useMemo(
		() => filteredProperties.map((property: any) => ({
			property,
			room: roomsList.find((room: any) => String(room.kos_id) === String(property.id) || String(room.kosId) === String(property.id)) || null,
		})),
		[filteredProperties, roomsList]
	);

	// Show loading skeleton while data is loading
	if (isLoading) {
		return (
			<div className="mx-auto flex max-w-[1180px] flex-col gap-6">
				<div className="animate-pulse space-y-4">
					<div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<div key={i} className="h-48 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto flex max-w-[1180px] flex-col gap-5">
			{activeKosId && selectedKosView ? (
				<KosDetailPage
					kos={selectedKosView}
					onBack={() => setActiveKosId(null)}
				/>
			) : (
				<>
					<header className="flex flex-col gap-4 rounded-[28px] bg-transparent sm:flex-row sm:items-start sm:justify-between">
						<div className="flex items-center gap-4">
							<Image src="/Asset/icon/icon-person.svg" alt="Akun pengguna" width={90} height={90} />
							<div className='mb-5'>
								<p className="text-[14px] text-slate-500 dark:text-slate-400">{getFullGreeting(user?.name).greeting}</p>
								<h1 className="text-[26px] font-bold leading-none text-slate-900 dark:text-slate-100">{getFullGreeting(user?.name).userName}</h1>
							</div>
						</div>

						<div className="flex items-center gap-3 self-start sm:pt-1">
							<div className="glass-chip inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-[15px] font-semibold transition">
								<Image src="/Asset/icon/icon-fire.svg" alt="Streak" width={18} height={18} />
								<span>--</span>
							</div>
							<div className="glass-chip inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-[15px] font-semibold transition">
								<Image src="/Asset/icon/icon-coin.svg" alt="Koin" width={18} height={18} />
								<span>{totalKoin || 0} Koin</span>
							</div>
						</div>
					</header>

					<div className="grid gap-3 md:grid-cols-[1fr_auto]">
						<div className="glass-card flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 shadow-[0_6px_18px_rgba(15,23,42,0.05)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_6px_18px_rgba(0,0,0,0.25)]">
							<Search size={20} className="text-slate-400 dark:text-slate-500" />
							<input
								type="text"
								placeholder="Cari kos berdasarkan nama atau alamat..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full bg-transparent text-[15px] outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
							/>
						</div>

						<button
							onClick={() => {
								setSearchQuery('');
								setActiveFilter('Semua');
							}}
							className="glass-card rounded-full border border-transparent px-8 py-3 text-[15px] font-semibold shadow-[0_4px_10px_rgba(15,23,42,0.06)] transition bg-[linear-gradient(rgba(255,255,255,0.78),rgba(255,255,255,0.78)),linear-gradient(90deg,#b87a69_0%,#d78758_50%,#e0a0a5_100%)] bg-origin-[padding-box,border-box] bg-clip-[padding-box,border-box] text-[#b86552] hover:bg-[linear-gradient(rgba(255,248,246,0.84),rgba(255,248,246,0.84)),linear-gradient(90deg,#b87a69_0%,#d78758_50%,#e0a0a5_100%)] dark:bg-[linear-gradient(rgba(15,23,42,0.75),rgba(15,23,42,0.75)),linear-gradient(90deg,#b87a69_0%,#d78758_50%,#e0a0a5_100%)] dark:bg-origin-[padding-box,border-box] dark:bg-clip-[padding-box,border-box] dark:text-[#f0b2a7] dark:hover:bg-[linear-gradient(rgba(30,41,59,0.8),rgba(30,41,59,0.8)),linear-gradient(90deg,#b87a69_0%,#d78758_50%,#e0a0a5_100%)]"
						>
							Reset
						</button>
					</div>

					<Link href={ROUTES.USER.MYPET} className="block overflow-hidden rounded-[18px] bg-[#9f5845]">
						<Image
							src="/Asset/iklan-pet.svg"
							alt="Iklan pet"
							width={929}
							height={224}
							unoptimized
							priority
							className="block h-auto w-full object-contain"
						/>
					</Link>

					<div className="flex flex-wrap gap-3">
						{filters.map((item) => (
							<button
								key={item}
								onClick={() => setActiveFilter(item)}
								className={`glass-chip rounded-full px-5 py-2.5 text-[15px] font-semibold transition ${activeFilter === item ? 'is-active' : 'hover:border-[#eec18a]'
									}`}
							>
								{item}
							</button>
						))}
					</div>

					<section className="space-y-4">
						<UserSectionTitle title="Rekomendasi untuk Anda" action={<button className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#b85d47] dark:text-slate-400 dark:hover:text-[#f0b2a7]"><Bell size={16} /><span>Lihat semua</span></button>} />
						<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
							{filteredPropertiesWithRooms.length > 0 ? (
								filteredPropertiesWithRooms.map(({ property, room }: any, index: any) => (
									<PropertyCard key={`search-${property.id}-${index}`} {...mapKosForCard(property, room)} onClick={() => setActiveKosId(String(property.id))} />
								))
							) : (
								<p className="col-span-full text-center text-slate-500">Tidak ada hasil pencarian atau filter yang cocok</p>
							)}
						</div>
					</section>

					<section className="space-y-4 pb-8">
						<UserSectionTitle title="Populer" />
						<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
							{filteredPropertiesWithRooms.length > 0 ? (
								filteredPropertiesWithRooms.map(({ property, room }: any, index: any) => (
									<PropertyCard key={`popular-search-${property.id}-${index}`} {...mapKosForCard(property, room)} onClick={() => setActiveKosId(String(property.id))} />
								))
							) : (
								<p className="col-span-full text-center text-slate-500">Tidak ada hasil pencarian atau filter yang cocok</p>
							)}
						</div>
					</section>
				</>
			)}
		</div>
	);
}
