'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/core/store/hooks';
import { ROLE_HOME, ROUTES, normalizeRole } from '@/lib/routes';

type RoleGateProps = {
	allowedRoles: Array<'tenant' | 'owner'>;
	fallbackWhenNoRole?: string;
	children: ReactNode;
};

export default function RoleGate({ allowedRoles, fallbackWhenNoRole = ROUTES.LOGIN, children }: RoleGateProps) {
	const router = useRouter();
	const pathname = usePathname();
	const roleFromStore = useAppSelector((state: any) => state.role.role);
	const [isChecking, setIsChecking] = useState(true);

	useEffect(() => {
		const resolvedRole = normalizeRole(
			roleFromStore || (typeof window !== 'undefined' ? localStorage.getItem('role') : null)
		);

		if (!resolvedRole) {
			router.replace(`${fallbackWhenNoRole}?from=${encodeURIComponent(pathname)}`);
			return;
		}

		const normalizedAllowedRoles = allowedRoles.map(normalizeRole).filter(Boolean);
		if (!normalizedAllowedRoles.includes(resolvedRole)) {
			const target = ROLE_HOME[resolvedRole] || ROUTES.HOME;
			if (pathname !== target) {
				router.replace(target);
			}
			return;
		}

		setIsChecking(false);
	}, [allowedRoles, fallbackWhenNoRole, pathname, roleFromStore, router]);

	if (isChecking) return null;

	return <>{children}</>;
}