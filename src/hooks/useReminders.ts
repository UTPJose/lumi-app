import { useLocalStorage } from './useLocalStorage';
import { Reminder } from '@/types';

export function useReminders() {
  const [reminders, setReminders] = useLocalStorage('reminders', [] as Reminder[]);

  const addReminder = (reminder: Reminder): void => {
    setReminders([...reminders, reminder]);
  };

  const updateReminder = (id: string, updates: Partial<Omit<Reminder, 'id'>>): void => {
    setReminders(
      reminders.map(r => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const deleteReminder = (id: string): void => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const toggleReminder = (id: string): void => {
    setReminders(
      reminders.map(r => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const deleteMultiple = (ids: string[]): void => {
    setReminders(reminders.filter(r => !ids.includes(r.id)));
  };

  const toggleMultiple = (ids: string[]): void => {
    setReminders(
      reminders.map(r => (ids.includes(r.id) ? { ...r, completed: !r.completed } : r))
    );
  };

  return {
    reminders,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleReminder,
    deleteMultiple,
    toggleMultiple,
  };
}
