import { Pressable, View, StyleSheet } from 'react-native';
import { Text, Dialog, Portal, Button } from 'react-native-paper';
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
        <View style={[styles.card, { borderRightWidth: 4, borderRightColor: typeColor }]}>
          {/* Time at the top */}
          <Text style={styles.time}>{startTime} - {endTime}</Text>
          {/* Session name */}
          {displayName ? (
            <Text style={styles.name} numberOfLines={2}>{displayName}</Text>
          ) : null}
          {/* Location */}
          {session.location ? (
            <View style={styles.locationRow}>
              <Text style={styles.location} numberOfLines={1}>{session.location}</Text>
              <MaterialCommunityIcons name="map-marker-outline" size={11} color={COLORS.textSecondary} />
            </View>
          ) : null}
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
    borderRadius: 10,
    paddingVertical: 8,
    paddingLeft: 6,
    paddingRight: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  time: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.calendarBlue,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  name: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 2,
  },
  location: {
    fontSize: 10,
    color: COLORS.textSecondary,
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
