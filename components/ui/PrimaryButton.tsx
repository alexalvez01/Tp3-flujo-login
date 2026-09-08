import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { Colors, Fonts, FontSizes, Radii } from '@/constants/Theme';

type Props = {
  title: string;
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
};

export function PrimaryButton({ title, disabled, loading, onPress }: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: !!loading }}
      style={({ pressed }) => [
        styles.base,
        isDisabled ? styles.disabled : styles.enabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={Colors.white} />
      ) : (
        <Text style={[styles.label, isDisabled && styles.labelDisabled]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    height: 44, // Figma: 327x44
    borderRadius: Radii.button, // 15
    alignItems: 'center',
    justifyContent: 'center',
  },
  enabled: {
    backgroundColor: Colors.primary, // #3629B7
  },
  disabled: {
    backgroundColor: Colors.primaryLight, // #F2F1F9 (Figma Dissable)
  },
  pressed: {
    opacity: 0.9,
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.body1, // 16
    lineHeight: 24,
    color: Colors.white,
    textAlign: 'center',
  },
  labelDisabled: {
    // Nota: Figma trae texto #FFF sobre #F2F1F9 (ilegible).
    // Se adapta a lila muted para mantener disabled visible y accesible.
    color: Colors.primaryMutedText,
  },
});
