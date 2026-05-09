import { exercises } from '../data/exercises'
import ExerciseCard from '../components/ExerciseCard'

export default function Exercises() {
  return (
    <div className="pb-4">
      <header className="px-5 pt-[52px] pb-5">
        <h1 className="font-display text-[28px] font-extrabold text-[#f0eeff] mb-1">Ejercicios</h1>
        <p className="text-[13px] text-[#8b87a8]">{exercises.length} movimientos disponibles</p>
      </header>

      <div className="px-5">
        {exercises.map(ex => (
          <ExerciseCard key={ex.id} exercise={ex} />
        ))}
      </div>
    </div>
  )
}
