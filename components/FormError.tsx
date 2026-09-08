import { StyleSheet, Text } from 'react-native';
import { Colors, Fonts } from '@/constants/Theme';

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <Text accessibilityLiveRegion="polite" style={styles.text}>
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    marginTop: 12,
    fontFamily: Fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.error,
  },
});
