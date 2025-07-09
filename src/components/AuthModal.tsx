import React, { useState } from 'react';
import { Modal, TextInput, Button, Stack, Text, Group, Alert } from '@mantine/core';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function AuthModal({ opened, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tamerName, setTamerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signUp, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await signUp(email, password, tamerName);
      } else {
        await signIn(email, password);
      }
      onClose();
      resetForm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setTamerName('');
    setError('');
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isSignUp ? 'Create Account' : 'Sign In'}
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
        title: {
          color: 'white',
          fontWeight: 700
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          {error && (
            <Alert color="red" variant="light">
              {error}
            </Alert>
          )}

          {isSignUp && (
            <TextInput
              label="Tamer Name"
              placeholder="Your tamer name"
              value={tamerName}
              onChange={(e) => setTamerName(e.currentTarget.value)}
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
          )}

          <TextInput
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
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

          <TextInput
            label="Password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
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

          <Button
            type="submit"
            loading={loading}
            variant="gradient"
            gradient={{ from: 'cyan', to: 'blue' }}
            fullWidth
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>

          <Group justify="center">
            <Text c="dimmed" size="sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </Text>
            <Button variant="subtle" size="sm" onClick={switchMode}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}