import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import type { User } from '@supabase/supabase-js';

interface UserProfile {
  uid: string;
  email: string;
  tamerName: string;
  joinDate: Date;
  stats: {
    cardsViewed: number;
    decksAnalyzed: number;
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
  { id: 'meta_analyst', name: 'Meta Analyst', description: 'Analyzed 5+ tournament decks', unlocked: false },
  { id: 'profile_creator', name: 'Identity Established', description: 'Created your tamer profile', unlocked: false },
  { id: 'deck_builder', name: 'Deck Architect', description: 'Built your first deck', unlocked: false },
  { id: 'evolution_master', name: 'Evolution Master', description: 'Reached 150+ total activity', unlocked: false },
];

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const initAuth = async () => {
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      } catch (error) {
        console.error('Auth initialization error:', error);
        setLoading(false);
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      setUser(session?.user ?? null);
      
      if (session?.user && event === 'SIGNED_IN') {
        await loadUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
      }
    });

    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = useCallback(async (uid: string) => {
    if (profileLoading) return; // Prevent multiple simultaneous calls
    
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', uid)
        .single();
      
      if (data && !error) {
        setProfile({
          uid: data.user_id,
          email: data.email,
          tamerName: data.tamer_name,
          joinDate: new Date(data.join_date),
          stats: data.stats,
          achievements: data.achievements || defaultAchievements
        });
      } else if (error?.code === 'PGRST116') {
        // No profile exists, create one (only if we have a valid session)
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const newProfile = {
            user_id: uid,
            email: session.user.email || '',
            tamer_name: session.user.user_metadata?.display_name || '',
            join_date: new Date().toISOString(),
            stats: {
              cardsViewed: 0,
              decksAnalyzed: 0,
              pagesVisited: 1
            },
            achievements: defaultAchievements
          };
          
          const { error: insertError } = await supabase.from('user_profiles').insert([newProfile]);
          if (!insertError) {
            setProfile({
              uid: uid,
              email: newProfile.email,
              tamerName: newProfile.tamer_name,
              joinDate: new Date(newProfile.join_date),
              stats: newProfile.stats,
              achievements: newProfile.achievements
            });
          }
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setProfileLoading(false);
    }
  }, [profileLoading]);

  const signUp = async (email: string, password: string, tamerName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: tamerName
        }
      }
    });
    if (error) throw error;
    return data.user;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data.user;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const incrementActivity = async (type: 'cardsViewed' | 'decksAnalyzed' | 'pagesVisited') => {
    if (!user?.id || !profile) return;

    try {
      const newStats = {
        ...profile.stats,
        [type]: profile.stats[type] + 1
      };

      await supabase
        .from('user_profiles')
        .update({ stats: newStats })
        .eq('user_id', user.id);

      // Update local state
      setProfile(prev => prev ? {
        ...prev,
        stats: newStats
      } : null);

      // Check achievements
      checkAchievements();
    } catch (error) {
      console.error('Error incrementing activity:', error);
    }
  };

  const updateTamerName = async (newTamerName: string) => {
    if (!user?.id || !profile) return;

    try {
      await supabase
        .from('user_profiles')
        .update({ tamer_name: newTamerName })
        .eq('user_id', user.id);
      
      // Update local state
      setProfile(prev => prev ? { ...prev, tamerName: newTamerName } : null);
      
      // Check achievements after updating name
      await checkAchievements();
    } catch (error) {
      console.error('Error updating tamer name:', error);
    }
  };

  const checkAchievements = async () => {
    if (!user?.id || !profile) return;

    const updatedAchievements = [...profile.achievements];
    let hasUpdates = false;
    const currentStats = profile.stats;

    updatedAchievements.forEach(achievement => {
      if (achievement.unlocked) return;

      let shouldUnlock = false;
      switch (achievement.id) {
        case 'first_visit':
          shouldUnlock = currentStats.pagesVisited >= 1;
          break;
        case 'card_viewer':
          shouldUnlock = currentStats.cardsViewed >= 25;
          break;
        case 'meta_analyst':
          shouldUnlock = currentStats.decksAnalyzed >= 5;
          break;
        case 'profile_creator':
          shouldUnlock = profile.tamerName !== null && profile.tamerName.length > 0;
          break;
        case 'deck_builder':
          shouldUnlock = currentStats.decksAnalyzed >= 1;
          break;
        case 'evolution_master':
          shouldUnlock = (currentStats.cardsViewed + currentStats.decksAnalyzed + currentStats.pagesVisited) >= 150;
          break;
      }

      if (shouldUnlock) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();
        hasUpdates = true;
      }
    });

    if (hasUpdates) {
      await supabase
        .from('user_profiles')
        .update({ achievements: updatedAchievements })
        .eq('user_id', user.id);
      setProfile(prev => prev ? { ...prev, achievements: updatedAchievements } : null);
    }
  };

  return {
    user,
    profile,
    loading,
    signUp,
    signIn,
    logout,
    incrementActivity,
    updateTamerName
  };
}