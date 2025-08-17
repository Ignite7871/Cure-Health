"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ResultsDashboard } from "@/components/results-dashboard"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertTriangle } from "lucide-react"

export default function ResultsPage() {
  const router = useRouter()
  const [analysisResults, setAnalysisResults] = useState(null)
  const [submittedSymptoms, setSubmittedSymptoms] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get results from sessionStorage
    const results = sessionStorage.getItem("analysisResults")
    const symptoms = sessionStorage.getItem("submittedSymptoms")

    if (results && symptoms) {
      setAnalysisResults(JSON.parse(results))
      setSubmittedSymptoms(JSON.parse(symptoms))
    }

    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your health assessment...</p>
        </div>
      </div>
    )
  }

  if (!analysisResults || !submittedSymptoms) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
            <h2 className="text-xl font-semibold text-slate-800">No Results Found</h2>
            <p className="text-slate-600">
              We couldn't find your analysis results. Please complete the symptom assessment first.
            </p>
            <Button onClick={() => router.push("/")} className="bg-teal-600 hover:bg-teal-700">
              Start New Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/")} className="text-slate-600 hover:text-slate-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assessment
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Your Health Assessment Results</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Based on your symptoms, here's what our AI analysis suggests. Please review these results with a healthcare
            professional.
          </p>
        </div>

        <ResultsDashboard results={analysisResults} symptoms={submittedSymptoms} />
      </div>
    </div>
  )
}
