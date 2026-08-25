import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cute QR Printable Studio | Aesthetic A4 Doodle QR Sheets',
  description: 'Create and print beautiful A4 QR code sheets with cute doodles, handwritten fonts, and custom themes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Comfortaa:wght@600;700&family=Kalam:wght@700&family=Patrick+Hand&family=Quicksand:wght@600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen selection:bg-pink-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
