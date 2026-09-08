import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Colors, Fonts, FontSizes, Radii } from '@/constants/Theme';

type Props = {
  navTitle: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

/**
 * Scaffold violeta + card blanca (Login / Register / Confirm).
 * Fiel a Figma: header 53px, card radius 30, padding 24.
 */
export function AuthScaffold({ navTitle, title, subtitle, children, footer }: Props) {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.top} edges={['top']}>
        <View style={styles.navBar}>
          <Pressable
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons
              name="chevron-down"
              size={16}
              color={Colors.white}
              style={{ transform: [{ rotate: '90deg' }] }}
            />
          </Pressable>
          <Text style={styles.navTitle}>{navTitle}</Text>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.card}
        contentContainerStyle={styles.cardContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <View style={styles.body}>{children}</View>
        {footer && <View style={styles.footer}>{footer}</View>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.primary },
  top: { backgroundColor: Colors.primary },
  navBar: {
    height: 53,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  backBtn: { width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  navTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.title2,
    lineHeight: 28,
    color: Colors.white,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radii.cardTop,
    borderTopRightRadius: Radii.cardTop,
  },
  cardContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    flexGrow: 1,
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.title1,
    lineHeight: 28,
    color: Colors.primary,
  },
  subtitle: {
    marginTop: 4,
    fontFamily: Fonts.medium,
    fontSize: FontSizes.caption2,
    lineHeight: 16,
    color: Colors.neutral1,
  },
  body: { marginTop: 8 },
  footer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
