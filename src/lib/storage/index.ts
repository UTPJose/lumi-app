// Storage types for full type safety
export interface StorageTypes {
  userName: string;
  userInterests: string[];
  routines: Array<{
    id: string;
    title: string;
    date: string;
    activities: Array<{
      id: string;
      time: string;
      title: string;
      description: string;
      completed: boolean;
    }>;
  }>;
  userAge: number;
  routineAnswers: Record<string, string>;
  voiceInput: string;
  userProfile: {
    name: string;
    age: number;
    interests: string[];
  };
}

// Centralized localStorage manager with type safety
class LocalStorageManager {
  private prefix = 'lumi_';

  private getKey(key: keyof StorageTypes): string {
    return this.prefix + key;
  }

  get<K extends keyof StorageTypes>(
    key: K,
    defaults: StorageTypes[K]
  ): StorageTypes[K] {
    try {
      const item = localStorage.getItem(this.getKey(key));
      return item ? JSON.parse(item) : defaults;
    } catch (error) {
      console.warn(`Failed to parse localStorage key ${key}:`, error);
      return defaults;
    }
  }

  set<K extends keyof StorageTypes>(
    key: K,
    value: StorageTypes[K]
  ): void {
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to set localStorage key ${key}:`, error);
    }
  }

  delete(key: keyof StorageTypes): void {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error(`Failed to delete localStorage key ${key}:`, error);
    }
  }

  clear(): void {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  getAllKeys(): (keyof StorageTypes)[] {
    return Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .map(key => key.replace(this.prefix, '') as keyof StorageTypes);
  }
}

export const storage = new LocalStorageManager();
