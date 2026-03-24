/**
 * Utility to isolate localStorage data by user ID.
 */
export function getStorageKey(baseKey) {
  if (typeof window === 'undefined') return baseKey;
  
  const sessionRaw = localStorage.getItem('auth_session');
  if (sessionRaw) {
    try {
      const session = JSON.parse(sessionRaw);
      if (session && session.userId) {
        return `user_${session.userId}_${baseKey}`;
      }
    } catch (e) {
      console.error("Error parsing auth_session for storage key:", e);
    }
  }
  return baseKey;
}

/**
 * Enhanced localStorage helpers that automatically apply user prefix
 */
export const storage = {
  get: (key) => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(getStorageKey(key));
  },
  set: (key, value) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(getStorageKey(key), value);
  },
  remove: (key) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(getStorageKey(key));
  }
};
