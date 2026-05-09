import { exercises } from '../data/exercises'
import ExerciseCard from '../components/ExerciseCard'
import './Exercises.css'

export default function Exercises() {
  return (
    <div className="exercises-page">
      <header className="exercises-header">
        <h1 className="exercises-title">Ejercicios</h1>
        <p className="exercises-subtitle">{exercises.length} movimientos disponibles</p>
      </header>

      <div className="exercises-list">
        {exercises.map(ex => (
          <ExerciseCard key={ex.id} exercise={ex} />
        ))}
      </div>
    </div>
  )
}
