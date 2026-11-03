// Safe LocalStorage helpers with JSON parsing and fallback error handling

const STORAGE_PREFIX = 'deadline_radar_';

export const storage = {
  get: (key, defaultValue) => {
    try {
      const item = window.localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error writing localStorage key "${key}":`, error);
    }
  },

  remove: (key) => {
    try {
      window.localStorage.removeItem(STORAGE_PREFIX + key);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  },

  clearAll: () => {
    try {
      const keysToRemove = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => window.localStorage.removeItem(k));
    } catch (error) {
      console.warn('Error clearing application storage:', error);
    }
  }
};

