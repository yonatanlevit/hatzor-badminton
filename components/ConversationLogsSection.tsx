import { useState, useEffect, useCallback, useRef } from 'react';
import { View, FlatList, Pressable, StyleSheet } from 'react-native';
import { Text, FAB, Dialog, Portal, Button, ActivityIndicator } from 'react-native-paper';
import { supabase } from '../lib/supabase';
import { COLORS, STRINGS } from '../lib/constants';
import type { ConversationLog } from '../lib/types';
import AddConversationLogModal from './AddConversationLogModal';

interface ConversationLogsSectionProps {
  playerId: string;
  coachId: string;
  onError: (msg: string) => void;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
};

export default function ConversationLogsSection({ playerId, coachId, onError }: ConversationLogsSectionProps) {
  const [logs, setLogs] = useState<ConversationLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteLog, setDeleteLog] = useState<ConversationLog | null>(null);
  const pressTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const fetchLogs = useCallback(async () => {
    const { data, error } = await supabase
      .from('conversation_logs')
      .select('*')
      .eq('player_id', playerId)
      .order('conversation_date', { ascending: false });

    if (error) {
      onError(STRINGS.fetchError);
    } else {
      setLogs((data ?? []) as ConversationLog[]);
    }
    setIsLoading(false);
  }, [playerId, onError]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleAdd = async (conversationDate: string, summary: string) => {
    setAddModalVisible(false);
    const { data, error } = await supabase
      .from('conversation_logs')
      .insert({ player_id: playerId, coach_id: coachId, conversation_date: conversationDate, summary })
      .select()
      .single();

    if (error) {
      onError(STRINGS.conversationLogSaveError);
    } else if (data) {
      setLogs((prev) => [data as ConversationLog, ...prev]);
    }
  };

  const handleDelete = async () => {
    if (!deleteLog) return;
    const logId = deleteLog.id;
    setDeleteLog(null);

    const { error } = await supabase.from('conversation_logs').delete().eq('id', logId);
    if (error) {
      onError(STRINGS.deleteError);
    } else {
      setLogs((prev) => prev.filter((l) => l.id !== logId));
    }
  };

  const handlePressIn = useCallback((log: ConversationLog) => {
    const timer = setTimeout(() => {
      setDeleteLog(log);
    }, 600);
    pressTimers.current.set(log.id, timer);
  }, []);

  const handlePressOut = useCallback((logId: string) => {
    const timer = pressTimers.current.get(logId);
    if (timer) {
      clearTimeout(timer);
      pressTimers.current.delete(logId);
    }
  }, []);

  const renderLog = ({ item }: { item: ConversationLog }) => (
    <Pressable
      onPressIn={() => handlePressIn(item)}
      onPressOut={() => handlePressOut(item.id)}
    >
      <View style={styles.card}>
        <Text style={styles.date}>{formatDate(item.conversation_date)}</Text>
        <Text style={styles.summary}>{item.summary}</Text>
      </View>
    </Pressable>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {logs.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.empty}>{STRINGS.noConversationLogs}</Text>
        </View>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          renderItem={renderLog}
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

      <AddConversationLogModal
        visible={addModalVisible}
        onDismiss={() => setAddModalVisible(false)}
        onSave={handleAdd}
      />

      {/* Delete confirmation dialog */}
      <Portal>
        <Dialog visible={!!deleteLog} onDismiss={() => setDeleteLog(null)}>
          <Dialog.Title style={styles.dialogTitle}>{STRINGS.deleteConversationLog}</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>{STRINGS.deleteConversationLogConfirm}</Text>
            {deleteLog && (
              <Text style={[styles.dialogText, { fontWeight: 'bold', marginTop: 8 }]}>
                {formatDate(deleteLog.conversation_date)}
              </Text>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteLog(null)}>{STRINGS.cancel}</Button>
            <Button onPress={handleDelete} textColor={COLORS.error}>{STRINGS.delete}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  date: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 6,
  },
  summary: {
    fontSize: 15,
    color: COLORS.text,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 28,
  },
  dialogTitle: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  dialogText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
