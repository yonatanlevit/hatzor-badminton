import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { COLORS, STRINGS } from '../../lib/constants';

export default function ChatsScreen() {
  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        {STRINGS.personalChats}
      </Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        {STRINGS.comingSoon}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.textSecondary,
  },
});
