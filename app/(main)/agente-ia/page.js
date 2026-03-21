"use client"
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { AgenteChatView } from '@/components/agente/AgenteChatView';
import { parseUserIntent } from '@/components/agente/agentEngine';
import { 
  readAgendaData, readFinanzasData,
  writeAgendaItem, writeFinanzasEntry 
} from '@/lib/agentHelpers';

export default function AgenteIAPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¿Qué anotamos hoy? Puedo guardar tus pendientes o gastos rápidamente.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [dataContext, setDataContext] = useState({
    agendaItems: [],
    categories: [],
    subcategories: []
  });

  useEffect(() => {
    const agenda = readAgendaData();
    const finanzas = readFinanzasData();
    setDataContext({
      agendaItems: agenda.agendaItems,
      categories: finanzas.categories,
      subcategories: finanzas.subcategories
    });
  }, []);

  const handleSendMessage = useCallback((text) => {
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setIsTyping(true);

    setTimeout(() => {
      const result = parseUserIntent(text, dataContext);
      if (result.intent === 'ADD_ITEM' && result.item) {
        writeAgendaItem(result.item);
        setDataContext(prev => ({ ...prev, agendaItems: [...prev.agendaItems, result.item] }));
        window.dispatchEvent(new CustomEvent('localStorageUpdate'));
      } else if (result.intent === 'ADD_EXPENSE' && result.item) {
        writeFinanzasEntry(result.item);
        window.dispatchEvent(new CustomEvent('localStorageUpdate'));
      }
      setMessages(prev => [...prev, { role: 'assistant', content: result.reply }]);
      setIsTyping(false);
    }, 600);
  }, [messages, dataContext]);

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
      <header style={{ 
        padding: '1rem 1.25rem', 
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-color)',
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <button 
          onClick={() => router.back()}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}
        >
          <ArrowLeft size={24} color="var(--text-main)" />
        </button>
        <div style={{ 
          width: '32px', height: '32px', borderRadius: '10px', 
          backgroundColor: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(34,197,94,0.3)'
        }}>
          <span style={{ fontSize: '18px' }}>🤖</span>
        </div>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>Agente IA</h1>
      </header>

      <AgenteChatView 
        messages={messages} 
        onSendMessage={handleSendMessage} 
        isTyping={isTyping}
        customHeight="calc(100vh - 70px)"
      />
    </div>
  );
}
