'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

const userNavItems: Array<{ label: string; href: string; icon: string }> = [
	{ label: 'Beranda', href: ROUTES.USER.HOME, icon: '/Asset/icon/icon-house2.svg' },
	{ label: 'Kos Saya', href: ROUTES.USER.MYKOS, icon: '/Asset/icon/icon-apartment.svg' },
	{ label: 'Chat', href: ROUTES.USER.CHAT, icon: '/Asset/icon/icon-chat2.svg' },
	{ label: 'Profil', href: ROUTES.USER.PROFILE, icon: '/Asset/icon/icon-profile.svg' },
	{ label: 'My Pet', href: ROUTES.USER.MYPET, icon: '/Asset/icon/icon-squirrel.svg' },
];

const ownerNavItems: Array<{ label: string; href: string; icon: string }> = [
	{ label: 'Beranda', href: ROUTES.OWNER.HOME, icon: '/Asset/icon/icon-house2.svg' },
	{ label: 'Manajemen', href: ROUTES.OWNER.MANAGEMENT, icon: '/Asset/icon/icon-apartment.svg' },
	{ label: 'Chat', href: ROUTES.OWNER.CHAT, icon: '/Asset/icon/icon-chat2.svg' },
	{ label: 'Profil', href: ROUTES.OWNER.PROFILE, icon: '/Asset/icon/icon-profile.svg' },
	{ label: 'Peliharaan', href: ROUTES.OWNER.MYPET, icon: '/Asset/icon/icon-squirrel.svg' },
];

type MobileNavBarProps = {
	role?: 'user' | 'owner';
};

export default function MobileNavBar({ role = 'user' }: MobileNavBarProps) {
	const pathname = usePathname();
	const router = useRouter();
	const navItems = role === 'owner' ? ownerNavItems : userNavItems;
	const homePath = role === 'owner' ? ROUTES.OWNER.HOME : ROUTES.USER.HOME;

	const handleLogout = () => {
		// Clear localStorage
		if (typeof window !== 'undefined') {
			localStorage.removeItem('token');
			localStorage.removeItem('user');
		}
		// Redirect to login
		router.push(ROUTES.LOGIN);
	};

	return (
		<nav className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_-8px_24px_rgba(0,0,0,0.25)] lg:hidden">
			<div className="flex items-center justify-between gap-1">
				{/* Navigation Items - Show 4 items, hide last one */}
				<div className="flex flex-1 items-center justify-around gap-1">
					{navItems.slice(0, 4).map(({ label, href, icon }) => {
						const active = href === homePath ? pathname === homePath : pathname === href || pathname.startsWith(`${href}/`);
						return (
							<Link
								key={label}
								href={href}
								className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-[11px] font-medium transition ${
									active
										? 'text-[#BA6054] dark:text-[#e07b6d]'
										: 'text-slate-600 dark:text-slate-400'
								}`}
								title={label}
							>
								<Image
									src={icon}
									alt={label}
									width={20}
									height={20}
									className={active ? 'brightness-0 saturate-100 invert-[42%] sepia-[68%] saturate-[1650%] hue-rotate-[337deg] brightness-[97%] contrast-[92%]' : 'brightness-0 saturate-100 opacity-60 dark:brightness-0 dark:invert dark:opacity-80'}
								/>
								<span className="hidden xs:inline">{label}</span>
							</Link>
						);
					})}
				</div>

				{/* Logout Button */}
				<button
					onClick={handleLogout}
					className="flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-[11px] font-medium text-[#c35f46] transition hover:bg-[#fbefeb] dark:text-[#f0b2a7] dark:hover:bg-slate-800"
					title="Keluar"
				>
					<LogOut size={20} />
					<span className="hidden xs:inline">Keluar</span>
				</button>
			</div>
		</nav>
	);
}