-- Interview Prep Module Migration
-- Creates tables for interview preparation questions and user attempts

-- Create enum types for interview prep
CREATE TYPE interview_prep_level AS ENUM ('fresher', 'experienced');
CREATE TYPE interview_prep_topic AS ENUM ('javascript', 'react', 'node', 'mongodb', 'fullstack', 'system-design');
CREATE TYPE interview_prep_difficulty AS ENUM ('easy', 'medium', 'hard');

-- Table: interview_prep_questions
-- Stores interview preparation questions with model answers
CREATE TABLE interview_prep_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  level interview_prep_level NOT NULL,
  topic interview_prep_topic NOT NULL,
  difficulty interview_prep_difficulty NOT NULL,
  model_answer TEXT NOT NULL,
  key_points TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: interview_prep_attempts
-- Tracks user attempts at answering interview questions
CREATE TABLE interview_prep_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES interview_prep_questions(id) ON DELETE CASCADE,
  user_answer TEXT NOT NULL,
  ai_feedback TEXT,
  follow_up_question TEXT,
  time_spent_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_interview_prep_questions_level ON interview_prep_questions(level);
CREATE INDEX idx_interview_prep_questions_topic ON interview_prep_questions(topic);
CREATE INDEX idx_interview_prep_questions_difficulty ON interview_prep_questions(difficulty);
CREATE INDEX idx_interview_prep_questions_active ON interview_prep_questions(is_active);
CREATE INDEX idx_interview_prep_attempts_user ON interview_prep_attempts(user_id);
CREATE INDEX idx_interview_prep_attempts_question ON interview_prep_attempts(question_id);

-- RLS Policies

-- Enable RLS
ALTER TABLE interview_prep_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_prep_attempts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active questions
CREATE POLICY "Anyone can read active interview prep questions"
  ON interview_prep_questions
  FOR SELECT
  USING (is_active = true);

-- Policy: Users can read their own attempts
CREATE POLICY "Users can read their own interview prep attempts"
  ON interview_prep_attempts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own attempts
CREATE POLICY "Users can insert their own interview prep attempts"
  ON interview_prep_attempts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Seed Interview Questions

-- ====================================================================
-- FRESHER LEVEL QUESTIONS (20 questions)
-- ====================================================================

-- JavaScript Questions (Fresher) - 4 questions
INSERT INTO interview_prep_questions (question_text, level, topic, difficulty, model_answer, key_points, tags) VALUES
(
  'What is the difference between var, let, and const in JavaScript?',
  'fresher',
  'javascript',
  'easy',
  'var is function-scoped and can be redeclared and updated. It has hoisting issues. let is block-scoped, can be updated but not redeclared in the same scope. const is block-scoped, cannot be updated or redeclared, and must be initialized at declaration. For objects and arrays declared with const, the contents can still be modified, but the reference cannot be changed.',
  ARRAY[
    'var: function-scoped, can be redeclared, hoisted with undefined',
    'let: block-scoped, can be updated, not redeclared',
    'const: block-scoped, cannot be updated or redeclared',
    'const objects/arrays: contents mutable, reference immutable'
  ],
  ARRAY['javascript', 'variables', 'scoping', 'es6']
),
(
  'Explain the concept of closures in JavaScript.',
  'fresher',
  'javascript',
  'medium',
  'A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned. Closures are created every time a function is created. They are useful for data privacy, creating function factories, and maintaining state in asynchronous operations. Common use cases include setTimeout callbacks, event handlers, and the module pattern.',
  ARRAY[
    'Function with access to outer scope variables',
    'Created every time a function is defined',
    'Maintains access even after outer function returns',
    'Use cases: data privacy, callbacks, function factories'
  ],
  ARRAY['javascript', 'closures', 'scope', 'functions']
),
(
  'What are Promises in JavaScript? How do they differ from callbacks?',
  'fresher',
  'javascript',
  'medium',
  'Promises are objects representing the eventual completion or failure of an asynchronous operation. Unlike callbacks, Promises avoid callback hell through chaining with .then() and .catch(). A Promise has three states: pending, fulfilled, or rejected. Promises are chainable, have better error handling with .catch(), and support Promise.all() for parallel operations. They provide cleaner code compared to nested callbacks.',
  ARRAY[
    'Object representing async operation result',
    'Three states: pending, fulfilled, rejected',
    'Chainable with .then() and .catch()',
    'Better error handling than callbacks'
  ],
  ARRAY['javascript', 'promises', 'async', 'callbacks']
),
(
  'What is the Event Loop in JavaScript?',
  'fresher',
  'javascript',
  'medium',
  'The Event Loop is JavaScript''s mechanism for handling asynchronous operations in a single-threaded environment. It continuously checks the call stack and callback queue. When the call stack is empty, it moves callbacks from the queue to the stack for execution. The process: synchronous code executes first, asynchronous operations go to Web APIs, callbacks enter the queue, and the event loop moves them to the stack when ready. This enables non-blocking I/O operations.',
  ARRAY[
    'Handles async operations in single-threaded JS',
    'Checks call stack and callback queue continuously',
    'Moves callbacks to stack when stack is empty',
    'Enables non-blocking I/O'
  ],
  ARRAY['javascript', 'event-loop', 'async', 'runtime']
),

-- React Questions (Fresher) - 6 questions
(
  'What is JSX in React?',
  'fresher',
  'react',
  'easy',
  'JSX (JavaScript XML) is a syntax extension for JavaScript that allows writing HTML-like code in React components. It makes component structure more readable and is transpiled to React.createElement() calls by Babel. JSX expressions can embed JavaScript using curly braces, supports dynamic attributes, and must have a single parent element. It combines the power of JavaScript with the declarative nature of HTML, making UI code more intuitive.',
  ARRAY[
    'Syntax extension combining HTML and JavaScript',
    'Transpiled to React.createElement() calls',
    'Embed JavaScript with curly braces {}',
    'Must have single parent element'
  ],
  ARRAY['react', 'jsx', 'syntax', 'components']
),
(
  'What is the Virtual DOM in React and how does it work?',
  'fresher',
  'react',
  'medium',
  'The Virtual DOM is a lightweight copy of the actual DOM kept in memory. When state changes, React creates a new Virtual DOM tree, compares it with the previous one (diffing), calculates the minimal set of changes needed, and updates only those parts in the real DOM (reconciliation). This process is much faster than manipulating the real DOM directly. Benefits include improved performance, batch updates, and efficient re-rendering.',
  ARRAY[
    'Lightweight in-memory copy of real DOM',
    'Diffing algorithm compares old and new trees',
    'Updates only changed parts in real DOM',
    'Improves performance through batch updates'
  ],
  ARRAY['react', 'virtual-dom', 'performance', 'reconciliation']
),
(
  'Explain the difference between props and state in React.',
  'fresher',
  'react',
  'easy',
  'Props are immutable data passed from parent to child components, like function parameters. They flow unidirectionally down the component tree. State is mutable data managed within a component, can be updated using setState or useState hook, and triggers re-renders when changed. Props are for component communication, while state is for component-specific data. Props are read-only, state is read-write within the component.',
  ARRAY[
    'Props: immutable, passed from parent to child',
    'State: mutable, managed within component',
    'Props: like function parameters',
    'State: triggers re-renders when updated'
  ],
  ARRAY['react', 'props', 'state', 'components']
),
(
  'What is the useState hook in React?',
  'fresher',
  'react',
  'easy',
  'useState is a React Hook that lets you add state to functional components. It returns an array with two elements: the current state value and a function to update it. Syntax: const [state, setState] = useState(initialValue). The state persists between re-renders. Updates can be direct values or functions for complex logic. Multiple useState hooks can be used in a single component for different state variables.',
  ARRAY[
    'Hook for adding state to functional components',
    'Returns [currentValue, updateFunction]',
    'State persists between re-renders',
    'Can use multiple useState in one component'
  ],
  ARRAY['react', 'hooks', 'useState', 'state-management']
),
(
  'What does the useEffect hook do in React?',
  'fresher',
  'react',
  'medium',
  'useEffect performs side effects in functional components. It runs after render and can subscribe to external data, fetch data, manually change the DOM, or set up timers. Syntax: useEffect(() => { /* effect */ }, [dependencies]). The dependency array controls when the effect runs: empty array runs once, no array runs every render, with dependencies runs when they change. Return a cleanup function to prevent memory leaks.',
  ARRAY[
    'Handles side effects in functional components',
    'Runs after render by default',
    'Dependency array controls execution timing',
    'Return cleanup function to prevent leaks'
  ],
  ARRAY['react', 'hooks', 'useEffect', 'side-effects']
),
(
  'What are React components? Explain functional and class components.',
  'fresher',
  'react',
  'easy',
  'React components are reusable, independent pieces of UI. Functional components are JavaScript functions that return JSX, can use hooks, and are simpler and more concise. Class components are ES6 classes extending React.Component, have lifecycle methods, and use this.state and this.setState. Modern React favors functional components with hooks as they have less boilerplate, better performance, and easier code reuse. Functional components are the current best practice.',
  ARRAY[
    'Functional: JS functions returning JSX, use hooks',
    'Class: ES6 classes with lifecycle methods',
    'Functional components: modern best practice',
    'Both create reusable UI pieces'
  ],
  ARRAY['react', 'components', 'functional', 'class']
),

-- Node.js Questions (Fresher) - 4 questions
(
  'What is Node.js and why is it popular?',
  'fresher',
  'node',
  'easy',
  'Node.js is a JavaScript runtime built on Chrome''s V8 engine that allows running JavaScript on the server side. It''s popular because: it enables full-stack JavaScript development, has a non-blocking I/O model making it efficient for data-intensive real-time applications, has a massive npm ecosystem, excellent for building RESTful APIs and microservices, and has a large active community. It''s single-threaded but handles concurrency through the event loop.',
  ARRAY[
    'JavaScript runtime for server-side development',
    'Built on Chrome V8 engine',
    'Non-blocking I/O for high performance',
    'Huge npm ecosystem'
  ],
  ARRAY['nodejs', 'runtime', 'server-side', 'javascript']
),
(
  'What is npm and what is package.json?',
  'fresher',
  'node',
  'easy',
  'npm (Node Package Manager) is the default package manager for Node.js, used to install, update, and manage project dependencies. package.json is a manifest file containing project metadata, dependencies list, scripts, version info, and configuration. It enables consistent environment setup across teams. Scripts section defines custom commands like "npm start" or "npm test". Dependencies vs devDependencies separate production and development packages.',
  ARRAY[
    'npm: package manager for Node.js',
    'package.json: project manifest file',
    'Lists dependencies and project metadata',
    'Scripts section for custom commands'
  ],
  ARRAY['nodejs', 'npm', 'package-management', 'package.json']
),
(
  'What is Express.js and why is it used?',
  'fresher',
  'node',
  'easy',
  'Express.js is a minimal and flexible Node.js web application framework providing robust features for web and mobile applications. It simplifies building APIs and web servers with features like routing, middleware support, template engines, and HTTP utility methods. Benefits include rapid development, large community, easy integration with databases, and middleware ecosystem for authentication, CORS, logging, etc. It follows the middleware pattern for request/response handling.',
  ARRAY[
    'Minimal Node.js web application framework',
    'Simplifies API and server development',
    'Middleware pattern for request handling',
    'Large ecosystem and community'
  ],
  ARRAY['expressjs', 'framework', 'nodejs', 'backend']
),
(
  'What is middleware in Express.js?',
  'fresher',
  'node',
  'medium',
  'Middleware functions have access to request (req), response (res), and next() function in the request-response cycle. They can execute code, modify req/res objects, end the request-response cycle, or call next() to pass control to the next middleware. Types include application-level (app.use), router-level, error-handling (4 parameters), built-in (express.json), and third-party middleware. Common uses: logging, authentication, parsing request bodies, and CORS handling.',
  ARRAY[
    'Functions with access to req, res, next()',
    'Can modify request/response objects',
    'Must call next() or end the response',
    'Used for auth, logging, parsing, error handling'
  ],
  ARRAY['expressjs', 'middleware', 'request-cycle', 'nodejs']
),

-- MongoDB Questions (Fresher) - 3 questions
(
  'What is MongoDB and what makes it different from SQL databases?',
  'fresher',
  'mongodb',
  'easy',
  'MongoDB is a NoSQL document database storing data in flexible JSON-like documents (BSON). Unlike SQL databases with fixed schemas and tables, MongoDB has dynamic schemas with collections and documents. Benefits include: flexible schema for evolving data models, horizontal scalability through sharding, built-in replication for high availability, and better performance for certain use cases. SQL uses tables/rows/columns with relations, MongoDB uses collections/documents with embedded data.',
  ARRAY[
    'NoSQL document database using BSON format',
    'Dynamic schema vs SQL fixed schema',
    'Collections and documents vs tables and rows',
    'Horizontal scaling through sharding'
  ],
  ARRAY['mongodb', 'nosql', 'database', 'documents']
),
(
  'What is the difference between a collection and a document in MongoDB?',
  'fresher',
  'mongodb',
  'easy',
  'A collection is a group of MongoDB documents, similar to a table in relational databases but without enforcing a schema. A document is a single record in a collection, similar to a row in SQL, but stored as BSON (Binary JSON) with key-value pairs. Documents in the same collection can have different fields. Each document must have a unique _id field. Collections don''t enforce relationships; documents can embed subdocuments or reference other documents.',
  ARRAY[
    'Collection: group of documents (like SQL table)',
    'Document: single record in BSON format (like SQL row)',
    'No fixed schema - documents can vary',
    'Each document has unique _id field'
  ],
  ARRAY['mongodb', 'collections', 'documents', 'schema']
),
(
  'What are CRUD operations in MongoDB?',
  'fresher',
  'mongodb',
  'easy',
  'CRUD stands for Create, Read, Update, Delete - the four basic database operations. In MongoDB: Create uses insertOne() or insertMany() to add documents. Read uses find() or findOne() with query filters. Update uses updateOne(), updateMany(), or replaceOne() with update operators like $set. Delete uses deleteOne() or deleteMany(). These methods accept query filters to target specific documents and options for control. All operations return results with status information.',
  ARRAY[
    'Create: insertOne(), insertMany()',
    'Read: find(), findOne()',
    'Update: updateOne(), updateMany()',
    'Delete: deleteOne(), deleteMany()'
  ],
  ARRAY['mongodb', 'crud', 'operations', 'database']
),

-- Full Stack Questions (Fresher) - 3 questions
(
  'What is a RESTful API and what are HTTP methods?',
  'fresher',
  'fullstack',
  'medium',
  'REST (Representational State Transfer) is an architectural style for building web services. RESTful APIs use HTTP methods for operations: GET retrieves data, POST creates new resources, PUT updates existing resources, PATCH partially updates resources, and DELETE removes resources. REST principles include stateless communication, resource-based URLs (/users/123), standard HTTP status codes (200, 404, 500), and typically JSON data format. RESTful design enables scalable, maintainable APIs.',
  ARRAY[
    'REST: architectural style for web services',
    'HTTP methods: GET, POST, PUT, PATCH, DELETE',
    'Stateless communication',
    'Resource-based URLs and JSON format'
  ],
  ARRAY['rest', 'api', 'http', 'fullstack']
),
(
  'Explain the MERN stack and how its components work together.',
  'fresher',
  'fullstack',
  'medium',
  'MERN is a full-stack JavaScript framework: MongoDB stores data as documents, Express.js handles server-side logic and routing, React.js builds the user interface, and Node.js runs JavaScript on the server. Data flow: React sends HTTP requests to Express APIs, Express processes requests using business logic, queries MongoDB for data, and returns JSON responses to React. Benefits include using JavaScript throughout the stack, JSON data format end-to-end, and strong community support.',
  ARRAY[
    'MongoDB: database layer (data storage)',
    'Express.js: backend framework (API routing)',
    'React.js: frontend library (UI)',
    'Node.js: runtime environment (server)'
  ],
  ARRAY['mern', 'fullstack', 'javascript', 'architecture']
),
(
  'What is JWT (JSON Web Token) and how is it used for authentication?',
  'fresher',
  'fullstack',
  'medium',
  'JWT is a compact, URL-safe token for securely transmitting information between parties. Structure: Header (algorithm), Payload (claims/data), Signature (verification). Authentication flow: user logs in with credentials, server verifies and generates JWT, client stores token (localStorage/cookies), client sends token in Authorization header for subsequent requests, server verifies token signature. Benefits include stateless authentication, scalability, and cross-domain support. Tokens should have expiration times for security.',
  ARRAY[
    'Compact token for secure information transmission',
    'Three parts: Header, Payload, Signature',
    'Stateless authentication mechanism',
    'Sent in Authorization header for API requests'
  ],
  ARRAY['jwt', 'authentication', 'security', 'token']
),

-- ====================================================================
-- EXPERIENCED LEVEL QUESTIONS (20 questions)
-- ====================================================================

-- JavaScript Questions (Experienced) - 4 questions
(
  'Explain event delegation and its benefits.',
  'experienced',
  'javascript',
  'medium',
  'Event delegation is a pattern where a single event listener is attached to a parent element instead of multiple listeners on child elements. It leverages event bubbling - events propagate up the DOM tree. Benefits include improved performance by reducing memory usage with fewer event listeners, handling dynamically added elements without re-attaching listeners, and cleaner code. Use event.target to identify which child element triggered the event. Ideal for lists, tables, and dynamic content.',
  ARRAY[
    'Attach listener to parent instead of children',
    'Leverages event bubbling up DOM tree',
    'Handles dynamic elements automatically',
    'Reduces memory usage and improves performance'
  ],
  ARRAY['javascript', 'events', 'delegation', 'performance']
),
(
  'What is the difference between debouncing and throttling?',
  'experienced',
  'javascript',
  'medium',
  'Both limit function execution frequency. Debouncing delays function execution until after a specified time has passed since the last invocation - useful for search inputs, resize events. Implementation: clear and reset timer on each call. Throttling ensures a function runs at most once per specified time interval - useful for scroll events, button clicks. Implementation: track last execution time, ignore calls within interval. Debouncing waits for pause, throttling guarantees regular intervals. Use debounce for "wait until done" and throttle for "at most once per X time".',
  ARRAY[
    'Debouncing: delays until pause in calls',
    'Throttling: limits to once per time interval',
    'Debounce for search, resize events',
    'Throttle for scroll, API rate limiting'
  ],
  ARRAY['javascript', 'debouncing', 'throttling', 'performance']
),
(
  'Explain the difference between == and === in JavaScript.',
  'experienced',
  'javascript',
  'easy',
  '== (loose equality) performs type coercion before comparison, converting operands to the same type. === (strict equality) checks both value and type without coercion. Examples: "5" == 5 is true, "5" === 5 is false. null == undefined is true, but null === undefined is false. Type coercion can lead to unexpected results ([] == false is true). Best practice: always use === for predictable comparisons unless you specifically need type coercion. === is faster as it doesn''t perform type conversion.',
  ARRAY[
    '==: loose equality with type coercion',
    '===: strict equality checks value and type',
    'Best practice: always use ===',
    'Avoid coercion surprises'
  ],
  ARRAY['javascript', 'equality', 'operators', 'comparison']
),
(
  'What are async/await and how do they improve upon Promises?',
  'experienced',
  'javascript',
  'medium',
  'async/await is syntactic sugar over Promises, making asynchronous code look synchronous. An async function always returns a Promise. await pauses execution until Promise resolves, can only be used inside async functions. Benefits: cleaner syntax than .then() chains, easier error handling with try/catch blocks, better debugging (call stack preserved), sequential vs parallel operations more obvious. Error handling: wrap await in try/catch or use .catch() on the async function call. For parallel operations, use Promise.all() with await.',
  ARRAY[
    'Syntactic sugar over Promises',
    'async function always returns Promise',
    'await pauses until Promise resolves',
    'Cleaner syntax and better error handling'
  ],
  ARRAY['javascript', 'async-await', 'promises', 'asynchronous']
),

-- React Questions (Experienced) - 6 questions
(
  'What is React.memo and when should you use it?',
  'experienced',
  'react',
  'medium',
  'React.memo is a higher-order component that memoizes functional components, preventing re-renders when props haven''t changed. It performs shallow comparison of props by default. Use for: expensive components that render often with same props, leaf components in large trees, components receiving object/array props that don''t change frequently. Don''t use for: components that render with different props most of the time, very cheap components where memoization overhead exceeds benefit. Can provide custom comparison function as second argument. Helps optimize performance but shouldn''t be used everywhere.',
  ARRAY[
    'HOC that prevents unnecessary re-renders',
    'Shallow compares props by default',
    'Use for expensive, frequently rendered components',
    'Don''t overuse - adds overhead'
  ],
  ARRAY['react', 'memo', 'optimization', 'performance']
),
(
  'Explain useCallback and useMemo hooks. When should you use each?',
  'experienced',
  'react',
  'hard',
  'useCallback memoizes functions, returning the same function reference unless dependencies change. Prevents child component re-renders when passing callbacks as props. useMemo memoizes computed values, recalculating only when dependencies change. Use useCallback for: callbacks passed to optimized child components, function dependencies in other hooks. Use useMemo for: expensive calculations, object/array creation to maintain referential equality. Don''t use for: cheap operations (overhead exceeds benefit), every function/value (premature optimization). Both take dependency arrays like useEffect.',
  ARRAY[
    'useCallback: memoizes functions',
    'useMemo: memoizes computed values',
    'Both prevent unnecessary recalculations',
    'Use when child components are optimized'
  ],
  ARRAY['react', 'useCallback', 'useMemo', 'optimization']
),
(
  'What is the React Context API and when should you use it?',
  'experienced',
  'react',
  'medium',
  'Context provides a way to pass data through the component tree without prop drilling. Create context with createContext(), provide value with <Context.Provider>, consume with useContext hook. Use for: global data (theme, auth, language), avoiding prop drilling through many levels, sharing state between distant components. Avoid for: frequently changing data (causes all consumers to re-render), local component state. Context updates cause all consumers to re-render - split contexts or use state management libraries for complex scenarios. Not a replacement for Redux but good for simple global state.',
  ARRAY[
    'Passes data without prop drilling',
    'createContext, Provider, useContext',
    'Use for global data like theme, auth',
    'All consumers re-render on update'
  ],
  ARRAY['react', 'context', 'state-management', 'hooks']
),
(
  'What are custom hooks in React and why are they useful?',
  'experienced',
  'react',
  'medium',
  'Custom hooks are JavaScript functions starting with "use" that can call other hooks, enabling logic reuse across components. They extract component logic into reusable functions while maintaining hooks rules. Benefits: code reuse without HOCs or render props, better separation of concerns, easier testing, cleaner component code. Examples: useForm for form handling, useFetch for API calls, useLocalStorage for persistence. Must follow hooks rules: only call at top level, only call in React functions. Return values, functions, or both depending on use case.',
  ARRAY[
    'Reusable functions starting with "use"',
    'Extract and share component logic',
    'Can call other hooks inside',
    'Follow hooks rules'
  ],
  ARRAY['react', 'custom-hooks', 'reusability', 'hooks']
),
(
  'Explain React''s reconciliation algorithm and keys in lists.',
  'experienced',
  'react',
  'hard',
  'Reconciliation is React''s diffing algorithm that efficiently updates the DOM. When state changes, React creates a new Virtual DOM tree and compares it with the previous one. Keys help React identify which items changed, were added, or removed in lists. Without keys or with index as key, React may incorrectly reuse or recreate components, causing bugs and performance issues. Use stable, unique keys (like database IDs). Keys should be consistent across renders. Don''t use array index as key when list can reorder. Keys only need to be unique among siblings, not globally.',
  ARRAY[
    'Diffing algorithm to update DOM efficiently',
    'Keys identify list items across renders',
    'Use stable, unique keys (not index)',
    'Prevents incorrect component reuse'
  ],
  ARRAY['react', 'reconciliation', 'keys', 'virtual-dom']
),
(
  'What is code splitting in React and how do you implement it?',
  'experienced',
  'react',
  'hard',
  'Code splitting breaks your bundle into smaller chunks loaded on demand, improving initial load time. Implement using: React.lazy() for component-based splitting with dynamic import(), returns a Promise that resolves to a module with a default export. Wrap lazy components in <Suspense> with a fallback UI. Route-based splitting is most common - load components when routes are accessed. Also use for modals, tabs, heavy features. Benefits: smaller initial bundle, faster page load, better user experience. Named exports require re-exporting as default. Works with React Router seamlessly.',
  ARRAY[
    'Splits bundle into smaller on-demand chunks',
    'React.lazy() with dynamic import()',
    'Wrap in Suspense with fallback',
    'Route-based splitting most common'
  ],
  ARRAY['react', 'code-splitting', 'performance', 'lazy-loading']
),

-- Node.js Questions (Experienced) - 4 questions
(
  'Explain the difference between process.nextTick() and setImmediate().',
  'experienced',
  'node',
  'hard',
  'Both schedule callbacks but at different phases of the event loop. process.nextTick() executes callbacks before the event loop continues, in the next tick queue before any I/O operations. setImmediate() executes callbacks in the check phase after I/O events. nextTick has higher priority - callbacks execute before any I/O or timers. Use nextTick sparingly as it can block I/O. setImmediate is better for deferring execution to let I/O operations complete. In practice: use setImmediate for most cases, nextTick only when you need immediate execution before I/O.',
  ARRAY[
    'nextTick: executes before event loop continues',
    'setImmediate: executes after I/O events',
    'nextTick has higher priority',
    'Prefer setImmediate to avoid blocking I/O'
  ],
  ARRAY['nodejs', 'event-loop', 'async', 'performance']
),
(
  'How do you handle errors in Express.js middleware?',
  'experienced',
  'node',
  'medium',
  'Express has two error handling approaches: synchronous errors are caught automatically, asynchronous errors need explicit handling. Pass errors to next(error) in async code. Define error-handling middleware with 4 parameters (err, req, res, next) after all other middleware. Error middleware should: log the error, set appropriate status code, send user-friendly message (not stack traces in production), handle different error types. Use try-catch in async route handlers or async error wrapper middleware. Always include default error handler as last middleware. Set NODE_ENV to hide sensitive error details in production.',
  ARRAY[
    'Pass errors to next(error) in async code',
    'Error middleware has 4 parameters',
    'Place error handlers last',
    'Hide stack traces in production'
  ],
  ARRAY['expressjs', 'error-handling', 'middleware', 'nodejs']
),
(
  'What are streams in Node.js and why are they important?',
  'experienced',
  'node',
  'hard',
  'Streams are collections of data that might not be available all at once and don''t have to fit in memory. Types: Readable (fs.createReadStream), Writable (fs.createWriteStream), Duplex (sockets), Transform (zlib.createGzip). Benefits: memory efficiency for large files, time efficiency through pipelining, composition with .pipe(). Events: data, end, error, finish. Streams process data in chunks, enabling handling files larger than available memory. Use for: file operations, HTTP requests/responses, compression, parsing. Implement backpressure handling for production. Streams are fundamental to Node.js scalability.',
  ARRAY[
    'Process data in chunks, not all at once',
    'Four types: Readable, Writable, Duplex, Transform',
    'Memory efficient for large data',
    'Use .pipe() for composition'
  ],
  ARRAY['nodejs', 'streams', 'performance', 'memory']
),
(
  'How do you implement authentication and authorization in Node.js?',
  'experienced',
  'node',
  'hard',
  'Authentication verifies identity (who you are), authorization checks permissions (what you can do). Common patterns: JWT tokens for stateless auth, session-based with express-session for stateful, OAuth for third-party login. Implementation: hash passwords with bcrypt, generate JWT on login, verify token in middleware, attach user to req object, check permissions before protected routes. Store tokens in httpOnly cookies (secure) or localStorage (XSS vulnerable). Implement refresh tokens for long-term access. Use libraries like passport.js for complex scenarios. Always use HTTPS in production and implement rate limiting.',
  ARRAY[
    'Authentication: verify identity (JWT, sessions)',
    'Authorization: check permissions',
    'Hash passwords with bcrypt',
    'Verify tokens in middleware'
  ],
  ARRAY['nodejs', 'authentication', 'authorization', 'security']
),

-- MongoDB Questions (Experienced) - 3 questions
(
  'Explain MongoDB aggregation pipeline and common stages.',
  'experienced',
  'mongodb',
  'hard',
  'Aggregation pipeline processes documents through multiple stages, each transforming data. Common stages: $match filters documents early (place first for performance), $group aggregates by field(s) with operators like $sum/$avg, $project reshapes documents and selects fields, $sort orders results, $limit/$skip for pagination, $lookup performs left outer joins, $unwind deconstructs arrays. Pipeline optimization: filter early, project early to reduce data, use indexes for $match and $sort. Aggregation is more powerful than find() for analytics, reporting, and data transformation.',
  ARRAY[
    'Processes documents through multiple stages',
    'Common: $match, $group, $project, $lookup',
    'Place $match early for performance',
    'More powerful than find() for analytics'
  ],
  ARRAY['mongodb', 'aggregation', 'pipeline', 'queries']
),
(
  'What are MongoDB indexes and how do they improve performance?',
  'experienced',
  'mongodb',
  'hard',
  'Indexes are data structures storing small portion of data in traversable form. Types: single field, compound (multiple fields), multikey (array fields), text, geospatial, hashed. Benefits: dramatically faster queries, support sorting, enable uniqueness constraints. Costs: slower writes, storage overhead, memory usage. Index selection strategy: analyze queries with explain(), index fields in query filters, use compound indexes for multiple fields (field order matters), ESR rule: Equality, Sort, Range. Monitor with db.stats() and remove unused indexes. Critical for production performance.',
  ARRAY[
    'Data structures for fast data retrieval',
    'Types: single, compound, multikey, text',
    'Trade-off: faster reads, slower writes',
    'Use explain() to analyze queries'
  ],
  ARRAY['mongodb', 'indexes', 'performance', 'optimization']
),
(
  'Explain MongoDB replication and its benefits.',
  'experienced',
  'mongodb',
  'hard',
  'Replication is maintaining copies of data across multiple servers using replica sets. Architecture: one primary (all writes), multiple secondaries (replicate data), automatic failover if primary fails. Benefits: high availability, disaster recovery, read scaling (route reads to secondaries), zero-downtime maintenance. Write concern controls acknowledgment level (w:1, w:majority). Read preference directs where reads go (primary, primaryPreferred, secondary, etc.). Oplog (operations log) tracks changes for replication. Minimum 3 nodes recommended (odd number prevents split-brain). Essential for production deployments.',
  ARRAY[
    'Maintains data copies across servers',
    'One primary for writes, secondaries replicate',
    'Automatic failover for high availability',
    'Minimum 3 nodes recommended'
  ],
  ARRAY['mongodb', 'replication', 'high-availability', 'scalability']
),

-- System Design & Full Stack Questions (Experienced) - 3 questions
(
  'How would you design a scalable REST API for a social media application?',
  'experienced',
  'system-design',
  'hard',
  'Key components: API Gateway for routing and rate limiting, microservices architecture (user service, post service, feed service), load balancers for distribution, caching layer (Redis) for frequently accessed data, database sharding for horizontal scaling, CDN for media files, message queue (RabbitMQ/Kafka) for async operations. Design patterns: pagination for large datasets, cursor-based pagination for real-time feeds, webhook system for notifications, idempotent endpoints for retry safety. Security: rate limiting per user, input validation, authentication middleware. Monitoring and logging throughout. Database: SQL for user data, NoSQL for feeds, S3 for media.',
  ARRAY[
    'Microservices with API Gateway',
    'Caching layer (Redis) for performance',
    'Load balancers and database sharding',
    'Rate limiting, CDN, message queues'
  ],
  ARRAY['system-design', 'scalability', 'api', 'architecture']
),
(
  'Explain horizontal vs vertical scaling and when to use each.',
  'experienced',
  'system-design',
  'medium',
  'Vertical scaling (scaling up) adds more power to existing machine - more CPU, RAM, storage. Horizontal scaling (scaling out) adds more machines to handle load. Vertical pros: simpler (no code changes), no data consistency issues, single machine management. Cons: hardware limits, single point of failure, expensive at high end. Horizontal pros: no upper limit, better fault tolerance, cost-effective with commodity hardware. Cons: complex (load balancing, data distribution), potential data consistency issues. Use vertical for: starting out, simpler apps, budget constraints. Use horizontal for: high traffic, need for redundancy, microservices architecture.',
  ARRAY[
    'Vertical: add power to one machine',
    'Horizontal: add more machines',
    'Vertical simpler, horizontal more scalable',
    'Use horizontal for production systems'
  ],
  ARRAY['system-design', 'scaling', 'architecture', 'performance']
),
(
  'What is CORS and how do you handle it in a MERN application?',
  'experienced',
  'fullstack',
  'medium',
  'CORS (Cross-Origin Resource Sharing) is a security mechanism that restricts web pages from making requests to a different domain than the one serving the page. Browser blocks requests unless server explicitly allows. In Express, use cors middleware: app.use(cors({ origin: ''http://localhost:3000'', credentials: true })).  Configure for production: whitelist allowed origins, handle preflight OPTIONS requests, set proper headers (Access-Control-Allow-Origin, -Methods, -Headers). Enable credentials if using cookies. In development: use proxy in package.json or cors() with no options. Production: specific origin list, never use ''*'' with credentials. Understand preflight requests for non-simple requests.',
  ARRAY[
    'Security mechanism restricting cross-origin requests',
    'Use cors middleware in Express',
    'Whitelist origins in production',
    'Handle preflight OPTIONS requests'
  ],
  ARRAY['cors', 'security', 'fullstack', 'http']
);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Interview Prep Module migration completed successfully!';
  RAISE NOTICE '- Created 2 tables: interview_prep_questions, interview_prep_attempts';
  RAISE NOTICE '- Inserted 40 MERN stack interview questions';
  RAISE NOTICE '- 20 fresher-level questions (easy to medium)';
  RAISE NOTICE '- 20 experienced-level questions (medium to hard)';
  RAISE NOTICE '- Topics: JavaScript, React, Node.js, MongoDB, Full Stack, System Design';
END $$;
