import { CalendarCheck2, Timer, Flame } from 'lucide-react'
import { useApp } from '../store/AppContext'
import './WeekStats.css'

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

  const dias = trainedSet.size
  const totalMin = sessions.reduce((acc, s) => acc + s.duracionMin, 0)
  const horas = (totalMin / 60).toFixed(1)
  const kcal = sessions.reduce((acc, s) => acc + s.calorias, 0)

  const stats = [
    {
      Icon: CalendarCheck2,
      color: '#22d3a0',
      value: dias,
      unit: '/ 7',
      label: 'Días',
    },
    {
      Icon: Timer,
      color: '#f59e0b',
      value: horas,
      unit: 'h',
      label: 'Tiempo',
    },
    {
      Icon: Flame,
      color: '#7c6aff',
      value: kcal > 0 ? kcal.toLocaleString('es') : '0',
      unit: 'kcal',
      label: 'Calorías',
    },
  ]

  return (
    <div className="week-stats">
      <div className="stats-row">
        {stats.map(({ Icon, color, value, unit, label }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon-wrap" style={{ background: `${color}26` }}>
              <Icon size={18} color={color} strokeWidth={2} />
            </div>
            <div className="stat-value">
              {value}
              <span className="stat-unit">{unit}</span>
            </div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="days-row">
        {weekDays.map((dateStr, i) => {
          const trained = trainedSet.has(dateStr)
          const isToday = dateStr === todayStr
          return (
            <div key={i} className={`day-item${trained ? ' trained' : ''}${isToday ? ' today' : ''}`}>
              <div className="day-circle">
                {trained && <span className="day-fire">🔥</span>}
              </div>
              <span className="day-label">{DAY_LABELS[i]}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
