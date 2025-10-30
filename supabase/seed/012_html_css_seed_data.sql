-- =====================================================
-- HTML/CSS Fundamentals - Seed Data
-- =====================================================
-- This script seeds the database with HTML/CSS learning path,
-- lessons, and quiz questions

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
  'e7f9a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b', -- Fixed UUID for reference
  'HTML & CSS Fundamentals',
  'Master the building blocks of web development. Learn HTML structure and CSS styling through interactive lessons and hands-on quizzes. Perfect for beginners starting their web development journey.',
  'beginner',
  ARRAY['frontend', 'fullstack'],
  ARRAY['html', 'css', 'web-development'],
  8,
  ARRAY[
    'Understand HTML document structure and semantic elements',
    'Create well-structured web pages with proper HTML tags',
    'Apply CSS styles to control layout, colors, and typography',
    'Use CSS Box Model and Flexbox for responsive layouts',
    'Build professional-looking web pages from scratch'
  ],
  ARRAY[]::text[],
  true,
  1,
  '🎨'
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. CREATE LESSONS
-- =====================================================

-- Lesson 1: Introduction to HTML
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
  'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'e7f9a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b',
  'Introduction to HTML',
  'Learn what HTML is, its role in web development, and basic document structure.',
  'quiz',
  '# Introduction to HTML

## What is HTML?

HTML (HyperText Markup Language) is the **standard markup language** for creating web pages. Think of it as the skeleton of a website - it provides structure and content.

### Key Concepts

- **HyperText**: Text with links (hyperlinks) to other texts
- **Markup**: Tags that define elements and their structure
- **Language**: A system with rules for creating web documents

## HTML Document Structure

Every HTML document follows a basic structure:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My First Page</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>This is my first webpage!</p>
  </body>
</html>
```

### Breaking it Down

1. **`<!DOCTYPE html>`** - Tells the browser this is HTML5
2. **`<html>`** - The root element that contains all content
3. **`<head>`** - Contains metadata (title, styles, scripts)
4. **`<body>`** - Contains the visible page content

## Why Learn HTML?

- **Foundation of Web**: Every website uses HTML
- **Easy to Learn**: Simple syntax, immediate results
- **Career Essential**: Required for web development jobs
- **Creative Expression**: Build your ideas into reality

## Try It Yourself

```html
<!DOCTYPE html>
<html>
  <head>
    <title>About Me</title>
  </head>
  <body>
    <h1>Welcome to My Page</h1>
    <p>Hi! I''m learning HTML.</p>
  </body>
</html>
```

Copy this code to a file called `index.html`, open it in your browser, and see your first webpage!

## Key Takeaways

✓ HTML is the structure layer of web pages
✓ Every HTML document has a `<head>` and `<body>`
✓ Tags define elements like headings, paragraphs, links
✓ HTML is readable by both humans and browsers

Ready to test your knowledge? Take the quiz below!',
  25,
  1,
  ARRAY[
    'Understand what HTML is and its purpose',
    'Recognize basic HTML document structure',
    'Identify the role of DOCTYPE, html, head, and body tags'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/HTML", "https://www.w3schools.com/html/"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 2: HTML Tags and Elements
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
  'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
  'e7f9a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b',
  'HTML Tags and Elements',
  'Master essential HTML tags including headings, paragraphs, lists, and links.',
  'quiz',
  '# HTML Tags and Elements

## Understanding HTML Tags

HTML tags are **keywords** surrounded by angle brackets `< >`. Most tags come in pairs:

- **Opening tag**: `<p>`
- **Closing tag**: `</p>`
- **Content between**: `<p>This is a paragraph</p>`

## Common HTML Tags

### Headings

HTML has six levels of headings, `<h1>` through `<h6>`:

```html
<h1>Main Heading</h1>
<h2>Sub Heading</h2>
<h3>Section Heading</h3>
<h4>Subsection</h4>
<h5>Minor Heading</h5>
<h6>Smallest Heading</h6>
```

**Important**: Use `<h1>` once per page for the main title.

### Paragraphs

The `<p>` tag defines a paragraph:

```html
<p>This is a paragraph of text.</p>
<p>This is another paragraph.</p>
```

### Links

Create hyperlinks with the `<a>` tag:

```html
<a href="https://example.com">Visit Example</a>
```

- **href** attribute specifies the destination URL

### Lists

**Unordered Lists** (bullet points):

```html
<ul>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ul>
```

**Ordered Lists** (numbered):

```html
<ol>
  <li>First step</li>
  <li>Second step</li>
  <li>Third step</li>
</ol>
```

### Text Formatting

```html
<strong>Bold text</strong>
<em>Italic text</em>
<mark>Highlighted text</mark>
<code>Code snippet</code>
```

## Self-Closing Tags

Some tags don''t need closing tags:

```html
<br>  <!-- Line break -->
<hr>  <!-- Horizontal rule -->
<img src="photo.jpg" alt="Description">
```

## Nesting Elements

Elements can contain other elements:

```html
<div>
  <h2>Section Title</h2>
  <p>This paragraph is <strong>nested</strong> inside a div.</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div>
```

**Rule**: Tags must be properly nested - close in reverse order of opening.

## Practice Example

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Skills</title>
  </head>
  <body>
    <h1>My Developer Skills</h1>
    <p>I am learning <strong>HTML</strong> to become a web developer.</p>

    <h2>Technologies I Know:</h2>
    <ul>
      <li>HTML</li>
      <li>CSS (coming soon!)</li>
      <li>JavaScript (future goal)</li>
    </ul>

    <p>Check out <a href="https://qodebench.com">QodeBench</a> for more learning!</p>
  </body>
</html>
```

## Key Takeaways

✓ Most HTML tags have opening and closing parts
✓ Headings range from `<h1>` (largest) to `<h6>` (smallest)
✓ Lists can be ordered (`<ol>`) or unordered (`<ul>`)
✓ Links use the `<a>` tag with an `href` attribute
✓ Elements can be nested inside other elements

Time to test your knowledge!',
  30,
  2,
  ARRAY[
    'Use heading tags appropriately',
    'Create paragraphs, lists, and links',
    'Understand the difference between block and inline elements',
    'Properly nest HTML elements'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/HTML/Element", "https://htmlreference.io/"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 3: Introduction to CSS
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
  'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
  'e7f9a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b',
  'Introduction to CSS',
  'Discover CSS and learn how to add styles, colors, and formatting to your HTML.',
  'quiz',
  '# Introduction to CSS

## What is CSS?

CSS (Cascading Style Sheets) is the language used to **style and layout** web pages. While HTML provides structure, CSS makes it look good!

### Why CSS?

- **Separation of Concerns**: Keep structure (HTML) separate from presentation (CSS)
- **Consistency**: Apply the same styles across multiple pages
- **Flexibility**: Change the entire look without touching HTML
- **Responsive Design**: Adapt layouts for different screen sizes

## Three Ways to Add CSS

### 1. Inline CSS

Add styles directly to HTML elements:

```html
<p style="color: blue; font-size: 18px;">This is blue text.</p>
```

❌ **Not recommended** for large projects - hard to maintain.

### 2. Internal CSS

Use a `<style>` tag in the `<head>`:

```html
<head>
  <style>
    p {
      color: blue;
      font-size: 18px;
    }
  </style>
</head>
```

✓ Good for single-page sites.

### 3. External CSS (Best Practice)

Link to a separate CSS file:

```html
<head>
  <link rel="stylesheet" href="styles.css">
</head>
```

**styles.css:**
```css
p {
  color: blue;
  font-size: 18px;
}
```

✅ **Recommended** for most projects - reusable and organized.

## CSS Syntax

```css
selector {
  property: value;
  property: value;
}
```

### Example:

```css
h1 {
  color: #0ea5e9;
  font-size: 32px;
  text-align: center;
}
```

- **Selector**: `h1` (targets all h1 elements)
- **Properties**: `color`, `font-size`, `text-align`
- **Values**: `#0ea5e9`, `32px`, `center`

## Common CSS Properties

### Colors

```css
p {
  color: red;           /* Text color */
  background-color: yellow;  /* Background */
}
```

Color formats:
- **Name**: `red`, `blue`, `green`
- **Hex**: `#0ea5e9`, `#ff0000`
- **RGB**: `rgb(14, 165, 233)`

### Text Styling

```css
p {
  font-family: Arial, sans-serif;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  text-decoration: underline;
}
```

### Spacing

```css
p {
  margin: 20px;     /* Space outside element */
  padding: 10px;    /* Space inside element */
}
```

## Your First Styled Page

**HTML:**
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Styled Page</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <h1>Welcome to CSS!</h1>
    <p class="intro">CSS makes websites beautiful.</p>
    <p>This is a regular paragraph.</p>
  </body>
</html>
```

**style.css:**
```css
body {
  font-family: Arial, sans-serif;
  background-color: #f0f9ff;
  margin: 0;
  padding: 20px;
}

h1 {
  color: #0ea5e9;
  text-align: center;
}

.intro {
  color: #a855f7;
  font-size: 18px;
  font-weight: bold;
}
```

## Key Takeaways

✓ CSS controls the visual appearance of HTML
✓ External stylesheets are the best practice
✓ CSS syntax: `selector { property: value; }`
✓ Common properties: color, font-size, margin, padding
✓ Use classes to style specific elements

Ready for your quiz?',
  30,
  3,
  ARRAY[
    'Understand the purpose of CSS',
    'Know three ways to add CSS to HTML',
    'Write basic CSS rules with selectors and properties',
    'Apply colors, fonts, and spacing'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/CSS", "https://cssreference.io/"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 3. CREATE QUIZ QUESTIONS
-- =====================================================

-- Quiz for Lesson 1: Introduction to HTML
INSERT INTO html_css_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, order_index, difficulty) VALUES
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'What does HTML stand for?', 'multiple_choice',
 '{"A": "HyperText Markup Language", "B": "High Tech Modern Language", "C": "Home Tool Markup Language", "D": "Hyperlinks and Text Markup Language"}',
 'A',
 'HTML stands for HyperText Markup Language. It''s the standard language for creating web pages and web applications.',
 1, 'easy'),

('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Which tag is used to define the root of an HTML document?', 'multiple_choice',
 '{"A": "<body>", "B": "<html>", "C": "<head>", "D": "<root>"}',
 'B',
 'The <html> tag is the root element that contains all other HTML elements. It wraps the entire document content.',
 2, 'easy'),

('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Is <!DOCTYPE html> a required part of an HTML5 document?', 'true_false',
 '{"true": "True", "false": "False"}',
 'true',
 'True! The <!DOCTYPE html> declaration is required at the very beginning of an HTML5 document. It tells the browser this is an HTML5 document and helps ensure proper rendering.',
 3, 'easy'),

('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Where do you place the <title> tag in an HTML document?', 'multiple_choice',
 '{"A": "Inside the <body> tag", "B": "Inside the <head> tag", "C": "Before the <!DOCTYPE> declaration", "D": "Inside the <html> tag but outside <head> and <body>"}',
 'B',
 'The <title> tag must be placed inside the <head> section. It defines the title shown in the browser tab and search engine results.',
 4, 'medium'),

('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'What is the primary purpose of HTML?', 'multiple_choice',
 '{"A": "To style web pages", "B": "To provide structure and content for web pages", "C": "To add interactivity to web pages", "D": "To store data in databases"}',
 'B',
 'HTML''s primary purpose is to provide structure and content for web pages. CSS handles styling, and JavaScript handles interactivity.',
 5, 'easy');

-- Quiz for Lesson 2: HTML Tags and Elements
INSERT INTO html_css_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, order_index, difficulty) VALUES
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'Which heading tag represents the most important heading?', 'multiple_choice',
 '{"A": "<h6>", "B": "<h3>", "C": "<h1>", "D": "All headings are equally important"}',
 'C',
 '<h1> is the most important heading and should be used once per page for the main title. Headings go from <h1> (most important) to <h6> (least important).',
 1, 'easy'),

('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'What is the correct HTML tag for creating a hyperlink?', 'multiple_choice',
 '{"A": "<link>", "B": "<a>", "C": "<href>", "D": "<url>"}',
 'B',
 'The <a> (anchor) tag creates hyperlinks. The href attribute specifies the destination: <a href="url">Link Text</a>',
 2, 'easy'),

('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'HTML tags must always have both an opening and closing tag.', 'true_false',
 '{"true": "True", "false": "False"}',
 'false',
 'False! Some HTML tags are self-closing and don''t need a closing tag, such as <br> (line break), <img> (image), and <hr> (horizontal rule).',
 3, 'medium'),

('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'Which tag creates an unordered (bulleted) list?', 'multiple_choice',
 '{"A": "<ol>", "B": "<ul>", "C": "<li>", "D": "<list>"}',
 'B',
 '<ul> creates an unordered (bulleted) list, while <ol> creates an ordered (numbered) list. <li> is used for individual list items within both types.',
 4, 'easy'),

('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'What does the <strong> tag do?', 'multiple_choice',
 '{"A": "Creates a link", "B": "Makes text bold and indicates importance", "C": "Creates a line break", "D": "Adds a horizontal line"}',
 'B',
 'The <strong> tag makes text bold AND semantically indicates that the text is important. <b> also makes text bold but without the semantic meaning.',
 5, 'medium');

-- Quiz for Lesson 3: Introduction to CSS
INSERT INTO html_css_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, order_index, difficulty) VALUES
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'What does CSS stand for?', 'multiple_choice',
 '{"A": "Cascading Style Sheets", "B": "Creative Style System", "C": "Computer Style Sheets", "D": "Colorful Style Sheets"}',
 'A',
 'CSS stands for Cascading Style Sheets. The "cascading" refers to how styles can cascade from multiple sources and priority rules determine which styles are applied.',
 1, 'easy'),

('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'Which is the best practice for adding CSS to a website?', 'multiple_choice',
 '{"A": "Inline styles on every element", "B": "Internal <style> tag in HTML", "C": "External CSS file linked via <link> tag", "D": "JavaScript to add styles"}',
 'C',
 'External CSS files are best practice because they keep styles separate from HTML, are reusable across multiple pages, and are easier to maintain.',
 2, 'medium'),

('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'The <link> tag for external CSS should be placed in the <body> section.', 'true_false',
 '{"true": "True", "false": "False"}',
 'false',
 'False! The <link> tag for external CSS should be placed in the <head> section, not the <body>. This ensures styles load before the page content renders.',
 3, 'easy'),

('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'In CSS, what separates a property from its value?', 'multiple_choice',
 '{"A": "An equal sign (=)", "B": "A colon (:)", "C": "A semicolon (;)", "D": "A comma (,)"}',
 'B',
 'A colon (:) separates the property from its value in CSS. For example: color: blue; The semicolon (;) is used to end each declaration.',
 4, 'medium'),

('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'Which CSS property controls the text color of an element?', 'multiple_choice',
 '{"A": "text-color", "B": "font-color", "C": "color", "D": "text-style"}',
 'C',
 'The color property controls the text color of an element. Example: color: blue; or color: #0ea5e9;',
 5, 'easy');

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Verify the data was inserted
DO $$
DECLARE
  path_count INTEGER;
  lesson_count INTEGER;
  question_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO path_count FROM ai_learning_paths WHERE id = 'e7f9a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b';
  SELECT COUNT(*) INTO lesson_count FROM ai_learning_lessons WHERE learning_path_id = 'e7f9a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b';
  SELECT COUNT(*) INTO question_count FROM html_css_quiz_questions;

  RAISE NOTICE 'HTML/CSS Seed Data Summary:';
  RAISE NOTICE '  - Learning Paths: %', path_count;
  RAISE NOTICE '  - Lessons: %', lesson_count;
  RAISE NOTICE '  - Quiz Questions: %', question_count;

  IF path_count = 1 AND lesson_count = 3 AND question_count = 15 THEN
    RAISE NOTICE 'SUCCESS: All data seeded correctly!';
  ELSE
    RAISE WARNING 'Some data may not have been seeded correctly.';
  END IF;
END $$;
