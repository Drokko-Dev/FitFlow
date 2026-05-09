import { useState } from 'react'
import PlanList    from './exercises/PlanList'
import WorkoutMode from './exercises/WorkoutMode'
import PlanEditor  from './exercises/PlanEditor'

export default function Exercises() {
  const [view,   setView]   = useState('list')
  const [planId, setPlanId] = useState(null)

  if (view === 'workout') {
    return <WorkoutMode key={planId} planId={planId} onClose={() => setView('list')} />
  }

  if (view === 'editor') {
    return <PlanEditor planId={planId} onClose={() => setView('list')} />
  }

  return (
    <PlanList
      onWorkout={id => { setPlanId(id);   setView('workout') }}
      onEdit={id    => { setPlanId(id);   setView('editor')  }}
      onCreate={()  => { setPlanId(null); setView('editor')  }}
    />
  )
}
