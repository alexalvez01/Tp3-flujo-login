import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Colors, Fonts, FontSizes, Radii } from '@/constants/Theme';

type Props = TextInputProps & {
  isPassword?: boolean;
  error?: string;
};

export function TextField({ isPassword, error, editable = true, ...rest }: Props) {
  const [hidden, setHidden] = useState(!!isPassword);
  const hasError = !!error;

  return (
    <View>
      <View
        style={[
          styles.box,
          hasError && styles.boxError,
          !editable && styles.boxDisabled,
        ]}
      >
        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.neutral4}
          editable={editable}
          secureTextEntry={isPassword ? hidden : false}
          autoCapitalize="none"
          autoCorrect={false}
          {...rest}
        />
        {isPassword && (
          <Pressable
            onPress={() => setHidden((v) => !v)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Mostrar contraseña' : 'Ocultar contraseña'}
          >
            <Ionicons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={16}
              color={Colors.neutral4}
            />
          </Pressable>
        )}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: '100%',
    height: 44, // Figma: 327x44
    borderWidth: 1,
    borderColor: Colors.border, // #CBCBCB
    borderRadius: Radii.input, // 15
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12, // Figma: texto x12 y12
    paddingRight: 14, // icono 16px en x296 (327-296-16=15)
  },
  boxError: {
    borderColor: Colors.error,
  },
  boxDisabled: {
    opacity: 0.6,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: Fonts.medium,
    fontSize: FontSizes.body3, // 14
    lineHeight: 21, // 14*1.5
    color: Colors.neutral1,
    paddingRight: 8,
  },
  error: {
    marginTop: 6,
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: Colors.error,
  },
});
