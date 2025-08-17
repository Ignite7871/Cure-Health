"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Plus, X, Activity, Clock, User } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"

interface Symptom {
  id: string
  name: string
  severity: number
  duration: string
}

const commonSymptoms = [
  "Headache",
  "Fever",
  "Cough",
  "Sore throat",
  "Fatigue",
  "Nausea",
  "Dizziness",
  "Chest pain",
  "Shortness of breath",
  "Abdominal pain",
  "Joint pain",
  "Muscle aches",
  "Skin rash",
  "Loss of appetite",
]

const durationOptions = [
  { value: "less-than-day", label: "Less than a day" },
  { value: "1-3-days", label: "1-3 days" },
  { value: "4-7-days", label: "4-7 days" },
  { value: "1-2-weeks", label: "1-2 weeks" },
  { value: "more-than-2-weeks", label: "More than 2 weeks" },
]

export function SymptomChecker() {
  const router = useRouter()
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [customSymptom, setCustomSymptom] = useState("")
  const [overallSeverity, setOverallSeverity] = useState([5])
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [hasChronicConditions, setHasChronicConditions] = useState(false)
  const [chronicConditions, setChronicConditions] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const addSymptom = (symptomName: string) => {
    if (symptoms.find((s) => s.name.toLowerCase() === symptomName.toLowerCase())) {
      return // Symptom already exists
    }

    const newSymptom: Symptom = {
      id: Date.now().toString(),
      name: symptomName,
      severity: 5,
      duration: "1-3-days",
    }
    setSymptoms([...symptoms, newSymptom])
  }

  const removeSymptom = (id: string) => {
    setSymptoms(symptoms.filter((s) => s.id !== id))
  }

  const updateSymptom = (id: string, field: keyof Symptom, value: any) => {
    setSymptoms(symptoms.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const addCustomSymptom = () => {
    if (customSymptom.trim()) {
      addSymptom(customSymptom.trim())
      setCustomSymptom("")
    }
  }

  const handleSubmit = async () => {
    if (symptoms.length === 0) {
      setError("Please select at least one symptom")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/analyze-symptoms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symptoms,
          overallSeverity: overallSeverity[0],
          additionalInfo,
          chronicConditions: hasChronicConditions ? chronicConditions : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed")
      }

      // Store results in sessionStorage for the results page
      sessionStorage.setItem("analysisResults", JSON.stringify(data.analysis))
      sessionStorage.setItem(
        "submittedSymptoms",
        JSON.stringify({
          symptoms,
          overallSeverity: overallSeverity[0],
          additionalInfo,
          chronicConditions: hasChronicConditions ? chronicConditions : null,
        }),
      )

      // Navigate to results page
      router.push("/results")
    } catch (err) {
      console.error("Analysis error:", err)
      setError(err instanceof Error ? err.message : "Failed to analyze symptoms. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Personal Information Card */}
      <Card className="border-teal-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-blue-50">
          <CardTitle className="flex items-center gap-2 text-teal-800">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription className="text-teal-600">Help us provide more accurate assessments</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="chronic-conditions"
              checked={hasChronicConditions}
              onCheckedChange={setHasChronicConditions}
            />
            <Label htmlFor="chronic-conditions" className="text-sm font-medium">
              I have existing medical conditions
            </Label>
          </div>

          {hasChronicConditions && (
            <div className="space-y-2">
              <Label htmlFor="conditions" className="text-sm font-medium">
                Please list your medical conditions
              </Label>
              <Textarea
                id="conditions"
                placeholder="e.g., Diabetes, Hypertension, Asthma..."
                value={chronicConditions}
                onChange={(e) => setChronicConditions(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Symptom Selection Card */}
      <Card className="border-blue-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Activity className="h-5 w-5" />
            Select Your Symptoms
          </CardTitle>
          <CardDescription className="text-blue-600">Choose from common symptoms or add your own</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Common Symptoms */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Common Symptoms</Label>
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map((symptom) => (
                <Button
                  key={symptom}
                  variant={symptoms.find((s) => s.name === symptom) ? "default" : "outline"}
                  size="sm"
                  onClick={() => addSymptom(symptom)}
                  className={
                    symptoms.find((s) => s.name === symptom)
                      ? "bg-teal-600 hover:bg-teal-700"
                      : "border-teal-200 text-teal-700 hover:bg-teal-50"
                  }
                >
                  {symptom}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Symptom Input */}
          <div className="space-y-2">
            <Label htmlFor="custom-symptom" className="text-sm font-medium">
              Add Custom Symptom
            </Label>
            <div className="flex gap-2">
              <Input
                id="custom-symptom"
                placeholder="Describe your symptom..."
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addCustomSymptom()}
              />
              <Button onClick={addCustomSymptom} size="sm" className="bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Symptoms Details */}
      {symptoms.length > 0 && (
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Clock className="h-5 w-5" />
              Symptom Details
            </CardTitle>
            <CardDescription className="text-slate-600">Provide more details about each symptom</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {symptoms.map((symptom) => (
              <div key={symptom.id} className="p-4 border border-slate-200 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                    {symptom.name}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSymptom(symptom.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Severity (1-10): {symptom.severity}</Label>
                    <Slider
                      value={[symptom.severity]}
                      onValueChange={(value) => updateSymptom(symptom.id, "severity", value[0])}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Duration</Label>
                    <Select
                      value={symptom.duration}
                      onValueChange={(value) => updateSymptom(symptom.id, "duration", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {durationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Overall Assessment */}
      <Card className="border-amber-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <AlertCircle className="h-5 w-5" />
            Overall Assessment
          </CardTitle>
          <CardDescription className="text-amber-600">How would you rate your overall condition?</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Overall Severity (1-10): {overallSeverity[0]}</Label>
            <Slider
              value={overallSeverity}
              onValueChange={setOverallSeverity}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Mild</span>
              <span>Moderate</span>
              <span>Severe</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additional-info" className="text-sm font-medium">
              Additional Information (Optional)
            </Label>
            <Textarea
              id="additional-info"
              placeholder="Any other details about your symptoms, recent activities, or concerns..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Alert className="border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Medical Disclaimer:</strong> This tool provides preliminary health information only and is not a
          substitute for professional medical advice. Always consult with a healthcare provider for proper diagnosis and
          treatment.
        </AlertDescription>
      </Alert>

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={handleSubmit}
          disabled={symptoms.length === 0 || isLoading}
          size="lg"
          className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-medium"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing Symptoms...
            </>
          ) : (
            "Get AI Health Assessment"
          )}
        </Button>
      </div>
    </div>
  )
}
