import { Pressable, View, StyleSheet, Text } from 'react-native';
import { Dialog, Portal, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useRef, useCallback } from 'react';
import { COLORS, STRINGS, TRAINING_TYPES } from '../lib/constants';
import type { TrainingSession } from '../lib/types';

interface SessionCardProps {
  session: TrainingSession;
  canDelete?: boolean;
  onDelete?: (id: string) => void;
}

function getTypeColor(trainingType: string | null): string {
  if (!trainingType) return '#9E9E9E';
  const found = TRAINING_TYPES.find(t => trainingType.includes(t.key));
  return found?.color ?? '#9E9E9E';
}

export default function SessionCard({ session, canDelete, onDelete }: SessionCardProps) {
  const [dialogVisible, setDialogVisible] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePressIn = useCallback(() => {
    if (!canDelete) return;
    pressTimer.current = setTimeout(() => {
      setDialogVisible(true);
    }, 600);
  }, [canDelete]);

  const handlePressOut = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  const handleDelete = () => {
    setDialogVisible(false);
    onDelete?.(session.id);
  };

  const typeColor = getTypeColor(session.training_type);
  const startTime = session.start_time.slice(0, 5);
  const endTime = session.end_time.slice(0, 5);
  const displayName = session.description || session.training_type || '';

  return (
    <>
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <View style={[styles.card, { borderRightColor: typeColor }]}>
          <View style={styles.iconWrapper}>
            <View style={[styles.iconBg, { backgroundColor: typeColor + '22' }]}>
              <Text style={styles.iconText}>🏸</Text>
            </View>
          </View>
          <View style={styles.textBlock}>
            {displayName ? (
              <Text style={styles.name} numberOfLines={1}>{displayName}</Text>
            ) : null}
            <Text style={styles.time}>{startTime} – {endTime}</Text>
            {session.location ? (
              <View style={styles.locationRow}>
                <Text style={styles.location} numberOfLines={1}>{session.location}</Text>
                <MaterialCommunityIcons name="map-marker-outline" size={11} color={COLORS.textMuted} />
              </View>
            ) : null}
          </View>
        </View>
      </Pressable>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title style={styles.dialogTitle}>{STRINGS.deleteSession}</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>{STRINGS.deleteConfirmation}</Text>
            <Text style={[styles.dialogText, { fontWeight: 'bold', marginTop: 8 }]}>
              {startTime} — {displayName}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>{STRINGS.cancel}</Button>
            <Button onPress={handleDelete} textColor={COLORS.error}>{STRINGS.delete}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 12,
    borderRightWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrapper: {
    flexShrink: 0,
  },
  iconBg: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 16,
  },
  textBlock: {
    flex: 1,
    alignItems: 'flex-end',
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'right',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 3,
    marginTop: 3,
  },
  location: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'right',
    writingDirection: 'rtl',
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
