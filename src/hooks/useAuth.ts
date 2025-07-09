import { useState, useEffect } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from '../utils/firebase';

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
  { id: 'evolution_master', name: 'Evolution Master', description: 'Reached 150+ total activity', unlocked: false },
];

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        await loadUserProfile(user.uid);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadUserProfile = async (uid: string) => {
    try {
      const profileDoc = await getDoc(doc(db, 'users', uid));
      
      if (profileDoc.exists()) {
        const data = profileDoc.data();
        setProfile({
          ...data,
          joinDate: data.joinDate.toDate(),
          achievements: data.achievements.map((a: any) => ({
            ...a,
            unlockedAt: a.unlockedAt ? a.unlockedAt.toDate() : undefined
          }))
        } as UserProfile);
      } else {
        // Create new profile
        const newProfile: UserProfile = {
          uid,
          email: auth.currentUser?.email || '',
          tamerName: auth.currentUser?.displayName || '',
          joinDate: new Date(),
          stats: {
            cardsViewed: 0,
            decksAnalyzed: 0,
            pagesVisited: 1
          },
          achievements: defaultAchievements
        };
        
        await setDoc(doc(db, 'users', uid), newProfile);
        setProfile(newProfile);
        
        // Check achievements after creating profile (for profile_creator achievement)
        setTimeout(() => checkAchievements(), 100);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const signUp = async (email: string, password: string, tamerName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: tamerName });
    return userCredential.user;
  };

  const signIn = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const incrementActivity = async (type: 'cardsViewed' | 'decksAnalyzed' | 'pagesVisited') => {
    if (!user || !profile) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        [`stats.${type}`]: increment(1)
      });

      // Update local state
      setProfile(prev => prev ? {
        ...prev,
        stats: {
          ...prev.stats,
          [type]: prev.stats[type] + 1
        }
      } : null);

      // Check achievements
      checkAchievements();
    } catch (error) {
      console.error('Error incrementing activity:', error);
    }
  };

  const updateTamerName = async (newTamerName: string) => {
    if (!user || !profile) return;

    try {
      // Update Firebase Auth profile
      await updateProfile(user, { displayName: newTamerName });
      
      // Update Firestore profile
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { tamerName: newTamerName });
      
      // Update local state
      setProfile(prev => prev ? { ...prev, tamerName: newTamerName } : null);
      
      // Check achievements after updating name
      await checkAchievements();
    } catch (error) {
      console.error('Error updating tamer name:', error);
    }
  };

  const checkAchievements = async () => {
    if (!user || !profile) return;

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
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { achievements: updatedAchievements });
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