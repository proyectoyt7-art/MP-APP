import Link from 'next/link';
import { Home, Sparkles } from 'lucide-react';

export default function BottomNavigation() {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '70px',
      backgroundColor: 'var(--white)',
      borderTop: '1px solid var(--border-color)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingBottom: 'env(safe-area-inset-bottom)',
      zIndex: 50
    }}>
      <Link href="/inicio" style={navItemStyle}>
        <Home size={24} color="var(--text-main)" />
        <span style={navTextStyle}>Inicio</span>
      </Link>
      
      <Link href="/agente-ia" style={navItemStyle}>
        <div style={{
          backgroundColor: 'var(--primary-accent)',
          padding: '14px',
          borderRadius: '50%',
          marginTop: '-40px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Sparkles size={28} color="var(--white)" />
        </div>
        <span style={{...navTextStyle, marginTop: '8px'}}>Agente IA</span>
      </Link>
    </nav>
  );
}

const navItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textDecoration: 'none',
  color: 'var(--text-main)',
  flex: 1
};

const navTextStyle = {
  fontSize: '12px',
  marginTop: '4px',
  fontWeight: '500'
};
