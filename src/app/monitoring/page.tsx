"use client";

import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout';
import DataChart from '@/components/core/DataChart';
import { mockHistoricalData, mockChartConfigs } from '@/lib/placeholder-data';
import type { HistoricalDataPoint } from '@/lib/types';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type TimeRangeOption = "24h" | "7d" | "30d";
type DataType = "ph" | "ec" | "temp";

const filterDataByTimeRange = (data: HistoricalDataPoint[], range: TimeRangeOption): HistoricalDataPoint[] => {
  const now = new Date();
  let startTime: Date;

  switch (range) {
    case "24h":
      startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case "7d":
      startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      return data;
  }
  return data.filter(point => new Date(point.date) >= startTime);
};

const getSummaryData = (data: HistoricalDataPoint[]): HistoricalDataPoint[] => {
  if (data.length <= 10) return data.slice().reverse(); // Show last 10 if few points
  // Simple daily average if many points, or hourly for 24h
  // This is a placeholder for more complex aggregation
  const lastPoints = data.slice(-5).reverse(); // Get last 5 points, reversed for recent first
  return lastPoints;
};


export default function MonitoringPage() {
  const [timeRange, setTimeRange] = useState<TimeRangeOption>("7d");
  const [activeTab, setActiveTab] = useState<DataType>("ph");

  const currentData = filterDataByTimeRange(mockHistoricalData[activeTab], timeRange);
  const summaryData = getSummaryData(currentData);

  const renderContentForTab = (dataType: DataType) => {
    const data = filterDataByTimeRange(mockHistoricalData[dataType], timeRange);
    const summary = getSummaryData(data);
    const config = mockChartConfigs[dataType];

    return (
      <div className="space-y-6">
        <DataChart
          data={data}
          chartConfig={config}
          title={`${config.value.label} - ${timeRange === "24h" ? "24 Jam Terakhir" : timeRange === "7d" ? "7 Hari Terakhir" : "30 Hari Terakhir"}`}
          description={`Grafik historis untuk ${config.value.label}.`}
          dataKey="value"
        />
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg">Ringkasan Data ({config.value.label})</CardTitle>
          </CardHeader>
          <CardContent>
            {summary.length > 0 ? (
              <Table>
                <TableCaption>Data terbaru untuk {config.value.label}.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waktu</TableHead>
                    <TableHead className="text-right">Nilai</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.map((point, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(point.date).toLocaleString()}</TableCell>
                      <TableCell className="text-right">{point.value.toFixed(1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-center py-4">Tidak ada data ringkasan.</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <AuthenticatedLayout title="Monitoring Data & Riwayat">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-semibold text-foreground">Pelacakan Data Historis</h2>
          <Select value={timeRange} onValueChange={(value: TimeRangeOption) => setTimeRange(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Pilih Rentang Waktu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Jam Terakhir</SelectItem>
              <SelectItem value="7d">7 Hari Terakhir</SelectItem>
              <SelectItem value="30d">30 Hari Terakhir</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as DataType)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ph">pH Air</TabsTrigger>
            <TabsTrigger value="ec">EC Nutrisi</TabsTrigger>
            <TabsTrigger value="temp">Suhu Air</TabsTrigger>
          </TabsList>
          <TabsContent value="ph" className="mt-6">{renderContentForTab("ph")}</TabsContent>
          <TabsContent value="ec" className="mt-6">{renderContentForTab("ec")}</TabsContent>
          <TabsContent value="temp" className="mt-6">{renderContentForTab("temp")}</TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  );
}
