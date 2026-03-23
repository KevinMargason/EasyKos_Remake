'use client';

import Image from 'next/image';
import type { ComponentType } from 'react';
import { BadgeCheck, CalendarDays, Edit3, Mail, Phone, UserRound, X, CreditCard, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import UserSectionTitle from '@/component/shared/UserSectionTitle';
import { useAppSelector, useAppDispatch } from '@/core/store/hooks';
import { usePayments } from '@/core/hooks/usePayments';
import { toast } from 'sonner';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { setUser } from '@/core/feature/user/userSlice';
import { api } from '@/core/services/api';

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

const editProfileSchema = Yup.object({
	name: Yup.string()
		.min(3, 'Nama minimal 3 karakter')
		.max(255, 'Nama maksimal 255 karakter')
		.required('Nama harus diisi'),
	no_hp: Yup.string()
		.matches(/^(\+62|0)[0-9]{9,12}$/, 'Nomor HP tidak valid')
		.required('Nomor HP harus diisi'),
	email: Yup.string()
		.email('Email tidak valid')
		.required('Email harus diisi'),
});

export default function ProfileContent() {
	const user = useAppSelector((state: any) => state.user.user);
	const dispatch = useAppDispatch();
	const { paymentMethods, deletePaymentMethod, createPaymentMethod, fetchPaymentMethods } = usePayments();
	const [showEditProfile, setShowEditProfile] = useState(false);
	const [showAddPayment, setShowAddPayment] = useState(false);
	const [paymentType, setPaymentType] = useState<'bank' | 'ewallet' | null>(null);
	const [isLoadingPayment, setIsLoadingPayment] = useState(false);

	// Bank Transfer Form State
	const [bankForm, setBankForm] = useState({
		bankName: '',
		accountNumber: '',
		accountHolder: '',
	});

	// E-Wallet Form State
	const [ewalletForm, setEwalletForm] = useState({
		ewallet_type: 'gopay',
		phoneNumber: '',
		accountHolder: '',
	});

	// Load payment methods on mount
	useEffect(() => {
		fetchPaymentMethods();
	}, [fetchPaymentMethods]);

	const formik = useFormik({
		initialValues: {
			name: user?.name || '',
			no_hp: user?.no_hp || '',
			email: user?.email || '',
		},
		validationSchema: editProfileSchema,
		enableReinitialize: true,
		onSubmit: async (values) => {
			try {
				// Call backend API to update profile
				const response = await api.auth.updateProfile({
					name: values.name,
					no_hp: values.no_hp,
					email: values.email,
				});

				if (response.success) {
					const updatedUser = {
						...user,
						...values,
						updated_at: new Date().toISOString(),
					};
					
					// Update Redux store
					dispatch(setUser(updatedUser));
					
					// Update localStorage
					if (typeof window !== 'undefined') {
						localStorage.setItem('user', JSON.stringify(updatedUser));
					}
					
					// Show appropriate toast message
					if (response.isLocalOnly) {
						toast.warning('Profil disimpan secara lokal. Backend belum diupdate.');
					} else {
						toast.success('Profil berhasil diperbarui!');
					}
					setShowEditProfile(false);
				} else {
					toast.error(response.message || 'Gagal memperbarui profil');
				}
			} catch (error: any) {
				console.error('Profile update error:', error);
				toast.error(error?.response?.data?.message || error?.message || 'Gagal memperbarui profil');
			}
		},
	});

	const { handleSubmit, handleChange, handleBlur, values, errors, touched, isSubmitting } = formik;

	if (!user) {
		return (
			<div className="mx-auto flex max-w-[980px] flex-col gap-5">
				<UserSectionTitle title="Profil" />
				<p className="text-center text-slate-500">Silakan login terlebih dahulu untuk melihat profil Anda</p>
			</div>
		);
	}

	return (
		<div className="mx-auto flex max-w-[980px] flex-col gap-5">
			<UserSectionTitle title="Profil" action={<button onClick={() => setShowEditProfile(true)} className="glass-card inline-flex items-center gap-2 rounded-full border border-[#e6b3a8] bg-[#fff3ef] px-4 py-2 text-sm font-semibold text-[#c35f46] dark:text-[#f0b2a7]"><Edit3 size={16} />Ubah Profil</button>} />

			<div className="grid gap-5 lg:grid-cols-[240px_1fr]">
				<div className="glass-card rounded-[20px] border-2 border-[#e3d0c9] p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)] dark:border-slate-700/80">
					<div className="flex flex-col items-center text-center">
						<Image src="/Asset/icon/icon-person.svg" alt="Akun pengguna" width={132} height={132} className="mt-4" />
						<h3 className="mt-4 text-[21px] font-semibold text-slate-900 dark:text-slate-100">{user?.name || 'Pengguna'}</h3>
						<p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
							{user?.role === 'owner' ? 'Pemilik Kos' : 'Penyewa'} • Anggota Aktif
						</p>
						<div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#edf8f3] px-4 py-2 text-sm font-semibold text-[#1f8a57]">
							<BadgeCheck size={16} />
							Akun Terverifikasi
						</div>
					</div>

					<div className="mt-5 space-y-3">
						<div className="rounded-[14px] bg-[#f9fafb] px-4 py-3 text-center dark:bg-slate-800/80">
							<div className="text-sm text-slate-500 dark:text-slate-400">Peran</div>
							<div className="mt-1 text-[16px] font-semibold capitalize text-slate-900 dark:text-slate-100">
								{user?.role === 'owner' ? 'Pemilik Kos' : 'Penyewa'}
							</div>
						</div>
						<div className="rounded-[14px] bg-[#f9fafb] px-4 py-3 text-center dark:bg-slate-800/80">
							<div className="text-sm text-slate-500 dark:text-slate-400">Anggota sejak</div>
							<div className="mt-1 text-[16px] font-semibold text-slate-900 dark:text-slate-100">
								{user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
							</div>
						</div>
					</div>
				</div>

				<div className="space-y-4">
					<div>
						<h3 className="mb-3 text-[18px] font-semibold text-slate-900 dark:text-slate-100">Informasi Dasar</h3>
						<div className="space-y-3">
							<InfoRow label="Nama Lengkap" value={user?.name || '-'} icon={UserRound} />
							<InfoRow label="No. HP" value={user?.no_hp || '-'} icon={Phone} />
							<InfoRow label="Email" value={user?.email || '-'} icon={Mail} />
						</div>
					</div>

					<div>
						<h3 className="mb-3 text-[18px] font-semibold text-slate-900 dark:text-slate-100">Linimasa Akun</h3>
						<div className="grid gap-3 md:grid-cols-2">
							<InfoRow 
								label="Bergabung" 
								value={user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID') : '-'} 
								icon={CalendarDays} 
							/>
							<InfoRow 
								label="Terakhir Update" 
								value={user?.updated_at ? new Date(user.updated_at).toLocaleDateString('id-ID') : '-'} 
								icon={Edit3} 
							/>
						</div>
					</div>

					{/* Metode Pembayaran Section - Only for Owner */}
					{user?.role === 'owner' && (
						<div>
							<div className="mb-3 flex items-center justify-between">
								<h3 className="text-[18px] font-semibold text-slate-900 dark:text-slate-100">Metode Pembayaran</h3>
								<button
									onClick={() => setShowAddPayment(true)}
									className="glass-card inline-flex items-center gap-2 rounded-full border border-[#e6b3a8] bg-[#fff3ef] px-3 py-1.5 text-sm font-medium text-[#c35f46] transition hover:bg-[#ffeae2] dark:border-slate-600 dark:bg-slate-800 dark:text-[#f0b2a7] dark:hover:bg-slate-700"
								>
									<Plus size={16} />
									Tambah
								</button>
							</div>
							<div className="space-y-3">
								{paymentMethods && paymentMethods.length > 0 ? (
									paymentMethods.map((method: any) => (
										<div
											key={method.id}
											className="glass-card flex items-center justify-between gap-4 rounded-[14px] border-2 border-[#e3d0c9] px-4 py-3 shadow-[0_6px_16px_rgba(15,23,42,0.04)] dark:border-slate-700/80"
										>
											<div className="flex items-center gap-3">
												<div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff3ef] dark:bg-slate-800">
													<CreditCard size={18} className="text-[#c35f46]" />
												</div>
												<div>
													<div className="text-sm font-medium text-slate-900 dark:text-slate-100">
														{method.type === 'bank' ? `${method.name}` : `${method.type.toUpperCase()}`}
													</div>
													<div className="text-xs text-slate-500 dark:text-slate-400">
														{method.account_number || method.phone_number || 'Metode pembayaran'}
													</div>
												</div>
											</div>
											<button
												onClick={() => {
													deletePaymentMethod(method.id).catch(() => toast.error('Gagal menghapus'));
												}}
												className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-slate-800 dark:hover:text-red-400"
											>
												<Trash2 size={18} />
											</button>
										</div>
									))
								) : (
									<div className="rounded-[14px] border-2 border-dashed border-slate-200 px-4 py-6 text-center dark:border-slate-700">
										<CreditCard size={32} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
										<p className="text-sm font-medium text-slate-600 dark:text-slate-400">Belum ada metode pembayaran</p>
										<p className="mt-1 text-xs text-slate-500 dark:text-slate-500">Tambahkan metode pembayaran untuk menerima uang dari penyewa</p>
									</div>
								)}
							</div>
						</div>
					)}
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
									<X size={24} />
								</button>
							</div>

							<form onSubmit={handleSubmit} className="space-y-6 p-6">
								<div>
									<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nama Lengkap</label>
									<input
										type="text"
										name="name"
										value={values.name}
										onChange={handleChange}
										onBlur={handleBlur}
										className={`mt-2 w-full rounded-lg border-2 bg-white px-4 py-2 dark:bg-slate-800 ${
											touched.name && errors.name
												? 'border-red-500'
												: 'border-slate-200 dark:border-slate-600'
										} text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#c35f46]`}
										placeholder="Masukkan nama lengkap"
									/>
									{touched.name && errors.name && (
										<p className="mt-1 text-xs text-red-600">{String(errors.name)}</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">No. Telepon</label>
									<input
										type="tel"
										name="no_hp"
										value={values.no_hp}
										onChange={handleChange}
										onBlur={handleBlur}
										className={`mt-2 w-full rounded-lg border-2 bg-white px-4 py-2 dark:bg-slate-800 ${
											touched.no_hp && errors.no_hp
												? 'border-red-500'
												: 'border-slate-200 dark:border-slate-600'
										} text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#c35f46]`}
										placeholder="Masukkan nomor telepon"
									/>
									{touched.no_hp && errors.no_hp && (
										<p className="mt-1 text-xs text-red-600">{String(errors.no_hp)}</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
									<input
										type="email"
										name="email"
										value={values.email}
										onChange={handleChange}
										onBlur={handleBlur}
										className={`mt-2 w-full rounded-lg border-2 bg-white px-4 py-2 dark:bg-slate-800 ${
											touched.email && errors.email
												? 'border-red-500'
												: 'border-slate-200 dark:border-slate-600'
										} text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#c35f46]`}
										placeholder="Masukkan email"
									/>
									{touched.email && errors.email && (
										<p className="mt-1 text-xs text-red-600">{String(errors.email)}</p>
									)}
								</div>

								<div className="flex gap-3 pt-4">
									<button
										type="button"
										onClick={() => setShowEditProfile(false)}
										className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
									>
										Batal
									</button>
									<button
										type="submit"
										disabled={isSubmitting}
										className="flex-1 rounded-lg bg-[#c35f46] px-4 py-3 font-semibold text-white transition hover:bg-[#b85d47] disabled:opacity-50 dark:bg-[#c35f46] dark:hover:bg-[#b85d47]"
									>
										{isSubmitting ? 'Menyimpan...' : 'Simpan'}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}

			{/* Add Payment Method Modal - Only for Owner */}
			{showAddPayment && user?.role === 'owner' && (
				<div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
					<div className="flex min-h-screen items-center justify-center p-4">
						<div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
							<div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
								<h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
									{paymentType ? 'Tambah Metode Pembayaran' : 'Pilih Tipe Pembayaran'}
								</h2>
								<button
									onClick={() => {
										setShowAddPayment(false);
										setPaymentType(null);
										setBankForm({ bankName: '', accountNumber: '', accountHolder: '' });
										setEwalletForm({ ewallet_type: 'gopay', phoneNumber: '', accountHolder: '' });
									}}
									className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
								>
									<X size={24} />
								</button>
							</div>

							<div className="space-y-4 p-6">
								{!paymentType ? (
									<>
										<div>
											<h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Pilih Tipe Pembayaran</h3>
											<div className="grid grid-cols-2 gap-3">
												<button
													onClick={() => setPaymentType('bank')}
													className="rounded-lg border-2 border-slate-200 px-4 py-4 text-center transition hover:border-[#c35f46] dark:border-slate-700 dark:hover:border-[#c35f46]"
												>
													<CreditCard size={24} className="mx-auto mb-2 text-[#c35f46]" />
													<p className="text-sm font-medium text-slate-900 dark:text-slate-100">Transfer Bank</p>
												</button>
												<button
													onClick={() => setPaymentType('ewallet')}
													className="rounded-lg border-2 border-slate-200 px-4 py-4 text-center transition hover:border-[#c35f46] dark:border-slate-700 dark:hover:border-[#c35f46]"
												>
													<CreditCard size={24} className="mx-auto mb-2 text-[#c35f46]" />
													<p className="text-sm font-medium text-slate-900 dark:text-slate-100">E-Wallet</p>
												</button>
											</div>
										</div>

										<div className="pt-2">
											<p className="text-xs text-slate-500 dark:text-slate-400">Pilih tipe pembayaran untuk melanjutkan proses penambahan metode pembayaran penerima dana.</p>
										</div>

										<button
											onClick={() => setShowAddPayment(false)}
											className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
										>
											Batal
										</button>
									</>
								) : paymentType === 'bank' ? (
									// Bank Transfer Form
									<form
										onSubmit={async (e) => {
											e.preventDefault();
											setIsLoadingPayment(true);
											try {
												await createPaymentMethod({
													type: 'bank',
													name: bankForm.bankName,
													account_number: bankForm.accountNumber,
													account_holder: bankForm.accountHolder,
												});
												toast.success('Metode pembayaran berhasil ditambahkan!');
												setShowAddPayment(false);
												setPaymentType(null);
												setBankForm({ bankName: '', accountNumber: '', accountHolder: '' });
											} catch (error: any) {
												toast.error(error.response?.data?.message || 'Gagal menambahkan metode pembayaran');
												console.error('Payment method error:', error);
											} finally {
												setIsLoadingPayment(false);
											}
										}}
										className="space-y-4"
									>
										<div>
											<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nama Bank</label>
											<select
												value={bankForm.bankName}
												onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
												required
												className="mt-2 w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
											>
												<option value="">Pilih Bank</option>
												<option value="BCA">BCA</option>
												<option value="Mandiri">Mandiri</option>
												<option value="BNI">BNI</option>
												<option value="BRI">BRI</option>
												<option value="CIMB">CIMB Niaga</option>
												<option value="Danamon">Danamon</option>
												<option value="Permata">Permata</option>
												<option value="Maybank">Maybank</option>
											</select>
										</div>

										<div>
											<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nomor Rekening</label>
											<input
												type="text"
												value={bankForm.accountNumber}
												onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
												placeholder="Contoh: 1234567890"
												required
												className="mt-2 w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Atas Nama</label>
											<input
												type="text"
												value={bankForm.accountHolder}
												onChange={(e) => setBankForm({ ...bankForm, accountHolder: e.target.value })}
												placeholder="Nama pemilik rekening"
												required
												className="mt-2 w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
											/>
										</div>

										<div className="flex gap-3 pt-4">
											<button
												type="button"
												onClick={() => setPaymentType(null)}
												className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
											>
												Kembali
											</button>
											<button
												type="submit"
												disabled={isLoadingPayment}
												className="flex-1 rounded-lg bg-[#c35f46] px-4 py-3 font-semibold text-white transition hover:bg-[#b8533d] disabled:opacity-50"
											>
												{isLoadingPayment ? 'Menyimpan...' : 'Simpan'}
											</button>
										</div>
									</form>
								) : (
									// E-Wallet Form
									<form
										onSubmit={async (e) => {
											e.preventDefault();
											setIsLoadingPayment(true);
											try {
												await createPaymentMethod({
													type: 'ewallet',
													ewallet_type: ewalletForm.ewallet_type,
													phone_number: ewalletForm.phoneNumber,
													account_holder: ewalletForm.accountHolder,
												});
												toast.success('Metode pembayaran berhasil ditambahkan!');
												setShowAddPayment(false);
												setPaymentType(null);
												setEwalletForm({ ewallet_type: 'gopay', phoneNumber: '', accountHolder: '' });
											} catch (error: any) {
												toast.error(error.response?.data?.message || 'Gagal menambahkan metode pembayaran');
												console.error('Payment method error:', error);
											} finally {
												setIsLoadingPayment(false);
											}
										}}
										className="space-y-4"
									>
										<div>
											<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tipe E-Wallet</label>
											<select
												value={ewalletForm.ewallet_type}
												onChange={(e) => setEwalletForm({ ...ewalletForm, ewallet_type: e.target.value })}
												className="mt-2 w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
											>
												<option value="gopay">GoPay</option>
												<option value="ovo">OVO</option>
												<option value="dana">DANA</option>
												<option value="linkaja">LinkAja</option>
											</select>
										</div>

										<div>
											<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nomor HP</label>
											<input
												type="tel"
												value={ewalletForm.phoneNumber}
												onChange={(e) => setEwalletForm({ ...ewalletForm, phoneNumber: e.target.value })}
												placeholder="Contoh: 08123456789"
												required
												className="mt-2 w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Atas Nama</label>
											<input
												type="text"
												value={ewalletForm.accountHolder}
												onChange={(e) => setEwalletForm({ ...ewalletForm, accountHolder: e.target.value })}
												placeholder="Nama pemilik e-wallet"
												required
												className="mt-2 w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-2 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
											/>
										</div>

										<div className="flex gap-3 pt-4">
											<button
												type="button"
												onClick={() => setPaymentType(null)}
												className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
											>
												Kembali
											</button>
											<button
												type="submit"
												disabled={isLoadingPayment}
												className="flex-1 rounded-lg bg-[#c35f46] px-4 py-3 font-semibold text-white transition hover:bg-[#b8533d] disabled:opacity-50"
											>
												{isLoadingPayment ? 'Menyimpan...' : 'Simpan'}
											</button>
										</div>
									</form>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
