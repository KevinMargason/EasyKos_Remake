'use client';

import Link from 'next/link';

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/dashboard" className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-indigo-600">EasyKos</h1>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Payments Management</h2>
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-gray-500">Payments management interface coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
