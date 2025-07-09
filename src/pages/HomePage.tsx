import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Title,
  Text,
  Grid,
  Card,
  Group,
  Stack,
  Button,
  Box
} from '@mantine/core';
import { 
  IconSearch, 
  IconTrendingUp, 
  IconChartBar, 
  IconRadar, 
  IconBolt, 
  IconSettings,
  IconArrowRight 
} from '@tabler/icons-react';

const features = [
  {
    icon: IconSearch,
    title: 'Card Database',
    description: 'Search through live Digimon TCG card data with advanced filters',
    path: '/cards',
    gradient: { from: 'blue', to: 'green' }
  },
  {
    icon: IconTrendingUp,
    title: 'Meta Analysis',
    description: 'Real tournament decks and results from competitive play',
    path: '/meta',
    gradient: { from: 'orange', to: 'blue' }
  },
  {
    icon: IconChartBar,
    title: 'Intel Dashboard',
    description: 'Data-driven insights on archetype performance and trends',
    path: '/intel',
    gradient: { from: 'violet', to: 'orange' }
  },
  {
    icon: IconRadar,
    title: 'Regional Radar',
    description: 'Archetype popularity and win rates by region',
    path: '/radar',
    gradient: { from: 'green', to: 'violet' }
  },
  {
    icon: IconBolt,
    title: 'Card Synergy',
    description: 'Discover powerful card combinations from real decks',
    path: '/synergy',
    gradient: { from: 'blue', to: 'violet' }
  },
  {
    icon: IconSettings,
    title: 'Deck Tools',
    description: 'Memory gauge, keyword explorer, and deck utilities',
    path: '/tools',
    gradient: { from: 'orange', to: 'green' }
  }
];

export default function HomePage() {
  return (
    <Container size="xl" pt={80} pb={40}>
      {/* Hero Section */}
      <Box py={80} ta="center" pos="relative">
        {/* Floating Elements */}
        <motion.div
          style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '60px',
            height: '60px',
            border: '2px solid rgba(0, 210, 211, 0.3)',
            borderRadius: '50%',
            zIndex: 0
          }}
          animate={{
            y: [-10, 10, -10],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          style={{
            position: 'absolute',
            top: '60%',
            right: '15%',
            width: '40px',
            height: '40px',
            border: '2px solid rgba(255, 107, 53, 0.4)',
            transform: 'rotate(45deg)',
            zIndex: 0
          }}
          animate={{
            y: [10, -10, 10],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <Title 
            order={1} 
            size={64}
            mb={32}
            style={{
              background: 'linear-gradient(45deg, #00d2d3, #ff6b35, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 40px rgba(0, 210, 211, 0.4)',
              letterSpacing: '2px'
            }}
          >
            DigiDeck Portal
          </Title>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Text 
              size="lg" 
              c="cyan"
              fw={600}
              mb={8}
              style={{
                textTransform: 'uppercase',
                letterSpacing: '4px',
                fontSize: '14px'
              }}
            >
              // DIGITAL WORLD ACCESS GRANTED
            </Text>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Text 
            size="xl"
            c="gray.2" 
            mb={32}
            maw={600} 
            mx="auto"
          >
            The ultimate Digimon TCG companion with live tournament data, 
            meta analysis, and immersive digital world experience
          </Text>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Group justify="center" gap="md">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                component={Link}
                to="/cards"
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan' }}
                size="lg"
                rightSection={<IconArrowRight size={20} />}
              >
                Explore Cards
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                component={Link}
                to="/meta"
                variant="gradient"
                gradient={{ from: 'violet', to: 'orange' }}
                size="lg"
                rightSection={<IconTrendingUp size={20} />}
              >
                View Meta
              </Button>
            </motion.div>
          </Group>
        </motion.div>
      </Box>

      {/* Features Grid */}
      <Box py={60}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Title order={2} size={36} ta="center" mb={40} c="white">
            Explore the Digital World
          </Title>
        </motion.div>
        
        <Grid gutter="lg">
          {features.map((feature, index) => (
            <Grid.Col key={feature.path} span={{ base: 12, sm: 6, lg: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  component={Link}
                  to={feature.path}
                  shadow="xl" 
                  padding="xl" 
                  radius="lg" 
                  withBorder
                  h="100%"
                  style={{
                    background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95), rgba(15, 15, 35, 0.95))',
                    border: '2px solid rgba(0, 210, 211, 0.3)',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    backdropFilter: 'blur(10px)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Animated Border Effect */}
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(45deg, transparent, rgba(0, 210, 211, 0.1), transparent)`,
                      opacity: 0
                    }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    style={{ position: 'relative', zIndex: 1 }}
                  >
                    <Box 
                      w={64} 
                      h={64} 
                      mb="lg"
                      style={{
                        background: `linear-gradient(45deg, #00d2d3, #ff6b35)`,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 32px rgba(0, 210, 211, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <feature.icon size={32} color="white" />
                    </Box>
                  </motion.div>
                  
                  <Stack gap="md" style={{ position: 'relative', zIndex: 1 }}>
                    <Title order={3} c="white" fw={700} lh={1.2}>
                      {feature.title}
                    </Title>
                    
                    <Text c="gray.3" size="md" lh={1.5}>
                      {feature.description}
                    </Text>
                    
                    <Group gap={8} c="cyan" mt="auto">
                      <Text size="sm" fw={600} style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>Access</Text>
                      <motion.div
                        whileHover={{ x: 6, scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 600 }}
                      >
                        <IconArrowRight size={18} />
                      </motion.div>
                    </Group>
                  </Stack>
                </Card>
              </motion.div>
            </Grid.Col>
          ))}
        </Grid>
      </Box>
      
      {/* Legal Disclaimer */}
      <Box mt={80} pt={40} style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Text c="dimmed" size="sm" ta="center">
          Digimon and all related characters are trademarks of Bandai. This is an unofficial fan-made project not affiliated with or endorsed by Bandai, Toei Animation, or any official Digimon entity.
        </Text>
      </Box>
    </Container>
  );
}