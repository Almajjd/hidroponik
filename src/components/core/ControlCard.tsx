import type { DeviceControlInfo } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Settings, PlusCircle } from 'lucide-react';

interface ControlCardProps {
  device: DeviceControlInfo;
  onToggle: (id: string, isOn: boolean) => void;
  onScheduleClick?: (id: string) => void;
  onDoseClick?: (id: string) => void;
}

export default function ControlCard({ device, onToggle, onScheduleClick, onDoseClick }: ControlCardProps) {
  const Icon = device.icon;

  return (
    <Card className={cn("shadow-lg rounded-xl overflow-hidden transition-all hover:shadow-xl", device.isOn ? "border-primary/50 bg-primary/5" : "bg-card")}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3 pt-4 px-4">
        <div className="flex items-center gap-3">
          <Icon className={cn("h-7 w-7", device.isOn ? "text-primary" : "text-muted-foreground")} />
          <CardTitle className="text-lg font-semibold">{device.name}</CardTitle>
        </div>
        <div className="flex items-center space-x-1">
            <Label htmlFor={`switch-${device.id}`} className="text-sm sr-only">
                {device.isOn ? "ON" : "OFF"}
            </Label>
            <Switch
                id={`switch-${device.id}`}
                checked={device.isOn}
                onCheckedChange={(checked) => onToggle(device.id, checked)}
                aria-label={`Toggle ${device.name}`}
            />
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-2">
        <p className={cn("text-sm", device.isOn ? "text-primary" : "text-muted-foreground")}>
          Status: {device.isOn ? "Menyala" : "Mati"}
        </p>
      </CardContent>
      {(device.schedulable || device.dosable) && (
        <CardFooter className="px-4 pb-4 pt-2 flex flex-col sm:flex-row gap-2">
          {device.schedulable && onScheduleClick && (
            <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => onScheduleClick(device.id)}>
              <Settings className="mr-2 h-4 w-4" />
              Atur Jadwal
            </Button>
          )}
          {device.dosable && onDoseClick && (
             <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => onDoseClick(device.id)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Dosis Manual
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
