import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets } from 'lucide-react'; // Or a custom logo component

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 flex flex-col items-center">
        <Droplets className="h-16 w-16 text-primary mb-2" />
        <h1 className="text-3xl font-headline font-bold text-primary">HydroControl</h1>
      </div>
      <Card className="w-full max-w-sm sm:max-w-md shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="text-center text-2xl font-headline text-primary">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          {children}
        </CardContent>
      </Card>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Smart Hydroponics Management
      </p>
    </div>
  );
}
