'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/component/ThemeProvider';

export default function UserThemeToggle() {
	const { theme, toggle } = useTheme();

	return (
		<button type="button" onClick={toggle} aria-label="Toggle theme" className="glass-chip inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[14px] font-medium transition">
			{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
			<span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
		</button>
	);
}