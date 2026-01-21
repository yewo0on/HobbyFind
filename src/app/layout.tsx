import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import TopBar from '@/components/TopBar';
import { AuthProvider } from '@/components/auth/auth-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'HobbyFind - 나에게 맞는 취미 찾기',
  description: '운동형, 지능형, 예술형 취미를 한눈에 찾아보는 취미 탐색 서비스',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <AuthProvider>
            <div className="min-h-screen bg-white">
              <TopBar />
              {children}
            </div>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
