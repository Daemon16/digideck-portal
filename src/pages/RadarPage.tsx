import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container, Title, Text, Select, Group, Loader, Center, Stack, Grid, Card, Badge, Progress, Box } from '@mantine/core';
import { IconRadar, IconMapPin, IconTarget } from '@tabler/icons-react';
import { useMetaSets, useSetDecks } from '../hooks/useSupabaseFirestore';
import { MetaSet } from '../utils/types';

const COLORS = ['#00d2d3', '#ff6b35', '#8b5cf6', '#fbbf24', '#ef4444', '#10b981'];

export default function RadarPage() {
  const [selectedSet, setSelectedSet] = useState<MetaSet | null>(null);
  const { data: metaSets, loading: setsLoading } = useMetaSets();
  const { data: decks, loading: decksLoading } = useSetDecks(selectedSet || undefined, { limit: 1000 });
  
  useEffect(() => {
    if (!selectedSet && metaSets.length > 0) {
      setSelectedSet(metaSets[0]);
    }
  }, [metaSets, selectedSet]);

  const regionalData = getRegionalMetaBreakdown(decks);
  
  if (setsLoading) {
    return (
      <Container size="xl" pt={80}>
        <Center h={400}>
          <Stack align="center">
            <Loader size="lg" color="cyan" />
            <Text c="dimmed" size="lg">Loading tournament sets...</Text>
          </Stack>
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
            <IconRadar size={48} color="#00d2d3" />
            <Title 
              order={1} 
              size={48}
              style={{
                background: 'linear-gradient(45deg, #00d2d3, #ff6b35)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Meta Radar
            </Title>
          </Group>
          <Text c="dimmed" size="lg">
            Regional meta breakdown and archetype dominance analysis
          </Text>
          
          {/* Set Selection */}
          <Group mt="lg">
            <Select
              value={selectedSet?.id || ''}
              onChange={(value) => {
                const set = metaSets.find(s => s.id === value);
                setSelectedSet(set || null);
              }}
              data={metaSets.map(set => ({ value: set.id, label: set.name }))}
              placeholder="Select tournament set"
              w={400}
              styles={{
                dropdown: {
                  backgroundColor: 'var(--mantine-color-dark-7)',
                  border: '1px solid var(--mantine-color-dark-4)'
                },
                option: {
                  color: 'var(--mantine-color-gray-1)',
                  '&[data-selected]': {
                    backgroundColor: 'var(--mantine-color-cyan-6)',
                    color: 'white'
                  },
                  '&[data-hovered]': {
                    backgroundColor: 'var(--mantine-color-dark-5)',
                    color: 'white'
                  }
                }
              }}
            />
          </Group>
        </Stack>
      </motion.div>

      {decksLoading ? (
        <Center h={300}>
          <Stack align="center">
            <Loader size="lg" color="orange" />
            <Text c="dimmed">Scanning regional meta...</Text>
          </Stack>
        </Center>
      ) : !selectedSet ? (
        <Center h={300}>
          <Text c="dimmed" size="lg">Select a tournament set to analyze regional meta</Text>
        </Center>
      ) : (
        <Grid>
          {regionalData.map((region, index) => (
            <Grid.Col key={region.region} span={{ base: 12, md: 6, lg: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <RegionCard region={region} color={COLORS[index % COLORS.length]} />
              </motion.div>
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Container>
  );
}

function RegionCard({ region, color }: { region: any; color: string }) {
  return (
    <Card
      shadow="xl"
      padding="lg"
      radius="lg"
      withBorder
      h="100%"
      style={{
        background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95), rgba(15, 15, 35, 0.95))',
        border: `2px solid ${color}40`,
        backdropFilter: 'blur(10px)'
      }}
    >
      <Stack gap="md">
        {/* Region Header */}
        <Group justify="space-between">
          <Group>
            <IconMapPin size={24} color={color} />
            <Title order={3} c="white">{region.region}</Title>
          </Group>
          <Badge 
            variant="gradient" 
            gradient={{ from: color, to: 'cyan' }}
            size="lg"
          >
            {region.totalDecks} decks
          </Badge>
        </Group>

        {/* Dominance Indicator */}
        <Box>
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">Regional Dominance</Text>
            <Text size="sm" c={color} fw={600}>
              {region.dominancePercentage}%
            </Text>
          </Group>
          <Progress 
            value={region.dominancePercentage} 
            color={color}
            size="lg"
            radius="xl"
            style={{
              background: 'rgba(255, 255, 255, 0.1)'
            }}
          />
        </Box>

        {/* Top Archetypes */}
        <Box>
          <Group mb="md">
            <IconTarget size={20} color={color} />
            <Text size="md" fw={600} c={color}>Top Archetypes</Text>
          </Group>
          
          <Stack gap="sm">
            {region.topArchetypes.slice(0, 5).map((archetype: any, index: number) => (
              <Group key={archetype.name} justify="space-between">
                <Group>
                  <Badge 
                    size="sm" 
                    variant="outline" 
                    color={color}
                    style={{ minWidth: '24px' }}
                  >
                    {index + 1}
                  </Badge>
                  <Text c="white" size="sm" fw={500}>
                    {archetype.name}
                  </Text>
                </Group>
                <Group gap="xs">
                  <Text c={color} size="sm" fw={600}>
                    {archetype.count}
                  </Text>
                  <Text c="dimmed" size="xs">
                    ({archetype.percentage}%)
                  </Text>
                </Group>
              </Group>
            ))}
          </Stack>
        </Box>

        {/* Regional Stats */}
        <Group justify="space-between" pt="md" style={{ borderTop: `1px solid ${color}20` }}>
          <Stack gap={2} align="center">
            <Text c={color} fw={700} size="lg">{region.firstPlaceWins}</Text>
            <Text c="dimmed" size="xs">1st Place Wins</Text>
          </Stack>
          <Stack gap={2} align="center">
            <Text c={color} fw={700} size="lg">{region.topFinishes}</Text>
            <Text c="dimmed" size="xs">Top 4 Finishes</Text>
          </Stack>
          <Stack gap={2} align="center">
            <Text c={color} fw={700} size="lg">{region.uniqueArchetypes}</Text>
            <Text c="dimmed" size="xs">Unique Archetypes</Text>
          </Stack>
        </Group>
      </Stack>
    </Card>
  );
}

function getRegionalMetaBreakdown(decks: any[]) {
  if (!decks.length) return [];

  const regionStats: Record<string, {
    decks: any[];
    archetypes: Record<string, number>;
    placements: number[];
    topFinishes: number;
    firstPlaceWins: number;
  }> = {};

  // Group decks by region
  decks.forEach(deck => {
    const region = deck.region || 'Unknown';
    
    if (!regionStats[region]) {
      regionStats[region] = {
        decks: [],
        archetypes: {},
        placements: [],
        topFinishes: 0,
        firstPlaceWins: 0
      };
    }

    regionStats[region].decks.push(deck);
    regionStats[region].archetypes[deck.archetype] = (regionStats[region].archetypes[deck.archetype] || 0) + 1;
    regionStats[region].placements.push(deck.placement);
    
    if (deck.placement === 1) {
      regionStats[region].firstPlaceWins++;
    }
    
    if (deck.placement <= 4) {
      regionStats[region].topFinishes++;
    }
  });

  // Calculate regional breakdown
  return Object.entries(regionStats)
    .map(([region, stats]) => {
      const totalDecks = stats.decks.length;
      const dominancePercentage = Math.round((totalDecks / decks.length) * 100);
      
      const topArchetypes = Object.entries(stats.archetypes)
        .map(([name, count]) => ({
          name,
          count,
          percentage: Math.round((count / totalDecks) * 100)
        }))
        .sort((a, b) => b.count - a.count);

      return {
        region,
        totalDecks,
        dominancePercentage,
        firstPlaceWins: stats.firstPlaceWins,
        topFinishes: stats.topFinishes,
        uniqueArchetypes: Object.keys(stats.archetypes).length,
        topArchetypes
      };
    })
    .sort((a, b) => b.totalDecks - a.totalDecks);
}