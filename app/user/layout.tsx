'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import UserSidebar from '@/component/shared/UserSidebar';
import MobileNavBar from '@/component/shared/MobileNavBar';
import UserThemeToggle from '@/component/shared/UserThemeToggle';
import RoleGate from '@/component/shared/RoleGate';
import TourOverlay from '@/component/tour/TourOverlay';
import { useTour } from '@/core/hooks/useTour';
import { userDashboardTourSteps } from '@/core/tour/tourSteps';
import { ROUTES } from '@/lib/routes';

export default function UserLayout({ children }: { children: ReactNode }) {
	const [mounted, setMounted] = useState(false);
	const router = useRouter();
	const {
		currentStep,
		isVisible,
		hasCompletedTour,
		startTour,
		nextStep,
		previousStep,
		skipTour,
		completeTour,
	} = useTour('user-dashboard-v2');

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (mounted && !hasCompletedTour) {
			const timer = setTimeout(() => {
				startTour();
			}, 3500); // 3.5s to ensure ALL content loaded
			return () => clearTimeout(timer);
		}
	}, [mounted, hasCompletedTour, startTour]);

	if (!mounted) return <>{children}</>;

	const handleLogout = () => {
		if (typeof window !== 'undefined') {
			localStorage.removeItem('token');
			localStorage.removeItem('user');
		}
		router.push(ROUTES.LOGIN);
	};

	return (
		<main className="min-h-screen bg-[#f6f4f2] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
			<div className="flex min-h-screen flex-col lg:flex-row" data-tour="user-welcome">
				<UserSidebar />
				<section className="flex-1 px-5 py-5 pb-24 sm:px-6 lg:pb-0 lg:px-8 lg:py-6 xl:px-10">
					<div className="mb-5 flex items-center justify-end gap-2 xl:mb-6">
						<button
							onClick={handleLogout}
							data-tour="user-sidebar-logout"
							className="inline-flex items-center gap-2 rounded-lg border border-[#c35f46]/25 bg-white px-3 py-2 text-sm font-medium text-[#c35f46] transition hover:bg-[#fbefeb] dark:border-[#f0b2a7]/30 dark:bg-slate-900 dark:text-[#f0b2a7] dark:hover:bg-slate-800 lg:hidden"
							title="Keluar"
						>
							<LogOut size={16} />
							<span>Keluar</span>
						</button>
						<UserThemeToggle />
					</div>
					<RoleGate allowedRoles={['user']}>
						{children}
					</RoleGate>
				</section>
			</div>
			<MobileNavBar role="user" />

			{/* Tour Overlay */}
			<TourOverlay
				steps={userDashboardTourSteps}
				currentStep={currentStep}
				onNext={nextStep}
				onPrev={previousStep}
				onSkip={skipTour}
				onComplete={completeTour}
				isVisible={isVisible}
			/>

			{/* Tutorial Restart Button */}
			{hasCompletedTour && !isVisible && (
				<button
					onClick={startTour}
					className="fixed right-4 top-20 z-30 rounded-lg bg-[#c35f46] px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:bg-[#b8533d] hover:shadow-xl md:top-auto md:bottom-24 lg:bottom-4"
					title="Mulai tutorial lagi"
				>
					📖 Lihat Tutorial
				</button>
			)}
		</main>
	);
}
