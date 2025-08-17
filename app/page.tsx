import { createClient } from "@/lib/supabase/server"
import { SymptomChecker } from "@/components/symptom-checker"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { User, LogIn } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Auth Status */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">AI Healthcare Assistant</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Get personalized health insights and recommendations based on your symptoms. Our AI-powered system
              provides preliminary assessments to help guide your healthcare decisions.
            </p>
          </div>

          <div className="ml-8">
            {user ? (
              <Card className="border-teal-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {user.user_metadata?.full_name || user.email?.split("@")[0]}
                      </p>
                      <Link href="/dashboard">
                        <Button variant="link" className="p-0 h-auto text-xs text-teal-600 hover:text-teal-700">
                          View Dashboard
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex gap-2">
                <Link href="/auth/login">
                  <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50 bg-transparent">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <SymptomChecker />
      </div>
    </main>
  )
}
