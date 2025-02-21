import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Link,
  Divider,
} from '@mui/material';
import {
  Phone,
  LocationOn,
  Link as LinkIcon,
  Close,
  MedicalServices,
  LocalHospital,
  Psychology,
} from '@mui/icons-material';

interface EmergencyResourcesProps {
  onClose: () => void;
  theme: 'light' | 'dark' | 'high-contrast';
}

const EmergencyResources: React.FC<EmergencyResourcesProps> = ({ onClose, theme }) => {
  const emergencyResources = [
    {
      name: '988 Suicide & Crisis Lifeline',
      description: '24/7 free and confidential support',
      phone: '988',
      icon: <MedicalServices />,
    },
    {
      name: 'Crisis Text Line',
      description: 'Text HOME to 741741',
      phone: '741741',
      icon: <Psychology />,
    },
    {
      name: 'Emergency Services',
      description: 'For immediate emergency assistance',
      phone: '911',
      icon: <LocalHospital />,
    },
  ];

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: theme === 'dark' ? 'grey.900' : 'background.paper',
        borderRadius: 2,
        p: 3,
        boxShadow: 3,
        maxWidth: 400,
        width: '90%',
        color: theme === 'dark' ? 'white' : 'text.primary',
      }}
    >
      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>

      <Typography variant="h6" color="error" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <MedicalServices /> Emergency Resources
      </Typography>

      <Typography variant="body2" color="text.secondary" paragraph>
        If you're experiencing a mental health emergency or having thoughts of self-harm,
        please reach out to one of these resources immediately:
      </Typography>

      <List>
        {emergencyResources.map((resource, index) => (
          <React.Fragment key={resource.name}>
            <ListItem>
              <ListItemIcon>{resource.icon}</ListItemIcon>
              <ListItemText
                primary={resource.name}
                secondary={resource.description}
              />
              <IconButton
                color="primary"
                onClick={() => handleCall(resource.phone)}
                sx={{ ml: 1 }}
              >
                <Phone />
              </IconButton>
            </ListItem>
            {index < emergencyResources.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Additional Resources
      </Typography>

      <List>
        <ListItem>
          <ListItemIcon>
            <LocationOn />
          </ListItemIcon>
          <ListItemText
            primary="Find Local Mental Health Services"
            secondary="Search for mental health providers in your area"
          />
          <IconButton
            color="primary"
            component={Link}
            href="https://findtreatment.samhsa.gov/"
            target="_blank"
          >
            <LinkIcon />
          </IconButton>
        </ListItem>
      </List>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Remember: Your life matters. These professionals are here to help 24/7,
        and all calls are confidential.
      </Typography>
    </Box>
  );
};

export default EmergencyResources; 