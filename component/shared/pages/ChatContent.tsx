'use client';

import Image from 'next/image';
import { useMemo, useState, useEffect } from 'react';
import UserSectionTitle from '@/component/shared/UserSectionTitle';
import { toast } from 'sonner';
import { api } from '@/core/services/api';

type ChatSide = 'owner' | 'user';

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

// Local fallback threads if API is not available
const fallbackThreads: Thread[] = [
	{
		id: 1,
		name: 'Budi T. (Pemilik)',
		preview: 'AC di kos saya kurang dingin, Pak',
		time: '18.30',
		unread: true,
		messages: [
			{ from: 'owner', text: 'Biaya kosnya di sini berapa ya, Pak?' },
			{ from: 'user', text: 'Rp 1,5 juta, Nak. Itu sudah termasuk banyak fasilitas.' },
		],
	},
	{
		id: 2,
		name: 'Bambang',
		preview: 'Harga kos di sini berapa ya?',
		time: '24 Januari',
		unread: false,
		messages: [
			{ from: 'user', text: 'Harga kos di sini berapa ya?' },
			{ from: 'owner', text: 'Mulai Rp 1,5 juta per bulan ya, Pak.' },
		],
	},
];

function ThreadItem({ name, preview, time, active, unread, onClick }: { name: string; preview: string; time: string; active?: boolean; unread?: boolean; onClick: () => void }) {
	return (
		<button onClick={onClick} className={`glass-card flex w-full items-center gap-4 rounded-[14px] border-2 px-4 py-3 text-left shadow-[0_6px_16px_rgba(15,23,42,0.04)] transition hover:border-[#d9b1a7] dark:hover:border-[#f0b2a7] ${active ? 'border-[#c35f46]/40 bg-[#fff8f6] dark:border-[#f0b2a7]/35 dark:bg-[#2c1c18]' : 'border-[#e3d0c9] bg-white dark:border-slate-700 dark:bg-slate-900'}`}>
			<div className="relative">
				<Image src="/Asset/icon/icon-person.svg" alt="Akun pengguna" width={80} height={80} />
				{unread ? <span className="absolute -left-6 top-0 h-4 w-4 rounded-full bg-[#e65b42]" /> : null}
			</div>
			<div className="mb-3 min-w-0 flex-1">
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
			<div className={`max-w-[320px] rounded-[18px] px-5 py-4 text-[18px] shadow-[0_6px_14px_rgba(15,23,42,0.08)] sm:max-w-[380px] ${isOwner ? 'bg-[#c86654] text-white' : 'glass-card border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'}`}>{text}</div>
		</div>
	);
}

export default function ChatContent() {
	const [threads, setThreads] = useState<Thread[]>(fallbackThreads);
	const [selectedId, setSelectedId] = useState(1);
	const [messageInput, setMessageInput] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [isSending, setIsSending] = useState(false);

	// Load chats from API on mount
	useEffect(() => {
		const loadChats = async () => {
			try {
				setIsLoading(true);
				const response = await api.messages.getChats();
				if (response && Array.isArray(response)) {
					setThreads(response);
				}
			} catch (error: any) {
				console.warn('Failed to load chats from API, using fallback:', error.message);
				// Use fallback threads if API fails
				setThreads(fallbackThreads);
			} finally {
				setIsLoading(false);
			}
		};
		loadChats();
	}, []);

	const selected = useMemo(() => threads.find((thread) => thread.id === selectedId) ?? threads[0], [selectedId, threads]);

	const handleSendMessage = async () => {
		if (!messageInput.trim()) {
			return;
		}

		setIsSending(true);
		try {
			// Send message to API
			const response = await api.messages.sendMessage({
				thread_id: selectedId,
				content: messageInput,
			});

			// Update local state with the new message
			if (response) {
				setThreads((prevThreads) =>
					prevThreads.map((thread) =>
						thread.id === selectedId
							? {
									...thread,
									messages: [...thread.messages, { from: 'owner', text: messageInput }],
									preview: messageInput,
							  }
							: thread
					)
				);
				toast.success('Pesan terkirim!');
			}

			setMessageInput('');
		} catch (error: any) {
			console.error('Failed to send message:', error);
			toast.error(error.response?.data?.message || 'Gagal mengirim pesan');
		} finally {
			setIsSending(false);
		}
	};

	return (
		<div className="mx-auto grid max-w-[1180px] gap-5 lg:grid-cols-[300px_1fr]">
			<div className="space-y-4">
				<UserSectionTitle title="Pesan" />
				<div className="space-y-4">
					{threads.map((thread) => (
						<ThreadItem key={thread.id} name={thread.name} preview={thread.preview} time={thread.time} unread={thread.unread} active={thread.id === selectedId} onClick={() => setSelectedId(thread.id)} />
					))}
				</div>
			</div>

			<div className="glass-card flex min-h-[620px] flex-col overflow-hidden rounded-[16px] border-2 border-[#e3d0c9] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.05)] dark:border-slate-700/80 dark:bg-slate-900 dark:shadow-[0_12px_28px_rgba(0,0,0,0.25)]">
				<div className="border-b-2 border-[#e8d7d0] px-5 py-4 dark:border-slate-800">
					<div className="flex items-center gap-4">
						<Image src="/Asset/icon/icon-person.svg" alt="Akun pengguna" width={80} height={80} />
						<div className="mb-4 min-w-0">
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

				<div className="border-t-2 border-[#e8d7d0] px-5 py-5 dark:border-slate-800">
					<div className="glass-card flex items-center gap-3 rounded-full border border-[#e3d0c9] px-5 py-3 shadow-[0_6px_16px_rgba(15,23,42,0.04)] dark:border-slate-700/80 dark:shadow-[0_6px_16px_rgba(0,0,0,0.25)]">
						<input 
							type="text" 
							placeholder="Tulis pesan..." 
							value={messageInput}
							onChange={(e) => setMessageInput(e.target.value)}
							onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
							disabled={isSending}
							className="w-full bg-transparent text-[15px] outline-none placeholder:text-slate-400 dark:text-slate-100 disabled:opacity-50" 
						/>
						<button 
							onClick={handleSendMessage}
							disabled={isSending || !messageInput.trim()}
							className="text-[34px] leading-none font-bold text-[#c86654] transition hover:text-[#b45141] disabled:opacity-50 disabled:cursor-not-allowed"
						>
							&gt;
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}