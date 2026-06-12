import React, { useState } from 'react';
import { Bell, Plus, Trash2, Pencil, X, Check } from 'lucide-react';
import { AccessibleButton } from '../../../shared/components/buttons/AccessibleButton';
import { ConfirmDialog } from '../../../shared/components/ui/confirm-dialog';
import { PageLayout } from '../../../shared/components/layouts/PageLayout';
import { CARD_STYLES, INPUT_STYLES } from '@/styles/tailwind-constants';
import { useReminders } from '@/hooks/useReminders';
import { Reminder } from '@/types';

const TIME_OPTIONS = [
  '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM',
];

export function RemindersPage() {
  const { reminders, addReminder, updateReminder, deleteReminder, toggleReminder, deleteMultiple, toggleMultiple } = useReminders();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'single' | 'multiple'; id?: string; name?: string } | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('8:00 AM');
  const [editTitle, setEditTitle] = useState('');
  const [editTime, setEditTime] = useState('');

  const resetForm = () => {
    setNewTitle('');
    setNewTime('8:00 AM');
    setIsAdding(false);
  };

  const handleAdd = () => {
    if (!newTitle.trim()) return;

    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      time: newTime,
      completed: false,
    };

    addReminder(reminder);
    resetForm();
  };

  const handleStartEdit = (reminder: Reminder) => {
    setEditingId(reminder.id);
    setEditTitle(reminder.title);
    setEditTime(reminder.time);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editTitle.trim()) return;

    updateReminder(editingId, { title: editTitle.trim(), time: editTime });
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === reminders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(reminders.map(r => r.id));
    }
  };

  const handleDeleteSelected = () => {
    setDeleteTarget({ type: 'multiple' });
    setDeleteDialogOpen(true);
  };

  const handleDeleteSingle = (id: string, name: string) => {
    setDeleteTarget({ type: 'single', id, name });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'single' && deleteTarget.id) {
      deleteReminder(deleteTarget.id);
    } else if (deleteTarget.type === 'multiple') {
      deleteMultiple(selectedIds);
      setSelectedIds([]);
      setIsSelectMode(false);
    }
    setDeleteTarget(null);
  };

  const handleToggleSelected = () => {
    toggleMultiple(selectedIds);
    setSelectedIds([]);
    setIsSelectMode(false);
  };

  const sortedReminders = [...reminders].sort((a, b) => {
    const timeA = convertTo24Hour(a.time);
    const timeB = convertTo24Hour(b.time);
    return timeA.localeCompare(timeB);
  });

  return (
    <PageLayout>
      <div>
        <h1 className="mb-2">Recordatorios</h1>
        <p className="text-muted-foreground">Configura recordatorios para no olvidar tus actividades.</p>
      </div>

      {reminders.length === 0 && !isAdding && (
        <div className="bg-secondary p-6 rounded-2xl text-center">
          <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" aria-hidden="true" />
          <p className="text-muted-foreground">No tienes recordatorios. Agrega uno para comenzar.</p>
        </div>
      )}

      {/* Batch actions bar */}
      {isSelectMode && selectedIds.length > 0 && (
        <div className="bg-primary/10 border-2 border-primary/30 p-4 rounded-2xl flex items-center justify-between">
          <span className="text-sm font-medium">
            {selectedIds.length} seleccionado{selectedIds.length > 1 ? 's' : ''}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleToggleSelected}
              className="p-2 bg-primary/20 hover:bg-primary/30 rounded-xl transition-colors"
              aria-label="Activar/desactivar seleccionados"
            >
              <Bell className="w-5 h-5 text-primary" />
            </button>
            <button
              onClick={handleDeleteSelected}
              className="p-2 bg-destructive/20 hover:bg-destructive/30 rounded-xl transition-colors"
              aria-label="Eliminar seleccionados"
            >
              <Trash2 className="w-5 h-5 text-destructive" />
            </button>
            <button
              onClick={() => { setIsSelectMode(false); setSelectedIds([]); }}
              className="p-2 bg-muted hover:bg-muted/80 rounded-xl transition-colors"
              aria-label="Cancelar selección"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Add form */}
      {isAdding && (
        <div className={`${CARD_STYLES.white} p-6 rounded-2xl border-2 space-y-4`}>
          <div className="flex items-center justify-between">
            <h4>Nuevo recordatorio</h4>
            <button onClick={resetForm} className="p-2 hover:bg-muted rounded-xl" aria-label="Cancelar">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Hora</label>
            <select
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className={INPUT_STYLES}
              aria-label="Seleccionar hora"
            >
              {TIME_OPTIONS.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Título</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ej: Hora de meditar"
              className={INPUT_STYLES}
              maxLength={100}
              aria-label="Título del recordatorio"
            />
          </div>

          <AccessibleButton onClick={handleAdd} variant="primary" fullWidth disabled={!newTitle.trim()}>
            Guardar recordatorio
          </AccessibleButton>
        </div>
      )}

      {/* Reminders list */}
      <div className="space-y-4">
        {sortedReminders.map((reminder) => (
          <div
            key={reminder.id}
            className={`${CARD_STYLES.white} p-6 rounded-2xl border-2 ${
              isSelectMode && selectedIds.includes(reminder.id) ? 'border-primary bg-primary/5' : ''
            }`}
          >
            {editingId === reminder.id ? (
              /* Edit mode */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4>Editar recordatorio</h4>
                  <button onClick={handleCancelEdit} className="p-2 hover:bg-muted rounded-xl" aria-label="Cancelar edición">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Hora</label>
                  <select
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className={INPUT_STYLES}
                    aria-label="Seleccionar hora"
                  >
                    {TIME_OPTIONS.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Título</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className={INPUT_STYLES}
                    maxLength={100}
                    aria-label="Título del recordatorio"
                  />
                </div>

                <div className="flex gap-3">
                  <AccessibleButton onClick={handleSaveEdit} variant="primary" fullWidth disabled={!editTitle.trim()}>
                    Guardar
                  </AccessibleButton>
                  <AccessibleButton onClick={handleCancelEdit} variant="outline" fullWidth>
                    Cancelar
                  </AccessibleButton>
                </div>
              </div>
            ) : (
              /* View mode */
              <div className="flex items-start gap-4">
                {isSelectMode && (
                  <button
                    onClick={() => handleToggleSelect(reminder.id)}
                    className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-all ${
                      selectedIds.includes(reminder.id)
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-border hover:border-primary/50'
                    }`}
                    aria-label={`Seleccionar recordatorio de ${reminder.time}`}
                    aria-pressed={selectedIds.includes(reminder.id)}
                  >
                    {selectedIds.includes(reminder.id) && <Check className="w-4 h-4" />}
                  </button>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Bell
                      className={`w-6 h-6 flex-shrink-0 ${
                        reminder.completed ? 'text-primary' : 'text-muted-foreground'
                      }`}
                      aria-hidden="true"
                    />
                    <h4 className={reminder.completed ? '' : 'text-muted-foreground'}>
                      {reminder.time}
                    </h4>
                  </div>
                  <p className={reminder.completed ? 'text-foreground truncate' : 'text-muted-foreground truncate'}>
                    {reminder.title}
                  </p>
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleReminder(reminder.id)}
                    className={`w-14 h-8 rounded-full transition-all relative ${
                      reminder.completed ? 'bg-primary' : 'bg-muted'
                    }`}
                    role="switch"
                    aria-checked={reminder.completed}
                    aria-label={`${reminder.completed ? 'Desactivar' : 'Activar'} recordatorio de ${reminder.time}`}
                  >
                    <div
                      className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${
                        reminder.completed ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>

                  <div className="flex gap-1">
                    <button
                      onClick={() => handleStartEdit(reminder)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
                      aria-label={`Editar recordatorio de ${reminder.time}`}
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSingle(reminder.id, reminder.title)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                      aria-label={`Eliminar recordatorio de ${reminder.time}`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        {!isAdding && (
          <AccessibleButton onClick={() => setIsAdding(true)} variant="primary" icon={Plus} fullWidth>
            Agregar recordatorio
          </AccessibleButton>
        )}

        {reminders.length > 0 && !isSelectMode && (
          <AccessibleButton
            onClick={() => setIsSelectMode(true)}
            variant="outline"
            fullWidth
          >
            Seleccionar varios
          </AccessibleButton>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => { setDeleteDialogOpen(false); setDeleteTarget(null); }}
        onConfirm={handleConfirmDelete}
        title={deleteTarget?.type === 'single' ? 'Eliminar recordatorio' : 'Eliminar recordatorios'}
        message={deleteTarget?.type === 'single' 
          ? `¿Estás seguro de que quieres eliminar "${deleteTarget.name}"?`
          : `¿Estás seguro de que quieres eliminar ${selectedIds.length} recordatorio${selectedIds.length > 1 ? 's' : ''}?`
        }
      />
    </PageLayout>
  );
}

function convertTo24Hour(time12h: string): string {
  const [time, period] = time12h.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
