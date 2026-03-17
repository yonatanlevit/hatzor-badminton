export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: 'player' | 'coach' | 'admin';
  push_token: string | null;
  created_at: string;
}

export interface TrainingSession {
  id: string;
  session_date: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  location: string | null;
  training_type: string | null;
  description: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  created_by: string | null;
  created_at: string;
}

export interface ConversationLog {
  id: string;
  player_id: string;
  coach_id: string;
  conversation_date: string;
  summary: string;
  created_at: string;
}

export interface Goal {
  id: string;
  player_id: string;
  created_by: string;
  title: string;
  description: string | null;
  status: 'active' | 'completed' | 'cancelled';
  target_date: string | null;
  created_at: string;
  updated_at: string;
}
