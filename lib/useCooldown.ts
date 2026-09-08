import { useEffect, useRef, useState } from 'react';

/**
 * Cooldown visual de 60s para reintentos (6.1/6.3/6.4 - rate limit Supabase).
 */
export function useCooldown(seconds = 60) {
  const [remaining, setRemaining] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => setRemaining(seconds);

  useEffect(() => {
    if (remaining <= 0) {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
      return;
    }
    timer.current = setInterval(() => {
      setRemaining((v) => (v <= 1 ? 0 : v - 1));
    }, 1000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [remaining > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    []
  );

  return { remaining, cooling: remaining > 0, start };
}
