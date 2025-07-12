import { useState, useMemo } from 'react';
import {
  Stack, Group, TextInput, Button, Grid, Card, Text, Badge,
  Image, Center, Loader, Alert, Tabs
} from '@mantine/core';
import { IconSearch, IconPlus, IconMinus, IconCards, IconEdit, IconArrowUp } from '@tabler/icons-react';
import { useCardsWithPagination } from '../hooks/useCardsWithPagination';
import { UserDeck, DigimonCard, DeckCard, CardFilters } from '../utils/types';
import { getCardRestriction, getMaxCopies } from '../utils/banlist';

interface DeckBuilderProps {
  deck: UserDeck;
  onSave: (deck: UserDeck) => void;
  onClose: () => void;
}

export default function DeckBuilder({ deck, onSave, onClose }: DeckBuilderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDeck, setCurrentDeck] = useState<UserDeck>({
    ...deck,
    name: deck.name || 'Untitled Deck'
  });

  // Create filters for card search
  const filters: CardFilters = useMemo(() => ({
    searchTerm: searchTerm
  }), [searchTerm]);

  const { cards, loading, loadingMore, hasMore, loadMore } = useCardsWithPagination(filters);

  const hasMoreCards = hasMore;



  const isDigitama = (card: DigimonCard | DeckCard) => 
    card.form === 'In-Training' || card.level === 2;
  
  const mainDeckCards = currentDeck.cards.filter(card => !isDigitama(card));
  const eggDeckCards = currentDeck.cards.filter(card => isDigitama(card));
  const mainDeckCount = mainDeckCards.reduce((sum, card) => sum + card.quantity, 0);
  const eggDeckCount = eggDeckCards.reduce((sum, card) => sum + card.quantity, 0);

  const addCardToDeck = (card: DigimonCard) => {
    const existingCard = currentDeck.cards.find(c => c.cardId === card.id);
    const restriction = getCardRestriction(card.cardNumber);
    const maxQuantity = getMaxCopies(card.cardNumber);
    const isCardDigitama = isDigitama(card);
    
    if (restriction === 'banned') {
      return; // Cannot add banned cards
    }
    
    // Check deck limits
    if (isCardDigitama && eggDeckCount >= 5) {
      return; // Cannot exceed 5 digitama cards
    }
    if (!isCardDigitama && mainDeckCount >= 50) {
      return; // Cannot exceed 50 main deck cards
    }
    
    if (existingCard) {
      if (existingCard.quantity < maxQuantity) {
        setCurrentDeck(prev => ({
          ...prev,
          cards: prev.cards.map(c =>
            c.cardId === card.id
              ? { ...c, quantity: c.quantity + 1 }
              : c
          )
        }));
      }
    } else {
      const newCard: DeckCard = {
        cardId: card.id,
        name: card.name,
        type: card.type,
        form: card.form,
        level: card.level,
        cardNumber: card.cardNumber,
        image: card.image,
        quantity: 1
      };
      
      setCurrentDeck(prev => ({
        ...prev,
        cards: [...prev.cards, newCard]
      }));
    }
  };

  const removeCardFromDeck = (cardId: string) => {
    setCurrentDeck(prev => ({
      ...prev,
      cards: prev.cards.map(c =>
        c.cardId === cardId
          ? { ...c, quantity: Math.max(0, c.quantity - 1) }
          : c
      ).filter(c => c.quantity > 0)
    }));
  };

  const handleSave = () => {
    onSave(currentDeck);
  };

  const isValidDeck = mainDeckCount <= 50 && eggDeckCount <= 5;

  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-start" mt="md">
        <Stack gap="sm">
          <TextInput
            value={currentDeck?.name || ''}
            onChange={(e) => setCurrentDeck(prev => ({ ...prev, name: e.target?.value || '' }))}
            placeholder="Deck name"
            leftSection={<IconEdit size={16} />}
            styles={{
              input: {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(0, 210, 211, 0.3)',
                color: 'white',
                fontSize: '18px',
                fontWeight: 600
              }
            }}
          />
          <Group>
            <Badge variant="outline" color={mainDeckCount === 50 ? 'green' : 'orange'}>
              Main: {mainDeckCount}/50
            </Badge>
            <Badge variant="outline" color={eggDeckCount <= 5 ? 'green' : 'red'}>
              Eggs: {eggDeckCount}/5
            </Badge>
          </Group>
        </Stack>
        <Group>
          <Button variant="subtle" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="gradient"
            gradient={{ from: 'cyan', to: 'blue' }}
            onClick={handleSave}
            disabled={!isValidDeck}
          >
            Save Deck
          </Button>
        </Group>
      </Group>

      {mainDeckCount > 50 && (
        <Alert color="red" variant="light" mb="md">
          Main deck cannot exceed 50 cards
        </Alert>
      )}
      {eggDeckCount > 5 && (
        <Alert color="red" variant="light" mb="md">
          Digitama deck cannot exceed 5 cards
        </Alert>
      )}
      {mainDeckCount > 0 && mainDeckCount < 50 && (
        <Alert color="yellow" variant="light" mb="md" styles={{
          message: { color: 'white' }
        }}>
          Tournament decks require exactly 50 main deck cards
        </Alert>
      )}

      <Tabs defaultValue="builder">
        <Tabs.List>
          <Tabs.Tab value="builder">Card Search</Tabs.Tab>
          <Tabs.Tab value="deck">Current Deck</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="builder" pt="lg">
          <Stack gap="md">
            <TextInput
              placeholder="Search cards to add..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
              leftSection={<IconSearch size={16} />}
            />

            {loading ? (
              <Center py={40}>
                <Loader size="md" color="cyan" />
              </Center>
            ) : cards.length === 0 && searchTerm ? (
              <Center py={40}>
                <Stack align="center">
                  <IconSearch size={48} color="gray" />
                  <Text c="dimmed">No cards found matching "{searchTerm}"</Text>
                </Stack>
              </Center>
            ) : (
              <Grid>
                {cards.map((card) => {
                  const inDeck = currentDeck.cards.find(c => c.cardId === card.id);
                  const restriction = getCardRestriction(card.cardNumber);
                  const maxQuantity = getMaxCopies(card.cardNumber);
                  
                  return (
                    <Grid.Col key={card.id} span={{ base: 12, sm: 6, md: 4 }}>
                      <Card
                        shadow="sm"
                        padding="sm"
                        radius="md"
                        withBorder
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(0, 210, 211, 0.2)'
                        }}
                      >
                        <Card.Section>
                          <Image
                            src={card.image}
                            alt={card.name}
                            height={120}
                            fit="cover"
                            fallbackSrc="/placeholder-card.png"
                          />
                        </Card.Section>
                        
                        <Stack gap="xs" mt="sm">
                          <Text size="sm" fw={500} c="white" lineClamp={1}>
                            {card.name}
                          </Text>
                          
                          <Group justify="space-between">
                            <Group gap="xs">
                              <Badge size="xs" color="blue">
                                {card.type}
                              </Badge>
                              {restriction === 'banned' && (
                                <Badge size="xs" color="red">BANNED</Badge>
                              )}
                              {restriction === 'limited' && (
                                <Badge size="xs" color="orange">LIMITED</Badge>
                              )}
                            </Group>
                            <Group gap="xs">
                              <Button
                                size="xs"
                                variant="light"
                                color="red"
                                onClick={() => removeCardFromDeck(card.id)}
                                disabled={!inDeck}
                              >
                                <IconMinus size={12} />
                              </Button>
                              <Text size="xs" c="white" w={20} ta="center">
                                {inDeck?.quantity || 0}
                              </Text>
                              <Button
                                size="xs"
                                variant="light"
                                color="green"
                                onClick={() => addCardToDeck(card)}
                                disabled={
                                  restriction === 'banned' || 
                                  inDeck?.quantity >= maxQuantity ||
                                  (isDigitama(card) && eggDeckCount >= 5) ||
                                  (!isDigitama(card) && mainDeckCount >= 50)
                                }
                              >
                                <IconPlus size={12} />
                              </Button>
                            </Group>
                          </Group>
                        </Stack>
                      </Card>
                    </Grid.Col>
                  );
                })}
              </Grid>
            )}
            
            {(hasMoreCards || loadingMore) && (
              <Center mt={20}>
                <Group>
                  <Button
                    onClick={loadMore}
                    variant="outline"
                    color="cyan"
                    loading={loadingMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? 'Loading More Cards...' : 'Load More Cards'}
                  </Button>
                  <Button
                    onClick={() => {
                      const modalContent = document.querySelector('.mantine-Modal-content');
                      if (modalContent) {
                        modalContent.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        // Fallback: try scrolling the modal root
                        const modal = document.querySelector('.mantine-Modal-root');
                        if (modal) {
                          modal.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }
                    }}
                    variant="subtle"
                    color="cyan"
                    leftSection={<IconArrowUp size={16} />}
                  >
                    Top
                  </Button>
                </Group>
              </Center>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="deck" pt="lg">
          <Stack gap="md">
            <Text fw={600} c="white">Main Deck ({mainDeckCount} cards)</Text>
            <Grid>
              {mainDeckCards.map((card) => (
                <Grid.Col key={card.cardId} span={{ base: 12, sm: 6, md: 4 }}>
                  <Card
                    shadow="sm"
                    padding="sm"
                    radius="md"
                    withBorder
                    style={{
                      background: 'rgba(0, 210, 211, 0.1)',
                      border: '1px solid rgba(0, 210, 211, 0.3)'
                    }}
                  >
                    <Group>
                      <Image
                        src={card.image}
                        alt={card.name}
                        width={40}
                        height={50}
                        fit="cover"
                        fallbackSrc="/placeholder-card.png"
                      />
                      <Stack gap="xs" style={{ flex: 1 }}>
                        <Text size="sm" fw={500} c="white">
                          {card.name}
                        </Text>
                        <Group justify="space-between">
                          <Badge size="xs">{card.form || card.type}</Badge>
                          <Group gap="xs">
                            <Button
                              size="xs"
                              variant="light"
                              color="red"
                              onClick={() => removeCardFromDeck(card.cardId)}
                            >
                              <IconMinus size={12} />
                            </Button>
                            <Text size="sm" c="cyan" fw={600}>
                              x{card.quantity}
                            </Text>
                          </Group>
                        </Group>
                      </Stack>
                    </Group>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>

            {eggDeckCards.length > 0 && (
              <>
                <Text fw={600} c="white" mt="lg">Digitama Deck ({eggDeckCount} cards)</Text>
                <Grid>
                  {eggDeckCards.map((card) => (
                    <Grid.Col key={card.cardId} span={{ base: 12, sm: 6, md: 4 }}>
                      <Card
                        shadow="sm"
                        padding="sm"
                        radius="md"
                        withBorder
                        style={{
                          background: 'rgba(255, 107, 53, 0.1)',
                          border: '1px solid rgba(255, 107, 53, 0.3)'
                        }}
                      >
                        <Group>
                          <Image
                            src={card.image}
                            alt={card.name}
                            width={40}
                            height={50}
                            fit="cover"
                            fallbackSrc="/placeholder-card.png"
                          />
                          <Stack gap="xs" style={{ flex: 1 }}>
                            <Text size="sm" fw={500} c="white">
                              {card.name}
                            </Text>
                            <Group justify="space-between">
                              <Badge size="xs" color="orange">{card.form || card.type}</Badge>
                              <Group gap="xs">
                                <Button
                                  size="xs"
                                  variant="light"
                                  color="red"
                                  onClick={() => removeCardFromDeck(card.cardId)}
                                >
                                  <IconMinus size={12} />
                                </Button>
                                <Text size="sm" c="orange" fw={600}>
                                  x{card.quantity}
                                </Text>
                              </Group>
                            </Group>
                          </Stack>
                        </Group>
                      </Card>
                    </Grid.Col>
                  ))}
                </Grid>
              </>
            )}

            {currentDeck.cards.length === 0 && (
              <Center py={40}>
                <Stack align="center">
                  <IconCards size={48} color="gray" />
                  <Text c="dimmed">No cards in deck yet</Text>
                </Stack>
              </Center>
            )}
          </Stack>
        </Tabs.Panel>
      </Tabs>
      

    </Stack>
  );
}