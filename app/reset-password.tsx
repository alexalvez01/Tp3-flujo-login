import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { AuthScaffold } from '@/components/AuthScaffold';
import { FormError } from '@/components/FormError';
import { PasswordChecklist } from '@/components/PasswordChecklist';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { TextField } from '@/components/ui/TextField';
import { Colors, Fonts, FontSizes } from '@/constants/Theme';
import { supabase } from '@/lib/supabase';
import { mapAuthError } from '@/lib/authErrors';
import { isPasswordStrong } from '@/lib/password';

/**
 * Nueva contraseña (6.5).
 * Solo accesible vía deep link del email (evento PASSWORD_RECOVERY).
 * Si el link está vencido/inválido: error + link a /forgot (nunca form vacío).
 * Éxito: signOut + volver a Login con mensaje.
 */
export default function ResetPasswordScreen() {
  const router = useRouter();
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    // Capturar URL entrante (expo-linking) para log de diagnóstico sin datos sensibles.
    Linking.getInitialURL().then(() => {});

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (!mounted) return;
      if (event === 'PASSWORD_RECOVERY') {
        setRecoveryReady(true);
        setChecking(false);
      }
    });

    // Si ya hay sesión de recuperación al montar, habilitar.
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) {
        setRecoveryReady(true);
      }
      // Dar margen al evento antes de marcar inválido.
      setTimeout(() => {
        if (mounted) setChecking(false);
      }, 2500);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const passOk = isPasswordStrong(password);
  const confirmOk = confirm.length > 0 && confirm === password;
  const canSubmit = recoveryReady && passOk && confirmOk && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(mapAuthError(updateError));
        return;
      }
      await supabase.auth.signOut();
      router.replace({ pathname: '/', params: { reset: 'ok' } });
    } catch (e) {
      setError(mapAuthError(e));
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <AuthScaffold navTitle="New password" title="Verifying link..." subtitle="One moment">
        <Text style={styles.hint}>Validating your recovery link.</Text>
      </AuthScaffold>
    );
  }

  if (!recoveryReady) {
    return (
      <AuthScaffold navTitle="New password" title="Invalid link" subtitle="Expired or already used">
        <Text style={styles.hint}>
          This link is expired or invalid. Request a new one.
        </Text>
        <View style={styles.cta}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver a pedir reset"
            onPress={() => router.replace('/forgot')}
            style={styles.linkBtn}
          >
            <Text style={styles.linkText}>Volver a pedir reset</Text>
          </Pressable>
        </View>
      </AuthScaffold>
    );
  }

  return (
    <AuthScaffold
      navTitle="New password"
      title="New password"
      subtitle="Set and confirm your password"
      footer={
        <>
          <Text style={styles.footerText}>Remembered? </Text>
          <Pressable accessibilityRole="button" onPress={() => router.replace('/')}>
            <Text style={styles.footerLink}>Sign In</Text>
          </Pressable>
        </>
      }
    >
      <View style={styles.field}>
        <TextField
          placeholder="New password"
          isPassword
          textContentType="newPassword"
          value={password}
          onChangeText={setPassword}
          editable={!loading}
          accessibilityLabel="Nueva contraseña"
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

      <FormError message={error} />

      <View style={styles.cta}>
        <PrimaryButton
          title={loading ? 'Saving...' : 'Save'}
          disabled={!canSubmit}
          loading={loading}
          onPress={handleSubmit}
        />
      </View>
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: 24, fontFamily: Fonts.medium, fontSize: 14, color: Colors.neutral1 },
  field: { marginTop: 20 },
  cta: { marginTop: 32 },
  linkBtn: {
    marginTop: 8,
    height: 44,
    borderRadius: 15,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: { fontFamily: Fonts.medium, fontSize: 16, color: Colors.primary },
  footerText: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: Colors.neutral1 },
  footerLink: { fontFamily: Fonts.semiBold, fontSize: FontSizes.caption1, color: Colors.primary },
});
