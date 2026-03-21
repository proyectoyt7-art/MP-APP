'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');

  // Clear error when switching modes
  useEffect(() => {
    setError('');
  }, [isRegister]);

  // Check if already logged in
  useEffect(() => {
    const session = localStorage.getItem('auth_session');
    if (session) {
      const sessionData = JSON.parse(session);
      if (sessionData.isLoggedIn) {
        router.push('/inicio');
      }
    }
  }, [router]);

  const handleAuth = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic Validations
    if (!email || !password || (!isRegister && false) || (isRegister && !name)) {
      setError('Por favor completa todos los campos.');
      setLoading(false);
      return;
    }

    const users = JSON.parse(localStorage.getItem('auth_users') || '[]');

    if (isRegister) {
      // Register logic
      const userExists = users.find(u => u.email === email);
      if (userExists) {
        setError('Este correo ya está registrado.');
        setLoading(false);
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // In a real app, this should be hashed
        created_at: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('auth_users', JSON.stringify(users));
      
      // Auto login after register
      localStorage.setItem('auth_session', JSON.stringify({
        isLoggedIn: true,
        userId: newUser.id,
        email: newUser.email,
        name: newUser.name
      }));
      
      router.push('/inicio');
    } else {
      // Login logic
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem('auth_session', JSON.stringify({
          isLoggedIn: true,
          userId: user.id,
          email: user.email,
          name: user.name
        }));
        router.push('/inicio');
      } else {
        setError('Correo o contraseña incorrectos.');
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      padding: '2rem',
      backgroundColor: 'var(--bg-color)' 
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
          {isRegister ? 'Crear cuenta' : 'Bienvenido'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
          {isRegister ? 'Únete a Mind Path hoy mismo' : 'Inicia sesión para continuar'}
        </p>
      </div>
      
      <form 
        onSubmit={handleAuth}
        style={{ 
          width: '100%', 
          maxWidth: '360px', 
          background: 'var(--card-bg)', 
          padding: '2.5rem', 
          borderRadius: '24px', 
          border: '1px solid var(--border-color)', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        {isRegister && (
          <div className="fade-in">
            <label style={labelStyle}>Nombre completo</label>
            <input 
              type="text" 
              placeholder="Tu nombre" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle} 
            />
          </div>
        )}
        
        <div>
          <label style={labelStyle}>Correo electrónico</label>
          <input 
            type="email" 
            placeholder="correo@ejemplo.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle} 
          />
        </div>
        
        <div>
          <label style={labelStyle}>Contraseña</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle} 
          />
        </div>

        {!isRegister && (
          <button 
            type="button"
            onClick={() => {
              setError('');
              setIsRecovery(true);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              textAlign: 'right',
              marginTop: '-4px',
              marginBottom: '4px',
              paddingRight: '4px'
            }}
          >
            ¿Olvidaste tu contraseña?
          </button>
        )}

        {error && (
          <p style={{ color: '#ef4444', fontSize: '14px', margin: '4px 0', fontWeight: '500', textAlign: 'center' }}>
            {error}
          </p>
        )}
        
        <button 
          type="submit"
          disabled={loading}
          style={{ 
            marginTop: '1rem',
            backgroundColor: 'var(--text-main)', 
            color: 'var(--white)', 
            padding: '0.85rem', 
            borderRadius: '14px', 
            border: 'none',
            fontSize: '16px',
            fontWeight: '700', 
            cursor: 'pointer',
            transition: 'all 0.2s',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Cargando...' : isRegister ? 'Registrarse' : 'Ingresar'}
        </button>

        <button 
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          style={{
            background: 'none',
            border: 'none',
            color: '#6366f1',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '0.5rem',
            textAlign: 'center'
          }}
        >
          {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </button>
      </form>

      {/* Recovery Flow Overlay */}
      {isRecovery && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '2rem'
        }}>
          <div className="fade-in" style={{
            backgroundColor: 'var(--card-bg)', padding: '2rem', borderRadius: '24px',
            width: '100%', maxWidth: '360px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: '1px solid var(--border-color)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>Recuperar contraseña</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Ingresa tu correo y te enviaremos instrucciones para restablecer tu cuenta.
            </p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Correo electrónico</label>
              <input 
                type="email" 
                placeholder="correo@ejemplo.com" 
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                style={inputStyle} 
              />
            </div>

            {recoveryMessage && (
              <p style={{ color: '#059669', fontSize: '14px', marginBottom: '1.5rem', fontWeight: '500', textAlign: 'center', backgroundColor: '#ecfdf5', padding: '12px', borderRadius: '12px' }}>
                {recoveryMessage}
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {!recoveryMessage && (
                <button 
                  onClick={() => {
                    if (!recoveryEmail) return alert('Ingresa un correo');
                    setRecoveryMessage('La recuperación por correo quedará habilitada al conectar el sistema real de autenticación.');
                  }}
                  style={{
                    backgroundColor: 'var(--text-main)', color: 'white', padding: '12px',
                    borderRadius: '12px', border: 'none', fontWeight: '700', cursor: 'pointer'
                  }}
                >
                  Enviar enlace
                </button>
              )}
              <button 
                onClick={() => {
                  setIsRecovery(false);
                  setRecoveryMessage('');
                  setRecoveryEmail('');
                }}
                style={{
                  background: 'none', border: '1px solid var(--border-color)', padding: '12px',
                  borderRadius: '12px', color: 'var(--text-muted)', fontWeight: '600', cursor: 'pointer'
                }}
              >
                {recoveryMessage ? 'Cerrar' : 'Cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '600',
  color: 'var(--text-muted)',
  marginBottom: '6px',
  marginLeft: '4px'
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid var(--border-color)',
  borderRadius: '12px',
  fontSize: '15px',
  outline: 'none',
  transition: 'border-color 0.2s',
  backgroundColor: '#f8fafc'
};
