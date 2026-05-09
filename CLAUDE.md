# CLAUDE.md

Guía de referencia para Claude Code al trabajar en este repositorio.

## Descripción

**FitFlow** es una app de fitness móvil PWA. Permite al usuario crear planes de entrenamiento, ejecutarlos con cronómetro, registrar sesiones y visualizar su progreso muscular. Siempre tema oscuro, mobile-first, max-width 480 px.

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
| Músculo SVG | react-muscle-highlighter | 1.2 |
| PWA | vite-plugin-pwa + Workbox | — |

## Commits

Usar siempre `/commit` para analizar los cambios y hacer commits semánticos agrupados. Nunca commitear a mano.

## Estructura de carpetas

```
src/
  App.jsx                      # Shell: BrowserRouter + rutas + BottomNav
  main.jsx                     # Entry point, monta AppProvider
  styles/
    global.css                 # @tailwind directives + .no-scrollbar utility
  store/
    AppContext.jsx              # Estado global + localStorage + CRUD de planes
  data/
    exercises.js               # Catálogo de 23 ejercicios
  components/
    AIMessage.jsx              # Tarjeta de sugerencia de IA (usa muscleScores)
    BodyMap.jsx                # Tarjeta flip: SVG muscular ↔ barras de progreso
    BottomNav.jsx              # Nav fija inferior con 3 tabs
    ExerciseCard.jsx           # Tarjeta simple (nombre + ícono) — stub
    PlanSummary.jsx            # Resumen de plan — stub
    WeekStats.jsx              # Estadísticas semanales (días, tiempo, kcal)
  pages/
    Home.jsx                   # Pantalla principal (saludo, AIMessage, WeekStats, BodyMap)
    Profile.jsx                # Perfil con barras de muscleScores
    Exercises.jsx              # Controlador de vistas (estado local: list/workout/editor)
    exercises/
      PlanList.jsx             # Vista 1 — lista de planes
      WorkoutMode.jsx          # Vista 2 — entrenamiento con cronómetro y series
      PlanEditor.jsx           # Vista 3 — editor de plan en 2 pasos (slide)
```

## Sistema de diseño

### Colores (Tailwind tokens)

| Token | Hex | Uso |
|-------|-----|-----|
| `bg` | `#0a0a0f` | Fondo base de la app |
| `bg2` | `#12121a` | Fondo secundario |
| `bg3` | `#1a1a26` | Fondo terciario |
| `card` | `#1e1e2e` | Fondo de tarjetas |
| `card2` | `#252538` | Tarjetas secundarias |
| `border` | `#2a2a40` | Bordes generales |
| `accent` | `#7c6aff` | Color primario de acción (morado) |
| `accent2` | `#a855f7` | Gradientes con accent |
| `green` | `#22d3a0` | Éxito, músculo bien trabajado (≥ 60 %) |
| `yellow` | `#f59e0b` | Advertencia, músculo poco trabajado (≥ 35 %) |
| `red` | `#ef4444` | Error, músculo sin trabajo (< 35 %) |
| `muted` | `#8888aa` | Texto secundario |

### Fuentes

- **`font-display`** → `Syne` (títulos, números grandes, labels de UI)
- **`font-body`** → `DM Sans` (cuerpo de texto, subtítulos, botones de texto)

Ambas vienen de Google Fonts, cacheadas por el service worker con `CacheFirst`.

### Animaciones Tailwind personalizadas

| Clase | Efecto |
|-------|--------|
| `animate-pulse-dot` | Pulso de punto vivo (AIMessage badge) |
| `animate-check-pop` | Scale 1→1.22→1 al marcar una serie |
| `animate-fade-in` | Fade in 220 ms (modal de finalización) |
| `animate-slide-up` | Slide desde abajo 300 ms (card del modal) |

### Reglas de diseño

- **Mobile-first, siempre**. Max-width del shell: `480px`, centrado en pantalla.
- **Tema oscuro permanente**. No hay modo claro, no hay variables dinámicas de color.
- **Nav fija inferior**: `h-[68px]`. Todo contenido lleva `pb-[68px]` mínimo.
- **Botón fijo encima del nav**: usa `bottom-[68px]`; el contenido lleva `pb-[148px]`.
- **Scroll interno**: `<main>` tiene `overflow-y-auto no-scrollbar`. Las páginas no usan scroll del body.
- **Radios**: tarjetas `rounded-2xl` (16 px), modales `rounded-[28px]`.
- **Tipografía base**: `text-[#f0eeff]` para texto principal.

## AppContext (`src/store/AppContext.jsx`)

Único store de la app. Persiste en `localStorage` bajo la clave `fitflow_state`.

**Guardia de versión**: `DATA_VERSION = 3`. Si no coincide con localStorage, se resetea a `defaultState`.

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

// Historial semanal
weekHistory     // { fecha: 'YYYY-MM-DD', duracionMin, calorias }[]

// Actualización genérica (shallow merge)
updateState(partial)
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

### `BodyMap`
Tarjeta con efecto flip (perspectiva 3D CSS). **Cara frontal**: dos SVGs del cuerpo humano (frente y espalda) coloreados según `muscleScores`. **Cara trasera**: barras de progreso por músculo con animación al entrar. Botón ↻ en cada cara para voltear. Leyenda de colores debajo.

### `WeekStats`
Filtra `weekHistory` a la semana actual (lunes–domingo). Muestra 3 tarjetas (días entrenados, horas, kcal) y una tira de 7 círculos diarios con 🔥 en los días entrenados.

### `AIMessage`
Lee `muscleScores`, encuentra el músculo con menor score > 0 y muestra un mensaje motivacional. Si todos son 0, muestra mensaje genérico.

### `BottomNav`
Nav fija `bottom-0`, centrada y limitada a 480 px. Tres tabs: Inicio, Ejercicios, Perfil. Usa `NavLink` de React Router para el estado activo.

### `Exercises` (controlador)
Estado local `view` (`'list' | 'workout' | 'editor'`) y `planId`. Renderiza una de las tres vistas sin React Router adicional.

### `PlanList`
Lista de planes guardados. Cada card muestra nombre, nº de ejercicios y duración estimada. Botón ✏️ abre el editor; tap en la card abre el modo entrenamiento. Estado vacío con CTA de crear.

### `WorkoutMode`
Cronómetro automático. Por cada ejercicio: N círculos (uno por serie) que se marcan con ✓ y `animate-check-pop`. Al completar todos los ejercicios aparece un modal de celebración (🏆) con tiempo y kcal. "Guardar sesión" escribe en `weekHistory`.

### `PlanEditor`
Flujo de **2 pasos** con animación slide horizontal (`translate-x` + `transition-transform`):
- **Paso 1** — nombre del plan + catálogo filtrable por texto, agrupado por músculo; toggle de ejercicios (check verde si seleccionado). Botón "Siguiente →" con contador.
- **Paso 2** — lista de ejercicios seleccionados con controles -/+  de series y reps; tiempo estimado en tiempo real. Botón "Guardar Plan".
- Botón fijo inferior único (cambia contenido según el paso para evitar solapamientos).
- ✕ en paso 2 elimina el ejercicio y vuelve al paso 1.

## Convenciones de código

- **Solo Tailwind**, sin archivos `.css` por componente. El único CSS global está en `global.css`.
- **Sin comentarios** salvo que el motivo no sea obvio (workaround, invariante oculto).
- **Sin tipos TypeScript**; el proyecto es JS puro.
- **Clases dinámicas**: siempre strings completos en ternarios — nunca interpolación parcial (`border-${color}`), porque Tailwind JIT no lo detecta.
- **Imports**: rutas relativas, sin alias.
- **Estado**: todo en AppContext. Los componentes de página usan estado local solo para UI efímera (pasos, animaciones, buscador).
- Incrementar `DATA_VERSION` en AppContext cada vez que cambie la forma de `defaultState` — esto resetea localStorage de todos los usuarios.
- Antes de añadir `eslint-disable`, intentar refactorizar. Los únicos disable aceptados son `react-refresh/only-export-components` en AppContext (patrón context+hook en mismo archivo).

## PWA

`vite-plugin-pwa` con Workbox. Configuración en `vite.config.js`. Service worker con `registerType: 'autoUpdate'`. Google Fonts cacheadas con `CacheFirst`.
