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
      const cleanedValue = value.replace(/[^0-9]/g, '');
      const limitedValue = cleanedValue.slice(0, 13);
      setFormData({ ...formData, [name]: limitedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRoleSelect = (role: RoleType) => {
    dispatch(setRole(role));
    setFormData({ ...formData, role });
    setStep('form');
  };

  const handleRoleSwitch = (role: RoleType) => {
    dispatch(setRole(role));
    setFormData({ ...formData, role });
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
        <div className="glass-card animate-fade-in-up w-full max-w-[800px] rounded-[20px] px-8 py-12 sm:px-16 sm:py-14">
          {step === 'role' && (
            <div className="animate-fade-in">
              <Link
                href={ROUTES.HOME}
                className="inline-flex items-center gap-1.5 text-[15px] text-[#7e6a66] transition hover:text-[#BA6054] dark:text-slate-400 dark:hover:text-[#e07b6d]"
              >
                <ArrowLeft size={16} />
                Kembali ke beranda
              </Link>
              <h1 className="mt-3 text-[34px] font-bold leading-none text-[#BA6054] sm:text-[44px] md:text-[48px]">Daftar</h1>
              <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6">
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
              <div className="mt-8 text-center text-[17px] text-[#244454] dark:text-slate-400">
                Sudah punya akun?{' '}
                <Link
                  href={AUTH_ROUTES.LOGIN}
                  className="font-medium text-[#BA6054] hover:opacity-75 dark:text-[#e07b6d]"
                >
                  Masuk di sini
                </Link>
              </div>
            </div>
          )}

          {step === 'form' && (
            <div className="animate-fade-in">
              {/* Role Tabs */}
              <div className="flex border-b border-[#d4d4d8] dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => handleRoleSwitch('tenant')}
                  className={`flex-1 py-4 font-medium text-[20px] text-center transition-colors duration-200 ${
                    formData.role === 'tenant'
                      ? 'border-b-2 border-[#BA6054] text-[#BA6054]'
                      : 'text-[#7e6a66] hover:text-[#BA6054] dark:text-slate-400 dark:hover:text-[#e07b6d]'
                  }`}
                >
                  Cari Kos
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch('owner')}
                  className={`flex-1 py-4 font-medium text-[20px] text-center transition-colors duration-200 ${
                    formData.role === 'owner'
                      ? 'border-b-2 border-[#BA6054] text-[#BA6054]'
                      : 'text-[#7e6a66] hover:text-[#BA6054] dark:text-slate-400 dark:hover:text-[#e07b6d]'
                  }`}
                >
                  Pemilik Kos
                </button>
              </div>

              <div className="mt-8">
                <h1 className="text-[34px] font-bold leading-none text-[#BA6054] sm:text-[44px] md:text-[48px]">
                  Daftar sebagai {isOwner ? 'Pemilik Kos' : 'Pencari Kos'}
                </h1>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
                  <label className="text-[25px] font-medium text-[#1f1f1f] dark:text-slate-200">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap Anda"
                    className="mt-1 w-full border-0 border-b bg-transparent pb-2 text-[25px] text-[#1f1f1f] placeholder:text-[#b7b7b7] transition-colors duration-200 focus:border-b focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500 border-[#b9b9b9] focus:border-[#BA6054] dark:border-slate-600 dark:focus:border-[#e07b6d]"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-[25px] font-medium text-[#1f1f1f] dark:text-slate-200">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    className="mt-1 w-full border-0 border-b bg-transparent pb-2 text-[25px] text-[#1f1f1f] placeholder:text-[#b7b7b7] transition-colors duration-200 focus:border-b focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500 border-[#b9b9b9] focus:border-[#BA6054] dark:border-slate-600 dark:focus:border-[#e07b6d]"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-[25px] font-medium text-[#1f1f1f] dark:text-slate-200">
                    Nomor HP (10-13 digit)
                  </label>
                  <input
                    type="tel"
                    name="no_hp"
                    value={formData.no_hp}
                    onChange={handleChange}
                    placeholder="08123456789"
                    className="mt-1 w-full border-0 border-b bg-transparent pb-2 text-[25px] text-[#1f1f1f] placeholder:text-[#b7b7b7] transition-colors duration-200 focus:border-b focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500 border-[#b9b9b9] focus:border-[#BA6054] dark:border-slate-600 dark:focus:border-[#e07b6d]"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="text-[25px] font-medium text-[#1f1f1f] dark:text-slate-200">
                    Password
                  </label>
                  <div className="mt-1 flex items-center border-0 border-b pb-2 border-[#b9b9b9] dark:border-slate-600">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Masukkan password"
                      className="w-full bg-transparent text-[25px] text-[#1f1f1f] placeholder:text-[#b7b7b7] transition-colors duration-200 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[#101827] dark:text-slate-400"
                    >
                      {showPassword ? <EyeOff size={26} /> : <Eye size={26} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-[25px] font-medium text-[#1f1f1f] dark:text-slate-200">
                    Konfirmasi Password
                  </label>
                  <div className="mt-1 flex items-center border-0 border-b pb-2 border-[#b9b9b9] dark:border-slate-600">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Ulangi password"
                      className="w-full bg-transparent text-[25px] text-[#1f1f1f] placeholder:text-[#b7b7b7] transition-colors duration-200 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-[#101827] dark:text-slate-400"
                    >
                      {showConfirmPassword ? <EyeOff size={26} /> : <Eye size={26} />}
                    </button>
                  </div>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-8 h-[54px] w-full rounded-full bg-[linear-gradient(to_right,#E2B0A9_0%,#BA6054_100%)] text-[26px] font-medium text-white shadow-[0_8px_18px_rgba(0,0,0,0.18)] transition hover:scale-[1.02] hover:shadow-[0_12px_28px_rgba(186,96,84,0.35)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 sm:h-[61px] sm:text-[36px] md:text-[28px]"
                >
                  {loading ? 'mendaftar...' : 'daftar'}
                </button>

                {/* Login Link */}
                <div className="mt-6 text-center text-[20px] text-[#244454] dark:text-slate-400">
                  Sudah punya akun?{' '}
                  <Link
                    href={AUTH_ROUTES.LOGIN}
                    className="font-medium text-[#BA6054] hover:opacity-75 dark:text-[#e07b6d]"
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

