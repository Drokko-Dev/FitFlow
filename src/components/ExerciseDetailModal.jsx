import { X } from 'lucide-react'

const MUSCLE_LABELS = {
  brazos: 'Brazos', pecho: 'Pecho', espalda: 'Espalda',
  hombros: 'Hombros', pierna: 'Pierna', core: 'Core',
}
const CATEGORY_LABELS = {
  fuerza: 'Fuerza', aislamiento: 'Aislamiento',
  'peso corporal': 'Peso corporal', máquina: 'Máquina',
}
const MUSCLE_GRADIENT = {
  pecho:    'from-blue-500/20',
  espalda:  'from-orange-500/20',
  brazos:   'from-purple-500/20',
  hombros:  'from-green-500/20',
  pierna:   'from-red-500/20',
  core:     'from-yellow-500/20',
}

export default function ExerciseDetailModal({ exercise, onClose }) {
  const gradient = MUSCLE_GRADIENT[exercise.muscle] ?? 'from-accent/20'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-[var(--color-card)] rounded-[28px] border border-border shadow-xl max-h-[80vh] flex flex-col animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <div className="flex gap-[6px] flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider px-[10px] py-1 rounded-full bg-accent/15 text-accent">
              {MUSCLE_LABELS[exercise.muscle] ?? exercise.muscle}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-[10px] py-1 rounded-full bg-white/[0.07] text-muted">
              {CATEGORY_LABELS[exercise.category] ?? exercise.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.07] text-muted flex items-center justify-center active:scale-90 transition-transform shrink-0 ml-2"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto no-scrollbar px-5 pb-7 flex flex-col gap-4">

          {/* Emoji con gradiente por músculo */}
          <div className={`rounded-2xl bg-gradient-to-br ${gradient} to-transparent flex items-center justify-center h-40`}>
            <span style={{ fontSize: '5rem' }} className="leading-none select-none">
              {exercise.icon}
            </span>
          </div>

          {/* Name */}
          <h2 className="font-display text-[22px] font-extrabold text-[#f0eeff] leading-tight">
            {exercise.name}
          </h2>

          {/* Description */}
          <p className="text-[14px] text-muted leading-relaxed -mt-1">
            {exercise.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[var(--color-bg)] rounded-2xl px-4 py-[14px]">
              <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Descanso</p>
              <p className="font-display text-[22px] font-bold text-[#f0eeff] leading-none">
                {exercise.restSec}
                <span className="text-[12px] text-muted font-normal ml-1">s</span>
              </p>
            </div>
            <div className="bg-[var(--color-bg)] rounded-2xl px-4 py-[14px]">
              <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Seg / rep</p>
              <p className="font-display text-[22px] font-bold text-[#f0eeff] leading-none">
                {exercise.secPerRep}
                <span className="text-[12px] text-muted font-normal ml-1">s</span>
              </p>
            </div>
          </div>

          {exercise.variation && (
            <p className="text-[12px] text-muted">
              Variación de:{' '}
              <span className="text-accent font-medium">{exercise.variation}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
