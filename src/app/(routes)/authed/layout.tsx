'use client';

import { useAuth } from '@/providers/AuthProvider';
import { SubNavbar } from './(components)/sub-navbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className='min-h-screen bg-background'>
      <SubNavbar />
      <main className='flex-1 w-full px-4 md:px-6 py-6 mx-auto max-w-7xl'>
        {children}
      </main>
    </div>
  );
}
