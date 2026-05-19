# 🏗️ ARQUITECTURA PROPUESTA - Próxima Sesión

> Este documento describe cómo reorganizar el proyecto de Lumi App en la próxima sesión para tener una arquitectura escalable y mantenible.

---

## 📊 Estructura Actual vs Propuesta

### ❌ ESTRUCTURA ACTUAL (Confusa)

```
src/
├── lib/storage/              ← Nuevo (correctamente organizado ✓)
├── types/                    ← Nuevo (correctamente organizado ✓)
├── hooks/                    ← Nuevo (correctamente organizado ✓)
├── styles/
│   └── tailwind-constants.ts ← Nuevo (correctamente organizado ✓)
├── app/
│   ├── pages/                ← Plano (14 páginas sin relación clara)
│   └── components/           ← Mezclado (52 UI + 5 custom)
└── utils/                    ← Vacío (solo credenciales)
```

**Problemas:**
- `/app/components/` tiene 57 componentes sin organización
- `/app/pages/` tiene 14 páginas sin agrupar por feature
- Difícil saber qué componentes son para qué página
- No se puede saber qué es compartido vs específico

---

### ✅ ESTRUCTURA PROPUESTA (Escalable)

```
src/
├── features/                          # 🎯 NUEVAS FEATURE FOLDERS
│   ├── auth/                          # Autenticación y bienvenida
│   │   ├── pages/
│   │   │   ├── WelcomePage.tsx
│   │   │   ├── ProfileSetupPage.tsx
│   │   │   └── index.ts (export)
│   │   ├── components/
│   │   │   └── (componentes específicos auth)
│   │   └── hooks/
│   │       └── (hooks específicos auth)
│   │
│   ├── routines/                      # Gestión de rutinas
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── LibraryPage.tsx
│   │   │   ├── RoutineDetailPage.tsx
│   │   │   ├── CreateRoutinePage.tsx
│   │   │   ├── GeneratingPage.tsx
│   │   │   └── index.ts (export)
│   │   ├── components/
│   │   │   ├── RoutineCard.tsx
│   │   │   ├── ActivityCard.tsx
│   │   │   └── (otros específicos)
│   │   └── hooks/
│   │       └── (hooks específicos routines)
│   │
│   ├── profile/                       # Perfil usuario
│   │   ├── pages/
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── InterestsPage.tsx
│   │   │   └── index.ts (export)
│   │   ├── components/
│   │   │   ├── InterestCard.tsx
│   │   │   └── (otros específicos)
│   │   └── hooks/
│   │       └── (hooks específicos profile)
│   │
│   ├── reminders/                     # Recordatorios
│   │   ├── pages/
│   │   │   ├── RemindersPage.tsx
│   │   │   └── index.ts (export)
│   │   ├── components/
│   │   └── hooks/
│   │
│   ├── onboarding/                    # Preguntas y voz
│   │   ├── pages/
│   │   │   ├── QuestionsPage.tsx
│   │   │   ├── VoiceInputPage.tsx
│   │   │   └── index.ts (export)
│   │   ├── components/
│   │   └── hooks/
│   │
│   └── sharing/                       # Compartir
│       ├── pages/
│       │   ├── SharePage.tsx
│       │   └── index.ts (export)
│       ├── components/
│       └── hooks/
│
├── shared/                            # 🔄 COMPONENTES COMPARTIDOS
│   └── components/
│       ├── layouts/
│       │   ├── PageLayout.tsx
│       │   └── index.ts
│       ├── buttons/
│       │   ├── AccessibleButton.tsx
│       │   ├── CardButton.tsx
│       │   └── index.ts
│       ├── cards/
│       │   ├── StatCard.tsx
│       │   └── index.ts
│       ├── navigation/
│       │   ├── BottomNavigation.tsx
│       │   └── index.ts
│       ├── ui/                       # Shadcn/ui (52 componentes)
│       │   ├── sidebar.tsx
│       │   ├── button.tsx
│       │   ├── checkbox.tsx
│       │   ├── dialog.tsx
│       │   └── ... (48 más)
│       └── index.ts                  # Export todos
│
├── lib/                               # 📚 UTILIDADES
│   ├── storage/
│   │   ├── index.ts
│   │   └── types.ts
│   ├── api/
│   │   └── index.ts
│   └── utils/
│       └── helpers.ts
│
├── hooks/                             # 🎣 CUSTOM HOOKS GLOBALES
│   ├── useLocalStorage.ts
│   ├── useRoutines.ts
│   ├── useUserProfile.ts
│   └── index.ts
│
├── types/                             # 📋 TIPOS GLOBALES
│   └── index.ts
│
├── styles/                            # 🎨 ESTILOS GLOBALES
│   ├── index.css
│   ├── tailwind.css
│   ├── theme.css
│   ├── tailwind-constants.ts
│   └── fonts.css
│
├── app/                               # 🚀 APP ROOT
│   ├── App.tsx
│   ├── routes.tsx
│   └── index.ts
│
└── main.tsx                           # 🎬 ENTRADA

# En raíz del proyecto:
├── tsconfig.json
├── vite.config.ts
├── package.json
├── .eslintrc.json
├── .prettierrc
└── REFACTOR_STATUS.md                 # Este documento
```

---

## 🔄 Plan de Migración

### Paso 1: Crear Estructura de Carpetas

```bash
# Crear carpetas base
mkdir -p src/features/{auth,routines,profile,reminders,onboarding,sharing}
mkdir -p src/shared/components/{layouts,buttons,cards,navigation,ui}

# Cada feature necesita
mkdir -p src/features/{auth,routines,profile,reminders,onboarding,sharing}/{pages,components,hooks}
```

### Paso 2: Mover Páginas

**Feature: auth/**
```bash
mv src/app/pages/WelcomePage.tsx src/features/auth/pages/
mv src/app/pages/ProfileSetupPage.tsx src/features/auth/pages/
# NotFoundPage podría ir aquí o en shared
mv src/app/pages/NotFoundPage.tsx src/features/auth/pages/
```

**Feature: routines/**
```bash
mv src/app/pages/HomePage.tsx src/features/routines/pages/
mv src/app/pages/LibraryPage.tsx src/features/routines/pages/
mv src/app/pages/RoutineDetailPage.tsx src/features/routines/pages/
mv src/app/pages/CreateRoutinePage.tsx src/features/routines/pages/
mv src/app/pages/GeneratingPage.tsx src/features/routines/pages/
```

**Feature: profile/**
```bash
mv src/app/pages/ProfilePage.tsx src/features/profile/pages/
mv src/app/pages/InterestsPage.tsx src/features/profile/pages/
```

**Feature: reminders/**
```bash
mv src/app/pages/RemindersPage.tsx src/features/reminders/pages/
```

**Feature: onboarding/**
```bash
mv src/app/pages/QuestionsPage.tsx src/features/onboarding/pages/
mv src/app/pages/VoiceInputPage.tsx src/features/onboarding/pages/
```

**Feature: sharing/**
```bash
mv src/app/pages/SharePage.tsx src/features/sharing/pages/
```

### Paso 3: Mover Componentes por Feature

```bash
# Routines
mv src/app/components/RoutineCard.tsx src/features/routines/components/
mv src/app/components/ActivityCard.tsx src/features/routines/components/

# Profile
mv src/app/components/InterestCard.tsx src/features/profile/components/

# Shared
mv src/app/components/layouts/PageLayout.tsx src/shared/components/layouts/
mv src/app/components/CardButton.tsx src/shared/components/buttons/
mv src/app/components/StatCard.tsx src/shared/components/cards/
mv src/app/components/BottomNavigation.tsx src/shared/components/navigation/
mv src/app/components/AccessibleButton.tsx src/shared/components/buttons/
mv src/app/components/ImageWithFallback.tsx src/shared/components/

# UI (shadcn/ui)
mv src/app/components/*.tsx src/shared/components/ui/  # 52 files
```

### Paso 4: Actualizar Imports

**En cada página, cambiar:**
```typescript
// ❌ ANTES
import { PageLayout } from '../components/layouts/PageLayout';
import { storage } from '../../../lib/storage';
import { useRoutines } from '../../../hooks/useRoutines';

// ✅ DESPUÉS
import { PageLayout } from '@/shared/components/layouts';
import { storage } from '@/lib/storage';
import { useRoutines } from '@/hooks';
```

**Crear `index.ts` en cada carpeta:**

```typescript
// src/features/routines/pages/index.ts
export { HomePage } from './HomePage';
export { LibraryPage } from './LibraryPage';
export { RoutineDetailPage } from './RoutineDetailPage';

// src/features/routines/components/index.ts
export { RoutineCard } from './RoutineCard';
export { ActivityCard } from './ActivityCard';

// src/shared/components/index.ts
export * from './layouts';
export * from './buttons';
export * from './cards';
export * from './navigation';
// export * from './ui';  // Opcional si los usas indirectamente
```

### Paso 5: Actualizar Routes

```typescript
// src/app/routes.tsx (ANTES)
import { HomePage } from '../pages/HomePage';
import { ProfilePage } from '../pages/ProfilePage';
// ... 14 imports

// DESPUÉS
import { HomePage, LibraryPage, RoutineDetailPage } from '@/features/routines/pages';
import { ProfilePage, InterestsPage } from '@/features/profile/pages';
import { WelcomePage, ProfileSetupPage } from '@/features/auth/pages';
import { RemindersPage } from '@/features/reminders/pages';
import { QuestionsPage, VoiceInputPage } from '@/features/onboarding/pages';
import { SharePage } from '@/features/sharing/pages';
import { NotFoundPage } from '@/features/auth/pages';
```

### Paso 6: Limpiar

```bash
# Eliminar carpetas ahora vacías
rmdir src/app/pages
rmdir src/app/components
```

---

## 📋 Checklist para Próxima Sesión

- [ ] Verificar que `pnpm dev` funciona sin errores
- [ ] Verificar que todas las 14 rutas funcionan
- [ ] Crear estructura de carpetas (`src/features/`, `src/shared/`)
- [ ] Mover archivos paso por paso
- [ ] Actualizar imports en cada archivo
- [ ] Crear `index.ts` en cada carpeta
- [ ] Actualizar `src/app/routes.tsx`
- [ ] Ejecutar `pnpm lint` - debe pasar
- [ ] Ejecutar `pnpm dev` - debe iniciar sin errores
- [ ] Verificar que todas las 14 rutas siguen funcionando
- [ ] Eliminar carpetas vacías

---

## 💡 Beneficios de Esta Estructura

### ✅ Escalabilidad
- Agregar nueva feature = agregar `src/features/new-feature/`
- Fácil entender qué pertenece a qué
- Aislado: cambios en feature X no afectan feature Y

### ✅ Mantenibilidad
- `src/features/routines/` = TODO sobre rutinas
- Si necesito cambiar componente de rutina, lo encuentro en `/features/routines/components/`
- Si necesito agregar hook de rutina, lo creo en `/features/routines/hooks/`

### ✅ Reusabilidad
- `src/shared/components/` = componentes reutilizables
- Si dos features necesitan algo, va a `shared/`
- UI commonente va a `shared/components/ui/`

### ✅ Testabilidad
- Cada feature puede testearse independientemente
- `__tests__/` o `.test.ts` files junto a su feature

### ✅ Performance
- Lazy loading por feature: `const Routines = lazy(() => import('@/features/routines/pages'))`
- Bundle splitting automático

---

## 🎯 Próximas Optimizaciones (Después de Reorganizar)

1. **Lazy Loading**
```typescript
const HomePage = lazy(() => import('@/features/routines/pages/HomePage'));
```

2. **Validación de Storage**
```typescript
// En storage manager, agregar schema validation (zod)
```

3. **Tests**
```bash
src/
├── features/routines/__tests__/
│   ├── pages.test.ts
│   ├── hooks.test.ts
│   └── components.test.ts
```

4. **Documentación**
```
docs/
├── ARCHITECTURE.md
├── CONTRIBUTING.md
├── ADD_FEATURE.md
```

---

## 📝 Notas Importantes

- **NO mover todo de una vez** → Hacer paso por paso y verificar en cada paso
- **Actualizar imports gradualmente** → Usar `Ctrl+Shift+H` (Find & Replace) en VS Code
- **Verificar rutas funcionan** → Después de cada movimiento grande
- **Commit después de cada sección** → Facilita revertir si algo falla
- **Tests después de migrar** → Para asegurar que nada se rompió

---

## 🚀 Comandos Útiles para la Sesión

```bash
# Navegar al proyecto
cd /home/josedmg/Documentos/vsprojects/lumi-app

# Iniciar dev server
pnpm dev

# Verificar linting
pnpm lint

# Formatear código
pnpm format

# Crear carpetas rápidamente
mkdir -p src/features/{auth,routines,profile,reminders,onboarding,sharing}/{pages,components,hooks}
mkdir -p src/shared/components/{layouts,buttons,cards,navigation,ui}
```

---

**Última actualización:** 2026-05-19  
**Estado:** Plan listo para implementar en próxima sesión  
**Estimado:** 1-2 horas para completar toda la reorganización
