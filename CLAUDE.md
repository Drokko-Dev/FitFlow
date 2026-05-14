# CLAUDE.md

Guía de referencia para Claude Code al trabajar en este repositorio.

## Descripción

**FitFlow** es una app de fitness móvil PWA. Permite al usuario crear planes de entrenamiento, ejecutarlos con cronómetro, registrar sesiones y visualizar su progreso muscular. Soporta tema claro y oscuro con color de acento dinámico. Mobile-first, max-width 480 px.

## Comandos

```bash
npm run dev       # Dev server con HMR (Vite)
npm run build     # Build de producción → dist/
npm run preview   # Preview del build
npm run lint      # ESLint
```

No hay suite de tests configurada.

## Stack

| Capa | Tecnología | Versión |
|------|-----------|---------|
| UI | React | 19 |
| Bundler | Vite | 8 |
| Estilos | Tailwind CSS | 3.4 |
| Routing | React Router DOM | 7 |
| Backend / Auth | Supabase | — |
| Iconos | Lucide React | 1.14 |
| Gráficas | Recharts | — |
| Músculo SVG | react-muscle-highlighter | 1.2 |
| Drag & drop | @dnd-kit/core + sortable + utilities | — |
| PWA | vite-plugin-pwa + Workbox | — |

## Commits

Usar siempre `/commit` para analizar los cambios y hacer commits semánticos agrupados. Nunca commitear a mano.

## Estructura de carpetas

```
src/
  App.jsx                      # Shell: auth gate + BrowserRouter + rutas + BottomNav
  main.jsx                     # Entry point: aplica tema guardado antes de montar React
  lib/
    supabase.js                # Cliente Supabase (createClient con VITE_SUPABASE_*)
  hooks/
    useSupabase.js             # Funciones CRUD hacia Supabase (fetchProfile, createSession…)
  styles/
    global.css                 # Variables CSS de tema + @tailwind + .no-scrollbar
  store/
    AppContext.jsx              # Estado global + localStorage + CRUD + sync Supabase
  data/
    exercises.js               # Catálogo de 62 ejercicios (solo local, no en Supabase)
  components/
    AIMessage.jsx              # Tarjeta de sugerencia de IA (usa muscleScores)
    BodyMap.jsx                # Tarjeta flip 3D: SVG muscular ↔ barras de progreso
    BottomNav.jsx              # Nav fija inferior con 4 tabs (iconos Lucide, w-1/4 cada uno)
    ExerciseDetailModal.jsx    # Modal de detalle de ejercicio (emoji + descripción + stats)
    WeekStats.jsx              # Estadísticas semanales (días 🔥, tiempo, kcal)
  pages/
    Login.jsx                  # Autenticación: tabs Login / Register con Supabase Auth
    Home.jsx                   # Pantalla principal (saludo, AIMessage, WeekStats, BodyMap)
    Profile.jsx                # Perfil: avatar, stats, Mis datos, IMC, Récords personales (PRs)
    Settings.jsx               # Configuración: preferencias, objetivos, cuenta, logout
    Exercises.jsx              # Controlador de vistas (estado local: list/workout/editor)
    exercises/
      PlanList.jsx             # Vista 1 — lista de planes
      WorkoutMode.jsx          # Vista 2 — entrenamiento con cronómetro y series
      PlanEditor.jsx           # Vista 3 — editor de plan en 2 pasos (slide)
```

## Autenticación

- **`Login.jsx`**: pantalla de auth con tabs "Iniciar sesión" / "Registrarse". Usa `supabase.auth.signInWithPassword` y `supabase.auth.signUp`.
- **`App.jsx`**: lee la sesión con `supabase.auth.getSession()` y suscribe a `onAuthStateChange`. Muestra spinner mientras carga, `<Login />` si no hay sesión, o la app completa con `<AppProvider userId={session.user.id}>` si hay sesión activa.
- **Logout**: en `Settings.jsx` → llama a `logout()` del contexto → limpia localStorage y llama `supabase.auth.signOut()`.
- **Trigger automático**: `on_auth_user_created` en Supabase crea la fila en `profiles` al registrarse.

Variables de entorno requeridas en `.env`:
```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-publica
```

## Base de datos Supabase

Todas las tablas tienen RLS habilitado con política `auth.uid() = user_id`.

### Esquema de tablas

```sql
-- Perfil del usuario (1 fila por usuario)
profiles
  id           uuid  references auth.users  PK
  name         text
  emoji        text  default '🏋️'
  weight       numeric    -- kg
  height       numeric    -- cm
  age          integer
  gender       text       -- 'Masculino' | 'Femenino'
  goal         text       -- 'Ganar músculo' etc.
  days_per_week integer default 4
  created_at   timestamp default now()

-- Planes de entrenamiento
plans
  id           uuid  PK default gen_random_uuid()
  user_id      uuid  references auth.users
  name         text
  exercises    jsonb   -- array completo de objetos de ejercicio
  created_at   timestamp default now()

-- Sesiones de entrenamiento completadas
sessions
  id           uuid  PK default gen_random_uuid()
  user_id      uuid  references auth.users
  date         date  default current_date   -- YYYY-MM-DD
  duration_min integer
  calories     integer
  plan_name    text  nullable
  created_at   timestamp default now()

-- Récords personales
personal_records
  id            uuid  PK default gen_random_uuid()
  user_id       uuid  references auth.users
  exercise_name text
  history       jsonb   -- [{date, weight}]
  created_at    timestamp default now()

-- Historial muscular por sesión
muscle_history
  id          uuid  PK default gen_random_uuid()
  user_id     uuid  references auth.users
  session_id  uuid  references sessions(id) on delete cascade
  muscle      text    -- 'pecho' | 'espalda' | 'brazos' | 'hombros' | 'pierna' | 'core'
  sets        integer
  date        date  default current_date
```

### Mapeo local ↔ DB (profiles)

| Local (AppContext) | DB column |
|---|---|
| `userName` | `name` |
| `userEmoji` | `emoji` |
| `userStats.peso` | `weight` |
| `userStats.estatura` | `height` |
| `userStats.edad` | `age` |
| `userStats.genero` | `gender` |
| `goals.goal` | `goal` |
| `goals.daysPerWeek` | `days_per_week` |
| `accentColor` | — solo localStorage |
| `preferences` | — solo localStorage |
| `muscleScores` | — solo localStorage |

Usar siempre `toProfileRow()` / `fromProfileRow()` en AppContext para convertir entre formatos.

### Funciones en `useSupabase.js`

- `fetchProfile(uid)` — lee fila de profiles
- `updateProfile(uid, row)` — upsert de profiles
- `fetchPlans(uid)` — array de planes
- `createPlan(uid, plan)` / `updatePlan(id, updated)` / `deletePlan(id)`
- `fetchSessions(uid)` — array de sesiones (mapea date→fecha, duration_min→duracionMin, calories→calorias)
- `createSession(uid, session)` → devuelve UUID de la sesión creada
- `insertMuscleHistory(uid, sessionId, exercises, date)` — agrupa por `ex.muscle`, suma series, inserta una fila por grupo muscular
- `calculateMuscleScores(uid)` — últimos 14 días, devuelve `{ pecho, espalda, brazos, hombros, pierna, core }`
- `fetchPRs(uid)` — array de personal_records
- `createPR(uid, pr)` / `updatePR(id, history)`

## Muscle Scores

- Calculados desde `muscle_history` de los últimos 14 días.
- Objetivo: 15 series por músculo cada 2 semanas.
- Fórmula: `score = Math.min(100, Math.round((totalSeries / 15) * 100))`
- Se recalculan al cargar la app (`loadUserData`) y al completar una sesión (`addSession`).
- Se almacenan en AppContext y en localStorage; **no tienen columna en Supabase**.

## AppContext (`src/store/AppContext.jsx`)

Único store de la app. Persiste en `localStorage` bajo la clave `fitflow_state` (caché offline). La fuente de verdad es Supabase cuando hay sesión activa.

**Guardia de versión**: `DATA_VERSION = 4`. Si no coincide con localStorage, se resetea a `defaultState`.

### Props

- `userId` (string) — ID del usuario autenticado. Si es `undefined`, las mutaciones operan solo en localStorage.

### Estado expuesto por `useApp()`

```js
// Perfil
userName        // string
userEmoji       // string — emoji del avatar

// Planes de entrenamiento
plans           // Plan[]
addPlan(plan)           // crea plan con UUID, sincroniza con Supabase
updatePlan(id, updated) // actualiza plan por id
deletePlan(id)          // elimina plan por id

// Progreso muscular (0–100 por grupo)
muscleScores    // { pecho, espalda, brazos, hombros, pierna, core }

// Historial de sesiones
weekHistory     // { fecha: 'YYYY-MM-DD', duracionMin, calorias, planName? }[]

// Preferencias
preferences     // { reminders: boolean }
accentColor     // string — hex del color de acento activo
goals           // { daysPerWeek: number, goal: string }

// Datos físicos
userStats       // { peso: number|null, estatura: number|null, edad: number|null, genero: string }

// Récords personales
prs             // { id: uuid, exerciseName, history: { date: 'YYYY-MM-DD', weight: number }[] }[]

// Actualización genérica (shallow merge + sync Supabase si aplica)
updateState(partial)

// PRs
addPR(exerciseName, firstEntry?)   // firstEntry = { date, weight }
addPREntry(prId, { date, weight })

// Auth
logout()        // limpia localStorage + supabase.auth.signOut()

// Loading
dataLoading     // boolean — true mientras carga datos de Supabase al iniciar
```

### Estructura de un Plan

```js
{
  id: string,         // UUID generado con crypto.randomUUID()
  name: string,
  exercises: [
    {
      id, name, muscle, category,
      description, secPerRep, calPerRep, restSec, icon,  // del catálogo
      variation?,  // nombre del ejercicio base (opcional)
      sets: number,
      reps: number,
    }
  ]
}
```

## Persistencia

| Clave localStorage | Contenido |
|---|---|
| `fitflow_state` | Caché offline del estado de AppContext |
| `fitflow-dark-mode` | `'true'` \| `'false'` — tema activo |

Supabase es la fuente de verdad para `plans`, `weekHistory`, `prs`, `profile`. El localStorage actúa de caché para carga instantánea y modo offline.

## Catálogo de ejercicios (`src/data/exercises.js`)

62 ejercicios locales, **no se almacenan en Supabase**. Los planes guardan el objeto de ejercicio completo en `exercises (jsonb)`.

| Músculo | Ejercicios (base + variaciones) |
|---------|--------------------------------|
| `pecho` | Press de Banca, Aperturas, Flexiones, Press Inclinado, Press con Mancuernas, Press Declinado, Fondos en Paralelas, Crossover en Polea, Push-up Diamante |
| `espalda` | Peso Muerto, Dominadas, Remo con Barra, Jalón Polea, Remo en Polea Baja, Remo con Mancuerna, Pull-over con Mancuerna, Hiperextensiones, Remo en Máquina |
| `brazos` | Curl de Bíceps, Curl Martillo, Tríceps Polea, Fondos, Curl con Barra, Curl en Polea, Curl Concentrado, Curl 21s, Extensión Tumbado, Patada de Tríceps, Extensión sobre Cabeza, Dips entre Bancos |
| `hombros` | Press Militar, Elevaciones Lat., Face Pull, Press Arnold, Elevaciones Frontales, Pájaros, Encogimientos, Press con Mancuernas |
| `pierna` | Sentadilla, Prensa de Pierna, Zancadas, Leg Curl, Pantorrillas, Sentadilla Sumo, Sentadilla Búlgara, Peso Muerto Rumano, Hip Thrust, Extensión de Cuádriceps, Abductores, Adductores, Step-up |
| `core` | Plancha, Abdominales, Rueda Abdominal, Crunch, Crunch Inverso, Russian Twist, Elevación de Piernas, Plancha Lateral, Dead Bug, Dragon Flag, Cable Crunch |

Cada ejercicio: `{ id, name, muscle, category, description, secPerRep, calPerRep, restSec, icon, variation? }`.

- **`restSec`** — descanso entre series (segundos). Basado en Schoenfeld 2016:
  - `fuerza`: 120 s (recuperación del SNC)
  - `aislamiento`: 60 s (metabólico)
  - `peso corporal`: 45 s (alta densidad)
  - `máquina`: 60 s (similar a aislamiento)
- **`secPerRep`** — duración de una repetición (fase concéntrica + excéntrica, ~2 s + 2 s):
  - `fuerza`: 5 s · `aislamiento`: 4 s · `peso corporal`: 4 s · `máquina`: 4 s
  - Excepción: Plancha `secPerRep: 1` (isométrico — cada "rep" equivale a 1 s de hold, las reps = segundos totales)
- **`variation`** — nombre del ejercicio base del que deriva (opcional). Ej.: `variation: 'Curl de Bíceps'`.

### Fórmulas de negocio

```
// Tiempo estimado (incluye descanso entre series + descanso entre ejercicios)
tiempoSeg = Σ[(sets × reps × secPerRep) + ((sets - 1) × restSec)]  +  90 × (numEjercicios - 1)
tiempoMin = tiempoSeg / 60
//           └─ por ejercicio ──────────────────────────────────────┘  └─ transiciones ────────┘

// Usado en: PlanEditor (tiempo en vivo paso 2), PlanList (duración en card)
// WorkoutMode usa elapsed (cronómetro real), no esta fórmula

calorias = series × reps × calPerRep

muscleScores colores:
  ≥ 60  → green  (#22d3a0)
  ≥ 35  → yellow (#f59e0b)
  <  35 → red    (#ef4444)
  =   0 → gris   (sin datos)
```

Al calcular duración de un plan, hacer lookup al catálogo por `ex.id` para obtener `secPerRep` y `restSec` actualizados (los planes almacenan una copia del ejercicio que puede ser antigua).

## Sistema de temas

La app soporta **modo claro y oscuro** con **color de acento dinámico**.

### Variables CSS en `:root` (`global.css`)

```css
/* Modo oscuro (por defecto) */
:root {
  --accent: 124 106 255;      /* RGB — para opacidades Tailwind */
  --bg:     #0a0a0f;
  --bg2:    #12121a;
  --bg3:    #1a1a26;
  --card:   #1e1e2e;
  --card2:  #252538;
  --border: 42 42 64;         /* RGB */
  --muted:  #8888aa;
  --fg:     #f0eeff;
  /* aliases para uso inline bg-[var(--color-*)] */
  --color-bg:     #0a0a0f;
  --color-card:   #1e1e2e;
  --color-border: #2a2a40;
  --color-muted:  #8888aa;
  /* toggle OFF */
  --toggle-off:    #3a3a55;
  --toggle-off-bd: transparent;
}

/* Modo claro */
[data-theme="light"] {
  --bg:     #f8f8ff;   --bg2:  #f0f0f8;  --bg3:  #e8e8f4;
  --card:   #ffffff;   --card2:#f0f0ff;
  --border: 200 200 224;
  --muted:  #666680;   --fg:   #0a0a0f;
  --color-bg: #f8f8ff; --color-card: #ffffff;
  --color-border: #c8c8dc; --color-muted: #666680;
  --toggle-off: #d1d1e0;  --toggle-off-bd: #b0b0c8;
}
```

### Cómo funciona el cambio de tema

- **`main.jsx`** — lee `localStorage('fitflow-dark-mode')` y aplica `data-theme="light"` en `<html>` síncronamente antes de montar React (evita flash).
- **`Settings.jsx` `toggleDarkMode()`** — alterna `data-theme` en `document.documentElement` y actualiza `--color-*` vía `style.setProperty`.
- Persiste en `localStorage` bajo la clave `'fitflow-dark-mode'`.

### Color de acento dinámico

```js
document.documentElement.style.setProperty('--accent', 'r g b')
```
Persiste en `AppContext` bajo `accentColor`. Se restaura en `loadFromStorage` síncronamente.

Colores disponibles: `#7c6aff` (morado), `#22d3a0` (verde), `#f59e0b` (amarillo), `#ef4444` (rojo).

## Sistema de diseño

### Colores (Tailwind tokens → CSS variables)

| Token | Hex oscuro | Hex claro | Uso |
|-------|-----------|-----------|-----|
| `bg` | `#0a0a0f` | `#f8f8ff` | Fondo base |
| `bg2` | `#12121a` | `#f0f0f8` | Fondo secundario |
| `bg3` | `#1a1a26` | `#e8e8f4` | Fondo terciario |
| `card` | `#1e1e2e` | `#ffffff` | Fondo de tarjetas |
| `card2` | `#252538` | `#f0f0ff` | Tarjetas secundarias |
| `border` | `#2a2a40` | `#c8c8dc` | Bordes |
| `accent` | `#7c6aff` | — | Acción principal (dinámico) |
| `accent2` | `#a855f7` | — | Gradientes con accent |
| `green` | `#22d3a0` | — | Éxito / músculo ≥ 60 % |
| `yellow` | `#f59e0b` | — | Advertencia / músculo ≥ 35 % |
| `red` | `#ef4444` | — | Error / músculo < 35 % |
| `muted` | `#8888aa` | `#666680` | Texto secundario |

> `accent`, `border` y `green` usan `rgb(var(--…) / <alpha-value>)` para soportar opacidades (`bg-accent/15`, `border-border/60`, etc.).

### Fuentes

- **`font-display`** → `Syne` (títulos de sección, números grandes, labels de UI)
- **`font-body`** → `DM Sans` (cuerpo de texto, subtítulos, botones)
- **`font-heading`** → `Plus Jakarta Sans` (títulos principales de página: "Mis Planes", "Configuración", nombre de usuario en Profile)

Todas vienen de Google Fonts, cacheadas por el service worker con `CacheFirst`.

### Animaciones Tailwind personalizadas

| Clase | Efecto |
|-------|--------|
| `animate-pulse-dot` | Pulso de punto vivo (AIMessage badge) |
| `animate-check-pop` | Scale 1→1.22→1 al marcar una serie |
| `animate-fade-in` | Fade in 220 ms (modales) |
| `animate-slide-up` | Slide desde abajo 300 ms (cards de modal) |

### Reglas de diseño

- **Mobile-first, siempre**. Max-width del shell: `480px`, centrado en pantalla.
- **Modo oscuro por defecto**; modo claro opcional desde Settings. Usar siempre tokens de color (`bg-bg`, `bg-card`, `text-muted`) — nunca hexadecimales hardcodeados en clases Tailwind.
- **Excepción para overlays modales**: usar `bg-black/80` o `bg-black/90` — los overlays son siempre oscuros independientemente del tema.
- **Nav fija inferior**: `h-[68px]`. Todo contenido lleva `pb-[68px]` mínimo.
- **Botón fijo encima del nav**: usa `bottom-[68px]`; el contenido lleva `pb-[148px]`.
- **Scroll interno**: `<main>` tiene `overflow-y-auto no-scrollbar`. Las páginas no usan scroll del body.
- **Altura mínima de página**: `min-h-screen` en el contenedor raíz de cada página.
- **Radios**: tarjetas `rounded-2xl` (16 px), modales `rounded-[28px]`.
- **Texto principal**: `text-[#f0eeff]` en modo oscuro. En modo claro el override se aplica via CSS (`html[data-theme="light"] .text-\[\#f0eeff\]`).
- **No anidar `<button>` dentro de `<button>`**. Usar `<div role="button" tabIndex={0} onKeyDown={…}>` para el contenedor clickeable exterior y `<button>` solo para acciones internas con `e.stopPropagation()`.

## Componentes principales

### `BottomNav`
Nav fija `bottom-0`, limitada a 480 px. 4 tabs con iconos Lucide (`Home`, `Dumbbell`, `User`, `Settings`): Inicio, Ejercicios, Perfil, Ajustes. Cada tab ocupa `w-1/4`. Usa CSS variables para responder al tema (`bg-[var(--color-card)]`, `shadow-[0_-1px_0_var(--color-border)]`).

### `BodyMap`
Tarjeta con efecto flip 3D CSS. **Cara frontal**: dos SVGs del cuerpo (frente y espalda) coloreados según `muscleScores`, con `defaultFill`/`border` adaptados al tema actual (`data-theme` leído en cada render). **Cara trasera**: barras de progreso por músculo con animación al entrar. Botón ↻ en cada cara para voltear.

### `WeekStats`
Filtra `weekHistory` a la semana actual (lunes–domingo). 3 stat cards (días entrenados, horas, kcal) + tira de 7 círculos diarios con 🔥 en días entrenados.

### `AIMessage`
Lee `muscleScores`, encuentra el músculo con menor score > 0 y muestra un mensaje motivacional. Si todos son 0, muestra mensaje genérico.

### `Exercises` (controlador)
Estado local `view` (`'list' | 'workout' | 'editor'`) y `planId`. Renderiza una de las tres vistas sin React Router adicional.

### `PlanList`
Lista de planes. Cada card es un `<div role="button">` (no `<button>` para evitar anidamiento). Muestra nombre, nº de ejercicios, duración estimada y chips de los primeros 3 ejercicios. Botón ✏️ interno con `e.stopPropagation()`.

### `WorkoutMode`
Cronómetro automático. Por cada ejercicio: N círculos (uno por serie) marcados con ✓ y `animate-check-pop`. Al completar todos aparece modal 🏆 con tiempo y kcal. "Guardar sesión" llama a `addSession` (async) que crea sesión en Supabase, inserta `muscle_history` y recalcula scores.

**Descanso entre ejercicios (90 s fijo, meta-análisis Schoenfeld):**
- Mini card estática `⏱ 90 seg de descanso` visible entre cada par de ejercicios (siempre).
- Al completar todas las series de un ejercicio (excepto el último): la mini card se reemplaza por `RestCard` con countdown de 90 s, círculo SVG de progreso animado (`strokeDasharray`) y botón "Saltar descanso →".
- Al llegar a 0: `navigator.vibrate([200])` + scroll automático al siguiente ejercicio.
- Desmarcar una serie cancela el countdown activo de ese ejercicio.
- Estado: `interRest { active, afterIndex, seconds }`. Countdown corre en `useEffect` solo cuando `active === true`.
- Botón ⓘ en cada ejercicio abre `ExerciseDetailModal`.

### `PlanEditor`
Flujo de **2 pasos** con animación slide horizontal:
- **Paso 1** — nombre del plan + catálogo filtrable, agrupado por músculo; toggle de ejercicios. Items del catálogo son `<div role="button">` (no `<button>`) para poder anidar el botón ⓘ de detalle con `e.stopPropagation()`.
- **Paso 2** — ejercicios seleccionados con controles −/+ de series y reps; tiempo estimado en tiempo real. **Drag & drop** con `@dnd-kit`: handle `GripVertical` en cada card → `useSortable` → `arrayMove`. Sensores: `PointerSensor` + `TouchSensor` (delay 150 ms para no conflictar con scroll en móvil).
- Botón fijo inferior único que cambia según el paso.
- ✕ en paso 2 elimina el ejercicio de la selección (y regresa a paso 1).
- Botón ⓘ abre `ExerciseDetailModal` desde el catálogo (paso 1).

### `Profile`
- **Header**: avatar emoji (click → modal 12 emojis), nombre editable inline.
- **Stat cards**: Semanas activo, Sesiones totales, Racha actual.
- **Mis datos**: peso (kg), estatura (cm), edad, género. Guarda en `userStats` al hacer blur.
- **IMC**: visible solo si hay peso y estatura. Número + categoría + barra 4 segmentos (rango 15–40).
- **PRs**: lista con mini `LineChart` de Recharts (sin ejes, 60 px alto). Modal "añadir entrada" y modal "nuevo PR" con buscador del catálogo.

### `Settings`
- **Preferencias**: toggle modo oscuro/claro, toggle recordatorios, 4 círculos de color de acento.
- **Objetivos**: días/semana (3–6), objetivo fitness (4 opciones).
- **Cuenta**: "Exportar datos" → toast "Próximamente"; "Versión: FitFlow v1.0.0"; botón Logout (rojo) → modal de confirmación → `logout()`.

### `ExerciseDetailModal`
Modal centrado (`items-center justify-center`, `max-h-[80vh]`) con overlay `bg-black/60 backdrop-blur-sm`. Muestra:
- Emoji grande (5 rem) sobre fondo `bg-gradient-to-br` según músculo (pecho→azul, espalda→naranja, brazos→morado, hombros→verde, pierna→rojo, core→amarillo).
- Badges de músculo (acento) y categoría (muted).
- Descripción del ejercicio, stat cards de `restSec` y `secPerRep`, tag de variación si aplica.
- Sin dependencia de API externa. Si en el futuro se quieren imágenes reales, añadir campo `imageUrl` en `exercises.js` apuntando a `/public/exercises/`.

### `Login`
- Pantalla full-screen con fondo oscuro, logo "FitFlow" en gradiente, tagline.
- Tabs: "Iniciar sesión" / "Registrarse".
- Inputs de email y contraseña. Errores inline. Spinner en botón durante submit.

## Convenciones de código

- **Solo Tailwind**, sin archivos `.css` por componente. El único CSS global está en `global.css`.
- **Sin comentarios** salvo que el motivo no sea obvio (workaround, invariante oculto).
- **Sin tipos TypeScript**; el proyecto es JS puro.
- **Colores**: usar siempre tokens Tailwind (`bg-bg`, `bg-card`, `text-muted`, `border-border`). Nunca hexadecimales hardcodeados en clases, excepto `text-[#f0eeff]` para texto principal.
- **Clases dinámicas**: siempre strings completos en ternarios — nunca interpolación parcial (`border-${color}`), porque Tailwind JIT no lo detecta.
- **Imports**: rutas relativas, sin alias.
- **Estado**: todo en AppContext. Los componentes de página usan estado local solo para UI efímera (pasos, animaciones, buscador, modales).
- Incrementar `DATA_VERSION` en AppContext cada vez que cambie la forma de `defaultState`.
- Antes de añadir `eslint-disable`, intentar refactorizar. Los únicos disable aceptados son `react-refresh/only-export-components` en AppContext y `react-hooks/exhaustive-deps` en `loadUserData` (dependencia intencional en `userId`).

## PWA

`vite-plugin-pwa` con Workbox. Configuración en `vite.config.js`. Service worker con `registerType: 'autoUpdate'`. Google Fonts cacheadas con `CacheFirst`.
