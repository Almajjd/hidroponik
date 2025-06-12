"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, SlidersHorizontal, LineChart, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/kontrol', label: 'Kontrol', icon: SlidersHorizontal },
  { href: '/monitoring', label: 'Monitor', icon: LineChart },
  { href: '/notifikasi', label: 'Notif', icon: Bell },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="container mx-auto grid h-16 max-w-lg grid-cols-4 items-center px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
          return (
            <Link href={item.href} key={item.label} legacyBehavior>
              <a
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-md p-2 transition-colors",
                  isActive
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
