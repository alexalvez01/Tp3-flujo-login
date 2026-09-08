/** Formato y validación de teléfono (campo visual Figma, se guarda en user_metadata). */

export function formatPhone(value: string): string {
  const plus = value.trim().startsWith('+');
  const digits = value.replace(/\D/g, '').slice(0, 15);
  if (!digits) return plus ? '+' : '';

  // Argentina: (+54) 11 1234-5678
  if (digits.startsWith('54') && digits.length > 2) {
    const rest = digits.slice(2);
    if (rest.length > 6) {
      return `(+54) ${rest.slice(0, 2)} ${rest.slice(2, 6)}-${rest.slice(6, 10)}`.trim();
    }
    if (rest.length > 2) {
      return `(+54) ${rest.slice(0, 2)} ${rest.slice(2)}`.trim();
    }
    return `(+54) ${rest}`;
  }

  // Nacional 10 dígitos: (11) 1234-5678
  if (!plus && digits.length >= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
  }

  // Genérico: grupos de 3
  const grouped = digits.replace(/(\d{3})(?=\d)/g, '$1 ');
  return plus ? `+${grouped}` : grouped;
}

export function phoneDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/** Opcional en el form: vacío = ok; si se completa, mínimo 8 dígitos. */
export function isPhoneValid(value: string): boolean {
  const v = value.trim();
  if (!v) return true;
  return phoneDigits(v).length >= 8;
}
