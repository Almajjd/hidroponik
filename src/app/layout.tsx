import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'HydroControl',
  description: 'Dashboard kontrol dan monitoring hidroponik',
  applicationName: 'HydroControl',
  appleWebAppCapable: true,
  appleWebAppStatusBarStyle: 'default', // Bisa juga 'black' atau 'black-translucent'
  appleWebAppTitle: 'HydroControl',
  // formatDetection: {
  //   telephone: false, // Opsional, jika tidak ingin nomor telepon otomatis jadi link
  // },
  // manifest: '/manifest.json', // Jika Anda memiliki file manifest PWA
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no" />
        
        <meta name="application-name" content="HydroControl" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="HydroControl" />
        {/* <meta name="format-detection" content="telephone=no" /> /> */}
        {/* <meta name="msapplication-tap-highlight" content="no" /> /> */}
        
        <meta name="theme-color" content="#F0F4F8" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1F2937" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#F0F4F8" /> {/* Fallback theme color */}

        {/* Favicon links (contoh, Anda mungkin perlu generate sendiri) */}
        {/* 
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" /> 
        */}

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
