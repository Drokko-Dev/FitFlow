import { useApp } from '../store/AppContext'
import './AIMessage.css'

const MUSCLE_LABELS = {
  pecho: 'pecho',
  espalda: 'espalda',
  brazos: 'brazos',
  hombros: 'hombros',
  pierna: 'pierna',
  core: 'core',
}

function getLowestMuscle(scores) {
  const entries = Object.entries(scores)
  const allZero = entries.every(([, v]) => v === 0)
  if (allZero) return null
  return entries.reduce((min, cur) => (cur[1] < min[1] ? cur : min))
}

function buildMessage(scores) {
  const lowest = getLowestMuscle(scores)

  if (!lowest) {
    return 'Hoy es un buen día para empezar, ¡vamos que se puede! ⚡'
  }

  const [muscle, score] = lowest
  const label = MUSCLE_LABELS[muscle] ?? muscle

  if (score < 35) {
    return `Oye, hoy sería un buen día para trabajar ${label}... ¡llevas un rato sin darle! 💥`
  }
  if (score < 60) {
    return `Hey, ¿y si hoy le metemos un poco de ${label}? Tu cuerpo te lo va a agradecer 🔥`
  }
  return '¡Estás hecho una máquina! Todo bien trabajado, mantén la racha 🏆'
}

export default function AIMessage() {
  const { muscleScores } = useApp()
  const message = buildMessage(muscleScores)

  return (
    <div className="ai-card">
      <div className="ai-top-bar" />
      <div className="ai-inner">
        <span className="ai-badge">FITFLOW AI</span>
        <p className="ai-text">{message}</p>
      </div>
    </div>
  )
}
