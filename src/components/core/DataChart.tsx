"use client"

import { BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer, LineChart as RechartsLineChart, Line } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import type { HistoricalDataPoint } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface DataChartProps {
  data: HistoricalDataPoint[];
  chartConfig: ChartConfig;
  title: string;
  description: string;
  chartType?: 'line' | 'bar';
  dataKey?: string; // a key from HistoricalDataPoint, default is "value"
}

export default function DataChart({ data, chartConfig, title, description, chartType = 'line', dataKey = "value" }: DataChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No data available for this period.</p>
        </CardContent>
      </Card>
    );
  }
  
  const ChartComponent = chartType === 'line' ? RechartsLineChart : RechartsBarChart;
  const DataComponent = chartType === 'line' ? Line : Bar;

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <ResponsiveContainer width="100%" height={250}>
            <ChartComponent data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  // Show time for recent data, date for older data
                  if (data.length <= 24) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  return date.toLocaleDateString([], { month: 'short', day: 'numeric'});
                }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.toFixed(1)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <DataComponent 
                dataKey={dataKey} 
                type="monotone" // For Line chart
                fill={`var(--color-${dataKey})`} // For Bar chart
                stroke={`var(--color-${dataKey})`} // For Line chart
                strokeWidth={2} // For Line chart
                dot={chartType === 'line' ? { r: 4, fill: `var(--color-${dataKey})`, strokeWidth:0 } : false} // For Line chart
                activeDot={chartType === 'line' ? { r: 6 } : undefined} // For Line chart
              />
              <ChartLegend content={<ChartLegendContent />} />
            </ChartComponent>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
