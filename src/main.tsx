import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { browserTracingIntegration } from "@sentry/browser";
import { replayIntegration } from "@sentry/replay";
import App from './App.tsx';
import './index.css';
import { validateEnv } from './config/env.ts';

// Validate environment variables
validateEnv();

// Initialize Sentry only in production
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      browserTracingIntegration(),
      replayIntegration({
        blockAllMedia: false,
        maskAllText: true
      }),
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: import.meta.env.MODE,
    enabled: import.meta.env.PROD,
  });
}

const root = document.getElementById('root');

if (!root) {
  console.error('Root element not found');
  throw new Error('Root element not found');
}

// Wrap the render in a try-catch to handle initialization errors
try {
  createRoot(root).render(
    <StrictMode>
      <BrowserRouter>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </BrowserRouter>
    </StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  root.innerHTML = '<div>Something went wrong. Please refresh the page.</div>';
}