import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, TextInput, Button, Text } from 'react-native-paper';
import { COLORS, STRINGS } from '../lib/constants';

interface AddGoalModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (title: string, description: string, targetDate: string | null) => void;
}

const ddmmyyyyToISO = (s: string): string | null => {
  if (!s.trim()) return null;
  const parts = s.split('.');
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts;
  if (!dd || !mm || !yyyy || yyyy.length !== 4) return null;
  const d = new Date(`${yyyy}-${mm}-${dd}`);
  if (isNaN(d.getTime())) return null;
  return `${yyyy}-${mm}-${dd}`;
};

export default function AddGoalModal({ visible, onDismiss, onSave }: AddGoalModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [error, setError] = useState('');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTargetDate('');
    setError('');
  };

  const handleDismiss = () => {
    resetForm();
    onDismiss();
  };

  const handleSave = () => {
    if (!title.trim()) {
      setError(STRINGS.fieldRequired);
      return;
    }
    const isoDate = ddmmyyyyToISO(targetDate);
    onSave(title.trim(), description.trim(), isoDate);
    resetForm();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={handleDismiss} contentContainerStyle={styles.modal}>
        <Text variant="titleLarge" style={styles.title}>{STRINGS.addGoal}</Text>

        <TextInput
          label={STRINGS.goalTitle}
          value={title}
          onChangeText={(v) => { setTitle(v); setError(''); }}
          style={styles.input}
          mode="outlined"
          error={!!error}
          outlineColor={COLORS.border}
          activeOutlineColor={COLORS.primary}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          label={STRINGS.goalDescription}
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          mode="outlined"
          multiline
          outlineColor={COLORS.border}
          activeOutlineColor={COLORS.primary}
        />

        <TextInput
          label={STRINGS.goalTargetDate}
          value={targetDate}
          onChangeText={setTargetDate}
          style={styles.input}
          mode="outlined"
          placeholder="DD.MM.YYYY"
          outlineColor={COLORS.border}
          activeOutlineColor={COLORS.primary}
        />

        <View style={styles.actions}>
          <Button mode="text" onPress={handleDismiss} textColor={COLORS.textSecondary}>
            {STRINGS.cancel}
          </Button>
          <Button
            mode="contained"
            onPress={handleSave}
            buttonColor={COLORS.primary}
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
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 10,
    textAlign: 'right',
    writingDirection: 'rtl',
    backgroundColor: COLORS.white,
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
