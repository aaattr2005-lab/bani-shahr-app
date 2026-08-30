import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './lib/i18n.tsx';
import { AppStorage } from './lib/nativeStorage';

// Initialize Capacitor Native Storage & synchronize persistent preferences
AppStorage.init().catch(console.error);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
);

