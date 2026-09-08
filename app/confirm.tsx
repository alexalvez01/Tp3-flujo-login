import { StyleSheet, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { AuthScaffold } from '@/components/AuthScaffold';
import { Colors, Fonts } from '@/constants/Theme';
import { supabase } from '@/lib/supabase';

/**
 * Handler del deep link ibanktp://confirm (emailRedirectTo del registro).
 * Con sesión válida -> Home directo (6.3). Sin sesión -> aviso.
 */
export default function ConfirmScreen() {
  const router = useRouter();
  const [status, setStatus] = useState('Confirming your email...');

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.replace('/home');
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace('/home');
      } else {
        setStatus('If already confirmed, please sign in. The link may be expired.');
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <AuthScaffold navTitle="Confirm" title="Confirmation" subtitle="Email">
      <Text style={styles.text}>{status}</Text>
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  text: { marginTop: 24, fontFamily: Fonts.medium, fontSize: 14, color: Colors.neutral1 },
});
