"use client"
import { useState, useEffect, useCallback, useMemo } from 'react';
import { FinanzasMainView } from '@/components/finanzas/FinanzasMainView';
import { FinanzasConfigView } from '@/components/finanzas/FinanzasConfigView';
import { FinanzasSavingsView } from '@/components/finanzas/FinanzasSavingsView';
import { FinanzasHistoryView } from '@/components/finanzas/FinanzasHistoryView';
import { FinanzasAddExpenseModal } from '@/components/finanzas/FinanzasAddExpenseModal';

// ─── Mock seed data ───────────────────────────────────────────
const SEED_CATEGORIES = [
  { id: 'cat_1', name: 'Vivienda', budget: 100000, icon: '🏠', sortOrder: 0, effectType: 'expense' },
  { id: 'cat_2', name: 'Gastos básicos', budget: 100000, icon: '💡', sortOrder: 1, effectType: 'expense' },
  { id: 'cat_3', name: 'Comidas', budget: 100000, icon: '🍽️', sortOrder: 2, effectType: 'expense' },
  { id: 'cat_4', name: 'Transporte', budget: 100000, icon: '🚗', sortOrder: 3, effectType: 'expense' },
  { id: 'cat_5', name: 'Hobbies', budget: 100000, icon: '🎨', sortOrder: 4, effectType: 'expense' },
  { id: 'cat_6', name: 'Gastos personales', budget: 100000, icon: '👤', sortOrder: 5, effectType: 'expense' },
];

const SEED_SUBCATEGORIES = [
  { id: 'sub_1', categoryId: 'cat_1', name: 'Arriendo', sortOrder: 0 },
  { id: 'sub_2', categoryId: 'cat_2', name: 'Luz', sortOrder: 0 },
  { id: 'sub_3', categoryId: 'cat_2', name: 'Agua', sortOrder: 1 },
  { id: 'sub_4', categoryId: 'cat_2', name: 'Gas', sortOrder: 2 },
  { id: 'sub_5', categoryId: 'cat_3', name: 'Mercaderías', sortOrder: 0 },
  { id: 'sub_6', categoryId: 'cat_3', name: 'Frutas y verduras', sortOrder: 1 },
  { id: 'sub_7', categoryId: 'cat_4', name: 'Locomoción', sortOrder: 0 },
  { id: 'sub_8', categoryId: 'cat_5', name: 'Hobby', sortOrder: 0 },
  { id: 'sub_9', categoryId: 'cat_6', name: 'Personal', sortOrder: 0 },
];

const SEED_ENTRIES = []; // Start fresh for new profiles

// ─── Helpers ──────────────────────────────────────────────────
function getNow() {
  return new Date();
}

function getMonthKey(m, y) {
  return `${y}-${String(m + 1).padStart(2, '0')}`;
}

function formatCLP(amount) {
  return '$' + Math.round(amount).toLocaleString('es-CL');
}

// ─── Page Component ───────────────────────────────────────────
export default function FinanzasPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentView, setCurrentView] = useState('main'); // main | config | savings | history
  const [currentYear, setCurrentYear] = useState(getNow().getFullYear());

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [entries, setEntries] = useState([]);
  const [incomeSources, setIncomeSources] = useState([]);
  const [savingsItems, setSavingsItems] = useState([]);
  const [monthlyNotes, setMonthlyNotes] = useState([]); // Historial observations
  const [monthlyAnotaciones, setMonthlyAnotaciones] = useState([]); // Main screen notes
  const [monthlyAdjustments, setMonthlyAdjustments] = useState([]); // Surplus overrides
  const [fixedPayments, setFixedPayments] = useState([]); // [{ subId, month, year }]
  const [expandedCategories, setExpandedCategories] = useState({}); // { catId: true/false }

  // Modal state
  const [expenseModal, setExpenseModal] = useState({ open: false, categoryId: null, subcategoryId: null, subcategoryName: '' });

  // ─── Persistence ────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem('finanzas_data');
    if (saved) {
      const data = JSON.parse(saved);
      setCategories(data.categories || []);
      setSubcategories(data.subcategories || []);
      setEntries(data.entries || []);
      setIncomeSources(data.incomeSources || []);
      setSavingsItems(data.savingsItems || []);
      setMonthlyNotes(data.monthlyNotes || []);
      setMonthlyAnotaciones(data.monthlyAnotaciones || []);
      setMonthlyAdjustments(data.monthlyAdjustments || []);
      setFixedPayments(data.fixedPayments || []);
    } else {
      setCategories(SEED_CATEGORIES);
      setSubcategories(SEED_SUBCATEGORIES);
      setEntries(SEED_ENTRIES);
      setIncomeSources([
        { id: 'inc_1', name: 'Sueldo', amount: 1000000 },
      ]);
      setSavingsItems([
        { id: 'sav_1', name: 'Ahorro emergencia', amount: 200000 },
      ]);
      setMonthlyNotes([]);
      setMonthlyAnotaciones([]);
      setMonthlyAdjustments([]);
      setFixedPayments([]);
    }
    
    // Load UI state
    const savedUI = localStorage.getItem('finanzas_ui_state');
    if (savedUI) {
      const uiData = JSON.parse(savedUI);
      setExpandedCategories(uiData.expandedCategories || {});
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('finanzas_ui_state', JSON.stringify({ expandedCategories }));
    }
  }, [expandedCategories, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('finanzas_data', JSON.stringify({ 
        categories, subcategories, entries, incomeSources, savingsItems, 
        monthlyNotes, monthlyAnotaciones, monthlyAdjustments, fixedPayments
      }));
    }
  }, [categories, subcategories, entries, incomeSources, savingsItems, monthlyNotes, monthlyAnotaciones, monthlyAdjustments, fixedPayments, isLoaded]);

  // ─── Computed values ────────────────────────────────────────
  const now = getNow();
  const monthIdxNow = now.getMonth();
  const yearNow = now.getFullYear();
  const monthKeyNow = getMonthKey(monthIdxNow, yearNow);

  const calculateMonthStats = useCallback((monthIdx, year) => {
    const key = getMonthKey(monthIdx, year);
    const mEntries = entries.filter(e => e.date.startsWith(key));
    
    const spent = categories.reduce((sum, cat) => {
      // Normal category calculation
      let catTotal = 0;
      const catSubs = subcategories.filter(s => s.categoryId === cat.id);

      if (cat.effectType === 'fixed_expense') {
        // Only sum marked as paid
        catTotal = catSubs.reduce((sSum, sub) => {
          const isPaid = fixedPayments.some(p => p.subId === sub.id && p.month === monthIdx && p.year === year);
          return sSum + (isPaid ? (sub.monthlyAmount || 0) : 0);
        }, 0);
      } else {
        catTotal = catSubs.reduce((sSum, sub) => {
          return sSum + mEntries.filter(e => e.subcategoryId === sub.id).reduce((eSum, e) => eSum + e.amount, 0);
        }, 0);
      }
      
      if (cat.effectType === 'credit') return sum - catTotal;
      if (cat.effectType === 'saving') return sum;
      return sum + catTotal;
    }, 0);

    const baseIncomes = incomeSources.reduce((sum, i) => sum + i.amount, 0);
    
    // Check if there is ANY real information in this month
    const hasInfo = mEntries.length > 0 || 
                    fixedPayments.some(p => p.month === monthIdx && p.year === year) ||
                    monthlyNotes.some(n => n.month === monthIdx && n.year === year) ||
                    monthlyAnotaciones.some(n => n.month === monthIdx && n.year === year);

    const categoryBreakdown = categories.map(cat => {
      const catSubs = subcategories.filter(s => s.categoryId === cat.id);
      let catTotal = 0;
      if (cat.effectType === 'fixed_expense') {
        catTotal = catSubs.reduce((sSum, sub) => {
          const isPaid = fixedPayments.some(p => p.subId === sub.id && p.month === monthIdx && p.year === year);
          return sSum + (isPaid ? (sub.monthlyAmount || 0) : 0);
        }, 0);
      } else {
        catTotal = catSubs.reduce((sSum, sub) => {
          return sSum + mEntries.filter(e => e.subcategoryId === sub.id).reduce((eSum, e) => eSum + e.amount, 0);
        }, 0);
      }
      return { id: cat.id, name: cat.name, amount: catTotal, effectType: cat.effectType };
    });

    return { spent, baseIncomes, hasInfo, categoryBreakdown };
  }, [entries, categories, subcategories, incomeSources, fixedPayments, monthlyNotes, monthlyAnotaciones]);

  // Chain Calculation for surpluses with overrides
  const historyData = useMemo(() => {
    const data = [];
    let carryover = 0;
    for (let i = 0; i < 12; i++) {
       const stats = calculateMonthStats(i, currentYear);
       
       // Improved Surplus Logic:
       // Carryover is 0 if this is the first month we have info for,
       // unless it was manually adjusted.
       const budget = stats.baseIncomes + carryover;
       const calculatedSurplus = budget - stats.spent;
       
       // Priority: Manual Adjustment
       const adj = monthlyAdjustments.find(a => a.month === i && a.year === currentYear);
       const finalSurplus = adj ? adj.amount : (stats.hasInfo ? calculatedSurplus : 0);

       data.push({
         budget,
         spent: stats.spent,
         surplus: finalSurplus,
         calculatedSurplus,
         isAdjusted: !!adj,
         carryoverPrev: carryover,
         hasInfo: stats.hasInfo,
         categoryBreakdown: stats.categoryBreakdown
       });
       
       // Carry over only if there was info or an adjustment
       carryover = (stats.hasInfo || adj) ? finalSurplus : 0;
    }
    return data;
  }, [calculateMonthStats, currentYear, monthlyAdjustments]);

  // Current month derived values
  const currentMonthData = historyData[monthIdxNow];
  const totalBudget = currentMonthData?.budget || 0;
  const totalSpent = currentMonthData?.spent || 0;
  const totalPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const currentMonthEntries = useMemo(() =>
    entries.filter(e => e.date.startsWith(monthKeyNow)),
    [entries, monthKeyNow]
  );

  const getSubcategoryTotal = useCallback((subId, cat) => {
    if (cat?.effectType === 'fixed_expense') {
      const isPaid = fixedPayments.some(p => p.subId === subId && p.month === monthIdxNow && p.year === yearNow);
      const sub = subcategories.find(s => s.id === subId);
      return isPaid ? (sub?.monthlyAmount || 0) : 0;
    }
    return currentMonthEntries.filter(e => e.subcategoryId === subId).reduce((sum, e) => sum + e.amount, 0);
  }, [currentMonthEntries, fixedPayments, subcategories, monthIdxNow, yearNow]);

  const getCategoryTotal = useCallback((catId) => {
    const cat = categories.find(c => c.id === catId);
    const subs = subcategories.filter(s => s.categoryId === catId);
    return subs.reduce((sum, s) => sum + getSubcategoryTotal(s.id, cat), 0);
  }, [subcategories, getSubcategoryTotal, categories]);

  const getCategoryPercentage = useCallback((catId) => {
    const cat = categories.find(c => c.id === catId);
    if (!cat || cat.budget <= 0) return 0;
    return Math.round((getCategoryTotal(catId) / cat.budget) * 100);
  }, [categories, getCategoryTotal]);

  const totalSavings = useMemo(() => {
    const directSavings = savingsItems.reduce((sum, i) => sum + i.amount, 0);
    const categorySavings = categories
      .filter(c => c.effectType === 'saving' || c.name.toLowerCase().includes('ahorro'))
      .reduce((sum, c) => sum + getCategoryTotal(c.id), 0);
    return directSavings + categorySavings;
  }, [savingsItems, categories, getCategoryTotal]);

  const incomeSourcesWithSurplus = useMemo(() => {
    const base = [...incomeSources];
    if (currentMonthData && currentMonthData.carryoverPrev !== 0) {
      base.push({ id: 'dynamic_surplus', name: 'Excedente mes ant.', amount: currentMonthData.carryoverPrev });
    }
    return base;
  }, [incomeSources, currentMonthData]);

  // ─── Handlers ───────────────────────────────────────────────
  const toggleFixedPayment = useCallback((subId) => {
    setFixedPayments(prev => {
      const idx = prev.findIndex(p => p.subId === subId && p.month === monthIdxNow && p.year === yearNow);
      if (idx !== -1) return prev.filter((_, i) => i !== idx);
      return [...prev, { subId, month: monthIdxNow, year: yearNow }];
    });
  }, [monthIdxNow, yearNow]);

  const saveAnotacion = (note) => {
    setMonthlyAnotaciones(prev => {
      const existing = prev.findIndex(a => a.month === monthIdxNow && a.year === yearNow);
      if (existing !== -1) {
        const next = [...prev];
        next[existing] = { ...next[existing], note };
        return next;
      }
      return [...prev, { month: monthIdxNow, year: yearNow, note }];
    });
  };

  const saveAdjustment = (month, year, amount) => {
    setMonthlyAdjustments(prev => {
      const existing = prev.findIndex(a => a.month === month && a.year === year);
      if (existing !== -1) {
        if (amount === null) return prev.filter((_, i) => i !== existing); // Clear adjustment
        const next = [...prev];
        next[existing] = { ...next[existing], amount };
        return next;
      }
      return amount === null ? prev : [...prev, { month, year, amount }];
    });
  };

  const addEntry = useCallback((categoryId, subcategoryId, amount, note = '') => {
    const dateStr = `${yearNow}-${String(monthIdxNow + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const newEntry = {
      id: `e_${Date.now()}`,
      categoryId,
      subcategoryId,
      amount: Math.round(amount),
      note,
      date: dateStr,
      createdAt: now.toISOString(),
    };
    setEntries(prev => [...prev, newEntry]);
  }, [monthIdxNow, yearNow, now]);

  const addCategory = useCallback((name, budget, icon = '📁', effectType = 'expense') => {
    const maxSort = categories.length > 0 ? Math.max(...categories.map(c => c.sortOrder)) + 1 : 0;
    setCategories(prev => [...prev, { id: `cat_${Date.now()}`, name, budget, icon, sortOrder: maxSort, effectType }]);
  }, [categories]);

  const updateCategory = (id, upd) => setCategories(prev => prev.map(c => c.id === id ? { ...c, ...upd } : c));
  const deleteCategory = (id) => setCategories(prev => prev.filter(c => c.id !== id));
  const reorderCategories = (newOrder) => setCategories(prev => newOrder.map(id => prev.find(c => c.id === id)).filter(Boolean));

  const addSubcategory = (categoryId, name, monthlyAmount = 0) => 
    setSubcategories(prev => [...prev, { id: `sub_${Date.now()}`, categoryId, name, sortOrder: prev.length, monthlyAmount }]);
  const updateSubcategory = (id, upd) => setSubcategories(prev => prev.map(s => s.id === id ? { ...s, ...upd } : s));
  const deleteSubcategory = (id) => setSubcategories(prev => prev.filter(s => s.id !== id));
  const reorderSubcategories = (catId, order) => setSubcategories(prev => prev.map(s => s.categoryId === catId ? { ...s, sortOrder: order.indexOf(s.id) } : s));

  const addIncomeSource = (name, amount) => setIncomeSources(prev => [...prev, { id: `inc_${Date.now()}`, name, amount }]);
  const updateIncomeSource = (id, upd) => setIncomeSources(prev => prev.map(i => i.id === id ? { ...i, ...upd } : i));
  const deleteIncomeSource = (id) => setIncomeSources(prev => prev.filter(i => i.id !== id));

  const addSavingsItem = (name, amount) => setSavingsItems(prev => [...prev, { id: `sav_${Date.now()}`, name, amount }]);
  const updateSavingsItem = (id, upd) => setSavingsItems(prev => prev.map(i => i.id === id ? { ...i, ...upd } : i));
  const deleteSavingsItem = (id) => setSavingsItems(prev => prev.filter(i => i.id !== id));

  const saveMonthlyNote = (month, year, note) => {
    setMonthlyNotes(prev => {
      const existing = prev.findIndex(n => n.month === month && n.year === year);
      if (existing !== -1) {
        const next = [...prev];
        next[existing] = { ...next[existing], note };
        return next;
      }
      return [...prev, { month, year, note }];
    });
  };

  const openExpenseModal = (catId, subId, name) => setExpenseModal({ open: true, categoryId: catId, subcategoryId: subId, subcategoryName: name });
  const closeExpenseModal = () => setExpenseModal({ open: false, categoryId: null, subcategoryId: null, subcategoryName: '' });
  const handleExpenseSubmit = (amount, note) => {
    if (expenseModal.categoryId && expenseModal.subcategoryId && amount > 0) {
      addEntry(expenseModal.categoryId, expenseModal.subcategoryId, amount, note);
    }
    closeExpenseModal();
  };

  const toggleCategoryExpansion = useCallback((catId) => {
    setExpandedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  }, []);

  const goMain = () => setCurrentView('main');
  const goConfig = () => setCurrentView('config');
  const goSavings = () => setCurrentView('savings');
  const goHistory = () => setCurrentView('history');

  const sortedCategories = useMemo(() => [...categories].sort((a,b) => a.sortOrder - b.sortOrder), [categories]);

  const getSortedSubcategories = useCallback((catId) =>
    subcategories.filter(s => s.categoryId === catId).sort((a, b) => a.sortOrder - b.sortOrder),
    [subcategories]
  );

  if (!isLoaded) return <div style={{ backgroundColor: 'var(--bg-color)' }} />;

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
      {currentView === 'main' && (
        <FinanzasMainView
          categories={sortedCategories}
          getSortedSubcategories={getSortedSubcategories}
          getCategoryTotal={getCategoryTotal}
          getCategoryPercentage={getCategoryPercentage}
          getSubcategoryTotal={(id) => getSubcategoryTotal(id, sortedCategories.find(c => c.id === subcategories.find(s => s.id === id)?.categoryId))}
          totalBudget={totalBudget}
          totalSpent={totalSpent}
          totalPercentage={totalPercentage}
          incomeSources={incomeSourcesWithSurplus}
          activeAnotacion={monthlyAnotaciones.find(a => a.month === monthIdxNow && a.year === yearNow)?.note || ''}
          fixedPayments={fixedPayments.filter(p => p.month === monthIdxNow && p.year === yearNow)}
          onSettingsClick={goConfig}
          onSavingsClick={goSavings}
          onHistoryClick={goHistory}
          onSubcategoryClick={openExpenseModal}
          onToggleFixedPayment={toggleFixedPayment}
          onSaveAnotacion={saveAnotacion}
          formatCLP={formatCLP}
          expandedCategories={expandedCategories}
          onToggleCategory={toggleCategoryExpansion}
        />
      )}
      {currentView === 'config' && (
        <FinanzasConfigView
          categories={sortedCategories}
          getSortedSubcategories={getSortedSubcategories}
          incomeSources={incomeSources}
          onBack={goMain}
          onAddCategory={addCategory}
          onUpdateCategory={updateCategory}
          onDeleteCategory={deleteCategory}
          onReorderCategories={reorderCategories}
          onAddSubcategory={addSubcategory}
          onUpdateSubcategory={updateSubcategory}
          onDeleteSubcategory={deleteSubcategory}
          onReorderSubcategories={reorderSubcategories}
          onAddIncomeSource={addIncomeSource}
          onUpdateIncomeSource={updateIncomeSource}
          onDeleteIncomeSource={deleteIncomeSource}
          formatCLP={formatCLP}
        />
      )}
      {currentView === 'savings' && (
        <FinanzasSavingsView
          savingsItems={savingsItems}
          categories={categories}
          getCategoryTotal={getCategoryTotal}
          totalSavings={totalSavings}
          onBack={goMain}
          onAddSavingsItem={addSavingsItem}
          onUpdateSavingsItem={updateSavingsItem}
          onDeleteSavingsItem={deleteSavingsItem}
          formatCLP={formatCLP}
        />
      )}
      {currentView === 'history' && (
        <FinanzasHistoryView
          historyData={historyData}
          monthlyNotes={monthlyNotes}
          currentYear={currentYear}
          onBack={goMain}
          onSaveNote={saveMonthlyNote}
          onSaveAdjustment={saveAdjustment}
          formatCLP={formatCLP}
        />
      )}
      {expenseModal.open && (
        <FinanzasAddExpenseModal
          subcategoryName={expenseModal.subcategoryName}
          onSubmit={handleExpenseSubmit}
          onClose={closeExpenseModal}
        />
      )}
    </div>
  );
}
