import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useApp } from '../store/AppContext'

const DAY_LABELS  = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                     'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

function dateToStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function formatDuration(min) {
  if (!min) return '0 min'
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export default function History() {
  const { weekHistory } = useApp()
  const now   = new Date()
  const TODAY = dateToStr(now)

  const [year,  setYear]  = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selectedDate, setSelectedDate] = useState(null)

  // date → newest session for that date (weekHistory is ordered newest-first)
  const sessionMap = useMemo(() => {
    const map = {}
    for (const s of weekHistory) {
      if (s.fecha && !map[s.fecha]) map[s.fecha] = s
    }
    return map
  }, [weekHistory])

  // Calendar grid — Monday-first
  const calendarDays = useMemo(() => {
    const firstDay    = new Date(year, month, 1)
    const startOffset = (firstDay.getDay() + 6) % 7
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = []

    for (let i = startOffset; i > 0; i--) {
      days.push({ date: new Date(year, month, 1 - i), current: false })
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ date: new Date(year, month, d), current: true })
    }
    const tail = (7 - (days.length % 7)) % 7
    for (let d = 1; d <= tail; d++) {
      days.push({ date: new Date(year, month + 1, d), current: false })
    }
    return days
  }, [year, month])

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  // Month summary
  const monthStats = useMemo(() => {
    const prefix   = `${year}-${String(month + 1).padStart(2, '0')}`
    const sessions = weekHistory.filter(s => s.fecha?.startsWith(prefix))
    const trainedDays = new Set(sessions.map(s => s.fecha)).size
    const totalMin    = sessions.reduce((a, s) => a + (s.duracionMin ?? 0), 0)
    const totalKcal   = sessions.reduce((a, s) => a + (s.calorias ?? 0), 0)

    const datesSet = new Set(weekHistory.map(s => s.fecha))
    let streak = 0
    const check = new Date()
    while (datesSet.has(dateToStr(check))) {
      streak++
      check.setDate(check.getDate() - 1)
    }

    return { trainedDays, totalMin, totalKcal, streak }
  }, [weekHistory, year, month])

  const selectedSession = selectedDate ? sessionMap[selectedDate] : null

  return (
    <div className="min-h-screen bg-bg pb-24">
      <header className="px-5 pt-[52px] pb-4 bg-gradient-to-b from-accent/[0.09] to-transparent">
        <h1 className="font-display text-[26px] font-bold tracking-normal text-[#f0eeff]">Historial</h1>
      </header>

      {/* Month navigation */}
      <div className="px-5 flex items-center justify-between mb-5">
        <button
          onClick={prevMonth}
          className="w-9 h-9 rounded-full bg-white/[0.06] border border-border flex items-center justify-center active:scale-90 transition-transform"
        >
          <ChevronLeft size={18} className="text-muted" />
        </button>
        <p className="font-display text-[17px] font-semibold text-[#f0eeff]">
          {MONTH_NAMES[month]} {year}
        </p>
        <button
          onClick={nextMonth}
          className="w-9 h-9 rounded-full bg-white/[0.06] border border-border flex items-center justify-center active:scale-90 transition-transform"
        >
          <ChevronRight size={18} className="text-muted" />
        </button>
      </div>

      {/* Calendar */}
      <div className="px-3">
        <div className="grid grid-cols-7 mb-2">
          {DAY_LABELS.map(d => (
            <div key={d} className="text-center text-[11px] font-semibold text-muted py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-2">
          {calendarDays.map(({ date, current }, i) => {
            const str        = dateToStr(date)
            const hasSession = !!sessionMap[str]
            const isToday    = str === TODAY
            const isSelected = str === selectedDate

            let cls = 'w-10 h-10 mx-auto rounded-full flex items-center justify-center text-[14px] font-semibold transition-all '
            if (!current)                     cls += 'opacity-25 text-muted '
            else if (hasSession && isSelected) cls += 'bg-accent text-white scale-110 '
            else if (hasSession)              cls += 'bg-accent/20 text-accent border border-accent/40 active:scale-95 '
            else if (isToday)                 cls += 'border-2 border-accent/50 text-accent/80 '
            else                              cls += 'text-muted '

            return (
              <button
                key={i}
                onClick={() => hasSession && setSelectedDate(prev => prev === str ? null : str)}
                className={cls}
                aria-label={str}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>
      </div>

      {/* Month summary */}
      <div className="px-5 mt-6">
        <h2 className="font-display text-[11px] font-semibold text-muted uppercase tracking-[0.1em] mb-2">
          Resumen del mes
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: monthStats.trainedDays,           label: 'Días entrenados' },
            { value: formatDuration(monthStats.totalMin), label: 'Tiempo total' },
            { value: monthStats.totalKcal,             label: 'kcal quemadas' },
            { value: `${monthStats.streak} 🔥`,        label: 'Racha actual' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-card rounded-2xl border border-border p-4">
              <p className="font-body text-[24px] font-bold text-accent leading-none">{value}</p>
              <p className="text-[12px] text-muted mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Session detail slide-up */}
      {selectedSession && (
        <div
          key={selectedDate}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm px-4 pb-[88px] animate-fade-in"
          onClick={() => setSelectedDate(null)}
        >
          <div
            className="w-full max-w-[480px] bg-card rounded-[28px] border border-border p-6 animate-slide-up max-h-[65vh] overflow-y-auto no-scrollbar"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-display text-[18px] font-bold text-[#f0eeff] leading-tight">
                  {selectedSession.planName ?? 'Entrenamiento'}
                </p>
                <p className="text-[12px] text-muted mt-1">{selectedDate}</p>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="w-8 h-8 rounded-full bg-white/[0.06] border border-border flex items-center justify-center text-muted active:scale-90 transition-transform shrink-0 ml-3"
              >
                <X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { val: selectedSession.duracionMin ?? 0, unit: 'min' },
                { val: selectedSession.calorias    ?? 0, unit: 'kcal' },
                { val: (selectedSession.exercises ?? []).length, unit: 'ejercicios' },
              ].map(({ val, unit }) => (
                <div key={unit} className="bg-white/[0.04] rounded-xl p-3 text-center">
                  <p className="font-body text-[18px] font-bold text-accent leading-none">{val}</p>
                  <p className="text-[10px] text-muted mt-1">{unit}</p>
                </div>
              ))}
            </div>

            {(selectedSession.exercises ?? []).length > 0 ? (
              <div className="flex flex-col">
                {selectedSession.exercises.map((ex, i) => (
                  <div key={i} className="flex items-center gap-3 py-[10px] border-b border-border/40 last:border-0">
                    <span className="text-[18px] leading-none shrink-0">{ex.icon ?? '🏋️'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-[#f0eeff] truncate">{ex.name}</p>
                      <p className="text-[11px] text-muted capitalize">{ex.sets} × {ex.reps} reps · {ex.muscle}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-muted text-center py-2">Sin detalle de ejercicios</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
