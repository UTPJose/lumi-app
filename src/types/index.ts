export interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface Routine {
  id: string;
  title: string;
  date: string;
  activities: Activity[];
}

export interface UserProfile {
  name: string;
  age: number;
  interests: string[];
}

export interface Reminder {
  id: string;
  title: string;
  time: string;
  completed: boolean;
}

export type RoutineAnswer = Record<string, string>;
