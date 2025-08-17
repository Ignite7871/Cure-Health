// AI Analysis Engine for Healthcare Assistant
export interface SymptomData {
  id: string
  name: string
  severity: number
  duration: string
}

export interface AnalysisInput {
  symptoms: SymptomData[]
  overallSeverity: number
  additionalInfo?: string
  chronicConditions?: string
  age?: number
  gender?: string
}

export interface PredictedCondition {
  name: string
  confidence: number
  description: string
  urgency: "low" | "moderate" | "high" | "critical"
}

export interface HealthRecommendation {
  type: "lifestyle" | "medical" | "emergency" | "followup"
  title: string
  description: string
  priority: number
}

export interface AnalysisResult {
  predictedConditions: PredictedCondition[]
  riskLevel: "low" | "moderate" | "high" | "critical"
  recommendations: HealthRecommendation[]
  confidenceScore: number
  shouldSeekImmediateCare: boolean
  summary: string
}

// Symptom-to-condition mapping database
const symptomConditionMap: Record<string, { conditions: string[]; weights: number[] }> = {
  fever: {
    conditions: ["Common Cold", "Flu", "COVID-19", "Bacterial Infection"],
    weights: [0.3, 0.4, 0.3, 0.2],
  },
  cough: {
    conditions: ["Common Cold", "Flu", "COVID-19", "Bronchitis", "Pneumonia"],
    weights: [0.4, 0.3, 0.4, 0.3, 0.2],
  },
  headache: {
    conditions: ["Tension Headache", "Migraine", "Flu", "Dehydration", "Stress"],
    weights: [0.5, 0.4, 0.2, 0.3, 0.4],
  },
  "sore throat": {
    conditions: ["Common Cold", "Strep Throat", "Flu", "Viral Pharyngitis"],
    weights: [0.4, 0.3, 0.2, 0.4],
  },
  "shortness of breath": {
    conditions: ["Asthma", "Pneumonia", "Heart Condition", "Anxiety", "COVID-19"],
    weights: [0.4, 0.3, 0.2, 0.3, 0.3],
  },
  "chest pain": {
    conditions: ["Heart Condition", "Muscle Strain", "Anxiety", "Pneumonia"],
    weights: [0.3, 0.4, 0.3, 0.2],
  },
  nausea: {
    conditions: ["Food Poisoning", "Gastroenteritis", "Migraine", "Pregnancy"],
    weights: [0.4, 0.4, 0.2, 0.3],
  },
  fatigue: {
    conditions: ["Flu", "Anemia", "Depression", "Sleep Disorder", "Thyroid Issues"],
    weights: [0.3, 0.2, 0.3, 0.4, 0.2],
  },
  dizziness: {
    conditions: ["Low Blood Pressure", "Dehydration", "Inner Ear Problem", "Anemia"],
    weights: [0.3, 0.4, 0.3, 0.2],
  },
  "abdominal pain": {
    conditions: ["Gastroenteritis", "Appendicitis", "Food Poisoning", "IBS"],
    weights: [0.4, 0.2, 0.3, 0.3],
  },
}

// Emergency symptoms that require immediate attention
const emergencySymptoms = [
  "severe chest pain",
  "difficulty breathing",
  "severe abdominal pain",
  "loss of consciousness",
  "severe bleeding",
  "signs of stroke",
  "severe allergic reaction",
]

export class AIHealthAnalyzer {
  static analyzeSymptoms(input: AnalysisInput): AnalysisResult {
    const { symptoms, overallSeverity, additionalInfo, chronicConditions } = input

    // Check for emergency symptoms
    const hasEmergencySymptoms = this.checkEmergencySymptoms(symptoms, additionalInfo)

    // Calculate predicted conditions
    const predictedConditions = this.calculatePredictedConditions(symptoms, overallSeverity)

    // Determine risk level
    const riskLevel = this.calculateRiskLevel(symptoms, overallSeverity, predictedConditions, hasEmergencySymptoms)

    // Generate recommendations
    const recommendations = this.generateRecommendations(predictedConditions, riskLevel, chronicConditions)

    // Calculate overall confidence
    const confidenceScore = this.calculateConfidenceScore(symptoms, predictedConditions)

    // Generate summary
    const summary = this.generateSummary(predictedConditions, riskLevel, symptoms.length)

    return {
      predictedConditions,
      riskLevel,
      recommendations,
      confidenceScore,
      shouldSeekImmediateCare: hasEmergencySymptoms || riskLevel === "critical",
      summary,
    }
  }

  private static checkEmergencySymptoms(symptoms: SymptomData[], additionalInfo?: string): boolean {
    const symptomNames = symptoms.map((s) => s.name.toLowerCase())
    const infoText = (additionalInfo || "").toLowerCase()

    return (
      emergencySymptoms.some(
        (emergency) => symptomNames.some((symptom) => symptom.includes(emergency)) || infoText.includes(emergency),
      ) || symptoms.some((s) => s.severity >= 9)
    )
  }

  private static calculatePredictedConditions(symptoms: SymptomData[], overallSeverity: number): PredictedCondition[] {
    const conditionScores: Record<string, number> = {}

    // Calculate scores based on symptoms
    symptoms.forEach((symptom) => {
      const mapping = symptomConditionMap[symptom.name.toLowerCase()]
      if (mapping) {
        mapping.conditions.forEach((condition, index) => {
          const weight = mapping.weights[index]
          const severityMultiplier = symptom.severity / 10
          const score = weight * severityMultiplier

          conditionScores[condition] = (conditionScores[condition] || 0) + score
        })
      }
    })

    // Convert to predicted conditions and sort by confidence
    const conditions = Object.entries(conditionScores)
      .map(([name, score]) => ({
        name,
        confidence: Math.min(score * 100, 95), // Cap at 95%
        description: this.getConditionDescription(name),
        urgency: this.getConditionUrgency(name, score, overallSeverity),
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5) // Top 5 conditions

    return conditions
  }

  private static calculateRiskLevel(
    symptoms: SymptomData[],
    overallSeverity: number,
    conditions: PredictedCondition[],
    hasEmergency: boolean,
  ): "low" | "moderate" | "high" | "critical" {
    if (hasEmergency) return "critical"

    const avgSeverity = symptoms.reduce((sum, s) => sum + s.severity, 0) / symptoms.length
    const maxConfidence = Math.max(...conditions.map((c) => c.confidence))
    const hasHighUrgency = conditions.some((c) => c.urgency === "high" || c.urgency === "critical")

    if (overallSeverity >= 8 || avgSeverity >= 8 || hasHighUrgency) return "high"
    if (overallSeverity >= 6 || avgSeverity >= 6 || maxConfidence >= 70) return "moderate"
    return "low"
  }

  private static generateRecommendations(
    conditions: PredictedCondition[],
    riskLevel: string,
    chronicConditions?: string,
  ): HealthRecommendation[] {
    const recommendations: HealthRecommendation[] = []

    // Emergency recommendations
    if (riskLevel === "critical") {
      recommendations.push({
        type: "emergency",
        title: "Seek Immediate Medical Attention",
        description:
          "Your symptoms may indicate a serious condition. Please visit the emergency room or call emergency services immediately.",
        priority: 5,
      })
    }

    // Medical follow-up recommendations
    if (riskLevel === "high" || riskLevel === "moderate") {
      recommendations.push({
        type: "medical",
        title: "Schedule Medical Consultation",
        description:
          "We recommend scheduling an appointment with your healthcare provider within 24-48 hours to discuss your symptoms.",
        priority: 4,
      })
    }

    // Condition-specific recommendations
    conditions.slice(0, 2).forEach((condition) => {
      const conditionRecs = this.getConditionSpecificRecommendations(condition.name)
      recommendations.push(...conditionRecs)
    })

    // General wellness recommendations
    recommendations.push({
      type: "lifestyle",
      title: "Rest and Hydration",
      description:
        "Ensure adequate rest and maintain proper hydration. Avoid strenuous activities until symptoms improve.",
      priority: 2,
    })

    // Chronic condition considerations
    if (chronicConditions) {
      recommendations.push({
        type: "followup",
        title: "Monitor Chronic Conditions",
        description:
          "Given your existing medical conditions, monitor your symptoms closely and consult with your regular healthcare provider.",
        priority: 3,
      })
    }

    return recommendations.sort((a, b) => b.priority - a.priority).slice(0, 6)
  }

  private static getConditionDescription(condition: string): string {
    const descriptions: Record<string, string> = {
      "Common Cold": "A viral infection affecting the upper respiratory tract",
      Flu: "Influenza - a viral infection that attacks the respiratory system",
      "COVID-19": "A respiratory illness caused by the SARS-CoV-2 virus",
      "Tension Headache": "The most common type of headache, often stress-related",
      Migraine: "A neurological condition causing severe headaches",
      "Strep Throat": "A bacterial infection causing throat pain and inflammation",
      Asthma: "A respiratory condition causing breathing difficulties",
      "Heart Condition": "Various conditions affecting heart function",
      Gastroenteritis: "Inflammation of the stomach and intestines",
    }
    return descriptions[condition] || "A medical condition that may require attention"
  }

  private static getConditionUrgency(
    condition: string,
    score: number,
    overallSeverity: number,
  ): "low" | "moderate" | "high" | "critical" {
    const highUrgencyConditions = ["Heart Condition", "Pneumonia", "Appendicitis"]
    const moderateUrgencyConditions = ["Strep Throat", "Bronchitis", "COVID-19"]

    if (highUrgencyConditions.includes(condition) || overallSeverity >= 8) return "high"
    if (moderateUrgencyConditions.includes(condition) || score >= 0.6) return "moderate"
    return "low"
  }

  private static getConditionSpecificRecommendations(condition: string): HealthRecommendation[] {
    const recommendations: Record<string, HealthRecommendation[]> = {
      "Common Cold": [
        {
          type: "lifestyle",
          title: "Cold Care",
          description: "Rest, drink warm fluids, and consider over-the-counter cold medications for symptom relief.",
          priority: 2,
        },
      ],
      Flu: [
        {
          type: "medical",
          title: "Flu Management",
          description: "Consider antiviral medications if within 48 hours of symptom onset. Rest and stay hydrated.",
          priority: 3,
        },
      ],
      "COVID-19": [
        {
          type: "medical",
          title: "COVID-19 Protocol",
          description:
            "Isolate yourself, get tested, and monitor symptoms. Seek medical care if breathing difficulties develop.",
          priority: 4,
        },
      ],
    }
    return recommendations[condition] || []
  }

  private static calculateConfidenceScore(symptoms: SymptomData[], conditions: PredictedCondition[]): number {
    if (symptoms.length === 0) return 0

    const symptomCoverage = symptoms.length >= 3 ? 0.8 : symptoms.length * 0.25
    const conditionConfidence = conditions.length > 0 ? conditions[0].confidence / 100 : 0
    const detailScore = symptoms.every((s) => s.severity > 0 && s.duration) ? 0.2 : 0.1

    return Math.min((symptomCoverage + conditionConfidence + detailScore) / 2, 0.95)
  }

  private static generateSummary(conditions: PredictedCondition[], riskLevel: string, symptomCount: number): string {
    const topCondition = conditions[0]?.name || "general symptoms"
    const riskText =
      riskLevel === "low"
        ? "low risk"
        : riskLevel === "moderate"
          ? "moderate concern"
          : riskLevel === "high"
            ? "significant concern"
            : "urgent attention needed"

    return `Based on your ${symptomCount} reported symptoms, the most likely condition appears to be ${topCondition}. This assessment indicates ${riskText}. Please review the recommendations below and consult with a healthcare provider as appropriate.`
  }
}
