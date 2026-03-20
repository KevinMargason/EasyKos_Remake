import type { ReactNode } from 'react';

type UserSectionTitleProps = {
	title: string;
	subtitle?: string;
	action?: ReactNode;
};

export default function UserSectionTitle({ title, subtitle, action }: UserSectionTitleProps) {
	return (
		<div className="flex items-center justify-between gap-4">
			<div>
				<h2 className="text-[24px] font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
				{subtitle ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
			</div>
			{action}
		</div>
	);
}
