# Setup Google Cloud Text-to-Speech para Lumi App

## Paso 1: Crear proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Haz clic en el selector de proyecto (arriba a la izquierda)
3. Haz clic en **"NUEVO PROYECTO"**
4. Ingresa nombre: `lumi-tts` (o el que prefieras)
5. Haz clic en **"CREAR"**

## Paso 2: Habilitar la API de Text-to-Speech

1. En la Google Cloud Console, ve a **APIs y servicios** → **Biblioteca**
2. Busca: `Text-to-Speech`
3. Haz clic en el resultado: **Cloud Text-to-Speech API**
4. Haz clic en el botón **"HABILITAR"**
5. Espera a que se complete la habilitación

## Paso 3: Crear Service Account y descargar credenciales

1. Ve a **APIs y servicios** → **Credenciales**
2. Haz clic en **"+ CREAR CREDENCIALES"** → **Cuenta de servicio**
3. Ingresa:
   - **Nombre de la cuenta de servicio:** `lumi-tts-service`
   - Haz clic en **"CREAR Y CONTINUAR"**
4. En el paso "Otorgar acceso a esta cuenta de servicio":
   - Selecciona el rol: **Editor** (búscalo en "Acceso básico")
   - Haz clic en **"CONTINUAR"**
5. Haz clic en **"REALIZADO"**

## Paso 4: Descargar la clave JSON

1. En **Credenciales**, busca la cuenta que acabas de crear: `lumi-tts-service`
2. Haz clic en ella para abrir los detalles
3. Ve a la pestaña **"CLAVES"**
4. Haz clic en **"Agregar clave"** → **"Crear clave nueva"**
5. Selecciona formato: **JSON**
6. Haz clic en **"CREAR"**
7. Se descargará automáticamente un archivo JSON
8. **Guarda este archivo en lugar seguro** (contiene tus credenciales)

## Paso 5: Configurar la clave en Supabase

### Opción A: Usando Supabase Dashboard (Recomendado)

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto `lumi-app`
3. Ve a **Settings** → **Secrets / Environment Variables**
4. Haz clic en **"New Secret"**
5. En el campo "Name": `GOOGLE_TTS_KEY`
6. En el campo "Value":
   - Abre el archivo JSON que descargaste
   - Copia TODO el contenido del JSON (desde `{` hasta `}`)
   - Pégalo completo en el campo Value
7. Haz clic en **"Save secret"**

### Opción B: Usando CLI de Supabase (Alternativa)

```bash
# Si tienes Supabase CLI instalado
supabase secrets set GOOGLE_TTS_KEY < ruta/a/tu/archivo.json
```

## Paso 6: Configurar URL de Supabase en Frontend (Opcional)

Si quieres usar una URL diferente en desarrollo, crea un archivo `.env.local`:

```env
VITE_SUPABASE_URL=http://localhost:54321
```

O para producción:
```env
VITE_SUPABASE_URL=https://czyzeidiknpezreqczbh.supabase.co
```

## Paso 7: Redeploy de Supabase Functions

Después de agregar el secret, redeploy las funciones:

```bash
# Opción 1: Dashboard
# Ve a Functions en Supabase → Click en "Deploy" o redeploy manual

# Opción 2: CLI
supabase functions deploy server
```

## Verificación

Para verificar que todo está configurado:

1. Abre la app en el navegador
2. Ve a **Accesibilidad** (botón flotante)
3. Habilita **"Lectura por voz"** (nivel 1)
4. Navega a una página que tenga h1 o h2
5. Deberías escuchar la lectura del título

### Debugging

Si no funciona, abre DevTools (F12) y revisa:

- **Console**: Busca mensajes de error de TTS
- **Network**: Verifica que la llamada a `/api/tts` sea exitosa (status 200)
- **Application**: Revisa que el secret esté en Supabase (Settings → Secrets)

## Estimación de costos

Google Cloud Text-to-Speech tiene un free tier generoso:

- **Primeros 1 millón de caracteres/mes:** GRATIS
- **Después:** $16 USD por millón de caracteres

Para una app educativa como Lumi, el free tier debería ser suficiente.

## Solución de problemas

### Error: "GOOGLE_TTS_KEY environment variable not set"

- El secret no se agregó correctamente en Supabase
- Redeploy las funciones después de agregar el secret

### Error: "HTTP 403"

- Las credenciales del JSON son inválidas
- Verifica que el JSON esté completo y sin errores

### No se escucha sonido

- Verifica que la accesibilidad esté habilitada
- Revisa el volumen del dispositivo
- Intenta con un texto diferente (el anterior podría estar en cache)

### Error CORS

- Asegúrate de que el endpoint esté bien configurado en Supabase
- El CORS ya está habilitado en el servidor Hono

## Próximos pasos opcionales

Después de que TTS funcione, puedes:

1. **Agregar selector de voces** en la UI
2. **Agregar control de volumen** en AccessibilityPanel
3. **Agregar selector de idiomas**
4. **Implementar caché persistente** en IndexedDB
5. **Optimizar para red lenta** con streaming de audio
