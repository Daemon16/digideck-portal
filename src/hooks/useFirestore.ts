import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  onSnapshot,
  QueryConstraint,
  startAfter
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import { DigimonCard, TournamentDeck, MetaSet, SetDeck } from '../utils/types';

export function useFirestoreCollection<T>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  realtime: boolean = false
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const collectionRef = collection(db, collectionName);
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;

    if (realtime) {
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as T[];
          setData(items);
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );

      return unsubscribe;
    } else {
      getDocs(q)
        .then((snapshot) => {
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as T[];
          setData(items);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [collectionName, constraints.length, realtime, ...constraints.map((_, i) => JSON.stringify(constraints[i]))]);

  return { data, loading, error };
}

export function useCards(filters: {
  type?: string;
  color?: string;
  set?: string;
  searchTerm?: string;
} = {}) {
  const constraints: QueryConstraint[] = [];
  
  if (filters.type) {
    constraints.push(where('type', '==', filters.type));
  }
  if (filters.color) {
    constraints.push(where('color', 'array-contains', filters.color));
  }
  if (filters.set) {
    constraints.push(where('set', '==', filters.set));
  }
  
  constraints.push(orderBy('name'));
  constraints.push(limit(50));

  const { data: cards, loading, error } = useFirestoreCollection<DigimonCard>(
    'cards',
    constraints
  );

  // Client-side search filtering
  const filteredCards = filters.searchTerm
    ? cards.filter(card => 
        card.name?.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
        card.effects?.toLowerCase().includes(filters.searchTerm!.toLowerCase())
      )
    : cards;

  return { cards: filteredCards, loading, error };
}

// Regional mapping for server-side filtering
const REGION_MAPPING: Record<string, string[]> = {
  'JP': ['Japan', 'JP'],
  'US': ['USA', 'US'],
  'EU': ['Germany', 'France', 'Italy', 'Spain', 'UK', 'Netherlands', 'Belgium', 'Austria', 'Switzerland', 'Croatia', 'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Greece', 'Portugal', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Ireland'],
  'AS': ['China', 'Korea', 'Thailand', 'Singapore', 'Malaysia', 'Philippines', 'Indonesia', 'Taiwan', 'Hong Kong']
};

export function useDecks(filters: {
  archetype?: string;
  region?: string;
  limit?: number;
  collection?: string;
} = {}) {
  const [data, setData] = useState<TournamentDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);

  const loadDecks = async (isLoadMore: boolean = false) => {
    try {
      setLoading(true);
      const constraints: QueryConstraint[] = [];
      
      if (filters.archetype) {
        constraints.push(where('archetype', '==', filters.archetype));
      }
      
      // Server-side regional filtering using 'in' operator
      if (filters.region && filters.region !== '') {
        const allowedCountries = REGION_MAPPING[filters.region];
        if (allowedCountries && allowedCountries.length > 0) {
          // Firebase 'in' operator supports up to 10 values
          const countryBatches = [];
          for (let i = 0; i < allowedCountries.length; i += 10) {
            countryBatches.push(allowedCountries.slice(i, i + 10));
          }
          
          // For now, use the first batch (most common countries)
          constraints.push(where('region', 'in', countryBatches[0]));
        }
      }
      
      constraints.push(orderBy('date', 'desc'));
      constraints.push(limit(filters.limit || 10));
      
      if (isLoadMore && lastDoc) {
        constraints.push(startAfter(lastDoc));
      }

      const collectionRef = collection(db, filters.collection || 'decks');
      const q = query(collectionRef, ...constraints);
      const snapshot = await getDocs(q);
      
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate?.() || doc.data().date || new Date(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt || new Date(),
      })) as TournamentDeck[];
      
      if (isLoadMore) {
        setData(prev => [...prev, ...items]);
      } else {
        setData(items);
      }
      
      setHasMore(items.length === (filters.limit || 10));
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch decks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLastDoc(null);
    setHasMore(true);
    loadDecks(false);
  }, [filters.archetype, filters.region, filters.collection]);

  const loadMore = () => {
    if (!loading && hasMore) {
      loadDecks(true);
    }
  };

  return { data, loading, error, hasMore, loadMore };
}

export function useMetaData(region?: string) {
  const constraints: QueryConstraint[] = [];
  
  if (region) {
    constraints.push(where('region', '==', region));
  }
  
  constraints.push(orderBy('popularity', 'desc'));

  return useFirestoreCollection('meta', constraints, true);
}

export function useSetStats(selectedSet?: MetaSet, filters: {
  region?: string;
} = {}) {
  const [stats, setStats] = useState({
    totalDecks: 0,
    totalArchetypes: 0,
    totalTournaments: 0,
    totalRegions: 0,
    topArchetypes: [] as { name: string; count: number }[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!selectedSet?.setId) {
        setStats({ totalDecks: 0, totalArchetypes: 0, totalTournaments: 0, totalRegions: 0, topArchetypes: [] });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const constraints: QueryConstraint[] = [];
        
        constraints.push(where('setId', '==', selectedSet.setId));
        
        if (filters.region && filters.region !== '') {
          const allowedCountries = REGION_MAPPING[filters.region];
          if (allowedCountries && allowedCountries.length > 0) {
            constraints.push(where('region', 'in', allowedCountries.slice(0, 10)));
          }
        }

        const collectionRef = collection(db, 'metaDecks');
        const q = query(collectionRef, ...constraints);
        const snapshot = await getDocs(q);
        
        const allDecks = snapshot.docs.map(doc => doc.data());
        
        const archetypeStats: Record<string, { count: number }> = {};
        const tournaments = new Set();
        const regions = new Set();
        
        allDecks.forEach(deck => {
          if (deck.archetype) {
            if (!archetypeStats[deck.archetype]) {
              archetypeStats[deck.archetype] = { count: 0 };
            }
            archetypeStats[deck.archetype].count++;
          }
          if (deck.tournament) tournaments.add(deck.tournament);
          if (deck.region) regions.add(deck.region);
        });
        
        const topArchetypes = Object.entries(archetypeStats)
          .map(([name, stats]) => ({ name, count: stats.count }))
          .sort((a, b) => b.count - a.count);
        
        setStats({
          totalDecks: allDecks.length,
          totalArchetypes: Object.keys(archetypeStats).length,
          totalTournaments: tournaments.size,
          totalRegions: regions.size,
          topArchetypes
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [selectedSet?.setId, filters.region]);

  return { stats, loading };
}

export function useMetaSets() {
  const constraints: QueryConstraint[] = [
    orderBy('createdAt', 'desc')
  ];
  
  return useFirestoreCollection<MetaSet>('metaSets', constraints);
}

export function useSetDecks(selectedSet?: MetaSet, filters: {
  region?: string;
  limit?: number;
} = {}) {
  const [data, setData] = useState<SetDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);

  const loadDecks = async (isLoadMore: boolean = false) => {
    if (!selectedSet?.setId) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const constraints: QueryConstraint[] = [];
      
      console.log(`🔍 Filtering decks by setId: "${selectedSet.setId}"`);
      constraints.push(where('setId', '==', selectedSet.setId));
      
      if (filters.region && filters.region !== '') {
        const allowedCountries = REGION_MAPPING[filters.region];
        if (allowedCountries && allowedCountries.length > 0) {
          constraints.push(where('region', 'in', allowedCountries.slice(0, 10)));
        }
      }
      
      constraints.push(orderBy('date', 'desc'));
      constraints.push(limit(filters.limit || 12));
      
      if (isLoadMore && lastDoc) {
        constraints.push(startAfter(lastDoc));
      }

      const collectionRef = collection(db, 'metaDecks');
      const q = query(collectionRef, ...constraints);
      const snapshot = await getDocs(q);
      
      console.log(`📊 Found ${snapshot.docs.length} decks for setId: "${selectedSet.setId}"`);
      
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate?.() || doc.data().date || new Date(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt || new Date(),
      })) as SetDeck[];
      
      if (isLoadMore) {
        setData(prev => [...prev, ...items]);
      } else {
        setData(items);
      }
      
      setHasMore(items.length === (filters.limit || 12));
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching decks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch decks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLastDoc(null);
    setHasMore(true);
    loadDecks(false);
  }, [selectedSet?.setId, filters.region]);

  const loadMore = () => {
    if (!loading && hasMore) {
      loadDecks(true);
    }
  };

  return { data, loading, error, hasMore, loadMore };
}