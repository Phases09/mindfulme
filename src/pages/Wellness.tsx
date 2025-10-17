import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Play, Brain, Wind, Moon, Sun, Leaf } from 'lucide-react';
import { wellnessExercises } from '@/data/exercises';
import { saveActivity } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';

type CategoryFilter = 'all' | 'meditation' | 'breathing' | 'sleep';

const Wellness = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'meditation', label: 'Meditation' },
    { id: 'breathing', label: 'Breathing' },
    { id: 'sleep', label: 'Sleep' },
  ];

  const filteredExercises = wellnessExercises.filter(exercise => {
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    const matchesSearch = exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredExercise = wellnessExercises[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'brain': return Brain;
      case 'wind': return Wind;
      case 'moon': return Moon;
      case 'sun': return Sun;
      case 'leaf': return Leaf;
      default: return Brain;
    }
  };

  const handleStartExercise = (exerciseId: string, title: string, duration: number, category: string) => {
    const activityType = category === 'breathing' ? 'breathing' : 
                        category === 'sleep' ? 'sleep' :
                        category === 'motivation' ? 'motivation' : 'meditation';
    
    saveActivity({
      id: Date.now().toString(),
      type: activityType,
      title,
      duration,
      timestamp: new Date(),
      completed: true,
    });
    
    toast({
      title: 'Exercise started!',
      description: `Enjoy your ${duration} minute session`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Wellness</h1>
            <p className="text-sm text-muted-foreground">Activities for your mind</p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="w-5 h-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-2xl"
          />
        </div>

        {/* Featured Exercise */}
        <Card className="bg-gradient-to-br from-wellness to-success p-6 text-primary-foreground overflow-hidden relative">
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{featuredExercise.title}</h3>
                <p className="text-sm opacity-90 mb-1">{featuredExercise.description}</p>
              </div>
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full"
                onClick={() => handleStartExercise(
                  featuredExercise.id,
                  featuredExercise.title,
                  featuredExercise.duration,
                  featuredExercise.category
                )}
              >
                <Play className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm opacity-90">{featuredExercise.duration} min</span>
              </div>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full" />
        </Card>

        {/* Categories */}
        <div>
          <h2 className="text-sm font-semibold mb-3">Categories</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(({ id, label }) => (
              <Button
                key={id}
                variant={selectedCategory === id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(id as CategoryFilter)}
                className="rounded-full whitespace-nowrap"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Exercise List */}
        <div className="space-y-3">
          {filteredExercises.map((exercise) => {
            const Icon = getIcon(exercise.icon);
            return (
              <Card key={exercise.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1">{exercise.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {exercise.duration} min • {exercise.description}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full flex-shrink-0"
                    onClick={() => handleStartExercise(
                      exercise.id,
                      exercise.title,
                      exercise.duration,
                      exercise.category
                    )}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wellness;
