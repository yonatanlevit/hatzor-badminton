import { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, TextInput, Text, Pressable } from 'react-native';
import { ActivityIndicator, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { COLORS, STRINGS } from '../../lib/constants';
import type { Profile } from '../../lib/types';
import PlayerCard from '../../components/PlayerCard';

export default function CoachPlayersScreen() {
  const { profile } = useAuth();
  const router = useRouter();
  const [players, setPlayers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchPlayers = useCallback(async () => {
    setIsLoading(true);
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'player')
      .order('full_name', { ascending: true });

    if (fetchError) {
      setError(STRINGS.fetchError);
    } else {
      setPlayers(data ?? []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const handlePlayerPress = (player: Profile) => {
    router.push(`/(coach)/player/${player.id}`);
  };

  const handleDelete = async (id: string) => {
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError(STRINGS.deleteError);
    } else {
      setPlayers((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const filtered = players.filter(p =>
    p.full_name.includes(search) || (p.phone ?? '').includes(search)
  );

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.playerCount}>{players.length} שחקנים</Text>
          <Text style={styles.title}>השחקנים שלי</Text>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={20} color={COLORS.textMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={STRINGS.searchPlaceholder}
            placeholderTextColor={COLORS.textMuted}
            style={styles.searchInput}
            textAlign="right"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <MaterialCommunityIcons name="close-circle" size={18} color={COLORS.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      {/* List */}
      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
      ) : filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>👥</Text>
          <Text style={styles.emptyText}>
            {search.length > 0 ? 'לא נמצאו שחקנים' : STRINGS.noPlayers}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PlayerCard player={item} onEdit={handlePlayerPress} onDelete={handleDelete} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={3000}
      >
        {error}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  playerCount: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    writingDirection: 'rtl',
    padding: 0,
  },
  list: {
    padding: 16,
    paddingBottom: 24,
  },
  loader: {
    marginTop: 60,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
