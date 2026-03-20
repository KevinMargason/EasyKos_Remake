'use client';

import type { ReactNode } from 'react';

type RoleGateProps = {
	allowedRoles: Array<'user' | 'owner'>;
	fallbackWhenNoRole?: string;
	children: ReactNode;
};

export default function RoleGate({ children }: RoleGateProps) {
	return <>{children}</>;
}