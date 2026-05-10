import { useApp } from "../../store/AppContext";

function planDuration(plan) {
  const secs = plan.exercises.reduce(
    (acc, ex) => acc + ex.sets * ex.reps * ex.secPerRep,
    0,
  );
  return Math.round(secs / 60);
}

export default function PlanList({ onWorkout, onEdit, onCreate }) {
  const { plans } = useApp();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-20">
      <header className="px-5 pt-[52px] pb-5 flex items-center justify-between bg-gradient-to-b from-accent/[0.09] to-transparent">
        <h1 className="font-display text-[28px] font-extrabold text-[#f0eeff]">
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
            No tienes planes aún,
            <br />
            crea tu primero 💪
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
                    {plan.exercises.length} ejercicio
                    {plan.exercises.length !== 1 ? "s" : ""} · ~
                    {planDuration(plan)} min
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(plan.id) }}
                  className="w-9 h-9 rounded-full bg-white/[0.05] border border-border flex items-center justify-center shrink-0 active:scale-90 transition-transform"
                  aria-label={`Editar ${plan.name}`}
                >
                  ✏️
                </button>
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
    </div>
  );
}
