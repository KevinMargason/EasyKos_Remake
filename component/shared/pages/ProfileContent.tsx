import Image from 'next/image';
import type { ComponentType } from 'react';
import { BadgeCheck, CalendarDays, Edit3, Mail, Phone, UserRound } from 'lucide-react';
import UserSectionTitle from '@/component/shared/UserSectionTitle';

function InfoRow({ label, value, icon: Icon }: { label: string; value: string; icon?: ComponentType<{ size?: number; className?: string }> }) {
	return (
		<div className="glass-card flex items-center justify-between gap-4 rounded-[14px] border-2 border-[#e3d0c9] px-4 py-3 shadow-[0_6px_16px_rgba(15,23,42,0.04)] dark:border-slate-700/80">
			<div className="flex items-center gap-3">
				{Icon ? <Icon size={18} className="text-[#c35f46]" /> : null}
				<span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
			</div>
			<div className="text-[15px] font-medium text-slate-900 dark:text-slate-100">{value}</div>
		</div>
	);
}

export default function ProfileContent() {
	return (
		<div className="mx-auto flex max-w-[980px] flex-col gap-5">
			<UserSectionTitle title="Profil" action={<button className="glass-card inline-flex items-center gap-2 rounded-full border border-[#e6b3a8] bg-[#fff3ef] px-4 py-2 text-sm font-semibold text-[#c35f46] dark:text-[#f0b2a7]"><Edit3 size={16} />Ubah Profil</button>} />

			<div className="grid gap-5 lg:grid-cols-[240px_1fr]">
				<div className="glass-card rounded-[20px] border-2 border-[#e3d0c9] p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)] dark:border-slate-700/80">
					<div className="flex flex-col items-center text-center">
						<Image src="/Asset/icon/icon-person.svg" alt="Akun pengguna" width={132} height={132} className="mt-4" />
						<h3 className="mt-4 text-[21px] font-semibold text-slate-900 dark:text-slate-100">Budi T.</h3>
						<p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Penyewa • Anggota Aktif</p>
						<div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#edf8f3] px-4 py-2 text-sm font-semibold text-[#1f8a57]">
							<BadgeCheck size={16} />
							Akun Terverifikasi
						</div>
					</div>

					<div className="mt-5 space-y-3">
						<div className="rounded-[14px] bg-[#f9fafb] px-4 py-3 text-center dark:bg-slate-800/80">
							<div className="text-sm text-slate-500 dark:text-slate-400">Peran</div>
							<div className="mt-1 text-[16px] font-semibold capitalize text-slate-900 dark:text-slate-100">penyewa</div>
						</div>
						<div className="rounded-[14px] bg-[#f9fafb] px-4 py-3 text-center dark:bg-slate-800/80">
							<div className="text-sm text-slate-500 dark:text-slate-400">Anggota sejak</div>
							<div className="mt-1 text-[16px] font-semibold text-slate-900 dark:text-slate-100">10 Jan 2026</div>
						</div>
					</div>
				</div>

				<div className="space-y-4">
					<div>
						<h3 className="mb-3 text-[18px] font-semibold text-slate-900 dark:text-slate-100">Informasi Dasar</h3>
						<div className="space-y-3">
							<InfoRow label="Nama Lengkap" value="Budi T." icon={UserRound} />
							<InfoRow label="No. HP" value="+62 812-3456-7890" icon={Phone} />
							<InfoRow label="Email" value="budi.t@example.com" icon={Mail} />
						</div>
					</div>

					<div>
						<h3 className="mb-3 text-[18px] font-semibold text-slate-900 dark:text-slate-100">Linimasa Akun</h3>
						<div className="grid gap-3 md:grid-cols-2">
							<InfoRow label="Bergabung" value="10 Jan 2026" icon={CalendarDays} />
							<InfoRow label="Terakhir Update" value="18 Mar 2026" icon={Edit3} />
						</div>
					</div>

					<div className="glass-card rounded-[20px] border-2 border-dashed border-[#dfb9ae] bg-[#fff8f6] p-5 text-sm leading-7 text-slate-600 dark:border-slate-700/80 dark:text-slate-300">
						<p className="font-semibold text-slate-900 dark:text-slate-100">Catatan komponen profil</p>
						<p className="mt-2">Kolom yang sudah ada di backend user: nama, no_hp, email, role, pin, created_at, updated_at. Nanti bagian ini tinggal dihubungkan ke data API.</p>
					</div>
				</div>
			</div>
		</div>
	);
}