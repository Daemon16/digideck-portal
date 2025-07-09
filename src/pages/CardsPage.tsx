import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Container,
  Title,
  Text,
  TextInput,
  Select,
  Group,
  Button,
  SegmentedControl,
  Grid,
  Card,
  Badge,
  Image,
  Loader,
  Center,
  Stack,
  Alert,
  Box,
  Modal
} from '@mantine/core';
import { IconSearch, IconFilter, IconGridDots, IconList } from '@tabler/icons-react';
import { useCardsWithPagination } from '../hooks/useCardsWithPagination';
import { useSets } from '../hooks/useSets';
import { useAuth } from '../hooks/useAuth';
import { DigimonCard, DigimonCardType, DigimonColor, CardFilters } from '../utils/types';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

type ViewMode = 'grid' | 'list';

interface CardItemProps {
  card: DigimonCard;
  index: number;
}



export default function CardsPage(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<DigimonCardType | ''>('');
  const [colorFilter, setColorFilter] = useState<DigimonColor | ''>('');
  const [setFilter, setSetFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedCard, setSelectedCard] = useState<DigimonCard | null>(null);
  const { incrementActivity } = useAuth();
  
  // Debounce search term to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 800); // Increased delay to 800ms
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Reset pagination when filters change
  useEffect(() => {
    // This will trigger a new search when filters change
  }, [debouncedSearchTerm, typeFilter, colorFilter, setFilter]);
  
  // Create filters object with all current filter values
  const filters: CardFilters = useMemo(() => ({
    type: typeFilter || undefined,
    color: colorFilter || undefined,
    set: setFilter || undefined,
    searchTerm: debouncedSearchTerm || undefined,
  }), [typeFilter, colorFilter, setFilter, debouncedSearchTerm]);
  
  const { cards, loading, error, pagination, loadMore } = useCardsWithPagination(filters);
  
  // Cards are already filtered by Firebase
  const filteredCards = cards;
  const { sets, loading: setsLoading } = useSets();
  
  const handleLoadMore = useCallback(() => {
    if (pagination.hasMore && !loading) {
      // Store current scroll position
      const scrollPosition = window.scrollY;
      loadMore();
      // Restore scroll position after a brief delay
      setTimeout(() => {
        window.scrollTo(0, scrollPosition);
      }, 50);
    }
  }, [loadMore, pagination.hasMore, loading]);

  // Only show full page loader on initial load, not during search
  if (loading && filteredCards.length === 0 && !debouncedSearchTerm && !typeFilter && !colorFilter && !setFilter) {
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
                <Loader size="lg" color="blue" />
              </motion.div>
              <Text c="dimmed" size="lg">Loading cards...</Text>
            </Stack>
          </motion.div>
        </Center>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" pt={80}>
        <Center h={400}>
          <Stack align="center">
            <Alert color="red" title="Error" styles={{ body: { color: 'white' }, title: { color: 'white' } }}>
              Error loading cards: {error}
            </Alert>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
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
          <Title 
            order={1} 
            size={48}
            style={{
              background: 'linear-gradient(45deg, #00a8ff, #ff6b35)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Card Database
          </Title>
          <Text c="dimmed" size="lg">
            Search through {pagination.total > 0 ? pagination.total : cards.length} live Digimon TCG cards with advanced filters
          </Text>
        </Stack>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Stack mb={32} gap="md">
          <Group align="flex-end">
            <TextInput
              placeholder="Search cards by name or effect..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
              leftSection={<IconSearch size={16} />}
              style={{ flex: 1 }}
              size="md"
            />
            
            <SegmentedControl
              value={viewMode}
              onChange={(value) => setViewMode(value as ViewMode)}
              data={[
                { label: <IconGridDots size={16} />, value: 'grid' },
                { label: <IconList size={16} />, value: 'list' }
              ]}
            />
          </Group>

          <Group>
            <Select
              placeholder="All Types"
              value={typeFilter}
              onChange={(value) => setTypeFilter(value as DigimonCardType | '')}
              data={[
                { value: '', label: 'All Types' },
                { value: 'Digimon', label: 'Digimon' },
                { value: 'Tamer', label: 'Tamer' },
                { value: 'Option', label: 'Option' }
              ]}
              w={150}
              styles={{
                dropdown: {
                  backgroundColor: 'var(--mantine-color-dark-7)',
                  border: '1px solid var(--mantine-color-dark-4)'
                },
                option: {
                  color: 'var(--mantine-color-gray-1)',
                  '&[data-selected]': {
                    backgroundColor: 'var(--mantine-color-blue-6)',
                    color: 'white'
                  },
                  '&[data-hovered]': {
                    backgroundColor: 'var(--mantine-color-dark-5)',
                    color: 'white'
                  }
                }
              }}
            />
            
            <Select
              placeholder="All Colors"
              value={colorFilter}
              onChange={(value) => setColorFilter(value as DigimonColor | '')}
              data={[
                { value: '', label: 'All Colors' },
                { value: 'Red', label: 'Red' },
                { value: 'Blue', label: 'Blue' },
                { value: 'Yellow', label: 'Yellow' },
                { value: 'Green', label: 'Green' },
                { value: 'Black', label: 'Black' },
                { value: 'Purple', label: 'Purple' },
                { value: 'White', label: 'White' }
              ]}
              w={150}
              styles={{
                dropdown: {
                  backgroundColor: 'var(--mantine-color-dark-7)',
                  border: '1px solid var(--mantine-color-dark-4)'
                },
                option: {
                  color: 'var(--mantine-color-gray-1)',
                  '&[data-selected]': {
                    backgroundColor: 'var(--mantine-color-blue-6)',
                    color: 'white'
                  },
                  '&[data-hovered]': {
                    backgroundColor: 'var(--mantine-color-dark-5)',
                    color: 'white'
                  }
                }
              }}
            />
            
            <Select
              placeholder="All Sets"
              value={setFilter}
              onChange={(value) => setSetFilter(value || '')}
              data={[
                { value: '', label: 'All Sets' },
                ...sets.map(set => ({ value: set.code, label: set.name }))
              ]}
              disabled={setsLoading}
              w={150}
              styles={{
                dropdown: {
                  backgroundColor: 'var(--mantine-color-dark-7)',
                  border: '1px solid var(--mantine-color-dark-4)'
                },
                option: {
                  color: 'var(--mantine-color-gray-1)',
                  '&[data-selected]': {
                    backgroundColor: 'var(--mantine-color-blue-6)',
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

      {/* Loading indicator during search */}
      {loading && (debouncedSearchTerm || typeFilter || colorFilter || setFilter) && (
        <Center py={20}>
          <Group>
            <Loader size="sm" color="blue" />
            <Text c="dimmed">Searching cards...</Text>
          </Group>
        </Center>
      )}
      
      {/* Cards Display */}
      {!loading && (
        viewMode === 'grid' ? (
          <Grid>
            {filteredCards.map((card, index) => (
              <Grid.Col key={card.id} span={{ base: 12, xs: 6, sm: 4, md: 3, lg: 2.4 }}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.02 }}
                >
                  <CardGridItem card={card} index={index} onClick={() => {
                    setSelectedCard(card);
                    incrementActivity && incrementActivity('cardsViewed');
                  }} />
                </motion.div>
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <CardsTable cards={filteredCards} />
        )
      )}

      {/* Load More Section */}
      {pagination.hasMore && filteredCards.length > 0 && (
        <Center mt={32}>
          {loading && pagination.page > 1 ? (
            <Group>
              <Loader size="sm" />
              <Text c="dimmed">Loading more cards...</Text>
            </Group>
          ) : (
            <Button
              onClick={handleLoadMore}
              disabled={loading}
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
            >
              Load More ({pagination.total - filteredCards.length} remaining)
            </Button>
          )}
        </Center>
      )}

      {filteredCards.length === 0 && !loading && (
          <Center py={48}>
            <Stack align="center">
              <IconFilter size={48} color="gray" />
              <Text c="dimmed">No cards found matching your criteria</Text>
            </Stack>
          </Center>
        )}
        
        {/* Card Details Modal */}
        <Modal
          opened={!!selectedCard}
          onClose={() => setSelectedCard(null)}
          size="xl"
          title={
            <Group gap="md">
              <Text size="xl" fw={700} c="white">{selectedCard?.name}</Text>
              <Badge 
                variant="gradient" 
                gradient={{ from: 'cyan', to: 'blue' }}
                size="lg"
              >
                {selectedCard?.cardNumber}
              </Badge>
            </Group>
          }
          centered
          styles={{
            content: {
              background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95), rgba(15, 15, 35, 0.95))',
              border: '2px solid rgba(0, 210, 211, 0.4)',
              backdropFilter: 'blur(15px)',
              borderRadius: '16px'
            },
            header: {
              background: 'transparent',
              borderBottom: '1px solid rgba(0, 210, 211, 0.2)',
              paddingBottom: '16px'
            },
            title: {
              color: 'white',
              fontSize: '1.25rem',
              fontWeight: 700
            },
            close: {
              color: 'rgba(0, 210, 211, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(0, 210, 211, 0.1)'
              }
            }
          }}
        >
          {selectedCard && (
            <Grid gutter="xl" mt="md">
              <Grid.Col span={5}>
                <Box 
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 210, 211, 0.1), rgba(255, 107, 53, 0.1))',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(0, 210, 211, 0.2)'
                  }}
                >
                  <Image
                    src={selectedCard.image || `https://via.placeholder.com/300x400?text=${encodeURIComponent(selectedCard.name)}`}
                    alt={selectedCard.name}
                    h={450}
                    fit="contain"
                    fallbackSrc="https://via.placeholder.com/300x400?text=Card"
                    style={{ borderRadius: '8px' }}
                  />
                </Box>
              </Grid.Col>
              <Grid.Col span={7}>
                <Stack gap="lg">
                  <Group>
                    <Badge 
                      variant="gradient"
                      gradient={{ from: getTypeBadgeColor(selectedCard.type), to: 'cyan' }}
                      size="xl"
                      fw={600}
                    >
                      {selectedCard.type}
                    </Badge>
                    <Badge variant="outline" color="orange" size="lg">
                      {selectedCard.rarity}
                    </Badge>
                  </Group>
                  
                  {selectedCard.color && Array.isArray(selectedCard.color) && (
                    <Box>
                      <Text size="md" fw={600} c="cyan" mb="xs">Colors</Text>
                      <Group>
                        {selectedCard.color.map((color) => (
                          <Badge 
                            key={color} 
                            size="md" 
                            variant="gradient"
                            gradient={{ from: 'blue', to: 'purple' }}
                          >
                            {color}
                          </Badge>
                        ))}
                      </Group>
                    </Box>
                  )}
                  
                  {selectedCard.set && Array.isArray(selectedCard.set) && selectedCard.set.length > 0 && (
                    <Box>
                      <Text size="md" fw={600} c="cyan" mb="xs">Sets</Text>
                      <Group>
                        {selectedCard.set.map((setName, index) => (
                          <Badge 
                            key={index} 
                            size="md" 
                            variant="outline" 
                            color="teal"
                          >
                            {setName}
                          </Badge>
                        ))}
                      </Group>
                    </Box>
                  )}
                  
                  {selectedCard.effects && (
                    <Box>
                      <Text size="md" fw={600} c="cyan" mb="xs">Effects</Text>
                      <Box 
                        p="md" 
                        style={{
                          background: 'rgba(0, 210, 211, 0.05)',
                          border: '1px solid rgba(0, 210, 211, 0.2)',
                          borderRadius: '8px'
                        }}
                      >
                        <Text size="sm" c="white" lh={1.5}>
                          {selectedCard.effects}
                        </Text>
                      </Box>
                    </Box>
                  )}
                  
                  {selectedCard.keywords && selectedCard.keywords.length > 0 && (
                    <Box>
                      <Text size="md" fw={600} c="cyan" mb="xs">Keywords</Text>
                      <Group>
                        {selectedCard.keywords.map((keyword) => (
                          <Badge 
                            key={keyword} 
                            size="md" 
                            variant="gradient"
                            gradient={{ from: 'orange', to: 'red' }}
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </Group>
                    </Box>
                  )}
                </Stack>
              </Grid.Col>
            </Grid>
          )}
        </Modal>
    </Container>
  );
}



function CardGridItem({ card, index, onClick }: CardItemProps & { onClick?: () => void }): JSX.Element {
  const [imageError, setImageError] = useState(false);
  
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotateY: 5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card 
        shadow="xl" 
        padding="lg" 
        radius="lg" 
        withBorder
        h="100%"
        onClick={onClick}
        style={{
          background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95), rgba(15, 15, 35, 0.95))',
          border: '2px solid rgba(0, 210, 211, 0.3)',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Card.Section mb="md">
          <Box style={{ aspectRatio: '3/4', position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
            {!imageError && card.image ? (
              <motion.div 
                whileHover={{ scale: 1.05 }}
                style={{ height: '100%', width: '100%' }}
              >
                <Image
                  src={card.image}
                  alt={card.name}
                  h="100%"
                  w="100%"
                  fit="cover"
                  onError={() => setImageError(true)}
                  style={{ borderRadius: '8px' }}
                />
              </motion.div>
            ) : (
              <Stack align="center" justify="center" h="100%" p="lg" gap="md">
                <Text size="2xl">🃏</Text>
                <Text c="white" fw={700} size="md" ta="center" lh={1.3}>{card.name}</Text>
                <Text c="dimmed" size="sm">{card.cardNumber}</Text>
              </Stack>
            )}
          </Box>
        </Card.Section>
        
        <Stack gap="md">
          <Title order={5} c="white" lineClamp={2} lh={1.2}>
            {card.name}
          </Title>
          
          <Group justify="space-between">
            <Badge 
              color={getTypeBadgeColor(card.type)} 
              variant="gradient"
              gradient={{ from: getTypeBadgeColor(card.type), to: 'cyan' }}
              size="md"
              fw={600}
            >
              {card.type}
            </Badge>
            <Text c="dimmed" size="sm" fw={500}>{card.rarity}</Text>
          </Group>
          
          <Text c="dimmed" size="sm" lineClamp={3} lh={1.4}>
            {card.effects}
          </Text>
        </Stack>
      </Card>
    </motion.div>
  );
}

const columnHelper = createColumnHelper<DigimonCard>();

function CardsTable({ cards }: { cards: DigimonCard[] }): JSX.Element {
  const columns = useMemo(
    () => [
      columnHelper.accessor('image', {
        id: 'image',
        header: '',
        cell: (info) => <CardImage card={info.row.original} />,
        size: 80,
      }),
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => (
          <div>
            <div className="font-bold text-white">{info.getValue()}</div>
            <div className="text-xs text-gray-400">{info.row.original.cardNumber}</div>
          </div>
        ),
      }),
      columnHelper.accessor('type', {
        header: 'Type',
        cell: (info) => (
          <Badge color={getTypeBadgeColor(info.getValue())} variant="light" size="sm">
            {info.getValue()}
          </Badge>
        ),
        size: 100,
      }),
      columnHelper.accessor('color', {
        header: 'Color',
        cell: (info) => {
          const colors = info.getValue();
          const colorArray = Array.isArray(colors) ? colors : [];
          return (
            <div className="flex flex-wrap gap-1">
              {colorArray.map((color) => (
                <span key={color} className="text-xs text-gray-300">
                  {color}
                </span>
              ))}
            </div>
          );
        },
        size: 100,
      }),
      columnHelper.accessor('rarity', {
        header: 'Rarity',
        cell: (info) => <span className="text-sm text-gray-400">{info.getValue()}</span>,
        size: 100,
      }),
      columnHelper.accessor('set', {
        header: 'Set',
        cell: (info) => (
          <div className="flex flex-wrap gap-1">
            {(info.getValue() || []).map((setName, index) => (
              <span key={index} className="text-xs text-gray-400">
                {setName}
              </span>
            ))}
          </div>
        ),
        size: 120,
      }),
      columnHelper.accessor('effects', {
        header: 'Effects',
        cell: (info) => (
          <div>
            <p className="text-sm text-gray-400 line-clamp-2 mb-2">{info.getValue()}</p>
            {(info.row.original.keywords?.length || 0) > 0 && (
              <div className="flex flex-wrap gap-1">
                {(info.row.original.keywords || []).slice(0, 3).map((keyword) => (
                  <span
                    key={keyword}
                    className="px-2 py-1 bg-digi-blue/20 text-digi-blue text-xs rounded"
                  >
                    {keyword}
                  </span>
                ))}
                {(info.row.original.keywords?.length || 0) > 3 && (
                  <span className="text-xs text-gray-500">+{(info.row.original.keywords?.length || 0) - 3}</span>
                )}
              </div>
            )}
          </div>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: cards,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-digi-gray">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="text-left p-4 text-gray-300 font-medium"
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, index) => (
            <motion.tr
              key={row.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.02 }}
              className="border-b border-digi-gray/30 hover:bg-digi-gray/20 transition-colors"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CardImage({ card }: { card: DigimonCard }): JSX.Element {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className="w-16 h-20 bg-digi-gray rounded-lg overflow-hidden flex items-center justify-center">
      {!imageError && card.image ? (
        <img
          src={card.image}
          alt={card.name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="text-center">
          <div className="text-lg">🃏</div>
        </div>
      )}
    </div>
  );
}

function CardSkeleton(): JSX.Element {
  return (
    <div className="digi-card animate-pulse">
      <div className="aspect-[3/4] bg-gray-700 rounded-lg mb-3"></div>
      <div className="h-4 bg-gray-700 rounded mb-2"></div>
      <div className="flex justify-between mb-2">
        <div className="h-3 bg-gray-700 rounded w-16"></div>
        <div className="h-3 bg-gray-700 rounded w-12"></div>
      </div>
      <div className="h-3 bg-gray-700 rounded w-full"></div>
    </div>
  );
}

function TableSkeleton(): JSX.Element {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-digi-gray">
            <th className="p-4"><div className="h-4 bg-gray-700 rounded w-12"></div></th>
            <th className="p-4"><div className="h-4 bg-gray-700 rounded w-16"></div></th>
            <th className="p-4"><div className="h-4 bg-gray-700 rounded w-12"></div></th>
            <th className="p-4"><div className="h-4 bg-gray-700 rounded w-16"></div></th>
            <th className="p-4"><div className="h-4 bg-gray-700 rounded w-12"></div></th>
            <th className="p-4"><div className="h-4 bg-gray-700 rounded w-8"></div></th>
            <th className="p-4"><div className="h-4 bg-gray-700 rounded w-24"></div></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-b border-digi-gray/30 animate-pulse">
              <td className="p-4"><div className="w-16 h-20 bg-gray-700 rounded"></div></td>
              <td className="p-4"><div className="h-4 bg-gray-700 rounded w-24"></div></td>
              <td className="p-4"><div className="h-6 bg-gray-700 rounded w-16"></div></td>
              <td className="p-4"><div className="h-4 bg-gray-700 rounded w-12"></div></td>
              <td className="p-4"><div className="h-4 bg-gray-700 rounded w-16"></div></td>
              <td className="p-4"><div className="h-4 bg-gray-700 rounded w-8"></div></td>
              <td className="p-4"><div className="h-4 bg-gray-700 rounded w-32"></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getTypeBadgeColor(type: DigimonCardType): string {
  switch (type) {
    case 'Digimon':
      return 'blue';
    case 'Tamer':
      return 'orange';
    case 'Option':
      return 'violet';
    default:
      return 'gray';
  }
}