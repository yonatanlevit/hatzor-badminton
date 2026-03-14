import { Pressable, View, StyleSheet } from 'react-native';
import { Text, Dialog, Portal, Button } from 'react-native-paper';
import { useState, useRef, useCallback } from 'react';
import { COLORS, STRINGS } from '../lib/constants';
import type { Profile } from '../lib/types';

interface PlayerCardProps {
  player: Profile;
  onEdit: (player: Profile) => void;
  onDelete: (id: string) => void;
}

export default function PlayerCard({ player, onEdit, onDelete }: PlayerCardProps) {
  const [dialogVisible, setDialogVisible] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePressIn = useCallback(() => {
    pressTimer.current = setTimeout(() => {
      setDialogVisible(true);
    }, 600);
  }, []);

  const handlePressOut = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  const handlePress = useCallback(() => {
    onEdit(player);
  }, [onEdit, player]);

  const handleDelete = () => {
    setDialogVisible(false);
    onDelete(player.id);
  };

  return (
    <>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.card}>
          <Text style={styles.name}>{player.full_name}</Text>
          {player.phone ? <Text style={styles.detail}>{player.phone}</Text> : null}
          {player.email ? <Text style={styles.detail}>{player.email}</Text> : null}
        </View>
      </Pressable>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title style={styles.dialogTitle}>{STRINGS.deletePlayer}</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>{STRINGS.deletePlayerConfirm}</Text>
            <Text style={[styles.dialogText, { fontWeight: 'bold', marginTop: 8 }]}>
              {player.full_name}
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
    padding: 14,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  detail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 4,
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
