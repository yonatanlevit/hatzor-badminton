import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, TextInput, Button, Text } from 'react-native-paper';
import { COLORS, STRINGS } from '../lib/constants';

interface AddConversationLogModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (conversationDate: string, summary: string) => void;
}

const todayDDMMYYYY = () => {
  const d = new Date();
  return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
};

const ddmmyyyyToISO = (s: string): string | null => {
  const parts = s.split('.');
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts;
  if (!dd || !mm || !yyyy || yyyy.length !== 4) return null;
  const d = new Date(`${yyyy}-${mm}-${dd}`);
  if (isNaN(d.getTime())) return null;
  return `${yyyy}-${mm}-${dd}`;
};

export default function AddConversationLogModal({ visible, onDismiss, onSave }: AddConversationLogModalProps) {
  const [date, setDate] = useState(todayDDMMYYYY());
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');

  const resetForm = () => {
    setDate(todayDDMMYYYY());
    setSummary('');
    setError('');
  };

  const handleDismiss = () => {
    resetForm();
    onDismiss();
  };

  const handleSave = () => {
    if (!summary.trim()) {
      setError(STRINGS.fieldRequired);
      return;
    }
    const isoDate = ddmmyyyyToISO(date);
    if (!isoDate) {
      setError(STRINGS.fieldRequired);
      return;
    }
    onSave(isoDate, summary.trim());
    resetForm();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={handleDismiss} contentContainerStyle={styles.modal}>
        <Text variant="titleLarge" style={styles.title}>{STRINGS.addConversationLog}</Text>

        <TextInput
          label={STRINGS.conversationDate}
          value={date}
          onChangeText={setDate}
          style={styles.input}
          mode="outlined"
          placeholder="DD.MM.YYYY"
          outlineColor={COLORS.border}
          activeOutlineColor={COLORS.primary}
        />

        <TextInput
          label={STRINGS.conversationSummary}
          value={summary}
          onChangeText={(v) => { setSummary(v); setError(''); }}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={4}
          error={!!error}
          outlineColor={COLORS.border}
          activeOutlineColor={COLORS.primary}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
