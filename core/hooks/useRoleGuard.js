"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/core/store/hooks";
import { ROLE_HOME, ROUTES, normalizeRole } from "@/lib/routes";

/**
 * @typedef {Object} UseRoleGuardOptions
 * @property {Array<'user' | 'owner'>=} allowedRoles
 * @property {string=} fallbackWhenNoRole
 * @property {Record<'user' | 'owner', string>=} roleHome
 */

/**
 * @param {UseRoleGuardOptions} [options]
 */
export const useRoleGuard = ({
    allowedRoles,
    fallbackWhenNoRole = ROUTES.LOGIN,
    roleHome = ROLE_HOME,
} = /** @type {UseRoleGuardOptions} */ ({})) => {
    const router = useRouter();
    const pathname = usePathname();
    const roleFromStore = useAppSelector((state) => state.role.role);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const resolvedRole = normalizeRole(
            roleFromStore ||
            (typeof window !== "undefined" ? localStorage.getItem("role") : null)
        );

        if (!resolvedRole) {
            if (fallbackWhenNoRole) {
                router.replace(`${fallbackWhenNoRole}?from=${encodeURIComponent(pathname)}`);
            }
            return;
        }

        const normalizedAllowedRoles = allowedRoles?.map(normalizeRole).filter(Boolean);
        const isAllowed = !normalizedAllowedRoles || normalizedAllowedRoles.includes(resolvedRole);
        if (!isAllowed) {
            const target = roleHome[resolvedRole] || "/";
            if (pathname !== target) router.replace(target);
            return;
        }

        queueMicrotask(() => setIsChecking(false));
    }, [allowedRoles, fallbackWhenNoRole, pathname, roleFromStore, roleHome, router]);

    return { isChecking };
};

export default useRoleGuard;