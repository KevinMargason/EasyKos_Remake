'use client';

import Image from 'next/image';
import type { ComponentType } from 'react';
import { BadgeCheck, CalendarDays, Edit3, Mail, Phone, UserRound, Plus, Trash2, CreditCard } from 'lucide-react';
import { useState } from 'react';
import UserSectionTitle from '@/component/shared/UserSectionTitle';

type BankPayment = {
	id: number;
	type: 'bank';
	bankName: string;
	accountNumber: string;
	accountHolder: string;
};

type EWalletPayment = {
	id: number;
	type: 'gopay' | 'ovo';
	phone: string;
};

type PaymentMethod = BankPayment | EWalletPayment;

type NewPaymentState = Omit<BankPayment, 'id'> | Omit<EWalletPayment, 'id'>;

function InfoRow({ label, value, icon: Icon }: { label: string; value: string; icon?: ComponentType<{ size?: number; className?: string }> }) {
	return (
		<div className="glass-card flex items-center justify-between gap-4 rounded-[14px] border-2 border-[#e3d0c9] px-4 py-3 shadow-[0_6px_16px_rgba(15,23,42,0.04)] dark:border-slate-700/80">
			<div className="flex items-center gap-3">
				{Icon ? <Icon size={18} className="text-[#c35f46]" /> : null}
				<span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
			</div>
			<div className="text-[15px] font-medium text-slate-900 dark:text-slate-100">{value}</div>
		</div>
	);
}

export default function ProfileContent() {
	const [showAddPayment, setShowAddPayment] = useState(false);
	const [showEditProfile, setShowEditProfile] = useState(false);
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
		{ id: 1, type: 'bank', bankName: 'BCA', accountNumber: '1234567890', accountHolder: 'Budi T.' },
		{ id: 2, type: 'gopay', phone: '081234567890' },
	]);
	const [newPayment, setNewPayment] = useState<NewPaymentState>({ type: 'bank', bankName: '', accountNumber: '', accountHolder: '' });

	const handleAddPayment = () => {
		if (newPayment.type === 'bank' && newPayment.bankName && newPayment.accountNumber && newPayment.accountHolder) {
			const bankPayment: BankPayment = { id: Date.now(), ...newPayment };
			setPaymentMethods([...paymentMethods, bankPayment]);
			setNewPayment({ type: 'bank', bankName: '', accountNumber: '', accountHolder: '' });
			setShowAddPayment(false);
		} else if ((newPayment.type === 'gopay' || newPayment.type === 'ovo') && newPayment.phone) {
			const ewalletPayment: EWalletPayment = { id: Date.now(), ...newPayment };
			setPaymentMethods([...paymentMethods, ewalletPayment]);
			setNewPayment({ type: 'bank', bankName: '', accountNumber: '', accountHolder: '' });
			setShowAddPayment(false);
		}
	};

	const handleDeletePayment = (id: number) => {
		setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
	};
	return (
		<div className="mx-auto flex max-w-[980px] flex-col gap-5">
			<UserSectionTitle title="Profil" action={<button onClick={() => setShowEditProfile(true)} className="glass-card inline-flex items-center gap-2 rounded-full border border-[#e6b3a8] bg-[#fff3ef] px-4 py-2 text-sm font-semibold text-[#c35f46] dark:text-[#f0b2a7]"><Edit3 size={16} />Ubah Profil</button>} />

			<div className="grid gap-5 lg:grid-cols-[240px_1fr]">
				<div className="glass-card rounded-[20px] border-2 border-[#e3d0c9] p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)] dark:border-slate-700/80">
					<div className="flex flex-col items-center text-center">
						<Image src="/Asset/icon/icon-person.svg" alt="Akun pengguna" width={132} height={132} className="mt-4" />
						<h3 className="mt-4 text-[21px] font-semibold text-slate-900 dark:text-slate-100">Budi T.</h3>
						<p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Penyewa • Anggota Aktif</p>
						<div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#edf8f3] px-4 py-2 text-sm font-semibold text-[#1f8a57]">
							<BadgeCheck size={16} />
							Akun Terverifikasi
						</div>
					</div>

					<div className="mt-5 space-y-3">
						<div className="rounded-[14px] bg-[#f9fafb] px-4 py-3 text-center dark:bg-slate-800/80">
							<div className="text-sm text-slate-500 dark:text-slate-400">Peran</div>
							<div className="mt-1 text-[16px] font-semibold capitalize text-slate-900 dark:text-slate-100">penyewa</div>
						</div>
						<div className="rounded-[14px] bg-[#f9fafb] px-4 py-3 text-center dark:bg-slate-800/80">
							<div className="text-sm text-slate-500 dark:text-slate-400">Anggota sejak</div>
							<div className="mt-1 text-[16px] font-semibold text-slate-900 dark:text-slate-100">10 Jan 2026</div>
						</div>
					</div>
				</div>

				<div className="space-y-4">
					<div>
						<h3 className="mb-3 text-[18px] font-semibold text-slate-900 dark:text-slate-100">Informasi Dasar</h3>
						<div className="space-y-3">
							<InfoRow label="Nama Lengkap" value="Budi T." icon={UserRound} />
							<InfoRow label="No. HP" value="+62 812-3456-7890" icon={Phone} />
							<InfoRow label="Email" value="budi.t@example.com" icon={Mail} />
						</div>
					</div>

					<div>
						<h3 className="mb-3 text-[18px] font-semibold text-slate-900 dark:text-slate-100">Linimasa Akun</h3>
						<div className="grid gap-3 md:grid-cols-2">
							<InfoRow label="Bergabung" value="10 Jan 2026" icon={CalendarDays} />
							<InfoRow label="Terakhir Update" value="18 Mar 2026" icon={Edit3} />
						</div>
					</div>

					<div>
						<div className="mb-3 flex items-center justify-between">
							<h3 className="text-[18px] font-semibold text-slate-900 dark:text-slate-100">Metode Pembayaran</h3>
							{!showAddPayment && (
								<button
									onClick={() => setShowAddPayment(true)}
									className="glass-card inline-flex items-center gap-2 rounded-full border border-[#e6b3a8] bg-[#fff3ef] px-4 py-2 text-sm font-semibold text-[#c35f46] transition hover:bg-[#ffe8e0] dark:border-slate-700 dark:bg-slate-800 dark:text-[#f0b2a7] dark:hover:bg-slate-700"
								>
									<Plus size={16} />
									Tambah Metode
								</button>
							)}
						</div>

						{/* Daftar Metode Pembayaran */}
						<div className="space-y-3">
							{paymentMethods.map((method) => (
								<div
									key={method.id}
									className="glass-card flex items-center justify-between gap-4 rounded-[14px] border-2 border-[#e3d0c9] px-4 py-3 shadow-[0_6px_16px_rgba(15,23,42,0.04)] dark:border-slate-700/80"
								>
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff3ef] dark:bg-slate-800">
											{method.type === 'bank' ? (
												<CreditCard size={18} className="text-[#c35f46]" />
											) : method.type === 'gopay' ? (
												<Image src="/Asset/gopay-logo.svg" alt="GoPay" width={20} height={20} />
											) : (
												<Image src="/Asset/ovo.svg" alt="OVO" width={20} height={20} />
											)}
										</div>
										<div>
											<div className="text-sm font-medium text-slate-900 dark:text-slate-100">
												{method.type === 'bank'
													? `${method.bankName} - ${method.accountNumber}`
													: method.type === 'gopay'
													? `GoPay - ${method.phone}`
													: `OVO - ${method.phone}`}
											</div>
											<div className="text-xs text-slate-500 dark:text-slate-400">
												{method.type === 'bank' ? `a.n. ${method.accountHolder}` : method.type === 'gopay' ? 'E-Wallet' : 'E-Wallet'}
											</div>
										</div>
									</div>
									<button
										onClick={() => handleDeletePayment(method.id)}
										className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-slate-800 dark:hover:text-red-400"
									>
										<Trash2 size={18} />
									</button>
								</div>
							))}
						</div>

						{/* Form Tambah Metode Pembayaran */}
						{showAddPayment && (
							<div className="glass-card mt-4 rounded-[16px] border-2 border-[#e3d0c9] bg-white p-5 dark:border-slate-700/80 dark:bg-slate-900">
								<h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">Tambah Metode Pembayaran</h4>

								<div className="mb-4 space-y-3">
									<label className="block">
										<span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tipe Metode</span>
										<select
											value={newPayment.type}
											onChange={(e) => {
												const newType = e.target.value;
												if (newType === 'bank') {
													setNewPayment({ type: 'bank', bankName: '', accountNumber: '', accountHolder: '' });
												} else if (newType === 'gopay' || newType === 'ovo') {
													setNewPayment({ type: newType as 'gopay' | 'ovo', phone: '' });
												}
											}}
											className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-[#c86654] focus:outline-none focus:ring-1 focus:ring-[#c86654] dark:border-slate-600 dark:bg-slate-800 dark:text-white"
										>
											<option value="bank">Bank Transfer</option>
											<option value="gopay">GoPay</option>
											<option value="ovo">OVO</option>
										</select>
									</label>

									{newPayment.type === 'bank' && (
										<>
											<label className="block">
												<span className="text-sm font-medium text-slate-700 dark:text-slate-300">Nama Bank</span>
												<input
													type="text"
													placeholder="Contoh: BCA, Mandiri, BNI"
													value={newPayment.bankName}
													onChange={(e) => setNewPayment({ ...newPayment, bankName: e.target.value })}
													className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 transition focus:border-[#c86654] focus:outline-none focus:ring-1 focus:ring-[#c86654] dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
												/>
											</label>
											<label className="block">
												<span className="text-sm font-medium text-slate-700 dark:text-slate-300">Nomor Rekening</span>
												<input
													type="text"
													placeholder="Masukkan nomor rekening"
													value={newPayment.accountNumber}
													onChange={(e) => setNewPayment({ ...newPayment, accountNumber: e.target.value })}
													className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 transition focus:border-[#c86654] focus:outline-none focus:ring-1 focus:ring-[#c86654] dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
												/>
											</label>
											<label className="block">
												<span className="text-sm font-medium text-slate-700 dark:text-slate-300">Nama Pemilik Rekening</span>
												<input
													type="text"
													placeholder="Nama sesuai rekening"
													value={newPayment.accountHolder}
													onChange={(e) => setNewPayment({ ...newPayment, accountHolder: e.target.value })}
													className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 transition focus:border-[#c86654] focus:outline-none focus:ring-1 focus:ring-[#c86654] dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
												/>
											</label>
										</>
									)}

									{(newPayment.type === 'gopay' || newPayment.type === 'ovo') && (
										<label className="block">
											<span className="text-sm font-medium text-slate-700 dark:text-slate-300">Nomor Telepon</span>
											<input
												type="tel"
												placeholder="Contoh: 081234567890"
												value={newPayment.phone}
												onChange={(e) => setNewPayment({ ...newPayment, phone: e.target.value } as NewPaymentState)}
												className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 transition focus:border-[#c86654] focus:outline-none focus:ring-1 focus:ring-[#c86654] dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
											/>
										</label>
									)}
								</div>

								<div className="flex gap-3">
									<button
										onClick={handleAddPayment}
										className="flex-1 rounded-lg bg-[#c86654] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b55442] dark:bg-[#d97d6d] dark:hover:bg-[#e89080]"
									>
										Simpan
									</button>
									<button
										onClick={() => {
											setShowAddPayment(false);
											setNewPayment({ type: 'bank', bankName: '', accountNumber: '', accountHolder: '' });
										}}
										className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
									>
										Batal
									</button>
								</div>
							</div>
						)}
					</div>

					<div className="glass-card rounded-[20px] border-2 border-dashed border-[#dfb9ae] bg-[#fff8f6] p-5 text-sm leading-7 text-slate-600 dark:border-slate-700/80 dark:text-slate-300">
						<p className="font-semibold text-slate-900 dark:text-slate-100">Catatan komponen profil</p>
						<p className="mt-2">Kolom yang sudah ada di backend user: nama, no_hp, email, role, pin, created_at, updated_at. Nanti bagian ini tinggal dihubungkan ke data API.</p>
					</div>
				</div>
			</div>

			{/* Edit Profile Modal */}
			{showEditProfile && (
				<div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
					<div className="flex min-h-screen items-center justify-center p-4">
						<div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
							<div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
								<h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Ubah Profil</h2>
								<button
									onClick={() => setShowEditProfile(false)}
									className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
								>
									<Edit3 size={24} />
								</button>
							</div>

							<div className="space-y-6 p-6">
								<div className="space-y-4">
									<label className="block">
										<span className="text-sm font-medium text-slate-700 dark:text-slate-300">Nama Lengkap</span>
										<input
											type="text"
											defaultValue="Budi T."
											placeholder="Nama lengkap"
											className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 transition focus:border-[#c86654] focus:outline-none focus:ring-1 focus:ring-[#c86654] dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
										/>
									</label>

									<label className="block">
										<span className="text-sm font-medium text-slate-700 dark:text-slate-300">No. Telepon</span>
										<input
											type="tel"
											defaultValue="+62 812-3456-7890"
											placeholder="Nomor telepon"
											className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 transition focus:border-[#c86654] focus:outline-none focus:ring-1 focus:ring-[#c86654] dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
										/>
									</label>

									<label className="block">
										<span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</span>
										<input
											type="email"
											defaultValue="budi.t@example.com"
											placeholder="Email address"
											className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-500 transition focus:border-[#c86654] focus:outline-none focus:ring-1 focus:ring-[#c86654] dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
										/>
									</label>
								</div>

								<div className="flex gap-3">
									<button
										onClick={() => {
											console.log('Save profile changes');
											setShowEditProfile(false);
											// TODO: Send profile update to API
										}}
										className="flex-1 rounded-lg bg-[#c86654] px-4 py-3 font-semibold text-white transition hover:bg-[#b85d47]"
									>
										Simpan
									</button>
									<button
										onClick={() => setShowEditProfile(false)}
										className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
									>
										Batal
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}