'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [no_hp, setNoHp] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.login(no_hp, pin);
      if (response.status === 'success' && response.data) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        router.push('/');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e6f7f6] to-[#d1f2f0]">
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
            Selamat Datang Kembali
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="no_hp" className="block text-sm font-medium text-gray-700 mb-1">
                Nomor HP
              </label>
              <input
                id="no_hp"
                name="no_hp"
                type="tel"
                autoComplete="tel"
                required
                minLength={10}
                maxLength={20}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-[#17A39D] focus:border-[#17A39D] text-base"
                placeholder="08123456789"
                value={no_hp}
                onChange={(e) => setNoHp(e.target.value.replace(/[^0-9]/g, ''))}
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
                  autoComplete="off"
                  required
                  minLength={6}
                  maxLength={6}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-[#17A39D] focus:border-[#17A39D] text-base"
                  placeholder="000000"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
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
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-md text-white bg-[#17A39D] hover:bg-[#138780] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#17A39D] disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
            >
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun?{' '}
              <Link href="/register" className="font-medium text-[#17A39D] hover:text-[#138780]">
                Daftar di sini
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
