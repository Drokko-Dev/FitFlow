import { useState } from 'react'
import { Trophy, Zap, Star } from 'lucide-react'
import { useApp } from '../store/AppContext'

const EMOJIS = ['🏋️','💪','🦅','🔥','⚡','🥊','🏃','🧗','🤸','🐉','🦁','🎯']
const ACCENT_COLORS = ['#7c6aff', '#22d3a0', '#f59e0b', '#ef4444']
const DAYS_OPTIONS = [3, 4, 5, 6]
const GOAL_OPTIONS = ['Ganar músculo', 'Perder peso', 'Mantenimiento', 'Definición']

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r} ${g} ${b}`
}

function toDateStr(date) {
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
  while (trained.has(toDateStr(d))) {
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${on ? 'bg-accent' : 'bg-white/[0.15]'}`}
    >
      <span
        className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow transition-all duration-200 ${
          on ? 'left-[23px]' : 'left-[3px]'
        }`}
      />
    </button>
  )
}

function SettingRow({ label, children, border = true }) {
  return (
    <div className={`flex items-center justify-between py-[14px] ${border ? 'border-b border-border/60' : ''}`}>
      <span className="text-[15px] text-[#f0eeff]">{label}</span>
      {children}
    </div>
  )
}

export default function Profile() {
  const { userName, userEmoji, weekHistory, preferences, accentColor, goals, updateState } = useApp()

  const [editingName, setEditingName]         = useState(false)
  const [nameInput, setNameInput]             = useState(userName)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [darkMode, setDarkMode]               = useState(
    () => localStorage.getItem('fitflow-dark-mode') !== 'false'
  )

  const totalSessions = weekHistory.length
  const streak        = calcStreak(weekHistory)
  const prefs         = preferences  ?? { reminders: false }
  const currentAccent = accentColor  ?? '#7c6aff'
  const currentGoals  = goals        ?? { daysPerWeek: 4, goal: 'Ganar músculo' }

  const stats = [
    { Icon: Trophy, color: '#f59e0b',     value: 12,            unit: 'sem', label: 'Activo'   },
    { Icon: Zap,    color: currentAccent, value: totalSessions,  unit: '',    label: 'Sesiones' },
    { Icon: Star,   color: '#22d3a0',     value: streak,         unit: 'd',   label: 'Racha'    },
  ]

  function saveName() {
    if (nameInput.trim()) updateState({ userName: nameInput.trim() })
    setEditingName(false)
  }

  function pickEmoji(emoji) {
    updateState({ userEmoji: emoji })
    setShowEmojiPicker(false)
  }

  function changeAccent(hex) {
    document.documentElement.style.setProperty('--accent', hexToRgb(hex))
    updateState({ accentColor: hex })
  }

  function toggleDarkMode(val) {
    setDarkMode(val)
    localStorage.setItem('fitflow-dark-mode', String(val))
    const html = document.documentElement
    if (val) {
      html.removeAttribute('data-theme')
      html.style.setProperty('--color-bg',     '#0a0a0f')
      html.style.setProperty('--color-card',   '#1e1e2e')
      html.style.setProperty('--color-border', '#2a2a40')
      html.style.setProperty('--color-muted',  '#8888aa')
    } else {
      html.setAttribute('data-theme', 'light')
      html.style.setProperty('--color-bg',     '#f8f8ff')
      html.style.setProperty('--color-card',   '#ffffff')
      html.style.setProperty('--color-border', '#c8c8dc')
      html.style.setProperty('--color-muted',  '#666680')
    }
  }

  return (
    <div className="min-h-screen bg-bg pb-20">

      {/* Header */}
      <header className="px-5 pt-[52px] pb-8 flex flex-col items-center gap-3 bg-gradient-to-b from-accent/[0.1] to-transparent">
        <button
          onClick={() => setShowEmojiPicker(true)}
          className="w-[88px] h-[88px] rounded-full bg-gradient-to-br from-accent/50 to-accent2/30 flex items-center justify-center text-[48px] leading-none border-2 border-accent/40 active:scale-95 transition-transform"
        >
          {userEmoji}
        </button>
        <div className="flex flex-col items-center gap-1">
          <h1 className="font-display text-[24px] font-extrabold text-[#f0eeff]">{userName}</h1>
          <p className="text-[13px] text-muted">Miembro desde Mayo 2026</p>
        </div>
      </header>

      {/* Stat cards */}
      <div className="px-5 mt-1 flex gap-[10px]">
        {stats.map(({ Icon, color, value, unit, label }) => (
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

      {/* Mi perfil */}
      <section className="px-5 mt-6">
        <h2 className="font-display text-[11px] font-semibold text-muted uppercase tracking-[0.1em] mb-1">Mi perfil</h2>
        <div className="bg-card rounded-2xl border border-border px-4">
          <SettingRow label="Nombre">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  onBlur={saveName}
                  onKeyDown={e => {
                    if (e.key === 'Enter')  saveName()
                    if (e.key === 'Escape') setEditingName(false)
                  }}
                  className="bg-bg3 border border-border rounded-xl px-3 py-[6px] text-[14px] text-[#f0eeff] outline-none focus:border-accent w-32 transition-colors"
                />
                <button onMouseDown={saveName} className="text-accent text-[14px] font-semibold">OK</button>
              </div>
            ) : (
              <button
                onClick={() => { setNameInput(userName); setEditingName(true) }}
                className="text-[15px] text-muted active:opacity-60 transition-opacity"
              >
                {userName} ›
              </button>
            )}
          </SettingRow>
          <SettingRow label="Avatar" border={false}>
            <button
              onClick={() => setShowEmojiPicker(true)}
              className="text-[28px] leading-none active:scale-90 transition-transform"
            >
              {userEmoji}
            </button>
          </SettingRow>
        </div>
      </section>

      {/* Preferencias */}
      <section className="px-5 mt-5">
        <h2 className="font-display text-[11px] font-semibold text-muted uppercase tracking-[0.1em] mb-1">Preferencias</h2>
        <div className="bg-card rounded-2xl border border-border px-4">
          <SettingRow label="Modo oscuro">
            <Toggle on={darkMode} onChange={toggleDarkMode} />
          </SettingRow>
          <SettingRow label="Recordatorios">
            <Toggle
              on={prefs.reminders}
              onChange={val => updateState({ preferences: { ...prefs, reminders: val } })}
            />
          </SettingRow>
          <SettingRow label="Color de acento" border={false}>
            <div className="flex gap-[10px]">
              {ACCENT_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => changeAccent(color)}
                  className="w-7 h-7 rounded-full active:scale-90 transition-transform"
                  style={{
                    backgroundColor: color,
                    boxShadow: currentAccent === color
                      ? '0 0 0 2px var(--bg), 0 0 0 4px white'
                      : 'none',
                  }}
                />
              ))}
            </div>
          </SettingRow>
        </div>
      </section>

      {/* Objetivos */}
      <section className="px-5 mt-5">
        <h2 className="font-display text-[11px] font-semibold text-muted uppercase tracking-[0.1em] mb-1">Objetivos</h2>
        <div className="bg-card rounded-2xl border border-border px-4">
          <SettingRow label="Días por semana">
            <div className="flex gap-[6px]">
              {DAYS_OPTIONS.map(d => (
                <button
                  key={d}
                  onClick={() => updateState({ goals: { ...currentGoals, daysPerWeek: d } })}
                  className={`w-8 h-8 rounded-xl text-[14px] font-display font-bold transition-colors ${
                    currentGoals.daysPerWeek === d
                      ? 'bg-accent text-white'
                      : 'bg-white/[0.07] text-muted'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </SettingRow>
          <div className="py-3">
            <p className="text-[13px] text-muted mb-2">Objetivo</p>
            <div className="flex flex-col gap-[6px]">
              {GOAL_OPTIONS.map(g => (
                <button
                  key={g}
                  onClick={() => updateState({ goals: { ...currentGoals, goal: g } })}
                  className={`text-left px-4 py-[10px] rounded-xl text-[14px] border transition-colors ${
                    currentGoals.goal === g
                      ? 'bg-accent/20 text-[#f0eeff] border-accent/40'
                      : 'bg-white/[0.04] text-muted border-transparent'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Emoji picker modal */}
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
    </div>
  )
}
