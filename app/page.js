'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem('auth_session');
    if (session) {
      const sessionData = JSON.parse(session);
      if (sessionData.isLoggedIn) {
        router.push('/inicio');
      } else {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--bg-color)' }}>
      <div className="fade-in" style={{ textAlign: 'center' }}>
        <h2 style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Cargando Mind Path...</h2>
      </div>
    </div>
  );
}
