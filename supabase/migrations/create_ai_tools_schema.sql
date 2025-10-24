-- =====================================================
-- AI Tool Guide Module Database Schema
-- =====================================================
-- This migration creates all tables needed for the comprehensive
-- AI Tool Guide feature including learning paths, prompts, workflows,
-- benchmarks, and certifications.

-- =====================================================
-- 1. AI LEARNING PATHS
-- =====================================================

-- Main learning paths table
CREATE TABLE ai_learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) NOT NULL,
  target_role TEXT[] NOT NULL, -- ['frontend', 'backend', 'fullstack', 'devops']
  tech_stack TEXT[] NOT NULL, -- ['react', 'python', 'nodejs', etc.]
  estimated_duration_hours INTEGER NOT NULL,
  learning_objectives TEXT[] NOT NULL,
  prerequisites TEXT[],
  is_published BOOLEAN DEFAULT true,
  order_index INTEGER NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual lessons within learning paths
CREATE TABLE ai_learning_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_path_id UUID REFERENCES ai_learning_paths(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content_type TEXT CHECK (content_type IN ('video', 'article', 'interactive', 'quiz', 'challenge')) NOT NULL,
  content TEXT NOT NULL, -- Markdown or JSON content
  duration_minutes INTEGER NOT NULL,
  order_index INTEGER NOT NULL,
  learning_objectives TEXT[] NOT NULL,
  resources JSONB, -- External links, documentation, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User progress tracking for learning paths
CREATE TABLE ai_learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  learning_path_id UUID REFERENCES ai_learning_paths(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES ai_learning_lessons(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
  progress_percentage INTEGER DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- =====================================================
-- 2. AI PROMPT LIBRARY
-- =====================================================

-- Main prompts table with version control
CREATE TABLE ai_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT CHECK (category IN (
    'code_generation',
    'debugging',
    'code_review',
    'refactoring',
    'documentation',
    'testing',
    'architecture',
    'learning',
    'optimization',
    'security'
  )) NOT NULL,
  use_case TEXT NOT NULL, -- Specific use case description
  tech_stack TEXT[], -- Technologies this prompt is useful for
  ai_tools TEXT[], -- Which AI tools work best with this prompt
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  parent_id UUID REFERENCES ai_prompts(id) ON DELETE SET NULL, -- For forks
  version INTEGER DEFAULT 1,
  is_public BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0.0, -- Percentage
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prompt variables for reusable templates
CREATE TABLE ai_prompt_variables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID REFERENCES ai_prompts(id) ON DELETE CASCADE,
  variable_name TEXT NOT NULL,
  description TEXT NOT NULL,
  example_value TEXT,
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User ratings and feedback for prompts
CREATE TABLE ai_prompt_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID REFERENCES ai_prompts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  result_quality INTEGER CHECK (result_quality >= 1 AND result_quality <= 5),
  execution_time_seconds INTEGER,
  feedback TEXT,
  ai_tool_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(prompt_id, user_id)
);

-- User saved/bookmarked prompts
CREATE TABLE ai_prompt_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  prompt_id UUID REFERENCES ai_prompts(id) ON DELETE CASCADE,
  collection_name TEXT, -- User-defined collections
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, prompt_id)
);

-- =====================================================
-- 3. COMMUNITY WORKFLOWS
-- =====================================================

-- Main workflows table
CREATE TABLE ai_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  problem_statement TEXT NOT NULL,
  solution_overview TEXT NOT NULL,
  tools_used TEXT[] NOT NULL, -- AI tools used in workflow
  tech_stack TEXT[] NOT NULL, -- Technologies involved
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) NOT NULL,
  estimated_time_saved_minutes INTEGER,
  steps JSONB NOT NULL, -- Array of workflow steps with prompts, results, tips
  prerequisites TEXT[],
  tips_and_tricks TEXT[],
  common_pitfalls TEXT[],
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow comments
CREATE TABLE ai_workflow_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES ai_workflows(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES ai_workflow_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  helpful_votes INTEGER DEFAULT 0,
  is_author_response BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User saved workflows
CREATE TABLE ai_workflow_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  workflow_id UUID REFERENCES ai_workflows(id) ON DELETE CASCADE,
  collection_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, workflow_id)
);

-- User workflow votes
CREATE TABLE ai_workflow_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  workflow_id UUID REFERENCES ai_workflows(id) ON DELETE CASCADE,
  vote_type TEXT CHECK (vote_type IN ('upvote', 'downvote')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, workflow_id)
);

-- =====================================================
-- 4. AI TOOL BENCHMARKS & COMPARISONS
-- =====================================================

-- AI tools catalog
CREATE TABLE ai_tools_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  category TEXT CHECK (category IN (
    'code_completion',
    'chat_assistant',
    'code_generation',
    'ide_integration',
    'pair_programming'
  )) NOT NULL,
  description TEXT NOT NULL,
  website_url TEXT,
  pricing_model TEXT, -- 'free', 'freemium', 'subscription', 'enterprise'
  pricing_details JSONB, -- Detailed pricing info
  features TEXT[],
  supported_languages TEXT[],
  supported_ides TEXT[],
  pros TEXT[],
  cons TEXT[],
  is_active BOOLEAN DEFAULT true,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Benchmark results from sandbox
CREATE TABLE ai_tool_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  ai_tool_id UUID REFERENCES ai_tools_catalog(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL, -- 'code_generation', 'debugging', 'refactoring', etc.
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  response_time_ms INTEGER NOT NULL,
  token_count INTEGER,
  estimated_cost_usd DECIMAL(10,6),
  code_quality_score INTEGER CHECK (code_quality_score >= 1 AND code_quality_score <= 100),
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  metadata JSONB, -- Additional metrics
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comparison sessions (when users compare multiple tools)
CREATE TABLE ai_tool_comparison_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_name TEXT,
  prompt TEXT NOT NULL,
  task_type TEXT NOT NULL,
  tools_compared UUID[] NOT NULL, -- Array of ai_tool_ids
  winner_tool_id UUID REFERENCES ai_tools_catalog(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. AI TOOL CHALLENGES
-- =====================================================

-- Specific AI tool usage challenges
CREATE TABLE ai_tool_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge_type TEXT CHECK (challenge_type IN (
    'speed_coding',
    'quality_focus',
    'prompt_mastery',
    'debugging_race',
    'tool_efficiency'
  )) NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) NOT NULL,
  required_tools TEXT[], -- Specific AI tools required
  scenario TEXT NOT NULL, -- The scenario/problem description
  success_criteria JSONB NOT NULL, -- What defines success
  time_limit_minutes INTEGER,
  starter_code TEXT,
  test_cases JSONB,
  learning_objectives TEXT[],
  points_reward INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User submissions for AI tool challenges
CREATE TABLE ai_tool_challenge_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES ai_tool_challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tools_used TEXT[] NOT NULL,
  prompts_used TEXT[],
  solution_code TEXT NOT NULL,
  time_taken_minutes INTEGER NOT NULL,
  quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
  status TEXT CHECK (status IN ('passed', 'failed', 'partial')) NOT NULL,
  feedback TEXT,
  points_earned INTEGER DEFAULT 0,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. CERTIFICATIONS
-- =====================================================

-- Available certifications
CREATE TABLE ai_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')) NOT NULL,
  badge_image_url TEXT,
  requirements JSONB NOT NULL, -- Courses to complete, challenges to pass, etc.
  assessment_type TEXT CHECK (assessment_type IN ('quiz', 'practical', 'project', 'mixed')) NOT NULL,
  passing_score INTEGER NOT NULL,
  certificate_template_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User earned certifications
CREATE TABLE ai_user_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  certification_id UUID REFERENCES ai_certifications(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  certificate_url TEXT,
  certificate_number TEXT UNIQUE NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- NULL if never expires
  is_public BOOLEAN DEFAULT true,
  linkedin_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, certification_id)
);

-- =====================================================
-- 7. USER ANALYTICS & PRODUCTIVITY TRACKING
-- =====================================================

-- Track user productivity metrics with AI tools
CREATE TABLE ai_productivity_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  ai_tool_used TEXT NOT NULL,
  time_saved_minutes INTEGER DEFAULT 0,
  lines_of_code_generated INTEGER DEFAULT 0,
  prompts_used INTEGER DEFAULT 0,
  challenges_completed INTEGER DEFAULT 0,
  workflows_created INTEGER DEFAULT 0,
  quality_score_avg DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date, ai_tool_used)
);

-- =====================================================
-- 8. AI TOOL UPDATES & CHANGELOG TRACKING
-- =====================================================

CREATE TABLE ai_tool_changelogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_tool_id UUID REFERENCES ai_tools_catalog(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  release_date DATE NOT NULL,
  changelog_url TEXT,
  summary TEXT NOT NULL,
  features_added TEXT[],
  features_improved TEXT[],
  bugs_fixed TEXT[],
  breaking_changes TEXT[],
  community_notes TEXT,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Learning paths indexes
CREATE INDEX idx_learning_paths_difficulty ON ai_learning_paths(difficulty);
CREATE INDEX idx_learning_paths_published ON ai_learning_paths(is_published);
CREATE INDEX idx_learning_progress_user ON ai_learning_progress(user_id);
CREATE INDEX idx_learning_progress_path ON ai_learning_progress(learning_path_id);

-- Prompts indexes
CREATE INDEX idx_prompts_category ON ai_prompts(category);
CREATE INDEX idx_prompts_author ON ai_prompts(author_id);
CREATE INDEX idx_prompts_featured ON ai_prompts(is_featured);
CREATE INDEX idx_prompts_public ON ai_prompts(is_public);
CREATE INDEX idx_prompts_upvotes ON ai_prompts(upvotes DESC);
CREATE INDEX idx_prompts_tags ON ai_prompts USING GIN(tags);

-- Workflows indexes
CREATE INDEX idx_workflows_author ON ai_workflows(author_id);
CREATE INDEX idx_workflows_featured ON ai_workflows(is_featured);
CREATE INDEX idx_workflows_upvotes ON ai_workflows(upvotes DESC);
CREATE INDEX idx_workflows_tags ON ai_workflows USING GIN(tags);
CREATE INDEX idx_workflows_tools ON ai_workflows USING GIN(tools_used);

-- Benchmarks indexes
CREATE INDEX idx_benchmarks_user ON ai_tool_benchmarks(user_id);
CREATE INDEX idx_benchmarks_tool ON ai_tool_benchmarks(ai_tool_id);
CREATE INDEX idx_benchmarks_task_type ON ai_tool_benchmarks(task_type);
CREATE INDEX idx_benchmarks_created ON ai_tool_benchmarks(created_at DESC);

-- Challenges indexes
CREATE INDEX idx_ai_challenges_difficulty ON ai_tool_challenges(difficulty);
CREATE INDEX idx_ai_challenges_active ON ai_tool_challenges(is_active);
CREATE INDEX idx_ai_challenge_subs_user ON ai_tool_challenge_submissions(user_id);
CREATE INDEX idx_ai_challenge_subs_challenge ON ai_tool_challenge_submissions(challenge_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE ai_learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_learning_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_prompt_variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_prompt_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_prompt_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_workflow_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_workflow_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_workflow_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tools_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tool_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tool_comparison_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tool_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tool_challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_user_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_productivity_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tool_changelogs ENABLE ROW LEVEL SECURITY;

-- Learning paths: Public read, authenticated users can track progress
CREATE POLICY "Learning paths are viewable by everyone"
  ON ai_learning_paths FOR SELECT
  USING (is_published = true);

CREATE POLICY "Lessons are viewable by everyone"
  ON ai_learning_lessons FOR SELECT
  USING (true);

CREATE POLICY "Users can view their own progress"
  ON ai_learning_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON ai_learning_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON ai_learning_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Prompts: Public prompts viewable by all, users can CRUD their own
CREATE POLICY "Public prompts are viewable by everyone"
  ON ai_prompts FOR SELECT
  USING (is_public = true OR auth.uid() = author_id);

CREATE POLICY "Users can create prompts"
  ON ai_prompts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own prompts"
  ON ai_prompts FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own prompts"
  ON ai_prompts FOR DELETE
  USING (auth.uid() = author_id);

-- Workflows: Similar to prompts
CREATE POLICY "Public workflows are viewable by everyone"
  ON ai_workflows FOR SELECT
  USING (is_public = true OR auth.uid() = author_id);

CREATE POLICY "Users can create workflows"
  ON ai_workflows FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own workflows"
  ON ai_workflows FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own workflows"
  ON ai_workflows FOR DELETE
  USING (auth.uid() = author_id);

-- Benchmarks: Users can only see their own
CREATE POLICY "Users can view their own benchmarks"
  ON ai_tool_benchmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create benchmarks"
  ON ai_tool_benchmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Challenges: Public read, authenticated can submit
CREATE POLICY "Active challenges are viewable by everyone"
  ON ai_tool_challenges FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can view their own submissions"
  ON ai_tool_challenge_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create submissions"
  ON ai_tool_challenge_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Certifications: Public read for active, users see their own earned
CREATE POLICY "Active certifications are viewable by everyone"
  ON ai_certifications FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can view their own certifications"
  ON ai_user_certifications FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

-- Analytics: Users can only see their own
CREATE POLICY "Users can view their own metrics"
  ON ai_productivity_metrics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own metrics"
  ON ai_productivity_metrics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own metrics"
  ON ai_productivity_metrics FOR UPDATE
  USING (auth.uid() = user_id);

-- Tools catalog: Public read
CREATE POLICY "AI tools catalog is viewable by everyone"
  ON ai_tools_catalog FOR SELECT
  USING (is_active = true);

-- Changelogs: Public read
CREATE POLICY "Changelogs are viewable by everyone"
  ON ai_tool_changelogs FOR SELECT
  USING (true);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_ai_learning_paths_updated_at BEFORE UPDATE ON ai_learning_paths
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_learning_lessons_updated_at BEFORE UPDATE ON ai_learning_lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_learning_progress_updated_at BEFORE UPDATE ON ai_learning_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_prompts_updated_at BEFORE UPDATE ON ai_prompts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_workflows_updated_at BEFORE UPDATE ON ai_workflows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_tools_catalog_updated_at BEFORE UPDATE ON ai_tools_catalog
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment workflow view count
CREATE OR REPLACE FUNCTION increment_workflow_views(workflow_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE ai_workflows
  SET view_count = view_count + 1
  WHERE id = workflow_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update prompt usage count
CREATE OR REPLACE FUNCTION increment_prompt_usage(prompt_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE ai_prompts
  SET usage_count = usage_count + 1
  WHERE id = prompt_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate prompt success rate
CREATE OR REPLACE FUNCTION update_prompt_success_rate(prompt_uuid UUID)
RETURNS VOID AS $$
DECLARE
  avg_rating DECIMAL(5,2);
BEGIN
  SELECT AVG(rating) INTO avg_rating
  FROM ai_prompt_ratings
  WHERE prompt_id = prompt_uuid;

  UPDATE ai_prompts
  SET success_rate = (avg_rating / 5.0) * 100
  WHERE id = prompt_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SEED DATA FOR AI TOOLS CATALOG
-- =====================================================

INSERT INTO ai_tools_catalog (name, display_name, category, description, pricing_model, features, supported_languages, supported_ides, pros, cons, logo_url) VALUES
('github-copilot', 'GitHub Copilot', 'code_completion', 'AI pair programmer that suggests code and entire functions in real-time', 'subscription',
  ARRAY['Code completion', 'Multi-language support', 'IDE integration', 'Context-aware suggestions'],
  ARRAY['JavaScript', 'Python', 'TypeScript', 'Go', 'Ruby', 'Java', 'C++'],
  ARRAY['VS Code', 'Visual Studio', 'JetBrains IDEs', 'Neovim'],
  ARRAY['Excellent IDE integration', 'Fast suggestions', 'Great for boilerplate code', 'Good context awareness'],
  ARRAY['Subscription cost', 'Sometimes suggests outdated patterns', 'Limited customization'],
  'https://github.githubassets.com/images/modules/site/copilot/copilot.png'),

('cursor', 'Cursor', 'pair_programming', 'AI-first code editor built for pair programming with AI', 'freemium',
  ARRAY['Chat with codebase', 'Code generation', 'Multi-file editing', 'Terminal integration'],
  ARRAY['JavaScript', 'Python', 'TypeScript', 'Go', 'Rust', 'Java', 'All major languages'],
  ARRAY['Cursor (standalone editor)'],
  ARRAY['Excellent AI integration', 'Understands entire codebase', 'Natural conversation', 'Fast and responsive'],
  ARRAY['VS Code fork learning curve', 'Subscription required for best features', 'Still maturing'],
  'https://cursor.sh/brand/icon.png'),

('chatgpt', 'ChatGPT', 'chat_assistant', 'Conversational AI assistant for coding help, debugging, and learning', 'freemium',
  ARRAY['Natural language coding help', 'Code generation', 'Debugging assistance', 'Learning support'],
  ARRAY['All programming languages'],
  ARRAY['Web browser', 'API integration'],
  ARRAY['Great for learning', 'Excellent explanations', 'Wide knowledge base', 'Good for architecture discussions'],
  ARRAY['No direct IDE integration', 'Context window limitations', 'Requires copy-paste workflow'],
  'https://cdn.oaistatic.com/_next/static/media/apple-touch-icon.59f2e898.png'),

('claude', 'Claude', 'chat_assistant', 'Advanced AI assistant with strong coding and reasoning capabilities', 'freemium',
  ARRAY['Long context window', 'Code generation', 'Analysis and debugging', 'Technical writing'],
  ARRAY['All programming languages'],
  ARRAY['Web browser', 'API integration'],
  ARRAY['Excellent for complex reasoning', 'Very large context window', 'Great code understanding', 'Strong at refactoring'],
  ARRAY['No native IDE integration', 'Newer to market', 'API access limited'],
  'https://claude.ai/favicon.ico'),

('tabnine', 'Tabnine', 'code_completion', 'AI code completion tool with team learning capabilities', 'freemium',
  ARRAY['Code completion', 'Team model training', 'Privacy-focused', 'On-premise option'],
  ARRAY['JavaScript', 'Python', 'Java', 'Go', 'C++', 'Ruby', 'PHP'],
  ARRAY['VS Code', 'IntelliJ', 'PyCharm', 'WebStorm', 'Sublime Text', 'Atom'],
  ARRAY['Privacy-focused', 'Team learning', 'On-premise deployment', 'Affordable pricing'],
  ARRAY['Suggestions less advanced than Copilot', 'Smaller community', 'Team features require enterprise'],
  'https://www.tabnine.com/favicon.ico'),

('codeium', 'Codeium', 'code_completion', 'Free AI code completion tool with generous free tier', 'freemium',
  ARRAY['Code completion', 'Chat interface', 'Multi-language support', 'IDE integration'],
  ARRAY['70+ programming languages'],
  ARRAY['VS Code', 'JetBrains IDEs', 'Vim', 'Emacs', 'Web browsers'],
  ARRAY['Generous free tier', 'Fast completions', 'Good multi-language support', 'Active development'],
  ARRAY['Newer player', 'Smaller training data', 'Some features behind paid tier'],
  'https://codeium.com/favicon.ico'),

('v0-dev', 'v0.dev by Vercel', 'code_generation', 'AI-powered UI component generator using shadcn/ui', 'free',
  ARRAY['UI generation', 'React component creation', 'Tailwind CSS', 'shadcn/ui integration'],
  ARRAY['TypeScript', 'React', 'Next.js'],
  ARRAY['Web browser'],
  ARRAY['Excellent for rapid prototyping', 'Beautiful UI generation', 'Modern tech stack', 'Free to use'],
  ARRAY['Limited to React/Next.js', 'Web-only interface', 'Requires manual copy-paste'],
  'https://v0.dev/favicon.ico');

-- =====================================================
-- ANALYTICS VIEWS
-- =====================================================

-- View for user AI tool proficiency levels
CREATE VIEW user_ai_proficiency AS
SELECT
  lp.user_id,
  COUNT(DISTINCT lp.learning_path_id) as paths_completed,
  COUNT(DISTINCT lp.lesson_id) as lessons_completed,
  COALESCE(ch.challenges_completed, 0) as challenges_completed,
  COALESCE(cert.certifications_earned, 0) as certifications_earned,
  SUM(lp.time_spent_minutes) as total_learning_time,
  AVG(lp.progress_percentage) as avg_progress,
  GREATEST(MAX(lp.completed_at), MAX(ch.last_submission), MAX(cert.last_issued)) as last_activity
FROM ai_learning_progress lp
LEFT JOIN (
  SELECT user_id, COUNT(*) as challenges_completed, MAX(submitted_at) as last_submission
  FROM ai_tool_challenge_submissions
  WHERE status = 'passed'
  GROUP BY user_id
) ch ON lp.user_id = ch.user_id
LEFT JOIN (
  SELECT user_id, COUNT(*) as certifications_earned, MAX(issued_at) as last_issued
  FROM ai_user_certifications
  GROUP BY user_id
) cert ON lp.user_id = cert.user_id
WHERE lp.status = 'completed'
GROUP BY lp.user_id, ch.challenges_completed, cert.certifications_earned;

-- View for popular prompts
CREATE VIEW popular_prompts AS
SELECT
  p.*,
  COUNT(DISTINCT ps.user_id) as save_count,
  AVG(pr.rating) as avg_rating,
  COUNT(DISTINCT pr.user_id) as rating_count
FROM ai_prompts p
LEFT JOIN ai_prompt_saves ps ON p.id = ps.prompt_id
LEFT JOIN ai_prompt_ratings pr ON p.id = pr.prompt_id
WHERE p.is_public = true
GROUP BY p.id
ORDER BY p.upvotes DESC, save_count DESC;

-- View for trending workflows
CREATE VIEW trending_workflows AS
SELECT
  w.id,
  w.author_id,
  w.title,
  w.description,
  w.problem_statement,
  w.solution_overview,
  w.tools_used,
  w.tech_stack,
  w.difficulty,
  w.estimated_time_saved_minutes,
  w.steps,
  w.prerequisites,
  w.tips_and_tricks,
  w.common_pitfalls,
  w.upvotes,
  w.downvotes,
  w.view_count,
  w.save_count,
  w.is_featured,
  w.is_public,
  w.tags,
  w.created_at,
  w.updated_at,
  COUNT(DISTINCT wc.id) as comment_count,
  w.upvotes - w.downvotes as score
FROM ai_workflows w
LEFT JOIN ai_workflow_comments wc ON w.id = wc.workflow_id
WHERE w.is_public = true
GROUP BY w.id, w.author_id, w.title, w.description, w.problem_statement, w.solution_overview,
         w.tools_used, w.tech_stack, w.difficulty, w.estimated_time_saved_minutes, w.steps,
         w.prerequisites, w.tips_and_tricks, w.common_pitfalls, w.upvotes, w.downvotes,
         w.view_count, w.save_count, w.is_featured, w.is_public, w.tags, w.created_at, w.updated_at
ORDER BY score DESC, w.view_count DESC, w.created_at DESC;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE ai_learning_paths IS 'Structured learning paths for AI tool mastery';
COMMENT ON TABLE ai_prompts IS 'Community-shared AI prompts with version control';
COMMENT ON TABLE ai_workflows IS 'Real-world workflows and use cases for AI tools';
COMMENT ON TABLE ai_tool_benchmarks IS 'Performance benchmarks from the AI tool sandbox';
COMMENT ON TABLE ai_certifications IS 'Available AI proficiency certifications';
COMMENT ON TABLE ai_productivity_metrics IS 'Track user productivity gains with AI tools';
