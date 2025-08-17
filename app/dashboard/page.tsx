import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {
  // If Supabase is not configured, show setup message directly
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50">
        <h1 className="text-2xl font-bold mb-4 text-slate-800">Connect Supabase to get started</h1>
      </div>
    )
  }

  // Get the user from the server
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If no user, redirect to login
  if (!user) {
    redirect("/auth/login")
  }

  // Get user's recent assessments
  const { data: assessments } = await supabase
    .from("symptom_assessments")
    .select(`
      *,
      ai_analysis_results (
        risk_level,
        confidence_score,
        predicted_conditions
      )
    `)
    .eq("user_id", user.id)
    .order("assessment_date", { ascending: false })
    .limit(5)

  return <DashboardContent user={user} assessments={assessments || []} />
}
