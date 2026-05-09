import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/home', icon: '🏠', label: 'Inicio' },
  { to: '/exercises', icon: '🏋️', label: 'Ejercicios' },
  { to: '/profile', icon: '👤', label: 'Perfil' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-[68px] bg-[rgba(17,17,24,0.95)] backdrop-blur-xl border-t border-border flex items-center justify-around z-[100]">
      {tabs.map(tab => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-[3px] px-5 py-2 rounded-[10px] transition-colors ${isActive ? 'text-[#a898ff]' : 'text-muted'}`
          }
        >
          <span className="text-[20px] leading-none">{tab.icon}</span>
          <span className="text-[11px] font-medium tracking-[0.02em]">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
