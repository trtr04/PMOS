import { ensureAnonymousSession, supabase } from "@/lib/supabase";

export type HealthTemplate = { id: string; kind: "nutrition" | "movement" | "mood" | "sleep" | "custom"; name: string; description: string | null; icon: string; recordMode: "toggle" | "value" | "choice"; unit: string | null; goalValue: number | null; scoreValue: number; sortOrder: number };
export type HealthCheckin = { templateId: string; completed: boolean; numericValue: number | null; textValue: string | null; note: string | null; earnedScore: number };
export type Dashboard = { profile: { displayName: string | null; dailySleepTarget: number; dailyMovementTarget: number } | null; templates: HealthTemplate[]; checkins: HealthCheckin[]; activeCycle: { id: string; startDate: string } | null; symptoms: { pain: string | null; breastSwelling: string | null; acne: string | null } | null; metric: { healthScore: number; completionRate: number; completedCount: number; totalCount: number } };

const presets = [
  { kind: "nutrition", name: "低糖 & 抗炎饮食", description: "记录今日饮食选择与维生素补充", icon: "Apple", record_mode: "choice", score_value: 30, sort_order: 1 },
  { kind: "movement", name: "运动记录", description: "轻运动也算，填写活动时长", icon: "Dumbbell", record_mode: "value", unit: "分钟", goal_value: 30, score_value: 25, sort_order: 2 },
  { kind: "mood", name: "情绪记录", description: "用一个词记录今天的感受", icon: "Smile", record_mode: "choice", score_value: 20, sort_order: 3 },
  { kind: "sleep", name: "睡眠记录", description: "填写昨夜实际睡眠时长", icon: "Moon", record_mode: "value", unit: "小时", goal_value: 8, score_value: 25, sort_order: 4 },
] as const;
const mapTemplate = (row: any): HealthTemplate => ({ id: row.id, kind: row.kind, name: row.name, description: row.description, icon: row.icon, recordMode: row.record_mode, unit: row.unit, goalValue: row.goal_value ? Number(row.goal_value) : null, scoreValue: row.score_value, sortOrder: row.sort_order });

async function workspace() {
  const user = await ensureAnonymousSession();
  await supabase.from("profiles").upsert({ id: user.id }, { onConflict: "id", ignoreDuplicates: true });
  const { data: existing, error } = await supabase.from("habit_templates").select("id").eq("user_id", user.id).limit(1);
  if (error) throw error;
  if (!existing?.length) { const { error: seedError } = await supabase.from("habit_templates").insert(presets.map(p => ({ ...p, user_id: user.id, source: "preset", is_active: true, metadata: {} }))); if (seedError) throw seedError; }
  return user;
}
export async function getDashboard(date: string): Promise<Dashboard> {
  const user = await workspace();
  const [{ data: profile }, { data: templates, error: templateError }, { data: entries, error: entryError }, { data: cycles, error: cycleError }, { data: symptoms, error: symptomError }] = await Promise.all([
    supabase.from("profiles").select("display_name,daily_sleep_target,daily_movement_target").eq("id", user.id).maybeSingle(),
    supabase.from("habit_templates").select("*").eq("user_id", user.id).eq("is_active", true).order("sort_order"),
    supabase.from("daily_checkins").select("*").eq("user_id", user.id).eq("record_date", date),
    supabase.from("menstrual_cycles").select("id,start_date").eq("user_id", user.id).is("end_date", null).limit(1),
    supabase.from("cycle_symptoms").select("pain,breast_swelling,acne").eq("user_id", user.id).eq("record_date", date).maybeSingle(),
  ]);
  if (templateError || entryError || cycleError || symptomError) throw templateError || entryError || cycleError || symptomError;
  const checkins = (entries ?? []).map((e: any) => ({ templateId: e.template_id, completed: e.completed, numericValue: e.numeric_value ? Number(e.numeric_value) : null, textValue: e.text_value, note: e.note, earnedScore: e.earned_score }));
  const complete = checkins.filter(c => c.completed); const total = templates?.length ?? 0; const score = Math.min(100, complete.reduce((n, c) => n + (templates ?? []).find((t: any) => t.id === c.templateId)?.score_value || n, 0));
  return { profile: profile ? { displayName: profile.display_name, dailySleepTarget: profile.daily_sleep_target, dailyMovementTarget: profile.daily_movement_target } : null, templates: (templates ?? []).map(mapTemplate), checkins, activeCycle: cycles?.[0] ? { id: cycles[0].id, startDate: cycles[0].start_date } : null, symptoms: symptoms ? { pain: symptoms.pain, breastSwelling: symptoms.breast_swelling, acne: symptoms.acne } : null, metric: { healthScore: score, completionRate: total ? Math.round(complete.length / total * 100) : 0, completedCount: complete.length, totalCount: total } };
}
export async function updateProfile(input: { displayName: string; dailySleepTarget: number; dailyMovementTarget: number }) { const user = await workspace(); const { error } = await supabase.from("profiles").upsert({ id:user.id, display_name:input.displayName, daily_sleep_target:input.dailySleepTarget, daily_movement_target:input.dailyMovementTarget }); if (error) throw error; }
export async function saveCheckin(input: { templateId: string; recordDate: string; completed: boolean; numericValue?: number | null; textValue?: string | null; note?: string | null; earnedScore: number }) { const user = await ensureAnonymousSession(); const { error } = await supabase.from("daily_checkins").upsert({ user_id:user.id, template_id:input.templateId, record_date:input.recordDate, completed:input.completed, numeric_value:input.numericValue, text_value:input.textValue, note:input.note, earned_score:input.earnedScore, completed_at:input.completed ? new Date().toISOString() : null }, { onConflict:"user_id,template_id,record_date" }); if(error) throw error; }
export async function addCustomTemplate(input: { name:string; recordMode:"toggle"|"value"; unit?:string; goalValue?:number }) { const user=await workspace(); const { data, error }=await supabase.from("habit_templates").select("sort_order").eq("user_id",user.id).order("sort_order",{ascending:false}).limit(1); if(error) throw error; const {error: insertError}=await supabase.from("habit_templates").insert({user_id:user.id,source:"custom",kind:"custom",name:input.name,description:input.recordMode==="value"?"记录一个属于你的数值目标":"一个属于你的温柔小习惯",icon:"Sparkles",record_mode:input.recordMode,unit:input.unit??null,goal_value:input.goalValue??null,score_value:10,sort_order:(data?.[0]?.sort_order??0)+1,metadata:{}}); if(insertError) throw insertError; }
export async function startPeriod(date:string) { const user=await ensureAnonymousSession(); const {error}=await supabase.from("menstrual_cycles").insert({user_id:user.id,start_date:date}); if(error && error.code!=="23505") throw error; }
export async function endPeriod(date:string) { const user=await ensureAnonymousSession(); const {error}=await supabase.from("menstrual_cycles").update({end_date:date}).eq("user_id",user.id).is("end_date",null); if(error) throw error; }
export async function saveSymptoms(input:{recordDate:string;pain?:string;breastSwelling?:string;acne?:string}) { const user=await ensureAnonymousSession(); const { data: cycle }=await supabase.from("menstrual_cycles").select("id").eq("user_id",user.id).is("end_date",null).maybeSingle(); const {error}=await supabase.from("cycle_symptoms").upsert({user_id:user.id,cycle_id:cycle?.id??null,record_date:input.recordDate,pain:input.pain??null,breast_swelling:input.breastSwelling??null,acne:input.acne??null},{onConflict:"user_id,record_date"}); if(error) throw error; }
