import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Container, 
  Grid, 
  Card, 
  Text, 
  Title, 
  Badge, 
  Group, 
  Stack, 
  Button, 
  Image, 
  SimpleGrid,
  Loader,
  Center,
  Alert,
  Box,
  Modal
} from '@mantine/core';
import { IconArrowLeft, IconTrophy, IconCalendar, IconMapPin, IconUser, IconHash, IconStack, IconTarget, IconShare, IconDownload, IconLink } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { supabase } from '../utils/supabase';
import { DetailedDeck, DeckCard, MetaSet } from '../utils/types';

export default function DeckDetailsPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const [deck, setDeck] = useState<DetailedDeck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [relatedSet, setRelatedSet] = useState<MetaSet | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    async function fetchDeck() {
      if (!deckId) {
        setError('No deck ID provided');
        setLoading(false);
        return;
      }
      
      try {
        const { data: deck, error } = await supabase
          .from('tournament_decks')
          .select('*, meta_sets(*)')
          .eq('id', deckId)
          .single();

        if (error) throw error;

        if (!deck) {
          setError('Deck not found');
          setLoading(false);
          return;
        }

        const transformedDeck: DetailedDeck = {
          id: deck.id,
          name: deck.name,
          archetype: deck.archetype,
          player: deck.player,
          placement: deck.placement,
          region: deck.region,
          tournament: deck.tournament,
          date: new Date(deck.date),
          format: deck.format,
          cards: deck.cards || [],
          totalCards: deck.total_cards,
          setId: deck.set_id,
          createdAt: new Date(deck.created_at),
          updatedAt: new Date(deck.updated_at),
          deckProfile: deck.deck_profile,
          country: deck.country,
          host: deck.host,
          detailsUrl: deck.details_url,
          cardBreakdown: deck.card_breakdown,
          strategy: deck.strategy,
          keyCards: deck.key_cards || [],
          winCondition: deck.win_condition
        };

        setDeck(transformedDeck);
        
        if (deck.meta_sets) {
          const setData = deck.meta_sets;
          setRelatedSet({
            id: setData.id,
            name: setData.name,
            setId: setData.set_id,
            totalDecks: setData.total_decks,
            createdAt: new Date(setData.created_at),
            updatedAt: new Date(setData.updated_at)
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load deck');
      } finally {
        setLoading(false);
      }
    }

    fetchDeck();
  }, [deckId]);

  if (loading) {
    return (
      <Container size="xl" pt={80}>
        <Center h={400}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Stack align="center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader size="lg" color="orange" />
              </motion.div>
              <Text c="dimmed" size="lg">Loading deck details...</Text>
            </Stack>
          </motion.div>
        </Center>
      </Container>
    );
  }

  if (error || !deck) {
    return (
      <Container size="xl" pt={80}>
        <Center h={400}>
          <Stack align="center">
            <Alert color="red" title="Error">
              {error || 'Deck not found'}
            </Alert>
            <Button leftSection={<IconArrowLeft size={16} />} onClick={() => {
              if (relatedSet) {
                navigate('/meta', { state: { selectedSet: relatedSet } });
              } else {
                navigate('/meta');
              }
            }}>
              Back to Meta
            </Button>
          </Stack>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="xl" pt={80} pb={40}>
      <AnimatePresence>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Stack mb={32}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="gradient"
                gradient={{ from: 'orange', to: 'red' }}
                leftSection={<IconArrowLeft size={16} />} 
                onClick={() => {
                  if (relatedSet) {
                    navigate('/meta', { state: { selectedSet: relatedSet } });
                  } else {
                    navigate('/meta');
                  }
                }}
                w="fit-content"
                size="md"
              >
                Back to Meta Analysis
              </Button>
            </motion.div>
            
            <Group justify="space-between" align="flex-start">
              <Stack gap={4}>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Title 
                    order={1} 
                    size={48}
                    style={{
                      background: 'linear-gradient(45deg, #00a8ff, #ff6b35)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 0 20px rgba(0, 168, 255, 0.3)'
                    }}
                  >
                    {deck.archetype}
                  </Title>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Text c="dimmed" size="lg">Tournament Deck Analysis</Text>
                </motion.div>
              </Stack>
              
              <Group gap="md">
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Badge 
                    size="xl" 
                    variant="gradient"
                    gradient={{
                      from: deck.placement === 1 ? 'yellow' : deck.placement <= 4 ? 'blue' : 'gray',
                      to: deck.placement === 1 ? 'orange' : deck.placement <= 4 ? 'cyan' : 'dark'
                    }}
                    style={{
                      boxShadow: deck.placement === 1 ? '0 0 20px rgba(255, 215, 0, 0.5)' : '0 0 10px rgba(0, 168, 255, 0.3)'
                    }}
                  >
                    #{deck.placement} Place
                  </Badge>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    variant="gradient"
                    gradient={{ from: 'cyan', to: 'blue' }}
                    leftSection={<IconShare size={16} />}
                    onClick={() => setShareModalOpen(true)}
                  >
                    Share Deck
                  </Button>
                </motion.div>
              </Group>
            </Group>
          </Stack>
        </motion.div>

        <Grid>
          {/* Deck Info */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Stack>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card 
                  shadow="xl" 
                  padding="lg" 
                  radius="md" 
                  withBorder
                  style={{
                    background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.9), rgba(15, 15, 35, 0.9))',
                    border: '1px solid rgba(0, 168, 255, 0.3)',
                    boxShadow: '0 8px 32px rgba(0, 168, 255, 0.1)'
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Group mb="md">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        <IconTrophy size={20} color="orange" />
                      </motion.div>
                      <Title order={3} c="white">Deck Information</Title>
                    </Group>
                  </motion.div>
              
              <Stack gap="sm">
                <Group>
                  <IconUser size={16} color="gray" />
                  <Text c="gray.4">Player:</Text>
                  <Text fw={500} c="gray.1">{deck.player}</Text>
                </Group>
                
                <Group>
                  <IconMapPin size={16} color="gray" />
                  <Text c="gray.4">Region:</Text>
                  <Text c="gray.1">{deck.region}</Text>
                </Group>
                
                <Group>
                  <IconCalendar size={16} color="gray" />
                  <Text c="gray.4">Date:</Text>
                  <Text c="gray.1">{deck.date?.toLocaleDateString() || 'N/A'}</Text>
                </Group>
                
                <Group>
                  <IconHash size={16} color="gray" />
                  <Text c="gray.4">Tournament:</Text>
                  <Text size="sm" c="gray.2">{deck.tournament}</Text>
                </Group>
                
                <Group>
                  <IconStack size={16} color="gray" />
                  <Text c="gray.4">Total Cards:</Text>
                  <Text c="gray.1">{deck.totalCards}</Text>
                </Group>
              </Stack>
            </Card>
          </motion.div>


            </Stack>
          </Grid.Col>

          {/* Card Gallery */}
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Card 
                shadow="xl" 
                padding="lg" 
                radius="md" 
                withBorder
                style={{
                  background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.9), rgba(15, 15, 35, 0.9))',
                  border: '1px solid rgba(0, 168, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 168, 255, 0.1)'
                }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <Group mb="lg">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <IconTarget size={20} color="cyan" />
                    </motion.div>
                    <Title order={3} c="white">Deck Cards</Title>
                  </Group>
                </motion.div>
            
                {/* Deck */}
                {deck.cards && deck.cards.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <Stack>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                      >
                        <Title order={4} c="cyan">Deck ({deck.cards.length} cards)</Title>
                      </motion.div>
                      <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="md">
                        {deck.cards.map((card, index) => (
                          <motion.div
                            key={`deck-card-${card.cardId || card.cardNumber || card.name || 'unknown'}-${index}`}
                            initial={{ opacity: 0, y: 50, rotateY: -90 }}
                            animate={{ opacity: 1, y: 0, rotateY: 0 }}
                            transition={{ 
                              delay: 1.2 + index * 0.05, 
                              duration: 0.6,
                              type: "spring",
                              stiffness: 100
                            }}
                          >
                            <CardImageItem card={card} index={index} onImageClick={setSelectedImage} />
                          </motion.div>
                        ))}
                      </SimpleGrid>
                    </Stack>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          </Grid.Col>
        </Grid>
        
        {/* Image Modal */}
        <Modal
          opened={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          size="lg"
          centered
          withCloseButton={false}
          styles={{
            content: {
              background: 'transparent',
              boxShadow: 'none'
            },
            body: {
              padding: 0
            }
          }}
        >
          {selectedImage && (
            <div
              onClick={() => setSelectedImage(null)}
              style={{ cursor: 'pointer' }}
            >
              <Image
                src={selectedImage}
                alt="Card preview"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '12px',
                  boxShadow: '0 20px 60px rgba(0, 168, 255, 0.3)'
                }}
              />
            </div>
          )}
        </Modal>
        
        {/* Share Modal */}
        <Modal
          opened={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          title="Share Deck"
          centered
          styles={{
            content: {
              background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95), rgba(15, 15, 35, 0.95))',
              border: '2px solid rgba(0, 210, 211, 0.4)',
              backdropFilter: 'blur(15px)'
            },
            header: {
              background: 'transparent',
              borderBottom: '1px solid rgba(0, 210, 211, 0.2)'
            },
            title: { color: 'white', fontWeight: 700 }
          }}
        >
          <Stack gap="md">
            <Button
              variant="gradient"
              gradient={{ from: 'green', to: 'teal' }}
              leftSection={<IconDownload size={16} />}
              onClick={async () => {
                const exportArray = ['Exported from digideck-portal'];
                deck.cards?.forEach(card => {
                  for (let i = 0; i < card.quantity; i++) {
                    exportArray.push(card.cardNumber || card.name || 'UNKNOWN');
                  }
                });
                try {
                  await navigator.clipboard.writeText(JSON.stringify(exportArray));
                  notifications.show({
                    title: 'Success!',
                    message: 'Deck exported to clipboard',
                    color: 'green'
                  });
                } catch (err) {
                  notifications.show({
                    title: 'Error',
                    message: 'Failed to copy to clipboard',
                    color: 'red'
                  });
                }
                setShareModalOpen(false);
              }}
              fullWidth
            >
              Export for Play (Copy to Clipboard)
            </Button>
            
            <Button
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
              leftSection={<IconLink size={16} />}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  notifications.show({
                    title: 'Success!',
                    message: 'Deck link copied to clipboard',
                    color: 'green'
                  });
                } catch (err) {
                  notifications.show({
                    title: 'Error',
                    message: 'Failed to copy link',
                    color: 'red'
                  });
                }
                setShareModalOpen(false);
              }}
              fullWidth
            >
              Copy Deck Link
            </Button>
          </Stack>
        </Modal>
      </AnimatePresence>
    </Container>
  );
}

function CardImageItem({ card, index, onImageClick }: { card: DeckCard; index: number; onImageClick: (image: string) => void }) {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.05, 
        rotateY: 10,
        boxShadow: '0 20px 40px rgba(0, 168, 255, 0.3)'
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={() => card.image && onImageClick(card.image)}
    >
      <Card 
        shadow="xl" 
        padding="xs" 
        radius="md" 
        withBorder 
        style={{ 
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.8), rgba(15, 15, 35, 0.8))',
          border: '1px solid rgba(0, 168, 255, 0.2)',
          cursor: 'pointer'
        }}
      >
        <Card.Section>
          <Box style={{ position: 'relative', overflow: 'hidden', height: '250px' }}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              style={{ height: '100%' }}
            >
              <Image
                src={card.image || `https://via.placeholder.com/150x200?text=${encodeURIComponent(card.name || card.cardNumber || 'Card')}`}
                alt={card.name || card.cardNumber || 'Card'}
                h="100%"
                w="100%"
                fit="cover"
                fallbackSrc="https://via.placeholder.com/150x200?text=Card"
              />
            </motion.div>
            
            {/* Holographic effect overlay */}
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
                opacity: 0
              }}
              whileHover={{ opacity: 1, x: ['-100%', '100%'] }}
              transition={{ duration: 0.6 }}
            />
          </Box>
        </Card.Section>
        
        {/* Quantity Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          whileHover={{ scale: 1.2, rotate: 10 }}
        >
          <Badge 
            color="orange" 
            variant="gradient"
            gradient={{ from: 'orange', to: 'red' }}
            size="lg"
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              fontWeight: 'bold',
              boxShadow: '0 0 15px rgba(255, 107, 53, 0.5)'
            }}
          >
            x{card.quantity}
          </Badge>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Text size="xs" mt="xs" ta="center" truncate c="white" fw={500}>
            {card.name || card.cardNumber || 'Unknown Card'}
          </Text>
        </motion.div>
      </Card>
    </motion.div>
  );
}

function getColorVariant(color: string): string {
  switch (color) {
    case 'Red': return 'red';
    case 'Blue': return 'blue';
    case 'Yellow': return 'yellow';
    case 'Green': return 'green';
    case 'Black': return 'dark';
    case 'Purple': return 'violet';
    case 'White': return 'gray';
    default: return 'gray';
  }
}

function getColorRgb(color: string): string {
  switch (color) {
    case 'Red': return '239, 68, 68';
    case 'Blue': return '59, 130, 246';
    case 'Yellow': return '234, 179, 8';
    case 'Green': return '34, 197, 94';
    case 'Black': return '107, 114, 128';
    case 'Purple': return '139, 92, 246';
    case 'White': return '156, 163, 175';
    default: return '107, 114, 128';
  }
}