import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout';
import StatusCard from '@/components/core/StatusCard';
import { mockSensorData } from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SlidersHorizontal, LineChart } from 'lucide-react';

export default function DashboardPage() {
  return (
    <AuthenticatedLayout title="Dashboard Utama">
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Status Sistem Real-Time</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockSensorData.map((sensor) => (
              <StatusCard key={sensor.id} sensor={sensor} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Akses Cepat</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="outline" size="lg" className="w-full justify-start text-left h-auto py-4 shadow-md rounded-lg" asChild>
              <Link href="/kontrol">
                <SlidersHorizontal className="mr-3 h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold text-base">Kontrol Perangkat</p>
                  <p className="text-sm text-muted-foreground">Kelola pompa, lampu, dan nutrisi.</p>
                </div>
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full justify-start text-left h-auto py-4 shadow-md rounded-lg" asChild>
              <Link href="/monitoring">
                <LineChart className="mr-3 h-6 w-6 text-accent" />
                 <div>
                  <p className="font-semibold text-base">Monitoring & Riwayat</p>
                  <p className="text-sm text-muted-foreground">Lihat grafik data historis.</p>
                </div>
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </AuthenticatedLayout>
  );
}
