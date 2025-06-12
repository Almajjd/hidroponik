import type { SensorData, SensorStatus } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatusCardProps {
  sensor: SensorData;
}

const statusColors: Record<SensorStatus, string> = {
  optimal: 'text-green-500 border-green-500/50 bg-green-500/10',
  warning: 'text-yellow-500 border-yellow-500/50 bg-yellow-500/10',
  critical: 'text-red-500 border-red-500/50 bg-red-500/10',
  neutral: 'text-foreground border-border bg-card',
  on: 'text-sky-500 border-sky-500/50 bg-sky-500/10',
  off: 'text-slate-500 border-slate-500/50 bg-slate-500/10',
  full: 'text-blue-500 border-blue-500/50 bg-blue-500/10',
  normal: 'text-green-500 border-green-500/50 bg-green-500/10',
  low: 'text-orange-500 border-orange-500/50 bg-orange-500/10',
};

const statusIndicatorDotColors: Record<SensorStatus, string> = {
  optimal: 'bg-green-500',
  warning: 'bg-yellow-500',
  critical: 'bg-red-500',
  neutral: 'bg-gray-400',
  on: 'bg-sky-500',
  off: 'bg-slate-500',
  full: 'bg-blue-500',
  normal: 'bg-green-500',
  low: 'bg-orange-500',
};

export default function StatusCard({ sensor }: StatusCardProps) {
  const Icon = sensor.icon;

  return (
    <Card className={cn("shadow-lg rounded-xl overflow-hidden transition-all hover:shadow-xl", statusColors[sensor.status])}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-medium">{sensor.name}</CardTitle>
        <Icon className={cn("h-5 w-5", statusColors[sensor.status].split(' ')[0])} />
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="text-3xl font-bold">
          {sensor.value}
          {sensor.unit && <span className="text-lg ml-1">{sensor.unit}</span>}
        </div>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
           <span className={cn("h-2 w-2 rounded-full mr-1.5", statusIndicatorDotColors[sensor.status])}></span>
           {sensor.status.charAt(0).toUpperCase() + sensor.status.slice(1)}
           {sensor.lastUpdated && ` - ${sensor.lastUpdated}`}
        </div>
      </CardContent>
    </Card>
  );
}
