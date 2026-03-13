import { StyleSheet, ScrollView, View, Pressable } from 'react-native';
import { Modal, Portal, TextInput, Button, Text } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { COLORS, STRINGS, TRAINING_TYPES } from '../lib/constants';

interface AddSessionModalProps {
  visible: boolean;
  weekStart: Date;
  onDismiss: () => void;
  onSave: (session: {
    session_date: string;
    start_time: string;
    end_time: string;
    location: string;
    training_type: string;
    description: string;
    notes: string;
  }) => void;
}

function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatShortDate(date: Date): string {
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
}

export default function AddSessionModal({ visible, weekStart, onDismiss, onSave }: AddSessionModalProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ startTime?: string; endTime?: string; date?: string }>({});

  // Build week days
  const weekDays: { date: Date; iso: string; dayIndex: number }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    weekDays.push({ date: d, iso: toISODate(d), dayIndex: d.getDay() });
  }

  // Default to today if in current week
  useEffect(() => {
    if (visible) {
      const todayISO = toISODate(new Date());
      const inWeek = weekDays.find(d => d.iso === todayISO);
      setSelectedDate(inWeek ? todayISO : weekDays[0].iso);
    }
  }, [visible, weekStart]);

  const resetForm = () => {
    setSelectedDate('');
    setSelectedType('');
    setStartTime('');
    setEndTime('');
    setDescription('');
    setLocation('');
    setNotes('');
    setErrors({});
  };

  const handleDismiss = () => {
    resetForm();
    onDismiss();
  };

  const validateTime = (value: string) => /^\d{2}:\d{2}$/.test(value);

  const handleSave = () => {
    const newErrors: typeof errors = {};
    if (!selectedDate) newErrors.date = STRINGS.fieldRequired;
    if (!validateTime(startTime)) newErrors.startTime = STRINGS.fieldRequired;
    if (!validateTime(endTime)) newErrors.endTime = STRINGS.fieldRequired;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave({
      session_date: selectedDate,
      start_time: startTime,
      end_time: endTime,
      location,
      training_type: selectedType,
      description,
      notes,
    });
    resetForm();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={handleDismiss} contentContainerStyle={styles.modal}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text variant="titleLarge" style={styles.title}>{STRINGS.addSession}</Text>

          {/* Day selector */}
          <Text variant="labelLarge" style={styles.sectionLabel}>{STRINGS.sessionDate}</Text>
          <View style={styles.chipsRow}>
            {weekDays.map(({ iso, dayIndex, date }) => {
              const active = selectedDate === iso;
              return (
                <Pressable
                  key={iso}
                  onPress={() => { setSelectedDate(iso); setErrors(e => ({ ...e, date: undefined })); }}
                  style={[styles.dayChip, active && styles.dayChipActive]}
                >
                  <Text style={[styles.dayChipLabel, active && styles.dayChipLabelActive]}>
                    {STRINGS.days[dayIndex]}
                  </Text>
                  <Text style={[styles.dayChipDate, active && styles.dayChipLabelActive]}>
                    {formatShortDate(date)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}

          {/* Training type selector */}
          <Text variant="labelLarge" style={styles.sectionLabel}>{STRINGS.trainingType}</Text>
          <View style={styles.chipsRow}>
            {TRAINING_TYPES.map(type => {
              const active = selectedType === type.key;
              return (
                <Pressable
                  key={type.key}
                  onPress={() => setSelectedType(active ? '' : type.key)}
                  style={[styles.typeChip, { borderColor: type.color }, active && { backgroundColor: type.color }]}
                >
                  <Text style={[styles.typeChipLabel, active && styles.typeChipLabelActive]}>
                    {type.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Description (session name) */}
          <TextInput
            label={STRINGS.description}
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            mode="outlined"
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.calendarBlue}
          />

          {/* Time inputs */}
          <View style={styles.timeRow}>
            <TextInput
              label={STRINGS.endTime}
              value={endTime}
              onChangeText={(v) => { setEndTime(v); setErrors(e => ({ ...e, endTime: undefined })); }}
              placeholder="HH:MM"
              style={[styles.input, styles.timeInput]}
              mode="outlined"
              error={!!errors.endTime}
              outlineColor={COLORS.border}
              activeOutlineColor={COLORS.calendarBlue}
            />
            <TextInput
              label={STRINGS.startTime}
              value={startTime}
              onChangeText={(v) => { setStartTime(v); setErrors(e => ({ ...e, startTime: undefined })); }}
              placeholder="HH:MM"
              style={[styles.input, styles.timeInput]}
              mode="outlined"
              error={!!errors.startTime}
              outlineColor={COLORS.border}
              activeOutlineColor={COLORS.calendarBlue}
            />
          </View>

          {/* Location */}
          <TextInput
            label={STRINGS.location}
            value={location}
            onChangeText={setLocation}
            style={styles.input}
            mode="outlined"
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.calendarBlue}
          />

          {/* Notes */}
          <TextInput
            label={STRINGS.notes}
            value={notes}
            onChangeText={setNotes}
            style={styles.input}
            mode="outlined"
            multiline
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.calendarBlue}
          />

          {/* Actions */}
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
        </ScrollView>
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
  sectionLabel: {
    textAlign: 'right',
    writingDirection: 'rtl',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 4,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 6,
    marginBottom: 12,
  },
  dayChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    minWidth: 52,
  },
  dayChipActive: {
    backgroundColor: COLORS.calendarBlue,
    borderColor: COLORS.calendarBlue,
  },
  dayChipLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text,
  },
  dayChipDate: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  dayChipLabelActive: {
    color: COLORS.white,
  },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
  },
  typeChipLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  typeChipLabelActive: {
    color: COLORS.white,
  },
  input: {
    marginBottom: 10,
    textAlign: 'right',
    writingDirection: 'rtl',
    backgroundColor: COLORS.white,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  timeInput: {
    flex: 1,
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
