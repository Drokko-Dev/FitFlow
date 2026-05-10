import { useState } from 'react'
import { exercises } from '../../data/exercises'
import { useApp } from '../../store/AppContext'

const MUSCLE_ORDER  = ['brazos', 'pecho', 'espalda', 'hombros', 'pierna', 'core']
const MUSCLE_LABELS = {
  brazos: 'Brazos', pecho: 'Pecho', espalda: 'Espalda',
  hombros: 'Hombros', pierna: 'Pierna', core: 'Core',
}

function Counter({ value, onDec, onInc }) {
  return (
    <div className="flex items-center gap-[6px]">
      <button
        onClick={onDec}
        className="w-7 h-7 rounded-full bg-white/[0.07] text-[#f0eeff] text-[18px] flex items-center justify-center active:scale-90 transition-transform"
      >
        −
      </button>
      <span className="w-6 text-center font-display font-bold text-[#f0eeff] text-[14px]">
        {value}
      </span>
      <button
        onClick={onInc}
        className="w-7 h-7 rounded-full bg-white/[0.07] text-[#f0eeff] text-[18px] flex items-center justify-center active:scale-90 transition-transform"
      >
        +
      </button>
    </div>
  )
}

export default function PlanEditor({ planId, onClose }) {
  const { plans, addPlan, updatePlan } = useApp()
  const existing = planId ? plans.find(p => p.id === planId) : null

  const [step, setStep]            = useState(1)
  const [name, setName]            = useState(existing?.name ?? '')
  const [search, setSearch]        = useState('')
  const [planExercises, setPlanEx] = useState(existing?.exercises ?? [])

  const selectedIds = new Set(planExercises.map(ex => ex.id))

  const filtered = search.trim()
    ? exercises.filter(ex => ex.name.toLowerCase().includes(search.toLowerCase()))
    : exercises

  const grouped = MUSCLE_ORDER
    .map(muscle => ({ muscle, items: filtered.filter(ex => ex.muscle === muscle) }))
    .filter(g => g.items.length > 0)

  const totalMin = planExercises.reduce(
    (acc, ex) => acc + ex.sets * ex.reps * ex.secPerRep, 0
  ) / 60

  const canAdvance = name.trim().length > 0 && planExercises.length > 0

  function toggleExercise(ex) {
    if (selectedIds.has(ex.id)) {
      setPlanEx(prev => prev.filter(e => e.id !== ex.id))
    } else {
      setPlanEx(prev => [...prev, { ...ex, sets: 3, reps: 10 }])
    }
  }

  function removeExercise(id) {
    setPlanEx(prev => prev.filter(ex => ex.id !== id))
    setStep(1)
  }

  function changeSets(id, delta) {
    setPlanEx(prev =>
      prev.map(ex => ex.id === id ? { ...ex, sets: Math.max(1, ex.sets + delta) } : ex)
    )
  }

  function changeReps(id, delta) {
    setPlanEx(prev =>
      prev.map(ex => ex.id === id ? { ...ex, reps: Math.max(1, ex.reps + delta) } : ex)
    )
  }

  function savePlan() {
    if (!name.trim() || planExercises.length === 0) return
    const plan = {
      id:        existing?.id ?? Date.now().toString(),
      name:      name.trim(),
      exercises: planExercises,
    }
    if (existing) updatePlan(existing.id, plan)
    else          addPlan(plan)
    onClose()
  }

  const panel = 'absolute inset-0 overflow-y-auto no-scrollbar pb-[148px] transition-transform duration-[320ms] ease-in-out'

  return (
    <div className="h-full bg-bg relative overflow-hidden">

      {/* ── PASO 1: Elige ejercicios ── */}
      <div className={`${panel} ${step === 1 ? 'translate-x-0' : '-translate-x-full'}`}>

        <header className="px-5 pt-[52px] pb-5 flex items-center justify-between">
          <h1 className="font-display text-[22px] font-bold text-[#f0eeff]">
            {existing ? 'Editar Plan' : 'Nuevo Plan'}
          </h1>
          <button
            onClick={onClose}
            className="text-muted text-[14px] font-medium active:opacity-60 transition-opacity"
          >
            Cancelar
          </button>
        </header>

        <div className="px-5 mb-7">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nombre del plan..."
            className="w-full bg-card border border-border rounded-2xl px-5 py-4 font-display text-[20px] font-bold text-[#f0eeff] placeholder:text-muted/40 outline-none focus:border-accent transition-colors"
          />
        </div>

        <section className="px-5">
          <h2 className="font-display text-[11px] font-semibold text-muted uppercase tracking-[0.1em] mb-3">
            Elige ejercicios
          </h2>

          <div className="relative mb-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-[15px] pointer-events-none">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar ejercicio..."
              className="w-full bg-card border border-border rounded-2xl pl-10 pr-4 py-3 text-[14px] text-[#f0eeff] placeholder:text-muted/40 outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="flex flex-col gap-5">
            {grouped.map(({ muscle, items }) => (
              <div key={muscle}>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted/60 mb-2 px-1">
                  {MUSCLE_LABELS[muscle]}
                </h3>
                <div className="flex flex-col gap-[6px]">
                  {items.map(ex => {
                    const selected = selectedIds.has(ex.id)
                    return (
                      <button
                        key={ex.id}
                        onClick={() => toggleExercise(ex)}
                        className={`flex items-center justify-between rounded-2xl px-4 py-[11px] border transition-all w-full text-left ${
                          selected
                            ? 'bg-green/[0.07] border-green/35'
                            : 'bg-card border-border active:border-accent/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[18px] leading-none">{ex.icon}</span>
                          <span className="text-[14px] font-medium text-[#f0eeff]">{ex.name}</span>
                        </div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[16px] font-bold shrink-0 transition-all ${
                          selected
                            ? 'bg-green/20 text-green'
                            : 'bg-accent/15 text-accent'
                        }`}>
                          {selected ? '✓' : '+'}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── PASO 2: Configura tu plan ── */}
      <div className={`${panel} ${step === 1 ? 'translate-x-full' : 'translate-x-0'}`}>

        <header className="px-5 pt-[52px] pb-5 flex items-center justify-between">
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-1 text-accent text-[14px] font-semibold active:opacity-60 transition-opacity"
          >
            ← Volver
          </button>
          <button
            onClick={onClose}
            className="text-muted text-[14px] font-medium active:opacity-60 transition-opacity"
          >
            Cancelar
          </button>
        </header>

        <div className="px-5 mb-5">
          <h1 className="font-display text-[26px] font-extrabold text-[#f0eeff] leading-tight">
            {name || 'Mi Plan'}
          </h1>
          {planExercises.length > 0 && (
            <p className="text-[13px] text-accent font-semibold mt-1">
              ~{Math.round(totalMin)} min estimados
              <span className="text-muted font-normal"> · {planExercises.length} ejercicio{planExercises.length !== 1 ? 's' : ''}</span>
            </p>
          )}
        </div>

        <section className="px-5">
          <div className="flex flex-col gap-3">
            {planExercises.map(ex => (
              <div key={ex.id} className="bg-card border border-border rounded-2xl px-4 py-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[18px] leading-none shrink-0">{ex.icon}</span>
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-[#f0eeff] truncate">{ex.name}</p>
                      <p className="text-[11px] text-muted capitalize">{ex.muscle}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeExercise(ex.id)}
                    className="w-7 h-7 rounded-full bg-white/[0.05] text-muted flex items-center justify-center shrink-0 ml-2 active:scale-90 transition-transform"
                    aria-label={`Eliminar ${ex.name}`}
                  >
                    ✕
                  </button>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[11px] text-muted w-12 shrink-0">Series</span>
                  <Counter
                    value={ex.sets}
                    onDec={() => changeSets(ex.id, -1)}
                    onInc={() => changeSets(ex.id, +1)}
                  />
                  <span className="text-muted text-[13px] px-1">×</span>
                  <span className="text-[11px] text-muted shrink-0">Reps</span>
                  <Counter
                    value={ex.reps}
                    onDec={() => changeReps(ex.id, -1)}
                    onInc={() => changeReps(ex.id, +1)}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Botón fijo inferior (único, cambia contenido con el paso) ── */}
      <div className="fixed bottom-[68px] left-1/2 -translate-x-1/2 w-full max-w-[480px] px-5 pb-3 pt-3 bg-gradient-to-t from-bg via-bg/90 to-transparent pointer-events-none">
        <div className="pointer-events-auto">
          {step === 1 ? (
            <button
              onClick={() => setStep(2)}
              disabled={!canAdvance}
              className="w-full bg-accent disabled:opacity-35 disabled:cursor-not-allowed text-white font-display font-bold text-[16px] py-[14px] rounded-2xl active:scale-[0.98] transition-transform flex items-center justify-center gap-[6px]"
            >
              <span>Siguiente</span>
              <span>→</span>
              {planExercises.length > 0 && (
                <span className="font-body font-normal text-[14px] text-white/65 ml-[2px]">
                  ({planExercises.length} {planExercises.length === 1 ? 'ejercicio' : 'ejercicios'})
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={savePlan}
              className="w-full bg-accent text-white font-display font-bold text-[16px] py-[14px] rounded-2xl active:scale-[0.98] transition-transform"
            >
              Guardar Plan
            </button>
          )}
        </div>
      </div>

    </div>
  )
}
