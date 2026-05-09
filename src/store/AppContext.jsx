import { createContext, useContext, useState, useEffect } from 'react'
import { exercises } from '../data/exercises'

const AppContext = createContext(null)

const DATA_VERSION = 3

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
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem('fitflow_state')
    if (!saved) return defaultState
    const parsed = JSON.parse(saved)
    if (parsed.dataVersion !== DATA_VERSION) return defaultState
    return { ...defaultState, ...parsed }
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

  return (
    <AppContext.Provider value={{ ...state, updateState, addPlan, updatePlan, deletePlan }}>
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
