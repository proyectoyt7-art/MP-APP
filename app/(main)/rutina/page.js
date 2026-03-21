"use client"
import { useState, useEffect } from 'react';
import { RutinaDiariaView } from '@/components/rutina/RutinaDiariaView';
import { RutinaConfigurarView } from '@/components/rutina/RutinaConfigurarView';
import { RutinaFormView } from '@/components/rutina/RutinaFormView';
import { RutinaSeleccionarView } from '@/components/rutina/RutinaSeleccionarView';
import { RutinaCalendarioView } from '@/components/rutina/RutinaCalendarioView';

const MOCK_ROUTINES = [
  { id: 'r1', name: 'Productividad Matutina', created_at: new Date().toISOString() },
  { id: 'r2', name: 'Restauración Nocturna', created_at: new Date().toISOString() }
];

const MOCK_ROUTINE_DAYS = [
  // 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado, 0=Domingo
  { id: 'rd1', routine_id: 'r1', day_of_week: 1 }, 
  { id: 'rd2', routine_id: 'r1', day_of_week: 2 }, 
  { id: 'rd3', routine_id: 'r1', day_of_week: 3 }, 
  { id: 'rd4', routine_id: 'r1', day_of_week: 4 }, 
  { id: 'rd5', routine_id: 'r1', day_of_week: 5 }, 
  { id: 'rd6', routine_id: 'r1', day_of_week: 6 }, 
  { id: 'rd0', routine_id: 'r1', day_of_week: 0 }, 
];

const MOCK_ACTIVITIES = [
  { id: 'a1', routine_id: 'r1', title: 'Meditar', start_time: '07:00', end_time: '07:15', duration: 15 },
  { id: 'a2', routine_id: 'r1', title: 'Hacer ejercicio', start_time: '07:20', end_time: '08:00', duration: 40 },
  { id: 'a3', routine_id: 'r1', title: 'Desayuno nutritivo', start_time: '08:15', end_time: '08:45', duration: 30 },
];

const MOCK_GOALS = [
  { id: 'g1', routine_id: 'r1', text: 'Beber 2L de agua a lo largo de la mañana' },
  { id: 'g2', routine_id: 'r1', text: 'Evitar teléfono 1 hora al despertar' },
];

export default function RutinaPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentView, setCurrentView] = useState('diaria'); // diaria, configurar, crear, editar, seleccionar
  const [routines, setRoutines] = useState([]);
  const [routineDays, setRoutineDays] = useState([]);
  const [activities, setActivities] = useState([]);
  const [goals, setGoals] = useState([]);
  const [dailyProgress, setDailyProgress] = useState([]);
  const [dailyGoalsProgress, setDailyGoalsProgress] = useState([]);
  const [dailySummaries, setDailySummaries] = useState([]); // { date, total, completed, percentage, isFull }
  const [editingRoutineId, setEditingRoutineId] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const savedRoutines = localStorage.getItem('rutinas_data');
    if (savedRoutines) {
      const data = JSON.parse(savedRoutines);
      setRoutines(data.routines || []);
      setRoutineDays(data.routineDays || []);
      setActivities(data.activities || []);
      setGoals(data.goals || []);
      setDailyProgress(data.dailyProgress || []);
      setDailyGoalsProgress(data.dailyGoalsProgress || []);
      setDailySummaries(data.dailySummaries || []);
    } else {
      // If no data, load mocks once
      setRoutines(MOCK_ROUTINES);
      setRoutineDays(MOCK_ROUTINE_DAYS);
      setActivities(MOCK_ACTIVITIES);
      setGoals(MOCK_GOALS);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('rutinas_data', JSON.stringify({
        routines,
        routineDays,
        activities,
        goals,
        dailyProgress,
        dailyGoalsProgress,
        dailySummaries
      }));
    }
  }, [routines, routineDays, activities, goals, dailyProgress, dailyGoalsProgress, dailySummaries, isLoaded]);

  const goConfigurar = () => setCurrentView('configurar');
  const goDiaria = () => setCurrentView('diaria');
  const goCrear = () => { setEditingRoutineId(null); setCurrentView('crear'); };
  const goEditar = (id) => { setEditingRoutineId(id); setCurrentView('editar'); };
  const goSeleccionar = () => setCurrentView('seleccionar');
  const goCalendario = () => setCurrentView('calendario');

  const handleSaveRoutine = (routineData) => {
    const isEditing = !!editingRoutineId;
    const newRoutineId = isEditing ? editingRoutineId : `r${Date.now()}`;
    
    if (isEditing) {
      setRoutines(prev => prev.map(r => r.id === newRoutineId ? { ...r, name: routineData.name } : r));
    } else {
      setRoutines(prev => [...prev, { id: newRoutineId, name: routineData.name, created_at: new Date().toISOString() }]);
    }
    
    // Process new data
    const newDays = routineData.days.map((day, index) => ({ 
      id: `rd${Date.now()}${index}`, 
      routine_id: newRoutineId, 
      day_of_week: day 
    }));
    const newActs = routineData.activities.map((act, index) => ({ 
      id: act.id?.startsWith('new_') ? `a${Date.now()}${index}` : act.id, 
      routine_id: newRoutineId, 
      title: act.title, 
      start_time: act.start_time, 
      end_time: act.end_time, 
      duration: parseInt(act.duration || 0) 
    }));
    const newGls = routineData.goals.map((goal, index) => ({ 
      id: goal.id?.startsWith('new_g_') ? `g${Date.now()}${index}` : goal.id, 
      routine_id: newRoutineId, 
      text: goal.text 
    }));

    // Perform updates in a single pass for filtering + addition
    setRoutineDays(prev => [...prev.filter(rd => rd.routine_id !== newRoutineId), ...newDays]);
    setActivities(prev => [...prev.filter(a => a.routine_id !== newRoutineId), ...newActs]);
    setGoals(prev => [...prev.filter(g => g.routine_id !== newRoutineId), ...newGls]);

    goConfigurar();
  };

  const handleApplyRoutinesToDays = (assignments) => {
    let newDays = [...routineDays];
    
    assignments.forEach(assignment => {
      // Clean ALL previous bindings for these specific days to ensure "only one active per day"
      newDays = newDays.filter(d => !assignment.days.includes(d.day_of_week));
      
      // Also clean previous bindings for this routine from any days
      newDays = newDays.filter(d => d.routine_id !== assignment.routine_id);
      
      assignment.days.forEach((dayOfW, index) => {
         newDays.push({ id: `newd${assignment.routine_id}${dayOfW}${Date.now()}`, routine_id: assignment.routine_id, day_of_week: dayOfW });
      });
    });

    setRoutineDays(newDays);
    goConfigurar();
  };

  const today = new Date();
  const todayDayOfWeek = today.getDay(); 

  const todaysAssignments = routineDays.filter(rd => rd.day_of_week === todayDayOfWeek);
  const todaysRoutineIds = todaysAssignments.map(rd => rd.routine_id);
  const todaysRoutines = routines.filter(r => todaysRoutineIds.includes(r.id));
  const todaysActivities = activities.filter(a => todaysRoutineIds.includes(a.routine_id));
  const todaysGoals = goals.filter(g => todaysRoutineIds.includes(g.routine_id));

  // Get date string in local time (YYYY-MM-DD)
  const todayDateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  const todaysCompletedActivities = todaysActivities.filter(a => 
    dailyProgress.some(dp => dp.activity_id === a.id && dp.date === todayDateString && dp.completed)
  ).map(a => a.id);

  const todaysCompletedGoals = todaysGoals.filter(g => 
    dailyGoalsProgress.some(dp => dp.goal_id === g.id && dp.date === todayDateString && dp.completed)
  ).map(g => g.id);

  const totalItems = todaysActivities.length + todaysGoals.length;
  const completedItems = todaysCompletedActivities.length + todaysCompletedGoals.length;
  const progressPercentage = totalItems > 0 ? Math.min(100, Math.round((completedItems / totalItems) * 100)) : 0;

  // Actualizar resumen diario para el calendario
  useEffect(() => {
    if (isLoaded && totalItems > 0) {
      setDailySummaries(prev => {
        const existingIdx = prev.findIndex(s => s.date === todayDateString);
        const newSummary = {
          date: todayDateString,
          total: totalItems,
          completed: completedItems,
          percentage: progressPercentage,
          isFull: progressPercentage === 100
        };
        
        if (existingIdx !== -1) {
          // Only update if values changed
          if (prev[existingIdx].percentage === progressPercentage && prev[existingIdx].total === totalItems) {
            return prev;
          }
          const newState = [...prev];
          newState[existingIdx] = newSummary;
          return newState;
        } else {
          return [...prev, newSummary];
        }
      });
    }
  }, [progressPercentage, totalItems, completedItems, todayDateString, isLoaded]);

  const toggleActivity = (activityId) => {
    setDailyProgress(prev => {
      const existingIdx = prev.findIndex(dp => dp.date === todayDateString && dp.activity_id === activityId);
      if (existingIdx !== -1) {
        const newState = [...prev];
        newState[existingIdx] = { ...newState[existingIdx], completed: !newState[existingIdx].completed };
        return newState;
      } else {
        return [...prev, { id: Date.now().toString(), date: todayDateString, activity_id: activityId, completed: true }];
      }
    });
  };

  const toggleGoal = (goalId) => {
    setDailyGoalsProgress(prev => {
      const existingIdx = prev.findIndex(dp => dp.date === todayDateString && dp.goal_id === goalId);
      if (existingIdx !== -1) {
        const newState = [...prev];
        newState[existingIdx] = { ...newState[existingIdx], completed: !newState[existingIdx].completed };
        return newState;
      } else {
        return [...prev, { id: Date.now().toString(), date: todayDateString, goal_id: goalId, completed: true }];
      }
    });
  };

  if (!isLoaded) return <div style={{ backgroundColor: 'var(--bg-color)' }} />;

  return (
    <div style={{ backgroundColor: 'var(--bg-color)' }}>
      {currentView === 'diaria' && (
        <RutinaDiariaView 
          routines={todaysRoutines}
          activities={todaysActivities}
          goals={todaysGoals}
          progressPercentage={progressPercentage}
          completedActivityIds={todaysCompletedActivities}
          completedGoalIds={todaysCompletedGoals}
          onToggleActivity={toggleActivity}
          onToggleGoal={toggleGoal}
          onSettingsClick={goConfigurar}
          onCalendarClick={goCalendario}
        />
      )}
      {currentView === 'calendario' && (
        <RutinaCalendarioView 
          dailySummaries={dailySummaries}
          onBack={goDiaria}
        />
      )}
      {currentView === 'configurar' && (
        <RutinaConfigurarView 
          routines={routines}
          onBack={goDiaria}
          onCreateClick={goCrear}
          onEditClick={goEditar}
          onSelectClick={goSeleccionar}
        />
      )}
      {(currentView === 'crear' || currentView === 'editar') && (
        <RutinaFormView 
          mode={currentView}
          initialRoutine={currentView === 'editar' ? routines.find(r => r.id === editingRoutineId) : null}
          initialActivities={currentView === 'editar' ? activities.filter(a => a.routine_id === editingRoutineId) : []}
          initialGoals={currentView === 'editar' ? goals.filter(g => g.routine_id === editingRoutineId) : []}
          initialDays={currentView === 'editar' ? routineDays.filter(d => d.routine_id === editingRoutineId).map(d => d.day_of_week) : []}
          onSave={handleSaveRoutine}
          onCancel={goConfigurar}
        />
      )}
      {currentView === 'seleccionar' && (
        <RutinaSeleccionarView 
          routines={routines}
          routineDays={routineDays}
          onApply={handleApplyRoutinesToDays}
          onCancel={goConfigurar}
        />
      )}
    </div>
  );
}
