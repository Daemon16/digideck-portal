import { Card, Badge, Group, Text, Image, Grid, Container, Title, Stack } from '@mantine/core';
import { TournamentDeck } from '../utils/types';

interface DeckDetailsProps {
  deck: TournamentDeck;
}

export function DeckDetails({ deck }: DeckDetailsProps) {
  const totalCards = deck.cards.reduce((sum, card) => sum + card.quantity, 0);
  
  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Deck Header */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mb="xs">
            <Title order={2} className="text-digi-blue">{deck.name}</Title>
            <Badge color="yellow" size="lg">#{deck.placement}</Badge>
          </Group>
          
          <Group gap="md" mb="md">
            <Text size="sm" c="dimmed">Player: <Text span fw={500}>{deck.player}</Text></Text>
            <Text size="sm" c="dimmed">Region: <Text span fw={500}>{deck.region}</Text></Text>
            <Text size="sm" c="dimmed">Tournament: <Text span fw={500}>{deck.tournament}</Text></Text>
          </Group>
          
          <Group gap="xs">
            {deck.colors.map((color) => (
              <Badge key={color} variant="light" color={getColorBadge(color)}>
                {color}
              </Badge>
            ))}
            <Badge variant="outline">{totalCards} cards</Badge>
          </Group>
        </Card>

        {/* Cards Grid */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={3} mb="lg" className="text-digi-purple">
            Deck Cards ({deck.cards.length} unique)
          </Title>
          
          <Grid>
            {deck.cards.map((card, index) => (
              <Grid.Col key={`${card.cardId}-${index}`} span={{ base: 6, sm: 4, md: 3, lg: 2 }}>
                <Card 
                  shadow="xs" 
                  padding="sm" 
                  radius="md" 
                  withBorder
                  className="digi-card hover:scale-105 transition-transform duration-200"
                >
                  <Card.Section>
                    <div className="relative">
                      <Image
                        src={card.image}
                        alt={card.name}
                        height={200}
                        fit="cover"
                        fallbackSrc="/placeholder-card.png"
                      />
                      <Badge
                        className="absolute top-2 right-2 digi-glow"
                        color="orange"
                        size="lg"
                        variant="filled"
                      >
                        x{card.quantity}
                      </Badge>
                    </div>
                  </Card.Section>
                  
                  <Text 
                    fw={500} 
                    size="sm" 
                    mt="sm" 
                    ta="center"
                    className="text-digi-blue"
                  >
                    {card.name}
                  </Text>
                  
                  <Badge
                    variant="light"
                    color={(card.type as string) === 'Digitama' ? 'green' : 'blue'}
                    size="xs"
                    mt="xs"
                    fullWidth
                  >
                    {card.type}
                  </Badge>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Card>

        {/* Deck Breakdown */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={4} mb="md" className="text-digi-green">
                Main Deck ({deck.mainDeck.length})
              </Title>
              <Stack gap="xs">
                {deck.mainDeck.map((card, index) => (
                  <Group key={`main-${card.cardId}-${index}`} justify="space-between">
                    <Text size="sm">{card.name}</Text>
                    <Badge size="sm" variant="outline">x{card.quantity}</Badge>
                  </Group>
                ))}
              </Stack>
            </Card>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={4} mb="md" className="text-digi-orange">
                Egg Deck ({deck.eggDeck.length})
              </Title>
              <Stack gap="xs">
                {deck.eggDeck.map((card, index) => (
                  <Group key={`egg-${card.cardId}-${index}`} justify="space-between">
                    <Text size="sm">{card.name}</Text>
                    <Badge size="sm" variant="outline">x{card.quantity}</Badge>
                  </Group>
                ))}
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}

function getColorBadge(color: string): string {
  const colorMap: Record<string, string> = {
    'Red': 'red',
    'Blue': 'blue',
    'Yellow': 'yellow',
    'Green': 'green',
    'Black': 'dark',
    'Purple': 'violet',
    'White': 'gray'
  };
  return colorMap[color] || 'gray';
}