import React, { useState } from 'react';
import { Bell, Plus, Trash2 } from 'lucide-react';
import { AccessibleButton } from '../../../shared/components/buttons/AccessibleButton';
import { PageLayout } from '../../../shared/components/layouts/PageLayout';
import { CARD_STYLES } from '@/styles/tailwind-constants';
import { Reminder } from '@/types';

const DEFAULT_REMINDERS: Reminder[] = [
  { id: '1', time: '8:00 AM', title: 'Hora de comenzar tu rutina', completed: true },
  { id: '2', time: '12:00 PM', title: 'Tiempo de almuerzo', completed: true },
  { id: '3', time: '6:00 PM', title: 'Revisa tu progreso del día', completed: false },
];

export function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>(DEFAULT_REMINDERS);

  const toggleReminder = (id: string) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r)));
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <PageLayout>
      <div>
        <h1 className="mb-2">Recordatorios</h1>
        <p className="text-muted-foreground">Configura recordatorios para no olvidar tus actividades.</p>
      </div>

      <div className="bg-secondary p-6 rounded-2xl">
        <h4 className="mb-2">💡 Consejo</h4>
        <p className="text-sm text-muted-foreground">
          Los recordatorios te ayudarán a mantener tu rutina. Actívalos para recibir notificaciones amigables.
        </p>
      </div>

      <div className="space-y-4">
        {reminders.map((reminder) => (
          <div key={reminder.id} className={`${CARD_STYLES.white} p-6 rounded-2xl border-2`}>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Bell
                    className={`w-7 h-7 ${
                      reminder.completed ? 'text-primary' : 'text-muted-foreground'
                    }`}
                    aria-hidden="true"
                  />
                  <h4 className={reminder.completed ? '' : 'text-muted-foreground'}>
                    {reminder.time}
                  </h4>
                </div>
                <p className={reminder.completed ? 'text-foreground' : 'text-muted-foreground'}>
                  {reminder.title}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => toggleReminder(reminder.id)}
                  className={`w-16 h-9 rounded-full transition-all relative ${
                    reminder.completed ? 'bg-primary' : 'bg-muted'
                  }`}
                  role="switch"
                  aria-checked={reminder.completed}
                  aria-label={`${reminder.completed ? 'Desactivar' : 'Activar'} recordatorio de ${reminder.time}`}
                >
                  <div
                    className={`w-7 h-7 bg-white rounded-full absolute top-1 transition-all ${
                      reminder.completed ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>

                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                  aria-label={`Eliminar recordatorio de ${reminder.time}`}
                >
                  <Trash2 className="w-6 h-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AccessibleButton onClick={() => {}} variant="outline" icon={Plus} fullWidth>
        Agregar recordatorio
      </AccessibleButton>
    </PageLayout>
  );
}
