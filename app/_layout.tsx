import { useEffect } from 'react';
import { I18nManager } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { COLORS } from '../lib/constants';

// Force RTL layout
if (!I18nManager.isRTL) {
  I18nManager.forceRTL(true);
  I18nManager.allowRTL(true);
}

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.accent,
    background: COLORS.background,
    error: COLORS.error,
  },
};

function RootLayoutNav() {
  const { user, profile, isCoach, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user) {
      // Not logged in — go to login
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
    } else if (profile) {
      // Logged in — redirect based on role
      if (isCoach) {
        if (segments[0] !== '(coach)') {
          router.replace('/(coach)/weekly');
        }
      } else {
        if (segments[0] !== '(player)') {
          router.replace('/(player)/weekly');
        }
      }
    }
  }, [user, profile, isLoading, segments]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </PaperProvider>
  );
}
