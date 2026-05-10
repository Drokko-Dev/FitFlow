import { NavLink } from 'react-router-dom'
import { Home, Dumbbell, User, Settings } from 'lucide-react'

const tabs = [
  { to: '/home',      Icon: Home,     label: 'Inicio'        },
  { to: '/exercises', Icon: Dumbbell, label: 'Ejercicios'    },
  { to: '/profile',   Icon: User,     label: 'Perfil'        },
  { to: '/settings',  Icon: Settings, label: 'Ajustes'       },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-[68px] bg-[var(--color-card)] backdrop-blur-xl shadow-[0_-1px_0_var(--color-border)] flex items-center z-[100]">
      {tabs.map(({ to, Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `w-1/4 flex flex-col items-center gap-[3px] py-2 rounded-[10px] transition-colors ${isActive ? 'text-[#a898ff]' : 'text-[var(--color-muted)]'}`
          }
        >
          <Icon size={20} strokeWidth={1.75} />
          <span className="text-[11px] font-medium tracking-[0.02em]">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
