
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import type { DeviceControlInfo, ScheduleSettings } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { daysOfWeek } from "@/lib/placeholder-data"; // Assuming you have this array


interface ScheduleDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  device: DeviceControlInfo | null;
  onSaveSchedule: (settings: ScheduleSettings) => void;
  disabled?: boolean;
}

export default function ScheduleDialog({ isOpen, onOpenChange, device, onSaveSchedule, disabled = false }: ScheduleDialogProps) {
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("18:00");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Reset state when dialog opens for a new device or closes
    if (isOpen) {
      setStartTime("08:00");
      setEndTime("18:00");
      setSelectedDays([]);
      // TODO: Load existing schedule if available for the device
    }
  }, [isOpen, device]);

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = () => {
    if (!device || disabled) return;
    if (selectedDays.length === 0) {
      toast({ title: "Peringatan", description: "Pilih setidaknya satu hari.", variant: "destructive"});
      return;
    }
    if (!startTime || !endTime) {
      toast({ title: "Peringatan", description: "Waktu mulai dan selesai harus diisi.", variant: "destructive"});
      return;
    }

    const scheduleSettings: ScheduleSettings = {
      deviceId: device.id,
      startTime,
      endTime,
      days: selectedDays,
    };
    onSaveSchedule(scheduleSettings);
    toast({ title: "Jadwal Disimpan", description: `Jadwal untuk ${device.name} telah diperbarui.` });
    onOpenChange(false);
  };

  if (!device) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Atur Jadwal Otomatis: {device.name}</DialogTitle>
          <DialogDescription>
            Pilih waktu dan hari untuk {device.name} menyala secara otomatis.
          </DialogDescription>
        </DialogHeader>
        <fieldset disabled={disabled} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-time">Waktu Mulai</Label>
              <Input id="start-time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="end-time">Waktu Selesai</Label>
              <Input id="end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Hari Aktif</Label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
              {daysOfWeek.map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day}`}
                    checked={selectedDays.includes(day)}
                    onCheckedChange={() => handleDayToggle(day)}
                  />
                  <Label htmlFor={`day-${day}`} className="font-normal text-sm">{day}</Label>
                </div>
              ))}
            </div>
          </div>
        </fieldset>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={disabled}>Batal</Button>
          <Button type="button" onClick={handleSubmit} disabled={disabled}>Simpan Jadwal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
