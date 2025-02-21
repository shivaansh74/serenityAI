import { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './assets/themes/theme';
import ChatInterface from './components/ChatInterface';
import Welcome from './components/Welcome';

function App() {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!hasAcceptedTerms ? (
        <Welcome onAccept={() => setHasAcceptedTerms(true)} />
      ) : (
        <ChatInterface />
      )}
    </ThemeProvider>
  );
}

export default App;
