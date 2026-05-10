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
| Iconos | Lucide React | 1.14 |
| Gráficas | Recharts | — |
| Músculo SVG | react-muscle-highlighter | 1.2 |
| PWA | vite-plugin-pwa + Workbox | — |

## Commits

Usar siempre `/commit` para analizar los cambios y hacer commits semánticos agrupados. Nunca commitear a mano.

## Estructura de carpetas

```
src/
  App.jsx                      # Shell: BrowserRouter + rutas + BottomNav
  main.jsx                     # Entry point: aplica tema guardado antes de montar React
  styles/
    global.css                 # Variables CSS de tema + @tailwind + .no-scrollbar
  store/
    AppContext.jsx              # Estado global + localStorage + CRUD de planes
  data/
    exercises.js               # Catálogo de 23 ejercicios
  components/
    AIMessage.jsx              # Tarjeta de sugerencia de IA (usa muscleScores)
    BodyMap.jsx                # Tarjeta flip 3D: SVG muscular ↔ barras de progreso
    BottomNav.jsx              # Nav fija inferior con 4 tabs (iconos Lucide, w-1/4 cada uno)
    ExerciseCard.jsx           # Tarjeta simple (nombre + ícono) — stub
    PlanSummary.jsx            # Resumen de plan — stub
    WeekStats.jsx              # Estadísticas semanales (días, tiempo, kcal)
  pages/
    Home.jsx                   # Pantalla principal (saludo, AIMessage, WeekStats, BodyMap)
    Profile.jsx                # Perfil: avatar, stats, Mis datos, IMC, Récords personales (PRs)
    Settings.jsx               # Configuración: preferencias, objetivos, cuenta
    Exercises.jsx              # Controlador de vistas (estado local: list/workout/editor)
    exercises/
      PlanList.jsx             # Vista 1 — lista de planes
      WorkoutMode.jsx          # Vista 2 — entrenamiento con cronómetro y series
      PlanEditor.jsx           # Vista 3 — editor de plan en 2 pasos (slide)
```

## Sistema de temas

La app soporta **modo claro y oscuro** con **color de acento dinámico**.

### Variables CSS en `:root` (`global.css`)

Todos los colores estructurales son variables CSS. `tailwind.config.js` referencia estas variables para que los tokens Tailwind (`bg-bg`, `bg-card`, `text-muted`, etc.) respondan automáticamente al cambio de tema.

```css
/* Modo oscuro (por defecto) */
:root {
  --accent: 124 106 255;      /* RGB separado por espacios — para opacidades Tailwind */
  --bg:     #0a0a0f;
  --bg2:    #12121a;
  --bg3:    #1a1a26;
  --card:   #1e1e2e;
  --card2:  #252538;
  --border: 42 42 64;         /* RGB — soporta border-border/60 etc. */
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

- **`main.jsx`** — lee `localStorage('fitflow-dark-mode')` y aplica `data-theme="light"` en `<html>` **síncronamente** antes de montar React (evita flash).
- **`Profile.jsx` `toggleDarkMode()`** — alterna el atributo `data-theme` en `document.documentElement` y llama a `style.setProperty` para `--color-bg`, `--color-card`, `--color-border`, `--color-muted`.
- Persiste en `localStorage` bajo la clave `'fitflow-dark-mode'`.

### Color de acento dinámico

El acento se cambia en runtime con:
```js
document.documentElement.style.setProperty('--accent', 'r g b')
```
Persiste en `AppContext` bajo `accentColor`. Se restaura en `loadFromStorage` de forma síncrona.

Colores de acento disponibles: `#7c6aff` (morado), `#22d3a0` (verde), `#f59e0b` (amarillo), `#ef4444` (rojo).

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

> `accent`, `border` y los tokens RGB usan `rgb(var(--…) / <alpha-value>)` para soportar opacidades (`bg-accent/15`, `border-border/60`, etc.).

### Fuentes

- **`font-display`** → `Syne` (títulos, números grandes, labels de UI)
- **`font-body`** → `DM Sans` (cuerpo de texto, subtítulos, botones)

Ambas vienen de Google Fonts, cacheadas por el service worker con `CacheFirst`.

### Animaciones Tailwind personalizadas

| Clase | Efecto |
|-------|--------|
| `animate-pulse-dot` | Pulso de punto vivo (AIMessage badge) |
| `animate-check-pop` | Scale 1→1.22→1 al marcar una serie |
| `animate-fade-in` | Fade in 220 ms (modales) |
| `animate-slide-up` | Slide desde abajo 300 ms (cards de modal) |

### Reglas de diseño

- **Mobile-first, siempre**. Max-width del shell: `480px`, centrado en pantalla.
- **Modo oscuro por defecto**; modo claro opcional desde Profile. Usar siempre tokens de color (`bg-bg`, `bg-card`, `text-muted`) — nunca hexadecimales hardcodeados en clases Tailwind.
- **Excepción para overlays modales**: usar `bg-black/80` o `bg-black/90` — los overlays son siempre oscuros independientemente del tema.
- **Nav fija inferior**: `h-[68px]`. Todo contenido lleva `pb-[68px]` mínimo.
- **Botón fijo encima del nav**: usa `bottom-[68px]`; el contenido lleva `pb-[148px]`.
- **Scroll interno**: `<main>` tiene `overflow-y-auto no-scrollbar`. Las páginas no usan scroll del body.
- **Altura mínima de página**: `min-h-screen` en el contenedor raíz de cada página para que el fondo cubra siempre el viewport.
- **Radios**: tarjetas `rounded-2xl` (16 px), modales `rounded-[28px]`.
- **Texto principal**: `text-[#f0eeff]` en modo oscuro. En modo claro el override se aplica via CSS (`html[data-theme="light"] .text-\[\#f0eeff\]`).

## AppContext (`src/store/AppContext.jsx`)

Único store de la app. Persiste en `localStorage` bajo la clave `fitflow_state`.

**Guardia de versión**: `DATA_VERSION = 4`. Si no coincide con localStorage, se resetea a `defaultState`.

### Estado expuesto por `useApp()`

```js
// Perfil
userName        // string — nombre del usuario
userEmoji       // string — emoji del avatar

// Planes de entrenamiento
plans           // Plan[]
addPlan(plan)           // agrega plan al array
updatePlan(id, updated) // reemplaza un plan por id
deletePlan(id)          // elimina un plan por id

// Progreso muscular (0–100 cada uno)
muscleScores    // { pecho, espalda, brazos, hombros, pierna, core }

// Historial de sesiones
weekHistory     // { fecha: 'YYYY-MM-DD', duracionMin, calorias }[]

// Preferencias de usuario
preferences     // { reminders: boolean }
accentColor     // string — hex del color de acento activo
goals           // { daysPerWeek: number, goal: string }

// Datos físicos del usuario
userStats       // { peso: number|null, estatura: number|null, edad: number|null, genero: string }

// Records personales
prs             // { id, exerciseName, history: { date: 'YYYY-MM-DD', weight: number }[] }[]

// Actualización genérica (shallow merge)
updateState(partial)

// PRs CRUD
addPR(exerciseName, firstEntry?)   // crea nuevo PR; firstEntry = { date, weight }
addPREntry(prId, { date, weight }) // añade entrada al historial de un PR
```

### Estructura de un Plan

```js
{
  id: string,          // Date.now().toString() para nuevos
  name: string,
  exercises: [
    {
      id, name, muscle, category,
      description, secPerRep, calPerRep, icon,  // del catálogo
      sets: number,    // series (mín. 1)
      reps: number,    // repeticiones (mín. 1)
    }
  ]
}
```

## Persistencia

| Clave localStorage | Contenido |
|-------------------|-----------|
| `fitflow_state` | Todo el estado de AppContext (planes, historial, preferencias, goals, accentColor, userStats, prs) |
| `fitflow-dark-mode` | `'true'` \| `'false'` — tema activo |

## Catálogo de ejercicios (`src/data/exercises.js`)

23 ejercicios agrupados por músculo:

| Músculo | Ejercicios |
|---------|-----------|
| `pecho` | Press de Banca, Aperturas, Flexiones, Press Inclinado |
| `espalda` | Peso Muerto, Dominadas, Remo con Barra, Jalón Polea |
| `brazos` | Curl de Bíceps, Curl Martillo, Tríceps Polea, Fondos |
| `hombros` | Press Militar, Elevaciones Lat., Face Pull |
| `pierna` | Sentadilla, Prensa de Pierna, Zancadas, Leg Curl, Pantorrillas |
| `core` | Plancha, Abdominales, Rueda Abdominal |

Cada ejercicio: `{ id, name, muscle, category, description, secPerRep, calPerRep, icon }`.

### Fórmulas de negocio

```
duracionMin = series × reps × secPerRep / 60
calorias    = series × reps × calPerRep

muscleScores colores:
  ≥ 60  → green  (#22d3a0)
  ≥ 35  → yellow (#f59e0b)
  <  35 → red    (#ef4444)
  =   0 → gray   (sin datos)
```

## Componentes principales

### `BottomNav`
Nav fija `bottom-0`, centrada y limitada a 480 px. **4 tabs** con iconos Lucide (`Home`, `Dumbbell`, `User`, `Settings`): Inicio (`/home`), Ejercicios (`/exercises`), Perfil (`/profile`), Ajustes (`/settings`). Cada tab ocupa `w-1/4`. Usa `NavLink` de React Router para el estado activo.

### `BodyMap`
Tarjeta con efecto flip (perspectiva 3D CSS). **Cara frontal**: dos SVGs del cuerpo humano (frente y espalda) coloreados según `muscleScores`. **Cara trasera**: barras de progreso por músculo con animación al entrar. Botón ↻ en cada cara para voltear. Leyenda de colores debajo.

### `WeekStats`
Filtra `weekHistory` a la semana actual (lunes–domingo). Muestra 3 tarjetas (días entrenados, horas, kcal) y una tira de 7 círculos diarios con 🔥 en los días entrenados.

### `AIMessage`
Lee `muscleScores`, encuentra el músculo con menor score > 0 y muestra un mensaje motivacional. Si todos son 0, muestra mensaje genérico.

### `Exercises` (controlador)
Estado local `view` (`'list' | 'workout' | 'editor'`) y `planId`. Renderiza una de las tres vistas sin React Router adicional.

### `PlanList`
Lista de planes guardados. Cada card muestra nombre, nº de ejercicios y duración estimada. Botón ✏️ abre el editor; tap en la card abre el modo entrenamiento. Estado vacío con CTA de crear.

### `WorkoutMode`
Cronómetro automático. Por cada ejercicio: N círculos (uno por serie) que se marcan con ✓ y `animate-check-pop`. Al completar todos los ejercicios aparece un modal de celebración (🏆) con tiempo y kcal. "Guardar sesión" escribe en `weekHistory`.

### `PlanEditor`
Flujo de **2 pasos** con animación slide horizontal (`translate-x` + `transition-transform`):
- **Paso 1** — nombre del plan + catálogo filtrable por texto, agrupado por músculo; toggle de ejercicios (check verde si seleccionado). Botón "Siguiente →" con contador.
- **Paso 2** — lista de ejercicios seleccionados con controles −/+ de series y reps; tiempo estimado en tiempo real. Botón "Guardar Plan".
- Botón fijo inferior único (cambia contenido según el paso para evitar solapamientos).
- ✕ en paso 2 elimina el ejercicio y vuelve al paso 1.

### `Profile`
Página con:
- **Header**: avatar emoji (click → modal 12 emojis), nombre editable inline con `›`, fecha de miembro.
- **Stat cards**: Semanas activo (estático), Sesiones totales (`weekHistory.length`), Racha actual (días consecutivos).
- **Mis datos**: card con inputs numéricos (peso kg, estatura cm, edad años) + selector de género (Masculino / Femenino). Guarda en `userStats` del contexto al hacer blur.
- **IMC**: se muestra solo si hay peso y estatura. Número grande + categoría coloreada + barra horizontal de 4 segmentos con indicador circular. Rango 15–40.
- **Récords personales (PRs)**: lista de `prs` del contexto. Cada card muestra ejercicio, peso máximo y mini LineChart (recharts, sin ejes, 60px). Botón `+` en cada card abre modal "añadir entrada". Botón "Añadir" abre modal "Nuevo PR" con buscador del catálogo.

### `Settings`
Página de configuración con:
- **Preferencias**: toggle modo oscuro (funcional, igual que antes en Profile), toggle recordatorios, selector de 4 colores de acento.
- **Objetivos**: días por semana (3–6) y objetivo fitness (4 opciones).
- **Cuenta**: fila "Exportar datos" → toast "Próximamente" 2 s; fila "Versión" → "FitFlow v1.0.0".

## Convenciones de código

- **Solo Tailwind**, sin archivos `.css` por componente. El único CSS global está en `global.css`.
- **Sin comentarios** salvo que el motivo no sea obvio (workaround, invariante oculto).
- **Sin tipos TypeScript**; el proyecto es JS puro.
- **Colores**: usar siempre tokens Tailwind (`bg-bg`, `bg-card`, `text-muted`, `border-border`). Nunca hexadecimales hardcodeados en clases, excepto `text-[#f0eeff]` para texto principal (cubierto por override CSS en modo claro).
- **Clases dinámicas**: siempre strings completos en ternarios — nunca interpolación parcial (`border-${color}`), porque Tailwind JIT no lo detecta.
- **Imports**: rutas relativas, sin alias.
- **Estado**: todo en AppContext. Los componentes de página usan estado local solo para UI efímera (pasos, animaciones, buscador, modales).
- Incrementar `DATA_VERSION` en AppContext cada vez que cambie la forma de `defaultState` — esto resetea localStorage de todos los usuarios.
- Antes de añadir `eslint-disable`, intentar refactorizar. Los únicos disable aceptados son `react-refresh/only-export-components` en AppContext (patrón context+hook en mismo archivo).

## PWA

`vite-plugin-pwa` con Workbox. Configuración en `vite.config.js`. Service worker con `registerType: 'autoUpdate'`. Google Fonts cacheadas con `CacheFirst`.
