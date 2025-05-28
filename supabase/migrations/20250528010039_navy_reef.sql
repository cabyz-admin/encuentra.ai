/*
  # Create Job Board Schema

  1. New Tables
    - `user_profiles` - Stores user type (candidate/company) and onboarding status
    - `candidate_profiles` - Stores candidate-specific profile information
    - `candidate_skills` - Stores candidate skills with proficiency levels
    - `candidate_experience` - Stores candidate work experience
    - `candidate_education` - Stores candidate education background
    - `candidate_portfolios` - Stores candidate portfolio/project links
    - `candidate_availability` - Stores candidate availability status
    - `candidate_preferences` - Stores candidate job preferences
    - `company_profiles` - Stores company-specific profile information
    - `company_team_members` - Stores company team members
    - `company_job_interests` - Stores company hiring interests
    - `company_saved_candidates` - Stores candidates saved by companies
    - `conversations` - Stores conversations between users
    - `messages` - Stores messages within conversations
    - `skill_tags` - Stores standardized skill tags
    - `industry_tags` - Stores standardized industry tags
    - `location_data` - Stores location data

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read/write their own data
*/

-- Enums
CREATE TYPE user_type AS ENUM ('candidate', 'company', 'admin');
CREATE TYPE availability_status AS ENUM ('active', 'passive', 'not_looking');
CREATE TYPE experience_level AS ENUM ('entry', 'mid', 'senior', 'executive');
CREATE TYPE employment_type AS ENUM ('full_time', 'part_time', 'contract', 'freelance', 'internship');
CREATE TYPE remote_preference AS ENUM ('remote', 'hybrid', 'onsite');
CREATE TYPE skill_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');

-- User Profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type user_type NOT NULL,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_step INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Candidate Profiles
CREATE TABLE IF NOT EXISTS candidate_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  headline TEXT,
  bio TEXT,
  location TEXT,
  years_of_experience INTEGER,
  experience_level experience_level,
  avatar_url TEXT,
  resume_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  website_url TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Candidate Skills
CREATE TABLE IF NOT EXISTS candidate_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  proficiency skill_level NOT NULL,
  years_of_experience INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(candidate_id, skill_name)
);

-- Candidate Experience
CREATE TABLE IF NOT EXISTS candidate_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Candidate Education
CREATE TABLE IF NOT EXISTS candidate_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Candidate Portfolios
CREATE TABLE IF NOT EXISTS candidate_portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Candidate Availability
CREATE TABLE IF NOT EXISTS candidate_availability (
  id UUID PRIMARY KEY REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  status availability_status NOT NULL DEFAULT 'active',
  available_from DATE,
  notice_period_days INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Candidate Preferences
CREATE TABLE IF NOT EXISTS candidate_preferences (
  id UUID PRIMARY KEY REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  min_salary INTEGER,
  max_salary INTEGER,
  currency TEXT DEFAULT 'USD',
  employment_types employment_type[] DEFAULT ARRAY['full_time']::employment_type[],
  remote_preference remote_preference DEFAULT 'remote',
  locations TEXT[],
  industries TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company Profiles
CREATE TABLE IF NOT EXISTS company_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  industry TEXT,
  company_size TEXT,
  founded_year INTEGER,
  website_url TEXT,
  linkedin_url TEXT,
  logo_url TEXT,
  headquarters_location TEXT,
  bio TEXT,
  culture TEXT,
  benefits TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company Team Members
CREATE TABLE IF NOT EXISTS company_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company Job Interests
CREATE TABLE IF NOT EXISTS company_job_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  skills TEXT[],
  experience_level experience_level,
  employment_type employment_type DEFAULT 'full_time',
  remote_preference remote_preference DEFAULT 'remote',
  min_salary INTEGER,
  max_salary INTEGER,
  currency TEXT DEFAULT 'USD',
  locations TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company Saved Candidates
CREATE TABLE IF NOT EXISTS company_saved_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, candidate_id)
);

-- Conversations
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT different_users CHECK (initiator_id != recipient_id),
  UNIQUE(initiator_id, recipient_id)
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Candidate Views (for analytics)
CREATE TABLE IF NOT EXISTS candidate_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  viewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skill Tags
CREATE TABLE IF NOT EXISTS skill_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Industry Tags
CREATE TABLE IF NOT EXISTS industry_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Location Data
CREATE TABLE IF NOT EXISTS location_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(city, state, country)
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_job_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_saved_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_data ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- User Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Candidate Profiles Policies
CREATE POLICY "Public candidate profiles are viewable by all authenticated users"
  ON candidate_profiles FOR SELECT
  USING (is_public OR auth.uid() = id);

CREATE POLICY "Candidates can update their own profile"
  ON candidate_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Candidates can insert their own profile"
  ON candidate_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Candidate Skills Policies
CREATE POLICY "Public candidate skills are viewable by all authenticated users"
  ON candidate_skills FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM candidate_profiles
      WHERE candidate_profiles.id = candidate_skills.candidate_id
      AND (candidate_profiles.is_public OR candidate_profiles.id = auth.uid())
    )
  );

CREATE POLICY "Candidates can update their own skills"
  ON candidate_skills FOR UPDATE
  USING (candidate_id = auth.uid());

CREATE POLICY "Candidates can insert their own skills"
  ON candidate_skills FOR INSERT
  WITH CHECK (candidate_id = auth.uid());

CREATE POLICY "Candidates can delete their own skills"
  ON candidate_skills FOR DELETE
  USING (candidate_id = auth.uid());

-- Candidate Experience Policies
CREATE POLICY "Public candidate experience is viewable by all authenticated users"
  ON candidate_experience FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM candidate_profiles
      WHERE candidate_profiles.id = candidate_experience.candidate_id
      AND (candidate_profiles.is_public OR candidate_profiles.id = auth.uid())
    )
  );

CREATE POLICY "Candidates can update their own experience"
  ON candidate_experience FOR UPDATE
  USING (candidate_id = auth.uid());

CREATE POLICY "Candidates can insert their own experience"
  ON candidate_experience FOR INSERT
  WITH CHECK (candidate_id = auth.uid());

CREATE POLICY "Candidates can delete their own experience"
  ON candidate_experience FOR DELETE
  USING (candidate_id = auth.uid());

-- Candidate Education Policies
CREATE POLICY "Public candidate education is viewable by all authenticated users"
  ON candidate_education FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM candidate_profiles
      WHERE candidate_profiles.id = candidate_education.candidate_id
      AND (candidate_profiles.is_public OR candidate_profiles.id = auth.uid())
    )
  );

CREATE POLICY "Candidates can update their own education"
  ON candidate_education FOR UPDATE
  USING (candidate_id = auth.uid());

CREATE POLICY "Candidates can insert their own education"
  ON candidate_education FOR INSERT
  WITH CHECK (candidate_id = auth.uid());

CREATE POLICY "Candidates can delete their own education"
  ON candidate_education FOR DELETE
  USING (candidate_id = auth.uid());

-- Candidate Portfolios Policies
CREATE POLICY "Public candidate portfolios are viewable by all authenticated users"
  ON candidate_portfolios FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM candidate_profiles
      WHERE candidate_profiles.id = candidate_portfolios.candidate_id
      AND (candidate_profiles.is_public OR candidate_profiles.id = auth.uid())
    )
  );

CREATE POLICY "Candidates can update their own portfolios"
  ON candidate_portfolios FOR UPDATE
  USING (candidate_id = auth.uid());

CREATE POLICY "Candidates can insert their own portfolios"
  ON candidate_portfolios FOR INSERT
  WITH CHECK (candidate_id = auth.uid());

CREATE POLICY "Candidates can delete their own portfolios"
  ON candidate_portfolios FOR DELETE
  USING (candidate_id = auth.uid());

-- Candidate Availability Policies
CREATE POLICY "Public candidate availability is viewable by all authenticated users"
  ON candidate_availability FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM candidate_profiles
      WHERE candidate_profiles.id = candidate_availability.id
      AND (candidate_profiles.is_public OR candidate_profiles.id = auth.uid())
    )
  );

CREATE POLICY "Candidates can update their own availability"
  ON candidate_availability FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Candidates can insert their own availability"
  ON candidate_availability FOR INSERT
  WITH CHECK (id = auth.uid());

-- Candidate Preferences Policies
CREATE POLICY "Public candidate preferences are viewable by all authenticated users"
  ON candidate_preferences FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM candidate_profiles
      WHERE candidate_profiles.id = candidate_preferences.id
      AND (candidate_profiles.is_public OR candidate_profiles.id = auth.uid())
    )
  );

CREATE POLICY "Candidates can update their own preferences"
  ON candidate_preferences FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Candidates can insert their own preferences"
  ON candidate_preferences FOR INSERT
  WITH CHECK (id = auth.uid());

-- Company Profiles Policies
CREATE POLICY "Company profiles are viewable by all authenticated users"
  ON company_profiles FOR SELECT
  USING (true);

CREATE POLICY "Companies can update their own profile"
  ON company_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Companies can insert their own profile"
  ON company_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Company Team Members Policies
CREATE POLICY "Company team members are viewable by all authenticated users"
  ON company_team_members FOR SELECT
  USING (true);

CREATE POLICY "Companies can update their own team members"
  ON company_team_members FOR UPDATE
  USING (company_id = auth.uid());

CREATE POLICY "Companies can insert their own team members"
  ON company_team_members FOR INSERT
  WITH CHECK (company_id = auth.uid());

CREATE POLICY "Companies can delete their own team members"
  ON company_team_members FOR DELETE
  USING (company_id = auth.uid());

-- Company Job Interests Policies
CREATE POLICY "Company job interests are viewable by all authenticated users"
  ON company_job_interests FOR SELECT
  USING (true);

CREATE POLICY "Companies can update their own job interests"
  ON company_job_interests FOR UPDATE
  USING (company_id = auth.uid());

CREATE POLICY "Companies can insert their own job interests"
  ON company_job_interests FOR INSERT
  WITH CHECK (company_id = auth.uid());

CREATE POLICY "Companies can delete their own job interests"
  ON company_job_interests FOR DELETE
  USING (company_id = auth.uid());

-- Company Saved Candidates Policies
CREATE POLICY "Companies can view their saved candidates"
  ON company_saved_candidates FOR SELECT
  USING (company_id = auth.uid());

CREATE POLICY "Companies can update their saved candidates"
  ON company_saved_candidates FOR UPDATE
  USING (company_id = auth.uid());

CREATE POLICY "Companies can insert their saved candidates"
  ON company_saved_candidates FOR INSERT
  WITH CHECK (company_id = auth.uid());

CREATE POLICY "Companies can delete their saved candidates"
  ON company_saved_candidates FOR DELETE
  USING (company_id = auth.uid());

-- Conversations Policies
CREATE POLICY "Users can view their own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = initiator_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can insert conversations they initiate"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = initiator_id);

-- Messages Policies
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.initiator_id = auth.uid() OR conversations.recipient_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert messages in their conversations"
  ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_id
      AND (conversations.initiator_id = auth.uid() OR conversations.recipient_id = auth.uid())
    )
  );

-- Candidate Views Policies
CREATE POLICY "Candidates can view their profile views"
  ON candidate_views FOR SELECT
  USING (candidate_id = auth.uid());

CREATE POLICY "Users can insert candidate views"
  ON candidate_views FOR INSERT
  WITH CHECK (viewer_id = auth.uid());

-- Skill Tags Policies
CREATE POLICY "Skill tags are viewable by all authenticated users"
  ON skill_tags FOR SELECT
  USING (true);

-- Industry Tags Policies
CREATE POLICY "Industry tags are viewable by all authenticated users"
  ON industry_tags FOR SELECT
  USING (true);

-- Location Data Policies
CREATE POLICY "Location data is viewable by all authenticated users"
  ON location_data FOR SELECT
  USING (true);

-- Create functions to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidate_profiles_updated_at
BEFORE UPDATE ON candidate_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidate_skills_updated_at
BEFORE UPDATE ON candidate_skills
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidate_experience_updated_at
BEFORE UPDATE ON candidate_experience
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidate_education_updated_at
BEFORE UPDATE ON candidate_education
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidate_portfolios_updated_at
BEFORE UPDATE ON candidate_portfolios
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidate_availability_updated_at
BEFORE UPDATE ON candidate_availability
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidate_preferences_updated_at
BEFORE UPDATE ON candidate_preferences
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_profiles_updated_at
BEFORE UPDATE ON company_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_team_members_updated_at
BEFORE UPDATE ON company_team_members
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_job_interests_updated_at
BEFORE UPDATE ON company_job_interests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_saved_candidates_updated_at
BEFORE UPDATE ON company_saved_candidates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
BEFORE UPDATE ON conversations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
BEFORE UPDATE ON messages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert some initial data for skill tags
INSERT INTO skill_tags (name, category) VALUES
('JavaScript', 'Programming'),
('TypeScript', 'Programming'),
('React', 'Frontend'),
('Next.js', 'Frontend'),
('Node.js', 'Backend'),
('Python', 'Programming'),
('Java', 'Programming'),
('SQL', 'Database'),
('PostgreSQL', 'Database'),
('MongoDB', 'Database'),
('AWS', 'Cloud'),
('Azure', 'Cloud'),
('Docker', 'DevOps'),
('Kubernetes', 'DevOps'),
('Git', 'Tools'),
('Product Management', 'Business'),
('UI/UX Design', 'Design'),
('Figma', 'Design'),
('Marketing', 'Business'),
('Sales', 'Business'),
('Customer Success', 'Business'),
('Data Science', 'Data'),
('Machine Learning', 'Data'),
('Artificial Intelligence', 'Data'),
('Project Management', 'Business');

-- Insert some initial data for industry tags
INSERT INTO industry_tags (name) VALUES
('Technology'),
('Healthcare'),
('Finance'),
('Education'),
('E-commerce'),
('Manufacturing'),
('Media'),
('Entertainment'),
('Real Estate'),
('Transportation'),
('Energy'),
('Retail'),
('Consulting'),
('Telecommunications'),
('Agriculture'),
('Hospitality'),
('Construction'),
('Aerospace'),
('Automotive'),
('Pharmaceuticals');

-- Insert some initial data for location data
INSERT INTO location_data (city, state, country) VALUES
('San Francisco', 'California', 'United States'),
('New York', 'New York', 'United States'),
('London', NULL, 'United Kingdom'),
('Berlin', NULL, 'Germany'),
('Paris', NULL, 'France'),
('Toronto', 'Ontario', 'Canada'),
('Sydney', 'New South Wales', 'Australia'),
('Singapore', NULL, 'Singapore'),
('Tokyo', NULL, 'Japan'),
('Bangalore', 'Karnataka', 'India'),
('Amsterdam', NULL, 'Netherlands'),
('Dublin', NULL, 'Ireland'),
('Stockholm', NULL, 'Sweden'),
('Barcelona', NULL, 'Spain'),
('Tel Aviv', NULL, 'Israel');

-- Modify the handle_new_user function to also create a user_profile
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
begin
    insert into public.users (id, email, full_name)
    values (
        new.id,
        new.email,
        new.raw_user_meta_data ->> 'full_name'
    );
    return new;
end;
$$;