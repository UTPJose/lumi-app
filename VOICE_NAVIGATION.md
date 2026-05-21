# Voice Navigation System

## Overview

The voice navigation system enables users to navigate the app using voice commands. It intelligently matches spoken words to interactive elements on the current page.

## How It Works

### 1. Command Extraction
When the Voice Assistant is enabled, the system automatically scans the page for interactive elements:
- Buttons
- Links (`<a>` tags with href)
- Submit inputs
- Elements with `role="button"`
- Clickable elements with `onclick`

For each element, it extracts:
- **aria-label**: Most important for accessibility
- **title**: Fallback label
- **data-voice-command**: Custom voice command (optional)
- **textContent**: Element's text

### 2. Keyword Generation
From extracted text, the system generates multiple keywords:
- Exact phrase match (e.g., "crear nueva rutina")
- Individual words (e.g., "crear", "nueva", "rutina")
- Word pairs (e.g., "crear nueva", "nueva rutina")

### 3. Speech Recognition
When enabled, the system:
- Listens continuously for speech in Spanish (es-ES)
- Converts speech to text using Web Speech API
- Processes only final transcripts (not interim)

### 4. Command Matching
For each recognized transcript, the system:
1. **Exact match**: If transcript exactly matches a keyword (score: 1.0)
2. **Substring match**: If transcript is contained in a keyword or vice versa (score: 0.9)
3. **Word-level match**: If transcript words match keyword words (score: word_ratio)
4. **Fuzzy match**: Uses Levenshtein distance for typo tolerance (score: distance-based)

Minimum confidence threshold: **0.6** (60%)

### 5. Action Execution
When a match is found above the threshold:
- Simulates a click on the matched element
- Logs the confidence score and matched keyword
- Falls back to generic commands if no page command matches

### 6. Fallback Commands
If no page command matches, the system responds to:
- **"siguiente"** / **"next"** → Focus next focusable element
- **"anterior"** / **"previous"** → Focus previous focusable element
- **"click"** / **"seleccionar"** / **"activar"** → Click focused element
- **"cerrar"** → Click close button

## Example Flow

### Page with buttons:
```html
<button aria-label="Crear nueva rutina">Create</button>
<button aria-label="Mis rutinas">Library</button>
```

### Extracted keywords:
```
Button 1: ["crear nueva rutina", "crear", "nueva", "rutina", "crear nueva", "nueva rutina"]
Button 2: ["mis rutinas", "mis", "rutinas"]
```

### User says: "crear rutina"
1. Normalizes to: "crear rutina"
2. Checks against keywords:
   - "crear nueva rutina" contains "crear rutina" → score: 0.9 ✅
   - "mis rutinas" → no match
3. Executes: Click on "Create" button

### User says: "crearrr rutinaa"
1. Uses Levenshtein distance → score: ~0.8 ✅
2. Executes: Click on "Create" button (handles typos)

## Implementation Details

### Files
- **src/utils/voiceCommandExtractor.ts**: Command extraction and matching logic
- **src/hooks/useVoiceAssistant.ts**: Speech recognition and integration
- **src/shared/components/accessibility/VoiceAssistantManager.tsx**: Provider component

### Best Practices for Developers

1. **Always add aria-labels to interactive elements**
   ```tsx
   <button aria-label="Crear nueva rutina">
     Create New Routine
   </button>
   ```

2. **Use clear, descriptive labels**
   - Good: "Crear nueva rutina"
   - Bad: "Button 1", "Action", "Click here"

3. **For complex actions, add data-voice-command**
   ```tsx
   <button 
     aria-label="Settings"
     data-voice-command="configuración"
     onClick={handleSettings}
   >
     ⚙️ Settings
   </button>
   ```

4. **Consider word combinations**
   - Single word keywords won't match multi-word commands well
   - "Crear", "nueva", and "rutina" are good for word-level matching

### Customization

To customize confidence thresholds or matching behavior, edit `src/utils/voiceCommandExtractor.ts`:

```typescript
// Current thresholds:
if (confidence > 0.6) {  // Minimum confidence
  // Match found
}
```

## Troubleshooting

### Voice commands not working:
1. Check browser support (Chrome, Edge, Safari - not all browsers support Web Speech API)
2. Verify Voice Assistant is enabled in Accessibility Panel
3. Check browser microphone permissions
4. Open browser console to see matching confidence scores

### False matches:
1. Increase confidence threshold in `findBestMatch()`
2. Add more specific data-voice-command attributes
3. Ensure aria-labels are descriptive

### Not recognizing speech:
1. Speak clearly in Spanish
2. Check that lang is set to 'es-ES' in `useVoiceAssistant.ts`
3. Try in a quieter environment
4. Check microphone levels
