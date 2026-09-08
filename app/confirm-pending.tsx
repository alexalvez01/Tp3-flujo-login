import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthScaffold } from '@/components/AuthScaffold';
import { FormError } from '@/components/FormError';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Colors, Fonts, FontSizes } from '@/constants/Theme';
import { supabase } from '@/lib/supabase';
import { mapAuthError } from '@/lib/authErrors';
import { useCooldown } from '@/lib/useCooldown';

/**
 * Confirmación pendiente (6.3). Sin frame dedicado en Figma:
 * se reusa el estilo del kit (card violeta/blanca, botón primary).
 */
export default function ConfirmPendingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = typeof params.email === 'string' ? params.email : '';
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState('');
  const [error, setError] = useState('');
  const { remaining, cooling, start } = useCooldown(60);

  const handleResend = async () => {
    if (!email || loading || cooling) return;
    setLoading(true);
    setError('');
    setInfo('');
    try {
      const { error: resendError } = await supabase.auth.resend({ type: 'signup', email });
      if (resendError) {
        const mapped = mapAuthError(resendError);
        if (mapped.includes('Too many attempts') || mapped.includes('Email limit')) start();
        setError(mapped === 'NEUTRAL_SUCCESS' ? '' : mapped);
        if (mapped === 'NEUTRAL_SUCCESS') setInfo('Check your email to continue.');
        return;
      }
      start();
      setInfo('Check your email to continue.');
    } catch (e) {
      setError(mapAuthError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScaffold
      navTitle="Sign up"
      title="Check your email"
      subtitle="We sent you a confirmation link"
      footer={
        <>
          <Text style={styles.footerText}>¿Ya confirmaste? </Text>
          <Text onPress={() => router.replace('/')} style={styles.footerLink}>
            Sign In
          </Text>
        </>
      }
    >
      <View style={styles.icon}>
        <MaterialCommunityIcons name="email-check-outline" size={96} color={Colors.primary} />
      </View>
      <Text style={styles.email}>{email || 'tu email'}</Text>
      <Text style={styles.hint}>If you don&apos;t see it, check spam. The link expires in 1 hour.</Text>

      <FormError message={error} />
      {!!info && <Text style={styles.info}>{info}</Text>}
      {cooling && <Text style={styles.cooldown}>Retry in {remaining}s</Text>}

      <View style={styles.cta}>
        <PrimaryButton
          title={loading ? 'Sending...' : cooling ? `Wait ${remaining}s` : 'Reenviar email'}
          disabled={!email || loading || cooling}
          loading={loading}
          onPress={handleResend}
        />
      </View>
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  icon: { marginTop: 32, alignItems: 'center' },
  email: {
    marginTop: 16,
    textAlign: 'center',
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: Colors.neutral1,
  },
  hint: {
    marginTop: 8,
    textAlign: 'center',
    fontFamily: Fonts.medium,
    fontSize: FontSizes.caption2,
    color: Colors.neutral4,
  },
  info: { marginTop: 12, textAlign: 'center', fontFamily: Fonts.medium, fontSize: 12, color: Colors.primary },
  cooldown: { marginTop: 8, textAlign: 'center', fontFamily: Fonts.medium, fontSize: 12, color: Colors.neutral1 },
  cta: { marginTop: 24 },
  footerText: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: Colors.neutral1 },
  footerLink: { fontFamily: Fonts.semiBold, fontSize: FontSizes.caption1, color: Colors.primary },
});
