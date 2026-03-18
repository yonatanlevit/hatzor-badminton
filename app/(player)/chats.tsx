import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, STRINGS } from '../../lib/constants';

export default function ChatsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{STRINGS.conversationLogs}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="chat-outline" size={40} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>שיחות עם המאמן</Text>
        <Text style={styles.subtitle}>{STRINGS.comingSoon}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>בקרוב</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 54,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'right',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  badge: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  badgeText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
});
