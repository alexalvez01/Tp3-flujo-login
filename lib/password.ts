export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type PasswordRule = {
  id: 'length' | 'upper' | 'lower' | 'digit' | 'symbol';
  label: string;
  ok: boolean;
};

const SYMBOLS = `!@#$%^&*()_+-=[]{};':"\\|<>?,./~\``;

export function getPasswordRules(password: string): PasswordRule[] {
  return [
    { id: 'length', label: 'Min. 8 characters', ok: password.length >= 8 },
    { id: 'upper', label: 'One uppercase letter', ok: /[A-Z]/.test(password) },
    { id: 'lower', label: 'One lowercase letter', ok: /[a-z]/.test(password) },
    { id: 'digit', label: 'One number', ok: /\d/.test(password) },
    {
      id: 'symbol',
      label: 'One symbol',
      ok: password.split('').some((c) => SYMBOLS.includes(c)),
    },
  ];
}

export function isPasswordStrong(password: string): boolean {
  return getPasswordRules(password).every((r) => r.ok);
}
