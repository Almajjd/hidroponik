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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from "react";
import type { DeviceControlInfo, NutrientDoseSettings } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface NutrientDosingDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  device: DeviceControlInfo | null; // Typically the nutrient pump
  onSaveDoseSettings: (settings: NutrientDoseSettings) => void;
}

export default function NutrientDosingDialog({ isOpen, onOpenChange, device, onSaveDoseSettings }: NutrientDosingDialogProps) {
  const [doseAmount, setDoseAmount] = useState<number>(10); // Default 10ml
  const [dosingType, setDosingType] = useState<"manual" | "parameter">("manual");
  // const [targetParameter, setTargetParameter] = useState<'ph' | 'ec'>('ec');
  // const [threshold, setThreshold] = useState<number>(1.5);

  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setDoseAmount(10);
      setDosingType("manual");
    }
  }, [isOpen, device]);

  const handleSubmit = () => {
    if (!device) return;
    if (doseAmount <= 0) {
      toast({ title: "Peringatan", description: "Jumlah dosis harus lebih dari 0.", variant: "destructive"});
      return;
    }

    const settings: NutrientDoseSettings = {
      amount: doseAmount,
    };

    // if (dosingType === "parameter") {
    //   settings.parameter = targetParameter;
    //   settings.threshold = threshold;
    // }
    
    onSaveDoseSettings(settings);
    toast({ title: "Dosis Disiapkan", description: `Dosis ${doseAmount}ml untuk ${device.name} telah diatur (simulasi).` });
    onOpenChange(false);
  };

  if (!device) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pengaturan Dosis Nutrisi: {device.name}</DialogTitle>
          <DialogDescription>
            Atur jumlah nutrisi yang akan ditambahkan.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="dose-amount">Jumlah Dosis (ml)</Label>
            <Input 
              id="dose-amount" 
              type="number" 
              value={doseAmount} 
              onChange={(e) => setDoseAmount(parseFloat(e.target.value))}
              min="1"
            />
          </div>

          {/* Future: Automatic dosing based on parameters */}
          {/* For now, only manual dosing is implemented as per "tombol untuk memicu dosis nutrisi manual" */}
           <div>
            <Label>Tipe Dosis</Label>
            <RadioGroup defaultValue="manual" value={dosingType} onValueChange={(value: "manual" | "parameter") => setDosingType(value)} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="manual" id="manual-dose" />
                <Label htmlFor="manual-dose" className="font-normal">Manual</Label>
              </div>
              {/* <div className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
                <RadioGroupItem value="parameter" id="parameter-dose" disabled />
                <Label htmlFor="parameter-dose" className="font-normal">Berdasarkan Parameter (Segera Hadir)</Label>
              </div> */}
            </RadioGroup>
          </div>

          {/* {dosingType === "parameter" && (
            <>
              <div>
                <Label>Parameter Target</Label>
                <Select value={targetParameter} onValueChange={(value: 'ph' | 'ec') => setTargetParameter(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih parameter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ec">EC Nutrisi</SelectItem>
                    <SelectItem value="ph">pH Air</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="threshold">Ambang Batas Target</Label>
                <Input id="threshold" type="number" step="0.1" value={threshold} onChange={e => setThreshold(parseFloat(e.target.value))} />
              </div>
            </>
          )} */}

        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button type="button" onClick={handleSubmit}>Terapkan Dosis</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
