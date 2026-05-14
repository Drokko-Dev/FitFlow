import { useState, useEffect } from 'react'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { exercises } from '../../data/exercises'
import { useApp } from '../../store/AppContext'

function planDuration(plan) {
  const secs = plan.exercises.reduce((acc, ex) => {
    const cat = exercises.find(e => e.id === ex.id)
    if (!cat) return acc
    return acc + (ex.sets * ex.reps * cat.secPerRep) + ((ex.sets - 1) * cat.restSec)
  }, 0)
  return Math.round(secs / 60)
}

export default function PlanList({ onWorkout, onEdit, onCreate }) {
  const { plans, deletePlan } = useApp()
  const [openMenuId, setOpenMenuId]     = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  // Cierra el menú al hacer click en cualquier otro lugar
  useEffect(() => {
    if (openMenuId === null) return
    function close() { setOpenMenuId(null) }
    // setTimeout 0 para que este listener no capture el mismo click que abrió el menú
    const tid = setTimeout(() => window.addEventListener('click', close), 0)
    return () => {
      clearTimeout(tid)
      window.removeEventListener('click', close)
    }
  }, [openMenuId])

  function confirmDelete() {
    deletePlan(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-20">
      <header className="px-5 pt-[52px] pb-5 flex items-center justify-between bg-gradient-to-b from-accent/[0.09] to-transparent">
        <h1 className="font-display text-[28px] font-bold tracking-normal text-[#f0eeff]">
          Mis Planes
        </h1>
        <button
          onClick={onCreate}
          className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white text-[22px] leading-none active:scale-90 transition-transform"
          aria-label="Crear nuevo plan"
        >
          +
        </button>
      </header>

      {plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-5 pt-20 gap-5">
          <div className="text-[64px] leading-none">🏋️</div>
          <p className="text-center text-muted text-[15px] leading-relaxed">
            No tienes planes aún,<br />crea tu primero 💪
          </p>
          <button
            onClick={onCreate}
            className="bg-accent text-white font-display font-semibold text-[15px] px-8 py-[13px] rounded-2xl active:scale-95 transition-transform"
          >
            Crear plan
          </button>
        </div>
      ) : (
        <div className="px-5 flex flex-col gap-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => onWorkout(plan.id)}
              onKeyDown={(e) => e.key === 'Enter' && onWorkout(plan.id)}
              role="button"
              tabIndex={0}
              className="bg-card border border-border rounded-2xl p-4 text-left w-full cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="font-display text-[18px] font-bold text-[#f0eeff] truncate">
                    {plan.name}
                  </h2>
                  <p className="text-[12px] text-muted mt-[2px]">
                    {plan.exercises.length} ejercicio{plan.exercises.length !== 1 ? 's' : ''} · ~{planDuration(plan)} min
                  </p>
                </div>

                {/* Botón 3 puntos + dropdown */}
                <div className="relative shrink-0 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpenMenuId(prev => prev === plan.id ? null : plan.id)
                    }}
                    className="w-9 h-9 rounded-full bg-white/[0.05] border border-border flex items-center justify-center active:scale-90 transition-transform"
                    aria-label={`Opciones de ${plan.name}`}
                  >
                    <MoreVertical size={16} className="text-muted" />
                  </button>

                  {openMenuId === plan.id && (
                    <div className="absolute right-0 top-[calc(100%+6px)] z-50 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl shadow-lg min-w-[150px] overflow-hidden animate-fade-in">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenMenuId(null)
                          onEdit(plan.id)
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-[#f0eeff] w-full text-left active:bg-white/[0.07] transition-colors"
                      >
                        <Pencil size={14} className="text-muted shrink-0" />
                        Editar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenMenuId(null)
                          setDeleteTarget(plan)
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 w-full text-left border-t border-[var(--color-border)] active:bg-white/[0.07] transition-colors"
                      >
                        <Trash2 size={14} className="shrink-0" />
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {plan.exercises.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-[6px]">
                  {plan.exercises.slice(0, 3).map((ex) => (
                    <span
                      key={ex.id}
                      className="inline-flex items-center gap-1 text-[11px] bg-white/[0.05] text-muted px-[10px] py-[3px] rounded-full"
                    >
                      {ex.icon} {ex.name}
                    </span>
                  ))}
                  {plan.exercises.length > 3 && (
                    <span className="text-[11px] bg-white/[0.05] text-muted px-[10px] py-[3px] rounded-full">
                      +{plan.exercises.length - 3} más
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal confirmación eliminar */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="max-w-sm w-full bg-card rounded-[28px] border border-border p-6 flex flex-col gap-4 animate-slide-up">
            <div>
              <h2 className="font-display text-[18px] font-bold text-[#f0eeff]">
                ¿Eliminar {deleteTarget.name}?
              </h2>
              <p className="text-[13px] text-muted mt-1">Esta acción no se puede deshacer</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-[13px] rounded-2xl bg-white/[0.06] border border-border text-[#f0eeff] font-semibold text-[14px] active:opacity-70 transition-opacity"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-[13px] rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 font-bold text-[14px] active:opacity-70 transition-opacity"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
