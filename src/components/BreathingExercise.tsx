import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, CircularProgress, Fade } from '@mui/material';
import { PlayArrow, Pause, Close } from '@mui/icons-material';

interface BreathingExerciseProps {
  onClose: () => void;
  theme: 'light' | 'dark' | 'high-contrast';
}

const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onClose, theme }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [progress, setProgress] = useState(0);
  const [scale, setScale] = useState(1);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  const INHALE_TIME = 4000;
  const HOLD_TIME = 4000;
  const EXHALE_TIME = 4000;
  const TOTAL_TIME = INHALE_TIME + HOLD_TIME + EXHALE_TIME;

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const cycleTime = elapsed % TOTAL_TIME;
      
      if (cycleTime < INHALE_TIME) {
        setPhase('inhale');
        const phaseProgress = (cycleTime / INHALE_TIME);
        setProgress(phaseProgress * 100);
        setScale(1 + phaseProgress * 0.5);
      } else if (cycleTime < INHALE_TIME + HOLD_TIME) {
        setPhase('hold');
        const phaseProgress = ((cycleTime - INHALE_TIME) / HOLD_TIME);
        setProgress(phaseProgress * 100);
        setScale(1.5);
      } else {
        setPhase('exhale');
        const phaseProgress = ((cycleTime - (INHALE_TIME + HOLD_TIME)) / EXHALE_TIME);
        setProgress(phaseProgress * 100);
        setScale(1.5 - phaseProgress * 0.5);
      }

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      startTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const getInstructions = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe in slowly...';
      case 'hold':
        return 'Hold your breath...';
      case 'exhale':
        return 'Breathe out slowly...';
    }
  };

  const getColor = () => {
    switch (phase) {
      case 'inhale':
        return theme === 'dark' ? '#90caf9' : '#1976d2';
      case 'hold':
        return theme === 'dark' ? '#ffb74d' : '#f57c00';
      case 'exhale':
        return theme === 'dark' ? '#81c784' : '#388e3c';
    }
  };

  const togglePlaying = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        bgcolor: theme === 'dark' ? 'grey.900' : 'background.paper',
        borderRadius: 2,
        p: 3,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        color: theme === 'dark' ? 'white' : 'text.primary',
      }}
    >
      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>

      <Typography variant="h6">Breathing Exercise</Typography>

      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
          transform: `scale(${scale})`,
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <CircularProgress
          variant="determinate"
          value={progress}
          size={120}
          thickness={8}
          sx={{
            color: getColor(),
            transition: 'all 0.3s ease-in-out',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
              transition: 'all 0.3s ease-in-out',
            },
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <IconButton 
            onClick={togglePlaying}
            size="large"
            sx={{
              color: getColor(),
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                bgcolor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              },
            }}
          >
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
        </Box>
      </Box>

      <Fade in={true}>
        <Typography
          variant="h6"
          align="center"
          sx={{
            color: getColor(),
            transition: 'color 0.3s ease',
            fontWeight: 500,
          }}
        >
          {getInstructions()}
        </Typography>
      </Fade>

      <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 250 }}>
        Follow the circle's rhythm. It will expand as you breathe in, hold, and contract as you breathe out.
      </Typography>
    </Box>
  );
};

export default BreathingExercise; 