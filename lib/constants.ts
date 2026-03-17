export const COLORS = {
  primary: '#1B5E20',
  accent: '#FFD600',
  background: '#FAFAFA',
  white: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  error: '#D32F2F',
  border: '#E0E0E0',
  calendarBlue: '#1976D2',
};

export const TRAINING_TYPES = [
  { key: 'כוח', label: 'כוח', color: '#2196F3' },
  { key: 'סיבולת', label: 'סיבולת', color: '#4CAF50' },
  { key: 'טכני', label: 'טכני', color: '#FF9800' },
  { key: 'משחק', label: 'משחק', color: '#F44336' },
  { key: 'שחזור', label: 'שחזור', color: '#9C27B0' },
] as const;

export const HOUR_HEIGHT = 65;
export const START_HOUR = 6;
export const END_HOUR = 22;
export const TIME_COL_WIDTH = 46;

export const STRINGS = {
  appName: 'בדמינטון חצור',
  login: 'כניסה',
  email: 'אימייל',
  password: 'סיסמא',
  logout: 'התנתק',
  greeting: 'שלום',
  weeklyBoard: 'לוח שבועי',
  players: 'שחקנים',
  settings: 'הגדרות',
  tournaments: 'לוח תחרויות',
  conversationLogs: 'שיחות',
  notifications: 'התראות',
  comingSoon: 'בקרוב',
  loginError: 'שגיאה בהתחברות',
  invalidCredentials: 'אימייל או סיסמא שגויים',
  fieldRequired: 'שדה חובה',
  loading: 'טוען...',
  // Day names (Sunday first — Israeli standard)
  days: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'] as const,
  // Weekly calendar
  previousWeek: 'שבוע קודם',
  nextWeek: 'שבוע הבא',
  noSessions: 'אין אימונים השבוע',
  // Add session form
  addSession: 'הוספת אימון',
  sessionDate: 'תאריך',
  startTime: 'שעת התחלה',
  endTime: 'שעת סיום',
  location: 'מיקום',
  trainingType: 'סוג אימון',
  description: 'תיאור',
  notes: 'הערות',
  save: 'שמור',
  cancel: 'ביטול',
  // Delete confirmation
  deleteSession: 'מחיקת אימון',
  deleteConfirmation: 'האם למחוק את האימון?',
  delete: 'מחק',
  // Player management
  noPlayers: 'אין שחקנים רשומים',
  editPlayer: 'עריכת שחקן',
  deletePlayer: 'מחיקת שחקן',
  deletePlayerConfirm: 'האם למחוק את השחקן?',
  fullName: 'שם מלא',
  phone: 'טלפון',
  updateError: 'שגיאה בעדכון',
  // Errors
  saveError: 'שגיאה בשמירה',
  deleteError: 'שגיאה במחיקה',
  fetchError: 'שגיאה בטעינת נתונים',
  // Player detail
  playerDetail: 'פרטי שחקן',
  tournamentsTab: 'תחרויות',
  conversationsTab: 'שיחות',
  goalsTab: 'יעדים',
  // Conversation logs
  noConversationLogs: 'אין שיחות מתועדות',
  addConversationLog: 'הוספת שיחה',
  conversationDate: 'תאריך שיחה',
  conversationSummary: 'תקציר',
  deleteConversationLog: 'מחיקת שיחה',
  deleteConversationLogConfirm: 'האם למחוק את השיחה?',
  conversationLogSaveError: 'שגיאה בשמירת שיחה',
  // Goals
  noGoals: 'אין יעדים',
  addGoal: 'הוספת יעד',
  goalTitle: 'כותרת',
  goalDescription: 'תיאור',
  statusActive: 'פעיל',
  statusCompleted: 'הושלם',
  statusCancelled: 'בוטל',
  deleteGoal: 'מחיקת יעד',
  deleteGoalConfirm: 'האם למחוק את היעד?',
  goalTargetDate: 'תאריך יעד',
  createdByCoach: 'נוצר ע״י מאמן',
  createdByPlayer: 'נוצר ע״י שחקן',
  goalSaveError: 'שגיאה בשמירת יעד',
  goalUpdateError: 'שגיאה בעדכון יעד',
  tournamentsComingSoon: 'לוח תחרויות - בקרוב',
  markCompleted: 'סמן כהושלם',
  markCancelled: 'בטל יעד',
  reactivate: 'הפעל מחדש',
};

export const GOAL_STATUSES = [
  { key: 'active' as const, label: 'פעיל', color: '#4CAF50' },
  { key: 'completed' as const, label: 'הושלם', color: '#1976D2' },
  { key: 'cancelled' as const, label: 'בוטל', color: '#9E9E9E' },
];
