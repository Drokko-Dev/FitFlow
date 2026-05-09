import { createContext, useContext, useState, useEffect } from 'react'
import { muscleGroups } from '../data/exercises'

const AppContext = createContext(null)

const DATA_VERSION = 2

const defaultMuscleScores = Object.fromEntries(muscleGroups.map(m => [m, 0]))

const defaultState = {
  dataVersion: DATA_VERSION,
  userName: 'Atleta',
  userEmoji: '🔥',
  plan: [],
  muscleScores: {
    pecho: 72,
    espalda: 30,
    brazos: 65,
    hombros: 80,
    pierna: 20,
    core: 50,
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

  return (
    <AppContext.Provider value={{ ...state, updateState }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
