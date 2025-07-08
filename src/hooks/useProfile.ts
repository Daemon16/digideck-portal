import { useState, useEffect } from 'react';

interface UserProfile {
  nickname: string;
  joinDate: Date;
  totalActivity: number;
  stats: {
    cardsViewed: number;
    decksAnalyzed: number;
    timeSpent: string;
    pagesVisited: number;
  };
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

const defaultAchievements: Achievement[] = [
  { id: 'first_visit', name: 'Digital Explorer', description: 'First visit to the Digital World', unlocked: false },
  { id: 'card_viewer', name: 'Card Collector', description: 'Viewed 25+ cards', unlocked: false },
  { id: 'meta_analyst', name: 'Meta Analyst', description: 'Analyzed tournament data', unlocked: false },
  { id: 'profile_creator', name: 'Identity Established', description: 'Created your tamer profile', unlocked: false },
  { id: 'evolution_master', name: 'Evolution Master', description: 'Partner reached Greymon stage', unlocked: false },
];

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('digimon-profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        joinDate: new Date(parsed.joinDate),
        achievements: parsed.achievements.map((a: any) => ({
          ...a,
          unlockedAt: a.unlockedAt ? new Date(a.unlockedAt) : undefined
        }))
      };
    }
    
    return {
      nickname: '',
      joinDate: new Date(),
      totalActivity: 0,
      stats: {
        cardsViewed: 0,
        decksAnalyzed: 0,
        timeSpent: '0h 0m',
        pagesVisited: 0,
      },
      achievements: defaultAchievements,
    };
  });

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('digimon-profile', JSON.stringify(updated));
      return updated;
    });
  };

  const incrementActivity = (type: 'cardsViewed' | 'decksAnalyzed' | 'pagesVisited', amount = 1) => {
    setProfile(prev => {
      const newStats = {
        ...prev.stats,
        [type]: prev.stats[type] + amount
      };
      
      const newTotalActivity = prev.totalActivity + amount;
      
      // Check for achievement unlocks
      const updatedAchievements = prev.achievements.map(achievement => {
        if (achievement.unlocked) return achievement;
        
        let shouldUnlock = false;
        switch (achievement.id) {
          case 'first_visit':
            shouldUnlock = newStats.pagesVisited >= 1;
            break;
          case 'card_viewer':
            shouldUnlock = newStats.cardsViewed >= 25;
            break;
          case 'meta_analyst':
            shouldUnlock = newStats.decksAnalyzed >= 5;
            break;
          case 'profile_creator':
            shouldUnlock = prev.nickname.length > 0;
            break;
          case 'evolution_master':
            shouldUnlock = newTotalActivity >= 150;
            break;
        }
        
        if (shouldUnlock) {
          return {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date()
          };
        }
        
        return achievement;
      });
      
      const updated = {
        ...prev,
        totalActivity: newTotalActivity,
        stats: newStats,
        achievements: updatedAchievements
      };
      
      localStorage.setItem('digimon-profile', JSON.stringify(updated));
      return updated;
    });
  };

  const setNickname = (nickname: string) => {
    updateProfile({ nickname });
    
    // Unlock profile creation achievement
    if (nickname.length > 0) {
      incrementActivity('pagesVisited', 0); // Trigger achievement check
    }
  };

  // Track page visits
  useEffect(() => {
    incrementActivity('pagesVisited', 1);
  }, []);

  return {
    profile,
    updateProfile,
    incrementActivity,
    setNickname,
  };
}