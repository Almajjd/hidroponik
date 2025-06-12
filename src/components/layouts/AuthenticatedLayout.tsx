"use client";

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AppHeader from '@/components/core/AppHeader';
import MobileNav from '@/components/core/MobileNav';
import { Loader2 } from 'lucide-react';

interface AuthenticatedLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AuthenticatedLayout({ children, title }: AuthenticatedLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader title={title} />
      <main className="flex-1 container mx-auto p-4 pb-20 md:pb-4">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
