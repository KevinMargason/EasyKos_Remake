'use client';

import { useMemo, useState } from 'react';
import UserAvatar from '../UserAvatar';
import UserSectionTitle from '../UserSectionTitle';

type ChatSide = 'owner' | 'tenant';

type Message = {
	from: ChatSide;
	text: string;
};

type Thread = {
	id: number;
	name: string;
	preview: string;
	time: string;
	unread: boolean;
	messages: Message[];
};

const threads: Thread[] = [
	{
		id: 1,
		name: 'Budi T. (Owner)',
		preview: 'Acnya kurang dingin di kos saya pak',
		time: '18.30',
		unread: true,
		messages: [
			{ from: 'owner', text: 'Biaya kosnya disini berapa ya pak?' },
			{ from: 'tenant', text: 'Rp 1,5jt nak, itu sudah include banyak' },
		],
	},
	{
		id: 2,
		name: 'Bambang',
		preview: 'Harga Kos di sini brapa ya?',
		time: '24 Januari',
		unread: false,
		messages: [
			{ from: 'tenant', text: 'Harga Kos di sini brapa ya?' },
			{ from: 'owner', text: 'Mulai Rp 1,5jt per bulan ya pak.' },
		],
	},
];

function ThreadItem({
	name,
	preview,
	time,
	active,
	unread,
	onClick,
}: {
	name: string;
	preview: string;
	time: string;
	active?: boolean;
	unread?: boolean;
	onClick: () => void;
}) {
	return (
		<button
			onClick={onClick}
			className={`glass-card flex w-full items-center gap-4 rounded-[14px] px-4 py-3 text-left shadow-[0_6px_16px_rgba(15,23,42,0.04)] transition hover:border-[#d9b1a7] dark:hover:border-[#f0b2a7] ${
				active ? 'border-[#c35f46]/30 bg-[#fff8f6] dark:border-[#f0b2a7]/25 dark:bg-[#2c1c18]' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
			}`}
		>
			<div className="relative">
				<UserAvatar size={52} />
				{unread ? <span className="absolute -left-6 top-0 h-4 w-4 rounded-full bg-[#e65b42]" /> : null}
			</div>
			<div className="min-w-0 flex-1">
				<div className="flex items-start justify-between gap-3">
					<div className="truncate text-[18px] font-semibold text-slate-900 dark:text-slate-100">{name}</div>
					<div className="shrink-0 text-sm text-slate-500 dark:text-slate-400">{time}</div>
				</div>
				<p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">{preview}</p>
			</div>
		</button>
	);
}

function Bubble({ text, side }: { text: string; side: ChatSide }) {
	const isOwner = side === 'owner';
	return (
		<div className={`flex ${isOwner ? 'justify-end' : 'justify-start'}`}>
			<div
				className={`max-w-[380px] rounded-[18px] px-5 py-4 text-[18px] shadow-[0_6px_14px_rgba(15,23,42,0.08)] ${
					isOwner ? 'bg-[#c86654] text-white' : 'glass-card border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
				}`}
			>
				{text}
			</div>
		</div>
	);
}

export default function ChatContent() {
	const [selectedId, setSelectedId] = useState(1);
	const selected = useMemo(() => threads.find((thread) => thread.id === selectedId) ?? threads[0], [selectedId]);

	return (
		<div className="mx-auto grid max-w-[1180px] gap-5 xl:grid-cols-[390px_1fr]">
			<div className="space-y-4">
				<UserSectionTitle title="Messages" />
				<div className="space-y-4">
					{threads.map((thread) => (
						<ThreadItem
							key={thread.id}
							name={thread.name}
							preview={thread.preview}
							time={thread.time}
							unread={thread.unread}
							active={thread.id === selectedId}
							onClick={() => setSelectedId(thread.id)}
						/>
					))}
				</div>
			</div>

			<div className="glass-card flex min-h-[620px] flex-col overflow-hidden rounded-[16px] shadow-[0_12px_28px_rgba(15,23,42,0.05)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.25)]">
				<div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
					<div className="flex items-center gap-4">
						<UserAvatar size={52} />
						<div>
							<div className="text-[20px] font-semibold text-slate-900 dark:text-slate-100">{selected.name}</div>
							<div className="text-sm text-slate-500 dark:text-slate-400">Online sekarang</div>
						</div>
					</div>
				</div>

				<div className="flex-1 space-y-6 overflow-y-auto px-5 py-6">
					{selected.messages.map((message, index) => (
						<Bubble key={`${message.text}-${index}`} text={message.text} side={message.from} />
					))}
				</div>

				<div className="border-t border-slate-200 px-5 py-5 dark:border-slate-800">
					<div className="glass-card flex items-center gap-3 rounded-full px-5 py-3 shadow-[0_6px_16px_rgba(15,23,42,0.04)] dark:shadow-[0_6px_16px_rgba(0,0,0,0.25)]">
						<input
							type="text"
							placeholder="Tulis pesan..."
							className="w-full bg-transparent text-[15px] outline-none placeholder:text-slate-400 dark:text-slate-100"
						/>
						<button className="text-[34px] leading-none font-bold text-[#c86654] transition hover:text-[#b45141]">&gt;</button>
					</div>
				</div>
			</div>
		</div>
	);
}
