'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
	Home,
	Store,
	MessageCircle,
	UserRound,
	Sparkles,
	LogOut,
	type LucideIcon,
} from 'lucide-react';

const sidebarItems: Array<{ label: string; href: string; icon: LucideIcon }> = [
	{ label: 'Home', href: '/user', icon: Home },
	{ label: 'MyKos', href: '/user/mykos', icon: Store },
	{ label: 'Chat', href: '/user/chat', icon: MessageCircle },
	{ label: 'Profile', href: '/user/profile', icon: UserRound },
	{ label: 'MyPet', href: '/user/mypet', icon: Sparkles },
];

export default function UserSidebar() {
	const pathname = usePathname();

	return (
		<aside className="sticky top-0 hidden h-screen w-[230px] shrink-0 border-r border-slate-200/80 bg-white/95 px-5 py-6 shadow-[8px_0_24px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-[8px_0_24px_rgba(0,0,0,0.25)] lg:flex lg:flex-col">
			<Link href="/user" className="mb-10 flex items-center gap-2.5 px-1">
				<Image src="/Asset/easykos-logo.svg" alt="EasyKos" width={150} height={44} priority />
			</Link>

			<nav className="flex-1 space-y-2 overflow-y-auto pr-1">
				{sidebarItems.map(({ label, href, icon: Icon }) => {
					const active = label === 'Home' ? pathname === '/user' : pathname === href || pathname.startsWith(`${href}/`);
					return (
						<Link
							key={label}
							href={href}
							className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition ${
								active
									? 'bg-[#f8ece8] text-[#c35f46] shadow-[inset_0_0_0_1px_rgba(195,95,70,0.08)] dark:bg-[#2f1d18] dark:text-[#f0b2a7] dark:shadow-[inset_0_0_0_1px_rgba(240,178,167,0.12)]'
									: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
							}`}
						>
							<Icon size={19} className={active ? 'text-[#c35f46]' : 'text-slate-500'} />
							<span>{label}</span>
						</Link>
					);
				})}
			</nav>

			<div className="mt-auto border-t border-slate-200 pt-4 dark:border-slate-800">
				<button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-[#c35f46] transition hover:bg-[#fbefeb] dark:text-[#f0b2a7] dark:hover:bg-slate-800">
					<LogOut size={19} />
					<span>Log Out</span>
				</button>
			</div>
		</aside>
	);
}
