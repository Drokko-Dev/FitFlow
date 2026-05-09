import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import AIMessage from '../components/AIMessage'
import WeekStats from '../components/WeekStats'
import BodyMap from '../components/BodyMap'
import './Home.css'

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
    <div className="home-page">
      <header className="home-header">
        <div className="home-greeting">
          <button
            className="home-avatar"
            onClick={() => navigate('/profile')}
            aria-label="Ver perfil"
          >
            {userEmoji}
          </button>
          <div>
            <p className="home-saludo">{getGreeting()},</p>
            <h1 className="home-name">{userName}</h1>
          </div>
        </div>
      </header>

      <section className="home-section">
        <AIMessage />
      </section>

      <section className="home-section">
        <h2 className="section-title">Esta Semana</h2>
        <WeekStats />
      </section>

      <section className="home-section">
        <h2 className="section-title">Mapa Muscular</h2>
        <BodyMap />
      </section>
    </div>
  )
}
