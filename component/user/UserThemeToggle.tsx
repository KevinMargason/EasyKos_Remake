'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/component/ThemeProvider';

export default function UserThemeToggle() {
	const { theme, toggle } = useTheme();

	return (
		<button
			type="button"
			onClick={toggle}
			aria-label="Toggle theme"
			className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-[14px] font-medium text-slate-700 shadow-[0_6px_18px_rgba(15,23,42,0.05)] transition hover:border-[#c35f46] hover:text-[#c35f46] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:shadow-[0_6px_18px_rgba(0,0,0,0.25)] dark:hover:border-[#f0b2a7] dark:hover:text-[#f0b2a7]"
		>
			{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
			<span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
		</button>
	);
}
