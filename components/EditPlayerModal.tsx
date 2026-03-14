import { StyleSheet, View } from 'react-native';
import { Modal, Portal, TextInput, Button, Text } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { COLORS, STRINGS } from '../lib/constants';
import type { Profile } from '../lib/types';

interface EditPlayerModalProps {
  visible: boolean;
  player: Profile | null;
  onDismiss: () => void;
  onSave: (id: string, updates: { full_name: string; phone: string }) => void;
}

export default function EditPlayerModal({ visible, player, onDismiss, onSave }: EditPlayerModalProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (player) {
      setFullName(player.full_name);
      setPhone(player.phone || '');
      setError('');
    }
  }, [player]);

  const handleDismiss = () => {
    setError('');
    onDismiss();
  };

  const handleSave = () => {
    if (!fullName.trim()) {
      setError(STRINGS.fieldRequired);
      return;
    }
    onSave(player!.id, { full_name: fullName.trim(), phone: phone.trim() });
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={handleDismiss} contentContainerStyle={styles.modal}>
        <Text variant="titleLarge" style={styles.title}>{STRINGS.editPlayer}</Text>

        <TextInput
          label={STRINGS.fullName}
          value={fullName}
          onChangeText={(v) => { setFullName(v); setError(''); }}
          style={styles.input}
          mode="outlined"
          error={!!error}
          outlineColor={COLORS.border}
          activeOutlineColor={COLORS.calendarBlue}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          label={STRINGS.phone}
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          mode="outlined"
          outlineColor={COLORS.border}
          activeOutlineColor={COLORS.calendarBlue}
        />

        <Text variant="labelLarge" style={styles.emailLabel}>{STRINGS.email}</Text>
        <Text style={styles.emailValue}>{player?.email}</Text>

        <View style={styles.actions}>
          <Button mode="text" onPress={handleDismiss} textColor={COLORS.textSecondary}>
            {STRINGS.cancel}
          </Button>
          <Button
            mode="contained"
            onPress={handleSave}
            buttonColor={COLORS.calendarBlue}
            style={styles.saveBtn}
          >
            {STRINGS.save}
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: COLORS.white,
    margin: 16,
    padding: 20,
    borderRadius: 16,
    maxHeight: '90%',
  },
  title: {
    textAlign: 'center',
    color: COLORS.calendarBlue,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 10,
    textAlign: 'right',
    writingDirection: 'rtl',
    backgroundColor: COLORS.white,
  },
  emailLabel: {
    textAlign: 'right',
    writingDirection: 'rtl',
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 4,
  },
  emailValue: {
    textAlign: 'right',
    writingDirection: 'rtl',
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtn: {
    borderRadius: 24,
    paddingHorizontal: 12,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 8,
  },
});
