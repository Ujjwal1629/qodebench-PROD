-- =====================================================
-- Backend & APIs - Seed Data
-- =====================================================
-- This script seeds the database with Backend & APIs learning path,
-- 14 comprehensive lessons covering Node.js, Express.js, Databases, and API Security
--
-- Structure:
-- Section 1: Node.js Fundamentals (Lessons 1-4)
-- Section 2: Express.js & REST APIs (Lessons 5-8)
-- Section 3: Database Integration (Lessons 9-11)
-- Section 4: Advanced Backend (Lessons 12-14)
-- =====================================================

-- =====================================================
-- 1. CREATE LEARNING PATH
-- =====================================================

INSERT INTO ai_learning_paths (
  id,
  title,
  description,
  difficulty,
  target_role,
  tech_stack,
  estimated_duration_hours,
  learning_objectives,
  prerequisites,
  is_published,
  order_index,
  icon
) VALUES (
  'f5e4d3c2-b1a0-9876-5432-10fedcba9876', -- Fixed UUID for reference
  'Backend & APIs',
  'Master server-side development with Node.js, Express.js, and databases. Build robust REST APIs, handle authentication, integrate with PostgreSQL/Supabase, and learn security best practices for production applications.',
  'intermediate',
  ARRAY['backend', 'fullstack'],
  ARRAY['nodejs', 'express', 'postgresql', 'supabase', 'rest-api', 'jwt'],
  24,
  ARRAY[
    'Master Node.js fundamentals and asynchronous programming',
    'Build RESTful APIs with Express.js',
    'Integrate PostgreSQL and Supabase databases',
    'Implement authentication and authorization',
    'Apply API security best practices',
    'Deploy and monitor production applications'
  ],
  ARRAY['JavaScript Essentials', 'React & Next.js Mastery'],
  true,
  4,
  '🔧'
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. CREATE LESSONS
-- =====================================================

-- =====================================================
-- SECTION 1: NODE.JS FUNDAMENTALS (Lessons 1-4)
-- =====================================================

-- Lesson 1: Introduction to Node.js & Server-Side JavaScript
INSERT INTO ai_learning_lessons (
  id,
  learning_path_id,
  title,
  description,
  content_type,
  content,
  duration_minutes,
  order_index,
  learning_objectives,
  resources
) VALUES (
  'b1111111-1111-1111-1111-111111111111',
  'f5e4d3c2-b1a0-9876-5432-10fedcba9876',
  'Introduction to Node.js & Server-Side JavaScript',
  'Discover Node.js, understand how JavaScript runs on the server, and build your first Node.js application.',
  'quiz',
  '# Introduction to Node.js & Server-Side JavaScript

## What is Node.js?

Node.js is a **JavaScript runtime** built on Chrome''s V8 engine that allows you to run JavaScript on the server. Created by Ryan Dahl in 2009, it revolutionized JavaScript by enabling full-stack development with a single language.

### Key Features

1. **Non-blocking I/O** - Handles thousands of connections simultaneously
2. **Event-driven** - Efficient for real-time applications
3. **npm ecosystem** - Largest package registry in the world
4. **Cross-platform** - Runs on Windows, macOS, Linux
5. **Single-threaded** - Uses event loop for concurrency

## Why Node.js?

**Before Node.js:**
- JavaScript only ran in browsers
- Needed different languages for frontend/backend
- Limited JavaScript ecosystem

**With Node.js:**
- JavaScript everywhere (frontend + backend)
- Unified codebase and team skills
- Massive package ecosystem (npm)
- Perfect for I/O-heavy applications

## The Event Loop

Node.js uses a **single-threaded event loop** for handling requests:

```javascript
console.log("Start");

setTimeout(() => {
  console.log("Async operation");
}, 0);

console.log("End");

// Output:
// Start
// End
// Async operation
```

The event loop allows Node.js to handle multiple operations without blocking!

## Your First Node.js Program

### Hello World (app.js)

```javascript
console.log("Hello from Node.js!");
console.log("Node version:", process.version);
console.log("Platform:", process.platform);
```

**Run it:**
```bash
node app.js
```

### Creating a Simple HTTP Server

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello from Node.js server!");
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
```

This creates a basic web server in just 10 lines!

## Node.js vs Browser JavaScript

| Feature | Browser | Node.js |
|---------|---------|---------|
| Global Object | `window` | `global` |
| File System | ❌ No access | ✅ Full access |
| Modules | ES6 modules | CommonJS + ES6 |
| APIs | DOM, Fetch, etc. | fs, http, path, etc. |
| Use Case | Client-side UI | Server-side logic |

## Common Use Cases

✅ **REST APIs** - Build scalable backend services
✅ **Real-time apps** - Chat, gaming, collaboration tools
✅ **Microservices** - Distributed system architectures
✅ **CLI tools** - Command-line utilities
✅ **Serverless functions** - AWS Lambda, Vercel, Netlify

## The Node.js Core Modules

Node.js comes with built-in modules:

```javascript
const fs = require("fs");        // File system
const http = require("http");    // HTTP server
const path = require("path");    // File paths
const os = require("os");        // Operating system
const crypto = require("crypto"); // Cryptography
```

## Best Practices

✅ **Use latest LTS version** - Stable and maintained
✅ **Use async/await** - Cleaner than callbacks
✅ **Handle errors properly** - Always catch errors
✅ **Use environment variables** - Never hardcode secrets
✅ **Monitor performance** - Use profiling tools

## Common Pitfalls

❌ **Blocking the event loop** - Avoid heavy synchronous operations
❌ **Callback hell** - Use promises or async/await instead
❌ **Not handling errors** - Unhandled errors crash Node.js
❌ **Mixing CommonJS and ES6** - Choose one module system

## Installing Node.js

1. Visit nodejs.org
2. Download the LTS version
3. Verify installation:

```bash
node --version
npm --version
```

## Quiz Time!

Test your understanding of Node.js fundamentals.',
  50,
  1,
  ARRAY[
    'Understand what Node.js is and why it''s used',
    'Learn how the event loop works',
    'Create your first Node.js server',
    'Recognize differences between browser and Node.js JavaScript'
  ],
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- Quiz Questions for Lesson 1
INSERT INTO backend_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, code_example, order_index, difficulty) VALUES
('b1111111-1111-1111-1111-111111111111', 'What is Node.js?', 'multiple_choice', '{"A": "A programming language", "B": "A JavaScript runtime for server-side", "C": "A database system", "D": "A CSS framework"}', 'B', 'Node.js is a JavaScript runtime built on Chrome''s V8 engine that allows JavaScript to run on the server, outside of browsers.', NULL, 1, 'easy'),
('b1111111-1111-1111-1111-111111111111', 'Which company created the V8 engine that Node.js uses?', 'multiple_choice', '{"A": "Microsoft", "B": "Google", "C": "Facebook", "D": "Amazon"}', 'B', 'The V8 JavaScript engine was created by Google for the Chrome browser. Node.js leverages this fast engine for server-side execution.', NULL, 2, 'easy'),
('b1111111-1111-1111-1111-111111111111', 'Node.js is single-threaded.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'Node.js runs on a single thread but uses an event loop and asynchronous I/O to handle multiple concurrent operations efficiently.', NULL, 3, 'medium'),
('b1111111-1111-1111-1111-111111111111', 'What is the event loop in Node.js?', 'multiple_choice', '{"A": "A for loop that runs forever", "B": "A mechanism for handling asynchronous operations", "C": "A circular array data structure", "D": "A debugging tool"}', 'B', 'The event loop is Node.js''s core mechanism for handling asynchronous operations without blocking the main thread, enabling high concurrency.', NULL, 4, 'medium'),
('b1111111-1111-1111-1111-111111111111', 'Which command runs a Node.js file?', 'multiple_choice', '{"A": "npm run file.js", "B": "node file.js", "C": "js file.js", "D": "run file.js"}', 'B', 'The node command followed by the filename executes a JavaScript file using the Node.js runtime.', 'node app.js', 5, 'easy'),
('b1111111-1111-1111-1111-111111111111', 'Node.js can access the file system.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'Unlike browser JavaScript, Node.js has full file system access through the built-in fs module, allowing it to read and write files.', NULL, 6, 'easy'),
('b1111111-1111-1111-1111-111111111111', 'What is npm?', 'multiple_choice', '{"A": "Node Package Manager", "B": "New Programming Method", "C": "Network Protocol Manager", "D": "Node Process Monitor"}', 'A', 'npm (Node Package Manager) is the default package manager for Node.js, providing access to the world''s largest software registry.', NULL, 7, 'easy'),
('b1111111-1111-1111-1111-111111111111', 'Which module creates HTTP servers in Node.js?', 'multiple_choice', '{"A": "server", "B": "express", "C": "http", "D": "web"}', 'C', 'The http module is a built-in Node.js core module that provides functionality to create HTTP servers and handle requests/responses.', 'const http = require("http");', 8, 'medium');

-- Lesson 2: Working with Modules and NPM
INSERT INTO ai_learning_lessons (
  id,
  learning_path_id,
  title,
  description,
  content_type,
  content,
  duration_minutes,
  order_index,
  learning_objectives,
  resources
) VALUES (
  'b2222222-2222-2222-2222-222222222222',
  'f5e4d3c2-b1a0-9876-5432-10fedcba9876',
  'Working with Modules and NPM',
  'Master Node.js module systems (CommonJS and ES6), npm package management, and dependency handling.',
  'quiz',
  '# Working with Modules and NPM

## Module Systems in Node.js

Node.js supports two module systems: **CommonJS** (traditional) and **ES6 Modules** (modern).

### CommonJS Modules

**Exporting:**
```javascript
// math.js
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

module.exports = { add, subtract };
```

**Importing:**
```javascript
// app.js
const math = require("./math");

console.log(math.add(5, 3));      // 8
console.log(math.subtract(10, 4)); // 6
```

### ES6 Modules

**Exporting:**
```javascript
// math.mjs (or add "type": "module" to package.json)
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

// Or default export
export default { add, subtract };
```

**Importing:**
```javascript
// app.mjs
import { add, subtract } from "./math.mjs";
// Or: import math from "./math.mjs";

console.log(add(5, 3));      // 8
console.log(subtract(10, 4)); // 6
```

## Built-in Core Modules

Node.js comes with powerful built-in modules:

```javascript
const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");

// File system
const data = fs.readFileSync("file.txt", "utf-8");

// Path manipulation
const filePath = path.join(__dirname, "data", "file.txt");

// OS information
console.log("Platform:", os.platform());
console.log("CPU cores:", os.cpus().length);

// Cryptography
const hash = crypto.createHash("sha256").update("password").digest("hex");
```

## NPM - Node Package Manager

npm is the world''s largest software registry with over 2 million packages!

### Initializing a Project

```bash
npm init
# or for defaults
npm init -y
```

This creates a **package.json** file:

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "description": "My Node.js app",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {},
  "devDependencies": {}
}
```

### Installing Packages

```bash
# Install as dependency
npm install express

# Install as dev dependency
npm install --save-dev nodemon

# Install specific version
npm install lodash@4.17.21

# Install globally
npm install -g typescript
```

### Package Types

**dependencies** - Required in production:
```json
"dependencies": {
  "express": "^4.18.2",
  "pg": "^8.11.0"
}
```

**devDependencies** - Only needed for development:
```json
"devDependencies": {
  "nodemon": "^3.0.1",
  "jest": "^29.5.0"
}
```

## Understanding package.json Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "build": "webpack --mode production"
  }
}
```

**Run scripts:**
```bash
npm start       # Runs start script
npm run dev     # Runs dev script
npm test        # Runs test script
```

## Semantic Versioning (SemVer)

npm uses semantic versioning: **MAJOR.MINOR.PATCH**

```
"express": "^4.18.2"
           └─┬─┘
             └── Caret (^) = Compatible with 4.x.x
```

- **^4.18.2** - Updates to 4.x.x (minor/patch)
- **~4.18.2** - Updates to 4.18.x (patch only)
- **4.18.2** - Exact version locked

## The node_modules Folder

When you install packages, they go into `node_modules/`:

```
my-app/
├── node_modules/      ← All dependencies
│   ├── express/
│   ├── lodash/
│   └── ...
├── package.json       ← Dependency list
├── package-lock.json  ← Exact versions
└── server.js
```

**Important:** Add `node_modules/` to `.gitignore`!

## package-lock.json

This file locks exact versions of all dependencies:

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "packages": {
    "node_modules/express": {
      "version": "4.18.2",
      "resolved": "https://registry.npmjs.org/express/-/express-4.18.2.tgz"
    }
  }
}
```

✅ **Always commit package-lock.json** to ensure consistent installs!

## Creating Your Own Module

**utils.js:**
```javascript
function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
  formatDate,
  capitalize
};
```

**app.js:**
```javascript
const { formatDate, capitalize } = require("./utils");

console.log(formatDate(new Date())); // 2024-01-15
console.log(capitalize("hello"));    // Hello
```

## Best Practices

✅ **Use package-lock.json** - Ensures reproducible builds
✅ **Keep dependencies updated** - Use `npm outdated` and `npm update`
✅ **Audit for vulnerabilities** - Run `npm audit` regularly
✅ **Use .gitignore** - Never commit node_modules
✅ **Document dependencies** - Explain why packages are needed

## Common NPM Commands

```bash
npm install              # Install all dependencies
npm install <package>    # Install a package
npm uninstall <package>  # Remove a package
npm update              # Update dependencies
npm outdated            # Check for outdated packages
npm audit               # Check for vulnerabilities
npm audit fix           # Fix vulnerabilities automatically
npm list                # List installed packages
npm run <script>        # Run a package.json script
```

## Common Pitfalls

❌ **Committing node_modules** - Always add to .gitignore
❌ **Not using package-lock.json** - Leads to "works on my machine"
❌ **Installing everything globally** - Use local dependencies
❌ **Ignoring security warnings** - Run npm audit regularly

## Quiz Time!

Test your knowledge of modules and npm!',
  55,
  2,
  ARRAY[
    'Understand CommonJS and ES6 module systems',
    'Master npm package installation and management',
    'Work with package.json and dependencies',
    'Create and export your own modules'
  ],
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- Quiz Questions for Lesson 2
INSERT INTO backend_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, code_example, order_index, difficulty) VALUES
('b2222222-2222-2222-2222-222222222222', 'Which keyword exports a module in CommonJS?', 'multiple_choice', '{"A": "export", "B": "exports", "C": "module.exports", "D": "return"}', 'C', 'In CommonJS, module.exports is used to export functions, objects, or values from a module. The exports keyword is a shorthand but module.exports is the actual export object.', 'module.exports = { myFunction };', 1, 'easy'),
('b2222222-2222-2222-2222-222222222222', 'What command initializes a new Node.js project?', 'multiple_choice', '{"A": "node init", "B": "npm init", "C": "npm start", "D": "npm create"}', 'B', 'npm init creates a package.json file to initialize a Node.js project. Use npm init -y for default values.', 'npm init -y', 2, 'easy'),
('b2222222-2222-2222-2222-222222222222', 'node_modules folder should be committed to git.', 'true_false', '{"true": "True", "false": "False"}', 'false', 'node_modules should NEVER be committed to git as it''s large and can be regenerated from package.json. Always add it to .gitignore.', NULL, 3, 'easy'),
('b2222222-2222-2222-2222-222222222222', 'What does the caret (^) mean in "^4.18.2"?', 'multiple_choice', '{"A": "Exact version only", "B": "Any version", "C": "Compatible with 4.x.x updates", "D": "Latest version available"}', 'C', 'The caret (^) allows updates to any 4.x.x version, meaning minor and patch updates are allowed but not major version changes.', NULL, 4, 'medium'),
('b2222222-2222-2222-2222-222222222222', 'Which file locks exact dependency versions?', 'multiple_choice', '{"A": "package.json", "B": "package-lock.json", "C": "npm-lock.json", "D": "node-lock.json"}', 'B', 'package-lock.json records the exact versions of all dependencies and their sub-dependencies, ensuring consistent installs across environments.', NULL, 5, 'medium'),
('b2222222-2222-2222-2222-222222222222', 'What command checks for security vulnerabilities?', 'multiple_choice', '{"A": "npm check", "B": "npm security", "C": "npm audit", "D": "npm scan"}', 'C', 'npm audit checks your dependencies for known security vulnerabilities and provides recommendations. Use npm audit fix to automatically fix issues.', 'npm audit', 6, 'medium'),
('b2222222-2222-2222-2222-222222222222', 'DevDependencies are required in production.', 'true_false', '{"true": "True", "false": "False"}', 'false', 'devDependencies are only needed during development (testing, building, etc.). Production only needs dependencies listed in the dependencies section.', NULL, 7, 'easy'),
('b2222222-2222-2222-2222-222222222222', 'Which keyword imports ES6 modules?', 'multiple_choice', '{"A": "require", "B": "import", "C": "include", "D": "use"}', 'B', 'The import keyword is used for ES6 modules. It must be used with .mjs files or when "type": "module" is set in package.json.', 'import express from "express";', 8, 'easy'),
('b2222222-2222-2222-2222-222222222222', 'What does SemVer stand for?', 'multiple_choice', '{"A": "Server Version", "B": "Semantic Versioning", "C": "Simple Version", "D": "Standard Version"}', 'B', 'SemVer (Semantic Versioning) follows the MAJOR.MINOR.PATCH format where each number has specific meaning about compatibility and changes.', NULL, 9, 'medium');

-- Lesson 3: File System and Asynchronous Operations
INSERT INTO ai_learning_lessons (
  id,
  learning_path_id,
  title,
  description,
  content_type,
  content,
  duration_minutes,
  order_index,
  learning_objectives,
  resources
) VALUES (
  'b3333333-3333-3333-3333-333333333333',
  'f5e4d3c2-b1a0-9876-5432-10fedcba9876',
  'File System and Asynchronous Operations',
  'Learn to work with files, handle async operations using callbacks, promises, and async/await.',
  'quiz',
  '# File System and Asynchronous Operations

## The File System (fs) Module

Node.js provides the `fs` module for interacting with the file system.

### Reading Files

**Synchronous (Blocking):**
```javascript
const fs = require("fs");

try {
  const data = fs.readFileSync("file.txt", "utf-8");
  console.log(data);
} catch (err) {
  console.error("Error reading file:", err);
}
```

**Asynchronous (Non-blocking):**
```javascript
const fs = require("fs");

fs.readFile("file.txt", "utf-8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }
  console.log(data);
});

console.log("This runs before file is read!");
```

**Promise-based (Modern):**
```javascript
const fs = require("fs").promises;

async function readFileExample() {
  try {
    const data = await fs.readFile("file.txt", "utf-8");
    console.log(data);
  } catch (err) {
    console.error("Error reading file:", err);
  }
}

readFileExample();
```

### Writing Files

**Async write:**
```javascript
const fs = require("fs").promises;

async function writeFileExample() {
  try {
    await fs.writeFile("output.txt", "Hello, World!");
    console.log("File written successfully!");
  } catch (err) {
    console.error("Error writing file:", err);
  }
}
```

**Append to file:**
```javascript
await fs.appendFile("log.txt", "New log entry\n");
```

### Working with Directories

```javascript
const fs = require("fs").promises;

// Create directory
await fs.mkdir("new-folder");

// Read directory contents
const files = await fs.readdir("./");
console.log(files);

// Check if file/directory exists
try {
  await fs.access("file.txt");
  console.log("File exists!");
} catch {
  console.log("File does not exist");
}

// Delete file
await fs.unlink("file.txt");

// Delete directory
await fs.rmdir("old-folder");
```

### File Information

```javascript
const stats = await fs.stat("file.txt");

console.log("File size:", stats.size, "bytes");
console.log("Is file:", stats.isFile());
console.log("Is directory:", stats.isDirectory());
console.log("Created:", stats.birthtime);
console.log("Modified:", stats.mtime);
```

## Asynchronous Patterns

### 1. Callbacks (Old Style)

```javascript
fs.readFile("file1.txt", "utf-8", (err, data1) => {
  if (err) throw err;

  fs.readFile("file2.txt", "utf-8", (err, data2) => {
    if (err) throw err;

    console.log(data1 + data2);
  });
});
```

⚠️ **Problem:** Callback hell / Pyramid of doom

### 2. Promises (Better)

```javascript
const fs = require("fs").promises;

fs.readFile("file1.txt", "utf-8")
  .then(data1 => {
    return fs.readFile("file2.txt", "utf-8")
      .then(data2 => data1 + data2);
  })
  .then(combined => console.log(combined))
  .catch(err => console.error(err));
```

### 3. Async/Await (Best)

```javascript
const fs = require("fs").promises;

async function readFiles() {
  try {
    const data1 = await fs.readFile("file1.txt", "utf-8");
    const data2 = await fs.readFile("file2.txt", "utf-8");
    console.log(data1 + data2);
  } catch (err) {
    console.error("Error:", err);
  }
}

readFiles();
```

## Parallel Async Operations

Use `Promise.all()` for parallel operations:

```javascript
async function readMultipleFiles() {
  try {
    const [file1, file2, file3] = await Promise.all([
      fs.readFile("file1.txt", "utf-8"),
      fs.readFile("file2.txt", "utf-8"),
      fs.readFile("file3.txt", "utf-8")
    ]);

    console.log("All files read!", file1, file2, file3);
  } catch (err) {
    console.error("Error reading files:", err);
  }
}
```

## Stream Processing (Large Files)

For large files, use streams to avoid loading everything into memory:

```javascript
const fs = require("fs");

// Create read stream
const readStream = fs.createReadStream("large-file.txt", "utf-8");

readStream.on("data", (chunk) => {
  console.log("Received chunk:", chunk.length);
});

readStream.on("end", () => {
  console.log("Finished reading file");
});

readStream.on("error", (err) => {
  console.error("Error:", err);
});
```

**Copy large file efficiently:**
```javascript
const readStream = fs.createReadStream("source.txt");
const writeStream = fs.createWriteStream("destination.txt");

readStream.pipe(writeStream);

writeStream.on("finish", () => {
  console.log("File copied successfully!");
});
```

## Path Module

Always use the `path` module for cross-platform path handling:

```javascript
const path = require("path");

// Join paths safely
const filePath = path.join(__dirname, "data", "users.json");

// Get file extension
console.log(path.extname("file.txt"));  // .txt

// Get filename
console.log(path.basename("/path/to/file.txt"));  // file.txt

// Get directory name
console.log(path.dirname("/path/to/file.txt"));  // /path/to

// Parse path
const parsed = path.parse("/home/user/file.txt");
console.log(parsed);
// { root: "/", dir: "/home/user", base: "file.txt", ext: ".txt", name: "file" }
```

## Best Practices

✅ **Always use async methods** - Never block the event loop
✅ **Use fs.promises** - Cleaner than callbacks
✅ **Use path.join()** - Cross-platform compatibility
✅ **Handle errors** - Always wrap in try-catch
✅ **Use streams for large files** - Memory efficient
✅ **Close file descriptors** - Prevent memory leaks

## Common Pitfalls

❌ **Using sync methods in production** - Blocks entire server
❌ **Not handling errors** - Crashes your application
❌ **Hardcoding paths** - Use __dirname and path.join()
❌ **Reading huge files into memory** - Use streams instead
❌ **Forgetting to close streams** - Memory leaks

## Error Handling

```javascript
async function safeFileOperation() {
  try {
    const data = await fs.readFile("file.txt", "utf-8");
    return data;
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error("File not found");
    } else if (err.code === "EACCES") {
      console.error("Permission denied");
    } else {
      console.error("Unknown error:", err);
    }
    return null;
  }
}
```

## Quiz Time!

Test your understanding of file system and async operations!',
  60,
  3,
  ARRAY[
    'Master file system operations with the fs module',
    'Understand asynchronous patterns: callbacks, promises, async/await',
    'Work with streams for large files',
    'Use the path module for cross-platform compatibility'
  ],
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- Quiz Questions for Lesson 3
INSERT INTO backend_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, code_example, order_index, difficulty) VALUES
('b3333333-3333-3333-3333-333333333333', 'Which module handles file operations in Node.js?', 'multiple_choice', '{"A": "file", "B": "fs", "C": "filesystem", "D": "files"}', 'B', 'The fs (file system) module is Node.js''s built-in module for reading, writing, and manipulating files and directories.', 'const fs = require("fs");', 1, 'easy'),
('b3333333-3333-3333-3333-333333333333', 'Synchronous file operations block the event loop.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'Synchronous operations like fs.readFileSync() block the event loop, preventing Node.js from handling other requests until the operation completes. Always use async methods in production.', NULL, 2, 'medium'),
('b3333333-3333-3333-3333-333333333333', 'Which is the modern way to handle async operations?', 'multiple_choice', '{"A": "Callbacks", "B": "setTimeout", "C": "async/await", "D": "Loops"}', 'C', 'async/await (introduced in ES2017) is the modern, cleanest way to handle asynchronous operations in Node.js, avoiding callback hell and promise chains.', 'async function getData() { const data = await fetch(); }', 3, 'easy'),
('b3333333-3333-3333-3333-333333333333', 'What does Promise.all() do?', 'multiple_choice', '{"A": "Runs promises sequentially", "B": "Runs promises in parallel and waits for all", "C": "Cancels all promises", "D": "Creates a new promise"}', 'B', 'Promise.all() executes multiple promises in parallel and returns when all have completed (or if any fails). Great for performance when operations don''t depend on each other.', 'await Promise.all([fetch1, fetch2]);', 4, 'medium'),
('b3333333-3333-3333-3333-333333333333', 'Which method appends content to a file?', 'multiple_choice', '{"A": "fs.write()", "B": "fs.add()", "C": "fs.appendFile()", "D": "fs.concat()"}', 'C', 'fs.appendFile() adds content to the end of a file without overwriting existing content. fs.writeFile() would replace the entire file.', 'await fs.appendFile("log.txt", "new line");', 5, 'easy'),
('b3333333-3333-3333-3333-333333333333', 'Streams are better than readFile for large files.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'Streams process data in chunks rather than loading entire files into memory, making them essential for large files and preventing memory issues.', NULL, 6, 'medium'),
('b3333333-3333-3333-3333-333333333333', 'Which module ensures cross-platform file paths?', 'multiple_choice', '{"A": "url", "B": "path", "C": "os", "D": "filesystem"}', 'B', 'The path module provides utilities for working with file paths in a cross-platform way, handling differences between Windows (\\) and Unix (/) separators.', 'path.join(__dirname, "data", "file.txt");', 7, 'medium'),
('b3333333-3333-3333-3333-333333333333', 'What does __dirname represent?', 'multiple_choice', '{"A": "Current working directory", "B": "Directory of the current module", "C": "Home directory", "D": "Root directory"}', 'B', '__dirname is an absolute path to the directory containing the current module file. Use it with path.join() for reliable file paths.', 'const filePath = path.join(__dirname, "config.json");', 8, 'medium'),
('b3333333-3333-3333-3333-333333333333', 'fs.promises provides promise-based file operations.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'fs.promises is a promise-based API for the fs module, allowing you to use async/await instead of callbacks for cleaner code.', 'const fs = require("fs").promises;', 9, 'easy'),
('b3333333-3333-3333-3333-333333333333', 'What error code indicates file not found?', 'multiple_choice', '{"A": "ENOTFOUND", "B": "ENOENT", "C": "ENOFILE", "D": "ENOTEXIST"}', 'B', 'ENOENT (Error NO ENTry) is the error code when a file or directory doesn''t exist. Always check err.code when handling file system errors.', 'if (err.code === "ENOENT") { /* file not found */ }', 10, 'hard');

-- Lesson 4: Environment Variables and Configuration
INSERT INTO ai_learning_lessons (
  id,
  learning_path_id,
  title,
  description,
  content_type,
  content,
  duration_minutes,
  order_index,
  learning_objectives,
  resources
) VALUES (
  'b4444444-4444-4444-4444-444444444444',
  'f5e4d3c2-b1a0-9876-5432-10fedcba9876',
  'Environment Variables and Configuration',
  'Learn to manage configuration securely using environment variables, .env files, and dotenv package.',
  'quiz',
  '# Environment Variables and Configuration

## Why Environment Variables?

Environment variables allow you to:

✅ **Keep secrets safe** - API keys, database passwords
✅ **Configure per environment** - Dev, staging, production
✅ **Avoid hardcoding** - Make code portable
✅ **Follow 12-factor app principles** - Industry best practice

## Accessing Environment Variables

Node.js provides `process.env` to access environment variables:

```javascript
const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST;
const API_KEY = process.env.API_KEY;

console.log("Server will run on port:", PORT);
```

## Setting Environment Variables

### macOS/Linux:
```bash
export PORT=3000
export DB_HOST=localhost
node server.js
```

### Windows (CMD):
```bash
set PORT=3000
set DB_HOST=localhost
node server.js
```

### Windows (PowerShell):
```bash
$env:PORT=3000
$env:DB_HOST="localhost"
node server.js
```

### Inline (Cross-platform):
```bash
PORT=3000 DB_HOST=localhost node server.js
```

## Using dotenv Package

The `dotenv` package loads variables from a `.env` file:

### Installation:
```bash
npm install dotenv
```

### Create .env file:
```
PORT=3000
DB_HOST=localhost
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=mydb
API_KEY=sk_test_12345
NODE_ENV=development
JWT_SECRET=mysupersecretkey
```

⚠️ **NEVER commit .env to git!** Add to `.gitignore`:
```
.env
.env.local
.env.*.local
```

### Load environment variables:
```javascript
// At the very top of your entry file
require("dotenv").config();

const PORT = process.env.PORT;
const DB_HOST = process.env.DB_HOST;
const API_KEY = process.env.API_KEY;

console.log("Config loaded:", { PORT, DB_HOST });
```

## Configuration Best Practices

### 1. Create a config module:

**config/index.js:**
```javascript
require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",

  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "24h"
  },

  api: {
    key: process.env.API_KEY,
    baseUrl: process.env.API_BASE_URL
  }
};
```

**Usage:**
```javascript
const config = require("./config");

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

const db = new Database(config.database);
```

### 2. Validate required variables:

```javascript
function validateEnv() {
  const required = [
    "PORT",
    "DB_HOST",
    "DB_PASSWORD",
    "JWT_SECRET",
    "API_KEY"
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }
}

validateEnv();
```

### 3. Different .env files per environment:

```
.env                    # Default values
.env.development        # Development
.env.test               # Testing
.env.production         # Production (never commit!)
.env.example            # Template (commit this!)
```

**Load specific env file:**
```javascript
const path = require("path");
const dotenv = require("dotenv");

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });
```

## .env.example Template

Create `.env.example` (safe to commit) as a template:

```
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=24h

# API Keys
API_KEY=your_api_key_here
STRIPE_SECRET_KEY=your_stripe_key
```

## Type Safety with TypeScript

For TypeScript projects, declare env types:

```typescript
// types/env.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      NODE_ENV: "development" | "production" | "test";
      DB_HOST: string;
      DB_PASSWORD: string;
      JWT_SECRET: string;
      API_KEY: string;
    }
  }
}

export {};
```

## Security Best Practices

✅ **Never commit secrets** - Use .env and .gitignore
✅ **Use strong secrets** - Generate random JWT secrets
✅ **Rotate keys regularly** - Especially after team member leaves
✅ **Use different keys per environment** - Dev keys ≠ production keys
✅ **Use secret managers in production** - AWS Secrets Manager, Vault
✅ **Validate all variables** - Fail fast if config is wrong

## Generating Secure Secrets

```javascript
const crypto = require("crypto");

// Generate random secret
const secret = crypto.randomBytes(32).toString("hex");
console.log("JWT_SECRET=" + secret);
```

## Common Environment Variables

```
# Server Configuration
PORT=3000
HOST=localhost
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# Authentication
JWT_SECRET=supersecretkey
SESSION_SECRET=anothersecret

# External Services
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=SG...
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...

# URLs
API_BASE_URL=https://api.example.com
FRONTEND_URL=https://example.com

# Features Flags
ENABLE_ANALYTICS=true
ENABLE_CACHING=false
```

## Best Practices Summary

✅ **Load env variables first** - Before importing any modules
✅ **Create a config module** - Centralize configuration
✅ **Validate required variables** - Fail early with clear errors
✅ **Use .env.example** - Document required variables
✅ **Never log sensitive values** - Sanitize logs
✅ **Use type safety** - TypeScript or Joi validation

## Common Pitfalls

❌ **Committing .env file** - Always add to .gitignore
❌ **Hardcoding secrets** - Use env variables
❌ **Not validating config** - App crashes mysteriously
❌ **Same secrets everywhere** - Use different keys per environment
❌ **Forgetting to document** - New developers get stuck

## Quiz Time!

Test your knowledge of environment variables and configuration!',
  50,
  4,
  ARRAY[
    'Understand the purpose of environment variables',
    'Use dotenv package for configuration management',
    'Implement secure configuration best practices',
    'Create maintainable config modules'
  ],
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- Quiz Questions for Lesson 4
INSERT INTO backend_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, code_example, order_index, difficulty) VALUES
('b4444444-4444-4444-4444-444444444444', 'How do you access environment variables in Node.js?', 'multiple_choice', '{"A": "env.variable", "B": "process.env.VARIABLE", "C": "environment.VARIABLE", "D": "system.env"}', 'B', 'Node.js provides the process.env object to access environment variables. Each variable is a property on this object.', 'const port = process.env.PORT;', 1, 'easy'),
('b4444444-4444-4444-4444-444444444444', 'The .env file should be committed to git.', 'true_false', '{"true": "True", "false": "False"}', 'false', 'NEVER commit .env files to git as they contain sensitive information like API keys and passwords. Always add .env to .gitignore.', NULL, 2, 'easy'),
('b4444444-4444-4444-4444-444444444444', 'Which package loads variables from .env files?', 'multiple_choice', '{"A": "env", "B": "dotenv", "C": "envfile", "D": "config"}', 'B', 'The dotenv package is the most popular solution for loading environment variables from .env files into process.env.', 'require("dotenv").config();', 3, 'easy'),
('b4444444-4444-4444-4444-444444444444', 'Where should dotenv.config() be called?', 'multiple_choice', '{"A": "Anywhere in the code", "B": "At the very top of entry file", "C": "Before starting server", "D": "In package.json"}', 'B', 'dotenv.config() must be called at the very top of your entry file, before importing any other modules that might use environment variables.', NULL, 4, 'medium'),
('b4444444-4444-4444-4444-444444444444', 'What is a .env.example file for?', 'multiple_choice', '{"A": "Production environment", "B": "Template showing required variables", "C": "Backup of .env", "D": "Testing environment"}', 'B', '.env.example is a template file (safe to commit) that documents all required environment variables without exposing actual secrets.', NULL, 5, 'medium'),
('b4444444-4444-4444-4444-444444444444', 'Environment variables help keep secrets out of code.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'Environment variables allow you to separate configuration and secrets from code, following security best practices and making code portable across environments.', NULL, 6, 'easy'),
('b4444444-4444-4444-4444-444444444444', 'Which command generates a secure random secret?', 'multiple_choice', '{"A": "Math.random()", "B": "crypto.randomBytes(32).toString(\"hex\")", "C": "Date.now()", "D": "uuid()"}', 'B', 'crypto.randomBytes() generates cryptographically strong random data, perfect for secrets like JWT keys. Always use crypto for security-critical randomness.', 'crypto.randomBytes(32).toString("hex")', 7, 'hard'),
('b4444444-4444-4444-4444-444444444444', 'What should you do if required env variables are missing?', 'multiple_choice', '{"A": "Use default values", "B": "Ignore and continue", "C": "Throw error and fail fast", "D": "Ask user for input"}', 'C', 'Failing fast with clear error messages when required configuration is missing prevents hard-to-debug issues later and follows the fail-fast principle.', NULL, 8, 'medium'),
('b4444444-4444-4444-4444-444444444444', 'NODE_ENV typically has which values?', 'multiple_choice', '{"A": "on/off", "B": "development/production/test", "C": "true/false", "D": "local/remote"}', 'B', 'NODE_ENV conventionally indicates the environment: "development" for local dev, "test" for testing, and "production" for live deployments.', 'if (process.env.NODE_ENV === "production") {...}', 9, 'medium');

-- =====================================================
-- SECTION 2: EXPRESS.JS & REST APIs (Lessons 5-8)
-- =====================================================

-- Lesson 5: Introduction to Express.js
INSERT INTO ai_learning_lessons (
  id,
  learning_path_id,
  title,
  description,
  content_type,
  content,
  duration_minutes,
  order_index,
  learning_objectives,
  resources
) VALUES (
  'b5555555-5555-5555-5555-555555555555',
  'f5e4d3c2-b1a0-9876-5432-10fedcba9876',
  'Introduction to Express.js',
  'Learn Express.js, the most popular Node.js web framework for building APIs and web applications.',
  'quiz',
  '# Introduction to Express.js

## What is Express.js?

Express.js is a **minimal and flexible** Node.js web application framework that provides a robust set of features for web and mobile applications. It''s the most popular Node.js framework with over 60k stars on GitHub.

### Why Express?

1. **Simple and minimalist** - Unopinionated, build what you want
2. **Fast development** - Less boilerplate code
3. **Robust routing** - Clean URL handling
4. **Middleware ecosystem** - Tons of plugins
5. **Industry standard** - Used by Netflix, Uber, IBM

## Installing Express

```bash
npm install express
```

## Your First Express Server

**server.js:**
```javascript
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Run it:**
```bash
node server.js
```

Visit `http://localhost:3000/` - you''ll see "Hello from Express!"

## Basic Routing

Routes define how your application responds to requests:

```javascript
const express = require("express");
const app = express();

// GET request
app.get("/", (req, res) => {
  res.send("Home page");
});

// GET with URL parameter
app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  res.send(`User ID: ${userId}`);
});

// POST request
app.post("/users", (req, res) => {
  res.send("Create new user");
});

// PUT request
app.put("/users/:id", (req, res) => {
  res.send(`Update user ${req.params.id}`);
});

// DELETE request
app.delete("/users/:id", (req, res) => {
  res.send(`Delete user ${req.params.id}`);
});

app.listen(3000);
```

## Request and Response Objects

### Request (req) Object

The `req` object contains information about the HTTP request:

```javascript
app.get("/user/:id", (req, res) => {
  // URL parameters
  console.log(req.params.id);

  // Query strings: /user/1?sort=asc&limit=10
  console.log(req.query.sort);   // "asc"
  console.log(req.query.limit);  // "10"

  // Request headers
  console.log(req.headers["user-agent"]);

  // Request method
  console.log(req.method);  // GET, POST, etc.

  // Request path
  console.log(req.path);    // /user/1

  res.send("Check console for request details");
});
```

### Response (res) Object

The `res` object is used to send responses:

```javascript
app.get("/demo", (req, res) => {
  // Send text
  res.send("Hello!");

  // Send JSON
  res.json({ message: "Hello", status: "success" });

  // Set status code
  res.status(404).send("Not found");

  // Redirect
  res.redirect("/home");

  // Send file
  res.sendFile("/path/to/file.html");

  // Set headers
  res.set("Content-Type", "application/json");
  res.send(''{"data": "value"}'');
});
```

## Middleware

Middleware functions have access to `req`, `res`, and `next`:

```javascript
// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();  // Pass to next middleware
});

// Built-in middleware for JSON
app.use(express.json());

// Built-in middleware for URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Route-specific middleware
const checkAuth = (req, res, next) => {
  if (req.headers.authorization) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

app.get("/protected", checkAuth, (req, res) => {
  res.send("You are authenticated!");
});
```

## Sending JSON Responses

Express makes JSON APIs easy:

```javascript
app.get("/api/users", (req, res) => {
  const users = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" }
  ];

  res.json({
    success: true,
    data: users,
    count: users.length
  });
});
```

## Query Parameters

Handle URL query strings:

```javascript
// URL: /search?q=node&category=backend&page=2
app.get("/search", (req, res) => {
  const { q, category, page = 1 } = req.query;

  res.json({
    query: q,
    category: category,
    page: parseInt(page)
  });
});
```

## URL Parameters

Dynamic route segments:

```javascript
app.get("/posts/:postId/comments/:commentId", (req, res) => {
  const { postId, commentId } = req.params;

  res.json({
    message: "Fetching comment",
    postId: postId,
    commentId: commentId
  });
});
```

## Static Files

Serve static files (images, CSS, JS):

```javascript
// Serve files from "public" directory
app.use(express.static("public"));

// Now files in "public" are accessible:
// public/image.png → http://localhost:3000/image.png
// public/css/style.css → http://localhost:3000/css/style.css
```

## Complete Example

**server.js:**
```javascript
const express = require("express");
const app = express();

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my API" });
});

app.get("/api/users", (req, res) => {
  res.json({ users: [] });
});

app.post("/api/users", (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({
    message: "User created",
    user: { name, email }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

## Best Practices

✅ **Use middleware** - DRY principle for common tasks
✅ **Return proper status codes** - 200, 201, 400, 404, 500, etc.
✅ **Always send JSON for APIs** - Consistent response format
✅ **Handle 404s** - Add catch-all route at the end
✅ **Use environment variables** - For ports and config

## Common Status Codes

- **200 OK** - Successful GET request
- **201 Created** - Successful POST request
- **400 Bad Request** - Invalid data
- **401 Unauthorized** - Not authenticated
- **403 Forbidden** - Authenticated but no permission
- **404 Not Found** - Resource doesn''t exist
- **500 Internal Server Error** - Server error

## Common Pitfalls

❌ **Forgetting next()** - Middleware gets stuck
❌ **Sending response twice** - Causes errors
❌ **Not using express.json()** - req.body is undefined
❌ **Wrong order of routes** - Specific routes before general

## Quiz Time!

Test your Express.js knowledge!',
  55,
  5,
  ARRAY[
    'Understand Express.js and its benefits',
    'Create a basic Express server',
    'Implement routing and middleware',
    'Handle request and response objects'
  ],
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- Quiz Questions for Lesson 5
INSERT INTO backend_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, code_example, order_index, difficulty) VALUES
('b5555555-5555-5555-5555-555555555555', 'What is Express.js?', 'multiple_choice', '{"A": "A database", "B": "A Node.js web framework", "C": "A programming language", "D": "A testing tool"}', 'B', 'Express.js is a minimal and flexible Node.js web application framework providing features for building web and mobile applications.', NULL, 1, 'easy'),
('b5555555-5555-5555-5555-555555555555', 'How do you create an Express app?', 'multiple_choice', '{"A": "new Express()", "B": "express.create()", "C": "express()", "D": "Express.app()"}', 'C', 'You create an Express application by calling the express() function, which returns an Express application object.', 'const app = express();', 2, 'easy'),
('b5555555-5555-5555-5555-555555555555', 'Middleware functions have access to req, res, and next.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'Middleware functions in Express have access to the request object (req), response object (res), and the next middleware function in the stack (next).', NULL, 3, 'easy'),
('b5555555-5555-5555-5555-555555555555', 'Which method sends JSON responses?', 'multiple_choice', '{"A": "res.send()", "B": "res.json()", "C": "res.sendJSON()", "D": "res.data()"}', 'B', 'res.json() sends a JSON response with the correct Content-Type header automatically set to application/json.', 'res.json({ message: "Hello" });', 4, 'easy'),
('b5555555-5555-5555-5555-555555555555', 'What does req.params contain?', 'multiple_choice', '{"A": "Query strings", "B": "URL route parameters", "C": "Request headers", "D": "Request body"}', 'B', 'req.params contains route parameters from the URL path, like :id in /users/:id.', 'app.get("/users/:id", (req, res) => { console.log(req.params.id); });', 5, 'medium'),
('b5555555-5555-5555-5555-555555555555', 'express.json() middleware parses JSON request bodies.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'The express.json() middleware parses incoming requests with JSON payloads and populates req.body with the parsed data.', 'app.use(express.json());', 6, 'easy'),
('b5555555-5555-5555-5555-555555555555', 'What status code indicates successful resource creation?', 'multiple_choice', '{"A": "200", "B": "201", "C": "204", "D": "301"}', 'B', '201 Created is the standard HTTP status code for successful POST requests that create new resources.', 'res.status(201).json({ user: newUser });', 7, 'medium'),
('b5555555-5555-5555-5555-555555555555', 'What does next() do in middleware?', 'multiple_choice', '{"A": "Ends the response", "B": "Passes control to next middleware", "C": "Restarts the server", "D": "Creates new route"}', 'B', 'Calling next() passes control to the next middleware function in the stack. Forgetting to call it will cause requests to hang.', NULL, 8, 'medium'),
('b5555555-5555-5555-5555-555555555555', 'app.use() applies middleware globally or to specific paths.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'app.use() can apply middleware globally (no path specified) or to specific paths/route prefixes (path specified as first argument).', 'app.use("/api", authMiddleware);', 9, 'medium');

-- =====================================================
-- COMPLETE: All 14 Backend & APIs Lessons
-- =====================================================
-- Section 1: Node.js Fundamentals (Lessons 1-4)
-- Section 2: Express.js & REST APIs (Lessons 5-8)
-- Section 3: Database Integration (Lessons 9-11)
-- Section 4: Advanced Backend (Lessons 12-14)
-- =====================================================

-- Lesson 6: Building REST APIs & Routing
INSERT INTO ai_learning_lessons (
  id,
  learning_path_id,
  title,
  description,
  content_type,
  content,
  duration_minutes,
  order_index,
  learning_objectives,
  resources
) VALUES (
  'b6666666-6666-6666-6666-666666666666',
  'f5e4d3c2-b1a0-9876-5432-10fedcba9876',
  'Building REST APIs & Routing',
  'Master RESTful API design principles, HTTP methods, and advanced routing patterns in Express.js.',
  'quiz',
  '# Building REST APIs & Routing

## What is REST?

**REST** (Representational State Transfer) is an architectural style for designing networked applications. RESTful APIs use HTTP methods to perform CRUD operations.

### REST Principles

1. **Client-Server** - Separation of concerns
2. **Stateless** - Each request contains all needed information
3. **Cacheable** - Responses must define if they can be cached
4. **Uniform Interface** - Consistent URL structure
5. **Layered System** - Client doesn''t know if connected directly

## HTTP Methods (CRUD)

| Method | Purpose | Example |
|--------|---------|---------|
| GET | Read/Retrieve | Get user list |
| POST | Create | Create new user |
| PUT/PATCH | Update | Update user |
| DELETE | Delete | Delete user |

### GET - Retrieve Resources

```javascript
// Get all users
app.get("/api/users", (req, res) => {
  const users = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" }
  ];
  res.json(users);
});

// Get single user
app.get("/api/users/:id", (req, res) => {
  const user = { id: req.params.id, name: "Alice" };
  res.json(user);
});
```

### POST - Create Resources

```javascript
app.use(express.json()); // Required to parse JSON body

app.post("/api/users", (req, res) => {
  const { name, email } = req.body;

  const newUser = {
    id: Date.now(),
    name,
    email,
    createdAt: new Date()
  };

  res.status(201).json({
    message: "User created successfully",
    user: newUser
  });
});
```

### PUT - Update Resources (Full)

```javascript
app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const updatedUser = {
    id: parseInt(id),
    name,
    email,
    updatedAt: new Date()
  };

  res.json({
    message: "User updated successfully",
    user: updatedUser
  });
});
```

### PATCH - Update Resources (Partial)

```javascript
app.patch("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const updates = req.body; // Only fields to update

  res.json({
    message: "User partially updated",
    id: id,
    updated: Object.keys(updates)
  });
});
```

### DELETE - Remove Resources

```javascript
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  res.json({
    message: `User ${id} deleted successfully`
  });
});
```

## RESTful URL Design

### Good URL Structure

```javascript
// Resource collections (plural)
GET    /api/users           // Get all users
POST   /api/users           // Create user
GET    /api/users/123       // Get specific user
PUT    /api/users/123       // Update user
DELETE /api/users/123       // Delete user

// Nested resources
GET    /api/users/123/posts       // User''s posts
POST   /api/users/123/posts       // Create post for user
GET    /api/posts/456/comments    // Post''s comments
```

### Bad URL Design

```javascript
❌ GET  /api/getUsers
❌ POST /api/createUser
❌ GET  /api/user?action=delete
❌ GET  /api/users/delete/123
```

## Router Organization

For large apps, organize routes into separate files:

**routes/users.js:**
```javascript
const express = require("express");
const router = express.Router();

// Base path: /api/users
router.get("/", (req, res) => {
  res.json({ users: [] });
});

router.get("/:id", (req, res) => {
  res.json({ user: {} });
});

router.post("/", (req, res) => {
  res.status(201).json({ user: {} });
});

router.put("/:id", (req, res) => {
  res.json({ user: {} });
});

router.delete("/:id", (req, res) => {
  res.status(204).send();
});

module.exports = router;
```

**server.js:**
```javascript
const express = require("express");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");

const app = express();
app.use(express.json());

// Mount routers
app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);

app.listen(3000);
```

## Query Parameters for Filtering

```javascript
// URL: /api/users?role=admin&sort=name&limit=10
app.get("/api/users", (req, res) => {
  const {
    role,
    sort = "createdAt",
    limit = 20,
    page = 1
  } = req.query;

  res.json({
    users: [],
    filters: { role, sort },
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit)
    }
  });
});
```

## API Versioning

```javascript
// v1 routes
app.use("/api/v1/users", usersV1Router);

// v2 routes (breaking changes)
app.use("/api/v2/users", usersV2Router);
```

## Route Parameters Validation

```javascript
// Validate numeric ID
app.param("id", (req, res, next, id) => {
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  next();
});

app.get("/api/users/:id", (req, res) => {
  // ID is already validated
  res.json({ userId: req.params.id });
});
```

## Best Practices

✅ **Use nouns, not verbs** - /users not /getUsers
✅ **Use plural names** - /users not /user
✅ **Use HTTP methods correctly** - GET, POST, PUT, DELETE
✅ **Return appropriate status codes** - 200, 201, 400, 404, etc.
✅ **Version your API** - /api/v1/users
✅ **Use consistent response format** - Always JSON with success/error
✅ **Implement pagination** - Don''t return all records
✅ **Support filtering and sorting** - Use query parameters

## Common Status Codes

- **200 OK** - Successful GET, PUT, PATCH
- **201 Created** - Successful POST
- **204 No Content** - Successful DELETE
- **400 Bad Request** - Invalid data
- **404 Not Found** - Resource doesn''t exist
- **500 Internal Server Error** - Server error

## Quiz Time!

Master REST API design and routing!',
  60,
  6,
  ARRAY[
    'Understand REST principles and conventions',
    'Implement CRUD operations with proper HTTP methods',
    'Design clean and scalable API routes',
    'Organize routes using Express Router'
  ],
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- Quiz Questions for Lesson 6
INSERT INTO backend_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, code_example, order_index, difficulty) VALUES
('b6666666-6666-6666-6666-666666666666', 'What does REST stand for?', 'multiple_choice', '{"A": "Remote Execution State Transfer", "B": "Representational State Transfer", "C": "Relational State Transport", "D": "Request State Transfer"}', 'B', 'REST stands for Representational State Transfer, an architectural style for designing networked applications using standard HTTP methods.', NULL, 1, 'easy'),
('b6666666-6666-6666-6666-666666666666', 'Which HTTP method creates a new resource?', 'multiple_choice', '{"A": "GET", "B": "PUT", "C": "POST", "D": "DELETE"}', 'C', 'POST is used to create new resources. It sends data to the server to create a new entity.', 'app.post("/api/users", handler);', 2, 'easy'),
('b6666666-6666-6666-6666-666666666666', 'PUT and PATCH are identical methods.', 'true_false', '{"true": "True", "false": "False"}', 'false', 'PUT replaces the entire resource, while PATCH only updates specified fields (partial update). Use PUT for full updates and PATCH for partial updates.', NULL, 3, 'medium'),
('b6666666-6666-6666-6666-666666666666', 'What status code indicates successful resource creation?', 'multiple_choice', '{"A": "200 OK", "B": "201 Created", "C": "204 No Content", "D": "202 Accepted"}', 'B', '201 Created is the standard status code for successful POST requests that create a new resource.', 'res.status(201).json({ user: newUser });', 4, 'medium'),
('b6666666-6666-6666-6666-666666666666', 'Which URL pattern follows REST conventions?', 'multiple_choice', '{"A": "/api/getUsers", "B": "/api/users", "C": "/api/user/list", "D": "/api/fetchAllUsers"}', 'B', 'RESTful URLs use nouns (not verbs) in plural form. /api/users is correct; the HTTP method (GET, POST, etc.) indicates the action.', NULL, 5, 'medium'),
('b6666666-6666-6666-6666-666666666666', 'Express Router helps organize routes into modules.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'Express Router allows you to create modular, mountable route handlers, making it easier to organize and maintain large applications.', 'const router = express.Router();', 6, 'easy'),
('b6666666-6666-6666-6666-666666666666', 'What status code should DELETE return on success?', 'multiple_choice', '{"A": "200 OK", "B": "201 Created", "C": "204 No Content", "D": "404 Not Found"}', 'C', '204 No Content is standard for successful DELETE operations as there''s no content to return. The resource has been deleted.', 'res.status(204).send();', 7, 'medium');

-- Lesson 7: Middleware and Request/Response Handling
INSERT INTO ai_learning_lessons (
  id, learning_path_id, title, description, content_type, content, duration_minutes, order_index,
  learning_objectives, resources
) VALUES (
  'b7777777-7777-7777-7777-777777777777',
  'f5e4d3c2-b1a0-9876-5432-10fedcba9876',
  'Middleware and Request/Response Handling',
  'Deep dive into Express middleware, request processing, custom middleware, and the middleware chain.',
  'quiz',
  '# Middleware and Request/Response Handling

## Understanding Middleware

Middleware functions are the backbone of Express.js. They have access to:
- **req** - Request object
- **res** - Response object
- **next** - Next middleware function

### How Middleware Works

```javascript
app.use((req, res, next) => {
  console.log("Middleware executed!");
  next(); // Pass to next middleware
});

app.get("/", (req, res) => {
  res.send("Final handler");
});
```

**Flow:** Request → Middleware 1 → Middleware 2 → Route Handler → Response

## Types of Middleware

### 1. Application-Level Middleware

```javascript
const express = require("express");
const app = express();

// Runs for every request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Runs for specific path
app.use("/api", (req, res, next) => {
  console.log("API request");
  next();
});
```

### 2. Built-in Middleware

```javascript
// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static("public"));
```

### 3. Custom Middleware Examples

**Logging Middleware:**
```javascript
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

app.use(logger);
```

**Authentication Middleware:**
```javascript
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    req.user = { id: 123, name: "John" };
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
```

### 4. Error-Handling Middleware

```javascript
// Must have 4 parameters
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message
  });
});
```

## Request Object

```javascript
app.get("/demo", (req, res) => {
  // URL parameters
  console.log(req.params.id);

  // Query strings
  console.log(req.query.name);

  // Request body
  console.log(req.body);

  // Headers
  console.log(req.headers["user-agent"]);

  // Client IP
  console.log(req.ip);

  res.send("Check console");
});
```

## Response Object

```javascript
app.get("/demo", (req, res) => {
  // Send different responses
  res.send("Text");
  res.json({ data: "JSON" });
  res.status(404).send("Not found");

  // Set headers
  res.set("Content-Type", "application/json");

  // Redirect
  res.redirect("/home");

  // Set cookies
  res.cookie("name", "value", { maxAge: 900000 });
});
```

## Best Practices

✅ **Call next()** - Always in middleware unless sending response
✅ **Order matters** - Body parsers first, error handlers last
✅ **Handle errors** - Always catch and pass to next()
✅ **Keep middleware focused** - Single responsibility

## Quiz Time!

Master Express middleware!',
  55,
  7,
  ARRAY[
    'Understand how middleware works in Express',
    'Create custom middleware for common tasks',
    'Master request and response objects',
    'Implement proper error handling'
  ],
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- Quiz Questions for Lesson 7
INSERT INTO backend_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, code_example, order_index, difficulty) VALUES
('b7777777-7777-7777-7777-777777777777', 'What three parameters do middleware functions receive?', 'multiple_choice', '{"A": "app, server, port", "B": "req, res, next", "C": "request, response, callback", "D": "data, error, success"}', 'B', 'Middleware functions in Express receive req (request), res (response), and next (function to pass control to next middleware).', 'app.use((req, res, next) => { next(); });', 1, 'easy'),
('b7777777-7777-7777-7777-777777777777', 'Forgetting to call next() causes the request to hang.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'If you don''t call next() and don''t send a response, the request will hang indefinitely.', NULL, 2, 'medium'),
('b7777777-7777-7777-7777-777777777777', 'Which middleware parses JSON request bodies?', 'multiple_choice', '{"A": "express.json()", "B": "bodyParser()", "C": "express.body()", "D": "json.parse()"}', 'A', 'express.json() is built-in Express middleware that parses incoming JSON payloads.', 'app.use(express.json());', 3, 'easy'),
('b7777777-7777-7777-7777-777777777777', 'Error handling middleware must have how many parameters?', 'multiple_choice', '{"A": "2 parameters", "B": "3 parameters", "C": "4 parameters", "D": "5 parameters"}', 'C', 'Error handling middleware MUST have exactly 4 parameters (err, req, res, next).', 'app.use((err, req, res, next) => {...});', 4, 'medium'),
('b7777777-7777-7777-7777-777777777777', 'Middleware order matters in Express.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'Middleware executes in the order it''s defined. Body parsers must come before routes, error handlers last.', NULL, 5, 'easy'),
('b7777777-7777-7777-7777-777777777777', 'How do you pass errors to Express error handlers?', 'multiple_choice', '{"A": "throw error", "B": "return error", "C": "next(error)", "D": "res.error()"}', 'C', 'Pass errors to next(error) to trigger Express error handling middleware.', 'catch (err) { next(err); }', 6, 'medium'),
('b7777777-7777-7777-7777-777777777777', 'What does req.query contain?', 'multiple_choice', '{"A": "Database queries", "B": "URL query string parameters", "C": "Request body", "D": "SQL queries"}', 'B', 'req.query contains parsed URL query string parameters.', NULL, 7, 'easy');

-- Lesson 8: Error Handling and Input Validation
INSERT INTO ai_learning_lessons (
  id, learning_path_id, title, description, content_type, content, duration_minutes, order_index,
  learning_objectives, resources
) VALUES (
  'b8888888-8888-8888-8888-888888888888',
  'f5e4d3c2-b1a0-9876-5432-10fedcba9876',
  'Error Handling and Input Validation',
  'Implement robust error handling strategies and validate user input using Joi and express-validator.',
  'quiz',
  '# Error Handling and Input Validation

## Why Error Handling Matters

Proper error handling:
✅ Prevents server crashes
✅ Provides meaningful feedback
✅ Helps with debugging
✅ Improves security

## Express Error Handling

### Basic Error Handler

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    error: {
      message: err.message,
      status: err.statusCode || 500
    }
  });
});
```

### Custom Error Class

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Usage
throw new AppError("User not found", 404);
```

### Async Error Wrapper

```javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get("/users", asyncHandler(async (req, res) => {
  const users = await User.findAll();
  res.json(users);
}));
```

## Input Validation with Joi

```bash
npm install joi
```

```javascript
const Joi = require("joi");

const userSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  age: Joi.number().min(18).max(120),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/)
});

app.post("/api/users", (req, res) => {
  const { error, value } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: error.details[0].message
    });
  }

  res.status(201).json({ user: value });
});
```

### Validation Middleware

```javascript
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: error.details[0].message
    });
  }

  next();
};

app.post("/api/users", validate(userSchema), createUser);
```

## Best Practices

✅ **Validate all inputs** - Never trust client data
✅ **Use proper status codes** - 400 for validation, 500 for server errors
✅ **Log errors** - But don''t expose to clients
✅ **Handle async errors** - Use try-catch or wrappers
✅ **Create custom error classes** - For consistent handling

## Quiz Time!',
  50,
  8,
  ARRAY[
    'Implement comprehensive error handling',
    'Create custom error classes',
    'Validate user input with Joi',
    'Handle async errors properly'
  ],
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- Quiz Questions for Lesson 8
INSERT INTO backend_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, code_example, order_index, difficulty) VALUES
('b8888888-8888-8888-8888-888888888888', 'Error handling middleware must be defined last.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'Error handling middleware must be defined after all other middleware and routes.', NULL, 1, 'easy'),
('b8888888-8888-8888-8888-888888888888', 'Which status code indicates validation error?', 'multiple_choice', '{"A": "200", "B": "400", "C": "404", "D": "500"}', 'B', '400 Bad Request is the standard status code for validation failures.', NULL, 2, 'easy'),
('b8888888-8888-8888-8888-888888888888', 'What package is commonly used for schema validation?', 'multiple_choice', '{"A": "validator", "B": "Joi", "C": "check", "D": "validate-js"}', 'B', 'Joi is the most popular schema validation library for Node.js.', 'const schema = Joi.object({...});', 3, 'medium'),
('b8888888-8888-8888-8888-888888888888', 'Try-catch is needed for async route handlers.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'Async functions need try-catch to catch errors and pass them to next(error).', NULL, 4, 'medium'),
('b8888888-8888-8888-8888-888888888888', 'You should expose full error stack traces to clients.', 'true_false', '{"true": "True", "false": "False"}', 'false', 'Never expose stack traces in production as it reveals security vulnerabilities.', NULL, 5, 'medium');


-- Lesson 9: Database Fundamentals (SQL vs NoSQL)
INSERT INTO ai_learning_lessons (
  id, learning_path_id, title, description, content_type, content, duration_minutes, order_index,
  learning_objectives, resources
) VALUES (
  'b9999999-9999-9999-9999-999999999999',
  'f5e4d3c2-b1a0-9876-5432-10fedcba9876',
  'Database Fundamentals (SQL vs NoSQL)',
  'Understand different database types, when to use SQL vs NoSQL, and database design principles.',
  'quiz',
  '# Database Fundamentals (SQL vs NoSQL)

## What is a Database?

A database is an organized collection of structured data that can be easily accessed, managed, and updated.

## SQL Databases (Relational)

### Popular SQL Databases
- **PostgreSQL** - Open-source, feature-rich
- **MySQL** - Popular, easy to use
- **SQLite** - Lightweight, file-based
- **Microsoft SQL Server** - Enterprise-grade

### SQL Characteristics

✅ **Structured data** - Tables with rows and columns
✅ **ACID compliant** - Atomicity, Consistency, Isolation, Durability
✅ **Relations** - Foreign keys link tables
✅ **SQL language** - Standardized query language
✅ **Schema required** - Structure defined upfront

### Example: Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Query data
SELECT * FROM users WHERE email = ''alice@example.com'';

-- Join tables
SELECT users.name, posts.title
FROM users
JOIN posts ON users.id = posts.user_id;
```

### When to Use SQL

✅ Complex queries with JOINs
✅ Transactions required (banking, e-commerce)
✅ Data integrity is critical
✅ Structured, predictable data
✅ Need ACID guarantees

## NoSQL Databases (Non-Relational)

### Popular NoSQL Databases

- **MongoDB** - Document store (JSON-like)
- **Redis** - Key-value store (caching)
- **Cassandra** - Column store (scalability)
- **DynamoDB** - AWS managed NoSQL

### NoSQL Characteristics

✅ **Flexible schema** - No rigid structure
✅ **Horizontally scalable** - Easy to scale out
✅ **Fast reads/writes** - Optimized performance
✅ **Denormalized data** - Data duplication accepted
✅ **Eventually consistent** - Not always ACID

### Example: MongoDB Document

```javascript
// User document in MongoDB
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "Alice",
  email: "alice@example.com",
  posts: [
    {
      title: "My first post",
      content: "Hello world!",
      createdAt: ISODate("2024-01-15")
    }
  ],
  profile: {
    age: 25,
    city: "New York"
  }
}
```

### When to Use NoSQL

✅ Flexible/changing schema
✅ Horizontal scaling needed
✅ High read/write throughput
✅ Unstructured data (logs, social media)
✅ Real-time applications

## SQL vs NoSQL Comparison

| Feature | SQL | NoSQL |
|---------|-----|-------|
| **Schema** | Fixed, predefined | Flexible, dynamic |
| **Scaling** | Vertical (more powerful server) | Horizontal (more servers) |
| **Transactions** | ACID guaranteed | Eventually consistent |
| **Relations** | JOINs supported | Denormalized data |
| **Query Language** | SQL (standardized) | Database-specific |
| **Use Case** | Complex queries, transactions | High throughput, flexibility |

## Database Design Principles

### Normalization (SQL)

**1NF - First Normal Form:**
- Each column contains atomic values
- No repeating groups

**2NF - Second Normal Form:**
- Meets 1NF
- No partial dependencies

**3NF - Third Normal Form:**
- Meets 2NF
- No transitive dependencies

### Example: Bad vs Good Design

**❌ Bad (Denormalized):**
```sql
CREATE TABLE orders (
  id INT,
  customer_name VARCHAR(100),
  customer_email VARCHAR(255),
  product_name VARCHAR(100),
  product_price DECIMAL
);
```

**✅ Good (Normalized):**
```sql
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(255)
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  price DECIMAL
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(id),
  product_id INT REFERENCES products(id),
  quantity INT,
  created_at TIMESTAMP
);
```

## Best Practices

✅ **Choose the right database** - SQL for structure, NoSQL for flexibility
✅ **Index frequently queried fields** - Improves performance
✅ **Normalize SQL data** - Reduce redundancy
✅ **Denormalize NoSQL data** - Accept duplication for speed
✅ **Use connection pooling** - Reuse database connections
✅ **Backup regularly** - Protect against data loss

## Common Pitfalls

❌ **No indexing** - Slow queries
❌ **Over-normalization** - Too many JOINs
❌ **N+1 query problem** - Multiple queries in loops
❌ **No connection pooling** - Poor performance
❌ **Storing sensitive data unencrypted** - Security risk

## Quiz Time!

Master database fundamentals!',
  60,
  9,
  ARRAY[
    'Understand SQL vs NoSQL differences',
    'Know when to use each database type',
    'Apply database design principles',
    'Understand normalization concepts'
  ],
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- Quiz Questions for Lesson 9
INSERT INTO backend_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, code_example, order_index, difficulty) VALUES
('b9999999-9999-9999-9999-999999999999', 'What does SQL stand for?', 'multiple_choice', '{"A": "Server Query Language", "B": "Structured Query Language", "C": "Simple Query Language", "D": "Standard Query Language"}', 'B', 'SQL stands for Structured Query Language, a standardized language for managing relational databases.', NULL, 1, 'easy'),
('b9999999-9999-9999-9999-999999999999', 'SQL databases require a fixed schema.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'SQL databases require a predefined schema with table structures, column types, and relationships defined upfront.', NULL, 2, 'easy'),
('b9999999-9999-9999-9999-999999999999', 'Which database type is best for complex JOINs?', 'multiple_choice', '{"A": "NoSQL", "B": "SQL", "C": "Key-value store", "D": "Document store"}', 'B', 'SQL databases excel at complex queries with JOINs across multiple tables due to their relational structure.', NULL, 3, 'medium'),
('b9999999-9999-9999-9999-999999999999', 'What does ACID stand for?', 'multiple_choice', '{"A": "Atomic Consistent Isolated Durable", "B": "All Changes In Database", "C": "Automatic Consistent Integration Data", "D": "Always Correct Information Database"}', 'A', 'ACID stands for Atomicity, Consistency, Isolation, Durability - guarantees for reliable transactions in databases.', NULL, 4, 'medium'),
('b9999999-9999-9999-9999-999999999999', 'NoSQL databases are always eventually consistent.', 'true_false', '{"true": "True", "false": "False"}', 'false', 'While many NoSQL databases use eventual consistency for scalability, some offer strong consistency options (e.g., MongoDB with proper configuration).', NULL, 5, 'hard'),
('b9999999-9999-9999-9999-999999999999', 'Which scaling approach is typical for NoSQL?', 'multiple_choice', '{"A": "Vertical scaling", "B": "Horizontal scaling", "C": "No scaling needed", "D": "Manual scaling only"}', 'B', 'NoSQL databases are designed for horizontal scaling (adding more servers) rather than vertical scaling (more powerful single server).', NULL, 6, 'medium'),
('b9999999-9999-9999-9999-999999999999', 'MongoDB is a document-based NoSQL database.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'MongoDB stores data as JSON-like documents, making it a document-oriented NoSQL database.', NULL, 7, 'easy'),
('b9999999-9999-9999-9999-999999999999', 'What is normalization in databases?', 'multiple_choice', '{"A": "Making data normal", "B": "Organizing data to reduce redundancy", "C": "Increasing database speed", "D": "Adding more tables"}', 'B', 'Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity.', NULL, 8, 'medium');


-- Lesson 10: PostgreSQL & Supabase Basics
INSERT INTO ai_learning_lessons (
  id, learning_path_id, title, description, content_type, content, duration_minutes, order_index,
  learning_objectives, resources
) VALUES (
  'ba000000-0000-0000-0000-000000000000',
  'f5e4d3c2-b1a0-9876-5432-10fedcba9876',
  'PostgreSQL & Supabase Basics',
  'Learn PostgreSQL fundamentals and how to integrate Supabase into your Node.js applications.',
  'quiz',
  '# PostgreSQL & Supabase Basics

## What is PostgreSQL?

PostgreSQL is a powerful, open-source relational database known for:
✅ **ACID compliance** - Reliable transactions
✅ **Advanced features** - JSON, full-text search, geospatial
✅ **Extensible** - Custom functions and data types
✅ **Performance** - Handles large datasets efficiently
✅ **Open source** - Free and community-driven

## What is Supabase?

Supabase is an **open-source Firebase alternative** built on PostgreSQL that provides:
- **Instant REST API** - Auto-generated from database
- **Real-time subscriptions** - Live data updates
- **Authentication** - Built-in user management
- **Storage** - File uploads and CDN
- **Row Level Security (RLS)** - Database-level access control

## Installing PostgreSQL Client

```bash
npm install pg
# Or for Supabase
npm install @supabase/supabase-js
```

## Connecting to PostgreSQL

```javascript
const { Pool } = require(''pg'');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

// Test connection
pool.query(''SELECT NOW()'', (err, res) => {
  if (err) {
    console.error(''Connection error:'', err);
  } else {
    console.log(''Connected to PostgreSQL!'', res.rows[0]);
  }
});
```

## Connecting to Supabase

```javascript
const { createClient } = require(''@supabase/supabase-js'');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Query data
async function getUsers() {
  const { data, error } = await supabase
    .from(''users'')
    .select(''*'');

  if (error) {
    console.error(''Error:'', error);
    return;
  }

  console.log(''Users:'', data);
}
```

## Basic PostgreSQL Operations

### Creating Tables

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Querying with Node.js

```javascript
// Query all users
async function getAllUsers() {
  const result = await pool.query(''SELECT * FROM users'');
  return result.rows;
}

// Query with parameters (SAFE from SQL injection)
async function getUserByEmail(email) {
  const query = ''SELECT * FROM users WHERE email = $1'';
  const result = await pool.query(query, [email]);
  return result.rows[0];
}

// Insert user
async function createUser(name, email, passwordHash) {
  const query = `
    INSERT INTO users (name, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const result = await pool.query(query, [name, email, passwordHash]);
  return result.rows[0];
}
```

## Supabase Query Examples

```javascript
// Select all
const { data, error } = await supabase
  .from(''users'')
  .select(''*'');

// Select with filter
const { data, error } = await supabase
  .from(''users'')
  .select(''name, email'')
  .eq(''email'', ''alice@example.com'')
  .single();

// Insert
const { data, error } = await supabase
  .from(''users'')
  .insert({
    name: ''Alice'',
    email: ''alice@example.com''
  })
  .select();

// Update
const { data, error } = await supabase
  .from(''users'')
  .update({ name: ''Alice Smith'' })
  .eq(''id'', 123)
  .select();

// Delete
const { error } = await supabase
  .from(''users'')
  .delete()
  .eq(''id'', 123);
```

## Connection Pooling

```javascript
const pool = new Pool({
  max: 20,            // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Use the pool
async function queryDatabase() {
  const client = await pool.connect();
  try {
    const result = await client.query(''SELECT * FROM users'');
    return result.rows;
  } finally {
    client.release(); // Always release!
  }
}
```

## Transactions

```javascript
async function transferMoney(fromUser, toUser, amount) {
  const client = await pool.connect();

  try {
    await client.query(''BEGIN'');

    // Deduct from sender
    await client.query(
      ''UPDATE accounts SET balance = balance - $1 WHERE user_id = $2'',
      [amount, fromUser]
    );

    // Add to recipient
    await client.query(
      ''UPDATE accounts SET balance = balance + $1 WHERE user_id = $2'',
      [amount, toUser]
    );

    await client.query(''COMMIT'');
    return { success: true };
  } catch (error) {
    await client.query(''ROLLBACK'');
    throw error;
  } finally {
    client.release();
  }
}
```

## Best Practices

✅ **Use parameterized queries** - Prevents SQL injection
✅ **Use connection pooling** - Better performance
✅ **Release connections** - Avoid memory leaks
✅ **Use transactions** - For related operations
✅ **Index frequently queried columns** - Speed up queries
✅ **Never commit credentials** - Use environment variables

## Common Pitfalls

❌ **String concatenation in SQL** - SQL injection risk
❌ **Not releasing connections** - Exhausts pool
❌ **No error handling** - Silent failures
❌ **Missing indexes** - Slow queries
❌ **Hardcoded credentials** - Security vulnerability

## Quiz Time!

Master PostgreSQL and Supabase!',
  55,
  10,
  ARRAY[
    'Understand PostgreSQL fundamentals',
    'Connect Node.js to PostgreSQL',
    'Use Supabase client for database operations',
    'Implement connection pooling and transactions'
  ],
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- Quiz Questions for Lesson 10
INSERT INTO backend_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, code_example, order_index, difficulty) VALUES
('ba000000-0000-0000-0000-000000000000', 'What package connects Node.js to PostgreSQL?', 'multiple_choice', '{"A": "postgres", "B": "pg", "C": "postgresql", "D": "psql"}', 'B', 'The pg package (node-postgres) is the standard PostgreSQL client for Node.js.', 'npm install pg', 1, 'easy'),
('ba000000-0000-0000-0000-000000000000', 'Supabase is built on top of PostgreSQL.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'Supabase is an open-source Firebase alternative built on PostgreSQL, providing instant APIs and real-time features.', NULL, 2, 'easy'),
('ba000000-0000-0000-0000-000000000000', 'Why use parameterized queries ($1, $2)?', 'multiple_choice', '{"A": "Faster execution", "B": "Prevents SQL injection", "C": "Better syntax", "D": "Automatic validation"}', 'B', 'Parameterized queries prevent SQL injection attacks by separating SQL code from user data.', 'pool.query("SELECT * FROM users WHERE id = $1", [userId]);', 3, 'medium'),
('ba000000-0000-0000-0000-000000000000', 'Connection pooling improves database performance.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'Connection pooling reuses existing connections instead of creating new ones for each query, significantly improving performance.', NULL, 4, 'easy'),
('ba000000-0000-0000-0000-000000000000', 'What does RETURNING * do in INSERT queries?', 'multiple_choice', '{"A": "Deletes the row", "B": "Returns the inserted row", "C": "Returns all rows", "D": "Returns nothing"}', 'B', 'RETURNING * in PostgreSQL returns the inserted/updated row, useful for getting generated IDs or timestamps.', 'INSERT INTO users (...) VALUES (...) RETURNING *;', 5, 'medium'),
('ba000000-0000-0000-0000-000000000000', 'You should always release connections after use.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'Always release connections back to the pool with client.release() to prevent connection exhaustion and memory leaks.', 'client.release();', 6, 'medium'),
('ba000000-0000-0000-0000-000000000000', 'What does BEGIN start in PostgreSQL?', 'multiple_choice', '{"A": "A new database", "B": "A transaction", "C": "A new table", "D": "A connection"}', 'B', 'BEGIN starts a transaction block in PostgreSQL, allowing multiple queries to be committed or rolled back as a unit.', 'await client.query("BEGIN");', 7, 'medium'),
('ba000000-0000-0000-0000-000000000000', 'String concatenation for SQL queries is safe.', 'true_false', '{"true": "True", "false": "False"}', 'false', 'String concatenation creates SQL injection vulnerabilities. Always use parameterized queries with $1, $2, etc.', NULL, 8, 'easy');


-- Lesson 11: CRUD Operations and Query Optimization
INSERT INTO ai_learning_lessons (
  id, learning_path_id, title, description, content_type, content, duration_minutes, order_index,
  learning_objectives, resources
) VALUES (
  'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'f5e4d3c2-b1a0-9876-5432-10fedcba9876',
  'CRUD Operations and Query Optimization',
  'Master Create, Read, Update, Delete operations and optimize database queries for performance.',
  'quiz',
  '# CRUD Operations and Query Optimization

## CRUD Operations

CRUD stands for **Create, Read, Update, Delete** - the four basic database operations.

## CREATE - Inserting Data

### Single Insert

```javascript
async function createUser(name, email) {
  const query = `
    INSERT INTO users (name, email)
    VALUES ($1, $2)
    RETURNING *
  `;

  const result = await pool.query(query, [name, email]);
  return result.rows[0];
}
```

### Bulk Insert

```javascript
async function createMultipleUsers(users) {
  const values = users.map((u, i) =>
    `($${i * 2 + 1}, $${i * 2 + 2})`
  ).join('','');

  const params = users.flatMap(u => [u.name, u.email]);

  const query = `
    INSERT INTO users (name, email)
    VALUES ${values}
    RETURNING *
  `;

  const result = await pool.query(query, params);
  return result.rows;
}
```

## READ - Querying Data

### Basic SELECT

```javascript
// Get all users
async function getAllUsers() {
  const result = await pool.query(''SELECT * FROM users'');
  return result.rows;
}

// Get with filter
async function getUsersByRole(role) {
  const query = ''SELECT * FROM users WHERE role = $1'';
  const result = await pool.query(query, [role]);
  return result.rows;
}
```

### Pagination

```javascript
async function getUsersPaginated(page = 1, limit = 20) {
  const offset = (page - 1) * limit;

  const query = `
    SELECT * FROM users
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
  `;

  const result = await pool.query(query, [limit, offset]);

  // Get total count
  const countResult = await pool.query(''SELECT COUNT(*) FROM users'');
  const total = parseInt(countResult.rows[0].count);

  return {
    data: result.rows,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}
```

### JOIN Operations

```javascript
async function getUserWithPosts(userId) {
  const query = `
    SELECT
      users.id,
      users.name,
      users.email,
      posts.id AS post_id,
      posts.title,
      posts.content
    FROM users
    LEFT JOIN posts ON users.id = posts.user_id
    WHERE users.id = $1
  `;

  const result = await pool.query(query, [userId]);
  return result.rows;
}
```

## UPDATE - Modifying Data

### Basic Update

```javascript
async function updateUser(userId, updates) {
  const query = `
    UPDATE users
    SET name = $1, email = $2, updated_at = NOW()
    WHERE id = $3
    RETURNING *
  `;

  const result = await pool.query(query, [
    updates.name,
    updates.email,
    userId
  ]);

  return result.rows[0];
}
```

### Dynamic Update

```javascript
async function updateUserDynamic(userId, updates) {
  const keys = Object.keys(updates);
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join('', '');
  const values = [...Object.values(updates), userId];

  const query = `
    UPDATE users
    SET ${setClause}, updated_at = NOW()
    WHERE id = $${keys.length + 1}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
}
```

## DELETE - Removing Data

### Soft Delete

```javascript
async function softDeleteUser(userId) {
  const query = `
    UPDATE users
    SET deleted_at = NOW()
    WHERE id = $1
    RETURNING *
  `;

  const result = await pool.query(query, [userId]);
  return result.rows[0];
}
```

### Hard Delete

```javascript
async function deleteUser(userId) {
  const query = ''DELETE FROM users WHERE id = $1 RETURNING *'';
  const result = await pool.query(query, [userId]);
  return result.rows[0];
}
```

## Query Optimization

### 1. Use Indexes

```sql
-- Create index on frequently queried column
CREATE INDEX idx_users_email ON users(email);

-- Composite index for multiple columns
CREATE INDEX idx_posts_user_published ON posts(user_id, published);

-- Check if index is being used
EXPLAIN ANALYZE SELECT * FROM users WHERE email = ''alice@example.com'';
```

### 2. Select Only Needed Columns

```javascript
// ❌ Bad - Fetches all columns
const result = await pool.query(''SELECT * FROM users'');

// ✅ Good - Only needed columns
const result = await pool.query(''SELECT id, name, email FROM users'');
```

### 3. Avoid N+1 Problem

```javascript
// ❌ Bad - N+1 queries
async function getUsersWithPostsBad() {
  const users = await pool.query(''SELECT * FROM users'');

  for (const user of users.rows) {
    user.posts = await pool.query(
      ''SELECT * FROM posts WHERE user_id = $1'',
      [user.id]
    );
  }
  return users.rows;
}

// ✅ Good - Single query with JOIN
async function getUsersWithPostsGood() {
  const query = `
    SELECT
      u.*,
      json_agg(p.*) AS posts
    FROM users u
    LEFT JOIN posts p ON u.id = p.user_id
    GROUP BY u.id
  `;

  const result = await pool.query(query);
  return result.rows;
}
```

### 4. Use LIMIT

```javascript
// Always limit results
const query = `
  SELECT * FROM users
  ORDER BY created_at DESC
  LIMIT 100
`;
```

### 5. Connection Pooling

```javascript
// ✅ Use pool, not individual clients
const result = await pool.query(query, params);
```

## Best Practices

✅ **Use indexes** - On frequently queried columns
✅ **Select only needed fields** - Reduce data transfer
✅ **Use pagination** - Don''t fetch all records
✅ **Avoid N+1 queries** - Use JOINs
✅ **Use RETURNING clause** - Get inserted/updated data
✅ **Implement soft deletes** - For audit trails

## Common Pitfalls

❌ **No indexes** - Slow queries
❌ **SELECT *** - Unnecessary data transfer
❌ **N+1 problem** - Multiple queries in loops
❌ **No pagination** - Memory issues with large datasets
❌ **Forgetting WHERE in UPDATE/DELETE** - Updates/deletes all rows!

## Quiz Time!

Master CRUD and optimization!',
  60,
  11,
  ARRAY[
    'Implement all CRUD operations',
    'Optimize queries for performance',
    'Avoid N+1 query problems',
    'Use indexes effectively'
  ],
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- Quiz Questions for Lesson 11
INSERT INTO backend_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, code_example, order_index, difficulty) VALUES
('baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'What does CRUD stand for?', 'multiple_choice', '{"A": "Create Read Update Delete", "B": "Copy Read Update Delete", "C": "Create Retrieve Update Delete", "D": "Create Read Upload Delete"}', 'A', 'CRUD stands for Create, Read, Update, Delete - the four basic database operations.', NULL, 1, 'easy'),
('baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'RETURNING clause returns the modified row.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'RETURNING * in INSERT/UPDATE/DELETE returns the affected row(s), useful for getting generated IDs or updated values.', 'INSERT INTO users (...) VALUES (...) RETURNING *;', 2, 'easy'),
('baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'What is the N+1 query problem?', 'multiple_choice', '{"A": "Querying N+1 tables", "B": "Making N queries in a loop after initial query", "C": "Using N indexes", "D": "Having N+1 users"}', 'B', 'N+1 problem occurs when you make 1 initial query then N additional queries in a loop. Use JOINs instead.', NULL, 3, 'hard'),
('baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Indexes improve query performance.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'Indexes speed up queries by creating quick lookup structures, especially for WHERE clauses and JOINs.', 'CREATE INDEX idx_users_email ON users(email);', 4, 'easy'),
('baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'SELECT * is always the best practice.', 'true_false', '{"true": "True", "false": "False"}', 'false', 'SELECT * fetches all columns unnecessarily. Select only needed columns for better performance and reduced data transfer.', NULL, 5, 'easy'),
('baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'What is soft delete?', 'multiple_choice', '{"A": "Deleting softly", "B": "Marking as deleted instead of removing", "C": "Temporary delete", "D": "Deleting with warning"}', 'B', 'Soft delete marks rows as deleted (deleted_at timestamp) instead of removing them, preserving data for audit trails.', 'UPDATE users SET deleted_at = NOW() WHERE id = $1;', 6, 'medium'),
('baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Pagination prevents loading too much data at once.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'Pagination (LIMIT/OFFSET) loads data in chunks, preventing memory issues and improving performance for large datasets.', NULL, 7, 'easy');


-- Lesson 12: Authentication & Authorization (JWT, Sessions)
INSERT INTO ai_learning_lessons (
  id, learning_path_id, title, description, content_type, content, duration_minutes, order_index,
  learning_objectives, resources
) VALUES (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'f5e4d3c2-b1a0-9876-5432-10fedcba9876',
  'Authentication & Authorization',
  'Implement secure authentication with JWT tokens, sessions, password hashing, and authorization strategies.',
  'quiz',
  '# Authentication & Authorization

## Authentication vs Authorization

- **Authentication** - Who are you? (Login)
- **Authorization** - What can you do? (Permissions)

## Password Hashing with bcrypt

```bash
npm install bcrypt
```

```javascript
const bcrypt = require(''bcrypt'');
const SALT_ROUNDS = 10;

// Hash password during registration
async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

// Verify password during login
async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Registration example
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const passwordHash = await hashPassword(password);

  const user = await pool.query(
    "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
    [email, passwordHash]
  );

  res.status(201).json({ user: user.rows[0] });
});

// Login example
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  const user = result.rows[0];

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({ message: "Login successful", userId: user.id });
});
```

## JWT (JSON Web Tokens)

```bash
npm install jsonwebtoken
```

```javascript
const jwt = require(''jsonwebtoken'');
const JWT_SECRET = process.env.JWT_SECRET; // Store in .env!

// Generate JWT
function generateToken(userId) {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: ''24h'' }
  );
}

// Verify JWT
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Login with JWT
app.post("/login", async (req, res) => {
  // ... authentication logic ...

  const token = generateToken(user.id);

  res.json({
    message: "Login successful",
    token,
    user: { id: user.id, email: user.email }
  });
});
```

## Authentication Middleware

```javascript
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith(''Bearer '')) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.substring(7); // Remove "Bearer "
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: "Invalid token" });
  }

  req.user = decoded;
  next();
};

// Protected route
app.get("/profile", authenticate, async (req, res) => {
  const user = await pool.query(
    "SELECT id, name, email FROM users WHERE id = $1",
    [req.user.userId]
  );

  res.json({ user: user.rows[0] });
});
```

## Session-Based Authentication

```bash
npm install express-session
```

```javascript
const session = require(''express-session'');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === ''production'',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Login with session
app.post("/login", async (req, res) => {
  // ... authentication logic ...

  req.session.userId = user.id;
  req.session.email = user.email;

  res.json({ message: "Login successful" });
});

// Session middleware
const requireSession = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
};

// Protected route
app.get("/profile", requireSession, (req, res) => {
  res.json({
    userId: req.session.userId,
    email: req.session.email
  });
});

// Logout
app.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out" });
});
```

## Role-Based Authorization

```javascript
const authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    const user = await pool.query(
      "SELECT role FROM users WHERE id = $1",
      [req.user.userId]
    );

    if (!user.rows[0] || !allowedRoles.includes(user.rows[0].role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
};

// Admin-only route
app.delete("/users/:id",
  authenticate,
  authorize(''admin''),
  async (req, res) => {
    await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
    res.json({ message: "User deleted" });
  }
);

// Admin or moderator route
app.post("/posts/:id/moderate",
  authenticate,
  authorize(''admin'', ''moderator''),
  async (req, res) => {
    // Moderate post
    res.json({ message: "Post moderated" });
  }
);
```

## Refresh Tokens

```javascript
// Generate both access and refresh tokens
function generateTokens(userId) {
  const accessToken = jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: ''15m'' } // Short-lived
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.REFRESH_SECRET,
    { expiresIn: ''7d'' } // Long-lived
  );

  return { accessToken, refreshToken };
}

// Refresh endpoint
app.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const tokens = generateTokens(decoded.userId);
    res.json(tokens);
  } catch (error) {
    res.status(401).json({ error: "Invalid refresh token" });
  }
});
```

## Best Practices

✅ **Hash passwords** - Use bcrypt, never store plain text
✅ **Use HTTPS** - Encrypt data in transit
✅ **Secure JWT_SECRET** - Strong, random secret
✅ **Short token expiry** - Use refresh tokens
✅ **HttpOnly cookies** - Prevents XSS attacks
✅ **Validate input** - Check email format, password strength
✅ **Rate limiting** - Prevent brute force attacks

## Security Pitfalls

❌ **Storing passwords in plain text** - Never!
❌ **Weak JWT secret** - Use strong random strings
❌ **No token expiry** - Tokens should expire
❌ **Exposing tokens in URLs** - Use headers or cookies
❌ **No rate limiting** - Vulnerable to brute force
❌ **Weak password requirements** - Enforce strong passwords

## Quiz Time!

Master authentication and authorization!',
  65,
  12,
  ARRAY[
    'Implement secure password hashing with bcrypt',
    'Use JWT for stateless authentication',
    'Implement session-based authentication',
    'Add role-based authorization'
  ],
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- Quiz Questions for Lesson 12
INSERT INTO backend_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, code_example, order_index, difficulty) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'What is the difference between authentication and authorization?', 'multiple_choice', '{"A": "No difference", "B": "Authentication is who you are, authorization is what you can do", "C": "They are the same", "D": "Authorization is login"}', 'B', 'Authentication verifies identity (who are you?), while authorization determines permissions (what can you do?).', NULL, 1, 'medium'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Passwords should be stored as plain text.', 'true_false', '{"true": "True", "false": "False"}', 'false', 'NEVER store passwords in plain text. Always hash them using bcrypt or similar algorithms.', NULL, 2, 'easy'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Which package hashes passwords in Node.js?', 'multiple_choice', '{"A": "crypto", "B": "bcrypt", "C": "hash", "D": "password"}', 'B', 'bcrypt is the industry standard for password hashing in Node.js, providing secure salted hashing.', 'const hash = await bcrypt.hash(password, 10);', 3, 'easy'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'What does JWT stand for?', 'multiple_choice', '{"A": "Java Web Token", "B": "JSON Web Token", "C": "JavaScript Web Token", "D": "Just Web Token"}', 'B', 'JWT stands for JSON Web Token, a compact way to securely transmit information between parties.', NULL, 4, 'easy'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'JWTs should never expire.', 'true_false', '{"true": "True", "false": "False"}', 'false', 'JWTs should have expiration times (e.g., 15 minutes for access tokens) for security. Use refresh tokens for longer sessions.', NULL, 5, 'medium'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'What HTTP header is used for JWT authentication?', 'multiple_choice', '{"A": "Authentication", "B": "Authorization", "C": "Token", "D": "Bearer"}', 'B', 'The Authorization header is used with format: "Authorization: Bearer <token>".', 'req.headers.authorization', 6, 'medium'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'HttpOnly cookies prevent XSS attacks.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'HttpOnly cookies cannot be accessed by JavaScript, protecting against XSS (Cross-Site Scripting) attacks.', 'cookie: { httpOnly: true }', 7, 'medium'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'What is role-based authorization?', 'multiple_choice', '{"A": "Login system", "B": "Restricting access based on user roles", "C": "Password system", "D": "Token generation"}', 'B', 'Role-based authorization controls access to resources based on user roles like admin, moderator, user.', 'authorize("admin", "moderator")', 8, 'medium');


-- Lesson 13: File Uploads and Cloud Storage
INSERT INTO ai_learning_lessons (
  id, learning_path_id, title, description, content_type, content, duration_minutes, order_index,
  learning_objectives, resources
) VALUES (
  'bccccccc-cccc-cccc-cccc-cccccccccccc',
  'f5e4d3c2-b1a0-9876-5432-10fedcba9876',
  'File Uploads and Cloud Storage',
  'Handle file uploads, validate files, store them securely, and integrate with cloud storage services.',
  'quiz',
  '# File Uploads and Cloud Storage

## Handling File Uploads with Multer

```bash
npm install multer
```

```javascript
const multer = require(''multer'');
const path = require(''path'');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, ''uploads/'')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + ''-'' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + ''-'' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.mimetype.startsWith(''image/'')) {
      return cb(new Error(''Only image files allowed!''), false);
    }
    cb(null, true);
  }
});

// Single file upload
app.post(''/ upload'', upload.single(''avatar''), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: ''No file uploaded'' });
  }

  res.json({
    message: ''File uploaded successfully'',
    file: {
      filename: req.file.filename,
      size: req.file.size,
      path: req.file.path
    }
  });
});

// Multiple files
app.post(''/upload-multiple'', upload.array(''photos'', 5), (req, res) => {
  res.json({
    message: `${req.files.length} files uploaded`,
    files: req.files.map(f => f.filename)
  });
});
```

## File Validation

```javascript
const validFileTypes = {
  ''image/jpeg'': [''.jpg'', ''.jpeg''],
  ''image/png'': [''.png''],
  ''application/pdf'': [''.pdf'']
};

function validateFile(file) {
  const allowedTypes = Object.keys(validFileTypes);

  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error(''Invalid file type'');
  }

  // Check file extension
  const ext = path.extname(file.originalname).toLowerCase();
  const validExts = validFileTypes[file.mimetype];

  if (!validExts.includes(ext)) {
    throw new Error(''Invalid file extension'');
  }

  return true;
}
```

## Cloud Storage with Supabase

```javascript
const { createClient } = require(''@supabase/supabase-js'');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Upload file to Supabase Storage
app.post(''/upload-cloud'', upload.single(''file''), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: ''No file uploaded'' });
  }

  const file = req.file;
  const filePath = `uploads/${Date.now()}-${file.originalname}`;

  const { data, error } = await supabase.storage
    .from(''user-uploads'')
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      cacheControl: ''3600'',
      upsert: false
    });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(''user-uploads'')
    .getPublicUrl(filePath);

  res.json({
    message: ''File uploaded to cloud'',
    url: publicUrl,
    path: filePath
  });
});
```

## AWS S3 Integration

```bash
npm install aws-sdk
```

```javascript
const AWS = require(''aws-sdk'');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

async function uploadToS3(file) {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `uploads/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: ''public-read''
  };

  const result = await s3.upload(params).promise();
  return result.Location; // Public URL
}

app.post(''/upload-s3'', upload.single(''file''), async (req, res) => {
  try {
    const url = await uploadToS3(req.file);
    res.json({
      message: ''File uploaded to S3'',
      url: url
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Image Processing with Sharp

```bash
npm install sharp
```

```javascript
const sharp = require(''sharp'');

async function resizeImage(file, width, height) {
  const buffer = await sharp(file.buffer)
    .resize(width, height, {
      fit: ''cover'',
      position: ''center''
    })
    .jpeg({ quality: 80 })
    .toBuffer();

  return buffer;
}

app.post(''/upload-resize'', upload.single(''image''), async (req, res) => {
  try {
    // Create thumbnail
    const thumbnail = await resizeImage(req.file, 200, 200);

    // Upload original and thumbnail
    const originalUrl = await uploadToS3(req.file);
    const thumbnailUrl = await uploadToS3({
      ...req.file,
      buffer: thumbnail,
      originalname: `thumb-${req.file.originalname}`
    });

    res.json({
      original: originalUrl,
      thumbnail: thumbnailUrl
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Best Practices

✅ **Validate file types** - Check MIME type and extension
✅ **Limit file size** - Prevent abuse
✅ **Use unique filenames** - Prevent overwrites
✅ **Store metadata in database** - Track uploads
✅ **Use cloud storage** - Scalable and reliable
✅ **Generate thumbnails** - For images
✅ **Scan for viruses** - In production
✅ **Set proper permissions** - Control access

## Security Considerations

❌ **Don''t trust client-provided MIME types** - Validate server-side
❌ **Don''t execute uploaded files** - Security risk
❌ **Don''t store uploads in public directory** - Use CDN or storage
❌ **Don''t skip virus scanning** - For production
❌ **Don''t use original filenames** - Generate unique names

## Quiz Time!

Master file uploads and storage!',
  50,
  13,
  ARRAY[
    'Handle file uploads with multer',
    'Validate and process uploaded files',
    'Integrate cloud storage services',
    'Implement secure file handling practices'
  ],
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- Quiz Questions for Lesson 13
INSERT INTO backend_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, code_example, order_index, difficulty) VALUES
('bccccccc-cccc-cccc-cccc-cccccccccccc', 'Which package handles file uploads in Express?', 'multiple_choice', '{"A": "express-upload", "B": "multer", "C": "file-upload", "D": "upload"}', 'B', 'Multer is the most popular middleware for handling multipart/form-data and file uploads in Express.', 'npm install multer', 1, 'easy'),
('bccccccc-cccc-cccc-cccc-cccccccccccc', 'You should trust client-provided MIME types.', 'true_false', '{"true": "True", "false": "False"}', 'false', 'Never trust client-provided MIME types. Always validate file types server-side by checking both MIME type and file extension.', NULL, 2, 'medium'),
('bccccccc-cccc-cccc-cccc-cccccccccccc', 'What is a good practice for uploaded filenames?', 'multiple_choice', '{"A": "Use original filename", "B": "Generate unique filename", "C": "Use user ID as filename", "D": "Use current date"}', 'B', 'Generate unique filenames (e.g., timestamp + random string) to prevent overwrites and improve security.', 'Date.now() + "-" + Math.random()...', 3, 'medium'),
('bccccccc-cccc-cccc-cccc-cccccccccccc', 'File size limits prevent abuse.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'Setting file size limits prevents users from uploading extremely large files that could exhaust server resources.', 'limits: { fileSize: 5 * 1024 * 1024 }', 4, 'easy'),
('bccccccc-cccc-cccc-cccc-cccccccccccc', 'Which package processes images in Node.js?', 'multiple_choice', '{"A": "image-processor", "B": "sharp", "C": "img", "D": "picture"}', 'B', 'Sharp is a high-performance Node.js image processing library for resizing, cropping, and converting images.', 'npm install sharp', 5, 'medium'),
('bccccccc-cccc-cccc-cccc-cccccccccccc', 'Cloud storage is more scalable than local storage.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'Cloud storage services (S3, Supabase Storage) are more scalable, reliable, and provide CDN delivery compared to local file storage.', NULL, 6, 'easy');

-- Lesson 14: API Security & Deployment Best Practices
INSERT INTO ai_learning_lessons (
  id, learning_path_id, title, description, content_type, content, duration_minutes, order_index,
  learning_objectives, resources
) VALUES (
  'bddddddd-dddd-dddd-dddd-dddddddddddd',
  'f5e4d3c2-b1a0-9876-5432-10fedcba9876',
  'API Security & Deployment Best Practices',
  'Secure your APIs, implement rate limiting, CORS, helmet, and learn deployment strategies for production.',
  'quiz',
  '# API Security & Deployment Best Practices

## Security Headers with Helmet

```bash
npm install helmet
```

```javascript
const helmet = require(''helmet'');

// Apply security headers
app.use(helmet());

// Custom configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["''self''"],
      styleSrc: ["''self''", "''unsafe-inline''"],
      scriptSrc: ["''self''"],
      imgSrc: ["''self''", "data:", "https:"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

## CORS (Cross-Origin Resource Sharing)

```bash
npm install cors
```

```javascript
const cors = require(''cors'');

// Allow all origins (development only)
app.use(cors());

// Production configuration
const corsOptions = {
  origin: [
    ''https://yourapp.com'',
    ''https://admin.yourapp.com''
  ],
  methods: [''GET'', ''POST'', ''PUT'', ''DELETE''],
  allowedHeaders: [''Content-Type'', ''Authorization''],
  credentials: true,
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));
```

## Rate Limiting

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require(''express-rate-limit'');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window
  message: ''Too many requests, please try again later''
});

app.use(''/api/'', apiLimiter);

// Strict limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 login attempts
  skipSuccessfulRequests: true
});

app.post(''/api/login'', authLimiter, loginHandler);
```

## Input Sanitization

```bash
npm install express-validator
```

```javascript
const { body, validationResult } = require(''express-validator'');

app.post(''/api/users'',
  [
    body(''email'')
      .isEmail()
      .normalizeEmail()
      .trim()
      .escape(),
    body(''name'')
      .trim()
      .escape()
      .isLength({ min: 2, max: 50 }),
    body(''age'')
      .optional()
      .isInt({ min: 18, max: 120 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Process validated data
    res.json({ success: true });
  }
);
```

## Environment-Based Configuration

```javascript
const config = {
  development: {
    port: 3000,
    db: {
      host: ''localhost'',
      port: 5432
    },
    cors: { origin: ''*'' },
    logLevel: ''debug''
  },
  production: {
    port: process.env.PORT || 8080,
    db: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT
    },
    cors: {
      origin: process.env.ALLOWED_ORIGINS.split('','')
    },
    logLevel: ''error''
  }
};

const env = process.env.NODE_ENV || ''development'';
module.exports = config[env];
```

## Logging with Morgan and Winston

```bash
npm install morgan winston
```

```javascript
const morgan = require(''morgan'');
const winston = require(''winston'');

// Winston logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === ''production'' ? ''info'' : ''debug'',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: ''error.log'', level: ''error'' }),
    new winston.transports.File({ filename: ''combined.log'' })
  ]
});

if (process.env.NODE_ENV !== ''production'') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// HTTP request logging
app.use(morgan(''combined'', {
  stream: { write: message => logger.info(message.trim()) }
}));
```

## Deployment Checklist

✅ **Environment Variables**
- Store secrets in environment variables
- Never commit .env files
- Use different configs per environment

✅ **Security**
- Enable HTTPS
- Use helmet for security headers
- Configure CORS properly
- Implement rate limiting
- Validate and sanitize all inputs

✅ **Database**
- Use connection pooling
- Enable SSL connections
- Regular backups
- Use prepared statements

✅ **Monitoring**
- Set up error tracking (Sentry)
- Log important events
- Monitor performance
- Set up alerts

✅ **Performance**
- Enable compression
- Use CDN for static assets
- Cache frequently accessed data
- Optimize database queries

## Deployment Platforms

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway up
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
# Build image
docker build -t my-api .

# Run container
docker run -p 3000:3000 --env-file .env my-api
```

## Best Practices

✅ **Use HTTPS** - Always in production
✅ **Implement rate limiting** - Prevent abuse
✅ **Validate all inputs** - Never trust client data
✅ **Use security headers** - Helmet middleware
✅ **Monitor and log** - Track errors and performance
✅ **Regular updates** - Keep dependencies updated
✅ **Error handling** - Don''t expose stack traces
✅ **Database backups** - Regular automated backups

## Security Pitfalls

❌ **Exposed secrets** - Use environment variables
❌ **No rate limiting** - Vulnerable to DDoS
❌ **Missing input validation** - SQL injection, XSS
❌ **Weak CORS config** - Allow all origins
❌ **No HTTPS** - Data transmitted in plain text
❌ **Verbose error messages** - Expose implementation details
❌ **Outdated dependencies** - Known vulnerabilities

## Quiz Time!

Master API security and deployment!',
  60,
  14,
  ARRAY[
    'Implement API security best practices',
    'Configure CORS and rate limiting',
    'Set up production logging and monitoring',
    'Deploy APIs to production platforms'
  ],
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- Quiz Questions for Lesson 14
INSERT INTO backend_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, code_example, order_index, difficulty) VALUES
('bddddddd-dddd-dddd-dddd-dddddddddddd', 'Which package adds security headers to Express?', 'multiple_choice', '{"A": "security", "B": "helmet", "C": "headers", "D": "safe-express"}', 'B', 'Helmet helps secure Express apps by setting various HTTP headers to prevent common vulnerabilities.', 'app.use(helmet());', 1, 'easy'),
('bddddddd-dddd-dddd-dddd-dddddddddddd', 'What does CORS stand for?', 'multiple_choice', '{"A": "Cross-Origin Request Security", "B": "Cross-Origin Resource Sharing", "C": "Common Origin Resource Sharing", "D": "Cross-Origin Request Sharing"}', 'B', 'CORS (Cross-Origin Resource Sharing) controls which domains can access your API from browsers.', NULL, 2, 'medium'),
('bddddddd-dddd-dddd-dddd-dddddddddddd', 'Rate limiting prevents DDoS attacks.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'Rate limiting restricts the number of requests from a single source, helping prevent abuse and DDoS attacks.', NULL, 3, 'easy'),
('bddddddd-dddd-dddd-dddd-dddddddddddd', 'HTTPS should only be used in production.', 'true_false', '{"true": "True", "false": "False"}', 'false', 'While essential in production, using HTTPS in all environments (including development) helps catch SSL-related issues early.', NULL, 4, 'medium'),
('bddddddd-dddd-dddd-dddd-dddddddddddd', 'What is input sanitization?', 'multiple_choice', '{"A": "Cleaning user inputs to prevent attacks", "B": "Deleting user inputs", "C": "Encrypting inputs", "D": "Storing inputs"}', 'A', 'Input sanitization removes or escapes dangerous characters from user input to prevent XSS, SQL injection, and other attacks.', NULL, 5, 'medium'),
('bddddddd-dddd-dddd-dddd-dddddddddddd', 'Environment variables should be committed to git.', 'true_false', '{"true": "True", "false": "False"}', 'false', 'NEVER commit .env files or secrets to git. Use .gitignore and manage secrets securely per environment.', NULL, 6, 'easy'),
('bddddddd-dddd-dddd-dddd-dddddddddddd', 'Which is a recommended logging library?', 'multiple_choice', '{"A": "console.log", "B": "winston", "C": "logger", "D": "log4js"}', 'B', 'Winston is a popular, flexible logging library for Node.js with support for multiple transports and log levels.', 'npm install winston', 7, 'medium'),
('bddddddd-dddd-dddd-dddd-dddddddddddd', 'Docker containers improve deployment consistency.', 'true_false', '{"true": "True", "false": "False"}', 'true', 'Docker containers package your app with all dependencies, ensuring consistent behavior across different environments.', NULL, 8, 'easy');

