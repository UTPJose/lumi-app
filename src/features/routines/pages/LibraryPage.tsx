import React, { useState, useMemo } from 'react';
import { RoutineCard } from '../components/RoutineCard';
import { PageLayout } from '../../../shared/components/layouts/PageLayout';
import { Plus, Search, ArrowUpDown, X, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { AccessibleButton } from '../../../shared/components/buttons/AccessibleButton';
import { useRoutines } from '@/hooks/useRoutines';
import { INPUT_STYLES } from '@/styles/tailwind-constants';
import { Routine } from '@/types';

type TabFilter = 'all' | 'saved' | 'completed';
type SortOption = 'newest' | 'oldest' | 'name' | 'progress';

const TABS: { value: TabFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'saved', label: 'Favoritas' },
  { value: 'completed', label: 'Completadas' },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'oldest', label: 'Más antiguas' },
  { value: 'name', label: 'Nombre' },
  { value: 'progress', label: 'Progreso' },
];

function getProgress(routine: Routine): number {
  if (routine.activities.length === 0) return 0;
  const completed = routine.activities.filter(a => a.completed).length;
  return (completed / routine.activities.length) * 100;
}

function getCompletedCount(routine: Routine): number {
  return routine.activities.filter(a => a.completed).length;
}

export function LibraryPage() {
  const navigate = useNavigate();
  const { routines, deleteRoutine, deleteMultipleRoutines } = useRoutines();

  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredRoutines = useMemo(() => {
    let result = [...routines];

    // Filter by tab
    if (activeTab === 'saved') {
      result = result.filter(r => r.saved);
    } else if (activeTab === 'completed') {
      result = result.filter(r => getProgress(r) === 100 && r.activities.length > 0);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(r =>
        r.title.toLowerCase().includes(query) ||
        r.date.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return Number(b.id) - Number(a.id);
        case 'oldest':
          return Number(a.id) - Number(b.id);
        case 'name':
          return a.title.localeCompare(b.title, 'es');
        case 'progress':
          return getProgress(b) - getProgress(a);
        default:
          return 0;
      }
    });

    return result;
  }, [routines, activeTab, sortBy, searchQuery]);

  const counts = useMemo(() => ({
    all: routines.length,
    saved: routines.filter(r => r.saved).length,
    completed: routines.filter(r => getProgress(r) === 100 && r.activities.length > 0).length,
  }), [routines]);

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredRoutines.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRoutines.map(r => r.id));
    }
  };

  const handleDeleteSelected = () => {
    deleteMultipleRoutines(selectedIds);
    setSelectedIds([]);
    setIsSelectMode(false);
  };

  const handleDeleteSingle = (id: string) => {
    deleteRoutine(id);
  };

  return (
    <PageLayout>
      <div>
        <h1 className="mb-2">Mis rutinas</h1>
        <p className="text-muted-foreground">Todas tus rutinas guardadas en un solo lugar.</p>
      </div>

      {routines.length === 0 ? (
        <div className="text-center py-12 space-y-6">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Plus className="w-12 h-12 text-muted-foreground" aria-hidden="true" />
          </div>
          <div>
            <h3 className="mb-2">No hay rutinas guardadas</h3>
            <p className="text-muted-foreground">Crea tu primera rutina para comenzar.</p>
          </div>
          <AccessibleButton
            onClick={() => navigate('/create')}
            variant="primary"
            icon={Plus}
          >
            Crear rutina
          </AccessibleButton>
        </div>
      ) : (
        <>
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre o fecha..."
              className={`${INPUT_STYLES} pl-12 pr-10`}
              aria-label="Buscar rutinas"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-lg"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Batch actions bar */}
          {isSelectMode && selectedIds.length > 0 && (
            <div className="bg-primary/10 border-2 border-primary/30 p-4 rounded-2xl flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedIds.length} seleccionada{selectedIds.length > 1 ? 's' : ''}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  className="p-2 bg-muted hover:bg-muted/80 rounded-xl transition-colors text-sm"
                  aria-label={selectedIds.length === filteredRoutines.length ? 'Deseleccionar todas' : 'Seleccionar todas'}
                >
                  {selectedIds.length === filteredRoutines.length ? 'Deseleccionar' : 'Seleccionar todas'}
                </button>
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

          {/* Tabs */}
          <div className="flex gap-2" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
                role="tab"
                aria-selected={activeTab === tab.value}
                aria-label={`${tab.label} (${counts[tab.value]})`}
              >
                {tab.label}
                <span className="ml-1 opacity-70">({counts[tab.value]})</span>
              </button>
            ))}
          </div>

          {/* Sort controls */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {filteredRoutines.length} rutina{filteredRoutines.length !== 1 ? 's' : ''}
              {searchQuery && ` para "${searchQuery}"`}
            </span>

            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
                aria-label="Ordenar rutinas"
                aria-expanded={showSortMenu}
              >
                <ArrowUpDown className="w-4 h-4" />
                {SORT_OPTIONS.find(s => s.value === sortBy)?.label}
              </button>

              {showSortMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowSortMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 bg-white border-2 border-border rounded-xl shadow-lg z-20 py-2 min-w-[180px]">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => { setSortBy(option.value); setShowSortMenu(false); }}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors ${
                          sortBy === option.value ? 'text-primary font-medium' : 'text-foreground'
                        }`}
                        aria-label={`Ordenar por ${option.label}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Routines list */}
          {filteredRoutines.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
              </div>
              <div>
                <h3 className="mb-2">No se encontraron rutinas</h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? `No hay resultados para "${searchQuery}"`
                    : 'No hay rutinas en esta categoría.'
                  }
                </p>
              </div>
              {(searchQuery || activeTab !== 'all') && (
                <AccessibleButton
                  onClick={() => { setSearchQuery(''); setActiveTab('all'); }}
                  variant="outline"
                >
                  Limpiar filtros
                </AccessibleButton>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRoutines.map((routine) => (
                <RoutineCard
                  key={routine.id}
                  id={routine.id}
                  title={routine.title}
                  date={routine.date}
                  activities={routine.activities.length}
                  completedActivities={getCompletedCount(routine)}
                  saved={routine.saved}
                  isSelectMode={isSelectMode}
                  isSelected={selectedIds.includes(routine.id)}
                  onToggleSelect={() => handleToggleSelect(routine.id)}
                  onDelete={() => handleDeleteSingle(routine.id)}
                />
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-3">
            {!isSelectMode && routines.length > 0 && (
              <AccessibleButton
                onClick={() => setIsSelectMode(true)}
                variant="outline"
                fullWidth
              >
                Seleccionar varias
              </AccessibleButton>
            )}

            <AccessibleButton
              onClick={() => navigate('/create')}
              variant="primary"
              icon={Plus}
              fullWidth
            >
              Crear nueva rutina
            </AccessibleButton>
          </div>
        </>
      )}
    </PageLayout>
  );
}
