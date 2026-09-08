import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { AuthScaffold } from '@/components/AuthScaffold';
import { FormError } from '@/components/FormError';
import { LoginIllustration } from '@/components/LoginIllustration';
import { PasswordChecklist } from '@/components/PasswordChecklist';
import { TermsCheckbox } from '@/components/TermsCheckbox';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { TextField } from '@/components/ui/TextField';
import { Colors, Fonts, FontSizes } from '@/constants/Theme';
import { supabase } from '@/lib/supabase';
import { mapAuthError } from '@/lib/authErrors';
import { EMAIL_RE, isPasswordStrong } from '@/lib/password';
import { formatPhone, isPhoneValid, phoneDigits } from '@/lib/phone';
import { useCooldown } from '@/lib/useCooldown';

/**
 * Registro (6.2) - Figma Sign up #1 #54:21277.
 * Adaptaciones: campo 2 "Text input" se usa como Email (Supabase lo exige),
 * se agregan Confirm password + checklist (exigidos por 6.2, no están en Figma).
 */
export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { remaining, cooling, start } = useCooldown(60);

  const emailOk = EMAIL_RE.test(email.trim());
  const passOk = isPasswordStrong(password);
  const confirmOk = confirm.length > 0 && confirm === password;
  const nameOk = name.trim().length >= 2;
  const phoneOk = isPhoneValid(phone);
  const canSubmit = emailOk && passOk && confirmOk && nameOk && phoneOk && terms && !loading && !cooling;

  // Pista visible de qué falta (evita botón gris "misterioso").
  const touched = name !== '' || email !== '' || password !== '' || confirm !== '' || phone !== '';
  const missing: string[] = [];
  if (!nameOk) missing.push('name (min. 2 letters)');
  if (!emailOk) missing.push('valid email');
  if (!passOk) missing.push('password: 8+ with upper, lower, number and symbol');
  if (confirm === '') missing.push('confirm password');
  else if (!confirmOk) missing.push('passwords must match');
  if (!phoneOk) missing.push('valid phone (min. 8 digits)');
  if (!terms) missing.push('accept terms');

  const handleSignUp = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    try {
      const redirectTo = Linking.createURL('confirm');
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { name: name.trim(), phone: phoneDigits(phone) || undefined },
          emailRedirectTo: redirectTo,
        },
      });
      if (signUpError) {
        const mapped = mapAuthError(signUpError);
        // Anti-enumeración: email existente -> mismo éxito neutro.
        if (mapped === 'NEUTRAL_SUCCESS') {
          start();
          router.push({ pathname: '/confirm-pending', params: { email: email.trim() } });
          return;
        }
        if (mapped.includes('Too many attempts') || mapped.includes('Email limit')) start();
        setError(mapped);
        return;
      }
      // Con "Confirm email" activo: siempre éxito neutro -> pendiente.
      router.push({ pathname: '/confirm-pending', params: { email: email.trim() } });
    } catch (e) {
      setError(mapAuthError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScaffold
      navTitle="Sign up"
      title="Welcome to us,"
      subtitle="Hello there, create New account"
      footer={
        <>
          <Text style={styles.footerText}>Have an account? </Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Ir a iniciar sesión" onPress={() => router.back()}>
            <Text style={styles.footerLink}>Sign In</Text>
          </Pressable>
        </>
      }
    >
      <View style={styles.illustration}>
        <LoginIllustration />
      </View>

      <View style={styles.field}>
        <TextField
          placeholder="Name"
          autoCapitalize="words"
          textContentType="name"
          value={name}
          onChangeText={setName}
          editable={!loading}
          accessibilityLabel="Nombre"
        />
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
          placeholder="(+54) 11 1234-5678"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          value={phone}
          onChangeText={(v) => setPhone(formatPhone(v))}
          editable={!loading}
          error={!phoneOk ? 'Invalid phone (min. 8 digits).' : undefined}
          accessibilityLabel="Phone (optional)"
        />
      </View>
      <View style={styles.field}>
        <TextField
          placeholder="Password"
          isPassword
          textContentType="newPassword"
          value={password}
          onChangeText={setPassword}
          editable={!loading}
          accessibilityLabel="Contraseña"
        />
      </View>

      <PasswordChecklist password={password} />

      <View style={styles.field}>
        <TextField
          placeholder="Confirm password"
          isPassword
          textContentType="newPassword"
          value={confirm}
          onChangeText={setConfirm}
          editable={!loading}
          error={confirm.length > 0 && !confirmOk ? 'Passwords do not match.' : undefined}
          accessibilityLabel="Confirm password"
        />
      </View>

      <TermsCheckbox checked={terms} onChange={setTerms} />

      <FormError message={error} />
      {cooling && <Text style={styles.cooldown}>Retry in {remaining}s</Text>}
      {touched && !canSubmit && !cooling && (
        <Text style={styles.hint}>Missing: {missing.join(' · ')}</Text>
      )}

      <View style={styles.cta}>
        <PrimaryButton
          title={loading ? 'Signing up...' : 'Sign up'}
          disabled={!canSubmit}
          loading={loading}
          onPress={handleSignUp}
        />
      </View>
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  illustration: { marginTop: 32, alignItems: 'center' },
  field: { marginTop: 20 },
  cta: { marginTop: 32 },
  footerText: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: Colors.neutral1 },
  footerLink: { fontFamily: Fonts.semiBold, fontSize: FontSizes.caption1, color: Colors.primary },
  cooldown: { marginTop: 8, fontFamily: Fonts.medium, fontSize: 12, color: Colors.neutral1 },
  hint: { marginTop: 8, fontFamily: Fonts.medium, fontSize: 12, color: Colors.neutral1 },
});
