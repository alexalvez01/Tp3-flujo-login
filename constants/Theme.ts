/**
 * iBank UI Kit - Design tokens extraídos de Figma
 * Frame: Sign in #54:21278
 * Archivo: iBank - Banking & E-Money Management App (Community)
 */
export const Colors = {
  primary: '#3629B7',
  primaryLight: '#F2F1F9',
  primaryMutedText: '#9D97D6', // adaptado: en Figma el disabled usa texto #FFF sobre #F2F1F9 (contraste nulo), se adapta a lila legible
  white: '#FFFFFF',
  neutral1: '#343434',
  neutral4: '#CACACA',
  border: '#CBCBCB',
  lockPurple: '#5655B9',
  illustrationBg: '#E5E2FF',
  accentRed: '#FF4267',
  accentBlue: '#0890FE',
  accentOrange: '#FFAF2A',
  accentTeal: '#52D5BA',
  error: '#FF4267',
} as const;

export const Radii = {
  cardTop: 30,
  input: 15,
  button: 15,
} as const;

export const Fonts = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
} as const;

export const FontSizes = {
  title1: 24, // Welcome Back
  title2: 20, // NavBar "Sign in"
  body1: 16, // Botón
  body3: 14, // Inputs
  caption1: 12, // Sign Up link (SemiBold)
  caption2: 12, // Subtítulo + Forgot (Medium)
} as const;
