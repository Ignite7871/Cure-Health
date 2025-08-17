import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { AIHealthAnalyzer, type AnalysisInput } from "@/lib/ai-analysis"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { symptoms, overallSeverity, additionalInfo, chronicConditions, userProfile } = body

    // Validate input
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return NextResponse.json({ error: "Symptoms are required" }, { status: 400 })
    }

    if (typeof overallSeverity !== "number" || overallSeverity < 1 || overallSeverity > 10) {
      return NextResponse.json({ error: "Overall severity must be between 1 and 10" }, { status: 400 })
    }

    // Prepare analysis input
    const analysisInput: AnalysisInput = {
      symptoms,
      overallSeverity,
      additionalInfo,
      chronicConditions,
      age: userProfile?.age,
      gender: userProfile?.gender,
    }

    // Perform AI analysis
    const analysisResult = AIHealthAnalyzer.analyzeSymptoms(analysisInput)

    // Get Supabase client
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Use authenticated user ID or fallback to mock for unauthenticated users
    const userId = user?.id || "00000000-0000-0000-0000-000000000000"

    try {
      // Store symptom assessment in database
      const { data: assessmentData, error: assessmentError } = await supabase
        .from("symptom_assessments")
        .insert({
          user_id: userId,
          symptoms: symptoms,
          duration: symptoms[0]?.duration || "unknown",
          severity_level: overallSeverity,
          additional_notes: additionalInfo || null,
        })
        .select()
        .single()

      if (assessmentError) {
        console.error("Error storing assessment:", assessmentError)
        // Continue with analysis even if storage fails
      }

      // Store AI analysis results
      if (assessmentData) {
        const { error: analysisError } = await supabase.from("ai_analysis_results").insert({
          assessment_id: assessmentData.id,
          predicted_conditions: analysisResult.predictedConditions,
          risk_level: analysisResult.riskLevel,
          recommendations: analysisResult.recommendations,
          confidence_score: analysisResult.confidenceScore,
          model_version: "1.0.0",
        })

        if (analysisError) {
          console.error("Error storing analysis results:", analysisError)
        }

        // Store individual recommendations
        const recommendationInserts = analysisResult.recommendations.map((rec) => ({
          user_id: userId,
          analysis_id: null, // Will be updated after analysis is stored
          recommendation_type: rec.type,
          title: rec.title,
          description: rec.description,
          priority: rec.priority,
        }))

        const { error: recError } = await supabase.from("health_recommendations").insert(recommendationInserts)

        if (recError) {
          console.error("Error storing recommendations:", recError)
        }
      }
    } catch (dbError) {
      console.error("Database operation failed:", dbError)
      // Continue with analysis response even if database operations fail
    }

    // Return analysis results
    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze symptoms. Please try again." }, { status: 500 })
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "AI Health Analysis API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  })
}
