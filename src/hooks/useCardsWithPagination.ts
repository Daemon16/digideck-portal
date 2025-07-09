import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  getDocs, 
  QueryConstraint,
  DocumentSnapshot,
  getCountFromServer
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import { DigimonCard, CardFilters, UseCardsResult, PaginationState } from '../utils/types';

const CARDS_PER_PAGE = 20;

export function useCardsWithPagination(filters: CardFilters = {}): UseCardsResult {
  const [cards, setCards] = useState<DigimonCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: CARDS_PER_PAGE,
    hasMore: true,
    total: 0
  });

  const buildQuery = useCallback((isFirstPage: boolean = true): [any, QueryConstraint[]] => {
    const constraints: QueryConstraint[] = [];
    
    if (filters.type) {
      constraints.push(where('type', '==', filters.type));
    }
    if (filters.color) {
      constraints.push(where('color', 'array-contains', filters.color));
    }
    if (filters.set) {
      constraints.push(where('set', 'array-contains', filters.set));
    }
    if (filters.rarity) {
      constraints.push(where('rarity', '==', filters.rarity));
    }
    
    // Add search term to Firebase query using array-contains on searchTerms field
    if (filters.searchTerm) {
      constraints.push(where('searchTerms', 'array-contains', filters.searchTerm.toLowerCase()));
    }
    
    constraints.push(orderBy('name'));
    constraints.push(limit(CARDS_PER_PAGE));
    
    if (!isFirstPage && lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    const collectionRef = collection(db, 'cards');
    const q = query(collectionRef, ...constraints);
    
    return [q, constraints];
  }, [filters, lastDoc]);

  const fetchCards = useCallback(async (isFirstPage: boolean = true) => {
    try {
      setLoading(true);
      setError(null);

      const [q] = buildQuery(isFirstPage);
      const snapshot = await getDocs(q);
      
      if (snapshot.empty && isFirstPage) {
        setCards([]);
        setPagination(prev => ({ ...prev, hasMore: false, total: 0 }));
        return;
      }

      const newCards = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as DigimonCard[];

      // If searchTerms field doesn't exist, fall back to client-side filtering
      const filteredCards = filters.searchTerm && newCards.length > 0 && !newCards[0].searchTerms
        ? newCards.filter(card => {
            const searchTerm = filters.searchTerm!.toLowerCase();
            return (
              card.name.toLowerCase().includes(searchTerm) ||
              (card.cardNumber && card.cardNumber.toLowerCase().includes(searchTerm)) ||
              (card.set && Array.isArray(card.set) && card.set.some(setName => 
                setName.toLowerCase().includes(searchTerm)
              ))
            );
          })
        : newCards;

      if (isFirstPage) {
        setCards(filteredCards);
        // Get total count for pagination
        const countQuery = query(collection(db, 'cards'), ...buildQuery(true)[1].slice(0, -2));
        const countSnapshot = await getCountFromServer(countQuery);
        setPagination(prev => ({ 
          ...prev, 
          page: 1, 
          total: countSnapshot.data().count,
          hasMore: filteredCards.length === CARDS_PER_PAGE
        }));
      } else {
        setCards(prev => [...prev, ...filteredCards]);
        setPagination(prev => ({ 
          ...prev, 
          page: prev.page + 1,
          hasMore: filteredCards.length === CARDS_PER_PAGE
        }));
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cards');
    } finally {
      setLoading(false);
    }
  }, [buildQuery, filters.searchTerm]);

  const loadMore = useCallback(() => {
    if (!loading && pagination.hasMore) {
      fetchCards(false);
    }
  }, [fetchCards, loading, pagination.hasMore]);

  const refresh = useCallback(() => {
    setLastDoc(null);
    setPagination(prev => ({ ...prev, page: 1, hasMore: true }));
    fetchCards(true);
  }, [fetchCards]);

  useEffect(() => {
    refresh();
  }, [filters.type, filters.color, filters.set, filters.rarity, filters.searchTerm]);

  return {
    cards,
    loading,
    error,
    pagination,
    loadMore,
    refresh
  };
}