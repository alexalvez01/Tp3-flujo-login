# Documento de decisiones — TP3 iBank × Supabase

Qué se mapeó del Figma, qué se adaptó y por qué.

## Base de diseño

- Archivo: iBank - Banking & E-Money Management App (Community), key `a5fhXOud8405KJTOMY2UAl`.
- Frames usados: Login `54:21278`, Register `54:21277`, Register completado `370:31576`, Forgot `295:34803`.
- Tokens: `Primary #3629B7`, `PrimaryLight #F2F1F9`, `Neutral1 #343434`, `Neutral4 #CACACA`, borde `#CBCBCB`, blanco `#FFFFFF`, Poppins 400/500/600, card radius 30 top, inputs/botón radius 15, botón 44px.

## Mapeos fieles

- Scaffold violeta + card blanca, header 53px con back + título 20 SemiBold, "Welcome Back" 24, subtítulos 12, ilustración candado 213×165 vectorizada del SVG del Figma, huella 64px, footers con links.
- Forgot mantiene la card 327px / radius 15 / sombra `0 4 30 rgba(54,41,183,.07)` / botón Send del frame.

## Adaptaciones (con motivo)

1. **Botón disabled ilegible**: el Figma trae texto `#FFF` sobre `#F2F1F9` (contraste nulo). Se adaptó a lila `#9D97D6` para que el estado disabled sea visible y accesible. Documentado en `Theme.ts` y `PrimaryButton.tsx`.
2. **Icono de password**: en Figma es un chevron 16px `#444`, no un ojo. Se usó eye/eye-off estándar con mostrar/ocultar funcional.
3. **Huella**: el SVG del Figma es inmanejable como componente; se usa `MaterialCommunityIcons fingerprint` 64px en primary, decorativo.
4. **Register campo 2 "Text input" → Email**: el ejemplo completado del Figma muestra teléfono `(+84)...`, pero Supabase exige email para `signUp`. El campo es Email (requerido) y se **agregó** teléfono opcional con formato automático `(+54) 11 1234-5678`, guardado en `user_metadata.phone`.
5. **Register sin Confirm ni checklist en Figma → agregados** por §6.2 (confirmación exacta + checklist en vivo de 5 reglas).
6. **Forgot por email, no por teléfono/SMS**: los frames `379-101/216/347` son flujo telefónico con código, pero §6.4 exige `resetPasswordForEmail` con mensaje neutro anti-enumeración, y §01 excluye OTP como segundo factor. Se implementó email + link.
7. **Confirm pendiente sin frame**: creada con el estilo del kit (no existe pantalla dedicada en el Figma entregado).
8. **Textos en inglés**: el kit es inglés; errores, hints y checklist van en inglés para consistencia.
9. **Pista "Missing: ..."**: el botón gris sin explicación confundía; se agregó hint visible de requisitos pendientes (no cambia la regla, solo la comunica).
10. **Anti-enumeración respetada**: email existente en registro → mismo éxito neutro a `/confirm-pending`; reset siempre neutro. No se implementó aviso de "email ya registrado" a pedido inicial porque viola §6.2 (ver historial: se rechazó con fundamento).

## Seguridad

- Solo anon key en cliente; nada sensible en logs ni estado prolongado.
- Leaked password protection OFF por plan Free (documentado como deuda en `docs/SUPABASE.md`).
- `.env` ignorado en git; solo viaja `.env.example`.
