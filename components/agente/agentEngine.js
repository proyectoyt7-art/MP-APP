// ─────────────────────────────────────────────────────────────────────────────
// components/agente/agentEngine.js
// Intent parser + response generator for the Agente IA.
// Focused only on: ADD_ITEM and ADD_EXPENSE.
// ─────────────────────────────────────────────────────────────────────────────

// ── DATE PARSING HELPERS ─────────────────────────────────────────────────────

const DAYS_MAP = {
  hoy: 0, mañana: 1, pasado: 2,
  lunes: 1, martes: 2, miércoles: 3, jueves: 4, viernes: 5, sábado: 6, domingo: 0,
};

function extractDate(text) {
  const lower = text.toLowerCase();
  const today = new Date();
  
  if (lower.includes('hoy')) return today.toISOString().split('T')[0];
  if (lower.includes('mañana')) {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }
  if (lower.includes('pasado mañana')) {
    const d = new Date(today);
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  }

  const weekDays = { lunes: 1, martes: 2, miercoles: 3, miércoles: 3, jueves: 4, viernes: 5, sabado: 6, sábado: 6, domingo: 0 };
  for (const [name, targetDay] of Object.entries(weekDays)) {
    if (lower.includes(name)) {
      const d = new Date(today);
      const currentDay = d.getDay();
      let diff = targetDay - currentDay;
      if (diff <= 0) diff += 7; 
      d.setDate(d.getDate() + diff);
      return d.toISOString().split('T')[0];
    }
  }

  const dateMatch = lower.match(/(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?/);
  if (dateMatch) {
    const [, dd, mm, yy] = dateMatch;
    const year = yy ? (yy.length === 2 ? `20${yy}` : yy) : today.getFullYear();
    return `${year}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
  }
  return null;
}

function extractTime(text) {
  const match = text.match(/(\d{1,2}):(\d{2})(?:\s*(am|pm))?/i);
  if (match) {
    let [, h, m, ampm] = match;
    let hours = parseInt(h);
    if (ampm === 'pm' && hours < 12) hours += 12;
    if (ampm === 'am' && hours === 12) hours = 0;
    return `${String(hours).padStart(2, '0')}:${m}`;
  }
  const loose = text.match(/(?:a\s+las?|las?)\s+(\d{1,2})(?:\s*(am|pm))?/i);
  if (loose) {
    let [, h, ampm] = loose;
    let hours = parseInt(h);
    if (ampm === 'pm' && hours < 12) hours += 12;
    return `${String(hours).padStart(2, '0')}:00`;
  }
  return null;
}

function extractLocation(text) {
  const lower = text.toLowerCase();
  const patterns = [
    /(?:en|al|a\s+la|a\s+los|a\s+las)\s+(?:el\s+|la\s+|los\s+|las\s+)?([a-záéíóúñA-ZÁÉÍÓÚÑ]+(?:\s+[a-záéíóúñA-ZÁÉÍÓÚÑ]+)?)/i,
    /en\s+"([^"]+)"/i,
  ];
  for (const p of patterns) {
    const m = lower.match(p);
    if (m) {
      const candidate = (m[1] || '').trim();
      // Skip common words that are not locations but might follow 'a la' or 'en'
      const skipList = ['la', 'una', 'otra', 'esta', 'esa', 'mi', 'tu', 'su'];
      if (candidate.length > 2 && !skipList.includes(candidate.toLowerCase())) {
        return capitalize(candidate);
      }
    }
  }
  return null;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ── PRIORITY DETECTION ───────────────────────────────────────────────────────

function extractPriority(text) {
  const lower = text.toLowerCase();
  if (/urgente|urgentísimo|urgentisimo|ya mismo|cuanto antes|importante/.test(lower)) return 'urgent';
  if (/sin apuro|cuando pueda|después|despues|no hay prisa|tranquilo/.test(lower)) return 'no_rush';
  return 'normal';
}

// ── AMOUNT DETECTION ─────────────────────────────────────────────────────────

function extractAmount(text) {
  const lower = text.toLowerCase();
  // Improved regex to handle "20.000 pesos", "15000", "$5000"
  const m = lower.match(/(\d[\d.]*)(?:\s*(mil|k|pesos|p))?/i);
  if (!m) return null;
  let rawNum = m[1].replace(/\./g, ''); // Remove periods (thousands separators)
  let num = parseInt(rawNum);
  if (isNaN(num)) return null;
  if (/mil|k/i.test(m[2])) {
     // If user said "20 mil", and extracted "20", multiply. 
     // But if they typed "20.000 mil" we already have the zeros.
     if (num < 1000) num *= 1000;
  }
  return num;
}

// ── CATEGORY MATCHING ────────────────────────────────────────────────────────

function normalizeStr(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, '').trim();
}

function fuzzyMatchCategory(text, categories, subcategories) {
  const norm = normalizeStr(text);
  const words = norm.split(/\s+/);

  let bestMatch = null;
  let maxScore = 0;

  // Try subcategories first (more specific)
  for (const sc of subcategories) {
    const scNorm = normalizeStr(sc.name);
    // Exact word match in text?
    if (words.includes(scNorm)) {
      const cat = categories.find(c => c.id === sc.categoryId);
      return { cat, sub: sc };
    }
    // Partial score
    if (norm.includes(scNorm)) {
       const score = scNorm.length;
       if (score > maxScore) {
         maxScore = score;
         const cat = categories.find(c => c.id === sc.categoryId);
         bestMatch = { cat, sub: sc };
       }
    }
  }

  // Try categories
  for (const cat of categories) {
    const cNorm = normalizeStr(cat.name);
    if (words.includes(cNorm)) return { cat, sub: null };
    if (norm.includes(cNorm)) {
       const score = cNorm.length;
       if (score > maxScore) {
         maxScore = score;
         bestMatch = { cat, sub: null };
       }
    }
  }

  // Final check: if the best match is too short/weak, ignore it
  return maxScore >= 3 ? bestMatch : null;
}

// ── INTENT DETECTION ─────────────────────────────────────────────────────────

function detectIntent(text) {
  const lower = text.toLowerCase();
  const amount = extractAmount(lower);
  
  // High priority for expense: amount + verb OR amount + category keyword
  if (amount !== null && (
    /gast[eé]|pag[ué]|compr[eé]|registra|agrega|suma|anot[aáe]|en\s+/i.test(lower) ||
    /comida|transporte|salud|supermercado|restaurante|combustible/i.test(lower)
  )) {
    return 'ADD_EXPENSE';
  }

  // Add Item
  if (/comprar|hacer|llamar|ir a|ir al|ir a la|sacar|recordar|agregar|tengo que|debo|pendiente|cita|reunión|reunion|agendar|apuntar|anotar/i.test(lower)) {
    return 'ADD_ITEM';
  }

  // Default to item if it's 2+ words and no amount
  if (lower.split(' ').length >= 2 && amount === null) return 'ADD_ITEM';

  return 'GENERAL';
}

// ── RESPONSE BUILDERS ────────────────────────────────────────────────────────

function buildAddItemResponse(text) {
  const p = extractPriority(text);
  const d = extractDate(text);
  const t = extractTime(text);
  const l = extractLocation(text);
  const title = sanitizeTitle(text);

  const item = {
    id: `item_${Date.now()}`,
    title,
    itemType: /cita|médico|medico|doctor/.test(text.toLowerCase()) ? 'appointment' : 
              /comprar|compra|supermercado/.test(text.toLowerCase()) ? 'purchase' : 'task',
    category: 'Otros',
    priority: p,
    dueDate: d,
    dueTime: t,
    location: l,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const pLabel = { urgent: 'urgente', normal: 'normal', no_rush: 'sin apuro' }[p];
  return { intent: 'ADD_ITEM', item, reply: `✅ Listo, agregué **${title}** como ${pLabel}.` };
}

function buildAddExpenseResponse(text, categories, subcategories) {
  const amount = extractAmount(text);
  if (!amount) return { intent: 'ADD_EXPENSE', reply: '¿Cuánto fue el gasto?' };

  const match = fuzzyMatchCategory(text, categories, subcategories);
  if (!match) {
    return { intent: 'ADD_EXPENSE', reply: `No reconocí la categoría para los $${amount.toLocaleString('es-CL')}. ¿En cuál lo anoto?` };
  }

  const today = new Date().toISOString().split('T')[0];
  const entry = {
    id: `e_${Date.now()}`,
    categoryId: match.cat.id,
    subcategoryId: match.sub ? match.sub.id : null,
    amount,
    date: today,
    createdAt: new Date().toISOString(),
  };

  const name = match.sub ? match.sub.name : match.cat.name;
  return { intent: 'ADD_EXPENSE', item: entry, reply: `💸 Listo, agregué **$${amount.toLocaleString('es-CL')}** en ${name}.` };
}

function sanitizeTitle(text) {
  return text
    .replace(/\b(urgente?|urgentísimo|urgentisimo|mañana|hoy|pasado|lunes|martes|miércoles|jueves|viernes|sábado|domingo|a las \d+|a las \d+[:]\d+|ya mismo|cuanto antes|agrega|anota|pendiente)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[a-z]/, c => c.toUpperCase());
}

// ── MAIN EXPORT ──────────────────────────────────────────────────────────────

function buildConsultPendingResponse(text, agendaItems) {
  const lower = text.toLowerCase();
  const dateStr = extractDate(text);
  const loc = extractLocation(text);
  const isShoppingQuery = lower.includes('compr') || lower.includes('supermercado');

  const activeItems = agendaItems.filter(i => !i.isCompleted);
  
  // 1. Filter by date if mentioned
  let byDate = [];
  if (dateStr) {
    byDate = activeItems.filter(i => i.dueDate === dateStr);
  } else if (lower.includes('hoy')) {
    const today = new Date().toISOString().split('T')[0];
    byDate = activeItems.filter(i => i.dueDate === today);
  }

  // 2. Filter by location (regardless of date)
  let byLocation = [];
  if (loc) {
    byLocation = activeItems.filter(i => i.location && normalizeStr(i.location).includes(normalizeStr(loc)));
  }

  // 3. Filter by shopping
  let byShopping = [];
  if (isShoppingQuery) {
    byShopping = activeItems.filter(i => i.title.toLowerCase().includes('compr') || i.itemType === 'purchase');
  }

  // Build the final response
  if (dateStr || lower.includes('hoy')) {
    const dateLabel = dateStr ? 'para esa fecha' : 'para hoy';
    
    if (byDate.length > 0) {
      let reply = `${capitalize(dateLabel)} ${byDate.length === 1 ? 'tienes' : 'tienes'} ${byDate.length} ${byDate.length === 1 ? 'pendiente' : 'pendientes'}:\n`;
      reply += byDate.map(i => `• ${i.title}${i.dueTime ? ` (${i.dueTime})` : ''}`).join('\n');
      
      // If there's also something in that location but not on that date
      const locOpportunites = byLocation.filter(i => i.dueDate !== dateStr && (dateStr || i.dueDate !== new Date().toISOString().split('T')[0]));
      if (locOpportunites.length > 0) {
        reply += `\n\n💡 Aprovechando que vas ${text.includes(' al ') ? 'al' : 'a'} **${loc}**, recuerda que también tienes:\n`;
        reply += locOpportunites.map(i => `• ${i.title}`).join('\n');
      }
      return { intent: 'CONSULT_PENDING', reply };
    } else if (loc && byLocation.length > 0) {
      let reply = `${capitalize(dateLabel)} no tienes nada agendado. Pero ya que vas a **${loc}**, puedes aprovechar de:\n`;
      reply += byLocation.map(i => `• ${i.title}`).join('\n');
      return { intent: 'CONSULT_PENDING', reply };
    } else {
      return { intent: 'CONSULT_PENDING', reply: `No tienes nada pendiente ${dateLabel}${loc ? ` relacionado con ${loc}` : ''}.` };
    }
  }

  // If no date was mentioned, but location or shopping was
  if (loc && byLocation.length > 0) {
    return { 
      intent: 'CONSULT_PENDING', 
      reply: `En **${loc}** tienes lo siguiente pendiente:\n${byLocation.map(i => `• ${i.title}`).join('\n')}` 
    };
  }

  if (isShoppingQuery && byShopping.length > 0) {
    return { 
      intent: 'CONSULT_PENDING', 
      reply: `Tienes estas compras pendientes:\n${byShopping.map(i => `• ${i.title}`).join('\n')}` 
    };
  }

  // General list if no specific criteria matched
  if (activeItems.length > 0 && (lower.includes('pendiente') || lower.includes('hacer'))) {
    const limit = 5;
    const list = activeItems.slice(0, limit).map(i => `• ${i.title}`).join('\n');
    return { 
      intent: 'CONSULT_PENDING', 
      reply: `Tienes ${activeItems.length} pendientes en total. Aquí algunos:\n${list}` 
    };
  }

  return { 
    intent: 'CONSULT_PENDING', 
    reply: `No encontré pendientes ${loc ? `en ${loc}` : ''} que coincidan con lo que buscas.` 
  };
}

export function parseUserIntent(text, context = {}) {
  const { agendaItems = [], categories = [], subcategories = [] } = context;
  const lower = text.toLowerCase();
  
  // Custom Intent for Consultation
  if (/¿?(qué|que|tengo|hay|cuales|cuáles).*?(hacer|pendiente|agendado|comprar|compras|cita|reunion|reunión|doctor|centro|ciudad|hoy|mañana|miercoles|miércoles|jueves|viernes|sabado|sábado|domingo|lunes|martes)/i.test(lower) || 
      /consultar pendientes|ver pendientes|que tengo que hacer/i.test(lower)) {
    return buildConsultPendingResponse(text, agendaItems);
  }

  const intent = detectIntent(text);

  switch (intent) {
    case 'ADD_ITEM':
      return buildAddItemResponse(text);
    case 'ADD_EXPENSE':
      return buildAddExpenseResponse(text, categories, subcategories);
    default:
      return { intent: 'GENERAL', reply: 'Dime qué quieres hacer. Por ahora puedo anotar pendientes, registrar gastos o consultar lo que tienes por hacer.' };
  }
}
