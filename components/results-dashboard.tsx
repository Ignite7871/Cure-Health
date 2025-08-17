"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Heart,
  Activity,
  FileText,
  Phone,
  Calendar,
  TrendingUp,
  Shield,
  Stethoscope,
} from "lucide-react"

interface PredictedCondition {
  name: string
  confidence: number
  description: string
  urgency: "low" | "moderate" | "high" | "critical"
}

interface HealthRecommendation {
  type: "lifestyle" | "medical" | "emergency" | "followup"
  title: string
  description: string
  priority: number
}

interface AnalysisResult {
  predictedConditions: PredictedCondition[]
  riskLevel: "low" | "moderate" | "high" | "critical"
  recommendations: HealthRecommendation[]
  confidenceScore: number
  shouldSeekImmediateCare: boolean
  summary: string
}

interface SubmittedSymptoms {
  symptoms: Array<{
    id: string
    name: string
    severity: number
    duration: string
  }>
  overallSeverity: number
  additionalInfo?: string
  chronicConditions?: string
}

interface ResultsDashboardProps {
  results: AnalysisResult
  symptoms: SubmittedSymptoms
}

export function ResultsDashboard({ results, symptoms }: ResultsDashboardProps) {
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-700 bg-green-100 border-green-200"
      case "moderate":
        return "text-yellow-700 bg-yellow-100 border-yellow-200"
      case "high":
        return "text-orange-700 bg-orange-100 border-orange-200"
      case "critical":
        return "text-red-700 bg-red-100 border-red-200"
      default:
        return "text-slate-700 bg-slate-100 border-slate-200"
    }
  }

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "moderate":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-slate-600" />
    }
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "emergency":
        return <Phone className="h-5 w-5 text-red-600" />
      case "medical":
        return <Stethoscope className="h-5 w-5 text-blue-600" />
      case "followup":
        return <Calendar className="h-5 w-5 text-purple-600" />
      case "lifestyle":
        return <Heart className="h-5 w-5 text-green-600" />
      default:
        return <FileText className="h-5 w-5 text-slate-600" />
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Emergency Alert */}
      {results.shouldSeekImmediateCare && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Urgent:</strong> Based on your symptoms, we recommend seeking immediate medical attention. Please
            contact emergency services or visit the nearest emergency room.
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Card */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <TrendingUp className="h-5 w-5" />
            Assessment Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRiskLevelColor(results.riskLevel)}`}
              >
                <Shield className="h-4 w-4 mr-1" />
                {results.riskLevel.charAt(0).toUpperCase() + results.riskLevel.slice(1)} Risk
              </div>
              <p className="text-xs text-slate-600 mt-1">Overall Risk Level</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">{Math.round(results.confidenceScore * 100)}%</div>
              <p className="text-xs text-slate-600">Analysis Confidence</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">{results.predictedConditions.length}</div>
              <p className="text-xs text-slate-600">Possible Conditions</p>
            </div>
          </div>
          <p className="text-slate-700 leading-relaxed">{results.summary}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submitted Symptoms */}
        <Card className="border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Activity className="h-5 w-5" />
              Your Symptoms
            </CardTitle>
            <CardDescription className="text-blue-600">Symptoms you reported with severity levels</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {symptoms.symptoms.map((symptom) => (
              <div key={symptom.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">{symptom.name}</p>
                  <p className="text-sm text-slate-600">Duration: {symptom.duration.replace("-", " ")}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-800">{symptom.severity}/10</div>
                  <div className="w-16">
                    <Progress value={symptom.severity * 10} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-800">Overall Severity:</span>
                <span className="text-lg font-bold text-slate-800">{symptoms.overallSeverity}/10</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Predicted Conditions */}
        <Card className="border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Stethoscope className="h-5 w-5" />
              Possible Conditions
            </CardTitle>
            <CardDescription className="text-purple-600">
              AI-predicted conditions based on your symptoms
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {results.predictedConditions.map((condition, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-800">{condition.name}</h4>
                  <div className="flex items-center gap-2">
                    {getUrgencyIcon(condition.urgency)}
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {Math.round(condition.confidence)}% match
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-slate-600">{condition.description}</p>
                <div className="w-full">
                  <Progress value={condition.confidence} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="border-green-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Heart className="h-5 w-5" />
            Health Recommendations
          </CardTitle>
          <CardDescription className="text-green-600">
            Personalized recommendations based on your assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.recommendations.map((rec, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg space-y-3">
                <div className="flex items-start gap-3">
                  {getRecommendationIcon(rec.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-800">{rec.title}</h4>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          rec.priority >= 4
                            ? "border-red-200 text-red-700"
                            : rec.priority >= 3
                              ? "border-orange-200 text-orange-700"
                              : "border-slate-200 text-slate-700"
                        }`}
                      >
                        Priority {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{rec.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      {symptoms.additionalInfo && (
        <Card className="border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <FileText className="h-5 w-5" />
              Additional Information Provided
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 bg-slate-50 p-4 rounded-lg">{symptoms.additionalInfo}</p>
          </CardContent>
        </Card>
      )}

      {symptoms.chronicConditions && (
        <Card className="border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <FileText className="h-5 w-5" />
              Existing Medical Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 bg-slate-50 p-4 rounded-lg">{symptoms.chronicConditions}</p>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Important:</strong> This assessment is for informational purposes only and should not replace
          professional medical advice. Always consult with a qualified healthcare provider for proper diagnosis and
          treatment. If you're experiencing a medical emergency, call emergency services immediately.
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
        <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => window.print()}>
          <FileText className="h-4 w-4 mr-2" />
          Print Results
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            sessionStorage.clear()
            window.location.href = "/"
          }}
        >
          Start New Assessment
        </Button>
      </div>
    </div>
  )
}
