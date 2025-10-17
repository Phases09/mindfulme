export type MoodType = 'great' | 'good' | 'okay' | 'low';

export interface MoodEntry {
  id: string;
  mood: MoodType;
  score: number;
  timestamp: Date;
}

export interface Activity {
  id: string;
  type: 'meditation' | 'journal' | 'breathing' | 'sleep' | 'motivation';
  title: string;
  duration?: number;
  timestamp: Date;
  completed: boolean;
}

export interface WellnessExercise {
  id: string;
  title: string;
  duration: number;
  description: string;
  category: 'meditation' | 'breathing' | 'sleep' | 'motivation';
  icon: string;
}

export interface UserStats {
  totalSessions: number;
  dayStreak: number;
  avgMood: number;
  totalMeditationMinutes: number;
}

export interface WeeklyGoal {
  meditationSessions: number;
  meditationTarget: number;
  journalEntries: number;
  journalTarget: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: Date;
  color: string;
}
