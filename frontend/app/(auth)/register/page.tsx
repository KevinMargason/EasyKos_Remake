'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Eye, EyeOff, Home, House, Search, ArrowLeft } from 'lucide-react';

type RoleType = 'owner' | 'tenant';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [formData, setFormData] = useState({
    nama: '',
    no_hp: '',
    pin: '',
    confirmPin: '',
    email: '',
    role: 'owner' as RoleType,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'no_hp') {
      setFormData({ ...formData, [name]: value.replace(/[^0-9]/g, '') });
    } else if (name === 'pin') {
      setFormData({ ...formData, [name]: value.slice(0, 30) });
    } else if (name === 'confirmPin') {
      setFormData({ ...formData, [name]: value.slice(0, 30) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRoleSelect = (role: RoleType) => {
    setFormData({ ...formData, role });
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (formData.nama.length < 3) {
      setError('Nama harus minimal 3 karakter');
      setLoading(false);
      return;
    }
    if (formData.no_hp.length < 10) {
      setError('Nomor HP harus minimal 10 digit');
      setLoading(false);
      return;
    }
    if (formData.pin.length < 6) {
      setError('Password minimal 6 karakter');
      setLoading(false);
      return;
    }
    if (formData.pin !== formData.confirmPin) {
      setError('Password dan Confirm Password tidak sama');
      setLoading(false);
      return;
    }

    try {
      const response = await api.register(
        formData.nama,
        formData.no_hp,
        formData.pin,
        formData.email || null,
        formData.role,
      );

      if (response.status === "success" && response.data) {
        setSuccess("Pendaftaran berhasil! Redirecting ke login...");
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(response.message || 'Pendaftaran gagal');
      }
    } catch (error) {
      console.error('gagal registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  const isOwner = formData.role === 'owner';

  return (
    <div className="min-h-screen bg-[linear-gradient(225deg,#f5c9c2_0%,#fae4e1_30%,#fdf3f1_65%,#ffffff_95%)] px-4 py-10 dark:bg-[linear-gradient(225deg,#2d1512_0%,#1e1a2e_40%,#111827_70%,#0f172a_100%)] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[980px] items-center justify-center">
        <div className="glass-card animate-fade-in-up w-full max-w-[640px] rounded-[20px] px-7 py-7 sm:px-8 sm:py-8">
          {step === 'role' && (
          <div className="animate-fade-in py-4 sm:py-8">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-[15px] text-[#7e6a66] transition hover:text-[#BA6054] dark:text-slate-400 dark:hover:text-[#e07b6d]"
              >
                <ArrowLeft size={16} />
                Kembali ke beranda
              </Link>
              <div className="mx-auto mt-4 grid max-w-[500px] grid-cols-2 gap-6">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('tenant')}
                  className="group transition hover:scale-105 active:scale-100"
                >
                  <div className="mx-auto flex h-[92px] w-[92px] items-center justify-center rounded-full bg-[#F8EFEE] text-[#BA6054] transition group-hover:opacity-85 dark:bg-[#3d2820] dark:text-[#e07b6d]">
                    <Search size={58} strokeWidth={1.5} />
                  </div>
                  <div className="glass-role-option mt-3 flex h-[66px] w-full items-center justify-center rounded-[20px] text-[42px] font-medium text-[#BA6054] dark:text-[#f5d1cb]">
                    Cari Kos
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('owner')}
                  className="group transition hover:scale-105 active:scale-100"
                >
                  <div className="mx-auto flex h-[92px] w-[92px] items-center justify-center rounded-full bg-[#F8EFEE] text-[#BA6054] transition group-hover:opacity-85 dark:bg-[#3d2820] dark:text-[#e07b6d]">
                    <Home size={58} strokeWidth={1.5} />
                  </div>
                  <div className="glass-role-option mt-3 flex h-[66px] w-full items-center justify-center rounded-[20px] text-[42px] font-medium text-[#BA6054] dark:text-[#f5d1cb]">
                    Pemilik Kos
                  </div>
                </button>
              </div>

              <div className="mt-8 text-center text-[17px] text-[#244454] dark:text-slate-400">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-[#BA6054] hover:opacity-75 dark:text-[#e07b6d]">
                  Log in
                </Link>
              </div>
            </div>
          )}

          {step === 'form' && (
            <div className="animate-fade-in">
              <div className="relative mb-4 grid grid-cols-2 border-b border-[#d8b1ab] text-center dark:border-slate-600">
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute bottom-0 z-0 h-[61px] w-1/2 rounded-t-[16px] bg-[linear-gradient(to_right,#E2B0A9_0%,#BA6054_100%)] shadow-[0_8px_16px_rgba(0,0,0,0.2)] transition-transform duration-300 ease-out ${isOwner ? 'translate-x-full' : 'translate-x-0'}`}
                />
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'tenant' }))}
                  className={`relative z-10 h-[61px] rounded-t-[16px] text-[42px] font-medium transition-colors duration-300 ${!isOwner ? 'text-white' : 'text-[#BA6054] dark:text-[#e07b6d]'}`}
                >
                  Cari Kos
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'owner' }))}
                  className={`relative z-10 h-[61px] rounded-t-[16px] text-[42px] font-medium transition-colors duration-300 ${isOwner ? 'text-white' : 'text-[#BA6054] dark:text-[#e07b6d]'}`}
                >
                  Pemilik Kos
                </button>
              </div>

              <h1 className="text-[52px] font-bold leading-none text-[#BA6054]">Sign Up</h1>

              <form className="mt-3" onSubmit={handleSubmit}>
                {error && (
                  <div className="mb-3 rounded-md border border-[#BA6054] bg-[#ffeceb] px-3 py-2 text-sm text-[#BA6054]">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-3 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                    {success}
                  </div>
                )}

                <div>
                  <label htmlFor="nama" className="text-[17px] font-medium text-[#1f1f1f] dark:text-slate-200">
                    Nama lengkap
                  </label>
                  <input
                    id="nama"
                    name="nama"
                    type="text"
                    placeholder="Enter Full name"
                    className="mt-1 w-full border-0 border-b border-[#b9b9b9] bg-transparent pb-2 text-[34px] text-[#1f1f1f] placeholder:text-[#b7b7b7] focus:border-[#BA6054] focus:outline-none dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-[#e07b6d]"
                    value={formData.nama}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mt-3">
                  <label htmlFor="no_hp" className="text-[17px] font-medium text-[#1f1f1f] dark:text-slate-200">
                    No. Telp
                  </label>
                  <input
                    id="no_hp"
                    name="no_hp"
                    type="text"
                    placeholder="Enter Phone Number"
                    className="mt-1 w-full border-0 border-b border-[#b9b9b9] bg-transparent pb-2 text-[34px] text-[#1f1f1f] placeholder:text-[#b7b7b7] focus:border-[#BA6054] focus:outline-none dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-[#e07b6d]"
                    value={formData.no_hp}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mt-3">
                  <label htmlFor="email" className="text-[17px] font-medium text-[#1f1f1f] dark:text-slate-200">
                    E-mail address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter Email"
                    className="mt-1 w-full border-0 border-b border-[#b9b9b9] bg-transparent pb-2 text-[34px] text-[#1f1f1f] placeholder:text-[#b7b7b7] focus:border-[#BA6054] focus:outline-none dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-[#e07b6d]"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
                  <div>
                    <label htmlFor="pin" className="text-[17px] font-medium text-[#244454] dark:text-slate-200">
                      Password
                    </label>
                    <div className="mt-1 flex items-center border-0 border-b border-[#b9b9b9] pb-2 dark:border-slate-600">
                      <input
                        id="pin"
                        name="pin"
                        type={showPin ? 'text' : 'password'}
                        placeholder="Enter Password"
                        className="w-full bg-transparent text-[34px] text-[#1f1f1f] placeholder:text-[#b7b7b7] focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
                        value={formData.pin}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        aria-label="Show password"
                        onClick={() => setShowPin((prev) => !prev)}
                        className="text-[#101827] dark:text-slate-400"
                      >
                        {showPin ? <Eye size={28} /> : <EyeOff size={28} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPin" className="text-[17px] font-medium text-[#244454] dark:text-slate-200">
                      Confirm Password
                    </label>
                    <div className="mt-1 flex items-center border-0 border-b border-[#b9b9b9] pb-2 dark:border-slate-600">
                      <input
                        id="confirmPin"
                        name="confirmPin"
                        type={showConfirmPin ? 'text' : 'password'}
                        placeholder="Enter Password"
                        className="w-full bg-transparent text-[34px] text-[#1f1f1f] placeholder:text-[#b7b7b7] focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
                        value={formData.confirmPin}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        aria-label="Show confirm password"
                        onClick={() => setShowConfirmPin((prev) => !prev)}
                        className="text-[#101827] dark:text-slate-400"
                      >
                        {showConfirmPin ? <Eye size={28} /> : <EyeOff size={28} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-7 h-[61px] w-full rounded-full bg-[linear-gradient(to_right,#E2B0A9_0%,#BA6054_100%)] text-[42px] font-medium text-white shadow-[0_8px_18px_rgba(0,0,0,0.18)] transition hover:scale-[1.02] hover:shadow-[0_12px_28px_rgba(186,96,84,0.35)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Loading...' : 'Sign Up'}
                </button>

                <div className="mt-7 text-center text-[17px] text-[#244454] dark:text-slate-400">
                  Already have an account?{' '}
                  <Link href="/login" className="font-medium text-[#BA6054] hover:opacity-75 dark:text-[#e07b6d]">
                    Log in
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={() => setStep('role')}
                  className="mt-4 inline-flex items-center gap-2 text-sm text-[#7e6a66] hover:text-[#5c4b48] dark:text-slate-400 dark:hover:text-slate-200"
                >
                  <House size={14} />
                  Kembali ke pilihan role
                </button>
              </form>
            </div>
          )}
          </div>
      </div>
    </div>
  );
}

