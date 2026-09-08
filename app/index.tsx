import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AuthScaffold } from '@/components/AuthScaffold';
import { FormError } from '@/components/FormError';
import { LoginIllustration } from '@/components/LoginIllustration';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { TextField } from '@/components/ui/TextField';
import { Colors, Fonts, FontSizes } from '@/constants/Theme';
import { supabase } from '@/lib/supabase';
import { mapAuthError } from '@/lib/authErrors';
import { EMAIL_RE } from '@/lib/password';
import { useCooldown } from '@/lib/useCooldown';
import { useAuth } from '@/lib/AuthContext';
import { useEffect } from 'react';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ reset?: string }>();
  const { session, loading: sessionLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { remaining, cooling, start } = useCooldown(60);

  // 7.2: si ya hay sesión válida, no mostrar login.
  useEffect(() => {
    if (!sessionLoading && session) {
      router.replace('/home');
    }
  }, [session, sessionLoading]);

  const isValid = EMAIL_RE.test(email.trim()) && password.length > 0;
  const disabled = !isValid || loading || cooling || sessionLoading;

  const handleSignIn = async () => {
    if (!isValid || loading || cooling) return;
    setLoading(true);
    setError('');
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) {
        const mapped = mapAuthError(signInError);
        if (mapped === 'EMAIL_NOT_CONFIRMED') {
          router.push({ pathname: '/confirm-pending', params: { email: email.trim() } });
          return;
        }
        if (mapped.includes('Too many attempts') || mapped.includes('Email limit')) {
          start();
        }
        setError(mapped);
        return;
      }
      router.replace('/home');
    } catch (e) {
      setError(mapAuthError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScaffold
      navTitle="Sign in"
      title="Welcome Back"
      subtitle="Hello there, sign in to continue"
      footer={
        <>
          <Text style={styles.footerText}>Don&apos;t have an account? </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ir a registro"
            onPress={() => router.push('/register')}
          >
            <Text style={styles.footerLink}>Sign Up</Text>
          </Pressable>
        </>
      }
    >
      <View style={styles.illustration}>
        <LoginIllustration />
      </View>

      <View style={styles.field}>
        <TextField
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
          accessibilityLabel="Email"
        />
      </View>
      <View style={styles.field}>
        <TextField
          placeholder="Password"
          isPassword
          textContentType="password"
          value={password}
          onChangeText={setPassword}
          editable={!loading}
          accessibilityLabel="Contraseña"
        />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Olvidé mi contraseña"
        onPress={() => router.push('/forgot')}
        style={styles.forgotWrap}
      >
        <Text style={styles.forgot}>Forgot your password ?</Text>
      </Pressable>

      <FormError message={error} />
      {params.reset === 'ok' && !error && (
        <Text style={styles.success}>Password updated. Please sign in.</Text>
      )}
      {cooling && <Text style={styles.cooldown}>Retry in {remaining}s</Text>}

      <View style={styles.cta}>
        <PrimaryButton
          title={loading ? 'Signing in...' : cooling ? `Wait ${remaining}s` : 'Sign in'}
          disabled={disabled}
          loading={loading}
          onPress={handleSignIn}
        />
      </View>

      <View style={styles.fingerprint}>
        <MaterialCommunityIcons name="fingerprint" size={64} color={Colors.primary} />
      </View>
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  illustration: { marginTop: 32, alignItems: 'center' },
  field: { marginTop: 20 },
  forgotWrap: { marginTop: 12, alignSelf: 'flex-end' },
  forgot: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.caption2,
    lineHeight: 16,
    color: Colors.neutral4,
  },
  cta: { marginTop: 24 },
  fingerprint: { marginTop: 24, alignItems: 'center' },
  footerText: { fontFamily: 'Poppins_400Regular', fontSize: 12, lineHeight: 16, color: Colors.neutral1 },
  footerLink: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.caption1,
    lineHeight: 16,
    color: Colors.primary,
  },
  cooldown: { marginTop: 8, fontFamily: Fonts.medium, fontSize: 12, color: Colors.neutral1 },
  success: { marginTop: 8, fontFamily: Fonts.medium, fontSize: 12, color: Colors.primary },
});
