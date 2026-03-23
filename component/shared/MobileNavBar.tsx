'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
	const navItems = role === 'owner' ? ownerNavItems : userNavItems;
	const homePath = role === 'owner' ? ROUTES.OWNER.HOME : ROUTES.USER.HOME;

	return (
		<nav className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_-8px_24px_rgba(0,0,0,0.25)] lg:hidden">
			<div className="flex items-center">
				{/* Navigation Items - Keep all items visible so tour targets exist on mobile/tablet */}
				<div className="flex w-full items-center justify-around gap-1 overflow-x-auto pr-1">
					{navItems.map(({ label, href, icon }) => {
						const active = href === homePath ? pathname === homePath : pathname === href || pathname.startsWith(`${href}/`);
						const getTourAttribute = () => {
							if (role === 'owner') {
								if (label === 'Beranda') return 'sidebar-home';
								if (label === 'Manajemen') return 'sidebar-management';
								if (label === 'Chat') return 'sidebar-chat';
								if (label === 'Profil') return 'sidebar-profile';
								if (label === 'Peliharaan') return 'sidebar-mypet';
							} else {
								if (label === 'Beranda') return 'sidebar-home';
								if (label === 'Kos Saya') return 'sidebar-mykos';
								if (label === 'Chat') return 'sidebar-chat';
								if (label === 'Profil') return 'sidebar-profile';
								if (label === 'My Pet') return 'sidebar-mypet';
							}
							return '';
						};
						return (
							<Link
								key={label}
								href={href}
								data-tour={getTourAttribute()}
								className={`flex min-w-[64px] flex-col items-center gap-1 rounded-lg px-2.5 py-2 text-[11px] font-medium transition ${
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
			</div>
		</nav>
	);
}