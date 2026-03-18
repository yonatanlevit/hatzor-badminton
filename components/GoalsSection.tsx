import { useState, useEffect, useCallback, useRef } from 'react';
import { View, FlatList, Pressable, StyleSheet, Text } from 'react-native';
import { FAB, Dialog, Portal, Button, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { COLORS, STRINGS, GOAL_STATUSES } from '../lib/constants';
import type { Goal } from '../lib/types';
import AddGoalModal from './AddGoalModal';

interface GoalsSectionProps {
  playerId: string;
  coachId: string;
  onError: (msg: string) => void;
}

export default function GoalsSection({ playerId, coachId, onError }: GoalsSectionProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [statusGoal, setStatusGoal] = useState<Goal | null>(null);
  const [deleteGoal, setDeleteGoal] = useState<Goal | null>(null);
  const pressTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const fetchGoals = useCallback(async () => {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('player_id', playerId)
      .order('created_at', { ascending: false });

    if (error) {
      onError(STRINGS.fetchError);
    } else {
      setGoals((data ?? []) as Goal[]);
    }
    setIsLoading(false);
  }, [playerId, onError]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleAddGoal = async (title: string, description: string, targetDate: string | null) => {
    setAddModalVisible(false);
    const { data, error } = await supabase
      .from('goals')
      .insert({ player_id: playerId, created_by: coachId, title, description: description || null, target_date: targetDate })
      .select()
      .single();

    if (error) {
      onError(STRINGS.goalSaveError);
    } else if (data) {
      setGoals((prev) => [data as Goal, ...prev]);
    }
  };

  const handleStatusChange = async (goalId: string, status: Goal['status']) => {
    setStatusGoal(null);
    const { error } = await supabase
      .from('goals')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', goalId);

    if (error) {
      onError(STRINGS.goalUpdateError);
    } else {
      setGoals((prev) =>
        prev.map((g) => (g.id === goalId ? { ...g, status, updated_at: new Date().toISOString() } : g))
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteGoal) return;
    const goalId = deleteGoal.id;
    setDeleteGoal(null);
    const { error } = await supabase.from('goals').delete().eq('id', goalId);
    if (error) {
      onError(STRINGS.deleteError);
    } else {
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
    }
  };

  const handlePressIn = useCallback((goal: Goal) => {
    const timer = setTimeout(() => {
      setDeleteGoal(goal);
    }, 600);
    pressTimers.current.set(goal.id, timer);
  }, []);

  const handlePressOut = useCallback((goalId: string) => {
    const timer = pressTimers.current.get(goalId);
    if (timer) {
      clearTimeout(timer);
      pressTimers.current.delete(goalId);
    }
  }, []);

  const getStatusInfo = (status: string) =>
    GOAL_STATUSES.find((s) => s.key === status) ?? GOAL_STATUSES[0];

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
  };

  const STATUS_ICON: Record<string, string> = {
    active: 'circle-outline',
    completed: 'check-circle',
    cancelled: 'close-circle-outline',
  };

  const renderGoal = ({ item }: { item: Goal }) => {
    const statusInfo = getStatusInfo(item.status);
    const isCoachCreated = item.created_by === coachId;
    const isDone = item.status !== 'active';

    return (
      <Pressable
        onPress={() => setStatusGoal(item)}
        onPressIn={() => handlePressIn(item)}
        onPressOut={() => handlePressOut(item.id)}
      >
        <View style={[styles.card, isDone && styles.cardDone]}>
          {/* Status icon */}
          <View style={styles.statusIcon}>
            <MaterialCommunityIcons
              name={STATUS_ICON[item.status] as any}
              size={22}
              color={statusInfo.color}
            />
          </View>

          {/* Content */}
          <View style={styles.cardContent}>
            <View style={styles.cardTop}>
              <View style={[styles.creatorBadge, { backgroundColor: isCoachCreated ? '#E3F2FD' : '#FFF3E0' }]}>
                <Text style={[styles.creatorText, { color: isCoachCreated ? '#1565C0' : '#E65100' }]}>
                  {isCoachCreated ? STRINGS.createdByCoach : STRINGS.createdByPlayer}
                </Text>
              </View>
              <Text style={[styles.goalTitle, isDone && styles.goalTitleDone]}>{item.title}</Text>
            </View>
            {item.description ? (
              <Text style={styles.goalDescription}>{item.description}</Text>
            ) : null}
            <View style={styles.cardMeta}>
              {item.target_date ? (
                <Text style={styles.metaText}>{STRINGS.goalTargetDate}: {formatDate(item.target_date)}</Text>
              ) : null}
              <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '22' }]}>
                <Text style={[styles.statusLabel, { color: statusInfo.color }]}>{statusInfo.label}</Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {goals.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyEmoji}>🎯</Text>
          <Text style={styles.empty}>{STRINGS.noGoals}</Text>
        </View>
      ) : (
        <FlatList
          data={goals}
          keyExtractor={(item) => item.id}
          renderItem={renderGoal}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        color={COLORS.white}
        onPress={() => setAddModalVisible(true)}
      />

      <AddGoalModal
        visible={addModalVisible}
        onDismiss={() => setAddModalVisible(false)}
        onSave={handleAddGoal}
      />

      <Portal>
        <Dialog visible={!!statusGoal} onDismiss={() => setStatusGoal(null)}>
          <Dialog.Title style={styles.dialogTitle}>{statusGoal?.title}</Dialog.Title>
          <Dialog.Content>
            {statusGoal?.status !== 'completed' && (
              <Button mode="outlined" onPress={() => handleStatusChange(statusGoal!.id, 'completed')} style={styles.statusButton} textColor={COLORS.calendarBlue}>
                {STRINGS.markCompleted}
              </Button>
            )}
            {statusGoal?.status !== 'cancelled' && (
              <Button mode="outlined" onPress={() => handleStatusChange(statusGoal!.id, 'cancelled')} style={styles.statusButton} textColor={COLORS.textSecondary}>
                {STRINGS.markCancelled}
              </Button>
            )}
            {statusGoal?.status !== 'active' && (
              <Button mode="outlined" onPress={() => handleStatusChange(statusGoal!.id, 'active')} style={styles.statusButton} textColor="#4CAF50">
                {STRINGS.reactivate}
              </Button>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setStatusGoal(null)}>{STRINGS.cancel}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <Dialog visible={!!deleteGoal} onDismiss={() => setDeleteGoal(null)}>
          <Dialog.Title style={styles.dialogTitle}>{STRINGS.deleteGoal}</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>{STRINGS.deleteGoalConfirm}</Text>
            <Text style={[styles.dialogText, { fontWeight: 'bold', marginTop: 8 }]}>{deleteGoal?.title}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteGoal(null)}>{STRINGS.cancel}</Button>
            <Button onPress={handleDelete} textColor={COLORS.error}>{STRINGS.delete}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  emptyEmoji: { fontSize: 40 },
  empty: { fontSize: 15, color: COLORS.textMuted, textAlign: 'center' },
  list: { paddingHorizontal: 16, paddingVertical: 12, paddingBottom: 80, gap: 10 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  cardDone: { opacity: 0.7 },
  statusIcon: { paddingTop: 2, flexShrink: 0 },
  cardContent: { flex: 1 },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'right',
    writingDirection: 'rtl',
    flex: 1,
  },
  goalTitleDone: { textDecorationLine: 'line-through', color: COLORS.textMuted },
  goalDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 20,
    marginBottom: 6,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  metaText: { fontSize: 11, color: COLORS.textMuted },
  creatorBadge: {
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    flexShrink: 0,
  },
  creatorText: { fontSize: 11, fontWeight: '600' },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  statusLabel: { fontSize: 11, fontWeight: '700' },
  fab: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
  },
  dialogTitle: { textAlign: 'right', writingDirection: 'rtl' },
  dialogText: { textAlign: 'right', writingDirection: 'rtl' },
  statusButton: { marginBottom: 8 },
});
