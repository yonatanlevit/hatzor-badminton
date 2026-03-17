import { useState, useEffect } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text, Snackbar, ActivityIndicator } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import { COLORS, STRINGS } from '../../../lib/constants';
import type { Profile } from '../../../lib/types';
import ConversationLogsSection from '../../../components/ConversationLogsSection';
import GoalsSection from '../../../components/GoalsSection';

type Tab = 'tournaments' | 'conversations' | 'goals';

const TABS: { key: Tab; label: string }[] = [
  { key: 'goals', label: STRINGS.goalsTab },
  { key: 'conversations', label: STRINGS.conversationsTab },
  { key: 'tournaments', label: STRINGS.tournamentsTab },
];

export default function PlayerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { profile } = useAuth();
  const [player, setPlayer] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('conversations');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlayer = async () => {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        setError(STRINGS.fetchError);
      } else {
        setPlayer(data as Profile);
      }
      setIsLoading(false);
    };
    fetchPlayer();
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-right" size={28} color={COLORS.text} />
        </Pressable>
        <Text variant="titleLarge" style={styles.headerTitle}>
          {player?.full_name ?? STRINGS.playerDetail}
        </Text>
        <View style={styles.backButton} />
      </View>

      {/* Segmented Control */}
      <View style={styles.segmentedControl}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[styles.segment, isActive && styles.segmentActive]}
            >
              <Text style={[styles.segmentLabel, isActive && styles.segmentLabelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        {activeTab === 'tournaments' && (
          <View style={styles.centered}>
            <Text style={styles.placeholder}>{STRINGS.tournamentsComingSoon}</Text>
          </View>
        )}
        {activeTab === 'conversations' && profile && (
          <ConversationLogsSection playerId={id!} coachId={profile.id} onError={setError} />
        )}
        {activeTab === 'goals' && profile && (
          <GoalsSection playerId={id!} coachId={profile.id} onError={setError} />
        )}
      </View>

      <Snackbar visible={!!error} onDismiss={() => setError('')} duration={3000}>
        {error}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  segmentedControl: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: COLORS.border,
    borderRadius: 10,
    padding: 3,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  segmentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  segmentLabelActive: {
    color: COLORS.primary,
  },
  content: {
    flex: 1,
    marginTop: 8,
  },
  placeholder: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
