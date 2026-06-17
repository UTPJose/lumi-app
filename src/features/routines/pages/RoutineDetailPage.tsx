import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Heart, Share2, ArrowLeft, Plus, Trash2, Pencil, X, Check } from 'lucide-react';
import { ActivityCard } from '../components/ActivityCard';
import { CompletionModal } from '../components/CompletionModal';
import { AccessibleButton } from '../../../shared/components/buttons/AccessibleButton';
import { ConfirmDialog } from '../../../shared/components/ui/confirm-dialog';
import { PageLayout } from '../../../shared/components/layouts/PageLayout';
import { useRoutines } from '@/hooks/useRoutines';
import { CARD_STYLES, INPUT_STYLES } from '@/styles/tailwind-constants';
import { Activity } from '@/types';

const TIME_OPTIONS = [
  '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM',
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM',
  '9:00 PM', '9:30 PM', '10:00 PM',
];

export function RoutineDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    getRoutineById,
    toggleActivityCompleted,
    getCompletedActivitiesCount,
    toggleRoutineSaved,
    updateActivity,
    deleteActivityFromRoutine,
    deleteMultipleActivities,
    addActivityToRoutine,
  } = useRoutines();

  const routine = id ? getRoutineById(id) : null;

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTime, setEditTime] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newTime, setNewTime] = useState('8:00 AM');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'single' | 'multiple'; id?: string; name?: string } | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const prevProgressRef = useRef(0);

  if (!routine) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <h2 className="mb-4">Rutina no encontrada</h2>
          <AccessibleButton onClick={() => navigate('/library')} variant="primary">
            Volver a mis rutinas
          </AccessibleButton>
        </div>
      </PageLayout>
    );
  }

  const completedCount = getCompletedActivitiesCount(id!);
  const progress = routine.activities.length > 0
    ? (completedCount / routine.activities.length) * 100
    : 0;

  useEffect(() => {
    if (progress === 100 && prevProgressRef.current < 100 && routine.activities.length > 0) {
      setShowCompletionModal(true);
    }
    prevProgressRef.current = progress;
  }, [progress, routine.activities.length]);

  const handleToggleSelect = (actId: string) => {
    setSelectedIds(prev =>
      prev.includes(actId) ? prev.filter(i => i !== actId) : [...prev, actId]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === routine.activities.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(routine.activities.map(a => a.id));
    }
  };

  const handleDeleteSelected = () => {
    setDeleteTarget({ type: 'multiple' });
    setDeleteDialogOpen(true);
  };

  const handleDeleteSingle = (activityId: string, activityTitle: string) => {
    setDeleteTarget({ type: 'single', id: activityId, name: activityTitle });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'single' && deleteTarget.id) {
      deleteActivityFromRoutine(id!, deleteTarget.id);
    } else if (deleteTarget.type === 'multiple') {
      deleteMultipleActivities(id!, selectedIds);
      setSelectedIds([]);
      setIsSelectMode(false);
    }
    setDeleteTarget(null);
  };

  const handleStartEdit = (activity: Activity) => {
    setEditingId(activity.id);
    setEditTime(activity.time);
    setEditTitle(activity.title);
    setEditDescription(activity.description);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editTitle.trim()) return;
    updateActivity(id!, {
      id: editingId,
      time: editTime,
      title: editTitle.trim(),
      description: editDescription.trim(),
      completed: routine.activities.find(a => a.id === editingId)?.completed ?? false,
    });
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleAddActivity = () => {
    if (!newTitle.trim()) return;
    const newActivity: Activity = {
      id: Date.now().toString(),
      time: newTime,
      title: newTitle.trim(),
      description: newDescription.trim(),
      completed: false,
    };
    addActivityToRoutine(id!, newActivity);
    setNewTitle('');
    setNewDescription('');
    setNewTime('8:00 AM');
    setIsAdding(false);
  };

  return (
    <PageLayout>
      <div>
        <button
          onClick={() => navigate('/library')}
          className="flex items-center gap-2 text-primary mb-4 -ml-2 p-2 hover:bg-primary/10 rounded-xl transition-colors"
          aria-label="Volver a mis rutinas"
        >
          <ArrowLeft className="w-6 h-6" aria-hidden="true" />
          <span>Volver</span>
        </button>

        <h1 className="mb-2">{routine.title}</h1>
        <p className="text-muted-foreground">{routine.date}</p>
      </div>

      <div className={`${CARD_STYLES.white} p-6`}>
        <div className="flex items-center justify-between mb-3">
          <h4>Progreso del día</h4>
          <span className="text-primary">
            {completedCount} / {routine.activities.length}
          </span>
        </div>
        <div className="h-4 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progreso de actividades completadas"
          />
        </div>
      </div>

      {/* Batch actions bar */}
      {isSelectMode && selectedIds.length > 0 && (
        <div className="bg-primary/10 border-2 border-primary/30 p-4 rounded-2xl flex items-center justify-between">
          <span className="text-sm font-medium">
            {selectedIds.length} seleccionada{selectedIds.length > 1 ? 's' : ''}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleDeleteSelected}
              className="p-2 bg-destructive/20 hover:bg-destructive/30 rounded-xl transition-colors"
              aria-label="Eliminar seleccionadas"
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

      {/* Add activity form */}
      {isAdding && (
        <div className={`${CARD_STYLES.white} p-6 rounded-2xl border-2 space-y-4`}>
          <div className="flex items-center justify-between">
            <h4>Nueva actividad</h4>
            <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-muted rounded-xl" aria-label="Cancelar">
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
              {TIME_OPTIONS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Título</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ej: Estiramientos matutinos"
              className={INPUT_STYLES}
              maxLength={100}
              aria-label="Título de la actividad"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Descripción</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Ej: 10 minutos de estiramientos suaves"
              className={INPUT_STYLES}
              maxLength={200}
              aria-label="Descripción de la actividad"
            />
          </div>

          <AccessibleButton onClick={handleAddActivity} variant="primary" fullWidth disabled={!newTitle.trim()}>
            Agregar actividad
          </AccessibleButton>
        </div>
      )}

      {/* Activities list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3>Actividades</h3>
          {routine.activities.length > 0 && !isSelectMode && (
            <button
              onClick={() => setIsSelectMode(true)}
              className="text-sm text-primary hover:underline"
            >
              Seleccionar
            </button>
          )}
        </div>

        {routine.activities.length === 0 && !isAdding ? (
          <div className="bg-secondary p-6 rounded-2xl text-center">
            <p className="text-muted-foreground">No hay actividades. Agrega una para comenzar.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {routine.activities.map((activity) => (
              editingId === activity.id ? (
                /* Edit mode */
                <div key={activity.id} className={`${CARD_STYLES.white} p-6 rounded-2xl border-2 border-primary space-y-4`}>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Editando actividad</h4>
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
                    >
                      {TIME_OPTIONS.map(t => (
                        <option key={t} value={t}>{t}</option>
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
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Descripción</label>
                    <input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className={INPUT_STYLES}
                      maxLength={200}
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
                <ActivityCard
                  key={activity.id}
                  time={activity.time}
                  title={activity.title}
                  description={activity.description}
                  completed={activity.completed}
                  onToggleComplete={() => toggleActivityCompleted(id!, activity.id)}
                  isSelectMode={isSelectMode}
                  isSelected={selectedIds.includes(activity.id)}
                  onToggleSelect={() => handleToggleSelect(activity.id)}
                  onEdit={() => handleStartEdit(activity)}
                  onDelete={() => handleDeleteSingle(activity.id, activity.title)}
                />
              )
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        {!isAdding && !isSelectMode && (
          <AccessibleButton onClick={() => setIsAdding(true)} variant="primary" icon={Plus} fullWidth>
            Agregar actividad
          </AccessibleButton>
        )}

        {routine.activities.length > 0 && !isSelectMode && !isAdding && (
          <AccessibleButton
            onClick={() => setIsSelectMode(true)}
            variant="outline"
            fullWidth
          >
            Seleccionar varias
          </AccessibleButton>
        )}

        <div className="grid grid-cols-2 gap-4">
          <AccessibleButton onClick={() => navigate('/share')} variant="outline" icon={Share2}>
            Compartir
          </AccessibleButton>
          <button
            onClick={() => toggleRoutineSaved(id!)}
            className={`w-full min-h-[60px] px-6 py-4 rounded-2xl border-2 transition-all active:scale-98 font-semibold flex items-center justify-center gap-2 ${
              routine.saved
                ? 'bg-accent text-accent-foreground border-accent hover:bg-accent/90'
                : 'bg-white text-muted-foreground border-border hover:border-accent/50'
            }`}
            aria-label={routine.saved ? 'Desguardar rutina' : 'Guardar rutina como favorita'}
            aria-pressed={routine.saved}
          >
            <Heart
              className={`w-5 h-5 ${routine.saved ? 'fill-current' : ''}`}
              aria-hidden="true"
            />
            <span>{routine.saved ? 'Guardada' : 'Guardar'}</span>
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => { setDeleteDialogOpen(false); setDeleteTarget(null); }}
        onConfirm={handleConfirmDelete}
        title={deleteTarget?.type === 'single' ? 'Eliminar actividad' : 'Eliminar actividades'}
        message={deleteTarget?.type === 'single' 
          ? `¿Estás seguro de que quieres eliminar "${deleteTarget.name}"?`
          : `¿Estás seguro de que quieres eliminar ${selectedIds.length} actividad${selectedIds.length > 1 ? 'es' : ''}?`
        }
      />

      <CompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        onGoToRoutines={() => {
          setShowCompletionModal(false);
          navigate('/library');
        }}
        routineTitle={routine.title}
      />
    </PageLayout>
  );
}
