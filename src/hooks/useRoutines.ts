import { useLocalStorage } from './useLocalStorage';
import { Routine, Activity } from '@/types';

export function useRoutines() {
  const [routines, setRoutines] = useLocalStorage('routines', [] as Routine[]);

  const addRoutine = (routine: Routine): void => {
    setRoutines([...routines, routine]);
  };

  const updateRoutine = (id: string, routine: Routine): void => {
    setRoutines(
      routines.map(r => (r.id === id ? routine : r))
    );
  };

  const deleteRoutine = (id: string): void => {
    setRoutines(routines.filter(r => r.id !== id));
  };

  const getRoutineById = (id: string): Routine | undefined => {
    return routines.find(r => r.id === id);
  };

  const toggleActivityCompleted = (routineId: string, activityId: string): void => {
    const routine = getRoutineById(routineId);
    if (!routine) return;

    const updatedRoutine: Routine = {
      ...routine,
      activities: routine.activities.map(activity =>
        activity.id === activityId
          ? { ...activity, completed: !activity.completed }
          : activity
      ),
    };

    updateRoutine(routineId, updatedRoutine);
  };

  const updateActivity = (routineId: string, activity: Activity): void => {
    const routine = getRoutineById(routineId);
    if (!routine) return;

    const updatedRoutine: Routine = {
      ...routine,
      activities: routine.activities.map(a =>
        a.id === activity.id ? activity : a
      ),
    };

    updateRoutine(routineId, updatedRoutine);
  };

  const addActivityToRoutine = (routineId: string, activity: Activity): void => {
    const routine = getRoutineById(routineId);
    if (!routine) return;

    const updatedRoutine: Routine = {
      ...routine,
      activities: [...routine.activities, activity],
    };

    updateRoutine(routineId, updatedRoutine);
  };

  const deleteActivityFromRoutine = (routineId: string, activityId: string): void => {
    const routine = getRoutineById(routineId);
    if (!routine) return;

    const updatedRoutine: Routine = {
      ...routine,
      activities: routine.activities.filter(a => a.id !== activityId),
    };

    updateRoutine(routineId, updatedRoutine);
  };

  const getCompletedActivitiesCount = (routineId: string): number => {
    const routine = getRoutineById(routineId);
    if (!routine) return 0;
    return routine.activities.filter(a => a.completed).length;
  };

  const getTotalActivitiesCount = (routineId: string): number => {
    const routine = getRoutineById(routineId);
    if (!routine) return 0;
    return routine.activities.length;
  };

  const toggleRoutineSaved = (routineId: string): void => {
    const routine = getRoutineById(routineId);
    if (!routine) return;

    const updatedRoutine: Routine = {
      ...routine,
      saved: !routine.saved,
    };

    updateRoutine(routineId, updatedRoutine);
  };

  const getSavedRoutines = (): Routine[] => {
    return routines.filter(r => r.saved);
  };

  return {
    routines,
    setRoutines,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    getRoutineById,
    toggleActivityCompleted,
    updateActivity,
    addActivityToRoutine,
    deleteActivityFromRoutine,
    getCompletedActivitiesCount,
    getTotalActivitiesCount,
    toggleRoutineSaved,
    getSavedRoutines,
  };
}
