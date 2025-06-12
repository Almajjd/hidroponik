
"use client";

import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout';
import ControlCard from '@/components/core/ControlCard';
import ScheduleDialog from '@/components/dialogs/ScheduleDialog';
import NutrientDosingDialog from '@/components/dialogs/NutrientDosingDialog';
import { mockDeviceControls } from '@/lib/placeholder-data';
import type { DeviceControlInfo, ScheduleSettings, NutrientDoseSettings } from '@/lib/types';
import { useState, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MqttContext } from '@/contexts/MqttContext';

export default function KontrolPage() {
  const [devices, setDevices] = useState<DeviceControlInfo[]>(mockDeviceControls);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isDoseDialogOpen, setIsDoseDialogOpen] = useState(false);
  const [selectedDeviceForDialog, setSelectedDeviceForDialog] = useState<DeviceControlInfo | null>(null);
  const { toast } = useToast();

  const mqttContext = useContext(MqttContext);
  if (!mqttContext) {
    throw new Error("KontrolPage must be used within an MqttProvider");
  }
  const { publish, isConnected } = mqttContext;

  const handleToggle = (id: string, isOn: boolean) => {
    const device = devices.find(d => d.id === id);
    if (!device) return;

    const commandTopic = device.mqttControlTopic;
    const payload = isOn ? "ON" : "OFF";

    if (commandTopic && isConnected) {
      publish(commandTopic, payload); // Send command to device
    }

    // Simulate device status update for immediate dashboard feedback
    // This is specific to the grow light and its corresponding dashboard sensor
    if (device.id === 'growlight' && isConnected) {
      // The dashboard's 'Intensitas Cahaya' sensor listens to 'hydroponics/device/light/status'
      const dashboardLightStatusTopic = 'hydroponics/device/light/status';
      publish(dashboardLightStatusTopic, payload);
    }

    setDevices(prevDevices =>
      prevDevices.map(d => (d.id === id ? { ...d, isOn } : d))
    );

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
    if (!selectedDeviceForDialog || !isConnected) return;
    // Assuming the device ID for schedule is the same as the control ID
    const topic = `hydroponics/device/${selectedDeviceForDialog.id}/schedule/set`;
    const payload = JSON.stringify(settings); 

    publish(topic, payload);

    console.log("Jadwal disimpan (terkirim via MQTT):", settings);
    // Toast is handled in the dialog or here after successful MQTT publish confirmation
  };

  const handleSaveDoseSettings = (settings: NutrientDoseSettings) => {
    console.log("Pengaturan dosis disimpan (simulasi):", settings);
    // For simulation, we can publish this to a topic if needed, or just update UI
    // Example: Publishing dose settings if an MQTT topic is defined for it
    if (selectedDeviceForDialog && selectedDeviceForDialog.mqttControlTopic && isConnected) {
      // This assumes the nutrient pump has a specific topic for dosing commands if different from simple ON/OFF
      // For now, we'll assume the main control topic might receive a special payload or it's handled by ESP32 logic
      const topic = `${selectedDeviceForDialog.mqttControlTopic}/dose`; // Example topic
      const payload = JSON.stringify({ action: 'dose', amount: settings.amount });
      publish(topic, payload);
      toast({ title: "Perintah Dosis Terkirim", description: `Dosis ${settings.amount}ml untuk ${selectedDeviceForDialog.name} dikirim via MQTT.` });
    }


    // Simulate pump action visually if it's the nutrient pump
    if (selectedDeviceForDialog && selectedDeviceForDialog.dosable) {
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">Manajemen Perangkat</h2>
            {mqttContext && (
                 <span className={`text-xs px-2 py-1 rounded-full ${mqttContext.isConnected ? 'bg-green-500/20 text-green-700' : 'bg-red-500/20 text-red-700'}`}>
                 MQTT: {mqttContext.isConnected ? 'Terhubung' : 'Terputus'}
               </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {devices.map((device) => (
              <ControlCard
                key={device.id}
                device={device}
                onToggle={handleToggle}
                onScheduleClick={device.schedulable ? handleOpenScheduleDialog : undefined}
                onDoseClick={device.dosable ? handleOpenDoseDialog : undefined}
                disabled={!isConnected} // Disable control if MQTT is not connected
              />
            ))}
          </div>
           {!isConnected && (
            <p className="text-center text-red-500 mt-4">Koneksi MQTT terputus. Kontrol perangkat dinonaktifkan.</p>
          )}
        </section>
        
        <ScheduleDialog
          isOpen={isScheduleDialogOpen}
          onOpenChange={setIsScheduleDialogOpen}
          device={selectedDeviceForDialog}
          onSaveSchedule={handleSaveSchedule}
          disabled={!isConnected}
        />

        <NutrientDosingDialog
          isOpen={isDoseDialogOpen}
          onOpenChange={setIsDoseDialogOpen}
          device={selectedDeviceForDialog}
          onSaveDoseSettings={handleSaveDoseSettings}
          disabled={!isConnected}
        />
      </div>
    </AuthenticatedLayout>
  );
}
