import type { SensorData, DeviceControlInfo, HistoricalDataPoint, NotificationMessage, ChartConfig } from './types';
import { Thermometer, Zap, Droplets, Waves, Lightbulb, Atom, AlertTriangle, Info, CheckCircle, BarChart, Settings, Power } from 'lucide-react';

export const mockSensorData: SensorData[] = [
  { id: 'ph', name: 'pH Air', value: 6.2, unit: '', status: 'optimal', icon: Atom, lastUpdated: 'Now' },
  { id: 'ec', name: 'EC Nutrisi', value: 1.8, unit: 'mS/cm', status: 'optimal', icon: Zap, lastUpdated: 'Now' },
  { id: 'temp', name: 'Suhu Air', value: 24, unit: '°C', status: 'neutral', icon: Thermometer, lastUpdated: 'Now' },
  { id: 'level', name: 'Tinggi Air', value: 'Normal', unit: '', status: 'normal', icon: Waves, lastUpdated: 'Now' },
  { id: 'light', name: 'Intensitas Cahaya', value: 'ON', unit: '', status: 'on', icon: Lightbulb, lastUpdated: 'Now' },
];

export const mockDeviceControls: DeviceControlInfo[] = [
  { id: 'pump', name: 'Pompa Air', icon: Power, isOn: true, schedulable: true },
  { id: 'growlight', name: 'Lampu Tumbuh', icon: Lightbulb, isOn: true, schedulable: true },
  { id: 'nutrientpump', name: 'Dosis Nutrisi', icon: Droplets, isOn: false, dosable: true },
];

const generateHistoricalData = (days: number, baseValue: number, variation: number): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = [];
  const now = new Date();
  for (let i = days -1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0, 0); // Random time within the day
    
    data.push({
      date: date.toISOString().slice(0, 16).replace('T', ' '), // YYYY-MM-DD HH:mm
      value: parseFloat((baseValue + (Math.random() - 0.5) * variation).toFixed(1)),
    });
  }
  return data.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Ensure chronological order
};


export const mockHistoricalData: Record<string, HistoricalDataPoint[]> = {
  ph: generateHistoricalData(7, 6.5, 0.5), // pH over last 7 days
  ec: generateHistoricalData(7, 1.7, 0.3),   // EC over last 7 days
  temp: generateHistoricalData(7, 23, 2), // Temperature over last 7 days
};


export const mockChartConfigs: Record<string, ChartConfig> = {
  ph: {
    value: { label: 'pH', color: 'hsl(var(--chart-1))', icon: Atom },
  },
  ec: {
    value: { label: 'EC (mS/cm)', color: 'hsl(var(--chart-2))', icon: Zap },
  },
  temp: {
    value: { label: 'Suhu (°C)', color: 'hsl(var(--chart-3))', icon: Thermometer },
  },
};

export const mockNotifications: NotificationMessage[] = [
  { id: '1', message: 'pH air terlalu tinggi: 7.5', timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'warning', icon: AlertTriangle, read: false },
  { id: '2', message: 'Level air rendah, perlu diisi ulang.', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), type: 'critical', icon: AlertTriangle, read: false },
  { id: '3', message: 'Dosis nutrisi berhasil ditambahkan.', timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), type: 'info', icon: CheckCircle, read: true },
  { id: '4', message: 'Suhu air optimal: 24°C', timestamp: new Date(Date.now() - 10 * 3600000).toISOString(), type: 'info', icon: Info, read: true },
];


export const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
