import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { FormError } from '@/components/FormError';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { TextField } from '@/components/ui/TextField';
import { Colors, Fonts, FontSizes } from '@/constants/Theme';
import { supabase } from '@/lib/supabase';
import { mapAuthError } from '@/lib/authErrors';
import { EMAIL_RE } from '@/lib/password';
import { useCooldown } from '@/lib/useCooldown';

/**
 * Recuperar contraseña (6.4) - Figma Forgot password #1 #295:34803.
 * Adaptación: Figma pide teléfono + código SMS; el TP exige email +
 * resetPasswordForEmail con mensaje neutro anti-enumeración. Se mantiene
 * la card 327px / radius 15 / botón Send del kit.
 */
export default function ForgotScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const { remaining, cooling, start } = useCooldown(60);

  const valid = EMAIL_RE.test(email.trim());
  const disabled = !valid || loading || cooling;

  const handleSend = async () => {
    if (!valid || loading || cooling) return;
    setLoading(true);
    setError('');
    try {
      const redirectTo = Linking.createURL('reset-password');
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });
      if (resetError) {
        const mapped = mapAuthError(resetError);
        if (mapped.includes('Too many attempts') || mapped.includes('Email limit')) {
          start();
          setError(mapped);
          return;
        }
        // Anti-enumeración: cualquier otro error también termina en mensaje neutro,
        // salvo rate-limit y red.
        if (mapped.includes('Network')) {
          setError(mapped);
          return;
        }
      }
      start();
      setDone(true);
    } catch (e) {
      const mapped = mapAuthError(e);
      if (mapped.includes('Network') || mapped.includes('Too many') || mapped.includes('Email limit')) setError(mapped);
      else {
        start();
        setDone(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView edges={['top']}>
        <View style={styles.navBar}>
          <Pressable hitSlop={12} accessibilityRole="button" accessibilityLabel="Volver" onPress={() => router.back()}>
            <Ionicons name="chevron-down" size={16} color={Colors.neutral1} style={{ transform: [{ rotate: '90deg' }] }} />
          </Pressable>
          <Text style={styles.navTitle}>Forgot password</Text>
        </View>
      </SafeAreaView>

      <View style={styles.card}>
        <Text style={styles.label}>Type your email</Text>
        <TextField
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            setDone(false);
          }}
          editable={!loading}
          accessibilityLabel="Email"
        />
        <Text style={styles.info}>
          {done
            ? 'If this email exists in our system, you will receive instructions.'
            : 'We will send you instructions to reset your password.'}
        </Text>

        <FormError message={error} />
        {cooling && <Text style={styles.cooldown}>Retry in {remaining}s</Text>}

        <View style={styles.cta}>
          <PrimaryButton
            title={loading ? 'Sending...' : cooling && !done ? `Wait ${remaining}s` : 'Send'}
            disabled={disabled && !done}
            loading={loading}
            onPress={handleSend}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },
  navBar: { height: 53, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, gap: 16 },
  navTitle: { fontFamily: Fonts.semiBold, fontSize: FontSizes.title2, lineHeight: 28, color: Colors.neutral1 },
  card: {
    marginHorizontal: 24,
    marginTop: 24, // Figma y117
    borderRadius: 15,
    backgroundColor: Colors.white,
    padding: 16,
    // Card/1: 0px 4px 30px rgba(54,41,183,0.07)
    shadowColor: '#3629B7',
    shadowOpacity: 0.07,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    gap: 0,
  },
  label: {
    fontFamily: Fonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    color: '#979797', // Figma #370:31698
    marginBottom: 16,
  },
  info: {
    marginTop: 16,
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 21,
    color: Colors.neutral1,
  },
  cta: { marginTop: 24 },
  cooldown: { marginTop: 8, fontFamily: Fonts.medium, fontSize: 12, color: Colors.neutral1 },
});
