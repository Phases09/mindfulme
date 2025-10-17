import { Smile, ThumbsUp, Meh, Frown } from 'lucide-react';
import { MoodType } from '@/types/wellness';

interface MoodSelectorProps {
  onMoodSelect: (mood: MoodType, score: number) => void;
}

const MoodSelector = ({ onMoodSelect }: MoodSelectorProps) => {
  const moods = [
    { type: 'great' as MoodType, icon: Smile, label: 'Great', color: 'bg-primary', score: 10 },
    { type: 'good' as MoodType, icon: ThumbsUp, label: 'Good', color: 'bg-journal', score: 7.5 },
    { type: 'okay' as MoodType, icon: Meh, label: 'Okay', color: 'bg-warning', score: 5 },
    { type: 'low' as MoodType, icon: Frown, label: 'Low', color: 'bg-destructive', score: 2.5 },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {moods.map(({ type, icon: Icon, label, color, score }) => (
        <button
          key={type}
          onClick={() => onMoodSelect(type, score)}
          className={`${color} rounded-2xl p-4 flex flex-col items-center gap-2 transition-transform hover:scale-105 active:scale-95`}
        >
          <Icon className="w-6 h-6 text-white" />
          <span className="text-xs font-medium text-white">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;
