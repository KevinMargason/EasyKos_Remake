import type { ReactNode } from 'react';
import UserSidebar from '@/component/user/UserSidebar';
import UserThemeToggle from '@/component/user/UserThemeToggle';

export default function UserLayout({ children }: { children: ReactNode }) {
	return (
		<main className="min-h-screen bg-[#f6f4f2] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
			<div className="flex min-h-screen">
				<UserSidebar />
				<section className="flex-1 px-5 py-5 sm:px-6 lg:px-8 lg:py-6 xl:px-10">
					<div className="mb-5 flex justify-end xl:mb-6">
						<UserThemeToggle />
					</div>
					{children}
				</section>
			</div>
		</main>
	);
}
