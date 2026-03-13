import { View, StyleSheet, Pressable, Text, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, STRINGS } from '../../lib/constants';
import { useAuth } from '../../contexts/AuthContext';

const TAB_CONFIG: Record<string, { title: string; icon: string }> = {
  weekly: { title: STRINGS.weeklyBoard, icon: 'calendar-week' },
  players: { title: STRINGS.players, icon: 'account-group' },
  settings: { title: STRINGS.settings, icon: 'cog' },
};

export default function CoachLayout() {
  const { logout } = useAuth();

  const handleLogoutPress = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('האם אתה בטוח שאתה רוצה להתנתק?')) {
        logout();
      }
    } else {
      logout();
    }
  };

  return (
    <Tabs
      tabBar={({ state, navigation }) => (
        <View style={styles.tabBar}>
          {state.routes.map((route, index) => {
            const config = TAB_CONFIG[route.name];
            if (!config) return null;
            const isFocused = state.index === index;
            const color = isFocused ? COLORS.primary : COLORS.textSecondary;
            return (
              <Pressable
                key={route.key}
                onPress={() => {
                  if (!isFocused) navigation.navigate(route.name);
                }}
                style={styles.tab}
              >
                <MaterialCommunityIcons name={config.icon as any} size={24} color={color} />
                <Text style={[styles.tabLabel, { color }]}>{config.title}</Text>
              </Pressable>
            );
          })}
          <Pressable onPress={handleLogoutPress} style={styles.tab}>
            <Text style={{ fontSize: 22 }}>🚪</Text>
            <Text style={[styles.tabLabel, { color: COLORS.error }]}>יציאה</Text>
          </Pressable>
        </View>
      )}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="weekly" options={{ title: STRINGS.weeklyBoard }} />
      <Tabs.Screen name="players" options={{ title: STRINGS.players }} />
      <Tabs.Screen name="settings" options={{ title: STRINGS.settings }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 6,
    paddingTop: 6,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});
