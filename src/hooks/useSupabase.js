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
// Table columns: date, duration_min, calories, plan_name

export async function fetchSessions(userId) {
  const { data, error } = await supabase
    .from('sessions')
    .select('date, duration_min, calories')
    .eq('user_id', userId)
    .order('date', { ascending: false })
  if (error) throw error
  return (data ?? []).map(s => ({
    fecha:       s.date,
    duracionMin: s.duration_min,
    calorias:    s.calories,
  }))
}

export async function createSession(userId, session) {
  const { error } = await supabase
    .from('sessions')
    .insert({
      user_id:      userId,
      date:         session.fecha,
      duration_min: session.duracionMin,
      calories:     session.calorias,
      plan_name:    session.planName ?? null,
    })
  if (error) throw error
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
