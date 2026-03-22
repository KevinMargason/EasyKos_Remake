import type { ReactNode } from 'react';
import UserSidebar from '@/component/shared/UserSidebar';
import MobileNavBar from '@/component/shared/MobileNavBar';
import UserThemeToggle from '@/component/shared/UserThemeToggle';
import RoleGate from '@/component/shared/RoleGate';

export default function OwnerLayout({ children }: { children: ReactNode }) {
	return (
		<main className="min-h-screen bg-[#f6f4f2] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
			<div className="flex min-h-screen flex-col lg:flex-row">
				<UserSidebar role="owner" />
				<section className="flex-1 px-5 py-5 pb-24 sm:px-6 lg:pb-0 lg:px-8 lg:py-6 xl:px-10">
					<div className="mb-5 flex justify-end xl:mb-6">
						<UserThemeToggle />
					</div>
					<RoleGate allowedRoles={['owner']}>
						{children}
					</RoleGate>
				</section>
			</div>
			<MobileNavBar role="owner" />
		</main>
	);
}