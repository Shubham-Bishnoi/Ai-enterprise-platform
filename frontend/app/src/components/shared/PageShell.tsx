import type { ReactNode } from 'react';
import Navbar from '@/sections/Navbar';
import Footer from '@/sections/Footer';

interface PageShellProps {
  children: ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-void text-white">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
