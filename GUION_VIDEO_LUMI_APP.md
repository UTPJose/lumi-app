# Guion para Video - Lumi App
## Duración total: 4 minutos (1 min por integrante)

---

## INTEGRANTE 1 — Introducción y problema (0:00 - 1:00)

### Diálogo sugerido:
> "Hola, somos el equipo de **Lumi App**, un proyecto de la materia de Interacción Hombre Máquina.
>
> El problema que abordamos es la **falta de herramientas accesibles** para crear rutinas diarias. Muchas personas con discapacidades visuales, auditivas, motrices o cognitivas no pueden usar aplicaciones convencionales de planificación.
>
> Lumi App es una aplicación web móvil-first que genera rutinas diarias personalizadas usando **inteligencia artificial**, y está diseñada desde cero para ser **accesible e inclusiva**."

### Demostración en vivo (pantalla):
1. Abrir la app en el navegador (modo móvil o responsive)
2. Mostrar la **página de bienvenida** (`WelcomePage`)
3. Avanzar al **setup de perfil** (`ProfileSetupPage`) — ingresar nombre y edad
4. Mostrar la **selección de intereses** (`InterestsPage`)
5. Llegar a la **página principal** (`HomePage`) con el saludo personalizado

---

## INTEGRANTE 2 — Generación de rutinas con IA (1:00 - 2:00)

### Diálogo sugerido:
> "Lumi App permite crear rutinas de dos formas:
>
> **Primera opción: por preguntas.** El usuario responde un cuestionario sobre su horario, nivel de energía y preferencias sociales, y la IA genera una rutina personalizada.
>
> **Segunda opción: por voz.** El usuario simplemente describe su rutina ideal hablando, y el sistema la transcribe y genera la rutina automáticamente.
>
> Usamos **Google Vertex AI con Gemini 2.5 Flash** para generar rutinas con 5 a 8 actividades diarias en formato JSON."

### Demostración en vivo (pantalla):
1. Ir a **Crear Rutina** (`CreateRoutinePage`)
2. Seleccionar **"Por preguntas"**
3. Responder rápidamente 2-3 preguntas del cuestionario
4. Mostrar la pantalla de **generación con IA** (`GeneratingPage`)
5. Mostrar el **detalle de la rutina generada** (`RoutineDetailPage`) con sus actividades
6. Completar la rutina y mostrar el **modal de celebración** con confetti (`CompletionModal`)

---

## INTEGRANTE 3 — Sistema de accesibilidad (2:00 - 3:00)

### Diálogo sugerido:
> "El diferenciador principal de Lumi App es su **sistema exhaustivo de accesibilidad** con 14 módulos que cubren:
>
> - **Tamaño de texto** ajustable (4 niveles)
> - **Modo de alto contraste** e inversión de colores
> - **Tipado especial para dislexia**
> - **Lectura por voz automática** de toda la página
> - **Asistente por voz** para navegar y completar formularios sin tocar la pantalla
> - **Botones grandes** (mínimo 60px) compatibles con lectores de pantalla
>
> Todo se configura desde un **panel de accesibilidad** tipo bottom sheet."

### Demostración en vivo (pantalla):
1. Abrir el **panel de accesibilidad** (botón flotante o menú)
2. Cambiar el **tamaño de texto** a "Muy Grande" — mostrar cómo cambia toda la app
3. Activar el **modo de alto contraste** — mostrar la diferencia visual
4. Activar la **lectura por voz (TTS)** — dejar que lea en voz alta una sección
5. Activar el **asistente por voz** — dar un comando de voz simple como "siguiente"
6. Mostrar que las configuraciones **persisten** al recargar la página (localStorage)

---

## INTEGRANTE 4 — Tecnología, recordatorios y cierre (3:00 - 4:00)

### Diálogo sugerido:
> "En cuanto a la tecnología, Lumi App está construida con **React 18, TypeScript y Tailwind CSS**. El backend usa **Supabase Edge Functions** con el framework **Hono**, integrando **Google Cloud Text-to-Speech** para síntesis de voz de alta calidad y **Gemini** para la generación de rutinas.
>
> También incluimos un sistema de **recordatorios diarios** con CRUD completo, una **biblioteca** donde se guardan todas las rutinas, y la posibilidad de **compartir** rutinas con otros usuarios.
>
> La app se despliega en **Vercel** y está lista para producción.
>
> ¡Gracias por ver! Esto es Lumi App — tecnología al servicio de la inclusión."

### Demostración en vivo (pantalla):
1. Navegar a la página de **Recordatorios** (`RemindersPage`)
2. Crear un recordatorio nuevo (título + hora)
3. Ir a la **Biblioteca** (`LibraryPage`) — mostrar las rutinas guardadas
4. Ir al **Perfil** (`ProfilePage`) — mostrar información del usuario
5. Volver a la **página principal** (`HomePage`) y mostrar el **consejo del día**
6. Pantalla final con logo/nombre del equipo

---

## Notas para la grabación

| Aspecto | Detalle |
|---------|---------|
| **Formato** | Screencast con voz en off o cámara pequeña en esquina |
| **Resolución** | Mínimo 1080p, modo responsive/móvil |
| **Navegador** | Chrome o Edge (mejor soporte para Web Speech APIs) |
| **Preparación** | Tener la app corriendo en `localhost:5173` antes de grabar |
| **Datos de prueba** | Pre-cargar un perfil con nombre y edad para ahorrar tiempo |
| **Accesibilidad** | Mostrar el panel de accesibilidad con al menos 2 configuraciones activas |
| **Audio** | Grabar con micrófono separado para mejor calidad |
| **Edición** | Agregar subtítulos si es necesario, música de fondo suave (opcional) |

---

## Resumen de tiempos

| Integrante | Tema | Tiempo | Pantalla principal |
|------------|------|--------|-------------------|
| 1 | Introducción + Onboarding | 0:00 - 1:00 | WelcomePage → HomePage |
| 2 | Generación de rutinas IA | 1:00 - 2:00 | CreateRoutinePage → RoutineDetailPage |
| 3 | Accesibilidad | 2:00 - 3:00 | AccessibilityPanel + TTS + Voice |
| 4 | Tecnología + Cierre | 3:00 - 4:00 | RemindersPage → HomePage final |
