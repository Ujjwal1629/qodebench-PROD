-- Mock Interviews System Migration
-- AI-Powered Interview Practice with Voice Interaction

-- =====================================================
-- 1. CREATE ENUMS
-- =====================================================
CREATE TYPE interview_type AS ENUM ('behavioral', 'technical', 'system_design', 'frontend');
CREATE TYPE interview_difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE interview_status AS ENUM ('in_progress', 'completed', 'abandoned');
CREATE TYPE interview_company AS ENUM ('google', 'amazon', 'meta', 'microsoft', 'netflix', 'apple', 'general');

-- =====================================================
-- 2. CREATE INTERVIEW_SESSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interview_type interview_type NOT NULL,
  company interview_company DEFAULT 'general',
  difficulty interview_difficulty DEFAULT 'medium',
  status interview_status DEFAULT 'in_progress',

  -- Timing
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER, -- Calculated on completion

  -- Scoring
  overall_score DECIMAL(3,1), -- 0.0 to 10.0
  communication_score DECIMAL(3,1),
  technical_score DECIMAL(3,1),
  problem_solving_score DECIMAL(3,1),

  -- Data
  transcript JSONB, -- Array of {role: 'ai'|'user', text, timestamp}
  ai_feedback JSONB, -- Detailed AI analysis
  questions_answered INTEGER DEFAULT 0,
  hints_used INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. CREATE INTERVIEW_QUESTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS interview_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type interview_type NOT NULL,
  company interview_company DEFAULT 'general',
  difficulty interview_difficulty NOT NULL,
  category VARCHAR(100), -- e.g., 'arrays', 'leadership', 'scalability'

  question_text TEXT NOT NULL,
  context TEXT, -- Additional context or constraints
  expected_approach TEXT, -- What good answer includes
  sample_answer TEXT, -- Example good answer
  follow_up_questions TEXT[], -- AI can ask these

  tags TEXT[], -- ['hash-map', 'optimization', etc]
  estimated_time_minutes INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. CREATE INTERVIEW_RESPONSES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS interview_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES interview_questions(id),

  user_answer TEXT NOT NULL,
  response_time_seconds INTEGER,
  hints_used INTEGER DEFAULT 0,

  -- AI Evaluation
  quality_score DECIMAL(3,1), -- 0.0 to 10.0
  ai_evaluation JSONB, -- {strengths: [], weaknesses: [], suggestions: []}

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. CREATE INTERVIEW_HINTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS interview_hints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES interview_questions(id),

  hint_level INTEGER NOT NULL CHECK (hint_level BETWEEN 1 AND 3),
  hint_text TEXT NOT NULL,
  revealed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. CREATE INDEXES
-- =====================================================
CREATE INDEX idx_interview_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX idx_interview_sessions_status ON interview_sessions(status);
CREATE INDEX idx_interview_sessions_created_at ON interview_sessions(created_at DESC);
CREATE INDEX idx_interview_questions_type_difficulty ON interview_questions(type, difficulty);
CREATE INDEX idx_interview_questions_company ON interview_questions(company);
CREATE INDEX idx_interview_responses_session_id ON interview_responses(session_id);
CREATE INDEX idx_interview_hints_session_id ON interview_hints(session_id);

-- =====================================================
-- 7. ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_hints ENABLE ROW LEVEL SECURITY;

-- Sessions: Users can only view/manage their own
DROP POLICY IF EXISTS "Users can view own sessions" ON interview_sessions;
CREATE POLICY "Users can view own sessions"
  ON interview_sessions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own sessions" ON interview_sessions;
CREATE POLICY "Users can create own sessions"
  ON interview_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own sessions" ON interview_sessions;
CREATE POLICY "Users can update own sessions"
  ON interview_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Questions: All authenticated users can read
DROP POLICY IF EXISTS "Anyone can view active questions" ON interview_questions;
CREATE POLICY "Anyone can view active questions"
  ON interview_questions FOR SELECT
  USING (is_active = true);

-- Responses: Users can only view/create their own
DROP POLICY IF EXISTS "Users can view own responses" ON interview_responses;
CREATE POLICY "Users can view own responses"
  ON interview_responses FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM interview_sessions
    WHERE interview_sessions.id = interview_responses.session_id
    AND interview_sessions.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can create own responses" ON interview_responses;
CREATE POLICY "Users can create own responses"
  ON interview_responses FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM interview_sessions
    WHERE interview_sessions.id = interview_responses.session_id
    AND interview_sessions.user_id = auth.uid()
  ));

-- Hints: Users can only view/create their own
DROP POLICY IF EXISTS "Users can view own hints" ON interview_hints;
CREATE POLICY "Users can view own hints"
  ON interview_hints FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM interview_sessions
    WHERE interview_sessions.id = interview_hints.session_id
    AND interview_sessions.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can create own hints" ON interview_hints;
CREATE POLICY "Users can create own hints"
  ON interview_hints FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM interview_sessions
    WHERE interview_sessions.id = interview_hints.session_id
    AND interview_sessions.user_id = auth.uid()
  ));

-- =====================================================
-- 8. SEED BEHAVIORAL QUESTIONS (50 questions)
-- =====================================================
INSERT INTO interview_questions (type, company, difficulty, category, question_text, context, expected_approach, sample_answer, follow_up_questions, tags, estimated_time_minutes) VALUES

-- Easy Behavioral
('behavioral', 'general', 'easy', 'teamwork',
  'Tell me about a time when you worked on a team project.',
  'Focus on your specific role and contribution',
  'Use STAR method: Situation, Task, Action, Result',
  'In my last project, we had to build a dashboard in 2 weeks. I took ownership of the backend API, coordinated with frontend team, and delivered 2 days early.',
  ARRAY['What was your specific contribution?', 'How did you handle disagreements?'],
  ARRAY['teamwork', 'collaboration', 'STAR'],
  3),

('behavioral', 'general', 'easy', 'problem-solving',
  'Describe a challenge you faced and how you overcame it.',
  'Be specific about the problem and your solution',
  'Show problem-solving skills and resilience',
  'When our deployment failed in production, I quickly rolled back, analyzed logs, found the race condition, implemented a fix with proper testing, and redeployed successfully.',
  ARRAY['What did you learn from this?', 'How did you prevent it in future?'],
  ARRAY['problem-solving', 'debugging', 'resilience'],
  3),

-- Medium Behavioral
('behavioral', 'amazon', 'medium', 'leadership',
  'Tell me about a time you had to make a decision without complete information.',
  'Amazon Leadership Principle: Bias for Action',
  'Show calculated risk-taking and decision-making',
  'We had to choose between two architecture approaches with incomplete performance data. I ran quick prototypes, gathered feedback, made a decision based on available info, and it worked out well.',
  ARRAY['What if you had made the wrong decision?', 'How did you mitigate risks?'],
  ARRAY['leadership', 'decision-making', 'amazon'],
  4),

('behavioral', 'google', 'medium', 'innovation',
  'Describe a time when you thought outside the box to solve a problem.',
  'Google values innovation and creative thinking',
  'Show creative problem-solving',
  'Our build times were 30 minutes. Instead of optimizing code, I implemented caching layers and parallel builds, reducing it to 5 minutes - a 83% improvement.',
  ARRAY['How did you come up with that idea?', 'What was the impact?'],
  ARRAY['innovation', 'optimization', 'google'],
  4),

-- Hard Behavioral
('behavioral', 'meta', 'hard', 'conflict',
  'Tell me about a time you disagreed with your manager or team lead.',
  'Meta Move Fast - show courage to speak up',
  'Show respectful disagreement and resolution',
  'My manager wanted to rush a feature. I presented data showing tech debt risks, proposed a phased approach, and convinced the team to do it right. Saved us 2 weeks of bug fixes later.',
  ARRAY['How did you present your concerns?', 'What if they still disagreed?'],
  ARRAY['conflict', 'communication', 'meta'],
  5),

-- More Easy Behavioral
('behavioral', 'general', 'easy', 'communication',
  'Describe a time when you had to explain a technical concept to a non-technical person.',
  'Focus on clarity and empathy',
  'Show communication skills and adaptability',
  'I had to explain our API architecture to marketing team. I used simple analogies like "APIs are like restaurant menus" and drew visual diagrams. They understood and could make better decisions.',
  ARRAY['How did you know they understood?', 'What analogies did you use?'],
  ARRAY['communication', 'technical-writing', 'empathy'],
  3),

('behavioral', 'general', 'easy', 'learning',
  'Tell me about a time you learned a new technology or skill quickly.',
  'Show adaptability and learning approach',
  'Demonstrate self-learning ability',
  'When we switched to TypeScript, I spent a weekend doing tutorials, converted a small component, got feedback, and within 2 weeks was writing production TS code confidently.',
  ARRAY['What resources did you use?', 'How do you approach learning?'],
  ARRAY['learning', 'adaptability', 'typescript'],
  3),

('behavioral', 'general', 'easy', 'time-management',
  'Describe how you prioritize tasks when you have multiple deadlines.',
  'Show organizational skills',
  'Explain prioritization framework',
  'I use Eisenhower Matrix: urgent+important first. I also communicate with stakeholders to align on priorities. When backend migration and UI bug both came up, I confirmed UI bug affected customers, so prioritized that.',
  ARRAY['How do you communicate priorities?', 'What tools do you use?'],
  ARRAY['time-management', 'prioritization', 'organization'],
  3),

-- More Medium Behavioral
('behavioral', 'google', 'medium', 'problem-solving',
  'Tell me about the most complex technical problem you solved.',
  'Google values deep technical problem-solving',
  'Show technical depth and systematic approach',
  'Our app had memory leaks causing crashes. I profiled with Chrome DevTools, found leaked event listeners, implemented proper cleanup in useEffect, added ESLint rules to prevent future leaks. Crashes dropped 95%.',
  ARRAY['How did you identify it was memory leaks?', 'How did you prevent it from happening again?'],
  ARRAY['debugging', 'performance', 'google'],
  5),

('behavioral', 'amazon', 'medium', 'ownership',
  'Describe a time you took on something outside your direct responsibility.',
  'Amazon Leadership Principle: Ownership',
  'Show initiative and ownership mindset',
  'Noticed our docs were outdated causing support tickets. Not my job, but I spent evenings updating them, added contribution guide, automated doc generation from code comments. Support tickets down 40%.',
  ARRAY['Why did you do this?', 'What was the impact?'],
  ARRAY['ownership', 'initiative', 'amazon'],
  4),

('behavioral', 'meta', 'medium', 'speed',
  'Tell me about a time you had to deliver something quickly without sacrificing quality.',
  'Meta Move Fast - balancing speed and quality',
  'Show pragmatism and quality focus',
  'Had 3 days to add auth before demo. I used OAuth library instead of building custom, wrote comprehensive tests, added monitoring. Delivered on time with production-ready code.',
  ARRAY['How did you ensure quality?', 'What corners did you cut?'],
  ARRAY['speed', 'quality', 'meta'],
  4),

('behavioral', 'microsoft', 'medium', 'collaboration',
  'Describe a time you collaborated with a difficult teammate.',
  'Microsoft values teamwork and collaboration',
  'Show emotional intelligence',
  'Team member kept blocking my PRs with nitpicks. I scheduled 1:1, learned they valued code quality from past bugs. We agreed on linting rules and style guide. PRs became faster, relationship improved.',
  ARRAY['What did you learn?', 'How did it change your approach?'],
  ARRAY['collaboration', 'conflict-resolution', 'microsoft'],
  4),

('behavioral', 'apple', 'medium', 'design',
  'Tell me about a time you focused on user experience in your work.',
  'Apple values design and user experience',
  'Show user empathy and design thinking',
  'Users complained our form was confusing. I did user testing, found they missed error messages. I redesigned with inline validation, better error placement, loading states. Error rate dropped 60%.',
  ARRAY['How did you test the new design?', 'What metrics did you track?'],
  ARRAY['ux-design', 'user-research', 'apple'],
  5),

-- More Hard Behavioral
('behavioral', 'google', 'hard', 'failure',
  'Tell me about your biggest failure and what you learned.',
  'Google values growth mindset and learning',
  'Show vulnerability and learning',
  'I pushed a breaking change to prod without proper testing. Took down service for 2 hours. I owned it, led incident response, implemented automated integration tests, staging environment, and deployment checklist. Never happened again.',
  ARRAY['How did you handle the pressure?', 'What systems did you put in place?'],
  ARRAY['failure', 'accountability', 'google'],
  6),

('behavioral', 'amazon', 'hard', 'scale',
  'Describe a time you had to make a decision that affected the whole team or company.',
  'Amazon Think Big principle',
  'Show strategic thinking and impact',
  'Our monolith was slowing team down. I proposed microservices, created RFC, ran pilot, showed 3x faster deploys and better scalability. Convinced leadership, led migration over 6 months. Now 5 teams can deploy independently.',
  ARRAY['How did you get buy-in?', 'What were the risks?'],
  ARRAY['architecture', 'leadership', 'amazon'],
  6),

('behavioral', 'netflix', 'hard', 'culture',
  'Tell me about a time you had to give difficult feedback to someone.',
  'Netflix values candor and direct communication',
  'Show courage and direct communication',
  'Junior dev was shipping buggy code repeatedly. I gave direct feedback with specific examples, offered pairing sessions, set clear expectations. They appreciated the honesty, improved significantly, now mentor others.',
  ARRAY['How did they react?', 'Would you do it differently?'],
  ARRAY['feedback', 'management', 'netflix'],
  5),

('behavioral', 'general', 'medium', 'pressure',
  'Describe how you handle high-pressure situations.',
  'Show resilience and composure',
  'Demonstrate stress management',
  'During Black Friday, traffic spiked 10x and services were degrading. I stayed calm, enabled caching, scaled instances, disabled non-critical features. Kept system stable while team fixed root cause.',
  ARRAY['What helps you stay calm?', 'How do you prioritize under pressure?'],
  ARRAY['pressure', 'incident-response', 'scalability'],
  4),

('behavioral', 'general', 'medium', 'mentorship',
  'Tell me about a time you helped someone grow professionally.',
  'Show leadership and mentorship',
  'Demonstrate teaching ability',
  'Mentored intern who struggled with React. I did weekly code reviews, pair programming, shared resources, and gradually gave them more autonomy. By end of summer, they shipped major feature independently.',
  ARRAY['What was your approach?', 'How did you measure their growth?'],
  ARRAY['mentorship', 'leadership', 'teaching'],
  4),

('behavioral', 'general', 'easy', 'mistake',
  'Tell me about a mistake you made and how you handled it.',
  'Show accountability and learning',
  'Demonstrate ownership',
  'I accidentally deleted test database entries. I immediately informed team, restored from backup, added confirmation prompts to dangerous operations, documented the incident. Team appreciated transparency.',
  ARRAY['What did you learn?', 'How did you prevent it?'],
  ARRAY['accountability', 'mistakes', 'learning'],
  3),

('behavioral', 'general', 'easy', 'feedback',
  'Describe a time you received constructive criticism.',
  'Show receptiveness to feedback',
  'Demonstrate growth mindset',
  'Manager said my code reviews were too harsh. I reflected, realized I was right but not kind. Started praising good things first, asking questions instead of demanding changes. Team feedback improved.',
  ARRAY['How did you feel?', 'What changed?'],
  ARRAY['feedback', 'growth', 'communication'],
  3),

('behavioral', 'google', 'medium', 'data-driven',
  'Tell me about a time you used data to make a decision.',
  'Google values data-driven decisions',
  'Show analytical thinking',
  'Team debated whether to rewrite component. I added performance monitoring, collected data for 2 weeks, found it was fine for 95% of users. We optimized the slow path instead of rewriting. Saved 3 weeks.',
  ARRAY['What data did you collect?', 'How did you present findings?'],
  ARRAY['data-driven', 'analytics', 'google'],
  4),

('behavioral', 'amazon', 'hard', 'frugality',
  'Describe a time you delivered results with limited resources.',
  'Amazon Frugality principle',
  'Show resourcefulness',
  'Budget cut meant no new tools. I used free open-source alternatives, automated manual tasks with scripts, repurposed existing infrastructure. Delivered same quality with 50% less spending.',
  ARRAY['What tradeoffs did you make?', 'What would you have done with more resources?'],
  ARRAY['frugality', 'resourcefulness', 'amazon'],
  5),

('behavioral', 'meta', 'hard', 'impact',
  'Tell me about the biggest impact you had in your role.',
  'Meta Focus on Impact principle',
  'Show business impact and metrics',
  'Identified that slow page loads hurt conversion. I implemented code splitting, lazy loading, image optimization, CDN. Page load time from 8s to 2s. Conversion rate increased 15%, adding $2M annual revenue.',
  ARRAY['How did you measure impact?', 'What was the hardest part?'],
  ARRAY['impact', 'performance', 'meta'],
  6),

('behavioral', 'general', 'medium', 'remote-work',
  'How do you stay productive when working remotely?',
  'Show self-management skills',
  'Demonstrate remote work practices',
  'I set dedicated workspace, use Pomodoro technique, over-communicate in Slack, schedule virtual coffee chats. I also set boundaries - work hours end at 6pm. Productivity actually increased.',
  ARRAY['What tools do you use?', 'How do you collaborate remotely?'],
  ARRAY['remote-work', 'productivity', 'communication'],
  3),

('behavioral', 'netflix', 'medium', 'judgment',
  'Tell me about a time you had to make a decision with incomplete information.',
  'Netflix values good judgment',
  'Show decision-making under uncertainty',
  'Had to choose database for new service: SQL vs NoSQL. Both had pros/cons, no clear winner. I ran small prototype with both, evaluated performance, chose PostgreSQL for ACID guarantees. Right call for our use case.',
  ARRAY['What information was missing?', 'How did you minimize risk?'],
  ARRAY['decision-making', 'judgment', 'netflix'],
  4),

('behavioral', 'apple', 'hard', 'quality',
  'Describe a time you refused to compromise on quality.',
  'Apple values perfection and quality',
  'Show commitment to excellence',
  'PM wanted to ship feature with known bugs to hit deadline. I pushed back, showed potential user impact, proposed phased rollout instead. We delayed 1 week, shipped polished feature, got great user reviews.',
  ARRAY['How did you convince them?', 'Was it worth the delay?'],
  ARRAY['quality', 'standards', 'apple'],
  5),

('behavioral', 'general', 'easy', 'success',
  'Tell me about a project you are proud of.',
  'Show passion and achievement',
  'Highlight your best work',
  'Built real-time collaborative editor using CRDTs and WebSockets. Challenging technically but loved solving the consistency problems. Users love it, now core product feature with 50K daily users.',
  ARRAY['What made it challenging?', 'What would you do differently?'],
  ARRAY['achievement', 'pride', 'technical'],
  3),

('behavioral', 'microsoft', 'medium', 'customer-focus',
  'Tell me about a time you went above and beyond for a customer.',
  'Microsoft Customer Obsessed principle',
  'Show customer empathy',
  'Customer reported data export broken. Was late Friday, not critical bug. I investigated anyway, found edge case, deployed fix, personally emailed customer with solution. They became advocates.',
  ARRAY['Why did you do this?', 'What was the impact?'],
  ARRAY['customer-focus', 'service', 'microsoft'],
  4),

('behavioral', 'general', 'medium', 'technical-debt',
  'How do you balance new features with technical debt?',
  'Show pragmatic engineering judgment',
  'Demonstrate strategic thinking',
  'I use 80/20 rule: 80% features, 20% tech debt. I track debt in backlog, make case to PM with metrics (build time, bug rate). We dedicate every 5th sprint to refactoring.',
  ARRAY['How do you convince PMs?', 'When do you say no to features?'],
  ARRAY['technical-debt', 'strategy', 'engineering'],
  4),

('behavioral', 'google', 'easy', 'curiosity',
  'What technology are you excited about right now?',
  'Google values curiosity and innovation',
  'Show genuine interest in tech',
  'Really excited about AI agents and LLMs like GPT-4. Building coding assistant that helps with boilerplate. Already seeing 30% productivity gains. The possibilities are endless.',
  ARRAY['Why does this excite you?', 'How are you learning about it?'],
  ARRAY['curiosity', 'innovation', 'google'],
  3),

('behavioral', 'amazon', 'medium', 'dive-deep',
  'Describe a time you had to dig deep to find the root cause of a problem.',
  'Amazon Dive Deep principle',
  'Show thorough investigation skills',
  'Intermittent API failures stumped team for weeks. I analyzed logs, found pattern - failures correlated with database checkpoint writes. Tuned checkpoint settings, failures stopped. Root cause was I/O contention.',
  ARRAY['What tools did you use?', 'How long did it take?'],
  ARRAY['debugging', 'dive-deep', 'amazon'],
  5);

-- =====================================================
-- 9. SEED TECHNICAL QUESTIONS (30 questions)
-- =====================================================
INSERT INTO interview_questions (type, company, difficulty, category, question_text, context, expected_approach, sample_answer, follow_up_questions, tags, estimated_time_minutes) VALUES

('technical', 'general', 'easy', 'arrays',
  'Write a function to find two numbers in an array that sum to a target value.',
  'You can assume there is exactly one solution. Optimize for time complexity.',
  'Use hash map for O(n) solution',
  'function twoSum(nums, target) { const map = new Map(); for (let i = 0; i < nums.length; i++) { const complement = target - nums[i]; if (map.has(complement)) return [map.get(complement), i]; map.set(nums[i], i); } }',
  ARRAY['What is the time complexity?', 'Can you do it in one pass?', 'What about edge cases?'],
  ARRAY['arrays', 'hash-map', 'two-pointer'],
  10),

('technical', 'google', 'medium', 'trees',
  'Implement a function to validate if a binary tree is a valid binary search tree.',
  'A valid BST means all left descendants < node < all right descendants',
  'Use recursive approach with min/max bounds',
  'function isValidBST(node, min = -Infinity, max = Infinity) { if (!node) return true; if (node.val <= min || node.val >= max) return false; return isValidBST(node.left, min, node.val) && isValidBST(node.right, node.val, max); }',
  ARRAY['What if there are duplicates?', 'Can you do it iteratively?'],
  ARRAY['binary-tree', 'recursion', 'validation'],
  15),

('technical', 'amazon', 'easy', 'strings',
  'Write a function to reverse a string.',
  'Consider multiple approaches and discuss tradeoffs',
  'Discuss built-in methods vs manual approach',
  'function reverseString(s) { return s.split("").reverse().join(""); } // Or: for loop from end to start',
  ARRAY['What is time complexity?', 'How would you reverse in-place?'],
  ARRAY['strings', 'arrays', 'basic'],
  8),

('technical', 'general', 'easy', 'arrays',
  'Find the maximum element in an array.',
  'Consider edge cases like empty arrays',
  'Use Math.max or iterate through array',
  'function findMax(arr) { if (!arr.length) return null; return Math.max(...arr); } // Or: let max = arr[0]; for (let num of arr) if (num > max) max = num;',
  ARRAY['What about empty array?', 'What is space complexity?'],
  ARRAY['arrays', 'iteration', 'basic'],
  8),

('technical', 'meta', 'medium', 'arrays',
  'Find all pairs of numbers in an array that sum to zero.',
  'Input: [-3, -1, 1, 2, 3]. Output: [[-3, 3], [-1, 1]]',
  'Use hash set for O(n) solution',
  'function findPairsWithSumZero(arr) { const seen = new Set(); const pairs = []; for (let num of arr) { if (seen.has(-num)) pairs.push([num, -num]); seen.add(num); } return pairs; }',
  ARRAY['How do you avoid duplicates?', 'What about triplets that sum to zero?'],
  ARRAY['arrays', 'hash-set', 'two-pointer'],
  12),

('technical', 'google', 'medium', 'dynamic-programming',
  'Calculate the nth Fibonacci number. Optimize for large n.',
  'Naive recursion is O(2^n). Can you do better?',
  'Use dynamic programming or memoization',
  'function fib(n, memo = {}) { if (n <= 1) return n; if (memo[n]) return memo[n]; memo[n] = fib(n-1, memo) + fib(n-2, memo); return memo[n]; } // O(n) time, O(n) space',
  ARRAY['Can you do it iteratively?', 'Can you do it in O(1) space?'],
  ARRAY['dynamic-programming', 'recursion', 'memoization'],
  15),

('technical', 'microsoft', 'easy', 'strings',
  'Check if a string is a palindrome.',
  'Ignore spaces, punctuation, and case',
  'Two-pointer approach from both ends',
  'function isPalindrome(s) { s = s.toLowerCase().replace(/[^a-z0-9]/g, ""); let left = 0, right = s.length - 1; while (left < right) { if (s[left] !== s[right]) return false; left++; right--; } return true; }',
  ARRAY['What is time complexity?', 'How would you handle Unicode?'],
  ARRAY['strings', 'two-pointer', 'palindrome'],
  10),

('technical', 'amazon', 'medium', 'arrays',
  'Given an array, find the subarray with the maximum sum (Kadanes algorithm).',
  'Input: [-2,1,-3,4,-1,2,1,-5,4]. Output: 6 ([4,-1,2,1])',
  'Use Kadanes algorithm for O(n) solution',
  'function maxSubArray(nums) { let maxSum = nums[0], currentSum = nums[0]; for (let i = 1; i < nums.length; i++) { currentSum = Math.max(nums[i], currentSum + nums[i]); maxSum = Math.max(maxSum, currentSum); } return maxSum; }',
  ARRAY['Can you return the actual subarray?', 'What if all numbers are negative?'],
  ARRAY['arrays', 'dynamic-programming', 'kadanes'],
  15),

('technical', 'google', 'hard', 'graphs',
  'Implement a function to detect a cycle in a directed graph.',
  'Use depth-first search with recursion stack',
  'Track visited nodes and recursion stack',
  'function hasCycle(graph) { const visited = new Set(); const recStack = new Set(); function dfs(node) { visited.add(node); recStack.add(node); for (let neighbor of graph[node]) { if (!visited.has(neighbor) && dfs(neighbor)) return true; if (recStack.has(neighbor)) return true; } recStack.delete(node); return false; } for (let node in graph) if (!visited.has(node) && dfs(node)) return true; return false; }',
  ARRAY['What about undirected graphs?', 'Can you find all cycles?'],
  ARRAY['graphs', 'dfs', 'cycle-detection'],
  20),

('technical', 'netflix', 'medium', 'strings',
  'Implement a function to find the longest substring without repeating characters.',
  'Input: "abcabcbb". Output: 3 ("abc")',
  'Use sliding window with hash map',
  'function lengthOfLongestSubstring(s) { const seen = new Map(); let left = 0, maxLen = 0; for (let right = 0; right < s.length; right++) { if (seen.has(s[right])) left = Math.max(left, seen.get(s[right]) + 1); seen.set(s[right], right); maxLen = Math.max(maxLen, right - left + 1); } return maxLen; }',
  ARRAY['What is time complexity?', 'Can you return the actual substring?'],
  ARRAY['strings', 'sliding-window', 'hash-map'],
  15),

('technical', 'apple', 'easy', 'arrays',
  'Remove duplicates from a sorted array in-place.',
  'Modify array in-place and return new length',
  'Use two pointers',
  'function removeDuplicates(nums) { if (!nums.length) return 0; let i = 0; for (let j = 1; j < nums.length; j++) { if (nums[j] !== nums[i]) { i++; nums[i] = nums[j]; } } return i + 1; }',
  ARRAY['What if array is not sorted?', 'What is space complexity?'],
  ARRAY['arrays', 'two-pointer', 'in-place'],
  10),

('technical', 'general', 'medium', 'linked-list',
  'Reverse a linked list.',
  'Can you do it iteratively and recursively?',
  'Use three pointers: prev, current, next',
  'function reverseList(head) { let prev = null, current = head; while (current) { let next = current.next; current.next = prev; prev = current; current = next; } return prev; }',
  ARRAY['How would you reverse recursively?', 'What about reversing only part of the list?'],
  ARRAY['linked-list', 'pointers', 'iteration'],
  12),

('technical', 'google', 'hard', 'arrays',
  'Find median of two sorted arrays.',
  'Arrays can be different sizes. Optimize to O(log(min(m,n)))',
  'Use binary search on smaller array',
  'function findMedianSortedArrays(nums1, nums2) { if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1); let m = nums1.length, n = nums2.length; let left = 0, right = m; while (left <= right) { let partition1 = Math.floor((left + right) / 2); let partition2 = Math.floor((m + n + 1) / 2) - partition1; /* ... binary search logic ... */ } }',
  ARRAY['Can you explain the binary search approach?', 'What if we merged arrays first?'],
  ARRAY['arrays', 'binary-search', 'hard'],
  25),

('technical', 'amazon', 'medium', 'stacks',
  'Implement a function to validate balanced parentheses.',
  'Input: "([{}])". Output: true. Input: "([)]". Output: false',
  'Use stack to track opening brackets',
  'function isValid(s) { const stack = []; const map = {"(": ")", "[": "]", "{": "}"}; for (let char of s) { if (map[char]) stack.push(char); else if (!stack.length || map[stack.pop()] !== char) return false; } return !stack.length; }',
  ARRAY['What is time complexity?', 'How would you handle nested brackets?'],
  ARRAY['stacks', 'strings', 'validation'],
  12),

('technical', 'meta', 'hard', 'dynamic-programming',
  'Given a set of coin denominations and a target amount, find minimum number of coins needed.',
  'Input: coins = [1,2,5], amount = 11. Output: 3 (5+5+1)',
  'Use dynamic programming with bottom-up approach',
  'function coinChange(coins, amount) { const dp = Array(amount + 1).fill(Infinity); dp[0] = 0; for (let coin of coins) { for (let i = coin; i <= amount; i++) { dp[i] = Math.min(dp[i], dp[i - coin] + 1); } } return dp[amount] === Infinity ? -1 : dp[amount]; }',
  ARRAY['Can you print the actual coins used?', 'What if we want all possible combinations?'],
  ARRAY['dynamic-programming', 'optimization', 'coins'],
  20),

('technical', 'microsoft', 'medium', 'trees',
  'Find the lowest common ancestor of two nodes in a binary tree.',
  'Assume both nodes exist in the tree',
  'Use recursive approach',
  'function lowestCommonAncestor(root, p, q) { if (!root || root === p || root === q) return root; const left = lowestCommonAncestor(root.left, p, q); const right = lowestCommonAncestor(root.right, p, q); if (left && right) return root; return left || right; }',
  ARRAY['What if nodes might not exist?', 'Can you do it iteratively?'],
  ARRAY['trees', 'recursion', 'lca'],
  15),

('technical', 'netflix', 'easy', 'arrays',
  'Rotate an array to the right by k steps.',
  'Input: [1,2,3,4,5], k=2. Output: [4,5,1,2,3]',
  'Use array reversal technique',
  'function rotate(nums, k) { k = k % nums.length; reverse(nums, 0, nums.length - 1); reverse(nums, 0, k - 1); reverse(nums, k, nums.length - 1); } function reverse(arr, start, end) { while (start < end) { [arr[start], arr[end]] = [arr[end], arr[start]]; start++; end--; } }',
  ARRAY['Can you do it in O(1) space?', 'What if k > array length?'],
  ARRAY['arrays', 'rotation', 'in-place'],
  10),

('technical', 'apple', 'medium', 'strings',
  'Implement string compression. "aaabbc" becomes "a3b2c1".',
  'Return original if compressed is not shorter',
  'Count consecutive characters',
  'function compress(s) { let result = "", count = 1; for (let i = 0; i < s.length; i++) { if (s[i] === s[i + 1]) count++; else { result += s[i] + count; count = 1; } } return result.length < s.length ? result : s; }',
  ARRAY['How would you decompress?', 'What about case sensitivity?'],
  ARRAY['strings', 'compression', 'iteration'],
  12),

('technical', 'google', 'hard', 'backtracking',
  'Generate all valid combinations of n pairs of parentheses.',
  'Input: n=3. Output: ["((()))","(()())","(())()","()(())","()()()"]',
  'Use backtracking with open/close counters',
  'function generateParenthesis(n) { const result = []; function backtrack(current, open, close) { if (current.length === 2 * n) { result.push(current); return; } if (open < n) backtrack(current + "(", open + 1, close); if (close < open) backtrack(current + ")", open, close + 1); } backtrack("", 0, 0); return result; }',
  ARRAY['Can you explain the backtracking approach?', 'How would you validate existing parentheses?'],
  ARRAY['backtracking', 'recursion', 'strings'],
  20),

('technical', 'amazon', 'hard', 'arrays',
  'Trapping rain water: Given heights, calculate how much water can be trapped.',
  'Input: [0,1,0,2,1,0,1,3,2,1,2,1]. Output: 6',
  'Use two pointers from both ends',
  'function trap(height) { let left = 0, right = height.length - 1; let leftMax = 0, rightMax = 0, water = 0; while (left < right) { if (height[left] < height[right]) { height[left] >= leftMax ? leftMax = height[left] : water += leftMax - height[left]; left++; } else { height[right] >= rightMax ? rightMax = height[right] : water += rightMax - height[right]; right--; } } return water; }',
  ARRAY['Can you explain the two-pointer logic?', 'What is space complexity?'],
  ARRAY['arrays', 'two-pointer', 'hard'],
  25),

('technical', 'meta', 'medium', 'trees',
  'Serialize and deserialize a binary tree.',
  'Convert tree to string and back to tree',
  'Use pre-order traversal with null markers',
  'function serialize(root) { if (!root) return "null"; return root.val + "," + serialize(root.left) + "," + serialize(root.right); } function deserialize(data) { const values = data.split(","); let i = 0; function build() { if (values[i] === "null") { i++; return null; } const node = { val: parseInt(values[i++]), left: null, right: null }; node.left = build(); node.right = build(); return node; } return build(); }',
  ARRAY['Why use pre-order?', 'How would you handle large trees?'],
  ARRAY['trees', 'serialization', 'recursion'],
  18),

('technical', 'microsoft', 'easy', 'math',
  'Check if a number is prime.',
  'Optimize for large numbers',
  'Check divisibility up to sqrt(n)',
  'function isPrime(n) { if (n <= 1) return false; if (n <= 3) return true; if (n % 2 === 0 || n % 3 === 0) return false; for (let i = 5; i * i <= n; i += 6) { if (n % i === 0 || n % (i + 2) === 0) return false; } return true; }',
  ARRAY['Why check up to sqrt(n)?', 'What about negative numbers?'],
  ARRAY['math', 'prime', 'optimization'],
  10),

('technical', 'netflix', 'hard', 'graphs',
  'Word ladder: Find shortest transformation sequence from start word to end word.',
  'Each transformation changes exactly one letter. All words must be in dictionary.',
  'Use BFS for shortest path',
  'function ladderLength(beginWord, endWord, wordList) { const wordSet = new Set(wordList); if (!wordSet.has(endWord)) return 0; const queue = [[beginWord, 1]]; while (queue.length) { const [word, level] = queue.shift(); if (word === endWord) return level; for (let i = 0; i < word.length; i++) { for (let c = 97; c <= 122; c++) { const newWord = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1); if (wordSet.has(newWord)) { queue.push([newWord, level + 1]); wordSet.delete(newWord); } } } } return 0; }',
  ARRAY['Why use BFS instead of DFS?', 'How would you print the actual path?'],
  ARRAY['graphs', 'bfs', 'strings'],
  25),

('technical', 'apple', 'medium', 'arrays',
  'Find kth largest element in an unsorted array.',
  'Input: [3,2,1,5,6,4], k=2. Output: 5',
  'Use quickselect or min heap',
  'function findKthLargest(nums, k) { // Using min heap approach: const minHeap = nums.slice(0, k).sort((a,b) => a-b); for (let i = k; i < nums.length; i++) { if (nums[i] > minHeap[0]) { minHeap[0] = nums[i]; minHeap.sort((a,b) => a-b); } } return minHeap[0]; }',
  ARRAY['Can you use quickselect?', 'What is average time complexity?'],
  ARRAY['arrays', 'heap', 'quickselect'],
  15);

-- =====================================================
-- 10. SEED SYSTEM DESIGN QUESTIONS (20 questions)
-- =====================================================
INSERT INTO interview_questions (type, company, difficulty, category, question_text, context, expected_approach, sample_answer, follow_up_questions, tags, estimated_time_minutes) VALUES

('system_design', 'general', 'medium', 'scalability',
  'Design a URL shortening service like bit.ly',
  'Should handle millions of URLs per day, low latency reads',
  'Discuss: API design, database schema, hash function, caching, scaling',
  'Use base62 encoding for short URLs, Redis cache for hot URLs, SQL for persistence, load balancer + multiple app servers, CDN for static content',
  ARRAY['How do you handle collisions?', 'How would you scale to billions of URLs?', 'What about analytics?'],
  ARRAY['system-design', 'scalability', 'caching'],
  25),

('system_design', 'netflix', 'hard', 'high-availability',
  'Design a video streaming service like Netflix',
  'Must handle millions of concurrent streams, different resolutions, global users',
  'Discuss: CDN strategy, encoding pipeline, recommendation system, fault tolerance',
  'CDN edge servers for video delivery, adaptive bitrate streaming, microservices architecture, Cassandra for user data, Kafka for events, circuit breakers for resilience',
  ARRAY['How do you handle peak traffic?', 'What about offline downloads?', 'How do recommendations work?'],
  ARRAY['streaming', 'cdn', 'microservices', 'high-availability'],
  30),

('system_design', 'meta', 'medium', 'social-media',
  'Design a news feed system like Facebook or Instagram',
  'Users should see posts from friends in reverse chronological order with ranking',
  'Discuss: Data model, feed generation (push vs pull), caching, ranking algorithm',
  'User graph in graph database, posts in NoSQL, fan-out on write for active users, Redis cache for feeds, ML ranking for relevance, CDN for images',
  ARRAY['How do you handle celebrities with millions of followers?', 'What about real-time updates?'],
  ARRAY['social-media', 'feed', 'caching', 'meta'],
  25),

('system_design', 'google', 'medium', 'search',
  'Design a web crawler for a search engine',
  'Must be polite, scalable, and handle billions of pages',
  'Discuss: URL frontier, politeness policy, duplicate detection, distributed crawling',
  'URL queue with priority, robots.txt parser, bloom filter for seen URLs, distributed workers with coordinator, DNS caching, content fingerprinting',
  ARRAY['How do you avoid crawler traps?', 'How do you handle dynamic content?'],
  ARRAY['crawler', 'distributed-systems', 'google'],
  20),

('system_design', 'amazon', 'hard', 'e-commerce',
  'Design an e-commerce system like Amazon',
  'Handle product catalog, inventory, orders, payments, recommendations',
  'Discuss: Microservices architecture, data consistency, payment processing, search',
  'Microservices: product, inventory, order, payment, recommendation. PostgreSQL for transactions, ElasticSearch for product search, Redis for cart, Kafka for events, Stripe for payments',
  ARRAY['How do you handle inventory consistency?', 'What about abandoned carts?'],
  ARRAY['e-commerce', 'microservices', 'amazon'],
  30),

('system_design', 'general', 'easy', 'storage',
  'Design a file storage service like Dropbox or Google Drive',
  'Users can upload, download, and sync files across devices',
  'Discuss: Storage, chunking, deduplication, sync protocol',
  'S3 for storage, files split into chunks (4MB), SHA-256 for deduplication, websockets for sync notifications, metadata in SQL, version history',
  ARRAY['How do you handle conflicts?', 'What about offline editing?'],
  ARRAY['storage', 'file-sync', 'deduplication'],
  20),

('system_design', 'microsoft', 'medium', 'collaboration',
  'Design a real-time collaborative document editor like Google Docs',
  'Multiple users editing same document simultaneously',
  'Discuss: Conflict resolution, operational transformation, WebSockets',
  'WebSockets for real-time updates, operational transformation or CRDTs for conflict resolution, MongoDB for documents, Redis for active sessions, autosave every 2 seconds',
  ARRAY['What are CRDTs?', 'How do you handle network partitions?'],
  ARRAY['collaboration', 'real-time', 'crdt', 'microsoft'],
  25),

('system_design', 'apple', 'medium', 'messaging',
  'Design a messaging app like WhatsApp or iMessage',
  'Support one-on-one and group chats, media sharing, read receipts',
  'Discuss: Message delivery, offline support, encryption, scaling',
  'WebSockets for delivery, Cassandra for message storage, push notifications for offline, end-to-end encryption, message queue for reliability, CDN for media',
  ARRAY['How do you handle group messages?', 'What about message ordering?'],
  ARRAY['messaging', 'real-time', 'encryption', 'apple'],
  25),

('system_design', 'google', 'hard', 'maps',
  'Design a navigation system like Google Maps',
  'Shortest path, real-time traffic, ETA calculation',
  'Discuss: Graph representation, routing algorithms, traffic data ingestion',
  'Road network as graph, Dijkstra or A* for routing, segment traffic data from users, ML for ETA prediction, tile-based map rendering, geocoding service',
  ARRAY['How do you incorporate real-time traffic?', 'What about offline maps?'],
  ARRAY['maps', 'graphs', 'routing', 'google'],
  30),

('system_design', 'netflix', 'medium', 'analytics',
  'Design a real-time analytics dashboard',
  'Track metrics like page views, active users, errors in real-time',
  'Discuss: Data collection, stream processing, visualization',
  'Event collection via SDKs, Kafka for streaming, Flink or Spark for processing, time-series DB (InfluxDB), websockets to push updates to dashboard',
  ARRAY['How do you handle high write throughput?', 'What about historical queries?'],
  ARRAY['analytics', 'streaming', 'time-series', 'netflix'],
  20),

('system_design', 'amazon', 'medium', 'queue',
  'Design a distributed task queue like Celery or RabbitMQ',
  'Process background jobs asynchronously at scale',
  'Discuss: Queue semantics, worker management, retry logic, dead letter queue',
  'Redis or Kafka as queue, worker pool with autoscaling, exponential backoff for retries, dead letter queue for failed tasks, idempotency for at-least-once delivery',
  ARRAY['How do you ensure exactly-once processing?', 'What about task priorities?'],
  ARRAY['queue', 'distributed-systems', 'async', 'amazon'],
  20),

('system_design', 'meta', 'hard', 'ads',
  'Design an ad serving system',
  'Serve relevant ads with low latency, track impressions and clicks',
  'Discuss: Ad selection, bidding, targeting, tracking, budget management',
  'Ad inventory in cache, ML for targeting, real-time bidding auction, event tracking via Kafka, budget tracking in Redis with INCR, fraud detection',
  ARRAY['How do you handle ad fraud?', 'What about privacy concerns?'],
  ARRAY['ads', 'auction', 'real-time', 'meta'],
  30),

('system_design', 'general', 'medium', 'cache',
  'Design a distributed cache like Redis or Memcached',
  'Store key-value pairs with TTL, handle high throughput',
  'Discuss: Eviction policies, consistent hashing, replication',
  'Consistent hashing for sharding, LRU eviction, master-replica for availability, write-through or write-behind, client-side caching',
  ARRAY['How do you handle cache invalidation?', 'What about hotspots?'],
  ARRAY['cache', 'distributed-systems', 'redis'],
  20),

('system_design', 'microsoft', 'easy', 'pastebin',
  'Design a text-sharing service like Pastebin',
  'Users can paste text and get a short URL to share',
  'Discuss: URL generation, storage, expiration',
  'Generate short URL with base62, store in SQL or NoSQL with TTL, CDN for reads, rate limiting for writes, optional encryption',
  ARRAY['How do you prevent abuse?', 'What about private pastes?'],
  ARRAY['url-shortener', 'storage', 'microsoft'],
  15),

('system_design', 'apple', 'hard', 'music',
  'Design a music streaming service like Spotify or Apple Music',
  'Millions of songs, playlists, recommendations, offline mode',
  'Discuss: Audio storage, streaming protocol, recommendation engine, licensing',
  'Audio files in S3 with CDN, adaptive bitrate streaming, collaborative filtering for recommendations, download for offline, licensing metadata, user activity tracking',
  ARRAY['How do you handle concurrent plays?', 'What about artist royalties?'],
  ARRAY['streaming', 'music', 'cdn', 'apple'],
  30),

('system_design', 'google', 'medium', 'notification',
  'Design a notification service for mobile and web',
  'Support push notifications, email, SMS at scale',
  'Discuss: Delivery channels, priority, deduplication, rate limiting',
  'Queue-based architecture, Firebase/APNs for mobile push, SendGrid for email, Twilio for SMS, user preferences in DB, deduplication by message hash, rate limiting per user',
  ARRAY['How do you handle delivery failures?', 'What about user preferences?'],
  ARRAY['notifications', 'messaging', 'distributed', 'google'],
  20),

('system_design', 'amazon', 'hard', 'recommendation',
  'Design a recommendation engine',
  'Suggest products, content, or connections based on user behavior',
  'Discuss: Collaborative filtering, content-based, hybrid approaches, cold start',
  'User-item interaction matrix, collaborative filtering (user-based or item-based), content features, hybrid model, offline batch training, online serving from cache, A/B testing',
  ARRAY['How do you handle cold start?', 'How do you measure quality?'],
  ARRAY['ml', 'recommendation', 'amazon'],
  25),

('system_design', 'meta', 'medium', 'rate-limiter',
  'Design a distributed rate limiter',
  'Limit API requests per user to prevent abuse',
  'Discuss: Algorithms (token bucket, leaky bucket, fixed window), distributed coordination',
  'Token bucket algorithm, Redis with INCR and EXPIRE, sliding window for accuracy, distributed with atomic operations, fallback to allow on Redis failure',
  ARRAY['How do you handle distributed clocks?', 'What about different rate limits per endpoint?'],
  ARRAY['rate-limiting', 'distributed-systems', 'meta'],
  20),

('system_design', 'netflix', 'easy', 'leaderboard',
  'Design a real-time leaderboard system',
  'Show top players by score, updated in real-time',
  'Discuss: Data structure, updates, queries, scalability',
  'Redis sorted sets for leaderboard, ZADD for updates, ZRANGE for queries, periodic snapshots to DB, websockets for real-time updates to clients',
  ARRAY['How do you handle ties?', 'What about historical leaderboards?'],
  ARRAY['leaderboard', 'redis', 'real-time', 'netflix'],
  15),

('system_design', 'google', 'hard', 'distributed-lock',
  'Design a distributed lock service',
  'Coordinate access to shared resources across multiple servers',
  'Discuss: Consensus algorithms, fault tolerance, performance',
  'Use Raft or Paxos for consensus, lock with TTL, heartbeat to maintain, fencing tokens to prevent split-brain, etcd or ZooKeeper as implementation',
  ARRAY['How do you handle network partitions?', 'What about deadlocks?'],
  ARRAY['distributed-systems', 'consensus', 'locks', 'google'],
  30),

('system_design', 'apple', 'medium', 'chat',
  'Design a live chat support system',
  'Connect customers with support agents in real-time',
  'Discuss: Routing, queue management, typing indicators, history',
  'WebSockets for real-time messaging, queue for waiting customers, agent availability tracking, message history in DB, typing indicators via events, sentiment analysis for routing',
  ARRAY['How do you handle agent transfers?', 'What about chat transcripts?'],
  ARRAY['chat', 'support', 'real-time', 'apple'],
  20);

-- =====================================================
-- 11. SEED FRONTEND/REACT QUESTIONS (25 questions)
-- =====================================================
INSERT INTO interview_questions (type, company, difficulty, category, question_text, context, expected_approach, sample_answer, follow_up_questions, tags, estimated_time_minutes) VALUES

('frontend', 'general', 'easy', 'hooks',
  'Explain the useState hook and when you would use it.',
  'Provide examples of state management in React',
  'Explain concept, syntax, and use cases',
  'useState is a Hook that lets you add state to functional components. const [count, setCount] = useState(0). Use it for component-level state like form inputs, toggles, counters',
  ARRAY['What about useEffect?', 'When would you use useReducer instead?'],
  ARRAY['react', 'hooks', 'state-management'],
  5),

('frontend', 'meta', 'medium', 'performance',
  'How would you optimize the performance of a React application with a large list?',
  'Consider virtualization, memoization, and rendering strategies',
  'Discuss: React.memo, useMemo, useCallback, virtualization, lazy loading',
  'Use react-window or react-virtualized for list virtualization (only render visible items), React.memo to prevent re-renders, useMemo for expensive calculations, lazy load images',
  ARRAY['What about infinite scroll?', 'How do you measure performance?'],
  ARRAY['react', 'performance', 'optimization'],
  10),

('frontend', 'google', 'easy', 'components',
  'What is the difference between controlled and uncontrolled components?',
  'Provide examples of each',
  'Explain state management in forms',
  'Controlled components have state managed by React (value prop + onChange). Uncontrolled use refs and DOM handles state. Example controlled: <input value={value} onChange={e => setValue(e.target.value)} />. Uncontrolled: <input ref={inputRef} />',
  ARRAY['When would you use each?', 'What about defaultValue?'],
  ARRAY['react', 'forms', 'controlled-components'],
  5),

('frontend', 'amazon', 'medium', 'hooks',
  'Explain useEffect and its cleanup function. When does cleanup run?',
  'Include dependency array behavior',
  'Cover common useEffect patterns',
  'useEffect runs after render. Cleanup runs before next effect and on unmount. Empty deps [] = run once. No deps = run every render. Deps [a, b] = run when a or b change. Cleanup example: return () => clearInterval(timer)',
  ARRAY['What about useLayoutEffect?', 'How do you handle async in useEffect?'],
  ARRAY['react', 'hooks', 'useEffect'],
  8),

('frontend', 'meta', 'hard', 'state-management',
  'Compare different state management solutions: Context, Redux, Zustand, Jotai',
  'Discuss tradeoffs and when to use each',
  'Show understanding of state management patterns',
  'Context: built-in, good for theme/auth but re-renders all consumers. Redux: powerful, boilerplate-heavy, good for complex apps. Zustand: lightweight, no boilerplate, good for medium apps. Jotai: atomic state, great for derived state',
  ARRAY['What about React Query?', 'When would you use each?'],
  ARRAY['react', 'state-management', 'architecture'],
  12),

('frontend', 'apple', 'medium', 'rendering',
  'Explain the difference between client-side and server-side rendering.',
  'Include Next.js SSR, SSG, and ISR',
  'Discuss SEO and performance implications',
  'CSR: renders in browser, fast navigation, slow initial load, poor SEO. SSR: renders on server, fast initial load, better SEO, higher server load. SSG: pre-rendered at build, fastest, static content. ISR: regenerate static pages periodically',
  ARRAY['What about React Server Components?', 'When would you use each?'],
  ARRAY['rendering', 'nextjs', 'ssr'],
  10),

('frontend', 'microsoft', 'easy', 'props',
  'How do you pass data from parent to child and child to parent in React?',
  'Include examples',
  'Show component communication patterns',
  'Parent to child: props. Child to parent: callback functions. Example: Parent passes handleClick to child, child calls it: <Child onClick={handleClick} />. Child: <button onClick={props.onClick}>Click</button>',
  ARRAY['What about Context?', 'What about sibling communication?'],
  ARRAY['react', 'props', 'component-communication'],
  6),

('frontend', 'netflix', 'medium', 'hooks',
  'Implement a custom hook for fetching data with loading and error states.',
  'Handle edge cases',
  'Show hook patterns',
  'function useFetch(url) { const [data, setData] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(null); useEffect(() => { fetch(url).then(res => res.json()).then(setData).catch(setError).finally(() => setLoading(false)); }, [url]); return { data, loading, error }; }',
  ARRAY['How would you add abort on unmount?', 'What about caching?'],
  ARRAY['react', 'custom-hooks', 'async'],
  12),

('frontend', 'google', 'hard', 'performance',
  'What causes unnecessary re-renders in React and how do you prevent them?',
  'Cover multiple scenarios',
  'Show deep performance understanding',
  'Causes: parent re-render, state/props change, context change, inline object/function creation. Prevention: React.memo for components, useMemo for values, useCallback for functions, split context, proper key props, avoid inline styles/objects',
  ARRAY['How do you debug re-renders?', 'What about React DevTools Profiler?'],
  ARRAY['react', 'performance', 'optimization'],
  12),

('frontend', 'amazon', 'easy', 'jsx',
  'What is JSX and how does it work?',
  'Explain transformation',
  'Show understanding of React fundamentals',
  'JSX is syntax extension that looks like HTML but is JavaScript. Babel transforms it to React.createElement calls. <div>Hello</div> becomes React.createElement("div", null, "Hello"). JSX can include expressions in {}, must have single root, className not class',
  ARRAY['Can you use React without JSX?', 'What about fragments?'],
  ARRAY['react', 'jsx', 'fundamentals'],
  5),

('frontend', 'meta', 'medium', 'router',
  'Explain client-side routing in React. How does React Router work?',
  'Include navigation patterns',
  'Show routing knowledge',
  'React Router prevents full page reloads by intercepting navigation, updating URL with History API, conditionally rendering components based on route. Use Link for navigation, useNavigate for programmatic, useParams for URL params, protected routes with conditional rendering',
  ARRAY['What about nested routes?', 'How do you handle 404s?'],
  ARRAY['react', 'routing', 'react-router'],
  10),

('frontend', 'apple', 'hard', 'refs',
  'When should you use refs in React? Provide use cases.',
  'Show understanding of escape hatches',
  'Discuss ref patterns',
  'Use refs for: DOM manipulation (focus, scroll), storing mutable values that don''t trigger re-renders, integrating with third-party libraries. Use useRef. Example: const inputRef = useRef(); inputRef.current.focus(). Avoid for state that affects rendering',
  ARRAY['What about forwardRef?', 'What about useImperativeHandle?'],
  ARRAY['react', 'refs', 'dom-manipulation'],
  10),

('frontend', 'microsoft', 'medium', 'forms',
  'How do you handle form validation in React?',
  'Include both controlled and library approaches',
  'Show form handling patterns',
  'Manual: controlled inputs with validation on change/submit. Libraries: React Hook Form (uncontrolled, performant), Formik (controlled, more features). Use Zod/Yup for schema validation. Example: const { register, handleSubmit, errors } = useForm({ resolver: zodResolver(schema) })',
  ARRAY['What about async validation?', 'How do you handle file uploads?'],
  ARRAY['react', 'forms', 'validation'],
  12),

('frontend', 'netflix', 'hard', 'architecture',
  'How would you structure a large-scale React application?',
  'Discuss folder structure, patterns, best practices',
  'Show architectural thinking',
  'Feature-based folders (/features/auth, /features/dashboard), shared components in /components, hooks in /hooks, utilities in /lib. Use: barrel exports, absolute imports, component composition, custom hooks, TypeScript, proper code splitting, testing strategy',
  ARRAY['What about micro-frontends?', 'How do you handle shared state?'],
  ARRAY['react', 'architecture', 'best-practices'],
  15),

('frontend', 'google', 'medium', 'lifecycle',
  'Explain React component lifecycle with hooks.',
  'Compare to class lifecycle methods',
  'Show migration knowledge',
  'Mount: useEffect(() => {}, []) = componentDidMount. Update: useEffect(() => {}, [dep]) = componentDidUpdate. Unmount: useEffect return = componentWillUnmount. No direct equivalent to componentWillMount (use useState initial value)',
  ARRAY['What about getDerivedStateFromProps?', 'What about error boundaries?'],
  ARRAY['react', 'lifecycle', 'hooks'],
  10),

('frontend', 'amazon', 'medium', 'typescript',
  'How do you type React components and hooks in TypeScript?',
  'Show TypeScript proficiency',
  'Include common patterns',
  'Props: interface Props { name: string; onClick: () => void }. Component: const MyComponent: React.FC<Props> = ({ name, onClick }) => {}. Hooks: useState<User | null>(null), useRef<HTMLInputElement>(null). Event: React.ChangeEvent<HTMLInputElement>',
  ARRAY['What about generic components?', 'What about children?'],
  ARRAY['react', 'typescript', 'types'],
  12),

('frontend', 'meta', 'hard', 'suspense',
  'Explain React Suspense and Concurrent Rendering.',
  'Include use cases',
  'Show knowledge of modern React',
  'Suspense lets components wait for data before rendering. Show fallback while loading. Works with lazy loading, React Query, future data fetching. Concurrent rendering: React can interrupt rendering, prioritize updates, keep UI responsive. useTransition for non-urgent updates',
  ARRAY['What about Error Boundaries with Suspense?', 'What about streaming SSR?'],
  ARRAY['react', 'suspense', 'concurrent'],
  15),

('frontend', 'apple', 'easy', 'css',
  'How do you style React components? Compare different approaches.',
  'Include CSS modules, styled-components, Tailwind',
  'Show styling knowledge',
  'Plain CSS: simple but no scoping. CSS Modules: scoped, good for components. Styled-components: CSS-in-JS, dynamic styles. Tailwind: utility classes, fast development. Emotion: like styled-components. Inline styles: avoid except for dynamic values',
  ARRAY['What about CSS-in-JS performance?', 'What about theming?'],
  ARRAY['react', 'css', 'styling'],
  8),

('frontend', 'microsoft', 'hard', 'testing',
  'How do you test React components? Cover unit, integration, e2e.',
  'Include testing libraries',
  'Show testing expertise',
  'Unit: Jest + React Testing Library for components, test user behavior not implementation. Integration: test multiple components together. E2E: Playwright or Cypress for full user flows. Mock: MSW for API mocking. Coverage: aim for critical paths, not 100%',
  ARRAY['What about snapshot testing?', 'How do you test hooks?'],
  ARRAY['react', 'testing', 'quality'],
  15),

('frontend', 'netflix', 'medium', 'errors',
  'How do you handle errors in React applications?',
  'Include Error Boundaries',
  'Show error handling patterns',
  'Error Boundaries: class component with componentDidCatch, catches render errors in children, show fallback UI. Can''t catch: event handlers, async, SSR. For those: try-catch, error state. Use tools like Sentry for tracking. Provide good UX with retry buttons',
  ARRAY['How do you handle async errors?', 'What about global error handling?'],
  ARRAY['react', 'error-handling', 'error-boundaries'],
  10),

('frontend', 'google', 'hard', 'optimization',
  'Explain code splitting and lazy loading in React.',
  'Include Next.js dynamic imports',
  'Show bundle optimization knowledge',
  'Code splitting: split bundle into chunks loaded on demand. React.lazy + Suspense for components: const LazyComponent = lazy(() => import("./Component")). Dynamic imports: import("./module").then(). Next.js: automatic route-based splitting, dynamic imports for components',
  ARRAY['How do you measure bundle size?', 'What about preloading?'],
  ARRAY['react', 'performance', 'code-splitting'],
  12),

('frontend', 'amazon', 'easy', 'keys',
  'Why are keys important in React lists?',
  'Explain reconciliation',
  'Show understanding of React internals',
  'Keys help React identify which items changed, added, or removed. Without keys, React uses index which causes bugs when list order changes. Use stable, unique IDs. Don''t use array index for dynamic lists. Keys must be unique among siblings',
  ARRAY['What happens without keys?', 'Can you use index as key?'],
  ARRAY['react', 'keys', 'reconciliation'],
  5),

('frontend', 'meta', 'medium', 'context',
  'Implement a theme context with TypeScript. Include dark mode toggle.',
  'Show complete implementation',
  'Demonstrate Context API proficiency',
  'type Theme = "light" | "dark"; const ThemeContext = createContext<{theme: Theme; toggle: () => void}>(null!); function ThemeProvider({ children }) { const [theme, setTheme] = useState<Theme>("light"); const toggle = () => setTheme(t => t === "light" ? "dark" : "light"); return <ThemeContext.Provider value={{theme, toggle}}>{children}</ThemeContext.Provider>; }',
  ARRAY['How do you prevent context re-renders?', 'What about persisting theme?'],
  ARRAY['react', 'context', 'typescript'],
  12),

('frontend', 'apple', 'medium', 'accessibility',
  'How do you make React applications accessible?',
  'Cover ARIA, keyboard navigation, screen readers',
  'Show a11y knowledge',
  'Use semantic HTML, ARIA labels for custom components, keyboard navigation (onKeyDown, tabIndex), focus management (useRef), alt text for images, color contrast, skip links, test with screen reader (VoiceOver, NVDA), use eslint-plugin-jsx-a11y',
  ARRAY['What about focus trapping in modals?', 'How do you test accessibility?'],
  ARRAY['react', 'accessibility', 'a11y'],
  10),

('frontend', 'netflix', 'hard', 'websockets',
  'How would you implement real-time features in React using WebSockets?',
  'Include connection management',
  'Show real-time communication knowledge',
  'Create WebSocket connection in useEffect, clean up on unmount. Handle reconnection with exponential backoff. Parse messages, update state. Example: useEffect(() => { const ws = new WebSocket(url); ws.onmessage = e => setData(JSON.parse(e.data)); ws.onerror = handleError; return () => ws.close(); }, []). Consider Socket.io for fallbacks',
  ARRAY['How do you handle reconnection?', 'What about authentication?'],
  ARRAY['react', 'websockets', 'real-time'],
  15);

-- =====================================================
-- 12. CREATE FUNCTIONS
-- =====================================================

-- Function to update session duration on completion
CREATE OR REPLACE FUNCTION update_interview_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = NOW();
    NEW.duration_seconds = EXTRACT(EPOCH FROM (NOW() - NEW.started_at))::INTEGER;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_interview_duration_trigger ON interview_sessions;
CREATE TRIGGER update_interview_duration_trigger
  BEFORE UPDATE ON interview_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_interview_duration();

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
COMMENT ON TABLE interview_sessions IS 'Stores user interview practice sessions';
COMMENT ON TABLE interview_questions IS 'Bank of interview questions across all types';
COMMENT ON TABLE interview_responses IS 'User answers to interview questions with AI evaluation';
COMMENT ON TABLE interview_hints IS 'Progressive hints revealed during interviews';
