'use client';

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

const userSidebarItems: Array<{ label: string; href: string; icon: string; activeIconClassName: string }> = [
	{ label: 'Beranda', href: ROUTES.USER.HOME, icon: '/Asset/icon/icon-house2.svg', activeIconClassName: 'brightness-0 saturate-100 invert-[42%] sepia-[68%] saturate-[1650%] hue-rotate-[337deg] brightness-[97%] contrast-[92%]' },
	{ label: 'Kos Saya', href: ROUTES.USER.MYKOS, icon: '/Asset/icon/icon-apartment.svg', activeIconClassName: 'brightness-0 saturate-100 invert-[42%] sepia-[68%] saturate-[1650%] hue-rotate-[337deg] brightness-[97%] contrast-[92%]' },
	{ label: 'Chat', href: ROUTES.USER.CHAT, icon: '/Asset/icon/icon-chat2.svg', activeIconClassName: 'brightness-0 saturate-100 invert-[42%] sepia-[68%] saturate-[1650%] hue-rotate-[337deg] brightness-[97%] contrast-[92%]' },
	{ label: 'Profil', href: ROUTES.USER.PROFILE, icon: '/Asset/icon/icon-profile.svg', activeIconClassName: 'brightness-0 saturate-100 invert-[42%] sepia-[68%] saturate-[1650%] hue-rotate-[337deg] brightness-[97%] contrast-[92%]' },
	{ label: 'My Pet', href: ROUTES.USER.MYPET, icon: '/Asset/icon/icon-squirrel.svg', activeIconClassName: 'brightness-0 saturate-100 invert-[42%] sepia-[68%] saturate-[1650%] hue-rotate-[337deg] brightness-[97%] contrast-[92%]' },
];

const ownerSidebarItems: Array<{ label: string; href: string; icon: string; activeIconClassName: string }> = [
	{ label: 'Beranda', href: ROUTES.OWNER.HOME, icon: '/Asset/icon/icon-house2.svg', activeIconClassName: 'brightness-0 saturate-100 invert-[42%] sepia-[68%] saturate-[1650%] hue-rotate-[337deg] brightness-[97%] contrast-[92%]' },
	{ label: 'Manajemen', href: ROUTES.OWNER.MANAGEMENT, icon: '/Asset/icon/icon-apartment.svg', activeIconClassName: 'brightness-0 saturate-100 invert-[42%] sepia-[68%] saturate-[1650%] hue-rotate-[337deg] brightness-[97%] contrast-[92%]' },
	{ label: 'Chat', href: ROUTES.OWNER.CHAT, icon: '/Asset/icon/icon-chat2.svg', activeIconClassName: 'brightness-0 saturate-100 invert-[42%] sepia-[68%] saturate-[1650%] hue-rotate-[337deg] brightness-[97%] contrast-[92%]' },
	{ label: 'Profil', href: ROUTES.OWNER.PROFILE, icon: '/Asset/icon/icon-profile.svg', activeIconClassName: 'brightness-0 saturate-100 invert-[42%] sepia-[68%] saturate-[1650%] hue-rotate-[337deg] brightness-[97%] contrast-[92%]' },
	{ label: 'Peliharaan Saya', href: ROUTES.OWNER.MYPET, icon: '/Asset/icon/icon-squirrel.svg', activeIconClassName: 'brightness-0 saturate-100 invert-[42%] sepia-[68%] saturate-[1650%] hue-rotate-[337deg] brightness-[97%] contrast-[92%]' },
];

type UserSidebarProps = {
	role?: 'user' | 'owner';
};

export default function UserSidebar({ role = 'user' }: UserSidebarProps) {
	const pathname = usePathname();
	const router = useRouter();
	const sidebarItems = role === 'owner' ? ownerSidebarItems : userSidebarItems;
	const homePath = role === 'owner' ? ROUTES.OWNER.HOME : ROUTES.USER.HOME;

	const handleLogout = () => {
		// TODO: Clear user session/token from localStorage or state management
		// Clear localStorage
		if (typeof window !== 'undefined') {
			localStorage.removeItem('token');
			localStorage.removeItem('user');
		}
		// Redirect to login
		router.push(ROUTES.LOGIN);
	};

	return (
		<aside className="sticky top-0 hidden h-screen w-[230px] shrink-0 border-r border-slate-200/80 bg-white/95 px-5 py-6 shadow-[8px_0_24px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-[8px_0_24px_rgba(0,0,0,0.25)] lg:flex lg:flex-col">
			<Link href={homePath} className="mb-10 flex items-center gap-2.5 px-1">
				<Image src="/Asset/easykos-logo.svg" alt="EasyKos" width={150} height={44} priority />
			</Link>

			<nav className="flex-1 space-y-2 overflow-y-auto pr-1">
				{sidebarItems.map(({ label, href, icon, activeIconClassName }) => {
					const active = href === homePath ? pathname === homePath : pathname === href || pathname.startsWith(`${href}/`);
					const getTourAttribute = () => {
						if (role === 'owner') {
							if (label === 'Beranda') return 'sidebar-home';
							if (label === 'Manajemen') return 'sidebar-management';
							if (label === 'Chat') return 'sidebar-chat';
							if (label === 'Profil') return 'sidebar-profile';
							if (label === 'Peliharaan Saya') return 'sidebar-mypet';
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
							className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition ${
								active
									? 'bg-[#fff1e7] text-[#BA6054] shadow-[inset_0_0_0_1px_rgba(186,96,84,0.10)] dark:bg-[#2f1d18] dark:text-[#e07b6d] dark:shadow-[inset_0_0_0_1px_rgba(224,123,109,0.14)]'
									: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
							}`}
						>
							<Image
								src={icon}
								alt={label}
								width={20}
								height={20}
								className={active ? activeIconClassName : 'brightness-0 saturate-100 opacity-60 dark:brightness-0 dark:invert dark:opacity-80'}
							/>
							<span>{label}</span>
						</Link>
					);
				})}
			</nav>

			<div className="mt-auto border-t border-slate-200 pt-4 dark:border-slate-800">
				<button
					onClick={handleLogout}
					data-tour={role === 'owner' ? 'owner-sidebar-logout' : 'user-sidebar-logout'}
					className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-[#c35f46] transition hover:bg-[#fbefeb] dark:text-[#f0b2a7] dark:hover:bg-slate-800"
				>
					<LogOut size={19} />
					<span>Keluar</span>
				</button>
			</div>
		</aside>
	);
}