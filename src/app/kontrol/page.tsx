"use client";

import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout';
import ControlCard from '@/components/core/ControlCard';
import ScheduleDialog from '@/components/dialogs/ScheduleDialog';
import NutrientDosingDialog from '@/components/dialogs/NutrientDosingDialog';
import { mockDeviceControls } from '@/lib/placeholder-data';
import type { DeviceControlInfo, ScheduleSettings, NutrientDoseSettings } from '@/lib/types';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function KontrolPage() {
  const [devices, setDevices] = useState<DeviceControlInfo[]>(mockDeviceControls);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isDoseDialogOpen, setIsDoseDialogOpen] = useState(false);
  const [selectedDeviceForDialog, setSelectedDeviceForDialog] = useState<DeviceControlInfo | null>(null);
  const { toast } = useToast();

  const handleToggle = (id: string, isOn: boolean) => {
    setDevices(prevDevices =>
      prevDevices.map(d => (d.id === id ? { ...d, isOn } : d))
    );
    const device = devices.find(d => d.id === id);
    toast({
      title: `${device?.name} ${isOn ? 'Dinyalakan' : 'Dimatikan'}`,
      description: `Status ${device?.name} telah diperbarui.`,
    });
  };

  const handleOpenScheduleDialog = (id: string) => {
    const device = devices.find(d => d.id === id);
    if (device) {
      setSelectedDeviceForDialog(device);
      setIsScheduleDialogOpen(true);
    }
  };
  
  const handleOpenDoseDialog = (id: string) => {
    const device = devices.find(d => d.id === id);
    if (device) {
      setSelectedDeviceForDialog(device);
      setIsDoseDialogOpen(true);
    }
  };

  const handleSaveSchedule = (settings: ScheduleSettings) => {
    console.log("Jadwal disimpan (simulasi):", settings);
    // Here you would typically send this to a backend
    // For now, we just log it and show a toast (handled in dialog)
  };

  const handleSaveDoseSettings = (settings: NutrientDoseSettings) => {
    console.log("Pengaturan dosis disimpan (simulasi):", settings);
    // Simulate action, e.g., if it's a nutrient pump, turn it on briefly
    if (selectedDeviceForDialog && selectedDeviceForDialog.dosable) {
        // Simulate pump action
        setDevices(prev => prev.map(d => d.id === selectedDeviceForDialog.id ? {...d, isOn: true} : d));
        setTimeout(() => {
            setDevices(prev => prev.map(d => d.id === selectedDeviceForDialog.id ? {...d, isOn: false} : d));
        }, 2000); // Simulate pump running for 2 seconds
    }
  };

  return (
    <AuthenticatedLayout title="Kontrol Perangkat">
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Manajemen Perangkat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {devices.map((device) => (
              <ControlCard
                key={device.id}
                device={device}
                onToggle={handleToggle}
                onScheduleClick={device.schedulable ? handleOpenScheduleDialog : undefined}
                onDoseClick={device.dosable ? handleOpenDoseDialog : undefined}
              />
            ))}
          </div>
        </section>
        
        <ScheduleDialog
          isOpen={isScheduleDialogOpen}
          onOpenChange={setIsScheduleDialogOpen}
          device={selectedDeviceForDialog}
          onSaveSchedule={handleSaveSchedule}
        />

        <NutrientDosingDialog
          isOpen={isDoseDialogOpen}
          onOpenChange={setIsDoseDialogOpen}
          device={selectedDeviceForDialog}
          onSaveDoseSettings={handleSaveDoseSettings}
        />
      </div>
    </AuthenticatedLayout>
  );
}
