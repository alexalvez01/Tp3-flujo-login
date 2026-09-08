import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '@/constants/Theme';

export function TermsCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel="Acepto términos y condiciones"
      style={styles.row}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Ionicons name="checkmark" size={16} color={Colors.white} />}
      </View>
      <Text style={styles.text}>
        By creating an account your aggree{'\n'}to our{' '}
        <Text style={styles.link}>Term and Condtions</Text>
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginTop: 20 },
  box: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  text: { flex: 1, fontFamily: Fonts.medium, fontSize: 12, lineHeight: 20, color: Colors.neutral1 },
  link: { fontFamily: Fonts.semiBold, color: Colors.primary },
});
