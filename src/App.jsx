import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './store/AppContext'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Exercises from './pages/Exercises'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="w-full max-w-[480px] h-full bg-bg relative flex flex-col">
          <main className="flex-1 overflow-y-auto pb-[68px] no-scrollbar">
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/exercises" element={<Exercises />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}
