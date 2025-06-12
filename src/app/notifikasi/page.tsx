"use client";

import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout';
import NotificationItem from '@/components/core/NotificationItem';
import { mockNotifications } from '@/lib/placeholder-data';
import type { NotificationMessage } from '@/lib/types';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, CheckCheck } from 'lucide-react';

export default function NotifikasiPage() {
  const [notifications, setNotifications] = useState<NotificationMessage[]>(mockNotifications);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AuthenticatedLayout title="Notifikasi & Peringatan">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <h2 className="text-xl font-semibold text-foreground">Riwayat Notifikasi</h2>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Tandai Semua Sudah Dibaca ({unreadCount})
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <AlertCircle className="mx-auto h-12 w-12 mb-4" />
            <p>Tidak ada notifikasi saat ini.</p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-12rem)] sm:h-[calc(100vh-10rem)] rounded-md">
            <div className="space-y-0 pr-3"> {/* Reduced space-y, added pr for scrollbar */}
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
