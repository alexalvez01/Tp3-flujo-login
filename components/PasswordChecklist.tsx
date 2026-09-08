import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '@/constants/Theme';
import { getPasswordRules } from '@/lib/password';

/** Visual password checklist (6.2 / 6.5). Ticks live as you type. */
export function PasswordChecklist({ password }: { password: string }) {
  const rules = getPasswordRules(password);
  return (
    <View style={styles.wrap} accessibilityLabel="Requisitos de contraseña">
      {rules.map((r) => (
        <View key={r.id} style={styles.row}>
          <Ionicons
            name={r.ok ? 'checkmark-circle' : 'ellipse-outline'}
            size={16}
            color={r.ok ? Colors.primary : Colors.neutral4}
          />
          <Text style={[styles.label, r.ok && styles.labelOk]}>{r.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 12, gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontFamily: Fonts.medium, fontSize: 12, color: Colors.neutral4 },
  labelOk: { color: Colors.primary },
});
