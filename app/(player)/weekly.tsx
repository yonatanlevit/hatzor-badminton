import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, STRINGS } from '../../lib/constants';

export default function PlayerWeeklyScreen() {
  const { profile } = useAuth();

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.greeting}>
        {STRINGS.greeting}, {profile?.full_name}
      </Text>
      <Text variant="titleLarge" style={styles.title}>
        {STRINGS.weeklyBoard}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  greeting: {
    textAlign: 'right',
    writingDirection: 'rtl',
    color: COLORS.text,
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
