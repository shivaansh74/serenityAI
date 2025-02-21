import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

interface TermsDialogProps {
  open: boolean;
  onClose: () => void;
  onAgree: () => void;
  showAgreeButton?: boolean;
}

const TermsDialog: React.FC<TermsDialogProps> = ({
  open,
  onClose,
  onAgree,
  showAgreeButton = true,
}) => {
  const [agreed, setAgreed] = useState(false);

  const handleAgree = () => {
    onAgree();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Terms and Conditions</DialogTitle>
      <DialogContent>
        <Box sx={{ my: 2 }}>
          <Typography variant="h6" gutterBottom>
            Welcome to SerenityAI
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Important Disclaimer
          </Typography>
          
          <Typography paragraph>
            SerenityAI is designed to be a supportive tool for emotional well-being, but it is not a substitute for professional mental health care.
          </Typography>

          <Typography paragraph>
            While our AI uses advanced technology to provide empathetic responses, it:
          </Typography>

          <ul style={{ listStyleType: 'disc', marginLeft: '2rem', marginBottom: '1rem' }}>
            <li>Cannot diagnose medical conditions</li>
            <li>Cannot prescribe medications</li>
            <li>Should not be used in emergency situations</li>
            <li>Is not a replacement for licensed mental health professionals</li>
          </ul>

          <Typography paragraph>
            If you're experiencing a mental health emergency or having thoughts of self-harm, please contact emergency services or call the National Suicide Prevention Lifeline at 988.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Privacy Notice
          </Typography>
          <Typography paragraph>
            Your conversations are private and encrypted. We prioritize your privacy and handle all data in accordance with strict security standards.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
        {showAgreeButton ? (
          <>
            <FormControlLabel
              control={
                <Checkbox
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
              }
              label="I understand that this is not a substitute for professional medical advice and agree to the terms of use"
            />
            <Button 
              onClick={handleAgree}
              variant="contained" 
              color="primary"
              disabled={!agreed}
            >
              Accept & Continue
            </Button>
          </>
        ) : (
          <Button onClick={onClose} variant="contained" color="primary">
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TermsDialog; 