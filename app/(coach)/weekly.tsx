import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { STRINGS } from '../../lib/constants';
import type { TrainingSession } from '../../lib/types';
import WeeklyCalendar from '../../components/WeeklyCalendar';
import AddSessionModal from '../../components/AddSessionModal';
import { Snackbar } from 'react-native-paper';

function getSunday(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function CoachWeeklyScreen() {
  const { profile } = useAuth();
  const [weekStart, setWeekStart] = useState(() => getSunday(new Date()));
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState('');

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    const { data, error: fetchError } = await supabase
      .from('training_sessions')
      .select('*')
      .gte('session_date', toISODate(weekStart))
      .lte('session_date', toISODate(weekEnd))
      .order('start_time', { ascending: true });

    if (fetchError) {
      setError(STRINGS.fetchError);
    } else {
      setSessions(data ?? []);
    }
    setIsLoading(false);
  }, [weekStart]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const sessionsByDate = new Map<string, TrainingSession[]>();
  for (const session of sessions) {
    const key = session.session_date;
    if (!sessionsByDate.has(key)) sessionsByDate.set(key, []);
    sessionsByDate.get(key)!.push(session);
  }

  const handlePreviousWeek = () => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };

  const handleNextWeek = () => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };

  const handleSave = async (sessionData: {
    session_date: string;
    start_time: string;
    end_time: string;
    location: string;
    training_type: string;
    description: string;
    notes: string;
  }) => {
    setModalVisible(false);
    const { error: insertError } = await supabase
      .from('training_sessions')
      .insert({
        session_date: sessionData.session_date,
        start_time: sessionData.start_time,
        end_time: sessionData.end_time,
        location: sessionData.location || null,
        training_type: sessionData.training_type || null,
        description: sessionData.description || null,
        notes: sessionData.notes || null,
        created_by: profile?.id,
      });

    if (insertError) {
      setError(STRINGS.saveError);
    } else {
      fetchSessions();
    }
  };

  const handleDelete = async (id: string) => {
    const { error: deleteError } = await supabase
      .from('training_sessions')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError(STRINGS.deleteError);
    } else {
      setSessions((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const greeting = `${STRINGS.greeting}, ${profile?.full_name}`;

  return (
    <>
      <WeeklyCalendar
        greeting={greeting}
        weekStart={weekStart}
        sessionsByDate={sessionsByDate}
        isLoading={isLoading}
        canEdit
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
        onAddSession={() => setModalVisible(true)}
        onDeleteSession={handleDelete}
      />
      <AddSessionModal
        visible={modalVisible}
        weekStart={weekStart}
        onDismiss={() => setModalVisible(false)}
        onSave={handleSave}
      />
      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={3000}
      >
        {error}
      </Snackbar>
    </>
  );
}
