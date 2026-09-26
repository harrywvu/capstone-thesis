import type { Metadata } from 'next';
import './globals.css';
import './defense.css';

export const metadata: Metadata = {
  title: 'OverFlow — Title Defense Demo',
  description: 'Synthetic, offline flood evacuation planning demonstration with low-poly terrain and illustrative rainfall scenarios.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
