import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Box,
} from '@mui/material';

interface WelcomeProps {
  onAccept: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onAccept }) => {
  const [consent, setConsent] = useState(false);

  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', color: 'primary.main' }}>
        Welcome to SerenityAI
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          Important Disclaimer
        </Typography>
        <Typography paragraph>
          SerenityAI is designed to be a supportive tool for emotional well-being, but it is not a
          substitute for professional mental health care.
        </Typography>
        <Typography paragraph>
          While our AI uses advanced technology to provide empathetic responses, it:
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <Typography component="li">Cannot diagnose medical conditions</Typography>
          <Typography component="li">Cannot prescribe medications</Typography>
          <Typography component="li">Should not be used in emergency situations</Typography>
          <Typography component="li">
            Is not a replacement for licensed mental health professionals
          </Typography>
        </Box>
        <Typography paragraph sx={{ mt: 2 }}>
          If you're experiencing a mental health emergency or having thoughts of self-harm, please
          contact emergency services or call the National Suicide Prevention Lifeline at 988.
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Privacy Notice
        </Typography>
        <Typography paragraph>
          Your conversations are private and encrypted. We prioritize your privacy and handle all data
          in accordance with strict security standards.
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              color="primary"
            />
          }
          label="I understand that this is not a substitute for professional medical advice and agree to the terms of use."
        />
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          variant="contained"
          fullWidth
          disabled={!consent}
          onClick={onAccept}
          size="large"
        >
          I Understand and Want to Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Welcome; 