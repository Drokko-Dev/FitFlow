import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import AIMessage from '../components/AIMessage'
import WeekStats from '../components/WeekStats'
import BodyMap from '../components/BodyMap'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 20) return 'Buenas tardes'
  return 'Buenas noches'
}

export default function Home() {
  const { userName, userEmoji } = useApp()
  const navigate = useNavigate()

  return (
    <div className="min-h-full bg-bg pb-20">
      <header className="px-5 pt-[52px] pb-6 bg-gradient-to-b from-accent/[0.09] to-transparent">
        <div className="flex items-center gap-[14px]">
          <button
            className="w-[52px] h-[52px] rounded-full bg-card border border-border text-[26px] flex items-center justify-center shrink-0 transition-[transform,border-color] duration-150 active:scale-[0.92] active:border-accent"
            onClick={() => navigate('/profile')}
            aria-label="Ver perfil"
          >
            {userEmoji}
          </button>
          <div>
            <p className="text-[13px] text-[#8b87a8] mb-0.5">{getGreeting()},</p>
            <h1 className="font-display text-[26px] font-bold text-[#f0eeff] leading-[1.1]">{userName}</h1>
          </div>
        </div>
      </header>

      <section className="px-5 mb-5">
        <AIMessage />
      </section>

      <section className="px-5 mb-5">
        <h2 className="font-display text-[12px] font-semibold text-muted uppercase tracking-[0.1em] mb-[10px]">Esta Semana</h2>
        <WeekStats />
      </section>

      <section className="px-5 mb-5">
        <h2 className="font-display text-[12px] font-semibold text-muted uppercase tracking-[0.1em] mb-[10px]">Mapa Muscular</h2>
        <BodyMap />
      </section>
    </div>
  )
}
