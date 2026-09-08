import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '@/constants/Theme';
import { useAuth } from '@/lib/AuthContext';

/** Home placeholder con ruta protegida (7.2) + logout (7.3). */
export default function HomeScreen() {
  const router = useRouter();
  const { session, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/');
    }
  }, [loading, session]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!session) return null;

  const email = session.user.email ?? '';

  const handleLogout = async () => {
    await signOut();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.card}>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.sub}>Sesión iniciada como {email}</Text>
        <Pressable onPress={handleLogout} style={styles.back} accessibilityRole="button" accessibilityLabel="Cerrar sesión">
          <Text style={styles.backText}>Cerrar sesión</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white },
  root: { flex: 1, backgroundColor: Colors.primary },
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    gap: 12,
  },
  title: { fontFamily: Fonts.semiBold, fontSize: 24, color: Colors.primary },
  sub: { fontFamily: Fonts.medium, fontSize: 14, color: Colors.neutral1 },
  back: {
    marginTop: 16,
    height: 44,
    borderRadius: 15,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { fontFamily: Fonts.medium, fontSize: 16, color: Colors.primary },
});
