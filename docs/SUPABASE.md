# Configuración de Supabase — TP3 iBank

Proyecto: crear uno en [supabase.com/dashboard](https://supabase.com/dashboard) (nombre sugerido `ibank-tp`, región cercana, ej. South America).

## Keys (cliente)

Supabase → Project Settings → API:

- `Project URL` → `EXPO_PUBLIC_SUPABASE_URL`
- `anon public` → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

Solo la anon key vive en la app. La `service_role` **nunca** se incluye.

## Authentication → Providers → Email

- **Confirm email: ON** (en producción; puede apagarse solo para desarrollo local rápido).
- **Password policy**: longitud mínima `8`; exigir mayúscula, minúscula, dígito y símbolo (la app valida lo mismo en cliente con checklist en vivo).
- **Leaked password protection: OFF** — requiere plan Pro o superior; en Free el toggle sale deshabilitado. Mitigación: validación cliente + documentado como mejora al migrar a Pro.

## Authentication → URL Configuration

- Site URL: la del proyecto.
- **Redirect URLs** (allowlist, agregar las 3):
  - `ibanktp://confirm`
  - `ibanktp://reset-password`
  - `exp://**` (para probar con Expo Go en desarrollo)
- El scheme `ibanktp` sale de `app.json` (`expo.scheme`).

## Authentication → Rate Limits

- Se mantienen los valores por defecto, que pide el TP:
  - `signup` / `recover` / `otp`: ventana de **60s** por usuario (la app replica el cooldown visual de 60s).
- Límite de envío de emails con proveedor built-in: **2/hora por proyecto**. La app distingue este caso (`Email limit reached...`) del cooldown de 60s.

## Email / SMTP

- Desarrollo: SMTP built-in (2 emails/hora, a veces solo a miembros de la organización; revisar spam).
- Producción: custom SMTP (Resend/SendGrid/Mailgun) — arranca en ~30/hora. Ver `Authentication → SMTP Settings`.

## Expiración de links

- Default 3600s (1 hora) o menos; las pantallas informan el vencimiento y ofrecen reenvío/re-pedido.

## Verificación punta a punta (en celu, no en web)

1. Registro → llega email → abrirlo **en el mismo celu** → abre la app en `/confirm` → Home.
2. Forgot → email con link → abrir en el celu → `/reset-password` (evento `PASSWORD_RECOVERY`) → guardar → `signOut` → Login con éxito.
3. Cerrar/reabrir la app: con sesión válida entra directo a Home.
