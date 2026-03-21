'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Book, Calendar, CheckSquare, DollarSign, Sparkles, LogOut } from 'lucide-react';

const frasesDiarias = [
  "Hoy es un buen día para avanzar con calma.",
  "Pequeños pasos llevan a grandes metas.",
  "Confía en tu proceso y sigue adelante.",
  "Cada día es una nueva oportunidad.",
  "La constancia es la forma más suave de éxito.",
  "Tu bienestar es tu prioridad hoy.",
  "Disfruta del camino, no solo del destino.",
  "Respira profundo y encuentra tu centro.",
  "Hoy elige ser amable contigo mismo.",
  "Lo más importante es cómo te sientes por dentro.",
  "Cultiva la paz en cada pequeña acción.",
  "Sigue tu propio ritmo, no hay prisa.",
  "La gratitud transforma lo que tienes en suficiente.",
  "Cree en lo que estás construyendo día a día.",
  "Un corazón tranquilo ve la belleza en todo."
];

export default function InicioPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);

  const hoy = new Date();
  const currentDate = hoy.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  const formattedDate = currentDate.charAt(0).toUpperCase() + currentDate.slice(1);

  // Seleccionamos frase según la fecha para que sea estable durante 24h
  const fraseIndex = (hoy.getDate() + (hoy.getMonth() * 31) + hoy.getFullYear()) % frasesDiarias.length;
  const fraseDelDia = frasesDiarias[fraseIndex];

  const audioRef = useRef(null);

  useEffect(() => {
    // Check session
    const savedSession = localStorage.getItem('auth_session');
    if (savedSession) {
      setSession(JSON.parse(savedSession));
    } else if (router) {
      router.push('/login');
    }

    // Precarga del sonido
    audioRef.current = new Audio('/tap.mp3');
    audioRef.current.volume = 0.2;
    audioRef.current.preload = 'auto';
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth_session');
    if (router) router.push('/login');
  };

  const playTap = () => {
    if (audioRef.current) {
      // Reiniciar y reproducir para evitar delays y manejar clicks rápidos
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        /* Silenciar errores si el navegador bloquea autoplay sin interacción */
      });
    }
  };

  return (
    <div style={{ padding: '2rem 1.5rem', backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
            Hola, {session?.name || 'Usuario'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '500' }}>
            {formattedDate}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              borderRadius: '50%',
              transition: 'background 0.2s'
            }}
            title="Cerrar sesión"
          >
            <LogOut size={22} />
          </button>
          <Link href="/agente-ia" style={{
            backgroundColor: 'var(--primary-accent)',
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            textDecoration: 'none'
          }}>
            <Sparkles size={22} color="var(--white)" />
          </Link>
        </div>
      </header>

      {/* Motivational Card */}
      <div style={{
        backgroundColor: '#f8f5f2', // Warm, creamy tone
        padding: '1.25rem 1.5rem',
        borderRadius: '20px',
        marginBottom: '2.5rem',
        textAlign: 'center',
        border: '1px solid rgba(0,0,0,0.03)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        <p style={{
          color: '#6d635b', // Warm muted brown
          fontSize: '15px',
          fontWeight: '500',
          fontStyle: 'italic',
          lineHeight: '1.5'
        }}>
          "{fraseDelDia}"
        </p>
      </div>

      {/* Context Text */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '500', color: 'var(--text-muted)', letterSpacing: '-0.3px' }}>
          ¿Qué te gustaría hacer hoy?
        </h2>
      </div>

      {/* Navigation Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <ActionCard href="/diario" icon={<Book size={32} strokeWidth={1.5} />} title="Diario" variant="diario" onAction={playTap} />
        <ActionCard href="/rutina" icon={<CheckSquare size={32} strokeWidth={1.5} />} title="Rutina" variant="rutina" onAction={playTap} />
        <ActionCard href="/agenda" icon={<Calendar size={32} strokeWidth={1.5} />} title="Agenda" variant="agenda" onAction={playTap} />
        <ActionCard href="/finanzas" icon={<DollarSign size={32} strokeWidth={1.5} />} title="Finanzas" variant="finanzas" onAction={playTap} />
      </div>
    </div>
  );
}

function ActionCard({ href, icon, title, variant, onAction }) {
  const variantClass = variant ? `action-card-${variant}` : '';
  
  return (
    <Link 
      href={href} 
      onClick={onAction}
      className={`action-card ${variantClass}`} 
      style={{
        padding: '2rem 1rem',
        borderRadius: '24px',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '150px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
        border: '1px solid transparent'
      }}
    >
      <div className="icon-container" style={{ marginBottom: '16px' }}>
        {icon}
      </div>
      <span style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text-main)' }}>{title}</span>
    </Link>
  );
}
