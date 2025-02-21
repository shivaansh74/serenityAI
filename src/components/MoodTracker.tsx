import React, { useState } from 'react';
import {
  Box,
  Typography,
  Slider,
  Button,
  IconButton,
  Paper,
} from '@mui/material';
import {
  SentimentVeryDissatisfied,
  SentimentDissatisfied,
  SentimentNeutral,
  SentimentSatisfied,
  SentimentVerySatisfied,
  Close,
} from '@mui/icons-material';

interface MoodTrackerProps {
  onClose: () => void;
  onMoodSelect: (value: number) => void;
  theme: 'light' | 'dark' | 'high-contrast';
  isInitial?: boolean;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({
  onClose,
  onMoodSelect,
  theme,
  isInitial = false,
}) => {
  const [mood, setMood] = useState<number>(3);

  const getMoodIcon = (value: number) => {
    if (value <= 1) return <SentimentVeryDissatisfied />;
    if (value <= 2) return <SentimentDissatisfied />;
    if (value <= 3) return <SentimentNeutral />;
    if (value <= 4) return <SentimentSatisfied />;
    return <SentimentVerySatisfied />;
  };

  const getMoodText = (value: number) => {
    if (value <= 1) return 'Very Low';
    if (value <= 2) return 'Low';
    if (value <= 3) return 'Neutral';
    if (value <= 4) return 'Good';
    return 'Very Good';
  };

  const handleSubmit = () => {
    onMoodSelect(mood);
    onClose();
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: isInitial ? '50%' : 20,
        right: isInitial ? '50%' : 20,
        transform: isInitial ? 'translate(50%, 50%)' : 'none',
        width: isInitial ? '90%' : 300,
        maxWidth: 400,
        p: 3,
        bgcolor: theme === 'dark' ? 'grey.900' : 'background.paper',
        color: theme === 'dark' ? 'white' : 'text.primary',
        borderRadius: 2,
      }}
    >
      {!isInitial && (
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
          size="small"
        >
          <Close />
        </IconButton>
      )}

      <Typography variant="h6" gutterBottom>
        {isInitial ? 'How are you feeling today?' : 'Check in with yourself'}
      </Typography>

      <Box sx={{ mt: 4, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <SentimentVeryDissatisfied color="error" />
          <SentimentDissatisfied color="warning" />
          <SentimentNeutral color="info" />
          <SentimentSatisfied color="success" />
          <SentimentVerySatisfied color="success" />
        </Box>
        <Slider
          value={mood}
          min={1}
          max={5}
          step={0.1}
          onChange={(_, value) => setMood(value as number)}
          sx={{ mt: 2 }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box sx={{ mr: 2 }}>{getMoodIcon(mood)}</Box>
        <Typography>
          You're feeling: <strong>{getMoodText(mood)}</strong>
        </Typography>
      </Box>

      <Button
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        sx={{ mt: 2 }}
      >
        {isInitial ? "Let's Begin" : 'Save Mood'}
      </Button>

      {!isInitial && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          Regular mood tracking can help you understand your emotional patterns
        </Typography>
      )}
    </Paper>
  );
};

export default MoodTracker; 