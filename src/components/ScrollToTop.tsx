import { useState, useEffect } from 'react';
import { ActionIcon } from '@mantine/core';
import { IconArrowUp } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000
          }}
        >
          <ActionIcon
            size="lg"
            variant="gradient"
            gradient={{ from: 'cyan', to: 'blue' }}
            onClick={scrollToTop}
            style={{
              boxShadow: '0 4px 12px rgba(0, 210, 211, 0.3)',
              border: '2px solid rgba(0, 210, 211, 0.4)'
            }}
          >
            <IconArrowUp size={20} />
          </ActionIcon>
        </motion.div>
      )}
    </AnimatePresence>
  );
}