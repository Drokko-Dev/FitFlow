export default function ExerciseCard({ exercise }) {
  return (
    <div className="px-4 py-4 rounded-2xl bg-card border border-border mb-2 font-body text-[#f0eeff]">
      {exercise?.icon} {exercise?.name}
    </div>
  )
}
