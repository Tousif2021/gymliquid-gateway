
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c9f60c161c0844738d40ce5dcf64a1ea',
  appName: 'gymliquid-gateway',
  webDir: 'dist',
  server: {
    url: 'https://c9f60c16-1c08-4473-8d40-ce5dcf64a1ea.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
