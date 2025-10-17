import { MoodEntry, Activity, UserStats, WeeklyGoal, Achievement } from '@/types/wellness';

const STORAGE_KEYS = {
  MOODS: 'wellness_moods',
  ACTIVITIES: 'wellness_activities',
  STATS: 'wellness_stats',
  GOALS: 'wellness_goals',
  ACHIEVEMENTS: 'wellness_achievements',
  USER_NAME: 'wellness_user_name',
  MEMBER_SINCE: 'wellness_member_since',
};

// Mood entries
export const saveMoodEntry = (entry: MoodEntry) => {
  const moods = getMoodEntries();
  moods.push(entry);
  localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(moods));
  updateStats();
};

export const getMoodEntries = (): MoodEntry[] => {
  const data = localStorage.getItem(STORAGE_KEYS.MOODS);
  if (!data) return [];
  return JSON.parse(data).map((entry: any) => ({
    ...entry,
    timestamp: new Date(entry.timestamp),
  }));
};

// Activities
export const saveActivity = (activity: Activity) => {
  const activities = getActivities();
  activities.push(activity);
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  updateStats();
  updateWeeklyGoals(activity);
};

export const getActivities = (): Activity[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
  if (!data) return [];
  return JSON.parse(data).map((activity: any) => ({
    ...activity,
    timestamp: new Date(activity.timestamp),
  }));
};

// Stats
export const updateStats = () => {
  const moods = getMoodEntries();
  const activities = getActivities();
  
  const totalSessions = activities.filter(a => a.completed).length;
  const avgMood = moods.length > 0 
    ? moods.reduce((sum, m) => sum + m.score, 0) / moods.length 
    : 0;
  
  const totalMeditationMinutes = activities
    .filter(a => a.type === 'meditation' && a.completed && a.duration)
    .reduce((sum, a) => sum + (a.duration || 0), 0);
  
  const dayStreak = calculateStreak(activities);
  
  const stats: UserStats = {
    totalSessions,
    dayStreak,
    avgMood: Math.round(avgMood * 10) / 10,
    totalMeditationMinutes,
  };
  
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
};

export const getStats = (): UserStats => {
  const data = localStorage.getItem(STORAGE_KEYS.STATS);
  if (!data) {
    return {
      totalSessions: 0,
      dayStreak: 0,
      avgMood: 0,
      totalMeditationMinutes: 0,
    };
  }
  return JSON.parse(data);
};

// Calculate streak
const calculateStreak = (activities: Activity[]): number => {
  if (activities.length === 0) return 0;
  
  const completedActivities = activities
    .filter(a => a.completed)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  if (completedActivities.length === 0) return 0;
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < completedActivities.length; i++) {
    const activityDate = new Date(completedActivities[i].timestamp);
    activityDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((currentDate.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === streak) {
      streak++;
    } else if (diffDays > streak) {
      break;
    }
  }
  
  return streak;
};

// Weekly goals
export const updateWeeklyGoals = (activity: Activity) => {
  const goals = getWeeklyGoals();
  
  if (activity.type === 'meditation' && activity.completed) {
    goals.meditationSessions++;
  } else if (activity.type === 'journal' && activity.completed) {
    goals.journalEntries++;
  }
  
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
};

export const getWeeklyGoals = (): WeeklyGoal => {
  const data = localStorage.getItem(STORAGE_KEYS.GOALS);
  if (!data) {
    return {
      meditationSessions: 0,
      meditationTarget: 7,
      journalEntries: 0,
      journalTarget: 5,
    };
  }
  return JSON.parse(data);
};

// Achievements
export const addAchievement = (achievement: Achievement) => {
  const achievements = getAchievements();
  if (!achievements.find(a => a.id === achievement.id)) {
    achievements.push(achievement);
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }
};

export const getAchievements = (): Achievement[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
  if (!data) return [];
  return JSON.parse(data).map((achievement: any) => ({
    ...achievement,
    earnedDate: new Date(achievement.earnedDate),
  }));
};

// User info
export const setUserName = (name: string) => {
  localStorage.setItem(STORAGE_KEYS.USER_NAME, name);
};

export const getUserName = (): string => {
  return localStorage.getItem(STORAGE_KEYS.USER_NAME) || 'User';
};

export const getMemberSince = (): string => {
  const data = localStorage.getItem(STORAGE_KEYS.MEMBER_SINCE);
  if (!data) {
    const now = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.MEMBER_SINCE, now);
    return now;
  }
  return data;
};
