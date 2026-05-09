import { useApp } from '../store/AppContext'

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
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="h-[3px] bg-gradient-to-r from-accent via-accent2 to-pink-500" />
      <div className="px-4 pt-[14px] pb-4">
        <span className="inline-flex items-center gap-[5px] text-[10px] font-bold tracking-[0.1em] text-[#a898ff] bg-accent/15 px-[10px] py-[3px] rounded-full mb-[10px]">
          <span className="w-[5px] h-[5px] rounded-full bg-[#a898ff] animate-pulse-dot" />
          FITFLOW AI
        </span>
        <p className="text-[15px] leading-[1.55] text-[#f0eeff]">{message}</p>
      </div>
    </div>
  )
}
