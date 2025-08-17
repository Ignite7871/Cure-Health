-- Insert sample medical conditions for reference
INSERT INTO medical_conditions (user_id, condition_name, severity, notes) VALUES
  -- These will be inserted when users sign up and add their conditions
  -- This is just a reference for common conditions
  (gen_random_uuid(), 'Hypertension', 'moderate', 'Sample condition - will be replaced by actual user data'),
  (gen_random_uuid(), 'Diabetes Type 2', 'mild', 'Sample condition - will be replaced by actual user data'),
  (gen_random_uuid(), 'Asthma', 'moderate', 'Sample condition - will be replaced by actual user data')
ON CONFLICT DO NOTHING;

-- Note: In production, this sample data should be removed
-- This is just for development and testing purposes
