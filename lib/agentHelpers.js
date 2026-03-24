// ─────────────────────────────────────────────────────────────────────────────
// lib/agentHelpers.js
import { getStorageKey } from './storage';

// Shared data helpers — single source of truth for all cross-module reads/writes.
// Safe: merges into existing localStorage objects, never replaces whole keys.
// ─────────────────────────────────────────────────────────────────────────────

// ── READ HELPERS ─────────────────────────────────────────────────────────────

/** Read Agenda data from localStorage, with safe defaults. */
export function readAgendaData() {
  try {
    const raw = localStorage.getItem(getStorageKey('agenda_data'));
    if (!raw) return { agendaItems: [], goals: [], goalCheckpoints: [] };
    const d = JSON.parse(raw);
    return {
      agendaItems: d.agendaItems || [],
      goals: d.goals || [],
      goalCheckpoints: d.goalCheckpoints || [],
    };
  } catch {
    return { agendaItems: [], goals: [], goalCheckpoints: [] };
  }
}

/** Read Finanzas data from localStorage, with safe defaults. */
export function readFinanzasData() {
  try {
    const raw = localStorage.getItem(getStorageKey('finanzas_data'));
    if (!raw) return { categories: [], subcategories: [], entries: [], incomeSources: [], savingsItems: [], monthlyNotes: [], monthlyAnotaciones: [], monthlyAdjustments: [], fixedPayments: [] };
    const d = JSON.parse(raw);
    return {
      categories: d.categories || [],
      subcategories: d.subcategories || [],
      entries: d.entries || [],
      incomeSources: d.incomeSources || [],
      savingsItems: d.savingsItems || [],
      monthlyNotes: d.monthlyNotes || [],
      monthlyAnotaciones: d.monthlyAnotaciones || [],
      monthlyAdjustments: d.monthlyAdjustments || [],
      fixedPayments: d.fixedPayments || [],
    };
  } catch {
    return { categories: [], subcategories: [], entries: [], incomeSources: [], savingsItems: [], monthlyNotes: [], monthlyAnotaciones: [], monthlyAdjustments: [], fixedPayments: [] };
  }
}

/** Read Diario entries from localStorage. */
export function readDiarioData() {
  try {
    const raw = localStorage.getItem(getStorageKey('diario_data'));
    if (!raw) return { entries: {} };
    const d = JSON.parse(raw);
    return { entries: d.entries || {} };
  } catch {
    return { entries: {} };
  }
}

// ── WRITE HELPERS ────────────────────────────────────────────────────────────

/**
 * Safely adds a new agenda item to localStorage.
 * Preserves all existing data. Item must follow agendaItems format.
 */
export function writeAgendaItem(item) {
  const data = readAgendaData();
  data.agendaItems = [...data.agendaItems, item];
  localStorage.setItem(getStorageKey('agenda_data'), JSON.stringify(data));
}

/**
 * Safely adds a new finanzas entry to localStorage.
 * Entry must follow { id, categoryId, subcategoryId, amount, note, date, createdAt }.
 */
export function writeFinanzasEntry(entry) {
  try {
    const raw = localStorage.getItem(getStorageKey('finanzas_data'));
    const data = raw ? JSON.parse(raw) : {};
    data.entries = [...(data.entries || []), entry];
    localStorage.setItem(getStorageKey('finanzas_data'), JSON.stringify(data));
  } catch {
    // Silent fail — data integrity preserved
  }
}

/**
 * Safely saves diary entries (full replace of entries object).
 * Used by Diario page on save.
 */
export function writeDiarioData(entries) {
  localStorage.setItem(getStorageKey('diario_data'), JSON.stringify({ entries }));
}
