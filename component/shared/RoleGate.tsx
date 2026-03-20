'use client';

import type { ReactNode } from 'react';
import useRoleGuard from '@/core/hooks/useRoleGuard';
import { ROUTES } from '@/lib/routes';

type RoleGateProps = {
	allowedRoles: Array<'user' | 'owner'>;
	fallbackWhenNoRole?: string;
	children: ReactNode;
};

export default function RoleGate({ allowedRoles, fallbackWhenNoRole = ROUTES.LOGIN, children }: RoleGateProps) {
	const { isChecking } = useRoleGuard({ allowedRoles, fallbackWhenNoRole });

	if (isChecking) {
		return null;
	}

	return <>{children}</>;
}