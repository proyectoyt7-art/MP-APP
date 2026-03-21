"use client"
import BottomNavigation from '@/components/layout/BottomNavigation';
import { usePathname } from 'next/navigation';

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const isAgentIA = pathname === '/agente-ia';

  return (
    <div style={{ paddingBottom: isAgentIA ? '0px' : '70px', minHeight: '100vh', position: 'relative' }}>
      <main>
        {children}
      </main>
      {!isAgentIA && <BottomNavigation />}
    </div>
  );
}
