'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';


export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama: '',
    no_hp: '',
    pin: '',
    email: '',
    role: 'owner',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [selectedRole, setSelectedRole] = useState('owner');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'no_hp') {
      setFormData({ ...formData, [name]: value.replace(/[^0-9]/g, '') });
    } else if (name === 'pin') {
      setFormData({ ...formData, [name]: value.replace(/[^0-9]/g, '').slice(0, 6) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRoleSelect = (role: 'owner' | 'tenant' | 'admin') => {
    setSelectedRole(role);
    setFormData({ ...formData, role });
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
    if (formData.pin.length !== 6) {
      setError('PIN harus 6 digit');
      setLoading(false);
      return;
    }

    try {
      const response = await api.register(
        formData.nama,
        formData.no_hp,
        formData.pin,
        formData.email || null,
        formData.role as 'owner' | 'tenant' | 'admin'
      );

      if (response.status === 'success' && response.data) {
        setSuccess('Pendaftaran berhasil! Redirecting ke login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(response.message || 'Pendaftaran gagal');
      }
    } catch (err: any) {
      setError(err.message || 'Pendaftaran gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e6f7f6] to-[#d1f2f0] py-12 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo/LogoBrand_EasyKos.png"
              alt="EasyKos Logo"
              width={280}
              height={100}
              priority
              className="object-contain"
            />
          </div>
          <p className="mt-2 text-center text-base text-gray-600 font-medium">
            Buat akun baru untuk mulai menggunakan layanan
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 border-l-4 border-green-500 p-4">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <input
                id="nama"
                name="nama"
                type="text"
                required
                minLength={3}
                maxLength={100}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-[#17A39D] focus:border-[#17A39D] text-base"
                placeholder="Ibu Kosan"
                value={formData.nama}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="no_hp" className="block text-sm font-medium text-gray-700 mb-1">
                Nomor HP
              </label>
              <input
                id="no_hp"
                name="no_hp"
                type="tel"
                required
                minLength={10}
                maxLength={20}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-[#17A39D] focus:border-[#17A39D] text-base"
                placeholder="08123456789"
                value={formData.no_hp}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email (Opsional)
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-[#17A39D] focus:border-[#17A39D] text-base"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1">
                PIN (6 digit)
              </label>
              <div className="relative">
                <input
                  id="pin"
                  name="pin"
                  type={showPin ? 'text' : 'password'}
                  required
                  minLength={6}
                  maxLength={6}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-[#17A39D] focus:border-[#17A39D] text-base"
                  placeholder="000000"
                  value={formData.pin}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPin ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipe Pengguna
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { role: 'owner' as const, label: 'Pemilik Kos', icon: '🏠' },
                  { role: 'tenant' as const, label: 'Penyewa', icon: '👤' },
                  { role: 'admin' as const, label: 'Admin', icon: '⚙️' },
                ].map(({ role, label, icon }) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={`p-3 border-2 rounded-md transition-all text-center ${
                      selectedRole === role
                        ? 'border-[#17A39D] bg-[#e6f7f6]'
                        : 'border-gray-300 bg-white hover:border-[#17A39D]'
                    }`}
                  >
                    <div className="text-lg mb-1">{icon}</div>
                    <div
                      className={`text-xs font-medium ${
                        selectedRole === role ? 'text-[#17A39D]' : 'text-gray-700'
                      }`}
                    >
                      {label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-md text-white bg-[#17A39D] hover:bg-[#138780] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#17A39D] disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
            >
              {loading ? 'Mendaftar...' : 'Daftar'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Sudah punya akun?{' '}
              <Link href="/login" className="font-medium text-[#17A39D] hover:text-[#138780]">
                Masuk di sini
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

