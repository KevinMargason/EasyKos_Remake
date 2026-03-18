import Image from 'next/image';
import type { ReactNode } from 'react';
import { MessageCircle } from 'lucide-react';
import UserSectionTitle from '../UserSectionTitle';

const roomImages = ['/Asset/kamar/kamar1.svg', '/Asset/kamar/kamar2.svg', '/Asset/kamar/kamar3.svg'];

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
	return <div className={`glass-card rounded-[18px] shadow-[0_10px_24px_rgba(15,23,42,0.05)] ${className}`}>{children}</div>;
}

function RentInfo() {
	return (
		<Card className="flex min-h-[135px] flex-col justify-between p-5 sm:p-6">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h3 className="text-[18px] font-semibold text-slate-900 dark:text-slate-100">March Rent Due</h3>
					<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Due in 3 days</p>
				</div>
				<div className="text-[22px] font-semibold text-[#c35f46] dark:text-[#f0b2a7]">Rp 1.500.000</div>
			</div>
			<button className="mt-6 rounded-md bg-[#ec8a3d] py-3 text-[15px] font-semibold text-white shadow-[0_8px_18px_rgba(236,138,61,0.25)] transition hover:bg-[#df7b2e] dark:text-slate-950">
				Bayar Sekarang
			</button>
		</Card>
	);
}

function ContactOwner() {
	return (
		<Card className="flex min-h-[135px] flex-col items-center justify-center gap-3 p-5 text-center">
			<div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f4e0dd] text-[#c35f46]">
				<MessageCircle size={36} />
			</div>
			<div className="text-[17px] font-semibold text-slate-900 dark:text-slate-100">Contact Owner</div>
		</Card>
	);
}

export default function MyKosContent() {
	return (
		<div className="mx-auto flex max-w-[1180px] flex-col gap-5">
			<UserSectionTitle title="My Boarding House" />

			<Card className="overflow-hidden">
				<div className="grid grid-cols-3 gap-0">
					{roomImages.map((src, index) => (
						<div key={src} className="relative h-[112px] sm:h-[132px]">
							<Image src={src} alt={`Kos preview ${index + 1}`} fill className="object-cover" />
						</div>
					))}
				</div>

				<div className="space-y-2 px-5 py-4 sm:px-6 sm:py-5">
					<h3 className="text-[18px] font-semibold text-slate-900 dark:text-slate-100">Kos Mawar Indah - Room 12A</h3>
					<p className="text-[15px] leading-6 text-slate-600 dark:text-slate-300">
							Jl. Raya Kalirungkut, Kali Rungkut, Kec. Rungkut, Surabaya, Jawa Timur 60293
						</p>
						<p className="pt-3 text-[15px] font-medium text-slate-500 dark:text-slate-300">moved in: Jan 10, 2026</p>
				</div>
			</Card>

			<div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
				<ContactOwner />
				<RentInfo />
			</div>
		</div>
	);
}
