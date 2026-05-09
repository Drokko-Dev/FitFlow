import { NavLink } from 'react-router-dom'
import './BottomNav.css'

const tabs = [
  { to: '/home', icon: '🏠', label: 'Inicio' },
  { to: '/exercises', icon: '🏋️', label: 'Ejercicios' },
  { to: '/profile', icon: '👤', label: 'Perfil' },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
