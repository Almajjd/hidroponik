
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
  disabled?: boolean;
}

export default function NutrientDosingDialog({ isOpen, onOpenChange, device, onSaveDoseSettings, disabled = false }: NutrientDosingDialogProps) {
  const [doseAmount, setDoseAmount] = useState<number>(10); // Default 10ml
  const [dosingType, setDosingType] = useState<"manual" | "parameter">("manual");

  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setDoseAmount(10);
      setDosingType("manual");
    }
  }, [isOpen, device]);

  const handleSubmit = () => {
    if (!device || disabled) return;
    if (doseAmount <= 0) {
      toast({ title: "Peringatan", description: "Jumlah dosis harus lebih dari 0.", variant: "destructive"});
      return;
    }

    const settings: NutrientDoseSettings = {
      amount: doseAmount,
    };
    
    onSaveDoseSettings(settings);
    // Toast for successful submission is now handled in KontrolPage after MQTT publish (if applicable)
    // or here if it's just a UI simulation
    // toast({ title: "Dosis Disiapkan", description: `Dosis ${doseAmount}ml untuk ${device.name} telah diatur.` });
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
        <fieldset disabled={disabled} className="grid gap-4 py-4">
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
           <div>
            <Label>Tipe Dosis</Label>
            <RadioGroup defaultValue="manual" value={dosingType} onValueChange={(value: "manual" | "parameter") => setDosingType(value)} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="manual" id="manual-dose" />
                <Label htmlFor="manual-dose" className="font-normal">Manual</Label>
              </div>
            </RadioGroup>
          </div>
        </fieldset>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={disabled}>Batal</Button>
          <Button type="button" onClick={handleSubmit} disabled={disabled}>Terapkan Dosis</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
