import { useApp } from '../store/AppContext'
import './Profile.css'

export default function Profile() {
  const { userName, userEmoji, muscleScores, updateState } = useApp()

  return (
    <div className="profile-page">
      <header className="profile-header">
        <div className="profile-avatar">{userEmoji}</div>
        <h1 className="profile-name">{userName}</h1>
        <p className="profile-tag">Atleta FitFlow</p>
      </header>

      <section className="profile-section">
        <h2 className="section-title">Grupos Musculares</h2>
        <div className="muscle-list">
          {Object.entries(muscleScores).map(([muscle, score]) => (
            <div key={muscle} className="muscle-row">
              <span className="muscle-name">{muscle}</span>
              <div className="muscle-bar-bg">
                <div
                  className="muscle-bar-fill"
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className="muscle-score">{score}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
