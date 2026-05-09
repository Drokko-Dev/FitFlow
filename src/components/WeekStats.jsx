import { CalendarCheck2, Timer, Flame } from 'lucide-react'
import { useApp } from '../store/AppContext'

const DAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

function getWeekMonday() {
  const today = new Date()
  const dow = today.getDay()
  const daysFromMon = dow === 0 ? 6 : dow - 1
  const monday = new Date(today)
  monday.setDate(today.getDate() - daysFromMon)
  monday.setHours(0, 0, 0, 0)
  return monday
}

function toLocalDateStr(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function dayCircleClass(isToday) {
  const base = 'w-[42px] h-[42px] rounded-full flex items-center justify-center'
  if (isToday) return `${base} border-2 border-accent bg-transparent`
  return `${base} border border-white/[0.07] bg-bg2`
}

export default function WeekStats() {
  const { weekHistory } = useApp()

  const monday = getWeekMonday()
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return toLocalDateStr(d)
  })

  const todayStr = toLocalDateStr(new Date())
  const sessions = weekHistory.filter(s => weekDays.includes(s.fecha))
  const trainedSet = new Set(sessions.map(s => s.fecha))

  const dias  = trainedSet.size
  const totalMin = sessions.reduce((acc, s) => acc + s.duracionMin, 0)
  const horas = (totalMin / 60).toFixed(1)
  const kcal  = sessions.reduce((acc, s) => acc + s.calorias, 0)

  const stats = [
    { Icon: CalendarCheck2, color: '#22d3a0', value: dias,                                    unit: '/ 7',  label: 'Días' },
    { Icon: Timer,          color: '#f59e0b', value: horas,                                   unit: 'h',    label: 'Tiempo' },
    { Icon: Flame,          color: '#7c6aff', value: kcal > 0 ? kcal.toLocaleString('es') : '0', unit: 'kcal', label: 'Calorías' },
  ]

  return (
    <div className="flex flex-col gap-[10px]">
      {/* Stat cards */}
      <div className="flex gap-[10px]">
        {stats.map(({ Icon, color, value, unit, label }) => (
          <div
            key={label}
            className="flex-1 bg-card rounded-2xl pt-[14px] pb-3 px-3 border border-border border-t-2 flex flex-col items-center gap-2"
            style={{ borderTopColor: color }}
          >
            <Icon size={28} color={color} strokeWidth={1.75} />
            <div className="font-display text-2xl font-bold text-[#f0eeff] leading-none">
              {value}
              <span className="font-body text-xs font-normal text-[#8b87a8] ml-[3px]">{unit}</span>
            </div>
            <div className="text-[11px] text-muted uppercase tracking-[0.07em]">{label}</div>
          </div>
        ))}
      </div>

      {/* 7-day strip */}
      <div className="flex justify-between items-center bg-card rounded-2xl py-[14px] px-3 border border-border">
        {weekDays.map((dateStr, i) => {
          const trained = trainedSet.has(dateStr)
          const isToday = dateStr === todayStr
          return (
            <div key={i} className="flex flex-col items-center gap-[6px]">
              {trained && !isToday
                ? <span className="text-[28px] leading-none w-[42px] text-center">🔥</span>
                : <div className={dayCircleClass(isToday)}>
                    {trained && <span className="text-[28px] leading-none">🔥</span>}
                  </div>
              }
              <span className={`text-[11px] font-medium ${isToday ? 'text-[#a898ff] font-semibold' : 'text-muted'}`}>
                {DAY_LABELS[i]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
