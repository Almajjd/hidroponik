import type { LucideIcon } from 'lucide-react';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export type SensorStatus = 'optimal' | 'warning' | 'critical' | 'neutral' | 'on' | 'off' | 'full' | 'normal' | 'low';

export interface SensorData {
  id: string;
  name: string;
  value: string | number;
  unit?: string;
  status: SensorStatus;
  icon: LucideIcon;
  lastUpdated?: string;
  mqttTopic?: string; // Topic to subscribe to for real-time updates
  // Optional functions to determine status from a numeric value
  getStatus?: (value: number) => SensorStatus;
}

export interface DeviceControlInfo {
  id: string;
  name: string;
  icon: LucideIcon;
  isOn: boolean;
  schedulable?: boolean;
  dosable?: boolean; 
  mqttControlTopic?: string; // Topic to publish commands
}

export interface HistoricalDataPoint {
  date: string; 
  value: number;
  [key: string]: any; // Allow other properties for multi-line charts
}

export interface NotificationMessage {
  id:string;
  message: string;
  timestamp: string; // ISO string or formatted string
  type: 'warning' | 'critical' | 'info';
  icon: LucideIcon;
  read?: boolean;
}

export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
    icon?: LucideIcon;
  };
}

// Mock types for form submissions
export type ScheduleSettings = {
  deviceId: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  days: string[]; // e.g., ['Mon', 'Wed', 'Fri']
};

export type NutrientDoseSettings = {
  amount: number; // in ml or grams
  parameter?: 'ph' | 'ec'; // Optional: dose based on parameter
  threshold?: number; // Optional: if parameter is set
};
