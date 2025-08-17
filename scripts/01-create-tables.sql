-- Create users table for additional user profile information
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create medical_conditions table for tracking user's existing conditions
CREATE TABLE IF NOT EXISTS medical_conditions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  condition_name TEXT NOT NULL,
  diagnosed_date DATE,
  severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create symptom_assessments table for storing user symptom reports
CREATE TABLE IF NOT EXISTS symptom_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  symptoms JSONB NOT NULL, -- Store array of symptoms with severity
  duration TEXT, -- How long symptoms have been present
  severity_level INTEGER CHECK (severity_level BETWEEN 1 AND 10),
  additional_notes TEXT,
  assessment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_analysis_results table for storing ML model predictions
CREATE TABLE IF NOT EXISTS ai_analysis_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID REFERENCES symptom_assessments(id) ON DELETE CASCADE NOT NULL,
  predicted_conditions JSONB NOT NULL, -- Array of possible conditions with confidence scores
  risk_level TEXT CHECK (risk_level IN ('low', 'moderate', 'high', 'critical')) NOT NULL,
  recommendations JSONB NOT NULL, -- Array of health recommendations
  confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0 AND 1),
  model_version TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health_recommendations table for storing personalized advice
CREATE TABLE IF NOT EXISTS health_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  analysis_id UUID REFERENCES ai_analysis_results(id) ON DELETE CASCADE,
  recommendation_type TEXT CHECK (recommendation_type IN ('lifestyle', 'medical', 'emergency', 'followup')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority INTEGER CHECK (priority BETWEEN 1 AND 5) DEFAULT 3,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_medical_conditions_user_id ON medical_conditions(user_id);
CREATE INDEX IF NOT EXISTS idx_symptom_assessments_user_id ON symptom_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_symptom_assessments_date ON symptom_assessments(assessment_date);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_results_assessment_id ON ai_analysis_results(assessment_id);
CREATE INDEX IF NOT EXISTS idx_health_recommendations_user_id ON health_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_health_recommendations_unread ON health_recommendations(user_id, is_read);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_recommendations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for medical_conditions table
CREATE POLICY "Users can view own medical conditions" ON medical_conditions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own medical conditions" ON medical_conditions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medical conditions" ON medical_conditions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own medical conditions" ON medical_conditions
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for symptom_assessments table
CREATE POLICY "Users can view own symptom assessments" ON symptom_assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own symptom assessments" ON symptom_assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for ai_analysis_results table
CREATE POLICY "Users can view own analysis results" ON ai_analysis_results
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM symptom_assessments WHERE id = assessment_id)
  );

CREATE POLICY "System can insert analysis results" ON ai_analysis_results
  FOR INSERT WITH CHECK (true); -- Allow system to insert results

-- Create RLS policies for health_recommendations table
CREATE POLICY "Users can view own recommendations" ON health_recommendations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendations" ON health_recommendations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert recommendations" ON health_recommendations
  FOR INSERT WITH CHECK (true); -- Allow system to insert recommendations
