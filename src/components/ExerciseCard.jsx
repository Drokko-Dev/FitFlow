// Placeholder — logic pending
export default function ExerciseCard({ exercise }) {
  return (
    <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', marginBottom: '8px', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>
      {exercise?.icon} {exercise?.name}
    </div>
  )
}
