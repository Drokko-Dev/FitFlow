import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { exercises } from '../data/exercises'
import { supabase } from '../lib/supabase'
import * as db from '../hooks/useSupabase'

const AppContext = createContext(null)

const DATA_VERSION = 5

function applyAccent(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  document.documentElement.style.setProperty('--accent', `${r} ${g} ${b}`)
}

// eslint-disable-next-line no-unused-vars
function exEntry(id, sets, reps) {
  const ex = exercises.find(e => e.id === id)
  return { ...ex, sets, reps }
}

const defaultState = {
  dataVersion:  DATA_VERSION,
  userName:     'Atleta',
  userEmoji:    '🔥',
  plans:        [],
  muscleScores: { pecho: 0, espalda: 0, brazos: 0, hombros: 0, pierna: 0, core: 0 },
  weekHistory:  [],
  accentColor:  '#7c6aff',
  preferences:  { reminders: false },
  goals:        { daysPerWeek: 4, goal: 'Ganar músculo' },
  userStats:    { peso: null, estatura: null, edad: null, genero: 'Masculino' },
  prs:          [],
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem('fitflow_state')
    if (!saved) return defaultState
    const parsed = JSON.parse(saved)
    if (parsed.dataVersion !== DATA_VERSION) return defaultState
    const state = { ...defaultState, ...parsed }
    if (state.accentColor && state.accentColor !== '#7c6aff') applyAccent(state.accentColor)
    return state
  } catch {
    return defaultState
  }
}

// Builds the flat profiles row from a partial context state update.
// Schema: name, emoji, weight, height, age, gender, goal, days_per_week
// accentColor / preferences / muscleScores stay in localStorage only.
function toProfileRow(partial) {
  const row = {}
  if (partial.userName  !== undefined) row.name  = partial.userName
  if (partial.userEmoji !== undefined) row.emoji = partial.userEmoji
  if (partial.userStats !== undefined) {
    const s = partial.userStats
    if (s.peso     != null) row.weight = s.peso
    if (s.estatura != null) row.height = s.estatura
    if (s.edad     != null) row.age    = s.edad
    if (s.genero   !== undefined) row.gender = s.genero
  }
  if (partial.goals !== undefined) {
    const g = partial.goals
    if (g.goal        !== undefined) row.goal         = g.goal
    if (g.daysPerWeek !== undefined) row.days_per_week = g.daysPerWeek
  }
  return row
}

// Builds local context state from a flat profiles DB row
function fromProfileRow(row, prev) {
  if (!row) return {}
  return {
    userName:  row.name  ?? prev.userName,
    userEmoji: row.emoji ?? prev.userEmoji,
    userStats: {
      peso:     row.weight ?? prev.userStats?.peso    ?? null,
      estatura: row.height ?? prev.userStats?.estatura ?? null,
      edad:     row.age    ?? prev.userStats?.edad    ?? null,
      genero:   row.gender ?? prev.userStats?.genero  ?? 'Masculino',
    },
    goals: {
      daysPerWeek: row.days_per_week ?? prev.goals?.daysPerWeek ?? 4,
      goal:        row.goal          ?? prev.goals?.goal ?? 'Ganar músculo',
    },
  }
}

// Keys in partial that trigger a Supabase profile sync
const PROFILE_KEYS = new Set(['userName', 'userEmoji', 'userStats', 'goals'])

export function AppProvider({ children, userId }) {
  const [state,       setState]       = useState(loadFromStorage)
  const [dataLoading, setDataLoading] = useState(true)
  const [errorToast,  setErrorToast]  = useState(null)

  // Always reflects current committed state — avoids stale closures in mutations
  const stateRef   = useRef(state)
  const toastTimer = useRef(null)

  useEffect(() => { stateRef.current = state }, [state])

  // Offline cache
  useEffect(() => {
    localStorage.setItem('fitflow_state', JSON.stringify(state))
  }, [state])

  // Load all user data from Supabase when userId is known
  useEffect(() => {
    if (!userId) { setDataLoading(false); return }
    loadUserData(userId)
  }, [userId]) // eslint-disable-line react-hooks/exhaustive-deps

  function showError(msg) {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setErrorToast(msg)
    toastTimer.current = setTimeout(() => setErrorToast(null), 3000)
  }

  async function loadUserData(uid) {
    setDataLoading(true)
    try {
      const [profile, plans, sessions, prs, muscleScores] = await Promise.all([
        db.fetchProfile(uid),
        db.fetchPlans(uid),
        db.fetchSessions(uid),
        db.fetchPRs(uid),
        db.calculateMuscleScores(uid),
      ])
      setState(prev => ({
        ...prev,
        ...fromProfileRow(profile, prev),
        plans,
        weekHistory: sessions,
        prs,
        muscleScores,
      }))
    } catch {
      showError('Error al cargar los datos')
    } finally {
      setDataLoading(false)
    }
  }

  // ─── Profile mutations ────────────────────────────────────────────────────

  function updateState(partial) {
    setState(prev => ({ ...prev, ...partial }))
    if (!userId) return
    const hasProfileKey = Object.keys(partial).some(k => PROFILE_KEYS.has(k))
    if (!hasProfileKey) return
    const row = toProfileRow(partial)
    if (Object.keys(row).length === 0) return
    db.updateProfile(userId, row).catch(() => showError('Error al guardar los cambios'))
  }

  // ─── Plan mutations ───────────────────────────────────────────────────────

  function addPlan(plan) {
    // Ensure plan has a UUID compatible with the Supabase uuid PK
    const planWithId = { ...plan, id: crypto.randomUUID() }
    setState(prev => ({ ...prev, plans: [...prev.plans, planWithId] }))
    if (!userId) return
    db.createPlan(userId, planWithId).catch(() => showError('Error al guardar el plan'))
  }

  function updatePlan(id, updated) {
    setState(prev => ({
      ...prev,
      plans: prev.plans.map(p => (p.id === id ? { ...p, ...updated } : p)),
    }))
    if (!userId) return
    db.updatePlan(id, updated).catch(() => showError('Error al actualizar el plan'))
  }

  function deletePlan(id) {
    setState(prev => ({ ...prev, plans: prev.plans.filter(p => p.id !== id) }))
    if (!userId) return
    db.deletePlan(id).catch(() => showError('Error al eliminar el plan'))
  }

  // ─── Session mutations ────────────────────────────────────────────────────

  async function addSession(session) {
    const localEntry = {
      fecha:       session.fecha,
      duracionMin: session.duracionMin,
      calorias:    session.calorias,
      planName:    session.planName ?? null,
      exercises:   session.exercises ?? [],
      created_at:  new Date().toISOString(),
    }
    setState(prev => ({ ...prev, weekHistory: [...prev.weekHistory, localEntry] }))
    if (!userId) return
    try {
      const dbSession = {
        duration_min: session.duracionMin,
        calories:     session.calorias,
        plan_name:    session.planName ?? null,
        plan_id:      session.planId ?? null,
        exercises:    session.exercises ?? null,
      }
      const sessionId = await db.createSession(userId, dbSession)
      if (session.exercises?.length && sessionId) {
        await db.insertMuscleHistory(userId, sessionId, session.exercises, session.fecha)
      }
      const newScores = await db.calculateMuscleScores(userId)
      setState(prev => ({ ...prev, muscleScores: newScores }))
    } catch (err) {
      console.error('Error al guardar la sesión:', err)
      showError('Error al guardar la sesión')
    }
  }

  // ─── PR mutations ─────────────────────────────────────────────────────────

  function addPR(exerciseName, firstEntry) {
    // UUID required by personal_records PK
    const newPR = { id: crypto.randomUUID(), exerciseName, history: firstEntry ? [firstEntry] : [] }
    setState(prev => ({ ...prev, prs: [...prev.prs, newPR] }))
    if (!userId) return
    db.createPR(userId, newPR).catch(() => showError('Error al guardar el récord'))
  }

  function addPREntry(prId, entry) {
    const currentPR  = stateRef.current.prs.find(p => p.id === prId)
    const newHistory = currentPR ? [...currentPR.history, entry] : [entry]
    setState(prev => ({
      ...prev,
      prs: prev.prs.map(pr => pr.id === prId ? { ...pr, history: newHistory } : pr),
    }))
    if (!userId) return
    db.updatePR(prId, newHistory).catch(() => showError('Error al guardar la entrada'))
  }

  // ─── Auth ─────────────────────────────────────────────────────────────────

  async function logout() {
    localStorage.removeItem('fitflow_state')
    await supabase.auth.signOut()
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <AppContext.Provider value={{
      ...state,
      updateState, addPlan, updatePlan, deletePlan,
      addSession, addPR, addPREntry, logout,
      dataLoading,
    }}>
      {dataLoading ? (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-[rgba(124,106,255,0.3)] border-t-[#7c6aff] animate-spin" />
        </div>
      ) : children}
      {errorToast && (
        <div className="fixed bottom-[88px] left-1/2 -translate-x-1/2 bg-[#1e1e2e] border border-red-500/40 rounded-2xl px-5 py-3 text-[14px] text-[#f0eeff] shadow-lg z-[200] whitespace-nowrap animate-fade-in">
          ⚠️ {errorToast}
        </div>
      )}
    </AppContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
