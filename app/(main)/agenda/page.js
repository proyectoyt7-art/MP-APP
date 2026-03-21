"use client"
import { useState, useEffect, useCallback } from 'react';
import { AgendaMainView } from '@/components/agenda/AgendaMainView';
import { AgendaAddItemView } from '@/components/agenda/AgendaAddItemView';
import { AgendaAddGoalView } from '@/components/agenda/AgendaAddGoalView';
import { AgendaCalendarView } from '@/components/agenda/AgendaCalendarView';
import { ConfirmModal } from '@/components/layout/ConfirmModal';

import { supabase } from '@/lib/supabaseClient';

// ─── Seed data ───────────────────────────────────────────────
const SEED_ITEMS = [
  {
    id: 'item_sample', title: 'Pendiente de ejemplo', priority: 'normal',
    itemType: 'task', dueDate: null, dueTime: null, location: null, notes: null,
    isCompleted: false, createdAt: new Date().toISOString()
  },
];

const SEED_GOALS = [
  {
    id: 'goal_sample', title: 'Meta de ejemplo', description: 'Esta es una descripción corta de ejemplo para tu meta.',
    category: 'Relaciones', timeHorizon: 'short', status: 'en_progreso',
    coverGradient: 'linear-gradient(135deg, #f953c6 0%, #b91d73 100%)',
    routineActivityId: null, createdAt: new Date().toISOString()
  },
];

const SEED_CHECKPOINTS = [
  { id: 'cp_sample_1', goalId: 'goal_sample', title: 'Mini objetivo 1', isCompleted: false, createdAt: new Date().toISOString() },
  { id: 'cp_sample_2', goalId: 'goal_sample', title: 'Mini objetivo 2', isCompleted: false, createdAt: new Date().toISOString() },
];

export default function AgendaPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentView, setCurrentView] = useState('main'); // main | addItem | addGoal | calendar | goalProgress
  const [activeTab, setActiveTab] = useState('pendientes');
  const [viewingGoalId, setViewingGoalId] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    urgent: true,
    normal: true,
    no_rush: true,
    annotation: true
  });

  // Edit context
  const [editingItem, setEditingItem] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);

  // Data state
  const [agendaItems, setAgendaItems] = useState([]);
  const [goals, setGoals] = useState([]);
  const [goalCheckpoints, setGoalCheckpoints] = useState([]);

  // Confirm Modal state
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, type: null, id: null });

  // ─── Persistence ────────────────────────────────────────────
  useEffect(() => {
    // Load Data
    const saved = localStorage.getItem('agenda_data');
    if (saved) {
      const data = JSON.parse(saved);
      setAgendaItems(data.agendaItems || []);
      setGoals(data.goals || []);
      setGoalCheckpoints(data.goalCheckpoints || []);
    } else {
      setAgendaItems(SEED_ITEMS);
      setGoals(SEED_GOALS);
      setGoalCheckpoints(SEED_CHECKPOINTS);
    }

    // Load UI State
    const savedUI = localStorage.getItem('agenda_ui_state');
    if (savedUI) {
      setExpandedSections(JSON.parse(savedUI));
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('agenda_data', JSON.stringify({ agendaItems, goals, goalCheckpoints }));
    }
  }, [agendaItems, goals, goalCheckpoints, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('agenda_ui_state', JSON.stringify(expandedSections));
    }
  }, [expandedSections, isLoaded]);

  const toggleSection = useCallback((key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // ─── Item handlers ───────────────────────────────────────────
  const addItem = useCallback(async (itemData) => {
    const newItem = {
      id: `item_${Date.now()}`,
      ...itemData,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Save to local state then to Supabase
    setAgendaItems(prev => [...prev, newItem]);
    setCurrentView('main');
    setActiveTab('pendientes');

    // Supabase insert
    try {
      const { error } = await supabase.from('Agenda_items').insert([{
        title: newItem.title,
        priority: newItem.priority,
        due_date: newItem.dueDate || null,
        due_time: newItem.dueTime || null,
        location: newItem.location || null,
        notes: newItem.notes || null,
        is_completed: newItem.isCompleted || false,
        created_at: new Date()
      }]);
      if (error) {
        console.error("Error saving to Supabase (Agenda_items):", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
      } else {
        console.log("Item saved successfully to Supabase");
      }
    } catch (err) {
      console.error("Critical error connecting to Supabase:", err);
    }
  }, []);

  const updateItem = useCallback((itemData) => {
    setAgendaItems(prev => prev.map(i =>
      i.id === itemData.id ? { ...i, ...itemData, updatedAt: new Date().toISOString() } : i
    ));
    setEditingItem(null);
    setCurrentView('main');
  }, []);

  const toggleItem = useCallback((id) => {
    setAgendaItems(prev => prev.map(i =>
      i.id === id ? { ...i, isCompleted: !i.isCompleted, updatedAt: new Date().toISOString() } : i
    ));
  }, []);

  const deleteItem = useCallback((id) => {
    setConfirmDelete({ isOpen: true, type: 'item', id });
  }, []);

  const confirmDeleteItem = () => {
    setAgendaItems(prev => prev.filter(i => i.id !== confirmDelete.id));
    setConfirmDelete({ isOpen: false, type: null, id: null });
  };

  const startEditItem = (item) => {
    setEditingItem(item);
    setCurrentView('addItem');
  };

  // ─── Goal handlers ───────────────────────────────────────────
  const addGoal = useCallback((goalData) => {
    const { checkpoints = [], ...rest } = goalData;
    const goalId = `goal_${Date.now()}`;
    const newGoal = {
      id: goalId, ...rest,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    const newCheckpoints = checkpoints.map((c, idx) => ({
      ...c, id: `cp_${Date.now()}_${idx}`, goalId,
      createdAt: new Date().toISOString(),
    }));
    setGoals(prev => [...prev, newGoal]);
    setGoalCheckpoints(prev => [...prev, ...newCheckpoints]);
    setCurrentView('main');
    setActiveTab('metas');
  }, []);

  const updateGoal = useCallback((goalData) => {
    const { checkpoints = [], ...rest } = goalData;
    setGoals(prev => prev.map(g =>
      g.id === rest.id ? { ...g, ...rest, updatedAt: new Date().toISOString() } : g
    ));
    // Replace all checkpoints for this goal with the new ones
    setGoalCheckpoints(prev => {
      const others = prev.filter(c => c.goalId !== rest.id);
      const updated = checkpoints.map((c, idx) => ({
        ...c,
        id: c.id || `cp_${Date.now()}_${idx}`,
        goalId: rest.id,
        createdAt: c.createdAt || new Date().toISOString(),
      }));
      return [...others, ...updated];
    });
    setEditingGoal(null);
    setCurrentView('main');
  }, []);

  const deleteGoal = useCallback((id) => {
    setConfirmDelete({ isOpen: true, type: 'goal', id });
  }, []);

  const confirmDeleteGoal = () => {
    setGoals(prev => prev.filter(g => g.id !== confirmDelete.id));
    setGoalCheckpoints(prev => prev.filter(c => c.goalId !== confirmDelete.id));
    setConfirmDelete({ isOpen: false, type: null, id: null });
  };

  const startEditGoal = (goal) => {
    const checks = goalCheckpoints.filter(c => c.goalId === goal.id);
    setEditingGoal({ ...goal, checkpoints: checks });
    setCurrentView('addGoal');
  };

  const startViewGoalProgress = (goalId) => {
    setViewingGoalId(goalId);
    setCurrentView('goalProgress');
  };

  const toggleCheckpoint = useCallback((checkpointId) => {
    setGoalCheckpoints(prev => prev.map(c => 
      c.id === checkpointId ? { ...c, isCompleted: !c.isCompleted } : c
    ));
  }, []);

  // ─── Navigation helpers ──────────────────────────────────────
  const goAddItem = () => { setEditingItem(null); setCurrentView('addItem'); };
  const goAddGoal = () => { setEditingGoal(null); setCurrentView('addGoal'); };
  const goMain = () => { setEditingItem(null); setEditingGoal(null); setCurrentView('main'); };
  const goCalendar = () => setCurrentView('calendar');

  // ─── Sorting: pending first, then by priority ─────────────────
  const sortedItems = [...agendaItems].sort((a, b) => {
    // completed go to bottom
    if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
    const order = { urgent: 0, normal: 1, no_rush: 2, annotation: 3 };
    return (order[a.priority] ?? 1) - (order[b.priority] ?? 1);
  });

  if (!isLoaded) return <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh' }} />;

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
      {currentView === 'main' && (
        <AgendaMainView
          items={sortedItems}
          goals={goals}
          goalCheckpoints={goalCheckpoints}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onAddItem={goAddItem}
          onAddGoal={goAddGoal}
          onToggleItem={toggleItem}
          onEditItem={startEditItem}
          onDeleteItem={deleteItem}
          onEditGoal={startEditGoal}
          onDeleteGoal={deleteGoal}
          onViewGoalProgress={startViewGoalProgress}
          expandedSections={expandedSections}
          onToggleSection={toggleSection}
          onCalendarClick={goCalendar}
        />
      )}
      {currentView === 'goalProgress' && (
        <AgendaMainView
          items={sortedItems}
          goals={goals}
          goalCheckpoints={goalCheckpoints}
          activeTab={activeTab}
          viewingGoalId={viewingGoalId}
          isViewingProgress={true}
          onToggleCheckpoint={toggleCheckpoint}
          onBack={goMain}
          onEditGoal={startEditGoal}
          expandedSections={expandedSections}
          onToggleSection={toggleSection}
        />
      )}
      {currentView === 'addItem' && (
        <AgendaAddItemView
          editItem={editingItem}
          onSave={editingItem ? updateItem : addItem}
          onCancel={goMain}
        />
      )}
      {currentView === 'addGoal' && (
        <AgendaAddGoalView
          editGoal={editingGoal}
          onSave={editingGoal ? updateGoal : addGoal}
          onCancel={goMain}
        />
      )}
      {currentView === 'calendar' && (
        <AgendaCalendarView
          items={agendaItems}
          onToggleItem={toggleItem}
          onBack={goMain}
        />
      )}

      {/* MODAL DE CONFIRMACIÓN */}
      <ConfirmModal 
        isOpen={confirmDelete.isOpen}
        title="¿Eliminar?"
        message={confirmDelete.type === 'item' ? "¿Estás seguro de eliminar este pendiente?" : "¿Estás seguro de eliminar esta meta y sus objetivos?"}
        onConfirm={confirmDelete.type === 'item' ? confirmDeleteItem : confirmDeleteGoal}
        onCancel={() => setConfirmDelete({ isOpen: false, type: null, id: null })}
      />
    </div>
  );
}
