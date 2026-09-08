/**
 * Centralized mapping of Supabase Auth errors -> English UI messages (7.4).
 * Single point so forms don't duplicate this logic.
 * Never log original values with sensitive data.
 */

export function mapAuthError(error: unknown): string {
  const msg = getMessage(error).toLowerCase();
  const code = getCode(error).toLowerCase();

  // Hourly email-send limit (free plan: 2 emails/hour) - different from the 60s retry limit.
  if (
    code.includes('over_email_send_rate_limit') ||
    (msg.includes('email') && (msg.includes('per hour') || msg.includes('hour'))) ||
    msg.includes('email rate limit exceeded')
  ) {
    return 'Email limit reached (free plan: 2 emails/hour). Wait an hour or try another address.';
  }

  if (
    code.includes('over_request_rate_limit') ||
    msg.includes('rate limit') ||
    msg.includes('too many') ||
    msg.includes('429') ||
    msg.includes('after 60 seconds') ||
    msg.includes('60 seconds')
  ) {
    return 'Too many attempts. Wait 60 seconds before retrying.';
  }

  if (
    code.includes('email_not_confirmed') ||
    msg.includes('email not confirmed') ||
    msg.includes('email not confirm')
  ) {
    return 'EMAIL_NOT_CONFIRMED';
  }

  if (
    code.includes('invalid_credentials') ||
    code.includes('invalid login') ||
    msg.includes('invalid login credentials')
  ) {
    return 'Incorrect email or password.';
  }

  if (code.includes('weak_password') || msg.includes('weak') || msg.includes('password')) {
    if (msg.includes('at least') || msg.includes('length') || msg.includes('characters')) {
      return 'Password does not meet the minimum requirements.';
    }
    if (msg.includes('pwned') || msg.includes('leaked') || msg.includes('weak')) {
      return 'Choose a stronger, different password.';
    }
    return 'Password does not meet the minimum requirements.';
  }

  if (
    code.includes('user_already_exists') ||
    code.includes('user already registered') ||
    msg.includes('already registered') ||
    msg.includes('already exists')
  ) {
    // 6.2 anti-enumeration: never reveal an existing account.
    return 'NEUTRAL_SUCCESS';
  }

  if (msg.includes('network') || msg.includes('fetch') || msg.includes('failed')) {
    return 'Network error. Check your connection and try again.';
  }

  return 'Something went wrong. Try again.';
}

function getMessage(error: unknown): string {
  if (!error || typeof error !== 'object') return '';
  const e = error as { message?: unknown };
  return typeof e.message === 'string' ? e.message : '';
}

function getCode(error: unknown): string {
  if (!error || typeof error !== 'object') return '';
  const e = error as { code?: unknown; status?: unknown };
  const parts: string[] = [];
  if (typeof e.code === 'string') parts.push(e.code);
  if (typeof e.status === 'number') parts.push(String(e.status));
  return parts.join(' ');
}
