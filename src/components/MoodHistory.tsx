import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  LinearProgress,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  SentimentVeryDissatisfied,
  SentimentDissatisfied,
  SentimentNeutral,
  SentimentSatisfied,
  SentimentVerySatisfied,
  Close,
} from '@mui/icons-material';
import { getMoodEntries, getAverageMood, getMoodTrend } from '../services/MoodTracking';

interface MoodHistoryProps {
  theme: 'light' | 'dark' | 'high-contrast';
  onClose?: () => void;
}

const MoodHistory: React.FC<MoodHistoryProps> = ({ theme, onClose }) => {
  const [entries, setEntries] = useState<any[]>([]);
  const [average, setAverage] = useState<number | null>(null);
  const [trend, setTrend] = useState<string | null>(null);

  useEffect(() => {
    const updateStats = () => {
      const allEntries = getMoodEntries();
      setEntries(allEntries);
      setAverage(getAverageMood(7));
      setTrend(getMoodTrend(7));
    };

    updateStats();
    const interval = setInterval(updateStats, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const getMoodIcon = (value: number) => {
    if (value <= 1) return <SentimentVeryDissatisfied color="error" />;
    if (value <= 2) return <SentimentDissatisfied color="warning" />;
    if (value <= 3) return <SentimentNeutral color="info" />;
    if (value <= 4) return <SentimentSatisfied color="success" />;
    return <SentimentVerySatisfied color="success" />;
  };

  const getMoodText = (value: number) => {
    if (value <= 1) return 'Very Low';
    if (value <= 2) return 'Low';
    if (value <= 3) return 'Neutral';
    if (value <= 4) return 'Good';
    return 'Very Good';
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'improving':
        return <TrendingUp color="success" fontSize="large" />;
      case 'declining':
        return <TrendingDown color="error" fontSize="large" />;
      case 'stable':
        return <TrendingFlat color="info" fontSize="large" />;
      default:
        return null;
    }
  };

  const getTrendText = () => {
    switch (trend) {
      case 'improving':
        return 'Your mood is improving';
      case 'declining':
        return 'Your mood is declining';
      case 'stable':
        return 'Your mood is stable';
      default:
        return 'Not enough data';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card
      elevation={3}
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 500,
        maxHeight: '90vh',
        overflow: 'auto',
        bgcolor: theme === 'dark' ? 'grey.900' : 'background.paper',
        color: theme === 'dark' ? 'white' : 'text.primary',
      }}
    >
      {onClose && (
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      )}

      <CardContent>
        <Typography variant="h5" gutterBottom>
          Mood History
        </Typography>

        {average !== null && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              7-Day Overview
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ mr: 2 }}>{getMoodIcon(average)}</Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body1" gutterBottom>
                  Average Mood: <strong>{getMoodText(average)}</strong>
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(average / 5) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: theme === 'dark' ? 'grey.800' : 'grey.200',
                  }}
                />
              </Box>
              <Typography variant="h6" sx={{ ml: 2 }}>
                {average.toFixed(1)}
              </Typography>
            </Box>

            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Tooltip title={getTrendText()}>
                  <Box sx={{ mr: 2 }}>{getTrendIcon()}</Box>
                </Tooltip>
                <Typography variant="body1">{getTrendText()}</Typography>
              </Box>
            )}
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Recent Entries
        </Typography>

        {entries.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
            No mood entries yet. Start tracking your mood to see your history.
          </Typography>
        ) : (
          <Box sx={{ mt: 2 }}>
            {entries
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((entry, index) => (
                <Box
                  key={entry.timestamp}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    py: 2,
                    borderBottom: index < entries.length - 1 ? 1 : 0,
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ mr: 2 }}>{getMoodIcon(entry.value)}</Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1">
                      {getMoodText(entry.value)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(entry.timestamp)}
                    </Typography>
                  </Box>
                  <Typography variant="h6">
                    {entry.value.toFixed(1)}
                  </Typography>
                </Box>
              ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodHistory; 