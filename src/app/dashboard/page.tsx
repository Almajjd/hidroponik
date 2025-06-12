"use client";
import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout';
import StatusCard from '@/components/core/StatusCard';
import { mockSensorData as initialSensorData } from '@/lib/placeholder-data';
import type { SensorData, SensorStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SlidersHorizontal, LineChart } from 'lucide-react';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { MqttContext } from '@/contexts/MqttContext';
import { format } from 'date-fns';

export default function DashboardPage() {
  const [sensorData, setSensorData] = useState<SensorData[]>(initialSensorData);
  const mqttContext = useContext(MqttContext);

  const handleSensorUpdate = useCallback((topic: string, payload: Buffer) => {
    const message = payload.toString();
    console.log(`[LOG - ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}] MQTT Data Received - Topic: ${topic}, Payload: ${message}`);

    setSensorData(prevData =>
      prevData.map(sensor => {
        if (sensor.mqttTopic === topic) {
          let newValue: string | number = message;
          let newStatus: SensorStatus = sensor.status; // Default to current status

          // Try to parse as number for sensors that expect numeric values
          const numericValue = parseFloat(message);
          if (!isNaN(numericValue)) {
            newValue = numericValue;
            if (sensor.getStatus) {
              newStatus = sensor.getStatus(numericValue);
            }
          } else {
            // Handle string values like 'ON'/'OFF' or 'Normal'/'Low'
            if (topic.includes('status') || topic.includes('level')) { // Example heuristic
               if (message.toUpperCase() === 'ON') newStatus = 'on';
               else if (message.toUpperCase() === 'OFF') newStatus = 'off';
               else if (message.toUpperCase() === 'NORMAL') newStatus = 'normal';
               else if (message.toUpperCase() === 'LOW') newStatus = 'low';
               else if (message.toUpperCase() === 'CRITICAL') newStatus = 'critical';
               else if (message.toUpperCase() === 'OPTIMAL') newStatus = 'optimal';
               else if (message.toUpperCase() === 'WARNING') newStatus = 'warning';
            }
          }
          
          return { 
            ...sensor, 
            value: newValue, 
            status: newStatus,
            lastUpdated: format(new Date(), 'HH:mm:ss') 
          };
        }
        return sensor;
      })
    );
  }, []);


  useEffect(() => {
    if (mqttContext && mqttContext.isConnected && mqttContext.client) {
      const subscriptions: Array<{ topic: string, handler: Function }> = [];

      sensorData.forEach(sensor => {
        if (sensor.mqttTopic) {
          // console.log(`Dashboard: Subscribing to ${sensor.mqttTopic}`);
          // Define specific handler to avoid issues with useCallback changing reference
          const specificHandler = (topic: string, payload: Buffer) => handleSensorUpdate(topic, payload);
          mqttContext.subscribe(sensor.mqttTopic, specificHandler);
          subscriptions.push({ topic: sensor.mqttTopic, handler: specificHandler });
        }
      });

      return () => {
        // console.log("Dashboard: Cleaning up MQTT subscriptions");
        subscriptions.forEach(sub => {
          if (mqttContext && mqttContext.client) {
            // console.log(`Dashboard: Unsubscribing from ${sub.topic}`);
            mqttContext.unsubscribe(sub.topic, sub.handler as any);
          }
        });
      };
    }
  }, [mqttContext, sensorData, handleSensorUpdate]); // sensorData dependency to re-subscribe if topics change (e.g. dynamic sensors)

  return (
    <AuthenticatedLayout title="Dashboard Utama">
      <div className="space-y-6">
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-foreground">Status Sistem Real-Time</h2>
            {mqttContext && (
                 <span className={`text-xs px-2 py-1 rounded-full ${mqttContext.isConnected ? 'bg-green-500/20 text-green-700' : 'bg-red-500/20 text-red-700'}`}>
                 MQTT: {mqttContext.isConnected ? 'Terhubung' : 'Terputus'}
               </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sensorData.map((sensor) => (
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
