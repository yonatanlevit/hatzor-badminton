# Hatzor Badminton Club App

## Project Overview
A React Native + Expo mobile app for managing a weekly badminton training schedule for Hatzor Badminton Club. Two roles: Coach/Admin and Player.

## Tech Stack
- React Native + Expo SDK 54 (managed workflow) — upgrade to SDK 55 when preparing for production or when Expo Go adds SDK 55 support
- Expo Router (file-based navigation)
- Supabase (auth + PostgreSQL + RLS)
- TypeScript
- React Native Paper (UI components)
- Testing on web (localhost:8081), will build for iOS/Android with EAS when ready

## Project Structure
```
app/
  _layout.tsx          → Root layout: RTL, AuthProvider, role-based redirect
  index.tsx            → Entry point / redirect
  (auth)/login.tsx     → Login screen (Hebrew)
  (coach)/             → Coach tabs: weekly, players, settings + custom tabBar with logout
  (coach)/player/[id].tsx → Individual player detail page (conversation logs, goals)
  (player)/            → Player tabs: weekly, tournaments, chats, notifications + custom tabBar with logout
components/
  WeeklyCalendar.tsx   → Shared weekly calendar (day columns, RTL, legend, FAB)
  SessionCard.tsx      → Session card with color-coded type border, long-press delete
  AddSessionModal.tsx  → Modal form: day picker, type chips, time/location/notes
  PlayerCard.tsx       → Player card with tap-to-edit, long-press delete
  EditPlayerModal.tsx  → Modal form: edit player name & phone
  ConversationLogsSection.tsx → Display conversation logs for a player
  AddConversationLogModal.tsx → Modal form: add conversation log
  GoalsSection.tsx     → Display goals for a player
  AddGoalModal.tsx     → Modal form: add goal
contexts/
  AuthContext.tsx       → Auth state, login/logout, profile fetching
lib/
  constants.ts         → Colors, Hebrew strings, training types with colors
  supabase.ts          → Supabase client (SecureStore on mobile, localStorage on web)
  types.ts             → TypeScript interfaces matching DB schema
supabase/
  schema.sql           → Database schema (already deployed)
```

## Supabase
- Project ref: xwnxpycygxxesmxvcfap
- Tables: profiles, training_sessions, announcements, conversation_logs, goals
- Custom function: `is_coach()` — SECURITY DEFINER to avoid RLS recursion
- Coach user UUID: de8098ad-ae85-4dc6-a836-648686680499

## Style Guidelines
- ENTIRE UI is in Hebrew (RTL)
- RTL everywhere: writingDirection 'rtl', textAlign 'right'
- Colors: primary=#1B5E20 (dark green), accent=#FFD600 (yellow), background=#FAFAFA, calendarBlue=#1976D2
- Clean, minimal sports-app aesthetic
- React Native Paper components with green/yellow theme
- Top of every main screen: "שלום, {full_name}" greeting
- All Hebrew strings centralized in lib/constants.ts STRINGS object

## Commands
- `npx expo start` — start dev server (web: http://localhost:8081)
- `npx tsc --noEmit` — TypeScript check
- `npx expo export --platform android` — test Android bundle

## Development Phases
- [x] Phase 0 — Project setup, auth, navigation, placeholders
- [x] Phase 1 — Coach weekly board (calendar, add/delete sessions)
- [x] Phase 2 — Player weekly board (read-only, shared component)
- [x] Phase 3 — Player management (coach side)
- [ ] Phase 4 — Push notifications
- [ ] Phase 5 — Settings & polish
