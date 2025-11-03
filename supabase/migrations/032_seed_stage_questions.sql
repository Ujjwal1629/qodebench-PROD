-- Seed Questions for Stages 2, 4, and 5
-- Stage 2: Voice Q&A (Behavioral/Situational)
-- Stage 4: Text Q&A (Technical Concepts)
-- Stage 5: Discussion (System Design/Architecture)

-- =====================================================
-- STAGE 2: VOICE Q&A QUESTIONS
-- =====================================================

-- Fresher Voice Q&A (3 questions per session)
INSERT INTO interview_voice_qa_questions (experience_level, question_text, question_type, expected_points, evaluation_rubric) VALUES

('fresher', 'Tell me about yourself and why you want to become a full-stack web developer.',
  'behavioral',
  ARRAY[
    'Educational background',
    'Interest in web development',
    'Learning journey',
    'Career goals',
    'Relevant projects or courses'
  ],
  '{"clarity": 0.25, "relevance": 0.25, "enthusiasm": 0.25, "structure": 0.25}'::jsonb),

('fresher', 'Describe a web development project you worked on. What was your role and what did you learn?',
  'behavioral',
  ARRAY[
    'Project description',
    'Technologies used',
    'Personal contribution',
    'Challenges faced',
    'Key learnings'
  ],
  '{"technical_detail": 0.3, "clarity": 0.25, "learning_mindset": 0.25, "problem_solving": 0.2}'::jsonb),

('fresher', 'How do you approach learning new technologies or frameworks?',
  'behavioral',
  ARRAY[
    'Learning resources used',
    'Practice methodology',
    'Example of recent learning',
    'Self-motivation',
    'Continuous improvement mindset'
  ],
  '{"learning_strategy": 0.3, "examples": 0.3, "self_awareness": 0.2, "enthusiasm": 0.2}'::jsonb),

('fresher', 'Tell me about a time when you faced a difficult bug or error in your code. How did you resolve it?',
  'situational',
  ARRAY[
    'Problem description',
    'Debugging approach',
    'Resources consulted',
    'Solution found',
    'What you learned'
  ],
  '{"problem_solving": 0.3, "systematic_approach": 0.25, "resourcefulness": 0.25, "learning": 0.2}'::jsonb),

('fresher', 'Why are you interested in this role and what do you hope to achieve in your first year?',
  'behavioral',
  ARRAY[
    'Understanding of role',
    'Career aspirations',
    'Realistic goals',
    'Alignment with company',
    'Growth mindset'
  ],
  '{"career_clarity": 0.3, "motivation": 0.3, "realism": 0.2, "preparation": 0.2}'::jsonb);

-- Junior Voice Q&A
INSERT INTO interview_voice_qa_questions (experience_level, question_text, question_type, expected_points, evaluation_rubric) VALUES

('junior', 'Tell me about the most challenging technical problem you have solved in a professional setting.',
  'behavioral',
  ARRAY[
    'Problem complexity',
    'Technical approach',
    'Collaboration with team',
    'Solution implementation',
    'Impact/outcome',
    'Lessons learned'
  ],
  '{"technical_depth": 0.3, "problem_solving": 0.25, "communication": 0.2, "impact": 0.15, "reflection": 0.1}'::jsonb),

('junior', 'Describe a situation where you had to work with a difficult team member or resolve a conflict within your development team.',
  'behavioral',
  ARRAY[
    'Situation context',
    'Communication approach',
    'Empathy and understanding',
    'Conflict resolution',
    'Outcome',
    'Professional maturity'
  ],
  '{"communication": 0.3, "emotional_intelligence": 0.25, "problem_solving": 0.2, "professionalism": 0.15, "outcome": 0.1}'::jsonb),

('junior', 'Walk me through a time when you had to meet a tight deadline. How did you prioritize and manage your time?',
  'situational',
  ARRAY[
    'Situation assessment',
    'Prioritization strategy',
    'Time management',
    'Trade-offs made',
    'Communication with stakeholders',
    'Delivery and outcome'
  ],
  '{"prioritization": 0.3, "time_management": 0.25, "decision_making": 0.2, "communication": 0.15, "results": 0.1}'::jsonb),

('junior', 'Tell me about a time you had to learn a new technology or framework quickly for a project. How did you approach it?',
  'behavioral',
  ARRAY[
    'Context and motivation',
    'Learning strategy',
    'Resources used',
    'Application to project',
    'Timeline and success',
    'Current proficiency'
  ],
  '{"learning_ability": 0.3, "strategy": 0.25, "application": 0.2, "efficiency": 0.15, "reflection": 0.1}'::jsonb),

('junior', 'Describe a situation where you received critical feedback on your code. How did you handle it?',
  'behavioral',
  ARRAY[
    'Receptiveness to feedback',
    'Understanding of issues',
    'Actions taken',
    'Growth mindset',
    'Improvement demonstrated',
    'Future application'
  ],
  '{"receptiveness": 0.25, "action_orientation": 0.25, "growth_mindset": 0.2, "improvement": 0.2, "maturity": 0.1}'::jsonb);

-- Senior Voice Q&A
INSERT INTO interview_voice_qa_questions (experience_level, question_text, question_type, expected_points, evaluation_rubric) VALUES

('senior', 'Describe a technical decision you made that had significant impact on a product or system. What was your decision-making process?',
  'behavioral',
  ARRAY[
    'Context and stakeholders',
    'Technical options considered',
    'Trade-off analysis',
    'Decision rationale',
    'Implementation strategy',
    'Long-term impact',
    'Lessons learned'
  ],
  '{"strategic_thinking": 0.25, "technical_depth": 0.25, "decision_process": 0.2, "impact": 0.15, "leadership": 0.15}'::jsonb),

('senior', 'Tell me about a time when you led a team through a major technical challenge or migration. How did you approach it?',
  'behavioral',
  ARRAY[
    'Leadership approach',
    'Technical strategy',
    'Team coordination',
    'Risk management',
    'Communication',
    'Outcome and metrics',
    'Team development'
  ],
  '{"leadership": 0.25, "technical_strategy": 0.25, "team_management": 0.2, "communication": 0.15, "results": 0.15}'::jsonb),

('senior', 'Describe a situation where you had to balance technical debt with new feature development. What was your approach?',
  'situational',
  ARRAY[
    'Understanding of technical debt',
    'Assessment methodology',
    'Stakeholder management',
    'Prioritization framework',
    'Implementation strategy',
    'Measurable outcomes'
  ],
  '{"strategic_thinking": 0.3, "stakeholder_management": 0.25, "technical_judgment": 0.2, "execution": 0.15, "metrics": 0.1}'::jsonb),

('senior', 'Tell me about your experience mentoring junior developers. Give a specific example of how you helped someone grow.',
  'behavioral',
  ARRAY[
    'Mentoring philosophy',
    'Specific example',
    'Teaching methodology',
    'Challenges addressed',
    'Measurable growth',
    'Long-term impact'
  ],
  '{"mentoring_ability": 0.3, "empathy": 0.2, "teaching_skills": 0.2, "patience": 0.15, "impact": 0.15}'::jsonb),

('senior', 'Describe a time when you had to make a technical decision with incomplete information or under uncertainty.',
  'situational',
  ARRAY[
    'Context and constraints',
    'Information gathering',
    'Risk assessment',
    'Decision framework',
    'Mitigation strategies',
    'Outcome and learning'
  ],
  '{"judgment": 0.3, "risk_management": 0.25, "decision_making": 0.2, "pragmatism": 0.15, "learning": 0.1}'::jsonb);

-- =====================================================
-- STAGE 4: TEXT Q&A QUESTIONS (Technical Concepts)
-- =====================================================

-- Fresher Text Q&A (2 questions per session)
INSERT INTO interview_text_qa_questions (experience_level, question_text, category, expected_answer, key_concepts, evaluation_rubric) VALUES

('fresher', 'Explain what the DOM (Document Object Model) is and how JavaScript interacts with it.',
  'javascript',
  'The DOM is a programming interface for HTML and XML documents. It represents the page structure as a tree of objects that can be manipulated with JavaScript. JavaScript can access and modify DOM elements using methods like getElementById, querySelector, createElement, appendChild, etc. This allows dynamic updates to page content without reloading.',
  ARRAY['DOM definition', 'Tree structure', 'JavaScript manipulation', 'Methods examples', 'Dynamic updates'],
  '{"accuracy": 0.3, "completeness": 0.25, "examples": 0.25, "clarity": 0.2}'::jsonb),

('fresher', 'What is the difference between let, const, and var in JavaScript?',
  'javascript',
  'var is function-scoped and can be redeclared and reassigned. let is block-scoped, can be reassigned but not redeclared in the same scope. const is also block-scoped but cannot be reassigned (though object properties can be modified). let and const are hoisted but not initialized, while var is hoisted and initialized with undefined.',
  ARRAY['Scope differences', 'Reassignment rules', 'Hoisting behavior', 'Best practices'],
  '{"accuracy": 0.35, "completeness": 0.3, "clarity": 0.2, "practical_understanding": 0.15}'::jsonb),

('fresher', 'Explain what props are in React and how they differ from state.',
  'react',
  'Props (properties) are data passed from parent to child components. They are read-only and cannot be modified by the child. State is data managed within a component that can change over time. When state changes, the component re-renders. Props flow down (parent to child), while state is managed within the component.',
  ARRAY['Props definition', 'State definition', 'Read-only nature of props', 'Data flow', 'Re-rendering'],
  '{"accuracy": 0.3, "clarity": 0.25, "understanding": 0.25, "examples": 0.2}'::jsonb),

('fresher', 'What is the purpose of CSS Flexbox and give an example of when you would use it?',
  'html_css',
  'Flexbox is a CSS layout model for arranging items in a container along a single axis (row or column). It provides flexible sizing, alignment, and distribution of space. Use it for creating responsive layouts, centering content, equal-height columns, navigation bars, or any layout requiring flexible element arrangement.',
  ARRAY['Flexbox definition', 'Layout model', 'Use cases', 'Basic properties', 'Responsiveness'],
  '{"accuracy": 0.3, "practical_examples": 0.3, "clarity": 0.2, "completeness": 0.2}'::jsonb),

('fresher', 'What is an API and how do you consume an API in JavaScript?',
  'apis',
  'An API (Application Programming Interface) is a set of rules that allows different software applications to communicate. To consume an API in JavaScript, you typically use the fetch() function or libraries like axios to make HTTP requests (GET, POST, etc.), handle promises, parse JSON responses, and handle errors. Example: fetch(url).then(res => res.json()).then(data => console.log(data)).',
  ARRAY['API definition', 'Purpose', 'fetch() or axios', 'Promises', 'JSON parsing', 'Error handling'],
  '{"accuracy": 0.3, "code_example": 0.3, "completeness": 0.2, "clarity": 0.2}'::jsonb);

-- Junior Text Q&A
INSERT INTO interview_text_qa_questions (experience_level, question_text, category, expected_answer, key_concepts, evaluation_rubric) VALUES

('junior', 'Explain the JavaScript event loop and how asynchronous operations work.',
  'javascript',
  'The event loop is JavaScript''s concurrency model. JavaScript is single-threaded but can handle async operations through the event loop. Synchronous code runs first on the call stack. Async operations (like setTimeout, Promises) are handled by Web APIs and their callbacks go to the task/microtask queues. The event loop continuously checks if the call stack is empty, then processes microtasks (Promises) before macrotasks (setTimeout). This allows non-blocking I/O.',
  ARRAY['Event loop mechanism', 'Call stack', 'Task/microtask queues', 'Async handling', 'Non-blocking I/O', 'Practical implications'],
  '{"technical_accuracy": 0.35, "depth": 0.3, "clarity": 0.2, "examples": 0.15}'::jsonb),

('junior', 'What is the purpose of React hooks like useEffect and useMemo? When would you use each?',
  'react',
  'useEffect handles side effects in functional components - data fetching, subscriptions, DOM manipulation. It runs after render and can clean up with a return function. Use it for effects that need to happen after component updates. useMemo memoizes expensive computations, recalculating only when dependencies change. Use it to optimize performance for heavy calculations or maintain referential equality. Choose useEffect for side effects, useMemo for expensive computations.',
  ARRAY['useEffect purpose', 'Side effects', 'useMemo purpose', 'Memoization', 'Performance optimization', 'Use case differentiation'],
  '{"accuracy": 0.3, "depth": 0.25, "use_cases": 0.25, "practical_understanding": 0.2}'::jsonb),

('junior', 'Explain the difference between SQL and NoSQL databases. When would you choose one over the other?',
  'databases',
  'SQL databases are relational with structured schemas, ACID transactions, and use SQL for queries (e.g., PostgreSQL, MySQL). NoSQL databases are non-relational with flexible schemas, eventual consistency, and various data models - document (MongoDB), key-value (Redis), graph (Neo4j). Choose SQL for: structured data, complex relationships, transactions, consistency. Choose NoSQL for: flexible schema, horizontal scaling, high write loads, unstructured data, rapid development.',
  ARRAY['SQL characteristics', 'NoSQL characteristics', 'Schema differences', 'Consistency models', 'Use case trade-offs', 'Scaling considerations'],
  '{"technical_accuracy": 0.3, "comparative_analysis": 0.3, "use_cases": 0.2, "depth": 0.2}'::jsonb),

('junior', 'What is CORS and why is it important in web development?',
  'apis',
  'CORS (Cross-Origin Resource Sharing) is a security mechanism that allows or restricts web applications running at one origin (domain) from accessing resources at another origin. Browsers enforce the Same-Origin Policy for security, and CORS provides a safe way to enable cross-origin requests. Servers must send appropriate CORS headers (Access-Control-Allow-Origin) to permit cross-origin requests. Important for preventing malicious websites from making unauthorized requests.',
  ARRAY['CORS definition', 'Same-Origin Policy', 'Security purpose', 'CORS headers', 'Preflight requests', 'Common issues'],
  '{"accuracy": 0.3, "security_understanding": 0.3, "practical_application": 0.2, "completeness": 0.2}'::jsonb),

('junior', 'Explain closures in JavaScript and provide a practical use case.',
  'javascript',
  'A closure is a function that has access to variables in its outer (lexical) scope, even after the outer function has returned. Closures are created every time a function is created. Practical uses: data privacy (private variables), factory functions, event handlers, maintaining state in async operations. Example: function createCounter() { let count = 0; return () => ++count; } - the returned function maintains access to count.',
  ARRAY['Closure definition', 'Lexical scope', 'Practical examples', 'Use cases', 'Code example'],
  '{"accuracy": 0.3, "code_example": 0.3, "practical_application": 0.2, "clarity": 0.2}'::jsonb);

-- Senior Text Q&A
INSERT INTO interview_text_qa_questions (experience_level, question_text, category, expected_answer, key_concepts, evaluation_rubric) VALUES

('senior', 'Explain the trade-offs between Server-Side Rendering (SSR) and Client-Side Rendering (CSR). When would you choose each approach?',
  'react',
  'SSR renders HTML on the server for each request. Pros: better SEO, faster initial load, works without JS. Cons: higher server load, slower navigation, complexity. CSR renders in the browser. Pros: rich interactivity, lower server load, faster navigation after initial load. Cons: slower initial load, SEO challenges, requires JS. Choose SSR for: content-heavy sites, SEO critical, B2B apps. Choose CSR for: web apps, dashboards, authenticated experiences. Hybrid approaches (Next.js SSG, ISR) often provide best of both.',
  ARRAY['SSR mechanics', 'CSR mechanics', 'Performance implications', 'SEO considerations', 'Use case analysis', 'Hybrid approaches', 'Modern frameworks'],
  '{"technical_depth": 0.3, "trade-off_analysis": 0.3, "strategic_thinking": 0.2, "modern_practices": 0.2}'::jsonb),

('senior', 'What are the key considerations for optimizing a React application''s performance at scale?',
  'react',
  'Key optimizations: 1) Code splitting (React.lazy, dynamic imports) to reduce bundle size. 2) Memoization (React.memo, useMemo, useCallback) to prevent unnecessary renders. 3) Virtualization (react-window) for long lists. 4) Image optimization (lazy loading, modern formats, CDN). 5) State management optimization (avoid prop drilling, use context wisely). 6) Production build optimizations. 7) Monitoring (React DevTools Profiler, web vitals). 8) Bundle analysis. 9) Server-side rendering for initial load. 10) Avoiding inline objects/functions in JSX.',
  ARRAY['Code splitting', 'Memoization strategies', 'Virtualization', 'Bundle optimization', 'Render optimization', 'Monitoring tools', 'Real-world experience'],
  '{"comprehensiveness": 0.3, "practical_experience": 0.3, "depth": 0.2, "modern_techniques": 0.2}'::jsonb),

('senior', 'Explain database indexing strategies and how to optimize queries for a large-scale application.',
  'databases',
  'Indexing creates data structures (B-trees, hash tables) for fast lookups. Strategies: 1) Index frequently queried columns (WHERE, JOIN, ORDER BY). 2) Use composite indexes for multi-column queries. 3) Avoid over-indexing (slow writes). 4) Use covering indexes to avoid table lookups. 5) Partial indexes for filtered queries. 6) Full-text search indexes. Query optimization: 1) Analyze explain plans. 2) Avoid SELECT *, query only needed columns. 3) Use proper JOIN types. 4) Pagination with cursors. 5) Database connection pooling. 6) Read replicas for read-heavy loads. 7) Caching (Redis) for hot data. 8) Denormalization when needed.',
  ARRAY['Index types', 'Indexing strategies', 'Query optimization', 'Explain plans', 'Scaling strategies', 'Caching', 'Trade-offs', 'Real-world application'],
  '{"technical_depth": 0.35, "practical_experience": 0.3, "optimization_mindset": 0.2, "scaling_awareness": 0.15}'::jsonb),

('senior', 'What is the CAP theorem and how does it apply to distributed system design?',
  'system_design',
  'CAP theorem states that in a distributed system, you can only guarantee 2 of 3: Consistency (all nodes see same data), Availability (requests always get response), Partition tolerance (system works despite network failures). In practice, network partitions are inevitable, so you choose between CP (consistency over availability) or AP (availability over consistency). CP systems: prioritize consistency, may become unavailable (e.g., traditional RDBMS with strong consistency). AP systems: prioritize availability, eventual consistency (e.g., DynamoDB, Cassandra). Modern systems often use tunable consistency levels.',
  ARRAY['CAP theorem definition', 'Three properties', 'Trade-offs', 'CP vs AP systems', 'Real-world examples', 'Practical implications', 'Modern approaches'],
  '{"theoretical_understanding": 0.3, "practical_application": 0.3, "examples": 0.2, "depth": 0.2}'::jsonb),

('senior', 'Explain security best practices for building production web applications.',
  'security',
  'Key practices: 1) Authentication: secure password storage (bcrypt), MFA, secure session management. 2) Authorization: principle of least privilege, RBAC/ABAC. 3) Input validation & sanitization: prevent XSS, SQL injection. 4) HTTPS everywhere, secure headers (CSP, HSTS). 5) CSRF protection: tokens, SameSite cookies. 6) Rate limiting & DDoS protection. 7) Dependency security: regular updates, vulnerability scanning. 8) Secure secret management (env variables, vaults). 9) Logging & monitoring: security events, anomaly detection. 10) Regular security audits & penetration testing. 11) Data encryption at rest & in transit.',
  ARRAY['Authentication practices', 'Input validation', 'Common vulnerabilities', 'Security headers', 'Secret management', 'Monitoring', 'Comprehensive approach', 'Industry standards'],
  '{"comprehensiveness": 0.3, "depth": 0.25, "practical_experience": 0.25, "awareness": 0.2}'::jsonb);

-- =====================================================
-- STAGE 5: DISCUSSION QUESTIONS (System Design)
-- =====================================================

-- Fresher Discussion Questions (1 per session)
INSERT INTO interview_discussion_questions (experience_level, question_text, scenario, evaluation_criteria, sample_approach) VALUES

('fresher', 'Design a simple Todo application. Describe the architecture, database schema, and key features.',
  'You need to build a todo app where users can add, edit, delete, and mark tasks as complete. Users should be able to create accounts and see only their own tasks.',
  '{"requirements_gathering": 0.15, "database_design": 0.25, "architecture": 0.25, "features": 0.15, "technical_choices": 0.1, "clarity": 0.1}'::jsonb,
  'Frontend: React with form for adding todos, list to display them, useState for local state. Backend: Node.js/Express with REST API endpoints (GET /todos, POST /todos, PUT /todos/:id, DELETE /todos/:id). Database: PostgreSQL with users table (id, email, password_hash) and todos table (id, user_id, title, completed, created_at). Authentication: JWT tokens. Key features: CRUD operations, user authentication, filtering (all/active/completed).'),

('fresher', 'Design a simple blog platform where users can write and read blog posts.',
  'Create a platform where authenticated users can create blog posts with titles and content. Any visitor (authenticated or not) can read posts.',
  '{"requirements_understanding": 0.15, "data_model": 0.25, "api_design": 0.2, "user_flow": 0.15, "technical_decisions": 0.15, "presentation": 0.1}'::jsonb,
  'Database: users table, posts table (id, author_id, title, content, created_at). API: GET /posts (list all), GET /posts/:id (single post), POST /posts (authenticated, create), PUT /posts/:id (authenticated, author only), DELETE /posts/:id (authenticated, author only). Frontend: React with routes for home (list), post detail, create/edit (authenticated). Use markdown for content. Add pagination for post list.'),

('fresher', 'How would you build a simple weather app that shows current weather for a city?',
  'Build an app where users can search for a city and see current weather information (temperature, conditions, etc.).',
  '{"api_integration": 0.3, "user_interface": 0.2, "error_handling": 0.2, "architecture": 0.15, "clarity": 0.15}'::jsonb,
  'Use weather API (OpenWeatherMap). Frontend: React with input for city search, display component for weather data. On search, fetch data from API, show loading state, display results (temp, condition, icon). Handle errors (city not found, API failure). Store recent searches in localStorage. Optional: geolocation for current location, 5-day forecast.');

-- Junior Discussion Questions
INSERT INTO interview_discussion_questions (experience_level, question_text, scenario, evaluation_criteria, sample_approach) VALUES

('junior', 'Design a real-time chat application. How would you handle messaging, user presence, and message history?',
  'Build a chat app where users can join rooms, send messages in real-time, see who is online, and view message history.',
  '{"architecture": 0.2, "real-time_strategy": 0.25, "database_design": 0.2, "scalability": 0.15, "feature_design": 0.1, "communication": 0.1}'::jsonb,
  'Real-time: WebSockets (Socket.io) for bidirectional communication. Backend: Node.js server handling connections, rooms, broadcasting. Database: PostgreSQL for users and messages (id, room_id, user_id, content, timestamp), Redis for online users and presence. Features: join room, send message, typing indicators, read receipts. Optimization: paginated message history, message delivery acknowledgments. Scale: horizontal scaling with Redis adapter for multi-server Socket.io.'),

('junior', 'Design an e-commerce product search and filtering system. How would you optimize for performance?',
  'Build a product catalog with search, filters (price, category, rating), sorting, and pagination. Must handle thousands of products efficiently.',
  '{"search_strategy": 0.25, "filtering_design": 0.2, "performance": 0.25, "database_indexing": 0.15, "user_experience": 0.1, "clarity": 0.05}'::jsonb,
  'Database: products table with indexes on frequently filtered columns (category, price, rating). Search: Elasticsearch for full-text search with autocomplete, typo tolerance. API: GET /products?q=query&category=x&minPrice=y&maxPrice=z&sort=price&page=1. Caching: Redis for popular queries, CDN for product images. Frontend: React with debounced search input, filter UI, infinite scroll or pagination. Optimization: database query optimization, composite indexes, materialized views for aggregations.'),

('junior', 'How would you design a URL shortening service like bit.ly?',
  'Create a service that converts long URLs to short URLs, redirects users, and tracks click analytics.',
  '{"url_generation": 0.25, "database_design": 0.2, "redirection": 0.15, "analytics": 0.15, "scalability": 0.15, "edge_cases": 0.1}'::jsonb,
  'URL generation: base62 encoding of incremental ID or hash of URL. Database: urls table (id, short_code, long_url, created_at, user_id), clicks table for analytics. API: POST /shorten (create short URL), GET /:code (redirect to long URL with 301/302). Analytics: track clicks, timestamps, referrers. Scale: caching in Redis for hot URLs, CDN for redirection, database sharding by short code. Handle: duplicate URLs, custom slugs, expiration, collision detection.');

-- Senior Discussion Questions
INSERT INTO interview_discussion_questions (experience_level, question_text, scenario, evaluation_criteria, sample_approach) VALUES

('senior', 'Design a scalable video streaming platform like Netflix. Cover architecture, content delivery, and user experience.',
  'Build a platform that streams video content to millions of concurrent users worldwide with minimal buffering, adaptive quality, and personalized recommendations.',
  '{"architecture": 0.2, "scalability": 0.25, "cdn_strategy": 0.2, "video_processing": 0.15, "trade-offs": 0.1, "communication": 0.1}'::jsonb,
  'Architecture: microservices (user service, content service, recommendation service, streaming service). CDN: distribute video content globally (CloudFront, Akamai), edge caching. Video processing: transcode videos to multiple resolutions (1080p, 720p, 480p, 360p), adaptive bitrate streaming (HLS/DASH). Storage: S3 for video files, metadata in PostgreSQL/Cassandra. Streaming: HLS protocol, chunk-based delivery. Recommendations: ML pipeline with collaborative filtering, offline batch processing. Scale: horizontal scaling of services, database sharding, caching layers (Redis), message queues (Kafka) for events. Monitoring: real-time buffering rates, CDN hit ratios, playback quality metrics.'),

('senior', 'Design a distributed task queue system that can handle millions of jobs per day with guaranteed execution.',
  'Build a system where clients can submit async tasks that need to be executed by workers, with reliability, retries, priorities, and monitoring.',
  '{"architecture": 0.25, "reliability": 0.25, "scalability": 0.2, "monitoring": 0.15, "edge_cases": 0.1, "depth": 0.05}'::jsonb,
  'Architecture: Producer (task submission) -> Queue (Redis/RabbitMQ/SQS) -> Consumer workers. Database: PostgreSQL for task metadata, status tracking. Features: task priorities (multiple queues), delayed execution, retries with exponential backoff, dead letter queue for failed tasks, idempotency keys. Reliability: at-least-once delivery, worker heartbeats, task timeouts. Scale: horizontal scaling of workers, queue partitioning, auto-scaling based on queue depth. Monitoring: task completion rates, latency, failure rates, Prometheus + Grafana. Handle: worker failures, network partitions, duplicate processing, poison pill messages.'),

('senior', 'Design a real-time collaborative document editor like Google Docs. How would you handle concurrent editing and conflict resolution?',
  'Build a system where multiple users can edit the same document simultaneously, seeing each other''s changes in real-time without conflicts.',
  '{"real-time_strategy": 0.25, "conflict_resolution": 0.25, "architecture": 0.2, "performance": 0.15, "technical_depth": 0.1, "communication": 0.05}'::jsonb,
  'Conflict resolution: Operational Transformation (OT) or CRDTs (Conflict-free Replicated Data Types). Architecture: WebSocket server for real-time updates, document store (MongoDB for flexibility), presence system (Redis). OT: transform operations based on concurrent edits to maintain consistency. CRDTs: each character has unique ID, edits are commutative. Features: cursor positions, user presence, revision history. Database: document versions, operational log. Scale: document partitioning, WebSocket server clustering with Redis adapter. Optimization: compress operations, batch small changes, local optimistic updates. Handle: network delays, user disconnection, large documents (chunking).'),

('senior', 'Design a distributed rate limiting system for a multi-tenant API gateway.',
  'Build a rate limiter that enforces different rate limits per customer (tenant) across multiple API gateway instances, ensuring fair usage.',
  '{"distributed_design": 0.25, "algorithms": 0.25, "scalability": 0.2, "multi-tenancy": 0.15, "edge_cases": 0.1, "depth": 0.05}'::jsonb,
  'Algorithm: Token bucket or sliding window. Implementation: Redis with atomic INCR operations, per-tenant keys (tenant_id:endpoint:window). Distributed coordination: Redis cluster for horizontal scaling. Architecture: API gateway instances check Redis before allowing requests, return 429 if limit exceeded. Features: different limits per tenant/endpoint, burst allowance, rate limit headers in response. Optimization: local caching with short TTL to reduce Redis load, Lua scripts for atomic multi-key operations. Handle: Redis failures (degrade gracefully, allow requests), clock skew across servers, fine-grained limits (per second, minute, hour). Monitoring: limit exceeded metrics, tenant usage patterns.');

-- =====================================================
-- SEED COMPLETE
-- =====================================================

COMMENT ON TABLE interview_voice_qa_questions IS 'Stage 2: Behavioral/situational voice Q&A questions';
COMMENT ON TABLE interview_text_qa_questions IS 'Stage 4: Technical concept questions answered via text or voice';
COMMENT ON TABLE interview_discussion_questions IS 'Stage 5: System design and architecture discussion questions';
