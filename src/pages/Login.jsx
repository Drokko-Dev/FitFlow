import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { updateProfile } from '../hooks/useSupabase'

const TAB_LOGIN    = 'login'
const TAB_REGISTER = 'register'

function Spinner() {
  return (
    <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
  )
}

export default function Login() {
  const [tab,      setTab]      = useState(TAB_LOGIN)
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)
  const [info,     setInfo]     = useState(null)

  function clearMessages() { setError(null); setInfo(null) }

  async function handleLogin(e) {
    e.preventDefault()
    clearMessages()
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    } catch (err) {
      setError(err.message ?? 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    clearMessages()
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      if (data.user) {
        await updateProfile(data.user.id, { name: email.split('@')[0] })
      }
      if (!data.session) {
        setInfo('Revisa tu correo para confirmar la cuenta.')
      }
    } catch (err) {
      setError(err.message ?? 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  const isLogin = tab === TAB_LOGIN

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6 py-12">

      {/* Logo */}
      <div className="flex flex-col items-center mb-10">
        <h1
          className="font-display text-[58px] font-black tracking-tight leading-none mb-2"
          style={{
            background: 'linear-gradient(135deg, rgb(var(--accent)), #c4b5fd)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          FitFlow
        </h1>
        <p className="text-[15px] text-[#8888aa] font-body">Tu entrenamiento, tu progreso</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-[400px] bg-[#1e1e2e] rounded-[28px] border border-[#2a2a40] p-6">

        {/* Tabs */}
        <div className="flex bg-[#12121a] rounded-2xl p-1 mb-6">
          {[TAB_LOGIN, TAB_REGISTER].map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); clearMessages() }}
              className={`flex-1 py-[9px] rounded-xl text-[14px] font-semibold transition-all ${
                tab === t
                  ? 'bg-[#2a2a3e] text-[#f0eeff] shadow-sm'
                  : 'text-[#8888aa]'
              }`}
            >
              {t === TAB_LOGIN ? 'Iniciar sesión' : 'Registrarse'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={isLogin ? handleLogin : handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="text-[12px] text-[#8888aa] font-medium block mb-1 ml-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="hola@ejemplo.com"
              required
              autoComplete="email"
              className="w-full bg-[#12121a] border border-[#2a2a40] rounded-xl px-4 py-[11px] text-[15px] text-[#f0eeff] outline-none focus:border-[rgba(124,106,255,0.8)] placeholder:text-[#3a3a55] transition-colors"
            />
          </div>
          <div>
            <label className="text-[12px] text-[#8888aa] font-medium block mb-1 ml-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              className="w-full bg-[#12121a] border border-[#2a2a40] rounded-xl px-4 py-[11px] text-[15px] text-[#f0eeff] outline-none focus:border-[rgba(124,106,255,0.8)] placeholder:text-[#3a3a55] transition-colors"
            />
          </div>

          {/* Error / info */}
          {error && (
            <p className="text-[13px] text-[#f87171] text-center px-1 -mt-1">{error}</p>
          )}
          {info && (
            <p className="text-[13px] text-[#22d3a0] text-center px-1 -mt-1">{info}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[50px] rounded-2xl text-[15px] font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98] transition-all mt-1"
            style={{
              background: 'linear-gradient(135deg, rgb(var(--accent)) 0%, rgba(168,85,247,0.85) 100%)',
            }}
          >
            {loading ? <Spinner /> : (isLogin ? 'Entrar' : 'Crear cuenta')}
          </button>
        </form>
      </div>
    </div>
  )
}
