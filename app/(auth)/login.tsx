import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, Image } from 'react-native';
import { HelperText } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, STRINGS } from '../../lib/constants';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError(STRINGS.fieldRequired);
      return;
    }
    setLoading(true);
    setError('');
    const { error: loginError } = await login(email.trim(), password);
    if (loginError) {
      setError(STRINGS.invalidCredentials);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>

        {/* Logo / Branding area */}
        <View style={styles.logoArea}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoEmoji}>🏸</Text>
          </View>
          <Text style={styles.appName}>{STRINGS.appName}</Text>
          <Text style={styles.appSubtitle}>מועדון בדמינטון</Text>
          <View style={styles.dotRow}>
            <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />
            <View style={[styles.dot, { backgroundColor: COLORS.accent }]} />
            <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />
          </View>
        </View>

        {/* Form card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>כניסה לחשבון</Text>

          {/* Email */}
          <View style={[styles.inputWrapper, focusedField === 'email' && styles.inputWrapperFocused]}>
            <MaterialCommunityIcons
              name="email-outline"
              size={20}
              color={focusedField === 'email' ? COLORS.primary : COLORS.textMuted}
              style={styles.inputIcon}
            />
            <TextInput
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              placeholder={STRINGS.email}
              placeholderTextColor={COLORS.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.textInput}
              textAlign="right"
            />
          </View>

          {/* Password */}
          <View style={[styles.inputWrapper, focusedField === 'password' && styles.inputWrapperFocused]}>
            <Pressable onPress={() => setShowPassword(s => !s)} style={styles.eyeButton}>
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={COLORS.textMuted}
              />
            </Pressable>
            <TextInput
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              placeholder={STRINGS.password}
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry={!showPassword}
              style={styles.textInput}
              textAlign="right"
            />
            <MaterialCommunityIcons
              name="lock-outline"
              size={20}
              color={focusedField === 'password' ? COLORS.primary : COLORS.textMuted}
              style={styles.inputIcon}
            />
          </View>

          {error ? (
            <HelperText type="error" visible={!!error} style={styles.errorText}>
              {error}
            </HelperText>
          ) : null}

          {/* Login button */}
          <Pressable
            onPress={handleLogin}
            disabled={loading}
            style={({ pressed }) => [styles.loginButton, (pressed || loading) && styles.loginButtonPressed]}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'מתחבר...' : STRINGS.login}
            </Text>
            {!loading && (
              <MaterialCommunityIcons name="arrow-left" size={18} color={COLORS.white} />
            )}
          </Pressable>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>© 2026 מועדון בדמינטון חצור</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logoEmoji: {
    fontSize: 36,
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: 14,
  },
  dotRow: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'right',
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F5',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 14,
    marginBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  inputWrapperFocused: {
    borderBottomColor: COLORS.primary,
  },
  inputIcon: {
    marginRight: 0,
  },
  eyeButton: {
    padding: 4,
    marginLeft: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
    paddingHorizontal: 10,
    writingDirection: 'rtl',
  },
  errorText: {
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 8,
    marginTop: -4,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
  },
  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: COLORS.textMuted,
    opacity: 0.6,
  },
});
