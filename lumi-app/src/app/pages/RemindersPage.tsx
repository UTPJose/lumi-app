import React, { useState } from 'react';
import { Bell, Plus, Trash2 } from 'lucide-react';
import { AccessibleButton } from '../components/AccessibleButton';
import { BottomNavigation } from '../components/BottomNavigation';

interface Reminder {
  id: string;
  time: string;
  title: string;
  enabled: boolean;
}

const DEFAULT_REMINDERS: Reminder[] = [
  { id: '1', time: '8:00 AM', title: 'Hora de comenzar tu rutina', enabled: true },
  { id: '2', time: '12:00 PM', title: 'Tiempo de almuerzo', enabled: true },
  { id: '3', time: '6:00 PM', title: 'Revisa tu progreso del día', enabled: false },
];

export function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>(DEFAULT_REMINDERS);
  
  const toggleReminder = (id: string) => {
    setReminders(prev => 
      prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r)
    );
  };
  
  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };
  
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="mb-2">Recordatorios</h1>
          <p className="text-muted-foreground">
            Configura recordatorios para no olvidar tus actividades.
          </p>
        </div>
        
        <div className="bg-secondary p-6 rounded-2xl">
          <h4 className="mb-2">💡 Consejo</h4>
          <p className="text-sm text-muted-foreground">
            Los recordatorios te ayudarán a mantener tu rutina. Actívalos para recibir notificaciones amigables.
          </p>
        </div>
        
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="bg-white p-6 rounded-2xl border-2 border-border"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Bell 
                      className={`w-7 h-7 ${reminder.enabled ? 'text-primary' : 'text-muted-foreground'}`}
                      aria-hidden="true"
                    />
                    <h4 className={reminder.enabled ? '' : 'text-muted-foreground'}>
                      {reminder.time}
                    </h4>
                  </div>
                  <p className={reminder.enabled ? 'text-foreground' : 'text-muted-foreground'}>
                    {reminder.title}
                  </p>
                </div>
                
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => toggleReminder(reminder.id)}
                    className={`
                      w-16 h-9 rounded-full transition-all relative
                      ${reminder.enabled ? 'bg-primary' : 'bg-muted'}
                    `}
                    role="switch"
                    aria-checked={reminder.enabled}
                    aria-label={`${reminder.enabled ? 'Desactivar' : 'Activar'} recordatorio de ${reminder.time}`}
                  >
                    <div
                      className={`
                        w-7 h-7 bg-white rounded-full absolute top-1 transition-all
                        ${reminder.enabled ? 'right-1' : 'left-1'}
                      `}
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
        
        <AccessibleButton
          onClick={() => {}}
          variant="outline"
          icon={Plus}
          fullWidth
        >
          Agregar recordatorio
        </AccessibleButton>
      </div>
      
      <BottomNavigation />
    </div>
  );
}
