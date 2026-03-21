import { useState } from 'react';
import { ChevronLeft, Plus, X, ListTodo, Clock, ChevronUp, ChevronDown } from 'lucide-react';

const SOFT_COLORS = [
  { id: 'default', bg: '#f8fafc', border: '#e2e8f0', accent: '#94a3b8' },
  { id: 'blue', bg: '#eff6ff', border: '#bfdbfe', accent: '#3b82f6' },
  { id: 'green', bg: '#f0fdf4', border: '#bbf7d0', accent: '#22c55e' },
  { id: 'yellow', bg: '#fffbeb', border: '#fef3c7', accent: '#f59e0b' },
  { id: 'purple', bg: '#faf5ff', border: '#e9d5ff', accent: '#a855f7' },
  { id: 'pink', bg: '#fff1f2', border: '#fecdd3', accent: '#ec4899' },
];

export function RutinaFormView({ mode, initialRoutine, initialActivities, initialGoals, initialDays, onSave, onCancel }) {
  const isEditing = mode === 'editar';
  
  const [name, setName] = useState(initialRoutine?.name || '');
  const [selectedDays, setSelectedDays] = useState(initialDays || []);
  const [activities, setActivities] = useState(initialActivities || []);
  const [goals, setGoals] = useState(initialGoals || []);
  const [newActivity, setNewActivity] = useState({ name: '', time: '' });
  const [newGoal, setNewGoal] = useState('');

  const handleAddActivity = () => {
    setActivities([...activities, { id: `new_${Date.now()}`, title: '', start_time: '08:00', end_time: '09:00', duration: 60, color_id: 'default' }]);
  };
  const handleUpdateActivity = (index, field, value) => {
    setActivities(prev => prev.map((act, i) => i === index ? { ...act, [field]: value } : act));
  };
  const handleRemoveActivity = (index) => {
    setActivities(activities.filter((_, i) => i !== index));
  };
  const handleMoveActivity = (index, direction) => {
    if (direction === 'up' && index > 0) {
      const newActs = [...activities];
      [newActs[index - 1], newActs[index]] = [newActs[index], newActs[index - 1]];
      setActivities(newActs);
    } else if (direction === 'down' && index < activities.length - 1) {
      const newActs = [...activities];
      [newActs[index + 1], newActs[index]] = [newActs[index], newActs[index + 1]];
      setActivities(newActs);
    }
  };

  const handleAddGoal = () => {
    setGoals([...goals, { id: `new_g_${Date.now()}`, text: '' }]);
  };
  const handleUpdateGoal = (index, value) => {
    setGoals(prev => prev.map((goal, i) => i === index ? { ...goal, text: value } : goal));
  };
  const handleRemoveGoal = (index) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const toggleDay = (dayId) => {
    setSelectedDays(prev => 
      prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]
    );
  };

  const handleSave = () => {
    if(!name.trim()) return alert("La rutina debe tener un nombre");
    onSave({
      name,
      days: selectedDays,
      activities: activities.filter(a => a.title.trim() !== ''),
      goals: goals.filter(g => g.text.trim() !== '')
    });
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)' }}>
      <header style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', backgroundColor: 'var(--bg-color)', position: 'sticky', top: 0, zIndex: 10, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-main)', padding: '8px', marginLeft: '-8px' }}>
            <ChevronLeft size={24} />
          </button>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-main)', margin: '0 0 0 12px' }}>
            {isEditing ? 'Editar Rutina' : 'Crear Rutina'}
          </h2>
        </div>
        <button 
          onClick={handleSave}
          style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--primary-accent)', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
        >
          Guardar
        </button>
      </header>

      <div style={{ padding: '0 1.5rem' }}>
        
        {/* Nombre */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>NOMBRE DE LA RUTINA</label>
          <input 
            type="text" 
            placeholder="Ej. Productividad Matutina"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)', fontSize: '16px', color: 'var(--text-main)', outline: 'none' }}
          />
        </div>

        {/* Actividades */}
        <div style={{ marginBottom: '2.5rem' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
             <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', margin: 0 }}>LÍNEA DE TIEMPO</label>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
             {activities.map((act, index) => {
               const currentColor = SOFT_COLORS.find(c => c.id === (act.color_id || 'default')) || SOFT_COLORS[0];
               return (
                 <div key={act.id} style={{ 
                   display: 'flex', gap: '12px', 
                   backgroundColor: 'var(--card-bg)', 
                   border: `1px solid ${currentColor.border}`, 
                   borderLeft: `6px solid ${currentColor.accent}`,
                   borderRadius: '12px', padding: '16px', position: 'relative',
                   transition: 'all 0.2s'
                 }}>
                   {/* Botones de reordenar */}
                   <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px', marginLeft: '-8px' }}>
                     <button 
                        onClick={() => handleMoveActivity(index, 'up')}
                        disabled={index === 0}
                        style={{ background: 'none', border: 'none', cursor: index === 0 ? 'default' : 'pointer', color: index === 0 ? '#e2e8f0' : 'var(--text-muted)', padding: '2px' }}
                     >
                       <ChevronUp size={16} />
                     </button>
                     <button 
                        onClick={() => handleMoveActivity(index, 'down')}
                        disabled={index === activities.length - 1}
                        style={{ background: 'none', border: 'none', cursor: index === activities.length - 1 ? 'default' : 'pointer', color: index === activities.length - 1 ? '#e2e8f0' : 'var(--text-muted)', padding: '2px' }}
                     >
                       <ChevronDown size={16} />
                     </button>
                   </div>

                   <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '80px', flexShrink: 0 }}>
                      <input type="time" value={act.start_time} onChange={e => handleUpdateActivity(index, 'start_time', e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', width: '100%', backgroundColor: 'transparent' }} />
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px', backgroundColor: 'transparent' }}>
                        <input type="number" placeholder="min" value={act.duration} onChange={e => handleUpdateActivity(index, 'duration', e.target.value)} style={{ width: '100%', border: 'none', background: 'none', fontSize: '13px', outline: 'none' }} />
                      </div>
                   </div>
                   <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input type="text" placeholder="¿Qué harás?" value={act.title} onChange={e => handleUpdateActivity(index, 'title', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--bg-color)', fontSize: '15px', color: 'var(--text-main)', outline: 'none' }} />
                      
                      {/* Color Picker */}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)' }}>COLOR:</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {SOFT_COLORS.map(color => (
                            <button
                              key={color.id}
                              onClick={() => handleUpdateActivity(index, 'color_id', color.id)}
                              style={{
                                width: '20px', height: '20px', borderRadius: '50%',
                                backgroundColor: color.bg, border: `1px solid ${act.color_id === color.id ? color.accent : color.border}`,
                                cursor: 'pointer', transition: 'transform 0.1s',
                                transform: act.color_id === color.id ? 'scale(1.2)' : 'scale(1)',
                                boxShadow: act.color_id === color.id ? `0 0 0 2px ${color.accent}33` : 'none'
                              }}
                            />
                          ))}
                        </div>
                      </div>
                   </div>
                   <button onClick={() => handleRemoveActivity(index)} style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--text-main)', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                     <X size={14} />
                   </button>
                 </div>
               );
             })}
           </div>
           
           <button onClick={handleAddActivity} style={{ marginTop: '16px', backgroundColor: 'transparent', border: '1px dashed var(--border-color)', borderRadius: '12px', padding: '14px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-main)', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
             <Clock size={16} /> Añadir bloque de tiempo
           </button>
        </div>

        {/* Goals */}
        <div style={{ marginBottom: '2.5rem' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
             <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', margin: 0 }}>OBJETIVOS (Checklist)</label>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
             {goals.map((goal, index) => (
               <div key={goal.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px 16px' }}>
                 <ListTodo size={18} color="var(--text-muted)" />
                 <input type="text" placeholder="Objetivo..." value={goal.text} onChange={e => handleUpdateGoal(index, e.target.value)} style={{ flex: 1, border: 'none', backgroundColor: 'transparent', fontSize: '15px', color: 'var(--text-main)', outline: 'none' }} />
                 <button onClick={() => handleRemoveGoal(index)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                   <X size={18} />
                 </button>
               </div>
             ))}
           </div>

           <button onClick={handleAddGoal} style={{ marginTop: '12px', backgroundColor: 'transparent', border: '1px dashed var(--border-color)', borderRadius: '12px', padding: '14px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-main)', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
             <Plus size={16} /> Añadir objetivo
           </button>
        </div>

      </div>
    </div>
  );
}
