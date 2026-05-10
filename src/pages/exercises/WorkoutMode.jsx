import { useState, useEffect } from 'react'
import { useApp } from '../../store/AppContext'

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function todayStr() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function WorkoutMode({ planId, onClose }) {
  const { plans, weekHistory, updateState } = useApp()
  const plan = plans.find(p => p.id === planId)

  const [elapsed, setElapsed]     = useState(0)
  const [animating, setAnimating] = useState(null)
  const [showComplete, setShowComplete] = useState(false)
  const [checked, setChecked] = useState(() => {
    if (!plan) return {}
    const init = {}
    plan.exercises.forEach((ex, i) => { init[i] = Array(ex.sets).fill(false) })
    return init
  })

  useEffect(() => {
    if (showComplete) return
    const id = setInterval(() => setElapsed(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [showComplete])

  function toggleSet(exIdx, setIdx) {
    const wasUnchecked = !(checked[exIdx]?.[setIdx])
    if (wasUnchecked) {
      setAnimating({ exIdx, setIdx })
      setTimeout(() => setAnimating(null), 320)
    }
    setChecked(prev => {
      const arr = [...(prev[exIdx] || [])]
      arr[setIdx] = !arr[setIdx]
      const next = { ...prev, [exIdx]: arr }
      if (plan.exercises.length > 0) {
        const allDone = plan.exercises.every((ex, i) =>
          (next[i] || []).filter(Boolean).length === ex.sets
        )
        if (allDone) setTimeout(() => setShowComplete(true), 500)
      }
      return next
    })
  }

  function saveSession() {
    updateState({
      weekHistory: [
        ...weekHistory,
        {
          fecha: todayStr(),
          duracionMin: Math.max(1, Math.round(elapsed / 60)),
          calorias: totalCalories,
        },
      ],
    })
    onClose()
  }

  if (!plan) return (
    <div className="min-h-full bg-bg px-5 pt-[52px] text-muted">Plan no encontrado.</div>
  )

  const totalCalories = Math.round(
    plan.exercises.reduce((acc, ex) => acc + ex.sets * ex.reps * ex.calPerRep, 0)
  )

  return (
    <div className="min-h-full bg-bg pb-10">
      <header className="sticky top-0 z-10 bg-bg border-b border-border/40 px-5 pt-[52px] pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-[20px] font-bold text-[#f0eeff]">{plan.name}</h1>
          <p className="font-mono text-[15px] font-bold text-accent mt-0.5">{formatTime(elapsed)}</p>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/[0.06] border border-border text-muted text-[18px] flex items-center justify-center active:scale-90 transition-transform"
          aria-label="Salir del entrenamiento"
        >
          ✕
        </button>
      </header>

      <div className="px-5 pt-5 flex flex-col gap-4">
        {plan.exercises.map((ex, exIdx) => {
          const exChecked = checked[exIdx] || []
          const isComplete = exChecked.length === ex.sets && exChecked.every(Boolean)
          return (
            <div
              key={exIdx}
              className={`bg-card rounded-2xl border p-4 transition-all duration-500 ${
                isComplete ? 'border-green/50' : 'border-border'
              }`}
            >
              <div className={`transition-opacity duration-500 ${isComplete ? 'opacity-60' : 'opacity-100'}`}>
                <div className="flex items-center gap-2 mb-[2px]">
                  <span className="text-[20px] leading-none">{ex.icon}</span>
                  <h3 className="font-display text-[16px] font-bold text-[#f0eeff] flex-1">{ex.name}</h3>
                  {isComplete && (
                    <span className="text-green text-[12px] font-semibold">✓ Listo</span>
                  )}
                </div>
                <p className="text-muted text-[12px] capitalize ml-8 mb-3">
                  {ex.muscle} · {ex.sets} × {ex.reps} reps
                </p>
              </div>

              <div className="flex flex-wrap gap-[10px]">
                {exChecked.map((done, setIdx) => {
                  const isAnimating =
                    animating?.exIdx === exIdx && animating?.setIdx === setIdx
                  return (
                    <button
                      key={setIdx}
                      onClick={() => toggleSet(exIdx, setIdx)}
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-[18px] font-bold transition-colors duration-200 ${
                        isAnimating ? 'animate-check-pop' : ''
                      } ${
                        done
                          ? 'bg-accent border-accent text-white'
                          : 'border-accent bg-transparent text-transparent'
                      }`}
                      aria-label={`Serie ${setIdx + 1}`}
                    >
                      {done ? '✓' : ''}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {showComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-5 animate-fade-in">
          <div className="w-full max-w-[360px] bg-card rounded-[28px] border border-border p-8 flex flex-col items-center gap-5 animate-slide-up">
            <div className="text-[72px] leading-none">🏆</div>
            <div className="text-center">
              <h2 className="font-display text-[22px] font-extrabold text-[#f0eeff] mb-1">
                ¡Entrenamiento completo!
              </h2>
              <p className="text-muted text-[13px]">¡Buen trabajo, sigue así!</p>
            </div>

            <div className="flex gap-10">
              <div className="text-center">
                <p className="font-display text-[28px] font-bold text-accent leading-none">
                  {formatTime(elapsed)}
                </p>
                <p className="text-[11px] text-muted uppercase tracking-wider mt-1">Tiempo</p>
              </div>
              <div className="text-center">
                <p className="font-display text-[28px] font-bold text-accent leading-none">
                  {totalCalories}
                </p>
                <p className="text-[11px] text-muted uppercase tracking-wider mt-1">kcal</p>
              </div>
            </div>

            <button
              onClick={saveSession}
              className="w-full bg-accent text-white font-display font-bold text-[16px] py-[14px] rounded-2xl active:scale-[0.98] transition-transform"
            >
              Guardar sesión
            </button>
            <button
              onClick={onClose}
              className="text-muted text-[13px] py-1 active:opacity-60"
            >
              Cerrar sin guardar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
