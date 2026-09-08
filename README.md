# TP3 — Login iBank × Supabase (2026)

FCyT · Licenciatura en Sistemas de Información · Arq. Programación Móvil.
Flujo de autenticación de una app bancaria (iBank UI Kit) con Supabase Auth como único backend.
Foco: UI fiel al Figma + reglas de negocio exactas de Supabase.

## Alcance

5 pantallas obligatorias + Home placeholder post-login:

| Ruta | Pantalla | Supabase API |
|---|---|---|
| `/` | Iniciar sesión | `signInWithPassword` |
| `/register` | Registro | `signUp` |
| `/confirm-pending` | Confirmación pendiente | `resend({ type: 'signup' })` |
| `/confirm` | Handler deep link confirmación | `onAuthStateChange` → Home |
| `/forgot` | Recuperar contraseña | `resetPasswordForEmail` |
| `/reset-password` | Nueva contraseña (vía email) | `updateUser` |
| `/home` | Home (placeholder) | `signOut` |

Fuera de alcance (según consigna §01): login social, OTP como segundo factor, PIN/biometría.

## Stack

- React Native + Expo SDK 57 + TypeScript + expo-router
- `@supabase/supabase-js` v2 + `@react-native-async-storage/async-storage`
- `expo-linking` (deep links), `@expo-google-fonts/poppins`, `react-native-svg`

## Requisitos

- Node 22+, npm, app Expo Go en el celu (Android/iOS) para probar.

## Configuración

1. Clonar e instalar:
   ```bash
   npm install
   ```
2. Crear `.env` en la raíz (ver `.env.example`):
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
   Las keys se sacan de Supabase → Project Settings → API. Solo la `anon/public key` vive en el cliente (nunca la `service_role`).
3. Configurar el proyecto Supabase según [`docs/SUPABASE.md`](docs/SUPABASE.md) (Confirm email, password policy, Redirect URLs con el scheme `ibanktp`, rate limits, SMTP).
4. Correr con caché limpia (obligatorio tras tocar el `.env`):
   ```bash
   npx expo start -c
   ```
   Escanear el QR con Expo Go. **Probar en celu, no en web de PC**: los deep links de confirmación/reset solo abren la app en el dispositivo.

## Decisiones de diseño e implementación

Ver [`docs/DECISIONES.md`](docs/DECISIONES.md): qué se mapeó del Figma, qué se adaptó y por qué (botón disabled, campo teléfono, forgot por email en vez de SMS, OTP fuera de alcance, errores en inglés).

## Estructura

```
app/            # rutas expo-router (index, register, confirm-pending, confirm, forgot, reset-password, home)
components/     # AuthScaffold, TextField, PrimaryButton, PasswordChecklist, TermsCheckbox, LoginIllustration
constants/      # Theme.ts (tokens Figma)
lib/            # supabase.ts, AuthContext, authErrors.ts, password.ts, phone.ts, useCooldown.ts
docs/           # SUPABASE.md, DECISIONES.md
assets/figma/   # SVGs descargados del Figma
```

## Video

El video con las 5 pantallas y flujos se entrega aparte.
