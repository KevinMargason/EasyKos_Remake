'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Future: Redirect to dashboard when implemented
      // For now, show user info or stay on home
      router.push('/login');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">EasyKos</h1>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
