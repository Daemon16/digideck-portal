import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Container, Title, Text, Button, Grid, Card, Group, Stack, Badge,
  Modal, TextInput, Textarea, Select, Alert, Center, Loader
} from '@mantine/core';
import { IconPlus, IconEdit, IconTrash, IconDownload, IconCards } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../hooks/useAuth';
import { useUserDecks } from '../hooks/useUserDecks';
import { UserDeck } from '../utils/types';
import DeckBuilder from '../components/DeckBuilder';

export default function MyDecksPage() {
  const { user, profile } = useAuth();
  const { decks, loading, createDeck, updateDeck, deleteDeck } = useUserDecks();
  const [selectedDeck, setSelectedDeck] = useState<UserDeck | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckDescription, setNewDeckDescription] = useState('');

  const handleCreateDeck = async () => {
    if (!newDeckName.trim()) return;
    
    const deck = await createDeck({
      name: newDeckName.trim(),
      description: newDeckDescription.trim(),
      format: 'Standard'
    });
    
    if (deck) {
      setSelectedDeck(deck);
      setIsBuilderOpen(true);
    }
    
    setIsCreateModalOpen(false);
    setNewDeckName('');
    setNewDeckDescription('');
  };

  const exportDeck = async (deck: UserDeck) => {
    const exportArray = ['Exported from digideck-portal'];
    
    deck.cards.forEach(card => {
      for (let i = 0; i < card.quantity; i++) {
        exportArray.push(card.cardNumber || 'UNKNOWN');
      }
    });
    
    const exportText = JSON.stringify(exportArray);
    
    try {
      await navigator.clipboard.writeText(exportText);
      notifications.show({
        title: 'Success!',
        message: 'Deck exported to clipboard',
        color: 'green'
      });
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      notifications.show({
        title: 'Error',
        message: 'Failed to copy to clipboard',
        color: 'red'
      });
    }
  };

  if (!user) {
    return (
      <Container size="xl" pt={80}>
        <Center h={400}>
          <Stack align="center">
            <IconCards size={64} color="gray" />
            <Text c="dimmed" size="lg">Sign in to create and manage your decks</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container size="xl" pt={80}>
        <Center h={400}>
          <Stack align="center">
            <Loader size="lg" color="cyan" />
            <Text c="dimmed" size="lg">Loading your decks...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="xl" pt={80} pb={40}>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Group justify="space-between" mb={32}>
          <Stack gap="xs">
            <Title 
              order={1} 
              size={48}
              style={{
                background: 'linear-gradient(45deg, #00d2d3, #ff6b35)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              My Decks
            </Title>
            <Text c="dimmed" size="lg">
              Build and manage your Digimon TCG decks ({decks.length} decks)
            </Text>
          </Stack>
          
          <Button
            leftSection={<IconPlus size={16} />}
            variant="gradient"
            gradient={{ from: 'cyan', to: 'blue' }}
            size="lg"
            onClick={() => setIsCreateModalOpen(true)}
          >
            New Deck
          </Button>
        </Group>
      </motion.div>

      {decks.length === 0 ? (
        <Center py={80}>
          <Stack align="center" gap="lg">
            <IconCards size={80} color="gray" />
            <Text c="dimmed" size="xl" ta="center">
              No decks yet
            </Text>
            <Text c="dimmed" ta="center">
              Create your first deck to start building!
            </Text>
            <Button
              leftSection={<IconPlus size={16} />}
              variant="gradient"
              gradient={{ from: 'cyan', to: 'blue' }}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create First Deck
            </Button>
          </Stack>
        </Center>
      ) : (
        <Grid>
          {decks.map((deck, index) => (
            <Grid.Col key={deck.id} span={{ base: 12, sm: 6, lg: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card
                  shadow="xl"
                  padding="lg"
                  radius="lg"
                  withBorder
                  h="100%"
                  style={{
                    background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95), rgba(15, 15, 35, 0.95))',
                    border: '2px solid rgba(0, 210, 211, 0.3)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Stack gap="md" h="100%">
                    <Group justify="space-between">
                      <Title order={3} c="white" lineClamp={1}>
                        {deck.name}
                      </Title>
                      <Badge variant="outline" color="cyan">
                        {deck.format}
                      </Badge>
                    </Group>
                    
                    <Text c="dimmed" size="sm" lineClamp={2} style={{ flex: 1 }}>
                      {deck.description || 'No description'}
                    </Text>
                    
                    <Group gap="xs">
                      <Badge variant="light" color="blue">
                        {deck.cards.filter(c => 
                          !(c.form === 'In-Training' || (c.type as string) === 'Digi-Egg' || c.level === 2)
                        ).reduce((sum, card) => sum + card.quantity, 0)} cards
                      </Badge>
                      <Badge variant="light" color="orange">
                        {deck.cards.filter(c => 
                          c.form === 'In-Training' || (c.type as string) === 'Digi-Egg' || c.level === 2
                        ).reduce((sum, card) => sum + card.quantity, 0)} eggs
                      </Badge>
                    </Group>
                    
                    <Text c="dimmed" size="xs">
                      Updated {deck.updatedAt.toLocaleDateString()}
                    </Text>
                    
                    <Group gap="xs" mt="auto">
                      <Button
                        size="xs"
                        variant="light"
                        color="cyan"
                        leftSection={<IconEdit size={14} />}
                        onClick={() => {
                          setSelectedDeck(deck);
                          setIsBuilderOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        variant="light"
                        color="green"
                        leftSection={<IconDownload size={14} />}
                        onClick={() => exportDeck(deck)}
                      >
                        Export
                      </Button>
                      <Button
                        size="xs"
                        variant="light"
                        color="red"
                        leftSection={<IconTrash size={14} />}
                        onClick={() => deleteDeck(deck.id)}
                      >
                        Delete
                      </Button>
                    </Group>
                  </Stack>
                </Card>
              </motion.div>
            </Grid.Col>
          ))}
        </Grid>
      )}

      {/* Create Deck Modal */}
      <Modal
        opened={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Deck"
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
          <TextInput
            label="Deck Name"
            placeholder="Enter deck name"
            value={newDeckName}
            onChange={(e) => setNewDeckName(e.currentTarget.value)}
            required
            styles={{
              label: { color: 'white' },
              input: {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(0, 210, 211, 0.3)',
                color: 'white'
              }
            }}
          />
          
          <Textarea
            label="Description (Optional)"
            placeholder="Describe your deck strategy"
            value={newDeckDescription}
            onChange={(e) => setNewDeckDescription(e.currentTarget.value)}
            rows={3}
            styles={{
              label: { color: 'white' },
              input: {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(0, 210, 211, 0.3)',
                color: 'white'
              }
            }}
          />
          
          <Group justify="flex-end" gap="sm">
            <Button
              variant="subtle"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              gradient={{ from: 'cyan', to: 'blue' }}
              onClick={handleCreateDeck}
              disabled={!newDeckName.trim()}
            >
              Create Deck
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Deck Builder Modal */}
      <Modal
        opened={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        size="xl"
        title={selectedDeck ? `Editing: ${selectedDeck.name}` : 'Deck Builder'}
        centered
        styles={{
          content: {
            background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95), rgba(15, 15, 35, 0.95))',
            border: '2px solid rgba(0, 210, 211, 0.4)',
            backdropFilter: 'blur(15px)'
          },
          header: {
            background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95), rgba(15, 15, 35, 0.95))',
            borderBottom: '1px solid rgba(0, 210, 211, 0.2)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backdropFilter: 'blur(15px)'
          },
          title: { color: 'white', fontWeight: 700 }
        }}
      >
        {selectedDeck && (
          <DeckBuilder
            deck={selectedDeck}
            onSave={(updatedDeck) => {
              updateDeck(updatedDeck);
              setIsBuilderOpen(false);
            }}
            onClose={() => setIsBuilderOpen(false)}
          />
        )}
      </Modal>
    </Container>
  );
}