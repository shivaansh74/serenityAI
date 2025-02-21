interface MoodEntry {
  timestamp: number;
  value: number;
  note?: string;
}

const MOOD_STORAGE_KEY = 'serenityai_mood_entries';

export const saveMoodEntry = (value: number, note?: string): void => {
  try {
    const entries = getMoodEntries();
    const newEntry: MoodEntry = {
      timestamp: Date.now(),
      value,
      note,
    };
    
    entries.push(newEntry);
    localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving mood entry:', error);
  }
};

export const getMoodEntries = (): MoodEntry[] => {
  try {
    const storedEntries = localStorage.getItem(MOOD_STORAGE_KEY);
    if (!storedEntries) return [];
    
    const entries = JSON.parse(storedEntries);
    if (!Array.isArray(entries)) return [];
    
    return entries.map(entry => ({
      ...entry,
      timestamp: Number(entry.timestamp),
      value: Number(entry.value)
    }));
  } catch (error) {
    console.error('Error getting mood entries:', error);
    return [];
  }
};

export const getAverageMood = (days: number = 7): number | null => {
  try {
    const entries = getMoodEntries();
    const now = Date.now();
    const msInDay = 86400000; // 24 * 60 * 60 * 1000
    
    const recentEntries = entries.filter(
      entry => (now - entry.timestamp) <= days * msInDay
    );
    
    if (recentEntries.length === 0) return null;
    
    const sum = recentEntries.reduce((acc, entry) => acc + entry.value, 0);
    return sum / recentEntries.length;
  } catch (error) {
    console.error('Error calculating average mood:', error);
    return null;
  }
};

export const getMoodTrend = (days: number = 7): 'improving' | 'declining' | 'stable' | null => {
  try {
    const entries = getMoodEntries();
    const now = Date.now();
    const msInDay = 86400000;
    
    const recentEntries = entries
      .filter(entry => (now - entry.timestamp) <= days * msInDay)
      .sort((a, b) => a.timestamp - b.timestamp);
      
    if (recentEntries.length < 2) return null;
    
    const firstHalf = recentEntries.slice(0, Math.floor(recentEntries.length / 2));
    const secondHalf = recentEntries.slice(Math.floor(recentEntries.length / 2));
    
    const firstAvg = firstHalf.reduce((acc, entry) => acc + entry.value, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((acc, entry) => acc + entry.value, 0) / secondHalf.length;
    
    const difference = secondAvg - firstAvg;
    if (Math.abs(difference) < 0.3) return 'stable';
    return difference > 0 ? 'improving' : 'declining';
  } catch (error) {
    console.error('Error calculating mood trend:', error);
    return null;
  }
};

export const clearMoodEntries = (): void => {
  localStorage.removeItem(MOOD_STORAGE_KEY);
}; 