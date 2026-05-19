import { useState, useEffect } from 'react';
import { storage, StorageTypes } from '@/lib/storage';

/**
 * Custom hook for reactive localStorage management
 * Automatically syncs state with localStorage
 */
export function useLocalStorage<K extends keyof StorageTypes>(
  key: K,
  defaultValue: StorageTypes[K]
): [StorageTypes[K], (value: StorageTypes[K]) => void] {
  const [value, setValue] = useState<StorageTypes[K]>(() => {
    return storage.get(key, defaultValue);
  });

  const setStoredValue = (newValue: StorageTypes[K]) => {
    try {
      setValue(newValue);
      storage.set(key, newValue);
    } catch (error) {
      console.error(`Failed to set localStorage value for ${key}:`, error);
    }
  };

  // Sync across tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      const storageKey = `lumi_${key}`;
      if (e.key === storageKey && e.newValue) {
        try {
          setValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Failed to sync localStorage for ${key}:`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [value, setStoredValue];
}
