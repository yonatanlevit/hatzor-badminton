import { Pressable, View, StyleSheet, Text } from 'react-native';
import { Dialog, Portal, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useRef, useCallback } from 'react';
import { COLORS, STRINGS } from '../lib/constants';
import type { Profile } from '../lib/types';

interface PlayerCardProps {
  player: Profile;
  onEdit: (player: Profile) => void;
  onDelete: (id: string) => void;
}

const AVATAR_COLORS = ['#E8EAF6', '#E3F2FD', '#FFF3E0', '#F3E5F5', '#E8EAF6', '#FCE4EC'];
const AVATAR_TEXT_COLORS = ['#3949AB', '#1565C0', '#E65100', '#6A1B9A', '#283593', '#880E4F'];

function getAvatarIndex(name: string): number {
  return name.charCodeAt(0) % AVATAR_COLORS.length;
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

  const avatarIdx = getAvatarIndex(player.full_name);
  const initial = player.full_name.charAt(0);

  return (
    <>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: AVATAR_COLORS[avatarIdx] }]}>
          <Text style={[styles.avatarText, { color: AVATAR_TEXT_COLORS[avatarIdx] }]}>
            {initial}
          </Text>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.name}>{player.full_name}</Text>
          <View style={styles.detailRow}>
            {player.phone ? (
              <View style={styles.detailChip}>
                <MaterialCommunityIcons name="phone-outline" size={12} color={COLORS.textMuted} />
                <Text style={styles.detailText}>{player.phone}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Arrow */}
        <MaterialCommunityIcons name="chevron-left" size={20} color={COLORS.divider} />
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
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
  },
  info: {
    flex: 1,
    alignItems: 'flex-end',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 6,
    flexWrap: 'wrap',
  },
  detailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  detailText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    writingDirection: 'ltr',
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
