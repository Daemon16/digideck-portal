import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from './useAuth';
import { UserDeck, DeckCard } from '../utils/types';

export function useUserDecks() {
  const [decks, setDecks] = useState<UserDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, incrementActivity } = useAuth();

  useEffect(() => {
    if (!user) {
      setDecks([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'userDecks'),
      where('userId', '==', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userDecks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as UserDeck[];
      
      setDecks(userDecks);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const createDeck = async (deckData: {
    name: string;
    description: string;
    format: string;
  }): Promise<UserDeck | null> => {
    if (!user) return null;

    try {
      const newDeck = {
        userId: user.uid,
        name: deckData.name,
        description: deckData.description,
        format: deckData.format,
        cards: [] as DeckCard[],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'userDecks'), newDeck);
      
      // Trigger deck builder achievement
      incrementActivity && incrementActivity('decksAnalyzed');
      
      return {
        id: docRef.id,
        ...newDeck,
        createdAt: new Date(),
        updatedAt: new Date(),
        cards: []
      } as UserDeck;
    } catch (error) {
      console.error('Error creating deck:', error);
      return null;
    }
  };

  const updateDeck = async (deck: UserDeck): Promise<void> => {
    try {
      const deckRef = doc(db, 'userDecks', deck.id);
      
      // Filter out undefined values from cards
      const cleanCards = deck.cards.map(card => ({
        cardId: card.cardId,
        name: card.name,
        quantity: card.quantity,
        ...(card.cardNumber && { cardNumber: card.cardNumber }),
        ...(card.type && { type: card.type }),
        ...(card.form && { form: card.form }),
        ...(card.level !== undefined && { level: card.level }),
        ...(card.image && { image: card.image })
      }));
      
      await updateDoc(deckRef, {
        name: deck.name,
        description: deck.description,
        cards: cleanCards,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating deck:', error);
    }
  };

  const deleteDeck = async (deckId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'userDecks', deckId));
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