'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Book, Calendar, CheckSquare, DollarSign, Sparkles, Settings, Camera, User, Lock, LogOut, X, ChevronRight } from 'lucide-react';

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
  const [showSettings, setShowSettings] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const hoy = new Date();
  const currentDate = hoy.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  const formattedDate = currentDate.charAt(0).toUpperCase() + currentDate.slice(1);

  // Seleccionamos frase según la fecha para que sea estable durante 24h
  const fraseIndex = (hoy.getDate() + (hoy.getMonth() * 31) + hoy.getFullYear()) % frasesDiarias.length;
  const fraseDelDia = frasesDiarias[fraseIndex];

  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Check session
    const savedSession = localStorage.getItem('auth_session');
    if (savedSession) {
      const parsedSession = JSON.parse(savedSession);
      setSession(parsedSession);
      if (parsedSession.profileImage) {
        setProfileImage(parsedSession.profileImage);
      }
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfileImage(base64String);
        
        // Save to session
        const updatedSession = { ...session, profileImage: base64String };
        setSession(updatedSession);
        localStorage.setItem('auth_session', JSON.stringify(updatedSession));
        
        // Also update in users list if needed (optional for mock)
        const users = JSON.parse(localStorage.getItem('auth_users') || '[]');
        const updatedUsers = users.map(u => u.id === session.userId ? { ...u, profileImage: base64String } : u);
        localStorage.setItem('auth_users', JSON.stringify(updatedUsers));
      };
      reader.readAsDataURL(file);
    }
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
    <div style={{ padding: '2rem 1.5rem 6rem', backgroundColor: 'var(--bg-color)', minHeight: '100vh', position: 'relative' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Foto de Perfil */}
          <div 
            style={{ 
              width: '48px', height: '48px', borderRadius: '50%', 
              backgroundColor: '#e2e8f0', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            {profileImage ? (
              <img src={profileImage} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={24} color="#94a3b8" />
            )}
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
              Hola, {session?.name || 'Usuario'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '500' }}>
              {formattedDate}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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

      {/* Settings Gear Button - Solo en Inicio, discreto en la parte inferior */}
      <div style={{ position: 'fixed', bottom: '2rem', left: '0', right: '0', display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 50 }}>
        <button 
          onClick={() => setShowSettings(true)}
          style={{
            pointerEvents: 'auto',
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-color)',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '10px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            transition: 'all 0.2s'
          }}
          title="Configuración"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Settings Panel Overlay */}
      {showSettings && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="slide-up" style={{
            backgroundColor: 'var(--bg-color)', width: '100%', maxWidth: '500px',
            borderTopLeftRadius: '32px', borderTopRightRadius: '32px',
            padding: '2rem 1.5rem 3rem', boxShadow: '0 -10px 40px rgba(0,0,0,0.1)',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowSettings(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#f1f5f9', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer' }}
            >
              <X size={20} color="#94a3b8" />
            </button>
            
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '2rem', textAlign: 'center' }}>Configuración</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f1f5f9', overflow: 'hidden', border: '3px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {profileImage ? (
                      <img src={profileImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <User size={40} color="#cbd5e1" />
                    )}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: 'var(--text-main)', color: 'white', border: '2px solid white', borderRadius: '50%', padding: '6px', cursor: 'pointer', display: 'flex' }}
                  >
                    <Camera size={14} />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
                </div>
                <p style={{ marginTop: '12px', fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>{session?.name}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{session?.email}</p>
              </div>

              <SettingsItem icon={<Camera size={18} />} title="Editar / subir foto" onClick={() => fileInputRef.current?.click()} />
              <SettingsItem icon={<User size={18} />} title="Editar nombre" />
              <SettingsItem icon={<Lock size={18} />} title="Cambiar contraseña" />
              <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '8px 0' }} />
              <SettingsItem 
                icon={<LogOut size={18} />} 
                title="Cerrar sesión" 
                color="#ef4444" 
                onClick={handleLogout}
                noChevron
              />
            </div>
          </div>
        </div>
      )}

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

function SettingsItem({ icon, title, color = 'var(--text-main)', onClick, noChevron = false }) {
  return (
    <button 
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
        borderRadius: '16px', border: '1px solid var(--border-color)',
        backgroundColor: 'var(--card-bg)', cursor: 'pointer', transition: 'all 0.2s',
        width: '100%'
      }}
    >
      <div style={{ color: color }}>{icon}</div>
      <span style={{ fontSize: '15px', fontWeight: '600', color: color, flex: 1, textAlign: 'left' }}>{title}</span>
      {!noChevron && <ChevronRight size={18} color="#cbd5e1" />}
    </button>
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
