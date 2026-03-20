import Image from 'next/image';
import Link from 'next/link';
import { Bell, Coins, Flame, Search } from 'lucide-react';
import UserAvatar from '../UserAvatar';
import UserSectionTitle from '../UserSectionTitle';

const filters = ['Putri', 'Putra', 'Campur', 'Dekat Kampus', 'Surabaya', 'Affordable'];

const properties = [
	{
		name: 'Kos Mawar Indah',
		location: 'Sudirman, Jakarta',
		price: 'Rp 1.500.000',
		period: '/mo',
		image: '/Asset/kamar/kamar1.svg',
	},
	{
		name: 'Kos Mawar Indah',
		location: 'Sudirman, Jakarta',
		price: 'Rp 1.500.000',
		period: '/mo',
		image: '/Asset/kamar/kamar2.svg',
	},
	{
		name: 'Kos Mawar Indah',
		location: 'Sudirman, Jakarta',
		price: 'Rp 1.500.000',
		period: '/mo',
		image: '/Asset/kamar/kamar3.svg',
	},
];

function PropertyCard({
	name,
	location,
	price,
	period,
	image,
}: {
	name: string;
	location: string;
	price: string;
	period: string;
	image: string;
}) {
	return (
		<article className="glass-card group overflow-hidden rounded-[24px] shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(15,23,42,0.12)] dark:hover:shadow-[0_18px_30px_rgba(0,0,0,0.32)]">
			<div className="relative h-[165px] w-full overflow-hidden bg-[#d9aa7d]">
				<Image
					src={image}
					alt={name}
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
		</article>
	);
}

export default function HomeContent() {
	return (
		<div className="mx-auto flex max-w-[1180px] flex-col gap-5">
			<header className="flex flex-col gap-4 rounded-[28px] bg-transparent sm:flex-row sm:items-start sm:justify-between">
				<div className="flex items-center gap-4">
					<UserAvatar />
					<div>
						<p className="text-[14px] text-slate-500 dark:text-slate-400">Good Morning,</p>
						<h1 className="text-[26px] font-bold leading-none text-slate-900 dark:text-slate-100">Budi T.</h1>
					</div>
				</div>

				<div className="flex items-center gap-3 self-start sm:pt-1">
					<div className="glass-card inline-flex items-center gap-2 rounded-full border border-[#edc29b] bg-[#fff1e2] px-5 py-2.5 text-[14px] font-semibold text-[#e26d3e] shadow-sm dark:border-[#7f4b3d] dark:bg-[#2f1b17] dark:text-[#f0b2a7]">
						<Flame size={16} className="fill-[#e26d3e]" />
						<span>12 Days</span>
					</div>
					<div className="glass-card inline-flex items-center gap-2 rounded-full border border-[#e1a392] bg-white px-5 py-2.5 text-[14px] font-semibold text-[#cf5b49] shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-[#f0b2a7]">
						<Coins size={16} className="text-[#e1a392]" />
						<span>10 Coins</span>
					</div>
				</div>
			</header>

			<div className="grid gap-3 md:grid-cols-[1fr_auto]">
				<div className="glass-card flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 shadow-[0_6px_18px_rgba(15,23,42,0.05)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_6px_18px_rgba(0,0,0,0.25)]">
					<Search size={20} className="text-slate-400 dark:text-slate-500" />
					<input type="text" placeholder="Cari Kos..." className="w-full bg-transparent text-[15px] outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500" />
				</div>

				<button className="glass-card rounded-full border border-transparent px-8 py-3 text-[15px] font-semibold shadow-[0_4px_10px_rgba(15,23,42,0.06)] transition bg-[linear-gradient(rgba(255,255,255,0.78),rgba(255,255,255,0.78)),linear-gradient(90deg,#b87a69_0%,#d78758_50%,#e0a0a5_100%)] bg-origin-[padding-box,border-box] bg-clip-[padding-box,border-box] text-[#b86552] hover:bg-[linear-gradient(rgba(255,248,246,0.84),rgba(255,248,246,0.84)),linear-gradient(90deg,#b87a69_0%,#d78758_50%,#e0a0a5_100%)] dark:bg-[linear-gradient(rgba(15,23,42,0.75),rgba(15,23,42,0.75)),linear-gradient(90deg,#b87a69_0%,#d78758_50%,#e0a0a5_100%)] dark:bg-origin-[padding-box,border-box] dark:bg-clip-[padding-box,border-box] dark:text-[#f0b2a7] dark:hover:bg-[linear-gradient(rgba(30,41,59,0.8),rgba(30,41,59,0.8)),linear-gradient(90deg,#b87a69_0%,#d78758_50%,#e0a0a5_100%)]">
					Cari
				</button>
			</div>

			<Link href="/user/mypet" className="block overflow-hidden rounded-[18px] bg-[#9f5845]">
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
						className="glass-card rounded-full border border-transparent px-5 py-2.5 text-[15px] font-semibold shadow-[0_4px_10px_rgba(15,23,42,0.06)] transition bg-[linear-gradient(rgba(255,255,255,0.78),rgba(255,255,255,0.78)),linear-gradient(90deg,#b87a69_0%,#d78758_50%,#e0a0a5_100%)] bg-origin-[padding-box,border-box] bg-clip-[padding-box,border-box] text-[#b86552] hover:bg-[linear-gradient(rgba(255,248,246,0.84),rgba(255,248,246,0.84)),linear-gradient(90deg,#b87a69_0%,#d78758_50%,#e0a0a5_100%)] dark:bg-[linear-gradient(rgba(15,23,42,0.75),rgba(15,23,42,0.75)),linear-gradient(90deg,#b87a69_0%,#d78758_50%,#e0a0a5_100%)] dark:bg-origin-[padding-box,border-box] dark:bg-clip-[padding-box,border-box] dark:text-[#f0b2a7] dark:hover:bg-[linear-gradient(rgba(30,41,59,0.8),rgba(30,41,59,0.8)),linear-gradient(90deg,#b87a69_0%,#d78758_50%,#e0a0a5_100%)]"
					>
						{item}
					</button>
				))}
			</div>

			<section className="space-y-4">
				<UserSectionTitle title="Recommended For You" action={<button className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#b85d47] dark:text-slate-400 dark:hover:text-[#f0b2a7]"><Bell size={16} /><span>See all</span></button>} />
				<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
					{properties.map((property, index) => (
						<PropertyCard key={`${property.name}-${index}`} {...property} />
					))}
				</div>
			</section>

			<section className="space-y-4 pb-8">
				<UserSectionTitle title="Populer" />
				<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
					{properties.map((property, index) => (
						<PropertyCard key={`popular-${property.name}-${index}`} {...property} />
					))}
				</div>
			</section>
		</div>
	);
}
