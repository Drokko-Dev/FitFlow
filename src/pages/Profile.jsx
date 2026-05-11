import { useState } from 'react'
import { Trophy, Zap, Star, Plus, X } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { useApp } from '../store/AppContext'
import { exercises } from '../data/exercises'

const EMOJIS = ['🏋️','💪','🦅','🔥','⚡','🥊','🏃','🧗','🤸','🐉','🦁','🎯']
const GENDER_OPTIONS = ['Masculino', 'Femenino']

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function calcStreak(weekHistory) {
  if (!weekHistory.length) return 0
  const trained = new Set(weekHistory.map(s => s.fecha))
  let streak = 0
  const d = new Date()
  while (trained.has(toDateKey(d))) {
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

function calcBMI(peso, estatura) {
  if (!peso || !estatura) return null
  const bmi = peso / Math.pow(estatura / 100, 2)
  return isFinite(bmi) && bmi > 0 ? bmi : null
}

function bmiInfo(bmi) {
  if (bmi < 18.5) return { label: 'Bajo peso',  color: '#60a5fa' }
  if (bmi < 25)   return { label: 'Normal',      color: '#22d3a0' }
  if (bmi < 30)   return { label: 'Sobrepeso',   color: '#f59e0b' }
  return                  { label: 'Obesidad',    color: '#ef4444' }
}

function BMIBar({ bmi }) {
  const pos = Math.max(0, Math.min(100, (bmi - 15) / 25 * 100))
  const info = bmiInfo(bmi)

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-4">
        <span className="font-display text-[44px] font-bold text-[#f0eeff] leading-none">
          {bmi.toFixed(1)}
        </span>
        <span className="text-[15px] font-semibold" style={{ color: info.color }}>
          {info.label}
        </span>
      </div>
      <div className="relative">
        <div className="h-3 rounded-full flex overflow-hidden">
          <div className="h-full" style={{ width: '14%', backgroundColor: '#60a5fa' }} />
          <div className="h-full" style={{ width: '26%', backgroundColor: '#22d3a0' }} />
          <div className="h-full" style={{ width: '20%', backgroundColor: '#f59e0b' }} />
          <div className="h-full" style={{ width: '40%', backgroundColor: '#ef4444' }} />
        </div>
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow"
          style={{ left: `${pos}%`, backgroundColor: info.color }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted mt-2 px-[1px]">
        <span>15</span>
        <span>18.5</span>
        <span>25</span>
        <span>30</span>
        <span>40</span>
      </div>
    </div>
  )
}

function PRCard({ pr, accentColor, onAddEntry }) {
  const maxWeight = pr.history.length ? Math.max(...pr.history.map(h => h.weight)) : 0
  const chartData = pr.history.map(h => ({ w: h.weight }))

  return (
    <div className="bg-card rounded-2xl border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[15px] font-semibold text-[#f0eeff]">{pr.exerciseName}</span>
        <button
          onClick={() => onAddEntry(pr.id)}
          className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center active:scale-90 transition-transform"
        >
          <Plus size={14} color={accentColor} strokeWidth={2.5} />
        </button>
      </div>
      <div className="flex items-end gap-3">
        <div className="flex-none flex items-baseline gap-1">
          <span className="font-display text-[36px] font-bold text-[#f0eeff] leading-none">
            {maxWeight}
          </span>
          <span className="text-[13px] text-muted">kg</span>
        </div>
        {chartData.length > 1 && (
          <div className="flex-1 min-w-0">
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="w"
                  stroke={accentColor}
                  strokeWidth={2}
                  dot={{ r: 3, fill: accentColor, strokeWidth: 0 }}
                  activeDot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Profile() {
  const {
    userName, userEmoji, weekHistory, userStats, prs, accentColor,
    updateState, addPR, addPREntry,
  } = useApp()

  const [editingName,     setEditingName]     = useState(false)
  const [nameInput,       setNameInput]       = useState(userName)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const stats0 = userStats ?? { peso: null, estatura: null, edad: null, genero: 'Masculino' }
  const [pesoInput,     setPesoInput]     = useState(stats0.peso     != null ? String(stats0.peso)     : '')
  const [estaturaInput, setEstaturaInput] = useState(stats0.estatura != null ? String(stats0.estatura) : '')
  const [edadInput,     setEdadInput]     = useState(stats0.edad     != null ? String(stats0.edad)     : '')

  const [showAddPR,     setShowAddPR]     = useState(false)
  const [addEntryForPR, setAddEntryForPR] = useState(null)
  const [newPRSearch,   setNewPRSearch]   = useState('')
  const [newPRExercise, setNewPRExercise] = useState(null)
  const [newPRWeight,   setNewPRWeight]   = useState('')
  const [newPRDate,     setNewPRDate]     = useState(todayStr())
  const [entryWeight,   setEntryWeight]   = useState('')
  const [entryDate,     setEntryDate]     = useState(todayStr())

  const totalSessions = weekHistory.length
  const streak        = calcStreak(weekHistory)
  const currentAccent = accentColor ?? '#7c6aff'
  const bmi           = calcBMI(stats0.peso, stats0.estatura)

  const statCards = [
    { Icon: Trophy, color: '#f59e0b',     value: 12,           unit: 'sem', label: 'Activo'   },
    { Icon: Zap,    color: currentAccent, value: totalSessions, unit: '',    label: 'Sesiones' },
    { Icon: Star,   color: '#22d3a0',     value: streak,        unit: 'd',   label: 'Racha'    },
  ]

  function saveName() {
    if (nameInput.trim()) updateState({ userName: nameInput.trim() })
    setEditingName(false)
  }

  function pickEmoji(emoji) {
    updateState({ userEmoji: emoji })
    setShowEmojiPicker(false)
  }

  function saveStats(field, rawValue) {
    const value = field === 'genero' ? rawValue : (parseFloat(rawValue) || null)
    updateState({ userStats: { ...stats0, [field]: value } })
  }

  function handleSaveNewPR() {
    if (!newPRExercise || !newPRWeight) return
    addPR(newPRExercise, { date: newPRDate, weight: parseFloat(newPRWeight) })
    setShowAddPR(false)
    setNewPRExercise(null)
    setNewPRSearch('')
    setNewPRWeight('')
    setNewPRDate(todayStr())
  }

  function handleSaveEntry() {
    if (!entryWeight || addEntryForPR == null) return
    addPREntry(addEntryForPR, { date: entryDate, weight: parseFloat(entryWeight) })
    setAddEntryForPR(null)
    setEntryWeight('')
    setEntryDate(todayStr())
  }

  const filteredExercises = exercises.filter(e =>
    e.name.toLowerCase().includes(newPRSearch.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-bg pb-24">

      {/* Header */}
      <header className="px-5 pt-[52px] pb-8 flex flex-col items-center gap-3 bg-gradient-to-b from-accent/[0.1] to-transparent">
        <button
          onClick={() => setShowEmojiPicker(true)}
          className="w-[88px] h-[88px] rounded-full bg-gradient-to-br from-accent/50 to-accent2/30 flex items-center justify-center text-[48px] leading-none border-2 border-accent/40 active:scale-95 transition-transform"
        >
          {userEmoji}
        </button>
        <div className="flex flex-col items-center gap-1">
          {editingName ? (
            <input
              autoFocus
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onBlur={saveName}
              onKeyDown={e => {
                if (e.key === 'Enter')  saveName()
                if (e.key === 'Escape') setEditingName(false)
              }}
              className="bg-bg3 border border-border rounded-xl px-3 py-[6px] text-[20px] font-display font-bold text-[#f0eeff] outline-none focus:border-accent text-center transition-colors"
            />
          ) : (
            <button
              onClick={() => { setNameInput(userName); setEditingName(true) }}
              className="font-heading text-[24px] font-bold tracking-normal text-[#f0eeff] active:opacity-70 transition-opacity"
            >
              {userName} ›
            </button>
          )}
          <p className="text-[13px] text-muted">Miembro desde Mayo 2026</p>
        </div>
      </header>

      {/* Stat cards */}
      <div className="px-5 mt-1 flex gap-[10px]">
        {statCards.map(({ Icon, color, value, unit, label }) => (
          <div
            key={label}
            className="flex-1 bg-card rounded-2xl pt-[14px] pb-3 px-2 border border-border border-t-2 flex flex-col items-center gap-2"
            style={{ borderTopColor: color }}
          >
            <Icon size={26} color={color} strokeWidth={1.75} />
            <div className="font-display text-[22px] font-bold text-[#f0eeff] leading-none">
              {value}
              {unit && <span className="font-body text-[11px] font-normal text-muted ml-[2px]">{unit}</span>}
            </div>
            <div className="text-[10px] text-muted uppercase tracking-[0.07em]">{label}</div>
          </div>
        ))}
      </div>

      {/* Mis datos */}
      <section className="px-5 mt-6">
        <h2 className="font-display text-[11px] font-semibold text-muted uppercase tracking-[0.1em] mb-1">Mis datos</h2>
        <div className="bg-card rounded-2xl border border-border px-4">

          <div className="flex items-center justify-between py-[14px] border-b border-border/60">
            <span className="text-[15px] text-[#f0eeff]">Peso</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={pesoInput}
                onChange={e => setPesoInput(e.target.value)}
                onBlur={() => saveStats('peso', pesoInput)}
                placeholder="—"
                className="w-[72px] bg-bg3 border border-border rounded-xl px-3 py-[5px] text-[14px] text-[#f0eeff] outline-none focus:border-accent text-right transition-colors"
              />
              <span className="text-[13px] text-muted w-6">kg</span>
            </div>
          </div>

          <div className="flex items-center justify-between py-[14px] border-b border-border/60">
            <span className="text-[15px] text-[#f0eeff]">Estatura</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={estaturaInput}
                onChange={e => setEstaturaInput(e.target.value)}
                onBlur={() => saveStats('estatura', estaturaInput)}
                placeholder="—"
                className="w-[72px] bg-bg3 border border-border rounded-xl px-3 py-[5px] text-[14px] text-[#f0eeff] outline-none focus:border-accent text-right transition-colors"
              />
              <span className="text-[13px] text-muted w-6">cm</span>
            </div>
          </div>

          <div className="flex items-center justify-between py-[14px] border-b border-border/60">
            <span className="text-[15px] text-[#f0eeff]">Edad</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={edadInput}
                onChange={e => setEdadInput(e.target.value)}
                onBlur={() => saveStats('edad', edadInput)}
                placeholder="—"
                className="w-[72px] bg-bg3 border border-border rounded-xl px-3 py-[5px] text-[14px] text-[#f0eeff] outline-none focus:border-accent text-right transition-colors"
              />
              <span className="text-[13px] text-muted w-6">años</span>
            </div>
          </div>

          <div className="flex items-center justify-between py-[14px]">
            <span className="text-[15px] text-[#f0eeff]">Género</span>
            <div className="flex gap-[6px]">
              {GENDER_OPTIONS.map(g => (
                <button
                  key={g}
                  onClick={() => updateState({ userStats: { ...stats0, genero: g } })}
                  className={`px-3 h-8 rounded-xl text-[13px] font-medium transition-colors ${
                    (stats0.genero ?? 'Masculino') === g
                      ? 'bg-accent text-white'
                      : 'bg-white/[0.07] text-muted'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* IMC */}
      {bmi !== null && (
        <section className="px-5 mt-5">
          <h2 className="font-display text-[11px] font-semibold text-muted uppercase tracking-[0.1em] mb-1">IMC</h2>
          <div className="bg-card rounded-2xl border border-border px-4 py-4">
            <BMIBar bmi={bmi} />
          </div>
        </section>
      )}

      {/* Mis PRs */}
      <section className="px-5 mt-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-[11px] font-semibold text-muted uppercase tracking-[0.1em]">Récords personales</h2>
          <button
            onClick={() => setShowAddPR(true)}
            className="flex items-center gap-1 text-accent text-[13px] font-semibold active:opacity-70 transition-opacity"
          >
            <Plus size={14} strokeWidth={2.5} />
            Añadir
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {(prs ?? []).map(pr => (
            <PRCard
              key={pr.id}
              pr={pr}
              accentColor={currentAccent}
              onAddEntry={prId => {
                setAddEntryForPR(prId)
                setEntryWeight('')
                setEntryDate(todayStr())
              }}
            />
          ))}
        </div>
      </section>

      {/* Modal: emoji picker */}
      {showEmojiPicker && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm px-4 pb-[88px] animate-fade-in"
          onClick={() => setShowEmojiPicker(false)}
        >
          <div
            className="w-full max-w-[480px] bg-card rounded-[28px] border border-border p-6 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-display text-[16px] font-bold text-[#f0eeff] mb-4 text-center">Elige tu avatar</h3>
            <div className="grid grid-cols-6 gap-3">
              {EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => pickEmoji(emoji)}
                  className={`h-12 rounded-2xl text-[28px] flex items-center justify-center transition-all active:scale-90 ${
                    userEmoji === emoji ? 'bg-accent/25 border border-accent/60' : 'bg-white/[0.05]'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: añadir entrada a PR existente */}
      {addEntryForPR !== null && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm px-4 pb-[88px] animate-fade-in"
          onClick={() => setAddEntryForPR(null)}
        >
          <div
            className="w-full max-w-[480px] bg-card rounded-[28px] border border-border p-6 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-[17px] font-bold text-[#f0eeff]">
                {(prs ?? []).find(p => p.id === addEntryForPR)?.exerciseName}
              </h3>
              <button onClick={() => setAddEntryForPR(null)} className="text-muted active:opacity-60">
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[13px] text-muted block mb-1">Peso (kg)</label>
                <input
                  type="number"
                  min="0"
                  value={entryWeight}
                  onChange={e => setEntryWeight(e.target.value)}
                  placeholder="0"
                  autoFocus
                  className="w-full bg-bg3 border border-border rounded-xl px-4 py-[10px] text-[15px] text-[#f0eeff] outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="text-[13px] text-muted block mb-1">Fecha</label>
                <input
                  type="date"
                  value={entryDate}
                  onChange={e => setEntryDate(e.target.value)}
                  className="w-full bg-bg3 border border-border rounded-xl px-4 py-[10px] text-[15px] text-[#f0eeff] outline-none focus:border-accent transition-colors"
                />
              </div>
              <button
                onClick={handleSaveEntry}
                disabled={!entryWeight}
                className="w-full py-[13px] rounded-2xl bg-accent text-white font-semibold text-[15px] disabled:opacity-40 active:scale-[0.98] transition-all"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: nuevo PR */}
      {showAddPR && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm px-4 pb-[88px] animate-fade-in"
          onClick={() => setShowAddPR(false)}
        >
          <div
            className="w-full max-w-[480px] bg-card rounded-[28px] border border-border p-6 animate-slide-up max-h-[calc(100dvh-120px)] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-[17px] font-bold text-[#f0eeff]">Nuevo PR</h3>
              <button onClick={() => setShowAddPR(false)} className="text-muted active:opacity-60">
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[13px] text-muted block mb-1">Ejercicio</label>
                {newPRExercise ? (
                  <div className="flex items-center justify-between bg-bg3 border border-accent/60 rounded-xl px-4 py-[10px]">
                    <span className="text-[15px] text-[#f0eeff]">{newPRExercise}</span>
                    <button
                      onClick={() => { setNewPRExercise(null); setNewPRSearch('') }}
                      className="text-muted active:opacity-60"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      value={newPRSearch}
                      onChange={e => setNewPRSearch(e.target.value)}
                      placeholder="Buscar ejercicio..."
                      className="w-full bg-bg3 border border-border rounded-xl px-4 py-[10px] text-[15px] text-[#f0eeff] outline-none focus:border-accent transition-colors mb-2"
                    />
                    <div className="max-h-[140px] overflow-y-auto flex flex-col gap-[3px]">
                      {filteredExercises.slice(0, 8).map(ex => (
                        <button
                          key={ex.id}
                          onClick={() => { setNewPRExercise(ex.name); setNewPRSearch('') }}
                          className="text-left px-4 py-[9px] rounded-xl text-[14px] text-[#f0eeff] bg-white/[0.04] active:bg-white/[0.1] transition-colors"
                        >
                          {ex.name}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div>
                <label className="text-[13px] text-muted block mb-1">Peso (kg)</label>
                <input
                  type="number"
                  min="0"
                  value={newPRWeight}
                  onChange={e => setNewPRWeight(e.target.value)}
                  placeholder="0"
                  className="w-full bg-bg3 border border-border rounded-xl px-4 py-[10px] text-[15px] text-[#f0eeff] outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="text-[13px] text-muted block mb-1">Fecha</label>
                <input
                  type="date"
                  value={newPRDate}
                  onChange={e => setNewPRDate(e.target.value)}
                  className="w-full bg-bg3 border border-border rounded-xl px-4 py-[10px] text-[15px] text-[#f0eeff] outline-none focus:border-accent transition-colors"
                />
              </div>
              <button
                onClick={handleSaveNewPR}
                disabled={!newPRExercise || !newPRWeight}
                className="w-full py-[13px] rounded-2xl bg-accent text-white font-semibold text-[15px] disabled:opacity-40 active:scale-[0.98] transition-all"
              >
                Guardar PR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
