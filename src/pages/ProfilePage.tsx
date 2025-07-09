import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Container, Title, Text, Card, Group, Stack, Badge, Button, Loader, Center, TextInput } from '@mantine/core';
import { IconUser, IconStar, IconTrophy, IconLogout, IconEdit, IconCheck, IconX } from '@tabler/icons-react';
import { useAuth } from '../hooks/useAuth';
import AuthModal from '../components/AuthModal';

export default function ProfilePage() {
  const { user, profile, loading, logout, updateTamerName } = useAuth();
  const [authModalOpened, setAuthModalOpened] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newTamerName, setNewTamerName] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleEditName = () => {
    setNewTamerName(profile?.tamerName || '');
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    if (!newTamerName.trim()) return;
    
    setUpdating(true);
    try {
      await updateTamerName(newTamerName.trim());
      setIsEditingName(false);
    } catch (error) {
      console.error('Error updating name:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setNewTamerName('');
  };

  if (loading) {
    return (
      <Container size="xl" pt={80}>
        <Center h={400}>
          <Stack align="center">
            <Loader size="lg" color="cyan" />
            <Text c="dimmed" size="lg">Loading profile...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  if (!user || !profile) {
    return (
      <Container size="xl" pt={80} pb={40}>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Stack align="center" gap="xl">
            <Title 
              order={1} 
              size={48}
              style={{
                background: 'linear-gradient(45deg, #00d2d3, #ff6b35)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Tamer Profile
            </Title>
            <Text c="dimmed" size="lg" ta="center">
              Sign in to track your Digital World journey
            </Text>
            <Button
              variant="gradient"
              gradient={{ from: 'cyan', to: 'blue' }}
              size="lg"
              onClick={() => setAuthModalOpened(true)}
            >
              Sign In / Create Account
            </Button>
          </Stack>
        </motion.div>
        <AuthModal opened={authModalOpened} onClose={() => setAuthModalOpened(false)} />
      </Container>
    );
  }

  const unlockedAchievements = profile.achievements.filter(a => a.unlocked);
  const totalActivity = profile.stats.cardsViewed + profile.stats.decksAnalyzed + profile.stats.pagesVisited;

  return (
    <Container size="xl" pt={80} pb={40}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Stack mb={32}>
          <Group justify="space-between">
            <div>
              <Title 
                order={1} 
                size={48}
                style={{
                  background: 'linear-gradient(45deg, #00d2d3, #ff6b35)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Tamer Profile
              </Title>
              <Text c="dimmed" size="lg">
                Your journey through the Digital World
              </Text>
            </div>
            <Button
              variant="subtle"
              color="red"
              leftSection={<IconLogout size={16} />}
              onClick={logout}
            >
              Sign Out
            </Button>
          </Group>
        </Stack>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Card 
            shadow="xl" 
            padding="lg" 
            radius="lg" 
            withBorder
            style={{
              background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95), rgba(15, 15, 35, 0.95))',
              border: '2px solid rgba(0, 210, 211, 0.3)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Group mb="lg">
              <div 
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #00d2d3, #ff6b35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconUser size={32} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                {isEditingName ? (
                  <Group gap="xs" mb="xs">
                    <TextInput
                      value={newTamerName}
                      onChange={(e) => setNewTamerName(e.currentTarget.value)}
                      placeholder="Enter tamer name"
                      size="sm"
                      style={{ flex: 1 }}
                      styles={{
                        input: {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderColor: 'rgba(0, 210, 211, 0.3)',
                          color: 'white'
                        }
                      }}
                    />
                    <Button
                      size="xs"
                      variant="subtle"
                      color="green"
                      onClick={handleSaveName}
                      loading={updating}
                    >
                      <IconCheck size={16} />
                    </Button>
                    <Button
                      size="xs"
                      variant="subtle"
                      color="red"
                      onClick={handleCancelEdit}
                    >
                      <IconX size={16} />
                    </Button>
                  </Group>
                ) : (
                  <Group gap="xs" mb="xs">
                    <Title order={2} c="white">
                      {profile.tamerName || 'Anonymous Tamer'}
                    </Title>
                    <Button
                      size="xs"
                      variant="subtle"
                      color="cyan"
                      onClick={handleEditName}
                    >
                      <IconEdit size={14} />
                    </Button>
                  </Group>
                )}
                <Text c="dimmed">{profile.email}</Text>
                <Text c="dimmed" size="sm">
                  Joined {profile.joinDate.toLocaleDateString()}
                </Text>
              </div>
            </Group>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#00d2d3' }}>
                  {profile.stats.cardsViewed}
                </div>
                <div className="text-gray-400 text-sm">Cards Viewed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#ff6b35' }}>
                  {profile.stats.decksAnalyzed}
                </div>
                <div className="text-gray-400 text-sm">Decks Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#00d2d3' }}>
                  {totalActivity}
                </div>
                <div className="text-gray-400 text-sm">Total Activity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#ff6b35' }}>
                  {profile.stats.pagesVisited}
                </div>
                <div className="text-gray-400 text-sm">Pages Visited</div>
              </div>
            </div>
          </Card>

          {/* Achievements */}
          <Card 
            shadow="xl" 
            padding="lg" 
            radius="lg" 
            withBorder
            style={{
              background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95), rgba(15, 15, 35, 0.95))',
              border: '2px solid rgba(255, 107, 53, 0.3)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Group mb="lg">
              <IconTrophy size={24} color="#ff6b35" />
              <Title order={3} c="white">
                Achievements ({unlockedAchievements.length}/{profile.achievements.length})
              </Title>
            </Group>
            
            <Stack gap="md">
              {profile.achievements.map((achievement) => (
                <Group
                  key={achievement.id}
                  p="md"
                  style={{
                    borderRadius: '8px',
                    background: achievement.unlocked 
                      ? 'rgba(0, 210, 211, 0.1)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${achievement.unlocked ? 'rgba(0, 210, 211, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                    opacity: achievement.unlocked ? 1 : 0.5
                  }}
                >
                  <div 
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: achievement.unlocked ? '#00d2d3' : '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: achievement.unlocked ? 'black' : '#6b7280'
                    }}
                  >
                    {achievement.unlocked ? '✓' : '?'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text 
                      fw={500} 
                      c={achievement.unlocked ? 'white' : 'dimmed'}
                    >
                      {achievement.name}
                    </Text>
                    <Text 
                      size="sm" 
                      c={achievement.unlocked ? 'dimmed' : 'dark'}
                    >
                      {achievement.description}
                    </Text>
                  </div>
                  {achievement.unlocked && (
                    <IconStar size={16} color="#ff6b35" fill="currentColor" />
                  )}
                </Group>
              ))}
            </Stack>
          </Card>
        </motion.div>

        {/* Partner Evolution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card 
            shadow="xl" 
            padding="lg" 
            radius="lg" 
            withBorder
            style={{
              background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95), rgba(15, 15, 35, 0.95))',
              border: '2px solid rgba(139, 92, 246, 0.3)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Title order={3} c="white" mb="lg" ta="center">
              Partner Evolution
            </Title>
            
            <Stack align="center" gap="lg">
              <div 
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #8b5cf6, #00d2d3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px'
                }}
              >
                {totalActivity < 50 ? '🥚' : totalActivity < 150 ? '🦖' : '🐉'}
              </div>
              
              <Stack align="center" gap="xs">
                <Text c="white" fw={700} size="lg">
                  {totalActivity < 50 ? 'DigiEgg' : totalActivity < 150 ? 'Agumon' : 'Greymon'}
                </Text>
                <Text c="dimmed" size="sm" ta="center">
                  {totalActivity < 50 
                    ? `${50 - totalActivity} activity until evolution`
                    : totalActivity < 150 
                    ? `${150 - totalActivity} activity until next evolution`
                    : 'Fully evolved partner!'}
                </Text>
              </Stack>
              
              <div style={{ width: '100%' }}>
                <Text c="dimmed" size="sm" mb="xs">
                  Evolution Progress
                </Text>
                <div 
                  style={{
                    width: '100%',
                    height: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}
                >
                  <div 
                    style={{
                      width: `${Math.min(100, (totalActivity / 150) * 100)}%`,
                      height: '100%',
                      background: 'linear-gradient(45deg, #8b5cf6, #00d2d3)',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>
            </Stack>
          </Card>
        </motion.div>
      </div>
    </Container>
  );
}