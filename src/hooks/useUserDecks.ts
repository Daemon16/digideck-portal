import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from './useAuth';
import { UserDeck, DeckCard } from '../utils/types';

export function useUserDecks() {
  const [decks, setDecks] = useState<UserDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, incrementActivity } = useAuth();

  const fetchDecks = async () => {
    if (!user) {
      setDecks([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_decks')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
        
      if (error) throw error;
      
      const transformedDecks = data.map(deck => ({
        id: deck.id,
        name: deck.name,
        description: deck.description,
        format: deck.format,
        cards: deck.cards || [],
        createdAt: new Date(deck.created_at),
        updatedAt: new Date(deck.updated_at)
      }));
      
      setDecks(transformedDecks);
    } catch (error) {
      console.error('Error fetching decks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, [user]);

  const createDeck = async (deckData: {
    name: string;
    description: string;
    format: string;
  }): Promise<UserDeck | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_decks')
        .insert({
          user_id: user.id,
          name: deckData.name,
          description: deckData.description,
          format: deckData.format,
          cards: []
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Trigger deck builder achievement
      incrementActivity && incrementActivity('decksAnalyzed');
      
      const newDeck = {
        id: data.id,
        name: data.name,
        description: data.description,
        format: data.format,
        cards: data.cards || [],
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
      
      setDecks(prev => [newDeck, ...prev]);
      return newDeck;
    } catch (error) {
      console.error('Error creating deck:', error);
      return null;
    }
  };

  const updateDeck = async (deck: UserDeck): Promise<void> => {
    try {
      const { error } = await supabase
        .from('user_decks')
        .update({
          name: deck.name,
          description: deck.description,
          cards: deck.cards,
          updated_at: new Date().toISOString()
        })
        .eq('id', deck.id);
        
      if (error) throw error;
      
      setDecks(prev => prev.map(d => d.id === deck.id ? { ...deck, updatedAt: new Date() } : d));
    } catch (error) {
      console.error('Error updating deck:', error);
    }
  };

  const deleteDeck = async (deckId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('user_decks')
        .delete()
        .eq('id', deckId);
        
      if (error) throw error;
      
      setDecks(prev => prev.filter(d => d.id !== deckId));
    } catch (error) {
      console.error('Error deleting deck:', error);
    }
  };

  return {
    decks,
    loading,
    createDeck,
    updateDeck,
    deleteDeck,
  };
}