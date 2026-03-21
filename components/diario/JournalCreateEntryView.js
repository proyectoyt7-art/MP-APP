import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Mic, MicOff, Brain } from 'lucide-react';

export function JournalCreateEntryView({ date, onCancel, onSave }) {
  const [emotion, setEmotion] = useState('');
  const [score, setScore] = useState(5);
  const [note, setNote] = useState('');
  const [inputMethod, setInputMethod] = useState('typed'); 
  const [isListening, setIsListening] = useState(false);
  const [reflection, setReflection] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const recognitionRef = useRef(null);

  const formattedDate = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  const emotions = ['Calma', 'Ansiedad', 'Alegría', 'Tristeza', 'Frustración', 'Productividad'];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'es-ES';

        recognitionRef.current.onresult = (event) => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              const transcript = event.results[i][0].transcript;
              setNote((prev) => (prev ? prev + ' ' : '') + transcript);
            }
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const handleMicClick = () => {
    if (!recognitionRef.current) {
      alert("Tu navegador no permite dictado por voz en este momento. Puedes escribir tu entrada manualmente.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      setInputMethod('voice');
    }
  };

  const handleAnalyze = () => {
    if (!note.trim()) {
      alert('Escribe o dicta algo primero para poder analizarlo.');
      return;
    }
    setIsAnalyzing(true);
    // Simular el proceso de IA de extraer una reflexión basada en el contenido
    setTimeout(() => {
      const previewText = note.length > 50 ? note.substring(0, 50) + "..." : note;
      setReflection(`Basado en tu entrada: "${previewText}", noto que estás enfocando fuertemente tu energía. Mantén ese impulso para continuar mejorando tu día.`);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleSave = () => {
    onSave({
      id: Date.now().toString(),
      date: date.toISOString(),
      input_method: inputMethod || 'typed',
      emotion: emotion || 'Neutral',
      score,
      note,
      ocr_text: note || "Entrada en blanco",
      reflection_text: reflection || "Sin reflexión procesada.",
      essence_title: emotion || "Emoción Resaltada",
      essence_description: `Identificamos una predominancia hacia la emoción ${emotion || 'neutralidad'}.`,
      essence_score: score * 10 
    });
  };

  return (
    <div style={{ 
      backgroundColor: 'var(--bg-color)', 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflowY: 'auto',
      zIndex: 100,
      paddingBottom: '40px' 
    }}>
      <header style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', backgroundColor: 'var(--bg-color)', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-main)', padding: '8px', marginLeft: '-8px' }}>
          <ChevronLeft size={24} />
        </button>
        <div style={{ marginLeft: '12px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>Tu entrada del día</span>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>{formattedDate}</h2>
        </div>
      </header>

      <div style={{ padding: '0 1.5rem', marginTop: '0.5rem' }}>
        
        {/* Escritura / Dictado PRINCIPAL */}
        <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-main)' }}>Escribe o dicta tu entrada</h3>
        <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
          <textarea 
            placeholder="Expresa aquí tus pensamientos del día..."
            value={note}
            onChange={e => {
              setNote(e.target.value);
              if (inputMethod !== 'voice') setInputMethod('typed');
            }}
            style={{
              width: '100%',
              height: '180px',
              padding: '16px 16px 64px 16px',
              borderRadius: '16px',
              border: isListening ? '2px solid var(--primary-accent)' : '1px solid var(--border-color)',
              backgroundColor: 'var(--card-bg)',
              fontSize: '15px',
              fontFamily: 'inherit',
              lineHeight: '1.5',
              resize: 'none',
              color: 'var(--text-main)',
              boxShadow: isListening ? '0 0 0 4px rgba(216, 194, 170, 0.2)' : '0 2px 4px rgba(0,0,0,0.02)',
              transition: 'all 0.2s'
            }}
          />
          <button 
            onClick={handleMicClick}
            style={{ 
              position: 'absolute', 
              bottom: '16px', 
              right: '16px', 
              backgroundColor: isListening ? '#ef4444' : 'var(--text-main)', 
              border: 'none', 
              borderRadius: '50%', 
              width: '48px', 
              height: '48px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer',
              color: 'var(--white)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'background-color 0.2s',
              zIndex: 5
            }}>
             {isListening ? <MicOff size={22} /> : <Mic size={22} />}
          </button>
          
          {isListening && (
            <span style={{ position: 'absolute', bottom: '30px', right: '76px', fontSize: '13px', color: '#ef4444', fontWeight: '600' }}>
              Escuchando...
            </span>
          )}
        </div>

        {/* Check-in emocional */}
        <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-main)' }}>¿Qué emoción predominó hoy?</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '2rem' }}>
          {emotions.map(emo => (
            <button 
              key={emo} 
              onClick={() => setEmotion(emo)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: emotion === emo ? 'none' : '1px solid var(--border-color)',
                backgroundColor: emotion === emo ? 'var(--text-main)' : 'var(--white)',
                color: emotion === emo ? 'var(--white)' : 'var(--text-main)',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: emotion === emo ? '0 4px 8px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              {emo}
            </button>
          ))}
        </div>

        {/* Slider indicando energía */}
        <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-main)' }}>Nivel de energía o bienestar</h3>
        <div style={{ marginBottom: '3rem', padding: '0 8px' }}>
          <input 
            type="range" 
            min="1" max="10" 
            value={score} 
            onChange={e => setScore(Number(e.target.value))}
            style={{ width: '100%', marginBottom: '12px', height: '6px', borderRadius: '4px', appearance: 'none', backgroundColor: 'var(--border-color)', outline: 'none' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span>Bajo</span>
            <span>Medio</span>
            <span>Alto</span>
          </div>
        </div>

        {/* Reflexión Basada en Texto */}
        <div style={{ backgroundColor: '#f9f6f0', border: '1px solid #e2d9c8', borderRadius: '16px', padding: '16px', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ flex: 1, marginRight: '16px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px', color: '#8a6e45' }}>Reflexión del día</h4>
            {isAnalyzing ? (
              <p style={{ fontSize: '13px', color: '#8a6e45', margin: 0 }}>Analizando tu entrada...</p>
            ) : reflection ? (
              <p style={{ fontSize: '14px', color: '#5c4826', margin: 0, fontStyle: 'italic', lineHeight: '1.4' }}>"{reflection}"</p>
            ) : (
              <p style={{ fontSize: '12px', color: '#9c835f', margin: 0 }}>Procesa tu entrada con IA en un clic.</p>
            )}
          </div>
          <button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing} 
            style={{ 
              backgroundColor: isAnalyzing ? '#e2d9c8' : '#d8c2aa', 
              color: 'var(--white)', 
              border: 'none', 
              borderRadius: '50%', 
              width: '40px', 
              height: '40px', 
              flexShrink: 0, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              cursor: isAnalyzing ? 'not-allowed' : 'pointer', 
              boxShadow: isAnalyzing ? 'none' : '0 2px 8px rgba(216, 194, 170, 0.4)' 
            }}>
            <Brain size={20} />
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '1rem' }}>
          <button 
            onClick={onCancel}
            style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--white)', color: 'var(--text-main)', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: 'var(--text-main)', color: 'var(--white)', fontSize: '15px', fontWeight: '500', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          >
            Guardar entrada
          </button>
        </div>

      </div>
    </div>
  );
}
