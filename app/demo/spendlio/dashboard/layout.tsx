'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../_lib/auth-context';
import { BASE } from '../_lib/routes';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace(`${BASE}/login`);
    }
  }, [isLoading, token, router]);

  if (isLoading || !token) return null;

  return <div className="min-h-screen">{children}</div>;
}
