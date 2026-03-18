import { View, StyleSheet, Pressable, Text, Platform, Alert } from 'react-native';
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
      Alert.alert(
        'יציאה',
        'האם אתה בטוח שאת/ה רוצה לצאת?',
        [
          { text: 'ביטול', style: 'cancel' },
          { text: 'יציאה', style: 'destructive', onPress: () => logout() },
        ]
      );
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
            return (
              <Pressable
                key={route.key}
                onPress={() => {
                  if (!isFocused) navigation.navigate(route.name);
                }}
                style={styles.tab}
              >
                {isFocused && <View style={styles.activeIndicator} />}
                <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
                  <MaterialCommunityIcons
                    name={config.icon as any}
                    size={22}
                    color={isFocused ? COLORS.primary : COLORS.textMuted}
                  />
                </View>
                <Text style={[styles.tabLabel, isFocused ? styles.tabLabelActive : styles.tabLabelInactive]}>
                  {config.title}
                </Text>
              </Pressable>
            );
          })}
          <Pressable onPress={handleLogoutPress} style={styles.tab}>
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons name="logout" size={22} color={COLORS.textMuted} />
            </View>
            <Text style={[styles.tabLabel, styles.tabLabelInactive]}>יציאה</Text>
          </Pressable>
        </View>
      )}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="weekly" options={{ title: STRINGS.weeklyBoard }} />
      <Tabs.Screen name="players" options={{ title: STRINGS.players }} />
      <Tabs.Screen name="settings" options={{ title: STRINGS.settings }} />
      <Tabs.Screen name="player/[id]" options={{ href: null, headerShown: false }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 20,
    paddingTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 28,
    height: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: COLORS.primary,
  },
  iconWrap: {
    width: 40,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  iconWrapActive: {
    backgroundColor: COLORS.primaryLight,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: COLORS.primary,
  },
  tabLabelInactive: {
    color: COLORS.textMuted,
  },
});
