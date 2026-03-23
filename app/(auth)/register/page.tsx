'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { AUTH_ROUTES, ROUTES } from '@/lib/routes';
import { useAppDispatch } from '@/core/store/hooks';
import { setRole } from '@/core/feature/role/roleSlice';
import { api } from '@/core/services/api';

type RoleType = 'owner' | 'tenant';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [formData, setFormData] = useState({
    name: '',
    no_hp: '',
    password: '',
    confirmPassword: '',
    email: '',
    role: 'tenant' as RoleType,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'no_hp') {
      setFormData({ ...formData, [name]: value.replace(/[^0-9]/g, '') });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRoleSelect = (role: RoleType) => {
    dispatch(setRole(role));
    setFormData({ ...formData, role });
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (formData.name.length < 3) {
      setError('Nama harus minimal 3 karakter');
      setLoading(false);
      return;
    }
    if (!formData.email || !formData.email.includes('@')) {
      setError('Email harus valid');
      setLoading(false);
      return;
    }
    if (formData.no_hp.length < 10 || formData.no_hp.length > 20) {
      setError('Nomor HP harus 10-20 digit');
      setLoading(false);
      return;
    }
    if (formData.password.length < 8) {
      setError('Password minimal 8 karakter');
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Password dan Confirm Password tidak sama');
      setLoading(false);
      return;
    }

    try {
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        no_hp: formData.no_hp,
        role: formData.role,
      };

      console.log('Sending registration data:', registerData);
      const response = await api.auth.register(registerData);

      if (response.data || response.success) {
        toast.success('Pendaftaran berhasil! Silakan masuk dengan akun Anda.');
        setSuccess('Pendaftaran berhasil! Mengarahkan ke halaman login...');
        setTimeout(() => {
          router.push(AUTH_ROUTES.LOGIN);
        }, 2000);
      }
    } catch (error: any) {
      console.error('Registrasi gagal:', error);
      let errorMsg = 'Pendaftaran gagal. Silakan coba lagi.';
      
      if (error?.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error?.response?.data && typeof error.response.data === 'object') {
        // Handle Laravel validation errors
        const errors = Object.values(error.response.data).flat();
        errorMsg = errors.join(', ');
      } else if (error?.message) {
        errorMsg = error.message;
      }
      
      setError(errorMsg);
      toast.error(errorMsg);
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
                href={ROUTES.HOME}
                className="inline-flex items-center gap-1.5 text-[15px] text-[#7e6a66] transition hover:text-[#BA6054] dark:text-slate-400 dark:hover:text-[#e07b6d]"
              >
                <ArrowLeft size={16} />
                Kembali ke beranda
              </Link>
              <div className="mx-auto mt-4 grid max-w-[500px] grid-cols-2 gap-4 sm:gap-6">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('tenant')}
                  className="group transition hover:scale-105 active:scale-100"
                >
                  <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#F8EFEE] transition group-hover:opacity-85 dark:bg-[#3d2820] sm:h-[92px] sm:w-[92px]">
                    <Image src="/Asset/icon/icon-search-home.svg" alt="Cari kos" width={44} height={44} className="sm:h-[58px] sm:w-[58px]" />
                  </div>
                  <div className="glass-role-option mt-3 flex h-[50px] w-full items-center justify-center rounded-[20px] px-2 text-base font-medium text-[#BA6054] dark:text-[#f5d1cb] sm:h-[58px] sm:text-xl md:text-2xl">
                    Cari kos
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('owner')}
                  className="group transition hover:scale-105 active:scale-100"
                >
                  <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#F8EFEE] transition group-hover:opacity-85 dark:bg-[#3d2820] sm:h-[92px] sm:w-[92px]">
                    <Image src="/Asset/icon/icon-house.svg" alt="Pemilik kos" width={44} height={44} className="sm:h-[58px] sm:w-[58px]" />
                  </div>
                  <div className="glass-role-option mt-3 flex h-[50px] w-full items-center justify-center rounded-[20px] px-2 text-base font-medium text-[#BA6054] dark:text-[#f5d1cb] sm:h-[58px] sm:text-xl md:text-2xl">
                    Pemilik kos
                  </div>
                </button>
              </div>

              {/* Login Link */}
              <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                Sudah punya akun?{' '}
                <Link
                  href={AUTH_ROUTES.LOGIN}
                  className="font-medium text-[#BA6054] transition hover:text-[#a05246] dark:hover:text-[#f0b2a7]"
                >
                  Masuk di sini
                </Link>
              </div>
            </div>
          )}

          {step === 'form' && (
            <div className="animate-fade-in space-y-6 py-4 sm:py-8">
              <div>
                <button
                  type="button"
                  onClick={() => setStep('role')}
                  className="inline-flex items-center gap-1.5 text-[15px] text-[#7e6a66] transition hover:text-[#BA6054] dark:text-slate-400 dark:hover:text-[#e07b6d]"
                >
                  <ArrowLeft size={16} />
                  Ubah pilihan
                </button>
                <h1 className="mt-4 text-[28px] font-bold leading-tight text-slate-900 dark:text-slate-100">
                  Daftar sebagai {isOwner ? 'Pemilik Kos' : 'Pencari Kos'}
                </h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-200">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-200">
                    {success}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap Anda"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 transition focus:border-[#BA6054] focus:outline-none focus:ring-1 focus:ring-[#BA6054] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 transition focus:border-[#BA6054] focus:outline-none focus:ring-1 focus:ring-[#BA6054] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Nomor HP (10-20 digit)
                  </label>
                  <input
                    type="tel"
                    name="no_hp"
                    value={formData.no_hp}
                    onChange={handleChange}
                    placeholder="08123456789"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 transition focus:border-[#BA6054] focus:outline-none focus:ring-1 focus:ring-[#BA6054] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Password (minimum 8 karakter)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Masukkan password"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-12 text-slate-900 placeholder-slate-500 transition focus:border-[#BA6054] focus:outline-none focus:ring-1 focus:ring-[#BA6054] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Ulangi password"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-12 text-slate-900 placeholder-slate-500 transition focus:border-[#BA6054] focus:outline-none focus:ring-1 focus:ring-[#BA6054] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#BA6054] px-6 py-3 text-center font-semibold text-white transition hover:bg-[#a05246] disabled:opacity-50 dark:hover:bg-[#c97161]"
                >
                  {loading ? 'Mendaftar...' : 'Daftar'}
                </button>

                {/* Login Link */}
                <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                  Sudah punya akun?{' '}
                  <Link
                    href={AUTH_ROUTES.LOGIN}
                    className="font-medium text-[#BA6054] transition hover:text-[#a05246] dark:hover:text-[#f0b2a7]"
                  >
                    Masuk di sini
                  </Link>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

