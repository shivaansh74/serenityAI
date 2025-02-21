import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  TextField,
  Divider,
  DialogContentText,
} from '@mui/material';
import { UserProfile } from '../types';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  settings: UserProfile['preferences'];
  onSave: (settings: UserProfile['preferences']) => void;
  onResetAll?: () => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  onClose,
  settings,
  onSave,
  onResetAll
}) => {
  const [localSettings, setLocalSettings] = useState<UserProfile['preferences']>(settings);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="sm" 
        fullWidth
        disablePortal
        keepMounted
      >
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <Typography variant="h6" gutterBottom>
              Personal Settings
            </Typography>
            <TextField
              fullWidth
              label="Your Name"
              value={localSettings.userName || ''}
              onChange={(e) =>
                setLocalSettings((prev) => ({
                  ...prev,
                  userName: e.target.value,
                }))
              }
              margin="normal"
              helperText="Enter your name to personalize the conversation"
            />
          </Box>

          <Box sx={{ my: 2 }}>
            <Typography variant="h6" gutterBottom>
              Appearance
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Theme</InputLabel>
              <Select
                value={localSettings.theme}
                label="Theme"
                onChange={(e) =>
                  setLocalSettings((prev) => ({
                    ...prev,
                    theme: e.target.value as 'light' | 'dark',
                  }))
                }
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Font Size</InputLabel>
              <Select
                value={localSettings.fontSize}
                label="Font Size"
                onChange={(e) =>
                  setLocalSettings((prev) => ({
                    ...prev,
                    fontSize: e.target.value as 'small' | 'medium' | 'large',
                  }))
                }
              >
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Message Spacing</InputLabel>
              <Select
                value={localSettings.messageSpacing}
                label="Message Spacing"
                onChange={(e) =>
                  setLocalSettings((prev) => ({
                    ...prev,
                    messageSpacing: e.target.value as 'compact' | 'comfortable' | 'spacious',
                  }))
                }
              >
                <MenuItem value="compact">Compact</MenuItem>
                <MenuItem value="comfortable">Comfortable</MenuItem>
                <MenuItem value="spacious">Spacious</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ my: 2 }}>
            <Typography variant="h6" gutterBottom>
              Interaction Preferences
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={localSettings.voiceEnabled}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({
                      ...prev,
                      voiceEnabled: e.target.checked,
                    }))
                  }
                />
              }
              label="Enable Voice Input"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={localSettings.soundEnabled}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({
                      ...prev,
                      soundEnabled: e.target.checked,
                    }))
                  }
                />
              }
              label="Enable Sound Effects"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={localSettings.autoScroll}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({
                      ...prev,
                      autoScroll: e.target.checked,
                    }))
                  }
                />
              }
              label="Auto-scroll to New Messages"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={localSettings.sendWithEnter}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({
                      ...prev,
                      sendWithEnter: e.target.checked,
                    }))
                  }
                />
              }
              label="Send Message with Enter Key"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={localSettings.showTimestamps}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({
                      ...prev,
                      showTimestamps: e.target.checked,
                    }))
                  }
                />
              }
              label="Show Message Timestamps"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={localSettings.notifications}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({
                      ...prev,
                      notifications: e.target.checked,
                    }))
                  }
                />
              }
              label="Enable Notifications"
            />
          </Box>

          <Box sx={{ my: 2 }}>
            <Typography variant="h6" gutterBottom>
              Language
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Language</InputLabel>
              <Select
                value={localSettings.language}
                label="Language"
                onChange={(e) =>
                  setLocalSettings((prev) => ({
                    ...prev,
                    language: e.target.value as string,
                  }))
                }
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
                <MenuItem value="it">Italian</MenuItem>
                <MenuItem value="pt">Portuguese</MenuItem>
                <MenuItem value="ru">Russian</MenuItem>
                <MenuItem value="zh">Chinese</MenuItem>
                <MenuItem value="ja">Japanese</MenuItem>
                <MenuItem value="ko">Korean</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="error" gutterBottom>
              Danger Zone
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setShowResetConfirm(true)}
              fullWidth
            >
              Reset All App Data
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              This will reset all settings, clear chat history, mood history, and remove all saved data.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
      >
        <DialogTitle>Reset All App Data?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete:
            • All chat history
            • All mood tracking data
            • All custom settings
            • Terms agreement status
            
            This action cannot be undone. Are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResetConfirm(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setShowResetConfirm(false);
              onResetAll?.();
              onClose();
            }}
            color="error"
            variant="contained"
          >
            Reset Everything
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SettingsDialog; 