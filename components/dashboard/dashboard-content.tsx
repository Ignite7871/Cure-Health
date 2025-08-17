"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { signOut } from "@/lib/actions"
import { User, Activity, TrendingUp, Calendar, LogOut, Plus, FileText, Shield } from "lucide-react"
import Link from "next/link"

interface Assessment {
  id: string
  assessment_date: string
  symptoms: any[]
  severity_level: number
  ai_analysis_results?: {
    risk_level: string
    confidence_score: number
    predicted_conditions: any[]
  }[]
}

interface DashboardContentProps {
  user: {
    id: string
    email?: string
    user_metadata?: {
      full_name?: string
    }
  }
  assessments: Assessment[]
}

export function DashboardContent({ user, assessments }: DashboardContentProps) {
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-700 border-green-200"
      case "moderate":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "critical":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              Welcome back, {user.user_metadata?.full_name || user.email?.split("@")[0]}
            </h1>
            <p className="text-lg text-slate-600">Your personal health assessment dashboard</p>
          </div>
          <form action={signOut}>
            <Button
              type="submit"
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-100 bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </form>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-teal-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-blue-50">
              <CardTitle className="flex items-center gap-2 text-teal-800">
                <Plus className="h-5 w-5" />
                New Assessment
              </CardTitle>
              <CardDescription className="text-teal-600">Start a new symptom analysis</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Link href="/">
                <Button className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700">
                  Begin Assessment
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Activity className="h-5 w-5" />
                Total Assessments
              </CardTitle>
              <CardDescription className="text-blue-600">Your health tracking history</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-slate-800">{assessments.length}</div>
              <p className="text-sm text-slate-600">Completed assessments</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
              <CardDescription className="text-purple-600">Manage your account</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Button
                variant="outline"
                className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Assessments */}
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <TrendingUp className="h-5 w-5" />
              Recent Health Assessments
            </CardTitle>
            <CardDescription className="text-slate-600">Your latest symptom analyses and results</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {assessments.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-800 mb-2">No assessments yet</h3>
                <p className="text-slate-600 mb-4">Start your first health assessment to see results here.</p>
                <Link href="/">
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Start Assessment
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {assessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-600">
                          {new Date(assessment.assessment_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {assessment.ai_analysis_results?.[0] && (
                        <Badge className={`border ${getRiskLevelColor(assessment.ai_analysis_results[0].risk_level)}`}>
                          <Shield className="h-3 w-3 mr-1" />
                          {assessment.ai_analysis_results[0].risk_level} risk
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-slate-700">Symptoms:</span>
                        <p className="text-slate-600">{assessment.symptoms.length} reported</p>
                      </div>
                      <div>
                        <span className="font-medium text-slate-700">Severity:</span>
                        <p className="text-slate-600">{assessment.severity_level}/10</p>
                      </div>
                      {assessment.ai_analysis_results?.[0] && (
                        <div>
                          <span className="font-medium text-slate-700">Confidence:</span>
                          <p className="text-slate-600">
                            {Math.round(assessment.ai_analysis_results[0].confidence_score * 100)}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
