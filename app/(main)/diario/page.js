"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { JournalHeader, JournalDateStrip } from '@/components/diario/SharedComponents';
import { JournalProgressView } from '@/components/diario/JournalProgressView';
import { JournalEmptyState, JournalEntryDetailView } from '@/components/diario/JournalDayViews';
import { JournalCreateEntryView } from '@/components/diario/JournalCreateEntryView';

// Helper to generate the object key used for our Mock DB (YYYY-MM-DD local logic)
const getDateKey = (date) => {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split('T')[0];
};

export default function DiarioPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [entries, setEntries] = useState({});
  const [view, setView] = useState('progress'); // 'progress' | 'day' | 'create'
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('diario_data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setEntries(data.entries || {});
      } catch (e) {
        console.error("Error parsing diario_data", e);
      }
    } else {
      // Seed data if empty
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayKey = getDateKey(yesterdayDate);
      setEntries({
        [yesterdayKey]: {
          id: '1',
          date: yesterdayDate.toISOString(),
          images: ['mock-image-url'],
          emotion: 'Calma',
          score: 8,
          note: 'Ayer fue un día reflexivo.',
          ocr_text: 'Estoy aprendiendo a controlar mi respiración en situaciones de presión.',
          reflection_text: 'La respiración consciente está ligada con menores índices de ansiedad en tu registro histórico. Es un excelente progreso que debes mantener.',
          essence_title: 'Día de Claridad',
          essence_description: 'Has logrado mantener un estado base de armonía.',
          essence_score: 85
        }
      });
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('diario_data', JSON.stringify({ entries }));
    }
  }, [entries, isLoaded]);

  const handleBack = () => {
    if (view === 'day') {
      setView('progress');
    } else {
      router.push('/inicio');
    }
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setView('day');
  };

  const currentEntry = entries[getDateKey(selectedDate)];

  // Create Mode takes full priority screen over the base layout
  if (view === 'create') {
    return (
      <JournalCreateEntryView 
        date={selectedDate} 
        onCancel={() => setView('day')} 
        onSave={(data) => {
          setEntries(prev => ({ ...prev, [getDateKey(selectedDate)]: data }));
          setView('day'); // Goes directly to the newly entered view showing Detail
        }} 
      />
    );
  }

  const isProgress = view === 'progress';

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', paddingBottom: '90px' }}>
      <JournalHeader 
        title={isProgress ? "Mi Progreso" : "Mi Diario"} 
        onBack={handleBack} 
        onSelectDate={handleSelectDate}
      />
      
      <JournalDateStrip 
        selectedDate={selectedDate} 
        onSelectDate={handleSelectDate} 
      />

      {isProgress ? (
        <JournalProgressView />
      ) : currentEntry ? (
        <JournalEntryDetailView entry={currentEntry} />
      ) : (
        <JournalEmptyState onCreateEntry={() => setView('create')} />
      )}
    </div>
  );
}
