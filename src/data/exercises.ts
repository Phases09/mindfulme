import { WellnessExercise } from '@/types/wellness';

export const wellnessExercises: WellnessExercise[] = [
  {
    id: 'daily-mindfulness',
    title: 'Daily Mindfulness',
    duration: 10,
    description: '10 minutes guided, ease your mind',
    category: 'meditation',
    icon: 'brain',
  },
  {
    id: 'breathing-exercise',
    title: 'Breathing Exercise',
    duration: 5,
    description: 'Stress relief',
    category: 'breathing',
    icon: 'wind',
  },
  {
    id: 'nature-sounds',
    title: 'Nature Sounds',
    duration: 15,
    description: 'Relaxation',
    category: 'meditation',
    icon: 'leaf',
  },
  {
    id: 'sleep-stories',
    title: 'Sleep Stories',
    duration: 20,
    description: 'Better sleep',
    category: 'sleep',
    icon: 'moon',
  },
  {
    id: 'morning-motivation',
    title: 'Morning Motivation',
    duration: 8,
    description: 'Energy boost',
    category: 'motivation',
    icon: 'sun',
  },
];
