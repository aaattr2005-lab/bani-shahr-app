import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.banishahr.app',
  appName: 'بني شهر',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
