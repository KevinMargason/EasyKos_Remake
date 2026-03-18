import { UserRound } from 'lucide-react';

export default function UserAvatar({ size = 58 }: { size?: number }) {
	const innerSize = Math.max(size - 14, 24);

	return (
		<div
			className="flex items-center justify-center rounded-full bg-white shadow-[0_10px_24px_rgba(15,23,42,0.14)]"
			style={{ width: size, height: size }}
		>
			<div
				className="flex items-center justify-center rounded-full bg-slate-700 text-white"
				style={{ width: innerSize, height: innerSize }}
			>
				<UserRound size={Math.round(innerSize * 0.58)} strokeWidth={1.8} />
			</div>
		</div>
	);
}
