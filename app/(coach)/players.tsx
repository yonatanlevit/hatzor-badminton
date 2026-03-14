import { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { COLORS, STRINGS } from '../../lib/constants';
import type { Profile } from '../../lib/types';
import PlayerCard from '../../components/PlayerCard';
import EditPlayerModal from '../../components/EditPlayerModal';

export default function CoachPlayersScreen() {
  const { profile } = useAuth();
  const [players, setPlayers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPlayer, setEditingPlayer] = useState<Profile | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleEdit = (player: Profile) => {
    setEditingPlayer(player);
    setModalVisible(true);
  };

  const handleSave = async (id: string, updates: { full_name: string; phone: string }) => {
    setModalVisible(false);
    const { error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id);

    if (updateError) {
      setError(STRINGS.updateError);
    } else {
      fetchPlayers();
    }
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

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.greeting}>
        {STRINGS.greeting}, {profile?.full_name}
      </Text>
      <Text variant="titleLarge" style={styles.title}>
        {STRINGS.players}
      </Text>

      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
      ) : players.length === 0 ? (
        <Text style={styles.empty}>{STRINGS.noPlayers}</Text>
      ) : (
        <FlatList
          data={players}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PlayerCard player={item} onEdit={handleEdit} onDelete={handleDelete} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <EditPlayerModal
        visible={modalVisible}
        player={editingPlayer}
        onDismiss={() => setModalVisible(false)}
        onSave={handleSave}
      />

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
    marginBottom: 16,
  },
  loader: {
    marginTop: 40,
  },
  empty: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 16,
    marginTop: 40,
  },
  list: {
    paddingBottom: 20,
  },
});
