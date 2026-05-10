import { createContext, useContext, useState, useEffect } from 'react'
import { exercises } from '../data/exercises'

const AppContext = createContext(null)

const DATA_VERSION = 4

function applyAccent(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  document.documentElement.style.setProperty('--accent', `${r} ${g} ${b}`)
}

function exEntry(id, sets, reps) {
  const ex = exercises.find(e => e.id === id)
  return { ...ex, sets, reps }
}

const defaultState = {
  dataVersion: DATA_VERSION,
  userName: 'Atleta',
  userEmoji: '🔥',
  plans: [
    {
      id: 'plan-default-1',
      name: 'Plan Brazos',
      exercises: [
        exEntry(6,  3, 10),
        exEntry(7,  3, 12),
        exEntry(13, 2, 10),
      ],
    },
    {
      id: 'plan-default-2',
      name: 'Plan Pierna',
      exercises: [
        exEntry(2,  4, 10),
        exEntry(20, 3, 12),
        exEntry(12, 3, 10),
      ],
    },
  ],
  muscleScores: {
    pecho:    72,
    espalda:  30,
    brazos:   65,
    hombros:  80,
    pierna:   20,
    core:     50,
  },
  weekHistory: [
    { fecha: '2026-05-04', duracionMin: 45, calorias: 320 },
    { fecha: '2026-05-05', duracionMin: 55, calorias: 410 },
    { fecha: '2026-05-06', duracionMin: 38, calorias: 275 },
  ],
  accentColor: '#7c6aff',
  preferences: { reminders: false },
  goals: { daysPerWeek: 4, goal: 'Ganar músculo' },
  userStats: { peso: null, estatura: null, edad: null, genero: 'Masculino' },
  prs: [
    {
      id: 1,
      exerciseName: 'Sentadilla',
      history: [
        { date: '2026-03-01', weight: 60 },
        { date: '2026-03-15', weight: 65 },
        { date: '2026-04-01', weight: 70 },
        { date: '2026-04-20', weight: 75 },
        { date: '2026-05-05', weight: 80 },
      ],
    },
    {
      id: 2,
      exerciseName: 'Press Banca',
      history: [
        { date: '2026-03-01', weight: 50 },
        { date: '2026-03-20', weight: 55 },
        { date: '2026-04-10', weight: 60 },
        { date: '2026-05-01', weight: 65 },
      ],
    },
  ],
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem('fitflow_state')
    if (!saved) return defaultState
    const parsed = JSON.parse(saved)
    if (parsed.dataVersion !== DATA_VERSION) return defaultState
    const state = { ...defaultState, ...parsed }
    if (state.accentColor && state.accentColor !== '#7c6aff') {
      applyAccent(state.accentColor)
    }
    return state
  } catch {
    return defaultState
  }
}

export function AppProvider({ children }) {
  const [state, setState] = useState(loadFromStorage)

  useEffect(() => {
    localStorage.setItem('fitflow_state', JSON.stringify(state))
  }, [state])

  function updateState(partial) {
    setState(prev => ({ ...prev, ...partial }))
  }

  function addPlan(plan) {
    setState(prev => ({ ...prev, plans: [...prev.plans, plan] }))
  }

  function updatePlan(id, updated) {
    setState(prev => ({
      ...prev,
      plans: prev.plans.map(p => (p.id === id ? { ...p, ...updated } : p)),
    }))
  }

  function deletePlan(id) {
    setState(prev => ({ ...prev, plans: prev.plans.filter(p => p.id !== id) }))
  }

  function addPR(exerciseName, firstEntry) {
    const newPR = { id: Date.now(), exerciseName, history: firstEntry ? [firstEntry] : [] }
    setState(prev => ({ ...prev, prs: [...prev.prs, newPR] }))
  }

  function addPREntry(prId, entry) {
    setState(prev => ({
      ...prev,
      prs: prev.prs.map(pr => pr.id === prId ? { ...pr, history: [...pr.history, entry] } : pr),
    }))
  }

  return (
    <AppContext.Provider value={{ ...state, updateState, addPlan, updatePlan, deletePlan, addPR, addPREntry }}>
      {children}
    </AppContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
