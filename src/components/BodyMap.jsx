import { useState, useEffect } from 'react'
import Body from 'react-muscle-highlighter'
import { useApp } from '../store/AppContext'

const BODY_SCALE  = 0.9
const CARD_HEIGHT = 420

function getColor(score) {
  if (score >= 60) return '#22d3a0'
  if (score >= 35) return '#f59e0b'
  if (score > 0)   return '#ef4444'
  return '#2a2a3e'
}

const BODY_DATA_BASE = [
  { slug: 'chest',      key: 'pecho' },
  { slug: 'biceps',     key: 'brazos' },
  { slug: 'triceps',    key: 'brazos' },
  { slug: 'forearm',    key: 'brazos' },
  { slug: 'abs',        key: 'core' },
  { slug: 'obliques',   key: 'core' },
  { slug: 'quadriceps', key: 'pierna' },
  { slug: 'adductors',  key: 'pierna' },
  { slug: 'calves',     key: 'pierna' },
  { slug: 'deltoids',   key: 'hombros' },
  { slug: 'upper-back', key: 'espalda' },
  { slug: 'lower-back', key: 'espalda' },
  { slug: 'trapezius',  key: 'hombros' },
  { slug: 'hamstring',  key: 'pierna' },
  { slug: 'gluteal',    key: 'pierna' },
]

const MUSCLE_LIST = [
  { key: 'pecho',   label: 'Pecho' },
  { key: 'espalda', label: 'Espalda' },
  { key: 'brazos',  label: 'Brazos' },
  { key: 'hombros', label: 'Hombros' },
  { key: 'pierna',  label: 'Pierna' },
  { key: 'core',    label: 'Core/Abs' },
]

const LEGEND = [
  { color: '#22d3a0', label: 'Verde = Bien (≥60%)' },
  { color: '#f59e0b', label: 'Amarillo = Poco (≥35%)' },
  { color: '#ef4444', label: 'Rojo = Sin trabajo' },
]

export default function BodyMap() {
  const { muscleScores } = useApp()
  const [isFlipped, setIsFlipped]     = useState(false)
  const [animateBars, setAnimateBars] = useState(false)

  useEffect(() => {
    if (isFlipped) {
      const t = setTimeout(() => setAnimateBars(true), 100)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setAnimateBars(false), 0)
    return () => clearTimeout(t)
  }, [isFlipped])

  const bodyData = BODY_DATA_BASE.map(({ slug, key }) => ({
    slug,
    color: getColor(muscleScores[key] ?? 0),
  }))

  const muscles = MUSCLE_LIST.map(m => ({
    ...m,
    score: muscleScores[m.key] ?? 0,
    color: getColor(muscleScores[m.key] ?? 0),
  }))

  const toggle    = () => setIsFlipped(v => !v)
  const btnToggle = e => { e.stopPropagation(); toggle() }

  return (
    <div className="flex flex-col gap-3">
      {/* Flip card scene */}
      <div
        className="[perspective:1200px] cursor-pointer"
        style={{ height: CARD_HEIGHT }}
        onClick={toggle}
      >
        <div
          className={`w-full h-full relative [transform-style:preserve-3d] transition-[transform] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
        >
          {/* FRONT face */}
          <div className="absolute inset-0 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] rounded-[20px] bg-card border border-border overflow-hidden flex items-center justify-center">
            <div className="flex gap-2 items-center justify-center">
              <Body data={bodyData} side="front" gender="male" scale={BODY_SCALE} defaultFill="#1e1e2e" border="#2a2a40" />
              <Body data={bodyData} side="back"  gender="male" scale={BODY_SCALE} defaultFill="#1e1e2e" border="#2a2a40" />
            </div>
            <button
              className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-accent/15 border border-accent/40 text-accent text-lg flex items-center justify-center transition-[background,transform] hover:bg-accent/30 active:scale-[0.88] select-none"
              onClick={btnToggle}
              aria-label="Ver progreso muscular"
            >
              ↻
            </button>
          </div>

          {/* BACK face */}
          <div className="absolute inset-0 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[20px] bg-card border border-border overflow-hidden px-5 py-6 flex flex-col justify-center">
            <h3 className="font-display text-lg font-bold text-[#f0eeff] mb-[22px]">Progreso muscular</h3>

            <div className="flex flex-col gap-[14px] pb-[52px]">
              {muscles.map(m => (
                <div key={m.key} className="flex items-center gap-[10px]">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: m.color }} />
                  <span className="w-16 text-[13px] text-[#8b87a8] shrink-0">{m.label}</span>
                  <div className="flex-1 h-[6px] bg-white/[0.07] rounded-[3px] overflow-hidden">
                    <div
                      className="h-[6px] rounded-[3px] transition-[width] duration-[800ms] ease-in"
                      style={{
                        width:      animateBars ? `${m.score}%` : '0%',
                        background: m.color,
                      }}
                    />
                  </div>
                  <span
                    className="w-8 text-right text-[12px] font-semibold font-display shrink-0"
                    style={{ color: m.color }}
                  >
                    {m.score}%
                  </span>
                </div>
              ))}
            </div>

            <button
              className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-accent/15 border border-accent/40 text-accent text-lg flex items-center justify-center transition-[background,transform] hover:bg-accent/30 active:scale-[0.88] select-none"
              onClick={btnToggle}
              aria-label="Ver cuerpo"
            >
              ↻
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center flex-wrap gap-3">
        {LEGEND.map(({ color, label }) => (
          <span key={label} className="flex items-center gap-[5px] text-[11px] text-[#8b87a8]">
            <span className="w-[7px] h-[7px] rounded-full shrink-0" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
