"use client"
import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Sparkles, PlusCircle, Wallet, BookOpen, AlertCircle } from 'lucide-react';
import { useVoiceInput } from './useVoiceInput';

export function AgenteChatView({ messages, onSendMessage, isTyping, customHeight }) {
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);
  const [toast, setToast] = useState(null);

  const { isListening, start, stop, isSupported } = useVoiceInput({
    onResult: (text, isFinal) => {
      setInput(text);
      if (isFinal) {
        // Optional: auto-send if you want, but better to let user review
      }
    },
    onError: (err) => showToast(err)
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const quickActions = [
    { label: 'Agregar pendiente', icon: <PlusCircle size={16} />, prompt: 'Agregar pendiente: ' },
    { label: 'Registrar gasto', icon: <Wallet size={16} />, prompt: 'Gasto: ' },
  ];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: customHeight || 'calc(100vh - 140px)', 
      backgroundColor: 'var(--bg-color)', position: 'relative'
    }}>
      {/* Messages */}
      <div 
        ref={scrollRef}
        style={{
          flex: 1, overflowY: 'auto', padding: '1.5rem',
          display: 'flex', flexDirection: 'column', gap: '1rem',
          paddingBottom: '1rem'
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            display: 'flex', flexDirection: 'column',
            alignItems: m.role === 'user' ? 'flex-end' : 'flex-start',
            animation: 'fadeInUp 0.3s ease-out'
          }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: m.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
              backgroundColor: m.role === 'user' ? '#22c55e' : 'var(--card-bg)',
              color: m.role === 'user' ? 'white' : 'var(--text-main)',
              fontSize: '14px', lineHeight: '1.5',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              border: m.role === 'user' ? 'none' : '1px solid var(--border-color)',
              whiteSpace: 'pre-wrap'
            }}>
              {m.content}
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', opacity: 0.7 }}>
              {m.role === 'user' ? 'Tú' : 'Asistente'}
            </span>
          </div>
        ))}
        {isTyping && (
          <div style={{ alignSelf: 'flex-start', padding: '12px 16px', borderRadius: '20px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', display: 'flex', gap: '4px' }}>
            <div className="typing-dot" style={{ width: '6px', height: '6px', backgroundColor: '#94a3b8', borderRadius: '50%' }}></div>
            <div className="typing-dot" style={{ width: '6px', height: '6px', backgroundColor: '#94a3b8', borderRadius: '50%', animationDelay: '0.2s' }}></div>
            <div className="typing-dot" style={{ width: '6px', height: '6px', backgroundColor: '#94a3b8', borderRadius: '50%', animationDelay: '0.4s' }}></div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{
        padding: '1rem', borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-color)', zIndex: 5,
        paddingBottom: '1rem'
      }}>
        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', scrollbarWidth: 'none' }}>
          {quickActions.map(a => (
            <button 
              key={a.label}
              onClick={() => {
                if (a.label === 'Analizar diario') {
                   onSendMessage(a.prompt);
                } else {
                   setInput(a.prompt);
                }
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '20px',
                backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)',
                fontSize: '12px', fontWeight: '600', color: 'var(--text-main)',
                whiteSpace: 'nowrap', cursor: 'pointer'
              }}
            >
              {a.icon} {a.label}
            </button>
          ))}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          backgroundColor: 'var(--card-bg)', borderRadius: '24px',
          padding: '6px 6px 6px 16px', border: '1px solid var(--border-color)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)'
        }}>
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe algo..."
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontSize: '14px', color: 'var(--text-main)', padding: '8px 0'
            }}
          />
          
          <button 
            onClick={isListening ? stop : start}
            style={{
              width: '40px', height: '40px', borderRadius: '20px',
              border: 'none', backgroundColor: isListening ? '#fef2f2' : 'transparent',
              color: isListening ? '#ef4444' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            style={{
              width: '40px', height: '40px', borderRadius: '20px',
              border: 'none', backgroundColor: '#22c55e', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', opacity: input.trim() ? 1 : 0.5
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'absolute', bottom: '100px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', padding: '8px 16px',
          borderRadius: '20px', fontSize: '13px', zIndex: 100, display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <AlertCircle size={16} /> {toast}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .typing-dot {
          animation: bounce 1.4s infinite ease-in-out both;
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
