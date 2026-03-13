import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, IconButton, FAB, ActivityIndicator } from 'react-native-paper';
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
    `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
  return `${fmt(end)} - ${fmt(start)}`;
}

function formatDayMonth(date: Date): string {
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
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

  const days: { date: Date; isoDate: string; dayIndex: number; dateNum: number }[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    days.push({ date, isoDate: toISODate(date), dayIndex: date.getDay(), dateNum: date.getDate() });
  }
  // Reverse for RTL display: Sunday (first day) on the right, Saturday on the left
  const displayDays = [...days].reverse();

  return (
    <View style={styles.container}>
      {/* Header: navigation + title */}
      <View style={styles.header}>
        <IconButton icon="chevron-left" onPress={onNextWeek} iconColor={COLORS.text} size={28} />
        <View style={styles.headerCenter}>
          <Text style={styles.title}>לוח אימונים שבועי</Text>
          <Text style={styles.dateRange}>{formatWeekRange(weekStart)}</Text>
        </View>
        <IconButton icon="chevron-right" onPress={onPreviousWeek} iconColor={COLORS.text} size={28} />
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

      {/* Day columns header row */}
      <View style={styles.dayHeadersRow}>
        {displayDays.map(({ isoDate, dayIndex, date }) => {
          const isToday = isoDate === todayISO;
          return (
            <View key={isoDate} style={styles.dayHeaderCell}>
              <Text style={[styles.dayHeaderName, isToday && styles.dayHeaderNameToday]}>
                {STRINGS.days[dayIndex]}
              </Text>
              <Text style={[styles.dayHeaderDate, isToday && styles.dayHeaderDateToday]}>
                {formatDayMonth(date)}
              </Text>
              {isToday && <View style={styles.todayIndicator} />}
            </View>
          );
        })}
      </View>

      {/* Divider */}
      <View style={styles.headerDivider} />

      {/* Day columns with session cards */}
      {isLoading ? (
        <ActivityIndicator style={styles.loader} color={COLORS.calendarBlue} size="large" />
      ) : (
        <ScrollView style={styles.columnsScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.columnsContainer}>
            {displayDays.map(({ isoDate }, idx) => {
              const daySessions = (sessionsByDate.get(isoDate) ?? [])
                .slice()
                .sort((a, b) => a.start_time.localeCompare(b.start_time));
              const isLast = idx === displayDays.length - 1;
              return (
                <View key={isoDate} style={styles.dayColumnWrap}>
                  <View style={styles.dayColumn}>
                    {daySessions.length > 0 ? (
                      daySessions.map(session => (
                        <SessionCard
                          key={session.id}
                          session={session}
                          canDelete={canEdit}
                          onDelete={onDeleteSession}
                        />
                      ))
                    ) : (
                      <View style={styles.emptyColumn} />
                    )}
                  </View>
                  {!isLast && <View style={styles.columnSeparator} />}
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* FAB for adding sessions */}
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
    backgroundColor: COLORS.white,
    paddingTop: 50,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  headerCenter: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  dateRange: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  // Legend
  legend: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
  },
  // Day headers
  dayHeadersRow: {
    flexDirection: 'row',
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  dayHeaderCell: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    paddingBottom: 6,
  },
  dayHeaderName: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  dayHeaderNameToday: {
    color: COLORS.calendarBlue,
    fontWeight: '700',
  },
  dayHeaderDate: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  dayHeaderDateToday: {
    color: COLORS.calendarBlue,
    fontWeight: '700',
  },
  todayIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 24,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.calendarBlue,
  },
  headerDivider: {
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  // Columns
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  columnsScroll: {
    flex: 1,
  },
  columnsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 2,
    paddingTop: 12,
    paddingBottom: 80,
  },
  dayColumnWrap: {
    flex: 1,
    flexDirection: 'row',
  },
  dayColumn: {
    flex: 1,
    paddingHorizontal: 4,
    gap: 8,
  },
  columnSeparator: {
    width: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 4,
  },
  emptyColumn: {
    height: 40,
  },
  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: COLORS.calendarBlue,
    borderRadius: 28,
    elevation: 6,
  },
});
