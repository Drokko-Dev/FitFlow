import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { AppProvider } from './store/AppContext'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Exercises from './pages/Exercises'
import History from './pages/History'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Login from './pages/Login'

function AuthSpinner() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-[rgba(124,106,255,0.3)] border-t-[#7c6aff] animate-spin" />
    </div>
  )
}

export default function App() {
  const [session,     setSession]     = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (authLoading) return <AuthSpinner />
  if (!session)    return <Login />

  return (
    <AppProvider userId={session.user.id}>
      <BrowserRouter>
        <div className="w-full max-w-[480px] h-full bg-bg relative flex flex-col">
          <main className="flex-1 overflow-y-auto pb-[68px] no-scrollbar">
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home"      element={<Home />} />
              <Route path="/exercises" element={<Exercises />} />
              <Route path="/history"   element={<History />} />
              <Route path="/profile"   element={<Profile />} />
              <Route path="/settings"  element={<Settings />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}
