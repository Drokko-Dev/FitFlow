import { supabase } from '../lib/supabase'

// ─── Profile ─────────────────────────────────────────────────────────────────

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  // PGRST116 = no rows found (new user without profile yet)
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function updateProfile(userId, data) {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...data }, { onConflict: 'id' })
  if (error) throw error
}

// ─── Plans ────────────────────────────────────────────────────────────────────

export async function fetchPlans(userId) {
  const { data, error } = await supabase
    .from('plans')
    .select('id, name, exercises')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createPlan(userId, plan) {
  const { error } = await supabase
    .from('plans')
    .insert({ id: plan.id, user_id: userId, name: plan.name, exercises: plan.exercises })
  if (error) throw error
}

export async function updatePlan(id, plan) {
  const { error } = await supabase
    .from('plans')
    .update({ name: plan.name, exercises: plan.exercises })
    .eq('id', id)
  if (error) throw error
}

export async function deletePlan(id) {
  const { error } = await supabase
    .from('plans')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ─── Sessions ─────────────────────────────────────────────────────────────────
// Table columns: date, duration_min, calories, plan_name, exercises

export async function fetchSessions(userId) {
  const { data, error } = await supabase
    .from('sessions')
    .select('date, duration_min, calories, plan_name, exercises, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(s => ({
    fecha:       s.date,
    duracionMin: s.duration_min,
    calorias:    s.calories,
    planName:    s.plan_name ?? null,
    exercises:   s.exercises ?? [],
    createdAt:   s.created_at ?? null,
  }))
}

// Returns the new session's UUID so muscle_history can reference it
export async function createSession(userId, session) {
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      user_id:      userId,
      date:         session.fecha,
      duration_min: session.duracionMin,
      calories:     session.calorias,
      plan_name:    session.planName ?? null,
      exercises:    session.exercises ?? null,
    })
    .select('id')
    .single()
  if (error) throw error
  return data.id
}

// ─── Muscle history ───────────────────────────────────────────────────────────

// Inserts one row per muscle group worked in the session.
// exercises: the plan's exercise array [{ muscle, sets, ... }]
export async function insertMuscleHistory(userId, sessionId, exercises, date) {
  const totals = {}
  for (const ex of exercises) {
    if (ex.muscle) totals[ex.muscle] = (totals[ex.muscle] ?? 0) + (ex.sets ?? 0)
  }
  const rows = Object.entries(totals).map(([muscle, sets]) => ({
    user_id:    userId,
    session_id: sessionId,
    muscle,
    sets,
    date,
  }))
  if (!rows.length) return
  const { error } = await supabase.from('muscle_history').insert(rows)
  if (error) throw error
}

// Calculates muscle scores from the last 14 days of muscle_history.
// Score = min(100, round(totalSets / 15 * 100)) per muscle group.
export async function calculateMuscleScores(userId) {
  const since = new Date()
  since.setDate(since.getDate() - 14)
  const sinceStr = since.toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from('muscle_history')
    .select('muscle, sets')
    .eq('user_id', userId)
    .gte('date', sinceStr)
  if (error) throw error

  const MUSCLES  = ['pecho', 'espalda', 'brazos', 'hombros', 'pierna', 'core']
  const OBJETIVO = 15

  const totals = {}
  for (const row of (data ?? [])) {
    totals[row.muscle] = (totals[row.muscle] ?? 0) + row.sets
  }

  const scores = {}
  for (const m of MUSCLES) {
    scores[m] = Math.min(100, Math.round(((totals[m] ?? 0) / OBJETIVO) * 100))
  }
  return scores
}

// ─── Personal records ─────────────────────────────────────────────────────────

export async function fetchPRs(userId) {
  const { data, error } = await supabase
    .from('personal_records')
    .select('id, exercise_name, history')
    .eq('user_id', userId)
  if (error) throw error
  return (data ?? []).map(r => ({
    id:           r.id,
    exerciseName: r.exercise_name,
    history:      r.history ?? [],
  }))
}

export async function createPR(userId, pr) {
  const { error } = await supabase
    .from('personal_records')
    .insert({
      id:            pr.id,
      user_id:       userId,
      exercise_name: pr.exerciseName,
      history:       pr.history,
    })
  if (error) throw error
}

export async function updatePR(id, history) {
  const { error } = await supabase
    .from('personal_records')
    .update({ history })
    .eq('id', id)
  if (error) throw error
}
