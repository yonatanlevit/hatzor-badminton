import { View, StyleSheet, ScrollView, Text, Pressable } from 'react-native';
import { IconButton, FAB, ActivityIndicator } from 'react-native-paper';
import { COLORS, STRINGS, TRAINING_TYPES } from '../lib/constants';
import type { TrainingSession } from '../lib/types';
import SessionCard from './SessionCard';

interface WeeklyCalendarProps {
  greeting: string;
  weekStart: Date;
  sessionsByDate: Map<string, TrainingSession[]>;
  isLoading: boolean;
  canEdit?: boolean;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onAddSession?: () => void;
  onDeleteSession?: (id: string) => void;
}

function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatWeekRange(start: Date): string {
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) =>
    `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  return `${fmt(start)} – ${fmt(end)}`;
}

function getMonthYearHe(date: Date): string {
  const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

export default function WeeklyCalendar({
  greeting,
  weekStart,
  sessionsByDate,
  isLoading,
  canEdit,
  onPreviousWeek,
  onNextWeek,
  onAddSession,
  onDeleteSession,
}: WeeklyCalendarProps) {
  const todayISO = toISODate(new Date());

  const days: { date: Date; isoDate: string; dayIndex: number }[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    days.push({ date, isoDate: toISODate(date), dayIndex: date.getDay() });
  }
  // RTL: show Sunday (index 6) first = rightmost, reversed for display
  const displayDays = [...days].reverse();

  // Build agenda: only days with sessions + today
  const agendaDays = displayDays.filter(d =>
    (sessionsByDate.get(d.isoDate) ?? []).length > 0 || d.isoDate === todayISO
  );

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="chevron-left" onPress={onNextWeek} iconColor={COLORS.primary} size={26} />
        <View style={styles.headerCenter}>
          <Text style={styles.title}>לוח אימונים שבועי</Text>
          <Text style={styles.dateRange}>{getMonthYearHe(weekStart)} • {formatWeekRange(weekStart)}</Text>
        </View>
        <IconButton icon="chevron-right" onPress={onPreviousWeek} iconColor={COLORS.primary} size={26} />
      </View>

      {/* Day chips row */}
      <View style={styles.dayChipsRow}>
        {displayDays.map(({ isoDate, dayIndex, date }) => {
          const isToday = isoDate === todayISO;
          const hasSessions = (sessionsByDate.get(isoDate) ?? []).length > 0;
          return (
            <View key={isoDate} style={[styles.dayChip, isToday && styles.dayChipToday]}>
              <Text style={[styles.dayChipName, isToday && styles.dayChipTextToday]}>
                {STRINGS.days[dayIndex].slice(0, 2)}
              </Text>
              <Text style={[styles.dayChipDate, isToday && styles.dayChipTextToday]}>
                {date.getDate()}
              </Text>
              {hasSessions && (
                <View style={[styles.dayDot, isToday && styles.dayDotToday]} />
              )}
            </View>
          );
        })}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {TRAINING_TYPES.map(type => (
          <View key={type.key} style={styles.legendItem}>
            <Text style={styles.legendLabel}>{type.label}</Text>
            <View style={[styles.legendDot, { backgroundColor: type.color }]} />
          </View>
        ))}
      </View>

      <View style={styles.divider} />

      {/* Agenda content */}
      {isLoading ? (
        <ActivityIndicator style={styles.loader} color={COLORS.primary} size="large" />
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {agendaDays.length === 0 ? (
            <View style={styles.emptyWeek}>
              <Text style={styles.emptyEmoji}>📅</Text>
              <Text style={styles.emptyText}>{STRINGS.noSessions}</Text>
            </View>
          ) : (
            agendaDays.map(({ isoDate, dayIndex, date }) => {
              const daySessions = (sessionsByDate.get(isoDate) ?? [])
                .slice()
                .sort((a, b) => a.start_time.localeCompare(b.start_time));
              const isToday = isoDate === todayISO;
              const dayLabel = `${STRINGS.days[dayIndex]}, ${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
              return (
                <View key={isoDate} style={styles.agendaDay}>
                  <View style={styles.agendaDayHeader}>
                    <View style={[styles.agendaDot, isToday && styles.agendaDotToday]} />
                    <Text style={[styles.agendaDayLabel, isToday && styles.agendaDayLabelToday]}>
                      {dayLabel}{isToday ? ' — היום' : ''}
                    </Text>
                  </View>
                  <View style={styles.agendaSessions}>
                    {daySessions.length === 0 ? (
                      <View style={styles.noSessionsDay}>
                        <Text style={styles.noSessionsText}>אין אימונים</Text>
                      </View>
                    ) : (
                      daySessions.map(session => (
                        <SessionCard
                          key={session.id}
                          session={session}
                          canDelete={canEdit}
                          onDelete={onDeleteSession}
                        />
                      ))
                    )}
                  </View>
                </View>
              );
            })
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}

      {canEdit && (
        <FAB
          icon="plus"
          style={styles.fab}
          color={COLORS.white}
          onPress={onAddSession}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: 4,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerCenter: {
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  dateRange: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  dayChipsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingBottom: 12,
    paddingTop: 8,
    gap: 4,
  },
  dayChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 12,
    gap: 2,
  },
  dayChipToday: {
    backgroundColor: COLORS.primary,
  },
  dayChipName: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  dayChipDate: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  dayChipTextToday: {
    color: COLORS.white,
  },
  dayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  dayDotToday: {
    backgroundColor: COLORS.white,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexWrap: 'wrap',
    backgroundColor: COLORS.background,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 11,
    color: COLORS.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 60,
  },
  scroll: {
    flex: 1,
  },
  emptyWeek: {
    paddingTop: 80,
    alignItems: 'center',
    gap: 12,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  agendaDay: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  agendaDayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    justifyContent: 'flex-end',
  },
  agendaDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.divider,
  },
  agendaDotToday: {
    backgroundColor: COLORS.primary,
  },
  agendaDayLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  agendaDayLabelToday: {
    color: COLORS.primary,
  },
  agendaSessions: {
    gap: 8,
  },
  noSessionsDay: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  noSessionsText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    elevation: 6,
  },
});
