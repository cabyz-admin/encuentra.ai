/*
  # Add Matching System

  1. New Tables
    - `matching_scores` - Stores compatibility scores between candidates and companies
    - `matching_preferences` - Stores user preferences for matching algorithm
    - `matching_filters` - Stores user filters for browsing
    - `matching_behavioral_data` - Stores user interaction data for improving matches
    - `matching_location_data` - Stores location-based matching preferences

  2. Security
    - Enable RLS on all tables
    - Add policies for proper access control
*/

-- Matching Scores
CREATE TABLE IF NOT EXISTS matching_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
  score FLOAT NOT NULL,
  score_breakdown JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(candidate_id, company_id)
);

-- Matching Preferences
CREATE TABLE IF NOT EXISTS matching_preferences (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_weight FLOAT DEFAULT 1.0,
  experience_weight FLOAT DEFAULT 1.0,
  location_weight FLOAT DEFAULT 1.0,
  industry_weight FLOAT DEFAULT 1.0,
  company_size_weight FLOAT DEFAULT 0.5,
  remote_preference_weight FLOAT DEFAULT 0.8,
  salary_weight FLOAT DEFAULT 0.7,
  behavioral_weight FLOAT DEFAULT 0.6,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matching Filters
CREATE TABLE IF NOT EXISTS matching_filters (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  skills TEXT[],
  experience_levels TEXT[],
  locations TEXT[],
  industries TEXT[],
  remote_preferences TEXT[],
  min_salary INTEGER,
  max_salary INTEGER,
  employment_types TEXT[],
  radius_km INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matching Behavioral Data
CREATE TABLE IF NOT EXISTS matching_behavioral_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'view', 'like', 'dislike', 'message', 'connect', etc.
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, target_id, action_type)
);

-- Matching Location Data
CREATE TABLE IF NOT EXISTS matching_location_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  latitude FLOAT,
  longitude FLOAT,
  city TEXT,
  state TEXT,
  country TEXT,
  radius_km INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- User Likes (for double opt-in matching)
CREATE TABLE IF NOT EXISTS user_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  liker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  liked_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT different_users CHECK (liker_id != liked_id),
  UNIQUE(liker_id, liked_id)
);

-- Enable Row Level Security
ALTER TABLE matching_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE matching_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE matching_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE matching_behavioral_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE matching_location_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_likes ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for matching_scores
CREATE POLICY "Companies can view matching scores for their company"
  ON matching_scores FOR SELECT
  USING (auth.uid() = company_id);

CREATE POLICY "Candidates can view matching scores for their profile"
  ON matching_scores FOR SELECT
  USING (auth.uid() = candidate_id);

-- Create RLS Policies for matching_preferences
CREATE POLICY "Users can view their own matching preferences"
  ON matching_preferences FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own matching preferences"
  ON matching_preferences FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own matching preferences"
  ON matching_preferences FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create RLS Policies for matching_filters
CREATE POLICY "Users can view their own matching filters"
  ON matching_filters FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own matching filters"
  ON matching_filters FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own matching filters"
  ON matching_filters FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create RLS Policies for matching_behavioral_data
CREATE POLICY "Users can view behavioral data they generated"
  ON matching_behavioral_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert behavioral data they generate"
  ON matching_behavioral_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS Policies for matching_location_data
CREATE POLICY "Users can view their own location data"
  ON matching_location_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own location data"
  ON matching_location_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own location data"
  ON matching_location_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS Policies for user_likes
CREATE POLICY "Users can view likes they've given or received"
  ON user_likes FOR SELECT
  USING (auth.uid() = liker_id OR auth.uid() = liked_id);

CREATE POLICY "Users can insert likes they give"
  ON user_likes FOR INSERT
  WITH CHECK (auth.uid() = liker_id);

CREATE POLICY "Users can delete likes they've given"
  ON user_likes FOR DELETE
  USING (auth.uid() = liker_id);

-- Create functions to update updated_at timestamp
CREATE TRIGGER update_matching_scores_updated_at
BEFORE UPDATE ON matching_scores
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matching_preferences_updated_at
BEFORE UPDATE ON matching_preferences
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matching_filters_updated_at
BEFORE UPDATE ON matching_filters
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matching_location_data_updated_at
BEFORE UPDATE ON matching_location_data
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create function to check for mutual likes and create connection requests
CREATE OR REPLACE FUNCTION check_mutual_likes() RETURNS TRIGGER AS $$
BEGIN
  -- Check if there's a mutual like
  IF EXISTS (
    SELECT 1 FROM user_likes
    WHERE liker_id = NEW.liked_id AND liked_id = NEW.liker_id
  ) THEN
    -- Create a connection request if one doesn't already exist
    IF NOT EXISTS (
      SELECT 1 FROM connection_requests
      WHERE (sender_id = NEW.liker_id AND recipient_id = NEW.liked_id)
         OR (sender_id = NEW.liked_id AND recipient_id = NEW.liker_id)
    ) THEN
      INSERT INTO connection_requests (sender_id, recipient_id, message, status)
      VALUES (NEW.liker_id, NEW.liked_id, 'Mutual match! You both liked each other''s profiles.', 'pending');
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for mutual likes
CREATE TRIGGER check_mutual_likes_trigger
AFTER INSERT ON user_likes
FOR EACH ROW
EXECUTE FUNCTION check_mutual_likes();

-- Create function to calculate matching score
CREATE OR REPLACE FUNCTION calculate_matching_score(
  candidate_id UUID,
  company_id UUID
) RETURNS FLOAT AS $$
DECLARE
  score FLOAT := 0;
  candidate_skills TEXT[];
  company_skills TEXT[];
  candidate_industries TEXT[];
  company_industry TEXT;
  candidate_location TEXT;
  company_location TEXT;
  candidate_remote TEXT;
  company_remote TEXT;
  skill_match_count INT := 0;
  total_skills INT := 0;
  skill_score FLOAT := 0;
  location_score FLOAT := 0;
  industry_score FLOAT := 0;
  remote_score FLOAT := 0;
BEGIN
  -- Get candidate skills
  SELECT ARRAY_AGG(skill_name) INTO candidate_skills
  FROM candidate_skills
  WHERE candidate_skills.candidate_id = calculate_matching_score.candidate_id;
  
  -- Get company skills from job interests
  SELECT ARRAY_AGG(DISTINCT skill) INTO company_skills
  FROM company_job_interests, UNNEST(skills) skill
  WHERE company_job_interests.company_id = calculate_matching_score.company_id;
  
  -- Get candidate industries
  SELECT industries INTO candidate_industries
  FROM candidate_preferences
  WHERE id = calculate_matching_score.candidate_id;
  
  -- Get company industry
  SELECT industry INTO company_industry
  FROM company_profiles
  WHERE id = calculate_matching_score.company_id;
  
  -- Get candidate location
  SELECT location INTO candidate_location
  FROM candidate_profiles
  WHERE id = calculate_matching_score.candidate_id;
  
  -- Get company location
  SELECT headquarters_location INTO company_location
  FROM company_profiles
  WHERE id = calculate_matching_score.company_id;
  
  -- Get candidate remote preference
  SELECT remote_preference INTO candidate_remote
  FROM candidate_preferences
  WHERE id = calculate_matching_score.candidate_id;
  
  -- Get company remote preference (from first job interest)
  SELECT remote_preference INTO company_remote
  FROM company_job_interests
  WHERE company_id = calculate_matching_score.company_id
  LIMIT 1;
  
  -- Calculate skill match score
  IF candidate_skills IS NOT NULL AND company_skills IS NOT NULL THEN
    SELECT COUNT(*) INTO skill_match_count
    FROM UNNEST(candidate_skills) cs
    WHERE cs = ANY(company_skills);
    
    total_skills := GREATEST(ARRAY_LENGTH(candidate_skills, 1), 1);
    skill_score := CAST(skill_match_count AS FLOAT) / total_skills;
  END IF;
  
  -- Calculate location match score
  IF candidate_location IS NOT NULL AND company_location IS NOT NULL THEN
    IF candidate_location = company_location THEN
      location_score := 1.0;
    ELSE
      location_score := 0.5; -- Partial match for different locations
    END IF;
  END IF;
  
  -- Calculate industry match score
  IF candidate_industries IS NOT NULL AND company_industry IS NOT NULL THEN
    IF company_industry = ANY(candidate_industries) THEN
      industry_score := 1.0;
    ELSE
      industry_score := 0.3; -- Low match for different industries
    END IF;
  END IF;
  
  -- Calculate remote preference match score
  IF candidate_remote IS NOT NULL AND company_remote IS NOT NULL THEN
    IF candidate_remote = company_remote THEN
      remote_score := 1.0;
    ELSIF (candidate_remote = 'hybrid' AND company_remote = 'remote') OR
          (candidate_remote = 'remote' AND company_remote = 'hybrid') THEN
      remote_score := 0.7; -- Good match for hybrid/remote combinations
    ELSE
      remote_score := 0.3; -- Low match for other combinations
    END IF;
  END IF;
  
  -- Calculate final score (weighted average)
  score := (skill_score * 0.4) + (location_score * 0.2) + (industry_score * 0.2) + (remote_score * 0.2);
  
  RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Create function to update matching scores
CREATE OR REPLACE FUNCTION update_matching_scores() RETURNS VOID AS $$
DECLARE
  candidate RECORD;
  company RECORD;
  score FLOAT;
BEGIN
  -- Clear existing scores
  DELETE FROM matching_scores;
  
  -- Calculate scores for each candidate-company pair
  FOR candidate IN SELECT id FROM candidate_profiles WHERE is_public = true LOOP
    FOR company IN SELECT id FROM company_profiles LOOP
      score := calculate_matching_score(candidate.id, company.id);
      
      INSERT INTO matching_scores (candidate_id, company_id, score, score_breakdown)
      VALUES (
        candidate.id,
        company.id,
        score,
        jsonb_build_object(
          'skill_score', (SELECT COUNT(*) FROM candidate_skills cs, company_job_interests cji, UNNEST(cji.skills) skill
                          WHERE cs.candidate_id = candidate.id AND cji.company_id = company.id AND cs.skill_name = skill),
          'location_match', (SELECT cp.location = comp.headquarters_location
                            FROM candidate_profiles cp, company_profiles comp
                            WHERE cp.id = candidate.id AND comp.id = company.id),
          'industry_match', (SELECT comp.industry = ANY(cp.industries)
                            FROM candidate_preferences cp, company_profiles comp
                            WHERE cp.id = candidate.id AND comp.id = company.id),
          'remote_match', (SELECT cp.remote_preference = cji.remote_preference
                          FROM candidate_preferences cp, company_job_interests cji
                          WHERE cp.id = candidate.id AND cji.company_id = company.id
                          LIMIT 1)
        )
      );
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create a function to record behavioral data
CREATE OR REPLACE FUNCTION record_behavioral_data(
  user_id UUID,
  target_id UUID,
  action_type TEXT,
  metadata JSONB DEFAULT '{}'::JSONB
) RETURNS VOID AS $$
BEGIN
  INSERT INTO matching_behavioral_data (user_id, target_id, action_type, metadata)
  VALUES (user_id, target_id, action_type, metadata)
  ON CONFLICT (user_id, target_id, action_type)
  DO UPDATE SET
    metadata = matching_behavioral_data.metadata || EXCLUDED.metadata,
    created_at = NOW();
END;
$$ LANGUAGE plpgsql;