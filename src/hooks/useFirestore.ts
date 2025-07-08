import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  onSnapshot,
  QueryConstraint 
} from 'firebase/firestore';
import { db } from '../utils/firebase';

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
  }, [collectionName, JSON.stringify(constraints), realtime]);

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

  const { data: cards, loading, error } = useFirestoreCollection(
    'cards',
    constraints
  );

  // Client-side search filtering
  const filteredCards = filters.searchTerm
    ? cards.filter(card => 
        card.name.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
        card.effects.toLowerCase().includes(filters.searchTerm!.toLowerCase())
      )
    : cards;

  return { cards: filteredCards, loading, error };
}

export function useDecks(filters: {
  archetype?: string;
  region?: string;
  limit?: number;
} = {}) {
  const constraints: QueryConstraint[] = [];
  
  if (filters.archetype) {
    constraints.push(where('archetype', '==', filters.archetype));
  }
  if (filters.region) {
    constraints.push(where('region', '==', filters.region));
  }
  
  constraints.push(orderBy('date', 'desc'));
  constraints.push(limit(filters.limit || 20));

  return useFirestoreCollection('decks', constraints);
}

export function useMetaData(region?: string) {
  const constraints: QueryConstraint[] = [];
  
  if (region) {
    constraints.push(where('region', '==', region));
  }
  
  constraints.push(orderBy('popularity', 'desc'));

  return useFirestoreCollection('meta', constraints, true);
}