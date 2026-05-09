import { useState, useEffect } from 'react'
import Body from 'react-muscle-highlighter'
import { useApp } from '../store/AppContext'
import './BodyMap.css'

const BODY_SCALE  = 0.9
const CARD_HEIGHT = 420  // 400*0.9 bodies + 60px padding headroom

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

export default function BodyMap() {
  const { muscleScores } = useApp()
  const [isFlipped, setIsFlipped]       = useState(false)
  const [animateBars, setAnimateBars]   = useState(false)

  useEffect(() => {
    if (isFlipped) {
      const t = setTimeout(() => setAnimateBars(true), 100)
      return () => clearTimeout(t)
    }
    setAnimateBars(false)
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

  const toggle = () => setIsFlipped(v => !v)
  const btnToggle = e => { e.stopPropagation(); toggle() }

  return (
    <div className="bodymap-wrap">
      {/* ── Flip card ── */}
      <div
        className="card-scene"
        style={{ height: CARD_HEIGHT }}
        onClick={toggle}
      >
        <div className={`card-body${isFlipped ? ' is-flipped' : ''}`}>

          {/* ── FRONT: both bodies ── */}
          <div className="card-face card-face--front">
            <div className="front-bodies">
              <Body
                data={bodyData}
                side="front"
                gender="male"
                scale={BODY_SCALE}
                defaultFill="#1e1e2e"
                border="#2a2a40"
              />
              <Body
                data={bodyData}
                side="back"
                gender="male"
                scale={BODY_SCALE}
                defaultFill="#1e1e2e"
                border="#2a2a40"
              />
            </div>
            <button className="flip-btn" onClick={btnToggle} aria-label="Ver progreso muscular">↻</button>
          </div>

          {/* ── BACK: muscle progress ── */}
          <div className="card-face card-face--back">
            <h3 className="back-title">Progreso muscular</h3>

            <div className="muscle-bars-list">
              {muscles.map(m => (
                <div key={m.key} className="mb-row">
                  <span className="mb-dot" style={{ background: m.color }} />
                  <span className="mb-name">{m.label}</span>
                  <div className="mb-track">
                    <div
                      className="bar-fill"
                      style={{
                        width:      animateBars ? `${m.score}%` : '0%',
                        background: m.color,
                      }}
                    />
                  </div>
                  <span className="mb-pct" style={{ color: m.color }}>
                    {m.score}%
                  </span>
                </div>
              ))}
            </div>

            <button className="flip-btn" onClick={btnToggle} aria-label="Ver cuerpo">↻</button>
          </div>

        </div>
      </div>

      {/* ── Legend (outside the flip) ── */}
      <div className="bodymap-legend">
        <span className="bm-legend-item">
          <span className="bm-dot" style={{ background: '#22d3a0' }} />
          Verde = Bien (≥60%)
        </span>
        <span className="bm-legend-item">
          <span className="bm-dot" style={{ background: '#f59e0b' }} />
          Amarillo = Poco (≥35%)
        </span>
        <span className="bm-legend-item">
          <span className="bm-dot" style={{ background: '#ef4444' }} />
          Rojo = Sin trabajo
        </span>
      </div>
    </div>
  )
}
