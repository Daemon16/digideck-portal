import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Grid,
  Card,
  Group,
  Stack,
  Badge,
  Select,
  Loader,
  Center,
  Image,
  Box,
  Button,
} from '@mantine/core';
import { IconTrophy, IconCalendar, IconMapPin, IconUsers, IconArrowLeft } from '@tabler/icons-react';
import { useMetaSets, useSetDecks, useSetStats } from '../hooks/useFirestore';
import { useAuth } from '../hooks/useAuth';
import { MetaSet, SetDeck } from '../utils/types';

export default function MetaPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSet, setSelectedSet] = useState<MetaSet | null>(null);
  const [regionFilter, setRegionFilter] = useState('');
  const { incrementActivity } = useAuth();
  
  // Handle navigation state from DeckDetailsPage
  useEffect(() => {
    if (location.state?.selectedSet) {
      setSelectedSet(location.state.selectedSet);
      // Clear the state to prevent issues on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  
  const { data: metaSets, loading: setsLoading } = useMetaSets();
  const { data: decks, loading: decksLoading, hasMore, loadMore } = useSetDecks(selectedSet, {
    region: regionFilter || undefined,
    limit: 12,
  });
  
  const { stats, loading: statsLoading } = useSetStats(selectedSet, {
    region: regionFilter || undefined,
  });
  
  const [initialLoad, setInitialLoad] = useState(true);
  
  useEffect(() => {
    if (!decksLoading && decks.length > 0) {
      setInitialLoad(false);
    }
  }, [decksLoading, decks.length]);
  
  const handleLoadMore = useCallback(() => {
    if (hasMore && !decksLoading) {
      loadMore();
    }
  }, [loadMore, hasMore, decksLoading]);

  // Sort only for recent results (small subset)
  const recentDecks = React.useMemo(() => {
    return [...decks].sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      return dateB - dateA;
    }).slice(0, 8);
  }, [decks]);
  
  // Show set selection if no set is selected
  if (!selectedSet) {
    return (
      <Container size="xl" pt={80} pb={40}>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Stack mb={32}>
            <Title 
              order={1} 
              size={48}
              style={{
                background: 'linear-gradient(45deg, #00a8ff, #ff6b35)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Meta Analysis
            </Title>
            <Text c="dimmed" size="lg">
              Select a tournament set to analyze deck performance and meta trends
            </Text>
          </Stack>
        </motion.div>

        {setsLoading ? (
          <Center h={400}>
            <Stack align="center">
              <Loader size="lg" color="orange" />
              <Text c="dimmed" size="lg">Loading tournament sets...</Text>
            </Stack>
          </Center>
        ) : (
          <Grid>
            {metaSets.map((set, index) => (
              <Grid.Col key={set.id} span={{ base: 12, sm: 6, md: 4 }}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <SetCard set={set} onClick={() => setSelectedSet(set)} />
                </motion.div>
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Container>
    );
  }

  if (initialLoad && decksLoading) {
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
              <Text c="dimmed" size="lg">Loading tournament data...</Text>
            </Stack>
          </motion.div>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="xl" pt={80} pb={40}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Stack mb={32}>
          <Group>
            <Button 
              variant="subtle" 
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => setSelectedSet(null)}
            >
              Back to Sets
            </Button>
          </Group>
          <Title 
            order={1} 
            size={48}
            style={{
              background: 'linear-gradient(45deg, #00a8ff, #ff6b35)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {selectedSet.name}
          </Title>
          <Text c="dimmed" size="lg">
            Tournament results and deck performance analysis
          </Text>
        </Stack>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Group mb={32}>
          <Select
            value={regionFilter}
            onChange={(value) => setRegionFilter(value || '')}
            placeholder="All Regions"
            data={[
              { value: '', label: 'All Regions' },
              { value: 'JP', label: 'Japan' },
              { value: 'US', label: 'USA' },
              { value: 'EU', label: 'Europe' },
              { value: 'AS', label: 'Asia' }
            ]}
            w={200}
            styles={{
              dropdown: {
                backgroundColor: 'white',
                border: '1px solid #ccc'
              },
              option: {
                color: 'black',
                '&[data-selected]': {
                  backgroundColor: '#007bff',
                  color: 'white'
                },
                '&[data-hovered]': {
                  backgroundColor: '#f8f9fa',
                  color: 'black'
                }
              }
            }}
          />
        </Group>
      </motion.div>

      {/* Stats Overview */}
      <Grid mb={32}>
        {[
          { icon: IconTrophy, value: stats.totalDecks, label: 'Tournament Decks', color: 'orange', delay: 0.3 },
          { icon: IconUsers, value: stats.totalArchetypes, label: 'Active Archetypes', color: 'blue', delay: 0.4 },
          { icon: IconCalendar, value: stats.totalTournaments, label: 'Tournaments', color: 'violet', delay: 0.5 },
          { icon: IconMapPin, value: stats.totalRegions, label: 'Regions', color: 'green', delay: 0.6 }
        ].map((stat, index) => (
          <Grid.Col key={index} span={{ base: 12, sm: 6, md: 3 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stat.delay, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card 
                shadow="xl" 
                padding="lg" 
                radius="md" 
                withBorder
                ta="center"
                style={{
                  background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.9), rgba(15, 15, 35, 0.9))',
                  border: `1px solid rgba(${stat.color === 'orange' ? '255, 107, 53' : stat.color === 'blue' ? '0, 168, 255' : stat.color === 'violet' ? '139, 92, 246' : '34, 197, 94'}, 0.3)`,
                  boxShadow: `0 8px 32px rgba(${stat.color === 'orange' ? '255, 107, 53' : stat.color === 'blue' ? '0, 168, 255' : stat.color === 'violet' ? '139, 92, 246' : '34, 197, 94'}, 0.1)`
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                >
                  <stat.icon size={32} color={stat.color} style={{ margin: '0 auto 12px' }} />
                </motion.div>
                <Text size="xl" fw={700} c="white">{stat.value}</Text>
                <Text c="dimmed" size="sm">{stat.label}</Text>
              </Card>
            </motion.div>
          </Grid.Col>
        ))}
      </Grid>

      <Grid mb={32}>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Card 
              shadow="xl" 
              padding="lg" 
              radius="md" 
              withBorder
              style={{
                background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.9), rgba(15, 15, 35, 0.9))',
                border: '1px solid rgba(255, 107, 53, 0.3)',
                boxShadow: '0 8px 32px rgba(255, 107, 53, 0.1)'
              }}
            >
              <Group mb="lg">
                <IconTrophy size={24} color="orange" />
                <Title order={3} c="white">Top Archetypes</Title>
              </Group>
              
              <Stack gap="md">
                {stats.topArchetypes.slice(0, 8).map((archetype, index) => (
                  <motion.div
                    key={archetype.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <Group justify="space-between">
                      <Group>
                        <Badge 
                          variant="gradient" 
                          gradient={{ from: 'blue', to: 'violet' }}
                          size="lg"
                          circle
                        >
                          {index + 1}
                        </Badge>
                        <Text c="white" fw={500}>{archetype.name}</Text>
                      </Group>
                      <Stack gap={2} align="flex-end">
                        <Text c="blue" fw={700}>
                          {archetype.count}x
                        </Text>
                        <Text c="dimmed" size="sm">used</Text>
                      </Stack>
                    </Group>
                  </motion.div>
                ))}
              </Stack>
            </Card>
          </motion.div>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 6 }}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
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
              <Group mb="lg">
                <IconCalendar size={24} color="blue" />
                <Title order={3} c="white">Recent Results</Title>
              </Group>
              
              <Stack gap="md">
                {recentDecks.map((deck, index) => (
                  <motion.div
                    key={deck.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <DeckResultItem deck={deck} />
                  </motion.div>
                ))}
              </Stack>
            </Card>
          </motion.div>
        </Grid.Col>
      </Grid>

      {/* All Tournament Decks */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <Title order={2} c="white" mb="lg">Tournament Decks</Title>
        
        <Grid>
          {decks.map((deck, index) => (
            <Grid.Col key={deck.id} span={{ base: 12, sm: 6, md: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + index * 0.05, duration: 0.4 }}
              >
                <DeckCard deck={deck} index={index} />
              </motion.div>
            </Grid.Col>
          ))}
          
        </Grid>
        
        {/* Loading indicator for Load More */}
        {decksLoading && (
          <Center mt={32}>
            <Stack align="center">
              <Loader size="lg" color="orange" />
              <Text c="dimmed" size="sm">Loading more decks...</Text>
            </Stack>
          </Center>
        )}
        
        {/* Load More Section */}
        {hasMore && decks.length > 0 && (
          <Center mt={32}>
            <Button
              onClick={handleLoadMore}
              disabled={decksLoading}
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
            >
              Load More Decks
            </Button>
          </Center>
        )}
      </motion.div>
    </Container>
  );
}

function getTopArchetypes(decks: any[]) {
  const archetypeStats: Record<string, { count: number }> = {};
  
  decks.forEach(deck => {
    if (!archetypeStats[deck.archetype]) {
      archetypeStats[deck.archetype] = { count: 0 };
    }
    archetypeStats[deck.archetype].count++;
  });
  
  return Object.entries(archetypeStats)
    .map(([name, stats]) => ({
      name,
      count: stats.count,
    }))
    .sort((a, b) => b.count - a.count);
}

function getUniqueTournaments(decks: any[]) {
  const tournaments = new Set();
  decks.forEach(deck => {
    if (deck.tournament) {
      tournaments.add(deck.tournament);
    }
  });
  return Array.from(tournaments);
}

function getUniqueRegions(decks: any[]) {
  const regions = new Set();
  decks.forEach(deck => {
    if (deck.region) {
      regions.add(deck.region);
    }
  });
  return Array.from(regions);
}

function formatDate(date: any): string {
  if (!date) return 'N/A';
  
  try {
    // Handle Firebase Timestamp
    if (date.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString();
    }
    // Handle Date object
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    // Handle string date
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString();
    }
    // Handle timestamp number
    if (typeof date === 'number') {
      return new Date(date).toLocaleDateString();
    }
  } catch (error) {
    console.error('Date formatting error:', error);
  }
  
  return 'N/A';
}

function DeckCard({ deck, index }: { deck: any; index: number }) {
  const navigate = useNavigate();
  const firstCardImage = deck.cards && deck.cards.length > 0 ? deck.cards[0].image : null;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, rotateY: 5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card 
        shadow="xl" 
        padding="md" 
        radius="md" 
        withBorder
        style={{
          background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.9), rgba(15, 15, 35, 0.9))',
          border: '1px solid rgba(255, 107, 53, 0.2)',
          cursor: 'pointer',
          height: '100%'
        }}
        onClick={() => {
          navigate(`/deck/${deck.id}`);
          incrementActivity && incrementActivity('decksAnalyzed');
        }}
      >
        {/* Card Image */}
        <Card.Section>
          <Box style={{ aspectRatio: '3/4', position: 'relative', overflow: 'hidden' }}>
            {firstCardImage ? (
              <motion.div 
                whileHover={{ scale: 1.1 }}
                style={{ height: '100%', width: '100%' }}
              >
                <Image
                  src={firstCardImage}
                  alt={deck.archetype}
                  h="100%"
                  w="100%"
                  fit="cover"
                />
              </motion.div>
            ) : (
              <Stack align="center" justify="center" h="100%" style={{ background: 'rgba(26, 26, 46, 0.5)' }}>
                <Text size="xl">🃏</Text>
              </Stack>
            )}
          </Box>
        </Card.Section>
        
        <Group justify="space-between" mt="md" mb="xs">
          <Badge 
            variant={deck.placement === 1 ? 'filled' : 'light'}
            color={deck.placement === 1 ? 'yellow' : deck.placement <= 4 ? 'blue' : 'gray'}
            size="sm"
          >
            #{deck.placement}
          </Badge>
          <Text c="dimmed" size="sm">{deck.region}</Text>
        </Group>
        
        <Title order={4} c="white" mb={4}>{deck.archetype}</Title>
        <Text c="dimmed" size="sm" mb="xs">by {deck.player}</Text>
        
        <Text c="dimmed" size="xs" mb="md">
          {deck.tournament}
        </Text>
        
        <Group justify="space-between">
          <Text c="dimmed" size="xs">{deck.totalCards || 50} cards</Text>
          <Text c="dimmed" size="xs">
            {formatDate(deck.date)}
          </Text>
        </Group>
      </Card>
    </motion.div>
  );
}

function DeckSkeleton() {
  return (
    <Card 
      shadow="xl" 
      padding="md" 
      radius="md" 
      withBorder
      style={{
        background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.9), rgba(15, 15, 35, 0.9))',
        border: '1px solid rgba(255, 107, 53, 0.2)',
        height: '100%'
      }}
    >
      <Card.Section>
        <Box style={{ aspectRatio: '3/4', position: 'relative', overflow: 'hidden' }}>
          <div className="animate-pulse bg-gray-700 h-full w-full" />
        </Box>
      </Card.Section>
      
      <Group justify="space-between" mt="md" mb="xs">
        <div className="animate-pulse bg-gray-700 h-6 w-12 rounded" />
        <div className="animate-pulse bg-gray-700 h-4 w-16 rounded" />
      </Group>
      
      <div className="animate-pulse bg-gray-700 h-6 w-32 rounded mb-2" />
      <div className="animate-pulse bg-gray-700 h-4 w-24 rounded mb-2" />
      <div className="animate-pulse bg-gray-700 h-3 w-40 rounded mb-4" />
      
      <Group justify="space-between">
        <div className="animate-pulse bg-gray-700 h-3 w-16 rounded" />
        <div className="animate-pulse bg-gray-700 h-3 w-20 rounded" />
      </Group>
    </Card>
  );
}

function SetCard({ set, onClick }: { set: MetaSet; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, rotateY: 5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card 
        shadow="xl" 
        padding="lg" 
        radius="md" 
        withBorder
        style={{
          background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.9), rgba(15, 15, 35, 0.9))',
          border: '1px solid rgba(0, 168, 255, 0.3)',
          cursor: 'pointer',
          height: '100%'
        }}
        onClick={onClick}
      >
        <Stack align="center" gap="md">
          <Box 
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #00a8ff, #ff6b35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <IconTrophy size={40} color="white" />
          </Box>
          
          <Stack align="center" gap="xs">
            <Title order={4} c="white" ta="center">{set.name}</Title>
            <Text c="dimmed" size="sm">{set.totalDecks} tournament decks</Text>
            <Badge variant="light" color="blue">
              {formatDate(set.createdAt)}
            </Badge>
          </Stack>
        </Stack>
      </Card>
    </motion.div>
  );
}

function DeckResultItem({ deck }: { deck: any }) {
  const navigate = useNavigate();
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        navigate(`/deck/${deck.id}`);
        incrementActivity && incrementActivity('decksAnalyzed');
      }}
      style={{ cursor: 'pointer' }}
    >
      <Group justify="space-between" p="sm" style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Group>
          <Badge 
            variant="gradient" 
            gradient={{
              from: deck.placement === 1 ? 'yellow' : deck.placement <= 4 ? 'blue' : 'gray',
              to: deck.placement === 1 ? 'orange' : deck.placement <= 4 ? 'cyan' : 'dark'
            }}
            size="lg"
          >
            #{deck.placement}
          </Badge>
          <Stack gap={2}>
            <Text c="white" fw={500} size="sm">{deck.archetype}</Text>
            <Group gap={8}>
              <Text c="dimmed" size="xs">{deck.player}</Text>
              <Text c="dimmed" size="xs">•</Text>
              <Text c="dimmed" size="xs">{deck.region}</Text>
            </Group>
          </Stack>
        </Group>
        <Text c="dimmed" size="xs">
          {formatDate(deck.date)}
        </Text>
      </Group>
    </motion.div>
  );
}