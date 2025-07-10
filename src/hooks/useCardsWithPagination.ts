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

const CACHE_KEY = 'digideck_cards_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export function useCardsWithPagination(filters: CardFilters & { fetchAll?: boolean } = {}): UseCardsResult {
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

  // Check cache first
  const getCachedCards = (): DigimonCard[] | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          return data;
        }
      }
    } catch (err) {
      console.warn('Failed to read cache:', err);
    }
    return null;
  };

  // Save to cache
  const setCachedCards = (cardsData: DigimonCard[]) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: cardsData,
        timestamp: Date.now()
      }));
    } catch (err) {
      console.warn('Failed to cache cards:', err);
    }
  };

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
    
    constraints.push(orderBy('name'));
    
    // For deck builder, fetch all cards once
    // For regular browsing, use pagination
    if (!filters.fetchAll) {
      constraints.push(limit(CARDS_PER_PAGE));
    }
    
    if (!isFirstPage && lastDoc && !filters.fetchAll) {
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

      // Check cache first for fetchAll requests
      if (filters.fetchAll && isFirstPage) {
        const cachedCards = getCachedCards();
        if (cachedCards) {
          setCards(cachedCards);
          setPagination(prev => ({ 
            ...prev, 
            total: cachedCards.length,
            hasMore: false
          }));
          setLoading(false);
          return;
        }
      }

      const [q] = buildQuery(isFirstPage);
      const snapshot = await getDocs(q);
      
      if (snapshot.empty && isFirstPage) {
        setCards([]);
        setPagination(prev => ({ ...prev, hasMore: false, total: 0 }));
        return;
      }

      const newCards = snapshot.docs.map(doc => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      }) as DigimonCard[];

      // For search, do additional client-side filtering for contains matching
      const filteredCards = filters.searchTerm
        ? newCards.filter(card => 
            card.name.toLowerCase().includes(filters.searchTerm!.toLowerCase())
          )
        : newCards;
      
      const displayCards = filteredCards;

      if (isFirstPage) {
        setCards(displayCards);
        setPagination(prev => ({ 
          ...prev, 
          page: 1, 
          total: filters.fetchAll ? displayCards.length : 0,
          hasMore: !filters.fetchAll && displayCards.length === CARDS_PER_PAGE
        }));
        
        // Cache all cards when fetchAll is true
        if (filters.fetchAll) {
          setCachedCards(displayCards);
        }
      } else {
        setCards(prev => [...prev, ...displayCards]);
        setPagination(prev => ({ 
          ...prev, 
          page: prev.page + 1,
          hasMore: displayCards.length === CARDS_PER_PAGE
        }));
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1] as any || null);
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