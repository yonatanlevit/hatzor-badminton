import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, STRINGS } from '../../lib/constants';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        <Text variant="headlineLarge" style={styles.title}>
          {STRINGS.appName}
        </Text>

        <TextInput
          label={STRINGS.email}
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          right={<TextInput.Icon icon="email" />}
        />

        <TextInput
          label={STRINGS.password}
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
          right={<TextInput.Icon icon="lock" />}
        />

        {error ? (
          <HelperText type="error" visible={!!error} style={styles.error}>
            {error}
          </HelperText>
        ) : null}

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          {STRINGS.login}
        </Button>
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
    paddingHorizontal: 32,
  },
  title: {
    textAlign: 'center',
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: 48,
  },
  input: {
    marginBottom: 16,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  error: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  button: {
    marginTop: 16,
    paddingVertical: 4,
    backgroundColor: COLORS.primary,
  },
  buttonLabel: {
    fontSize: 18,
  },
});
