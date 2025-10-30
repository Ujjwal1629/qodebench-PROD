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
  20,
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

-- Lesson 4: HTML Forms and Input Types
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
  'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
  'e7f9a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b',
  'HTML Forms and Input Types',
  'Master HTML forms, input elements, and user data collection.',
  'quiz',
  '# HTML Forms and Input Types

## Understanding HTML Forms

Forms are how users **interact with your website** - submitting data, logging in, searching, and more. They''re essential for any interactive web application.

```html
<form action="/submit" method="POST">
  <!-- Form fields go here -->
</form>
```

### Key Attributes

- **action**: Where to send the form data
- **method**: How to send it (`GET` or `POST`)
  - `GET`: Data visible in URL (for searches, filters)
  - `POST`: Data hidden (for passwords, sensitive info)

## Input Types

HTML5 provides many input types for different data:

### Text Input

```html
<label for="username">Username:</label>
<input type="text" id="username" name="username" required>
```

- **type="text"**: Single-line text
- **id**: Links to the label
- **name**: Identifies the field when submitting
- **required**: Makes field mandatory

### Email Input

```html
<label for="email">Email:</label>
<input type="email" id="email" name="email" required>
```

Automatically validates email format! Browser shows error if invalid.

### Password Input

```html
<label for="password">Password:</label>
<input type="password" id="password" name="password" minlength="8">
```

- Hides characters with dots/asterisks
- **minlength**: Minimum character requirement

### Number Input

```html
<label for="age">Age:</label>
<input type="number" id="age" name="age" min="18" max="120">
```

- Only accepts numbers
- **min/max**: Set valid ranges
- Browser shows up/down arrows

### Date and Time

```html
<input type="date" name="birthday">
<input type="time" name="appointment">
<input type="datetime-local" name="event">
```

Shows native date/time pickers!

### Other Useful Types

```html
<input type="tel" name="phone">        <!-- Phone number -->
<input type="url" name="website">      <!-- Website URL -->
<input type="color" name="theme">      <!-- Color picker -->
<input type="range" min="0" max="100"> <!-- Slider -->
```

## Textareas for Multi-line Text

```html
<label for="message">Message:</label>
<textarea id="message" name="message" rows="5" cols="40"></textarea>
```

Use for comments, descriptions, long-form text.

## Radio Buttons

Choose **one option** from multiple choices:

```html
<p>Select your experience level:</p>
<label>
  <input type="radio" name="level" value="beginner" checked>
  Beginner
</label>
<label>
  <input type="radio" name="level" value="intermediate">
  Intermediate
</label>
<label>
  <input type="radio" name="level" value="advanced">
  Advanced
</label>
```

**Important**: Same `name` groups them together!

## Checkboxes

Select **multiple options**:

```html
<p>Select your interests:</p>
<label>
  <input type="checkbox" name="interests" value="html">
  HTML
</label>
<label>
  <input type="checkbox" name="interests" value="css">
  CSS
</label>
<label>
  <input type="checkbox" name="interests" value="javascript">
  JavaScript
</label>
```

## Dropdown Menus (Select)

```html
<label for="country">Country:</label>
<select id="country" name="country">
  <option value="">-- Select --</option>
  <option value="us">United States</option>
  <option value="uk">United Kingdom</option>
  <option value="ca">Canada</option>
  <option value="au">Australia</option>
</select>
```

## Submit and Reset Buttons

```html
<button type="submit">Submit Form</button>
<button type="reset">Clear Form</button>
<input type="submit" value="Send">
```

## Complete Form Example

```html
<form action="/register" method="POST">
  <h2>User Registration</h2>

  <label for="name">Full Name:</label>
  <input type="text" id="name" name="name" required>

  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>

  <label for="password">Password:</label>
  <input type="password" id="password" name="password"
         minlength="8" required>

  <label for="dob">Date of Birth:</label>
  <input type="date" id="dob" name="dob">

  <p>Gender:</p>
  <label>
    <input type="radio" name="gender" value="male"> Male
  </label>
  <label>
    <input type="radio" name="gender" value="female"> Female
  </label>
  <label>
    <input type="radio" name="gender" value="other"> Other
  </label>

  <label>
    <input type="checkbox" name="terms" required>
    I agree to the terms and conditions
  </label>

  <button type="submit">Register</button>
</form>
```

## Validation Attributes

HTML5 provides built-in validation:

```html
<input type="text" required>              <!-- Required field -->
<input type="email" required>             <!-- Valid email -->
<input type="text" minlength="3">         <!-- Minimum length -->
<input type="text" maxlength="50">        <!-- Maximum length -->
<input type="number" min="1" max="100">   <!-- Number range -->
<input type="text" pattern="[A-Za-z]{3}"> <!-- Regex pattern -->
```

## Form Best Practices

✓ **Always use labels** - Improves accessibility and UX
✓ **Use appropriate input types** - Better mobile experience
✓ **Add validation** - Catch errors early
✓ **Group related fields** - Use `<fieldset>` and `<legend>`
✓ **Provide clear feedback** - Show what''s expected
✓ **Make required fields obvious** - Use asterisks or "required" text

## Accessibility Tips

```html
<label for="email">Email Address:</label>
<input type="email" id="email" name="email"
       aria-describedby="email-help" required>
<small id="email-help">We''ll never share your email.</small>
```

Screen readers will read the label and help text!

## Key Takeaways

✓ Forms collect user input with the `<form>` tag
✓ HTML5 provides specialized input types for different data
✓ Labels improve usability and accessibility
✓ Radio buttons allow single selection, checkboxes allow multiple
✓ Built-in validation saves time and improves UX
✓ Use `POST` method for sensitive data

Ready to test your form knowledge?',
  35,
  4,
  ARRAY[
    'Create functional HTML forms with various input types',
    'Understand the difference between GET and POST methods',
    'Implement form validation using HTML5 attributes',
    'Use labels correctly for accessibility'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form", "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 5: Tables and Data Presentation
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
  'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b',
  'e7f9a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b',
  'Tables and Data Presentation',
  'Learn to create structured data tables with HTML.',
  'quiz',
  '# Tables and Data Presentation

## Why Use HTML Tables?

Tables display **structured data** in rows and columns - perfect for:

- Product comparisons
- Pricing plans
- Statistics and analytics
- Schedules and timetables
- Sports scores and rankings

**Important**: Only use tables for tabular data, NOT for page layout!

## Basic Table Structure

```html
<table>
  <tr>
    <th>Name</th>
    <th>Age</th>
    <th>City</th>
  </tr>
  <tr>
    <td>Alice</td>
    <td>28</td>
    <td>New York</td>
  </tr>
  <tr>
    <td>Bob</td>
    <td>34</td>
    <td>London</td>
  </tr>
</table>
```

### Elements Breakdown

- **`<table>`**: Container for the entire table
- **`<tr>`**: Table Row
- **`<th>`**: Table Header (bold and centered by default)
- **`<td>`**: Table Data (regular cell)

## Table Sections

Organize tables into logical sections:

```html
<table>
  <thead>
    <tr>
      <th>Product</th>
      <th>Price</th>
      <th>Stock</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Laptop</td>
      <td>$999</td>
      <td>15</td>
    </tr>
    <tr>
      <td>Mouse</td>
      <td>$25</td>
      <td>150</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="2">Total Items:</td>
      <td>165</td>
    </tr>
  </tfoot>
</table>
```

- **`<thead>`**: Table header section
- **`<tbody>`**: Main content section
- **`<tfoot>`**: Footer section (totals, summaries)

Benefits: Better semantics, easier to style, sticky headers in CSS!

## Spanning Columns and Rows

### Colspan - Merge Cells Horizontally

```html
<table>
  <tr>
    <th colspan="3">Q1 Sales Report</th>
  </tr>
  <tr>
    <th>Product</th>
    <th>January</th>
    <th>February</th>
  </tr>
  <tr>
    <td>Laptop</td>
    <td>$50,000</td>
    <td>$60,000</td>
  </tr>
</table>
```

`colspan="3"` makes the cell span 3 columns wide.

### Rowspan - Merge Cells Vertically

```html
<table>
  <tr>
    <th rowspan="2">Product</th>
    <th colspan="2">Sales</th>
  </tr>
  <tr>
    <th>Q1</th>
    <th>Q2</th>
  </tr>
  <tr>
    <td>Laptop</td>
    <td>$50,000</td>
    <td>$75,000</td>
  </tr>
</table>
```

`rowspan="2"` makes the cell span 2 rows tall.

## Adding Captions

```html
<table>
  <caption>Employee Directory - Engineering Team</caption>
  <thead>
    <tr>
      <th>Name</th>
      <th>Role</th>
      <th>Years</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Sarah Chen</td>
      <td>Senior Engineer</td>
      <td>5</td>
    </tr>
  </tbody>
</table>
```

The `<caption>` provides a title for the table and improves accessibility.

## Complete Example: Pricing Table

```html
<table>
  <caption>QodeBench Subscription Plans</caption>
  <thead>
    <tr>
      <th>Feature</th>
      <th>Free</th>
      <th>Pro</th>
      <th>Enterprise</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Challenges</td>
      <td>100</td>
      <td>Unlimited</td>
      <td>Unlimited</td>
    </tr>
    <tr>
      <td>AI Hints</td>
      <td>5/day</td>
      <td>Unlimited</td>
      <td>Unlimited</td>
    </tr>
    <tr>
      <td>Mock Interviews</td>
      <td>1/month</td>
      <td>10/month</td>
      <td>Unlimited</td>
    </tr>
    <tr>
      <td>Priority Support</td>
      <td>❌</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th>Price</th>
      <td>$0/month</td>
      <td>$29/month</td>
      <td>$99/month</td>
    </tr>
  </tfoot>
</table>
```

## Styling Tables with CSS

While HTML creates structure, CSS makes tables beautiful:

```html
<style>
  table {
    width: 100%;
    border-collapse: collapse; /* Remove gaps between cells */
  }

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #0ea5e9;
    color: white;
  }

  tr:hover {
    background-color: #f0f9ff; /* Highlight on hover */
  }
</style>
```

## Accessibility Best Practices

### Use Scope Attribute

```html
<table>
  <tr>
    <th scope="col">Name</th>
    <th scope="col">Email</th>
  </tr>
  <tr>
    <th scope="row">John Doe</th>
    <td>john@example.com</td>
  </tr>
</table>
```

Helps screen readers understand relationships between cells.

### Add Summary for Complex Tables

```html
<table aria-describedby="sales-summary">
  <caption id="sales-summary">
    Quarterly sales data showing revenue across regions
  </caption>
  <!-- table content -->
</table>
```

## Common Mistakes to Avoid

❌ Using tables for page layout
❌ Forgetting `<thead>`, `<tbody>`, `<tfoot>` sections
❌ Missing captions for accessibility
❌ Not specifying scope on headers
❌ Inconsistent column counts across rows

## Responsive Tables

For mobile devices, consider:

```html
<div style="overflow-x: auto;">
  <table>
    <!-- table content -->
  </table>
</div>
```

Or use CSS to make tables stack vertically on small screens.

## Key Takeaways

✓ Use `<table>` for structured data, not layouts
✓ Structure tables with `<thead>`, `<tbody>`, `<tfoot>`
✓ `<th>` for headers, `<td>` for data cells
✓ `colspan` and `rowspan` merge cells
✓ Always add `<caption>` for accessibility
✓ Use CSS for styling, not HTML attributes

Time to test your table knowledge!',
  30,
  5,
  ARRAY[
    'Create well-structured HTML tables',
    'Use colspan and rowspan to merge cells',
    'Organize tables with thead, tbody, and tfoot',
    'Make tables accessible with captions and scope'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table", "https://www.w3schools.com/html/html_tables.asp"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 6: Semantic HTML5 Elements
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
  'f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c',
  'e7f9a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b',
  'Semantic HTML5 Elements',
  'Discover semantic HTML5 elements that add meaning to your code.',
  'quiz',
  '# Semantic HTML5 Elements

## What is Semantic HTML?

**Semantic HTML** uses elements that clearly **describe their meaning** to both browsers and developers.

### Non-Semantic vs Semantic

```html
<!-- ❌ Non-semantic - no meaning -->
<div class="header">
  <div class="nav">...</div>
</div>
<div class="article">...</div>

<!-- ✅ Semantic - clear meaning -->
<header>
  <nav>...</nav>
</header>
<article>...</article>
```

## Why Use Semantic HTML?

### Benefits

- **Accessibility**: Screen readers understand page structure
- **SEO**: Search engines better understand your content
- **Readability**: Code is self-documenting
- **Maintainability**: Easier for teams to work with
- **Future-proof**: Standards-compliant code

## Page Structure Elements

### `<header>`

Contains introductory content or navigation:

```html
<header>
  <h1>QodeBench</h1>
  <nav>
    <a href="/">Home</a>
    <a href="/challenges">Challenges</a>
    <a href="/learn">Learn</a>
  </nav>
</header>
```

Can be used for:
- Site header (logo, navigation)
- Article header (title, author, date)
- Section header

### `<nav>`

Defines navigation links:

```html
<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>
```

Use for:
- Main navigation
- Table of contents
- Breadcrumbs

### `<main>`

Primary content of the page (only **one per page**):

```html
<main>
  <h1>Welcome to Our Site</h1>
  <p>Main content goes here...</p>
</main>
```

**Important**: Excludes repeated content like headers, footers, and sidebars.

### `<article>`

Self-contained, independent content that could stand alone:

```html
<article>
  <h2>Learning JavaScript in 2024</h2>
  <p>Published on: <time datetime="2024-01-15">January 15, 2024</time></p>
  <p>JavaScript continues to evolve...</p>
</article>
```

Perfect for:
- Blog posts
- News articles
- Forum posts
- Product cards
- Comments

### `<section>`

Thematic grouping of content, usually with a heading:

```html
<section>
  <h2>Our Services</h2>
  <p>We offer various web development services...</p>
</section>

<section>
  <h2>About Us</h2>
  <p>Founded in 2024...</p>
</section>
```

Groups related content together.

### `<aside>`

Content tangentially related to main content:

```html
<aside>
  <h3>Related Articles</h3>
  <ul>
    <li><a href="/css-tips">CSS Tips</a></li>
    <li><a href="/html-tricks">HTML Tricks</a></li>
  </ul>
</aside>
```

Use for:
- Sidebars
- Pull quotes
- Related links
- Advertisements

### `<footer>`

Footer for a document or section:

```html
<footer>
  <p>&copy; 2024 QodeBench. All rights reserved.</p>
  <nav>
    <a href="/privacy">Privacy</a>
    <a href="/terms">Terms</a>
  </nav>
</footer>
```

Can contain:
- Copyright info
- Contact information
- Social media links
- Related links

## Complete Page Structure Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Blog</title>
</head>
<body>
  <header>
    <h1>My Tech Blog</h1>
    <nav>
      <a href="/">Home</a>
      <a href="/blog">Blog</a>
      <a href="/about">About</a>
    </nav>
  </header>

  <main>
    <article>
      <header>
        <h2>Understanding Flexbox</h2>
        <p>
          By <span>Sarah Chen</span> on
          <time datetime="2024-01-20">January 20, 2024</time>
        </p>
      </header>

      <section>
        <h3>Introduction</h3>
        <p>Flexbox is a powerful layout tool...</p>
      </section>

      <section>
        <h3>How It Works</h3>
        <p>Flexbox uses a parent-child relationship...</p>
      </section>

      <footer>
        <p>Tags: CSS, Flexbox, Layout</p>
      </footer>
    </article>

    <aside>
      <h3>Popular Posts</h3>
      <ul>
        <li><a href="/css-grid">CSS Grid Guide</a></li>
        <li><a href="/js-basics">JavaScript Basics</a></li>
      </ul>
    </aside>
  </main>

  <footer>
    <p>&copy; 2024 My Tech Blog</p>
  </footer>
</body>
</html>
```

## Additional Semantic Elements

### `<figure>` and `<figcaption>`

Self-contained content with optional caption:

```html
<figure>
  <img src="chart.png" alt="Sales chart">
  <figcaption>Q1 2024 Sales Performance</figcaption>
</figure>
```

### `<mark>`

Highlighted text for reference:

```html
<p>Remember to <mark>save your work</mark> frequently.</p>
```

### `<time>`

Machine-readable dates and times:

```html
<p>Published: <time datetime="2024-01-15T10:00">January 15, 2024</time></p>
```

### `<details>` and `<summary>`

Collapsible content:

```html
<details>
  <summary>Click to expand</summary>
  <p>Hidden content revealed when clicked!</p>
</details>
```

## Semantic vs Generic

| Purpose | Generic | Semantic |
|---------|---------|----------|
| Page header | `<div class="header">` | `<header>` |
| Navigation | `<div class="nav">` | `<nav>` |
| Main content | `<div class="main">` | `<main>` |
| Article | `<div class="article">` | `<article>` |
| Sidebar | `<div class="sidebar">` | `<aside>` |
| Footer | `<div class="footer">` | `<footer>` |

## When to Use `<div>` and `<span>`

Still use generic elements when:
- No semantic element fits
- Pure styling purposes
- Grouping for layout only

```html
<div class="container">
  <div class="grid">
    <!-- Grid layout wrapper -->
  </div>
</div>
```

## Best Practices

✓ **Use semantic elements first** - Fallback to `<div>`/`<span>` only when needed
✓ **One `<main>` per page** - Contains primary content
✓ **Multiple `<article>` allowed** - Each self-contained piece
✓ **Nest semantically** - `<article>` can contain `<section>`, etc.
✓ **Don''t overuse** - Not every div needs to be semantic
✓ **Consider accessibility** - Use ARIA when semantic HTML isn''t enough

## Common Mistakes

❌ Using `<section>` without a heading
❌ Multiple `<main>` elements on one page
❌ Using semantic elements just for styling
❌ Nesting `<header>` or `<footer>` in `<header>`/`<footer>`
❌ Using `<article>` for non-independent content

## Key Takeaways

✓ Semantic HTML adds meaning to your markup
✓ Improves accessibility, SEO, and code quality
✓ `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`
✓ Use one `<main>` per page for primary content
✓ `<article>` for independent, self-contained content
✓ Still use `<div>` and `<span>` when no semantic element fits

Ready to test your semantic HTML knowledge?',
  35,
  6,
  ARRAY[
    'Understand the importance of semantic HTML',
    'Use semantic elements appropriately',
    'Structure pages with header, nav, main, article, section, aside, footer',
    'Improve accessibility and SEO with semantic markup'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Glossary/Semantics", "https://www.w3schools.com/html/html5_semantic_elements.asp"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 7: Images and Media Elements
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
  'a7b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d',
  'e7f9a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b',
  'Images and Media Elements',
  'Learn to add images, audio, video, and multimedia to your web pages.',
  'quiz',
  '# Images and Media Elements

## Working with Images

Images make websites visually appealing and help communicate ideas. HTML provides the `<img>` tag for displaying images.

### Basic Image Syntax

```html
<img src="photo.jpg" alt="A beautiful sunset">
```

**Required Attributes**:
- **src**: Path to the image file (URL or local path)
- **alt**: Alternative text describing the image (crucial for accessibility!)

### Image Paths

**Absolute URL**:
```html
<img src="https://example.com/images/logo.png" alt="Company logo">
```

**Relative Path** (same folder):
```html
<img src="logo.png" alt="Company logo">
```

**Relative Path** (subfolder):
```html
<img src="images/logo.png" alt="Company logo">
```

**Parent Folder**:
```html
<img src="../images/logo.png" alt="Company logo">
```

## Image Attributes

### Width and Height

```html
<img src="photo.jpg" alt="Photo" width="400" height="300">
```

**Best Practice**: Set dimensions to prevent layout shift while loading, or use CSS instead:

```html
<img src="photo.jpg" alt="Photo" style="width: 100%; max-width: 400px;">
```

### Title Attribute

Shows a tooltip on hover:

```html
<img src="icon.png" alt="Settings icon" title="Click to open settings">
```

## Responsive Images

Make images adapt to different screen sizes:

### Using CSS

```html
<img src="photo.jpg" alt="Photo"
     style="width: 100%; height: auto; max-width: 600px;">
```

### Using srcset (Advanced)

Serve different images based on screen resolution:

```html
<img src="photo-800w.jpg"
     srcset="photo-400w.jpg 400w,
             photo-800w.jpg 800w,
             photo-1200w.jpg 1200w"
     sizes="(max-width: 600px) 400px,
            (max-width: 900px) 800px,
            1200px"
     alt="Responsive image">
```

Browser automatically picks the best image for the user''s screen!

## Figure and Figcaption

Group images with captions semantically:

```html
<figure>
  <img src="architecture.jpg" alt="Modern building">
  <figcaption>
    The Guggenheim Museum in Bilbao, Spain
  </figcaption>
</figure>
```

Benefits:
- Semantic HTML
- Easier to style as a unit
- Better for accessibility

## Image Formats

Choose the right format for your needs:

| Format | Best For | Transparency | Animation |
|--------|----------|--------------|-----------|
| **JPEG (.jpg)** | Photos, complex images | No | No |
| **PNG (.png)** | Graphics, logos, transparency | Yes | No |
| **GIF (.gif)** | Simple animations | Yes | Yes |
| **SVG (.svg)** | Icons, logos (vector) | Yes | Yes (via CSS) |
| **WebP (.webp)** | Modern format, smaller files | Yes | Yes |

## Audio Elements

Embed audio files directly in HTML:

```html
<audio controls>
  <source src="podcast.mp3" type="audio/mpeg">
  <source src="podcast.ogg" type="audio/ogg">
  Your browser does not support the audio element.
</audio>
```

**Attributes**:
- **controls**: Shows play, pause, volume controls
- **autoplay**: Starts playing automatically (often blocked by browsers)
- **loop**: Repeats the audio
- **muted**: Starts muted

### Background Audio (No Controls)

```html
<audio autoplay loop>
  <source src="background-music.mp3" type="audio/mpeg">
</audio>
```

**Note**: Many browsers block autoplay with sound. Use cautiously!

## Video Elements

Embed videos natively:

```html
<video width="640" height="360" controls>
  <source src="tutorial.mp4" type="video/mp4">
  <source src="tutorial.webm" type="video/webm">
  Your browser does not support the video tag.
</video>
```

**Common Attributes**:
- **controls**: Show playback controls
- **autoplay**: Auto-play on load (often blocked)
- **loop**: Repeat video
- **muted**: Start muted
- **poster**: Image shown before video plays

### Video with Poster

```html
<video width="640" height="360" controls
       poster="thumbnail.jpg">
  <source src="demo.mp4" type="video/mp4">
</video>
```

The poster image displays until the user clicks play.

## Embedding External Videos

### YouTube

```html
<iframe width="560" height="315"
        src="https://www.youtube.com/embed/VIDEO_ID"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
</iframe>
```

Replace `VIDEO_ID` with the actual video ID from the URL.

### Vimeo

```html
<iframe src="https://player.vimeo.com/video/VIDEO_ID"
        width="640" height="360"
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen>
</iframe>
```

## IFrames for Embedding Content

Embed external web pages:

```html
<iframe src="https://example.com"
        width="600" height="400"
        title="External content">
</iframe>
```

**Use Cases**:
- Embedding maps (Google Maps)
- Embedding videos (YouTube, Vimeo)
- Embedding social media posts
- Embedding interactive widgets

**Security Note**: Only embed trusted sources!

## Complete Media Example

```html
<article>
  <h2>Web Development Tutorial</h2>

  <figure>
    <img src="html-tutorial.jpg" alt="HTML code on screen"
         width="800" height="450">
    <figcaption>Example HTML code structure</figcaption>
  </figure>

  <p>Watch our comprehensive video tutorial below:</p>

  <video width="100%" controls poster="video-poster.jpg">
    <source src="tutorial.mp4" type="video/mp4">
    <source src="tutorial.webm" type="video/webm">
    Your browser does not support the video tag.
  </video>

  <h3>Podcast Episode</h3>
  <p>Listen to our discussion about modern web development:</p>

  <audio controls>
    <source src="episode-15.mp3" type="audio/mpeg">
    <source src="episode-15.ogg" type="audio/ogg">
    Your browser does not support the audio element.
  </audio>
</article>
```

## Image Optimization Tips

✓ **Compress images** - Use tools like TinyPNG, ImageOptim
✓ **Choose correct format** - JPEG for photos, PNG for graphics
✓ **Use appropriate dimensions** - Don''t use 5000px image for 500px display
✓ **Lazy loading** - Use `loading="lazy"` for images below the fold
✓ **WebP format** - Smaller file sizes, modern browsers support

```html
<img src="photo.jpg" alt="Photo" loading="lazy">
```

## Accessibility Best Practices

### Always Provide Alt Text

```html
<!-- ✅ Good -->
<img src="chart.png" alt="Bar chart showing Q1 sales increased by 25%">

<!-- ❌ Bad -->
<img src="chart.png" alt="chart">
<img src="chart.png">  <!-- Missing alt -->
```

**Decorative Images**:
```html
<img src="decorative-border.png" alt="" role="presentation">
```

Empty alt tells screen readers to skip decorative images.

### Captions for Media

```html
<video controls>
  <source src="video.mp4" type="video/mp4">
  <track kind="captions" src="captions.vtt" srclang="en" label="English">
</video>
```

Provides subtitles/captions for accessibility and SEO.

## Common Mistakes to Avoid

❌ Missing alt attributes on images
❌ Using images for text (bad for accessibility/SEO)
❌ Not optimizing image file sizes
❌ Forgetting to test on mobile devices
❌ Using autoplay for videos/audio without mute
❌ Not providing multiple source formats

## Key Takeaways

✓ Use `<img>` with src and alt attributes for images
✓ `<figure>` and `<figcaption>` semantically group images with captions
✓ `<audio>` and `<video>` elements for native media playback
✓ Provide multiple source formats for compatibility
✓ Always include alt text for accessibility
✓ Optimize images for web (compress, right format, right size)
✓ Use responsive images with CSS or srcset

Time to test your media knowledge!',
  35,
  7,
  ARRAY[
    'Add images with proper src and alt attributes',
    'Use figure and figcaption for semantic image captions',
    'Embed audio and video with HTML5 elements',
    'Understand image optimization and accessibility'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img", "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 8: HTML Attributes and Metadata
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
  'b8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e',
  'e7f9a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b',
  'HTML Attributes and Metadata',
  'Master HTML attributes, data attributes, and meta tags for SEO and functionality.',
  'quiz',
  '# HTML Attributes and Metadata

## Understanding HTML Attributes

**Attributes** provide additional information about HTML elements. They''re written in the opening tag:

```html
<element attribute="value">content</element>
```

All HTML elements can have attributes that modify their behavior or appearance.

## Global Attributes

These attributes work on **any HTML element**:

### id Attribute

Unique identifier for an element:

```html
<div id="main-container">Content</div>
<p id="intro">Introduction paragraph</p>
```

**Rules**:
- Must be unique on the page
- Used for CSS targeting, JavaScript selection, anchor links
- Case-sensitive

```html
<a href="#contact">Jump to Contact</a>

<section id="contact">
  <h2>Contact Us</h2>
</section>
```

### class Attribute

Groups elements for styling or scripting:

```html
<p class="highlight">Important text</p>
<p class="highlight">Also important</p>
<div class="card featured">Multiple classes</div>
```

**Key Points**:
- Can be reused on multiple elements
- Elements can have multiple classes (space-separated)
- Used heavily with CSS

### style Attribute

Inline CSS styling:

```html
<p style="color: red; font-size: 18px;">Styled text</p>
```

**Note**: Generally avoid inline styles - use external CSS instead!

### title Attribute

Tooltip text shown on hover:

```html
<abbr title="HyperText Markup Language">HTML</abbr>
<button title="Click to save your changes">Save</button>
```

### lang Attribute

Specifies the language:

```html
<html lang="en">
  <p>This is English</p>
  <p lang="es">Esto es español</p>
  <p lang="fr">C''est français</p>
</html>
```

Helps with:
- Screen readers (proper pronunciation)
- Search engines (correct language indexing)
- Browser translation features

### hidden Attribute

Hides an element:

```html
<div hidden>
  This content is hidden from view
</div>
```

Equivalent to `display: none` in CSS.

### tabindex Attribute

Controls keyboard navigation order:

```html
<div tabindex="0">Focusable with Tab key</div>
<button tabindex="1">First in tab order</button>
<button tabindex="2">Second in tab order</button>
<a href="#" tabindex="-1">Not in tab order</a>
```

## Data Attributes

Custom attributes for storing extra information:

```html
<article data-author="Sarah Chen"
         data-date="2024-01-15"
         data-category="web-development">
  Article content...
</article>
```

**Naming Rules**:
- Start with `data-`
- Lowercase only after `data-`
- Can be accessed with JavaScript

**JavaScript Example**:
```html
<button data-user-id="12345" data-action="delete">
  Delete User
</button>

<script>
  const btn = document.querySelector(''button'');
  console.log(btn.dataset.userId);  // "12345"
  console.log(btn.dataset.action);   // "delete"
</script>
```

**CSS Example**:
```css
[data-category="featured"] {
  background-color: #0ea5e9;
}
```

## Meta Tags

`<meta>` tags provide metadata about the HTML document. They go in the `<head>` section.

### Character Encoding

```html
<meta charset="UTF-8">
```

Ensures proper rendering of special characters. Always include this!

### Viewport (Responsive Design)

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Essential for mobile responsiveness**:
- `width=device-width`: Match screen width
- `initial-scale=1.0`: No zoom on load

### Page Description (SEO)

```html
<meta name="description"
      content="Learn HTML and CSS through interactive lessons and quizzes. Master web development fundamentals with QodeBench.">
```

Shows in search engine results - keep under 160 characters!

### Keywords (Less Important Now)

```html
<meta name="keywords" content="HTML, CSS, web development, tutorial">
```

Modern search engines don''t rely heavily on this anymore.

### Author Information

```html
<meta name="author" content="QodeBench Team">
```

### Robots Meta Tag

Control search engine crawling:

```html
<meta name="robots" content="index, follow">
<meta name="robots" content="noindex, nofollow">
```

- **index/noindex**: Allow/prevent indexing
- **follow/nofollow**: Follow/ignore links

## Open Graph Tags (Social Media)

Control how your page appears when shared on social media:

```html
<meta property="og:title" content="Learn HTML & CSS - QodeBench">
<meta property="og:description" content="Interactive HTML and CSS tutorials">
<meta property="og:image" content="https://qodebench.com/og-image.jpg">
<meta property="og:url" content="https://qodebench.com/learn/html-css">
<meta property="og:type" content="website">
```

Used by Facebook, LinkedIn, Discord, and others.

## Twitter Card Tags

Optimize for Twitter sharing:

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@qodebench">
<meta name="twitter:title" content="Learn HTML & CSS">
<meta name="twitter:description" content="Interactive tutorials">
<meta name="twitter:image" content="https://qodebench.com/twitter-card.jpg">
```

## Favicon

Icon shown in browser tabs:

```html
<link rel="icon" type="image/png" href="/favicon.png">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

## Complete Head Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Essential meta tags -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- SEO -->
  <title>Learn HTML & CSS | QodeBench - Interactive Tutorials</title>
  <meta name="description"
        content="Master HTML and CSS through interactive lessons, quizzes, and real projects. Perfect for beginners.">
  <meta name="author" content="QodeBench">

  <!-- Open Graph / Social Media -->
  <meta property="og:title" content="Learn HTML & CSS - QodeBench">
  <meta property="og:description" content="Interactive web development tutorials">
  <meta property="og:image" content="https://qodebench.com/images/og-image.jpg">
  <meta property="og:url" content="https://qodebench.com/learn/html-css">
  <meta property="og:type" content="website">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Learn HTML & CSS">
  <meta name="twitter:description" content="Interactive tutorials for beginners">
  <meta name="twitter:image" content="https://qodebench.com/images/twitter-card.jpg">

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="/favicon.png">

  <!-- Stylesheet -->
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!-- Page content -->
</body>
</html>
```

## ARIA Attributes (Accessibility)

Improve accessibility for screen readers:

```html
<button aria-label="Close dialog">×</button>

<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

<div role="alert" aria-live="polite">
  Form submitted successfully!
</div>
```

Common ARIA attributes:
- **aria-label**: Accessible name
- **aria-describedby**: Reference to description
- **aria-hidden**: Hide from screen readers
- **role**: Define element purpose

## Best Practices

✓ **Always include charset and viewport** meta tags
✓ **Write descriptive title and meta description** for SEO
✓ **Use data attributes** for custom data instead of inventing new attributes
✓ **One id per element** - must be unique
✓ **Use classes for styling** - ids for unique functionality
✓ **Add Open Graph tags** for better social media sharing
✓ **Include meaningful alt text** on images
✓ **Use semantic HTML first**, ARIA as enhancement

## Common Attributes by Element

### Links (`<a>`)
```html
<a href="https://example.com"
   target="_blank"
   rel="noopener noreferrer"
   title="Visit Example">Link</a>
```

### Images (`<img>`)
```html
<img src="photo.jpg"
     alt="Description"
     width="400"
     height="300"
     loading="lazy">
```

### Forms (`<input>`)
```html
<input type="text"
       id="username"
       name="username"
       placeholder="Enter username"
       required
       minlength="3"
       maxlength="20">
```

## Key Takeaways

✓ Attributes provide additional information about elements
✓ Global attributes (id, class, style, title, lang) work on any element
✓ Data attributes store custom data: `data-*`
✓ Meta tags in `<head>` provide page metadata
✓ Charset and viewport meta tags are essential
✓ SEO meta tags help search engine rankings
✓ Open Graph tags control social media previews
✓ ARIA attributes enhance accessibility

Ready to test your attributes knowledge?',
  30,
  8,
  ARRAY[
    'Use global attributes like id, class, and data attributes',
    'Understand the purpose of meta tags for SEO',
    'Implement Open Graph tags for social media sharing',
    'Apply ARIA attributes for better accessibility'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes", "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 9: CSS Selectors and Specificity
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
  'c9d0e1f2-a3b4-5c6d-7e8f-9a0b1c2d3e4f',
  'e7f9a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b',
  'CSS Selectors and Specificity',
  'Master CSS selectors, combinators, pseudo-classes, and specificity rules.',
  'quiz',
  '# CSS Selectors and Specificity

## Understanding CSS Selectors

Selectors are **patterns** that match HTML elements so you can style them. Mastering selectors is crucial for efficient CSS.

## Basic Selectors

### Element Selector

Targets all elements of a type:

```css
p {
  color: blue;
}

h1 {
  font-size: 32px;
}
```

Applies to **all** `<p>` and `<h1>` elements on the page.

### Class Selector

Targets elements with a specific class (most common):

```css
.button {
  background-color: #0ea5e9;
  padding: 10px 20px;
}

.highlight {
  background-color: yellow;
}
```

HTML:
```html
<button class="button">Click Me</button>
<p class="highlight">Important text</p>
```

**Tip**: Use classes for reusable styles.

### ID Selector

Targets a single unique element:

```css
#header {
  background-color: #333;
  height: 80px;
}
```

HTML:
```html
<header id="header">Site Header</header>
```

**Note**: IDs must be unique. Use classes instead when possible.

### Universal Selector

Targets **all** elements:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

Useful for CSS resets.

## Combining Selectors

### Multiple Selectors (Grouping)

Apply same styles to multiple selectors:

```css
h1, h2, h3 {
  font-family: Arial, sans-serif;
  color: #333;
}
```

### Descendant Selector (Space)

Targets elements inside other elements:

```css
article p {
  line-height: 1.6;
}
```

Styles all `<p>` inside `<article>`, **at any depth**.

### Child Selector (>)

Targets **direct children** only:

```css
ul > li {
  list-style: square;
}
```

Styles `<li>` only if it''s a direct child of `<ul>`, not nested deeper.

### Adjacent Sibling Selector (+)

Targets element immediately after another:

```css
h2 + p {
  font-weight: bold;
}
```

Styles `<p>` only if it comes **directly after** `<h2>`.

### General Sibling Selector (~)

Targets all siblings after an element:

```css
h2 ~ p {
  color: gray;
}
```

Styles all `<p>` elements that come after `<h2>` (don''t have to be adjacent).

## Attribute Selectors

Target elements based on attributes:

```css
/* Has attribute */
[type] {
  border: 1px solid #ccc;
}

/* Exact match */
[type="text"] {
  background-color: white;
}

/* Contains value */
[class*="btn"] {
  cursor: pointer;
}

/* Starts with */
[href^="https"] {
  color: green;
}

/* Ends with */
[href$=".pdf"] {
  color: red;
}
```

## Pseudo-Classes

Style elements based on their **state**:

### Link States

```css
a:link {
  color: blue;
}

a:visited {
  color: purple;
}

a:hover {
  color: red;
  text-decoration: underline;
}

a:active {
  color: orange;
}
```

**Order matters**: LVHA (Link, Visited, Hover, Active)

### Form States

```css
input:focus {
  outline: 2px solid #0ea5e9;
}

input:disabled {
  background-color: #f0f0f0;
  cursor: not-allowed;
}

input:checked {
  accent-color: #0ea5e9;
}
```

### Structural Pseudo-Classes

```css
li:first-child {
  font-weight: bold;
}

li:last-child {
  border-bottom: none;
}

tr:nth-child(odd) {
  background-color: #f9f9f9;
}

tr:nth-child(even) {
  background-color: white;
}

p:nth-child(2) {
  color: red;
}
```

### Other Useful Pseudo-Classes

```css
div:not(.special) {
  background-color: gray;
}

p:empty {
  display: none;
}
```

## Pseudo-Elements

Style **specific parts** of elements:

```css
/* First letter */
p::first-letter {
  font-size: 2em;
  font-weight: bold;
  float: left;
}

/* First line */
p::first-line {
  font-weight: bold;
  color: #0ea5e9;
}

/* Before element */
.note::before {
  content: "📝 ";
}

/* After element */
.external-link::after {
  content: " ↗";
}

/* Selected text */
::selection {
  background-color: #0ea5e9;
  color: white;
}
```

**Note**: Use double colon `::` for pseudo-elements (single `:` still works but deprecated).

## Specificity

When multiple rules target the same element, **specificity** determines which wins.

### Specificity Hierarchy

From weakest to strongest:

1. **Element selectors**: `p`, `div`, `h1` → Specificity: 0,0,1
2. **Class selectors**: `.class`, `[attr]`, `:hover` → Specificity: 0,1,0
3. **ID selectors**: `#id` → Specificity: 1,0,0
4. **Inline styles**: `style="..."` → Specificity: 1,0,0,0
5. **!important**: Overrides everything (use sparingly!)

### Calculating Specificity

Count: (inline, IDs, classes/attributes/pseudo-classes, elements)

```css
/* 0,0,0,1 - element */
p { color: red; }

/* 0,0,1,0 - class */
.text { color: blue; }

/* 0,1,0,0 - ID */
#special { color: green; }

/* 0,0,1,1 - class + element */
p.text { color: purple; }

/* 0,1,1,1 - ID + class + element */
#special .text p { color: orange; }
```

### Examples

```css
/* Specificity: 0,0,0,1 */
p { color: red; }

/* Specificity: 0,0,1,0 - WINS */
.blue-text { color: blue; }

/* Both apply, blue wins due to higher specificity */
<p class="blue-text">This is blue!</p>
```

```css
/* Specificity: 0,0,1,1 */
div.container { background: white; }

/* Specificity: 0,1,0,0 - WINS */
#main { background: gray; }

<div id="main" class="container">Gray background!</div>
```

### Using !important

```css
p {
  color: red !important;
}

.text {
  color: blue; /* Won''t apply */
}
```

**Warning**: Avoid `!important` - it makes CSS hard to maintain. Use specificity instead.

## Best Practices

✓ **Use classes** for most styling - they''re reusable and maintainable
✓ **Avoid IDs for styling** - save them for JavaScript
✓ **Keep specificity low** - easier to override later
✓ **Avoid !important** - use it only as a last resort
✓ **Group related selectors** - reduces repetition
✓ **Use meaningful names** - `.nav-button` vs `.btn1`
✓ **Prefer pseudo-classes** over JavaScript for states

## Complete Example

```css
/* Global reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Element selectors */
body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

/* Class selectors */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.button {
  display: inline-block;
  padding: 12px 24px;
  background-color: #0ea5e9;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

/* Pseudo-class */
.button:hover {
  background-color: #0284c7;
}

/* Descendant selector */
.nav ul {
  list-style: none;
}

.nav ul li {
  display: inline-block;
  margin-right: 20px;
}

/* Attribute selector */
a[target="_blank"]::after {
  content: " ↗";
  font-size: 0.8em;
}

/* Structural pseudo-class */
.list-item:nth-child(odd) {
  background-color: #f9f9f9;
}

/* Pseudo-element */
.quote::before {
  content: ''"'';
  font-size: 2em;
  color: #0ea5e9;
}
```

## Key Takeaways

✓ **Element selectors**: `p`, `div`, `h1`
✓ **Class selectors**: `.classname` (most common)
✓ **ID selectors**: `#idname` (use sparingly for styling)
✓ **Combinators**: `space` (descendant), `>` (child), `+` (adjacent), `~` (sibling)
✓ **Pseudo-classes**: `:hover`, `:focus`, `:nth-child()`
✓ **Pseudo-elements**: `::before`, `::after`, `::first-letter`
✓ **Specificity**: IDs > Classes > Elements
✓ Avoid `!important` and keep specificity low

Ready to test your selector knowledge?',
  40,
  9,
  ARRAY[
    'Use different types of CSS selectors effectively',
    'Understand and calculate CSS specificity',
    'Apply pseudo-classes and pseudo-elements',
    'Use combinators to target specific elements'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors", "https://specificity.keegan.st/"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 10: The CSS Box Model
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
  'd0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a',
  'e7f9a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b',
  'The CSS Box Model',
  'Master the CSS Box Model - content, padding, border, and margin.',
  'quiz',
  '# The CSS Box Model

## Understanding the Box Model

Every HTML element is a **rectangular box** with four layers:

```
┌─────────────────────────────────┐
│         MARGIN (transparent)     │
│  ┌───────────────────────────┐  │
│  │  BORDER                   │  │
│  │  ┌─────────────────────┐ │  │
│  │  │  PADDING            │ │  │
│  │  │  ┌───────────────┐  │ │  │
│  │  │  │   CONTENT     │  │ │  │
│  │  │  │               │  │ │  │
│  │  │  └───────────────┘  │ │  │
│  │  └─────────────────────┘ │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### The Four Layers

1. **Content**: The actual content (text, images)
2. **Padding**: Space between content and border (transparent)
3. **Border**: Border around padding
4. **Margin**: Space outside the border (transparent)

## Content

The content box holds your text, images, or other elements:

```css
div {
  width: 300px;
  height: 200px;
}
```

This sets the content area dimensions.

## Padding

**Internal spacing** between content and border:

```css
/* All sides */
padding: 20px;

/* Vertical | Horizontal */
padding: 10px 20px;

/* Top | Right | Bottom | Left (clockwise) */
padding: 10px 20px 30px 40px;

/* Individual sides */
padding-top: 10px;
padding-right: 20px;
padding-bottom: 30px;
padding-left: 40px;
```

**Example**:
```css
.card {
  padding: 20px;
  background-color: #f0f9ff;
}
```

The background color extends through the padding!

## Border

The border goes around padding and content:

```css
/* Shorthand */
border: 2px solid #0ea5e9;

/* Individual properties */
border-width: 2px;
border-style: solid;
border-color: #0ea5e9;

/* Individual sides */
border-top: 1px solid #ccc;
border-right: 2px dashed red;
border-bottom: 3px dotted blue;
border-left: 4px solid green;
```

### Border Styles

```css
border-style: solid;   /* ────── */
border-style: dashed;  /* - - - - */
border-style: dotted;  /* · · · · */
border-style: double;  /* ══════ */
border-style: groove;  /* 3D grooved */
border-style: ridge;   /* 3D ridged */
border-style: inset;   /* 3D inset */
border-style: outset;  /* 3D outset */
```

### Border Radius

Round corners:

```css
border-radius: 10px;  /* All corners */
border-radius: 50%;   /* Circle (if square) */

/* Individual corners */
border-top-left-radius: 10px;
border-top-right-radius: 20px;
border-bottom-right-radius: 30px;
border-bottom-left-radius: 40px;
```

## Margin

**External spacing** between elements:

```css
/* All sides */
margin: 20px;

/* Vertical | Horizontal */
margin: 10px 20px;

/* Top | Right | Bottom | Left */
margin: 10px 20px 30px 40px;

/* Individual sides */
margin-top: 10px;
margin-right: 20px;
margin-bottom: 30px;
margin-left: 40px;
```

### Centering with Margin

```css
.container {
  width: 800px;
  margin: 0 auto;  /* Centers horizontally */
}
```

`auto` calculates equal left and right margins.

### Negative Margins

```css
.overlap {
  margin-top: -20px;  /* Moves element UP */
}
```

Useful for overlapping elements.

## Box-Sizing Property

**Critical property** that changes how width/height are calculated:

### content-box (Default)

Width/height apply **only to content**:

```css
div {
  box-sizing: content-box;  /* Default */
  width: 300px;
  padding: 20px;
  border: 5px solid black;
}
```

**Total width** = 300 + 40 (padding) + 10 (border) = **350px**

### border-box (Recommended)

Width/height **include** padding and border:

```css
div {
  box-sizing: border-box;
  width: 300px;
  padding: 20px;
  border: 5px solid black;
}
```

**Total width** = **300px** (padding and border are inside!)

### Global Box-Sizing Reset

**Best practice** - apply to all elements:

```css
* {
  box-sizing: border-box;
}
```

Makes sizing predictable and easier to work with.

## Margin Collapse

**Vertical margins** between elements can collapse (merge):

```html
<div style="margin-bottom: 30px;">Box 1</div>
<div style="margin-top: 20px;">Box 2</div>
```

Gap between them is **30px**, not 50px! The larger margin wins.

### When Margins Collapse

- **Adjacent siblings**: Vertical margins collapse
- **Parent and first/last child**: Can collapse
- **Empty blocks**: Top and bottom margins collapse

### Preventing Margin Collapse

- Add padding to parent
- Add border to parent
- Use `overflow: hidden` on parent
- Use flexbox or grid (don''t collapse)

## Practical Examples

### Card Component

```css
.card {
  width: 300px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 20px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

### Button with Spacing

```css
.button {
  display: inline-block;
  padding: 12px 24px;
  border: 2px solid #0ea5e9;
  border-radius: 5px;
  margin: 10px 5px;
  background-color: #0ea5e9;
  color: white;
}
```

### Container with Max Width

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
}
```

## Debugging the Box Model

Use browser DevTools to inspect:

1. Right-click element → Inspect
2. Look for the box model diagram
3. See exact values for content, padding, border, margin

Chrome/Firefox show colorful box model visualization!

## Display and the Box Model

Different display types affect box behavior:

```css
/* Block - takes full width */
div {
  display: block;
  width: 100%;  /* Default for block */
}

/* Inline - flows with text */
span {
  display: inline;
  width: 100px;  /* Ignored! */
  margin-top: 10px;  /* Ignored! */
}

/* Inline-block - best of both */
.tag {
  display: inline-block;
  padding: 5px 10px;
  margin: 5px;  /* Works! */
}
```

## Width and Height Properties

```css
div {
  /* Fixed sizes */
  width: 300px;
  height: 200px;

  /* Percentage */
  width: 50%;
  height: 100%;

  /* Min and Max */
  min-width: 200px;
  max-width: 800px;
  min-height: 100px;
  max-height: 600px;

  /* Auto */
  width: auto;  /* Grows to fit content */
}
```

### Responsive Width

```css
.responsive {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
```

Grows with screen but never exceeds 1200px.

## Common Pitfalls

❌ Forgetting `box-sizing: border-box`
❌ Not accounting for padding/border in width calculations
❌ Confused by margin collapse
❌ Using width on inline elements (doesn''t work)
❌ Mixing units (px and % margins can be tricky)

## Best Practices

✓ **Use `box-sizing: border-box`** globally
✓ **Use shorthand** when all sides are same
✓ **Be consistent** with spacing units (all px or all rem)
✓ **Center with margin auto** for block elements
✓ **Use padding** for internal spacing, margin for external
✓ **Set max-width** instead of fixed width for responsiveness
✓ **Use DevTools** to visualize and debug box model

## Key Takeaways

✓ Every element is a box with content, padding, border, margin
✓ **box-sizing: border-box** makes sizing intuitive
✓ **Padding** adds space inside, **margin** adds space outside
✓ **Border** sits between padding and margin
✓ Vertical margins collapse between adjacent elements
✓ Use shorthand: `padding: 10px 20px`
✓ Center blocks with `margin: 0 auto`
✓ Use DevTools to inspect the box model

Ready to test your box model knowledge?',
  40,
  10,
  ARRAY[
    'Understand the four parts of the CSS Box Model',
    'Use padding, border, and margin effectively',
    'Master box-sizing property',
    'Debug layout issues using the box model'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model", "https://css-tricks.com/the-css-box-model/"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 11: Colors, Units, and Typography
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
  'e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b',
  'e7f9a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b',
  'Colors, Units, and Typography',
  'Master CSS color formats, measurement units, and typography properties.',
  'quiz',
  '# Colors, Units, and Typography

## CSS Colors

Colors are fundamental to web design. CSS provides multiple ways to specify colors.

### Color Formats

#### Named Colors

```css
color: red;
color: blue;
color: hotpink;
color: rebeccapurple;
```

140+ predefined color names. Easy to use but limited.

#### Hexadecimal (Hex)

Most common format:

```css
color: #0ea5e9;  /* RGB values in hex */
color: #fff;     /* Shorthand for #ffffff */
color: #000;     /* Shorthand for #000000 */
```

Format: `#RRGGBB` or `#RGB`
- RR = Red (00-FF)
- GG = Green (00-FF)
- BB = Blue (00-FF)

#### RGB

```css
color: rgb(14, 165, 233);     /* QodeBench blue */
color: rgb(255, 0, 0);          /* Red */
color: rgb(0, 255, 0);          /* Green */
```

Values: 0-255 for each channel.

#### RGBA (with transparency)

```css
background-color: rgba(14, 165, 233, 0.5);  /* 50% transparent */
background-color: rgba(0, 0, 0, 0.8);       /* 80% opaque black */
```

Alpha: 0 (transparent) to 1 (opaque)

#### HSL (Hue, Saturation, Lightness)

```css
color: hsl(199, 89%, 48%);  /* QodeBench blue */
color: hsl(0, 100%, 50%);   /* Red */
color: hsl(120, 100%, 50%); /* Green */
```

- **Hue**: 0-360 (color wheel degrees)
- **Saturation**: 0-100% (gray to full color)
- **Lightness**: 0-100% (black to white)

#### HSLA (with transparency)

```css
background-color: hsla(199, 89%, 48%, 0.5);
```

### Color Properties

```css
/* Text color */
color: #0ea5e9;

/* Background color */
background-color: #f0f9ff;

/* Border color */
border-color: #ddd;

/* Outline color */
outline-color: red;

/* Box shadow color */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
```

## CSS Units

Choosing the right unit is crucial for responsive design.

### Absolute Units

**Fixed size** regardless of other factors:

```css
/* Pixels - most common absolute unit */
font-size: 16px;
width: 300px;
margin: 20px;

/* Others (rarely used) */
width: 2in;   /* Inches */
width: 2cm;   /* Centimeters */
width: 20pt;  /* Points (typography) */
```

**Use pixels for**: borders, small fixed elements

### Relative Units

**Responsive** - adapt to context:

#### em

Relative to **parent element''s** font size:

```css
.parent {
  font-size: 16px;
}

.child {
  font-size: 2em;     /* 32px (16 × 2) */
  padding: 1em;       /* 32px (based on own font-size!) */
  margin: 0.5em;      /* 16px */
}
```

**Compounding issue**: Nesting multiplies values!

#### rem (Root em)

Relative to **root element** (`<html>`) font size:

```css
html {
  font-size: 16px;  /* Base size */
}

h1 {
  font-size: 2rem;    /* 32px (16 × 2) */
}

p {
  font-size: 1rem;    /* 16px */
  margin: 1.5rem;     /* 24px */
}
```

**Best practice**: Use `rem` for most sizing!

#### Percentage (%)

Relative to **parent element**:

```css
.parent {
  width: 800px;
}

.child {
  width: 50%;        /* 400px */
  padding: 10%;      /* 80px (10% of parent width) */
}
```

#### Viewport Units

Relative to **browser viewport**:

```css
/* Viewport Width */
width: 100vw;   /* 100% of viewport width */
width: 50vw;    /* 50% of viewport width */

/* Viewport Height */
height: 100vh;  /* 100% of viewport height */
height: 50vh;   /* 50% of viewport height */

/* Viewport Min/Max */
font-size: 5vmin;  /* 5% of smaller dimension */
font-size: 5vmax;  /* 5% of larger dimension */
```

**Perfect for**: Full-screen sections, hero images

### Unit Comparison

| Unit | Best For |
|------|----------|
| **px** | Borders, small fixed elements |
| **rem** | Font sizes, spacing, most sizing |
| **em** | Relative spacing within components |
| **%** | Widths relative to parent |
| **vw/vh** | Full-screen layouts, hero sections |

## Typography

Typography makes or breaks readability and design.

### Font Family

```css
/* Specific font */
font-family: Arial;

/* Font stack (fallbacks) */
font-family: Arial, Helvetica, sans-serif;

/* Web-safe fonts */
font-family: "Times New Roman", Times, serif;
font-family: Georgia, serif;
font-family: Courier, monospace;
```

**Generic families**:
- `serif`: Times, Georgia
- `sans-serif`: Arial, Helvetica
- `monospace`: Courier, Monaco
- `cursive`: Comic Sans
- `fantasy`: Impact

### Font Size

```css
font-size: 16px;
font-size: 1rem;
font-size: 1.2em;
font-size: 14pt;
```

**Best practice**: Use `rem` for scalability.

### Font Weight

```css
font-weight: normal;    /* 400 */
font-weight: bold;      /* 700 */
font-weight: lighter;
font-weight: bolder;

/* Numeric values */
font-weight: 100;  /* Thin */
font-weight: 300;  /* Light */
font-weight: 400;  /* Normal */
font-weight: 500;  /* Medium */
font-weight: 600;  /* Semi-bold */
font-weight: 700;  /* Bold */
font-weight: 900;  /* Black */
```

### Font Style

```css
font-style: normal;
font-style: italic;
font-style: oblique;
```

### Text Properties

```css
/* Alignment */
text-align: left;
text-align: center;
text-align: right;
text-align: justify;

/* Decoration */
text-decoration: none;
text-decoration: underline;
text-decoration: line-through;
text-decoration: overline;

/* Transform */
text-transform: uppercase;
text-transform: lowercase;
text-transform: capitalize;
text-transform: none;

/* Line height (spacing between lines) */
line-height: 1.6;
line-height: 24px;
line-height: 150%;

/* Letter spacing */
letter-spacing: 1px;
letter-spacing: 0.05em;

/* Word spacing */
word-spacing: 5px;
```

### Web Fonts

Use custom fonts with Google Fonts:

```html
<!-- In HTML head -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
```

```css
body {
  font-family: ''Inter'', sans-serif;
}
```

### Font Shorthand

```css
/* font: style variant weight size/line-height family */
font: italic small-caps bold 16px/1.6 Arial, sans-serif;

/* Common usage */
font: 400 1rem/1.5 "Helvetica", sans-serif;
```

## Practical Typography System

### Setting a Base

```css
html {
  font-size: 16px;  /* Base for rem calculations */
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
               "Helvetica Neue", Arial, sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
}
```

### Heading Scale

```css
h1 {
  font-size: 2.5rem;  /* 40px */
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
}

h2 {
  font-size: 2rem;    /* 32px */
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 0.875rem;
}

h3 {
  font-size: 1.5rem;  /* 24px */
  font-weight: 600;
  line-height: 1.4;
}

h4 {
  font-size: 1.25rem; /* 20px */
  font-weight: 600;
}
```

### Body Text

```css
p {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.lead {
  font-size: 1.25rem;
  line-height: 1.7;
  color: #555;
}

.small-text {
  font-size: 0.875rem;
}
```

## Color Accessibility

Ensure sufficient contrast for readability:

```css
/* Good contrast */
.good {
  background-color: #0ea5e9;
  color: white;  /* WCAG AA compliant */
}

/* Poor contrast */
.bad {
  background-color: #fef08a;
  color: white;  /* Too low contrast! */
}
```

**Tools**: Use contrast checkers (WebAIM, Chrome DevTools)

## Best Practices

✓ **Use rem for most sizing** - scalable and predictable
✓ **Use a font stack** - provide fallbacks
✓ **Set a base font size** on `html`
✓ **Line height: 1.5-1.7** for body text
✓ **Limit line length** - 50-75 characters for readability
✓ **Use web fonts sparingly** - impacts performance
✓ **Check color contrast** - ensure accessibility
✓ **Use CSS variables** for consistent colors

### CSS Variables for Colors

```css
:root {
  --primary-color: #0ea5e9;
  --text-color: #333;
  --bg-color: #f0f9ff;
}

button {
  background-color: var(--primary-color);
  color: white;
}
```

## Key Takeaways

✓ **Color formats**: Hex, RGB, RGBA, HSL, HSLA
✓ **Absolute units**: px, pt, cm (fixed size)
✓ **Relative units**: rem, em, %, vw, vh (responsive)
✓ Use **rem** for most sizing, **px** for borders
✓ **Font family**: Provide fallback stack
✓ **Line height**: 1.5-1.7 for readability
✓ **Font weight**: 400 (normal), 700 (bold)
✓ **Color contrast** matters for accessibility

Ready to test your knowledge?',
  35,
  11,
  ARRAY[
    'Use different color formats (hex, rgb, hsl)',
    'Choose appropriate CSS units for different contexts',
    'Apply typography properties for readable text',
    'Create a scalable typography system with rem units'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/CSS/color_value", "https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 12: Flexbox Layout Fundamentals
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
  'f2a3b4c5-d6e7-8f9a-0b1c-2d3e4f5a6b7c',
  'e7f9a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b',
  'Flexbox Layout Fundamentals',
  'Master Flexbox - the modern way to create flexible, responsive layouts.',
  'quiz',
  '# Flexbox Layout Fundamentals

## What is Flexbox?

**Flexbox** (Flexible Box Layout) is a powerful CSS layout system that makes it easy to:

- Align items horizontally or vertically
- Distribute space between items
- Center content
- Create responsive layouts
- Handle dynamic content sizes

## Enabling Flexbox

Turn any element into a flex container:

```css
.container {
  display: flex;
}
```

**That''s it!** The children automatically become **flex items**.

## Flex Direction

Controls the main axis direction:

```css
.container {
  display: flex;
  flex-direction: row;  /* Default - horizontal →  */
}
```

### Four Options

```css
flex-direction: row;           /* → Left to right */
flex-direction: row-reverse;   /* ← Right to left */
flex-direction: column;        /* ↓ Top to bottom */
flex-direction: column-reverse; /* ↑ Bottom to top */
```

**Example - Horizontal Layout**:
```css
.nav {
  display: flex;
  flex-direction: row;
}
```

```html
<nav class="nav">
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>
```

Items line up horizontally!

**Example - Vertical Layout**:
```css
.sidebar {
  display: flex;
  flex-direction: column;
}
```

Items stack vertically!

## Justify Content

Aligns items along the **main axis** (horizontal if row, vertical if column):

```css
.container {
  display: flex;
  justify-content: flex-start;  /* Default */
}
```

### Options

```css
/* Align to start */
justify-content: flex-start;
/*  [1][2][3]                  */

/* Align to end */
justify-content: flex-end;
/*                  [1][2][3]  */

/* Center */
justify-content: center;
/*          [1][2][3]          */

/* Space between - first/last touch edges */
justify-content: space-between;
/*  [1]      [2]      [3]      */

/* Space around - equal space around each */
justify-content: space-around;
/*   [1]    [2]    [3]         */

/* Space evenly - equal gaps */
justify-content: space-evenly;
/*    [1]   [2]   [3]          */
```

**Practical Example - Center Navigation**:
```css
.nav {
  display: flex;
  justify-content: center;
  gap: 20px;
}
```

## Align Items

Aligns items along the **cross axis** (perpendicular to main axis):

```css
.container {
  display: flex;
  align-items: stretch;  /* Default */
  height: 200px;
}
```

### Options

```css
/* Stretch to fill */
align-items: stretch;

/* Align to top (if row) / left (if column) */
align-items: flex-start;

/* Align to bottom (if row) / right (if column) */
align-items: flex-end;

/* Center */
align-items: center;

/* Align to baseline */
align-items: baseline;
```

**Perfect Centering** (the holy grail!):
```css
.center-everything {
  display: flex;
  justify-content: center;  /* Horizontal */
  align-items: center;      /* Vertical */
  height: 100vh;
}
```

## Gap

Space between flex items (modern and clean):

```css
.container {
  display: flex;
  gap: 20px;  /* Space between all items */
}

/* Or separate control */
.container {
  row-gap: 20px;
  column-gap: 30px;
}
```

Much better than using margins!

## Flex Wrap

Controls whether items wrap to new lines:

```css
.container {
  display: flex;
  flex-wrap: nowrap;  /* Default - all on one line */
}
```

### Options

```css
/* No wrap - items shrink to fit */
flex-wrap: nowrap;

/* Wrap to next line if needed */
flex-wrap: wrap;

/* Wrap in reverse order */
flex-wrap: wrap-reverse;
```

**Responsive Card Grid**:
```css
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  width: 300px;
}
```

Cards automatically wrap to new rows!

## Practical Examples

### Horizontal Navigation Bar

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #333;
}

.nav-links {
  display: flex;
  gap: 30px;
  list-style: none;
}
```

```html
<nav class="navbar">
  <div class="logo">Brand</div>
  <ul class="nav-links">
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>
```

### Centered Card

```css
.card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f9ff;
}

.card {
  padding: 40px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
```

### Column Layout

```css
.page {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #f9f9f9;
  padding: 20px;
}

.main-content {
  flex: 1;  /* Takes remaining space */
  padding: 20px;
}
```

### Three-Column Footer

```css
.footer {
  display: flex;
  justify-content: space-between;
  padding: 40px;
  background-color: #333;
  color: white;
}

.footer-column {
  flex: 1;
  padding: 0 20px;
}
```

```html
<footer class="footer">
  <div class="footer-column">
    <h3>About</h3>
    <p>Company info...</p>
  </div>
  <div class="footer-column">
    <h3>Links</h3>
    <ul>...</ul>
  </div>
  <div class="footer-column">
    <h3>Contact</h3>
    <p>Email: ...</p>
  </div>
</footer>
```

## Flexbox Shortcuts

### Flex Shorthand

```css
.container {
  /* Combines flex-direction and flex-wrap */
  flex-flow: row wrap;
}

/* Same as: */
.container {
  flex-direction: row;
  flex-wrap: wrap;
}
```

### Place Content

```css
.container {
  /* Combines justify-content and align-items */
  place-content: center;
}

/* Same as: */
.container {
  justify-content: center;
  align-items: center;
}
```

## Common Patterns

### Navbar with Logo and Links

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

### Card Grid

```css
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
```

### Sidebar Layout

```css
.layout {
  display: flex;
}

.sidebar {
  width: 250px;
}

.main {
  flex: 1;
}
```

### Centered Content

```css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
```

## Browser Support

Flexbox is supported in all modern browsers (IE 11+). Safe to use!

## Best Practices

✓ **Use Flexbox for one-dimensional layouts** (row or column)
✓ **Use gap instead of margins** for spacing
✓ **Combine with CSS Grid** for complex layouts
✓ **Start with simple flex containers** and build up
✓ **Use developer tools** to visualize flex layouts
✓ **Mobile-first approach** - stack on mobile, horizontal on desktop

## Common Mistakes

❌ Applying flex properties to the container instead of items (and vice versa)
❌ Forgetting `display: flex` on the parent
❌ Using Flexbox for two-dimensional layouts (use Grid instead)
❌ Not setting a height when aligning vertically
❌ Overcomplicating with nested flex containers

## Key Takeaways

✓ **`display: flex`** creates a flex container
✓ **`flex-direction`**: row, column (controls main axis)
✓ **`justify-content`**: aligns along main axis
✓ **`align-items`**: aligns along cross axis
✓ **`gap`**: adds space between items
✓ **`flex-wrap`**: allows items to wrap
✓ Perfect centering: `justify-content: center` + `align-items: center`
✓ Flexbox is perfect for navbars, cards, and one-dimensional layouts

Ready to flex your knowledge?',
  45,
  12,
  ARRAY[
    'Create flex containers and understand flex items',
    'Use flex-direction to control layout direction',
    'Align items with justify-content and align-items',
    'Build common layouts like navbars and card grids'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout", "https://css-tricks.com/snippets/css/a-guide-to-flexbox/"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 13: Flexbox Advanced Techniques
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
  'a3b4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d',
  'e7f9a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b',
  'Flexbox Advanced Techniques',
  'Master advanced Flexbox properties for complete control over flex items.',
  'quiz',
  '# Flexbox Advanced Techniques

## Flex Item Properties

So far we''ve learned **container properties**. Now let''s master **item properties** for individual flex items.

## Flex-Grow

Controls how much an item **grows** relative to others:

```css
.item {
  flex-grow: 1;  /* Default is 0 (don''t grow) */
}
```

### How It Works

```css
.container {
  display: flex;
  width: 600px;
}

.item-1 {
  flex-grow: 1;  /* Gets 1 part */
}

.item-2 {
  flex-grow: 2;  /* Gets 2 parts (twice as much!) */
}

.item-3 {
  flex-grow: 1;  /* Gets 1 part */
}
```

**Total**: 1 + 2 + 1 = 4 parts
- Item 1: 25% of extra space
- Item 2: 50% of extra space
- Item 3: 25% of extra space

### Practical Example

```css
.dashboard {
  display: flex;
  gap: 20px;
}

.sidebar {
  width: 250px;
  /* Doesn''t grow */
}

.main {
  flex-grow: 1;  /* Takes all remaining space! */
}

.aside {
  width: 200px;
  /* Doesn''t grow */
}
```

## Flex-Shrink

Controls how much an item **shrinks** when space is tight:

```css
.item {
  flex-shrink: 1;  /* Default - can shrink */
}
```

### Values

```css
flex-shrink: 0;  /* Never shrink */
flex-shrink: 1;  /* Can shrink (default) */
flex-shrink: 2;  /* Shrinks twice as fast */
```

**Example - Prevent Shrinking**:
```css
.logo {
  flex-shrink: 0;  /* Logo stays full size */
  width: 150px;
}

.nav-links {
  flex-shrink: 1;  /* Links can shrink if needed */
}
```

## Flex-Basis

Sets the **initial size** before growing/shrinking:

```css
.item {
  flex-basis: 200px;  /* Start at 200px */
}
```

**vs width/height**:
- `width/height`: Fixed size
- `flex-basis`: Suggested size (can grow/shrink)

```css
/* These are similar: */
.item {
  width: 300px;
}

.item {
  flex-basis: 300px;
  flex-grow: 0;
  flex-shrink: 0;
}
```

### Common Values

```css
flex-basis: auto;     /* Based on content (default) */
flex-basis: 0;        /* Start from zero, grow as needed */
flex-basis: 200px;    /* Start at 200px */
flex-basis: 50%;      /* Start at 50% of container */
```

## Flex Shorthand

Combines grow, shrink, and basis:

```css
.item {
  /* flex: grow shrink basis */
  flex: 1 1 200px;
}
```

### Common Patterns

```css
/* Flexible item - grows and shrinks */
flex: 1;
/* Same as: flex: 1 1 0 */

/* Fixed item - doesn''t grow or shrink */
flex: none;
/* Same as: flex: 0 0 auto */

/* Grow only */
flex: 1 0 auto;

/* Common: equal width items */
.item {
  flex: 1;  /* All items same width */
}
```

## Order

Changes the **visual order** of items:

```css
.item {
  order: 0;  /* Default */
}
```

**Lower values appear first**, regardless of HTML order!

### Example

```html
<div class="container">
  <div class="item-1">A</div>
  <div class="item-2">B</div>
  <div class="item-3">C</div>
</div>
```

```css
.container {
  display: flex;
}

.item-1 {
  order: 3;  /* Shows last */
}

.item-2 {
  order: 1;  /* Shows first */
}

.item-3 {
  order: 2;  /* Shows middle */
}

/* Visual order: B, C, A */
```

**Use Case - Mobile Reordering**:
```css
@media (max-width: 768px) {
  .main-content {
    order: 2;  /* Show after sidebar on mobile */
  }

  .sidebar {
    order: 1;  /* Show first on mobile */
  }
}
```

## Align-Self

Override `align-items` for **individual items**:

```css
.container {
  display: flex;
  align-items: center;  /* Default for all */
}

.item-special {
  align-self: flex-end;  /* This one aligns differently */
}
```

### Values

```css
align-self: auto;       /* Inherit from container (default) */
align-self: flex-start; /* Align to start */
align-self: flex-end;   /* Align to end */
align-self: center;     /* Center */
align-self: stretch;    /* Stretch to fill */
align-self: baseline;   /* Align to text baseline */
```

**Example - Featured Card**:
```css
.card-grid {
  display: flex;
  align-items: flex-start;
}

.featured-card {
  align-self: stretch;  /* Full height */
}
```

## Align-Content

Aligns **multiple lines** when wrapping (only works with `flex-wrap: wrap`):

```css
.container {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  height: 500px;
}
```

### Values (similar to justify-content)

```css
align-content: flex-start;
align-content: flex-end;
align-content: center;
align-content: space-between;
align-content: space-around;
align-content: stretch;
```

**Difference**:
- **`align-items`**: Aligns items within their line
- **`align-content`**: Aligns the lines themselves

## Advanced Layout Examples

### Holy Grail Layout

```css
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header, footer {
  flex-shrink: 0;
  height: 80px;
}

main {
  display: flex;
  flex: 1;  /* Takes remaining space */
}

.sidebar-left {
  flex-basis: 200px;
}

.content {
  flex: 1;
}

.sidebar-right {
  flex-basis: 200px;
}
```

### Responsive Card Grid

```css
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  flex: 1 1 300px;  /* Grow, shrink, min 300px */
  max-width: 400px;
}
```

Cards automatically adjust to screen size!

### Form with Flexible Inputs

```css
.form-row {
  display: flex;
  gap: 15px;
}

.form-field {
  flex: 1;  /* Equal width */
}

.form-field.small {
  flex: 0 0 100px;  /* Fixed 100px */
}

.form-field.large {
  flex: 2;  /* Twice as wide */
}
```

### Toolbar with Action Buttons

```css
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.toolbar-left {
  display: flex;
  gap: 10px;
}

.toolbar-right {
  display: flex;
  gap: 10px;
}

.spacer {
  flex: 1;  /* Pushes items apart */
}
```

## Auto Margins Trick

**Auto margins** in Flexbox push items to edges:

```css
.nav {
  display: flex;
  gap: 20px;
}

.login-button {
  margin-left: auto;  /* Pushes to the right! */
}
```

```html
<nav class="nav">
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
  <button class="login-button">Login</button>
</nav>
```

**Login button** appears at far right!

## Nested Flexbox

Flex containers can be flex items:

```css
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  display: flex;  /* Nested flex container */
  justify-content: space-between;
  align-items: center;
}

.main {
  display: flex;  /* Nested flex container */
  flex: 1;
}
```

## Best Practices

✓ **Use flex shorthand** - cleaner and more reliable
✓ **Combine flex-grow and flex-basis** for responsive items
✓ **Use order sparingly** - can confuse screen readers
✓ **Auto margins are powerful** - great for spacing
✓ **Test wrapping behavior** at different screen sizes
✓ **Use align-self** for special cases, not all items

## Common Patterns Cheat Sheet

```css
/* Equal width columns */
.item { flex: 1; }

/* Sidebar + flexible content */
.sidebar { flex: 0 0 250px; }
.content { flex: 1; }

/* Responsive cards */
.card { flex: 1 1 300px; }

/* Fixed size, no grow/shrink */
.fixed { flex: none; width: 200px; }

/* Push item to right */
.push-right { margin-left: auto; }

/* Push item to bottom */
.push-bottom { margin-top: auto; }
```

## Key Takeaways

✓ **`flex-grow`**: How much item grows (0 = no grow)
✓ **`flex-shrink`**: How much item shrinks (0 = no shrink)
✓ **`flex-basis`**: Initial size before growing/shrinking
✓ **`flex` shorthand**: `flex: grow shrink basis`
✓ **`order`**: Change visual order of items
✓ **`align-self`**: Override alignment for one item
✓ **`align-content`**: Align multiple wrapped lines
✓ **Auto margins**: Push items to edges
✓ **`flex: 1`** is most common pattern for equal distribution

You''re now a Flexbox master!',
  40,
  13,
  ARRAY[
    'Control flex items with flex-grow, flex-shrink, and flex-basis',
    'Use the flex shorthand property effectively',
    'Change visual order with the order property',
    'Create advanced responsive layouts with Flexbox'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/CSS/flex", "https://flexboxfroggy.com/"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 14: CSS Grid Layout
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
  'b4c5d6e7-f8a9-0b1c-2d3e-4f5a6b7c8d9e',
  'e7f9a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b',
  'CSS Grid Layout',
  'Master CSS Grid for powerful two-dimensional layouts.',
  'quiz',
  '# CSS Grid Layout

## What is CSS Grid?

**CSS Grid** is a two-dimensional layout system for creating complex layouts with **rows** and **columns**.

**When to use**:
- Grid: Two-dimensional layouts (rows AND columns)
- Flexbox: One-dimensional layouts (row OR column)

## Creating a Grid

```css
.container {
  display: grid;
}
```

Children automatically become **grid items**.

## Defining Columns

Use `grid-template-columns`:

```css
.grid {
  display: grid;
  grid-template-columns: 200px 200px 200px;  /* 3 columns, 200px each */
}
```

### Using fr (Fraction Units)

**fr** = fraction of available space:

```css
/* 3 equal columns */
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

/* First column twice as wide */
.grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
}

/* Fixed + flexible */
.grid {
  display: grid;
  grid-template-columns: 250px 1fr;  /* Sidebar + flexible content */
}
```

### repeat() Function

Shorthand for repetitive patterns:

```css
/* 3 equal columns */
grid-template-columns: repeat(3, 1fr);

/* 4 columns of 200px */
grid-template-columns: repeat(4, 200px);

/* Pattern repetition */
grid-template-columns: repeat(3, 100px 200px);
/* Results in: 100px 200px 100px 200px 100px 200px */
```

## Defining Rows

Use `grid-template-rows`:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 100px 200px 100px;
}
```

**Auto rows**: If not specified, rows size to content.

### Implicit vs Explicit Grid

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 100px 100px;  /* 2 explicit rows */
  grid-auto-rows: 150px;             /* Extra rows are 150px */
}
```

If you have 7 items with 2 explicit rows, remaining items create implicit rows.

## Gap (Gutters)

Space between grid cells:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;  /* 20px between all cells */
}

/* Or separate: */
.grid {
  row-gap: 20px;
  column-gap: 30px;
}
```

## Spanning Cells

Items can span multiple columns or rows:

```css
.item {
  grid-column: span 2;  /* Spans 2 columns */
  grid-row: span 2;     /* Spans 2 rows */
}
```

### Using Line Numbers

Grid lines are numbered starting from 1:

```css
.item {
  grid-column: 1 / 3;  /* Starts at line 1, ends at line 3 (spans 2 columns) */
  grid-row: 1 / 2;     /* Spans 1 row */
}

/* Shorthand */
.item {
  grid-column: 1 / span 2;  /* Start at 1, span 2 columns */
}

/* Span to end */
.item {
  grid-column: 1 / -1;  /* Start at 1, end at last line */
}
```

## Practical Examples

### Three-Column Layout

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
```

```html
<div class="grid">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
  <div class="card">Card 4</div>
  <div class="card">Card 5</div>
  <div class="card">Card 6</div>
</div>
```

Perfect card grid!

### Sidebar Layout

```css
.layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 20px;
  min-height: 100vh;
}
```

```html
<div class="layout">
  <aside class="sidebar">Sidebar</aside>
  <main class="content">Main Content</main>
</div>
```

### Blog Post Layout

```css
.post-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.featured-post {
  grid-column: span 2;  /* Takes 2 columns */
  grid-row: span 2;     /* Takes 2 rows */
}
```

```html
<div class="post-grid">
  <article class="featured-post">Featured</article>
  <article>Post 2</article>
  <article>Post 3</article>
  <article>Post 4</article>
  <article>Post 5</article>
</div>
```

Featured post is larger!

## Grid Template Areas

Named areas for intuitive layouts:

```css
.layout {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: 80px 1fr 60px;
  grid-template-areas:
    "header header header"
    "sidebar content aside"
    "footer footer footer";
  gap: 10px;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
```

Visual and easy to understand!

### Responsive Template Areas

```css
/* Desktop */
.layout {
  grid-template-areas:
    "header header header"
    "sidebar content aside"
    "footer footer footer";
}

/* Mobile */
@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "content"
      "sidebar"
      "aside"
      "footer";
  }
}
```

Layout rearranges on mobile!

## Auto-Fit and Auto-Fill

Responsive grids without media queries:

### auto-fit

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
```

**Creates as many columns as fit**, min 250px each!

### auto-fill

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}
```

**Difference**:
- `auto-fit`: Expands items to fill space
- `auto-fill`: Keeps item size, creates empty tracks

## Alignment

### Justify Items (Horizontal)

```css
.grid {
  display: grid;
  justify-items: start;   /* left */
  justify-items: center;  /* center */
  justify-items: end;     /* right */
  justify-items: stretch; /* fill (default) */
}
```

### Align Items (Vertical)

```css
.grid {
  display: grid;
  align-items: start;   /* top */
  align-items: center;  /* center */
  align-items: end;     /* bottom */
  align-items: stretch; /* fill (default) */
}
```

### Place Items Shorthand

```css
.grid {
  place-items: center;  /* center both horizontally and vertically */
}

/* Same as: */
.grid {
  justify-items: center;
  align-items: center;
}
```

### Individual Item Alignment

```css
.item {
  justify-self: center;  /* Horizontal */
  align-self: center;    /* Vertical */
  place-self: center;    /* Both */
}
```

## Dense Packing

Fill gaps in the grid:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-flow: dense;  /* Fill gaps */
}
```

Items that don''t fit skip ahead, and smaller items fill gaps.

## Minmax()

Set minimum and maximum sizes:

```css
.grid {
  display: grid;
  grid-template-columns: minmax(200px, 400px) 1fr;
}

/* Column is at least 200px, max 400px */
```

**Responsive without media queries**:
```css
.grid {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
```

## Advanced Patterns

### Dashboard Layout

```css
.dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 200px);
  gap: 20px;
}

.widget-large {
  grid-column: span 2;
  grid-row: span 2;
}

.widget-tall {
  grid-row: span 2;
}
```

### Magazine Layout

```css
.magazine {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 15px;
}

.main-story {
  grid-column: 1 / 5;
  grid-row: 1 / 3;
}

.side-story {
  grid-column: 5 / 7;
}
```

## Best Practices

✓ **Use Grid for two-dimensional layouts**
✓ **Use fr units for flexibility**
✓ **Use auto-fit/auto-fill** for responsive grids
✓ **Template areas** for complex layouts
✓ **minmax() for responsive columns** without media queries
✓ **Gap instead of margins** for spacing
✓ **Combine with Flexbox** - Grid for outer layout, Flex for components

## Grid vs Flexbox

Use **Grid** when:
- Two-dimensional layout (rows AND columns)
- Need precise control over both axes
- Complex layouts with overlapping areas
- Magazine/dashboard layouts

Use **Flexbox** when:
- One-dimensional layout (row OR column)
- Items of unknown/dynamic size
- Navbars, toolbars
- Centering content
- Dynamic content distribution

## Browser Support

Grid is supported in all modern browsers (IE 11 with prefixes). Safe to use!

## Key Takeaways

✓ **`display: grid`** creates a grid container
✓ **`grid-template-columns/rows`** define grid structure
✓ **`fr` units** for flexible sizing
✓ **`repeat()`** for repetitive patterns
✓ **`gap`** for spacing between cells
✓ **`grid-column/row: span N`** to span cells
✓ **`grid-template-areas`** for named layouts
✓ **`auto-fit/auto-fill + minmax()`** for responsive grids
✓ **Grid = 2D, Flexbox = 1D**

You''ve mastered CSS Grid!',
  45,
  14,
  ARRAY[
    'Create grid containers with rows and columns',
    'Use fr units and the repeat() function',
    'Span grid items across multiple cells',
    'Build responsive layouts with auto-fit and minmax()'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout", "https://css-tricks.com/snippets/css/complete-guide-grid/"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 15: Positioning and Z-Index
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
  'c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f',
  'e7f9a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b',
  'Positioning and Z-Index',
  'Master CSS positioning and layering with z-index.',
  'quiz',
  '# Positioning and Z-Index

## CSS Position Property

The `position` property controls how elements are positioned in the document flow.

## Static Positioning (Default)

```css
.element {
  position: static;  /* Default */
}
```

Elements follow normal document flow. `top`, `right`, `bottom`, `left`, and `z-index` have **no effect**.

## Relative Positioning

```css
.element {
  position: relative;
  top: 20px;    /* Move DOWN 20px from original position */
  left: 30px;   /* Move RIGHT 30px from original position */
}
```

**Key points**:
- Element stays in document flow
- Original space is **preserved** (leaves gap)
- Offset from its original position
- Creates positioning context for absolute children

**Example - Shift Badge**:
```css
.button {
  position: relative;
}

.badge {
  position: absolute;
  top: -10px;
  right: -10px;
}
```

## Absolute Positioning

```css
.element {
  position: absolute;
  top: 0;
  right: 0;
}
```

**Key points**:
- Removed from document flow (no space preserved)
- Positioned relative to nearest **positioned ancestor** (not static)
- If no positioned ancestor, uses `<body>`

**Example - Dropdown Menu**:
```css
.dropdown-container {
  position: relative;  /* Creates positioning context */
}

.dropdown-menu {
  position: absolute;
  top: 100%;  /* Right below container */
  left: 0;
  width: 200px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

**Example - Modal Overlay**:
```css
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
}
```

## Fixed Positioning

```css
.element {
  position: fixed;
  top: 0;
  left: 0;
}
```

**Key points**:
- Removed from document flow
- Positioned relative to **viewport**
- Stays in place when scrolling

**Example - Fixed Header**:
```css
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1000;
}

body {
  padding-top: 80px;  /* Prevent content hiding under header */
}
```

**Example - Floating Action Button**:
```css
.fab {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #0ea5e9;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
```

## Sticky Positioning

```css
.element {
  position: sticky;
  top: 0;
}
```

**Key points**:
- Hybrid of relative and fixed
- Acts **relative** until scroll threshold
- Then acts **fixed**
- Must specify at least one of: top, right, bottom, left

**Example - Sticky Table Header**:
```css
thead {
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}
```

**Example - Sticky Sidebar**:
```css
.sidebar {
  position: sticky;
  top: 20px;
  height: fit-content;
}
```

## Z-Index and Stacking

Controls layering order of positioned elements:

```css
.element {
  position: relative;  /* Position required for z-index to work */
  z-index: 10;
}
```

**Rules**:
- Higher z-index = in front
- Only works on **positioned elements** (not static)
- Default z-index is `auto` (0)
- Can be negative

**Example - Modal Layers**:
```css
.page-content {
  position: relative;
  z-index: 1;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
}

.modal-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 40px;
  border-radius: 8px;
  z-index: 1001;  /* Above overlay */
}
```

## Stacking Context

New stacking context is created by:
- Root element (`<html>`)
- `position: absolute/relative/fixed/sticky` with `z-index` other than auto
- `position: fixed/sticky` (even without z-index)
- Elements with `opacity` < 1
- `transform`, `filter`, etc.

**Important**: Children can''t escape parent''s stacking context!

```css
.parent {
  position: relative;
  z-index: 1;
}

.child {
  position: absolute;
  z-index: 9999;  /* Can''t go above elements with z-index: 2+ outside parent */
}
```

## Practical Patterns

### Overlay Pattern

```css
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
}
```

### Tooltip

```css
.tooltip-container {
  position: relative;
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 12px;
  background: #333;
  color: white;
  border-radius: 4px;
  white-space: nowrap;
  margin-bottom: 8px;
}

.tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: #333;
}
```

### Centered Modal

```css
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 600px;
  background: white;
  padding: 40px;
  border-radius: 8px;
  z-index: 1001;
}
```

### Floating Notification

```css
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 9999;
}
```

## Best Practices

✓ **Use relative positioning** to create positioning context
✓ **Avoid excessive z-index values** - use a system (1-10, 100-200, 1000+)
✓ **Fixed headers need body padding** to prevent content hiding
✓ **Sticky needs a scroll container**
✓ **Remember stacking context** - children can''t escape
✓ **Use transform for centering** positioned elements

## Common Z-Index Scale

```css
/* Suggested z-index scale */
.content { z-index: 1; }
.dropdown { z-index: 100; }
.sticky-header { z-index: 200; }
.modal-overlay { z-index: 1000; }
.modal-content { z-index: 1001; }
.toast-notifications { z-index: 2000; }
.tooltips { z-index: 3000; }
```

## Key Takeaways

✓ **static**: Default, follows normal flow
✓ **relative**: Offset from original position, keeps space
✓ **absolute**: Removed from flow, relative to positioned ancestor
✓ **fixed**: Removed from flow, relative to viewport, stays on scroll
✓ **sticky**: Relative until threshold, then fixed
✓ **z-index**: Controls stacking order (only on positioned elements)
✓ Understand stacking contexts to avoid z-index battles

You''ve mastered CSS positioning!',
  35,
  15,
  ARRAY[
    'Understand different CSS position values',
    'Use absolute positioning relative to positioned ancestors',
    'Control layering with z-index',
    'Create fixed headers and sticky elements'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/CSS/position", "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 16: Responsive Design and Media Queries
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
  'd6e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a',
  'e7f9a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b',
  'Responsive Design and Media Queries',
  'Create responsive layouts that adapt to any screen size.',
  'quiz',
  '# Responsive Design and Media Queries

## What is Responsive Design?

**Responsive design** ensures websites look great on all devices - desktops, tablets, and phones.

## Mobile-First Approach

Start with mobile styles, then enhance for larger screens:

```css
/* Mobile styles (default) */
.container {
  padding: 15px;
  font-size: 14px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: 30px;
    font-size: 16px;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    padding: 40px;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

## Media Query Syntax

```css
@media media-type and (condition) {
  /* Styles */
}
```

### Common Media Types

```css
@media screen { /* Computer screens, tablets, phones */ }
@media print { /* Printers */ }
@media all { /* All devices (default) */ }
```

## Breakpoints

Standard screen sizes:

```css
/* Mobile (default) */
/* 0px - 767px */

/* Tablet */
@media (min-width: 768px) { }

/* Desktop */
@media (min-width: 1024px) { }

/* Large Desktop */
@media (min-width: 1280px) { }

/* Extra Large */
@media (min-width: 1536px) { }
```

## Width Queries

### Min-Width (Mobile-First)

```css
/* Mobile first - styles apply to all sizes by default */
.nav {
  flex-direction: column;
}

/* 768px and larger */
@media (min-width: 768px) {
  .nav {
    flex-direction: row;
  }
}
```

### Max-Width (Desktop-First)

```css
/* Desktop first */
.nav {
  flex-direction: row;
}

/* 767px and smaller */
@media (max-width: 767px) {
  .nav {
    flex-direction: column;
  }
}
```

### Range Queries

```css
/* Between 768px and 1023px */
@media (min-width: 768px) and (max-width: 1023px) {
  .container {
    width: 750px;
  }
}
```

## Responsive Typography

```css
html {
  font-size: 14px;
}

@media (min-width: 768px) {
  html {
    font-size: 16px;
  }
}

@media (min-width: 1024px) {
  html {
    font-size: 18px;
  }
}

/* Everything using rem scales automatically! */
h1 {
  font-size: 2rem;  /* 28px, 32px, or 36px based on screen */
}
```

## Responsive Grid

```css
.grid {
  display: grid;
  grid-template-columns: 1fr;  /* 1 column mobile */
  gap: 20px;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);  /* 2 columns tablet */
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);  /* 3 columns desktop */
  }
}
```

## Responsive Navigation

```css
/* Mobile - hamburger menu */
.nav {
  display: none;
}

.nav.open {
  display: flex;
  flex-direction: column;
}

.hamburger {
  display: block;
}

/* Desktop - horizontal nav */
@media (min-width: 768px) {
  .nav {
    display: flex;
    flex-direction: row;
  }

  .hamburger {
    display: none;
  }
}
```

## Viewport Units for Responsive Design

```css
.hero {
  height: 100vh;  /* Full viewport height */
  padding: 5vw;   /* 5% of viewport width */
}

h1 {
  font-size: clamp(1.5rem, 5vw, 3rem);
  /* Min 1.5rem, ideal 5vw, max 3rem */
}
```

## Responsive Images

```css
img {
  max-width: 100%;
  height: auto;
}

/* Art direction with picture element */
```

```html
<picture>
  <source media="(min-width: 1024px)" srcset="large.jpg">
  <source media="(min-width: 768px)" srcset="medium.jpg">
  <img src="small.jpg" alt="Responsive image">
</picture>
```

## Container Queries (Modern)

```css
.card-container {
  container-type: inline-size;
}

@container (min-width: 500px) {
  .card {
    display: flex;
  }
}
```

## Complete Responsive Example

```css
/* Mobile First Base */
body {
  font-size: 16px;
  padding: 15px;
}

.container {
  max-width: 100%;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.nav {
  flex-direction: column;
}

/* Tablet */
@media (min-width: 768px) {
  body {
    padding: 30px;
  }

  .container {
    max-width: 750px;
    margin: 0 auto;
  }

  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }

  .nav {
    flex-direction: row;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
  }

  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## Best Practices

✓ **Mobile-first approach** - easier to enhance than strip down
✓ **Use relative units** (rem, %, vw/vh) instead of fixed pixels
✓ **Test on real devices** - emulators aren''t perfect
✓ **Limit breakpoints** - 3-4 breakpoints usually enough
✓ **Content-based breakpoints** - break when content needs it
✓ **Use Flexbox/Grid** - naturally responsive
✓ **Responsive images** - use max-width: 100%

## Key Takeaways

✓ **Mobile-first**: Start small, enhance for larger screens
✓ **@media (min-width)**: Most common query
✓ **Standard breakpoints**: 768px (tablet), 1024px (desktop)
✓ **Use rem units**: Scales with base font-size
✓ **Flexible layouts**: Flexbox and Grid adapt naturally
✓ **Responsive images**: max-width: 100%, height: auto
✓ Test on multiple devices

You''re ready to build responsive sites!',
  45,
  16,
  ARRAY[
    'Write media queries for different screen sizes',
    'Implement mobile-first responsive design',
    'Create responsive navigation patterns',
    'Use responsive units and flexible layouts'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries", "https://css-tricks.com/a-complete-guide-to-css-media-queries/"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 17: Backgrounds and Visual Effects
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
  'e7f8a9b0-c1d2-3e4f-5a6b-7c8d9e0f1a2b',
  'e7f9a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b',
  'Backgrounds and Visual Effects',
  'Master backgrounds, gradients, shadows, and visual effects.',
  'quiz',
  '# Backgrounds and Visual Effects

## Background Properties

### Background Color

```css
.element {
  background-color: #0ea5e9;
  background-color: rgba(14, 165, 233, 0.5);
}
```

### Background Image

```css
.hero {
  background-image: url(''hero.jpg'');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
```

### Background Shorthand

```css
.element {
  background: #0ea5e9 url(''pattern.png'') repeat-x center;
  /* color image repeat position */
}
```

## Gradients

### Linear Gradient

```css
.box {
  background: linear-gradient(to right, #0ea5e9, #a855f7);
}

/* With angle */
.box {
  background: linear-gradient(45deg, #0ea5e9, #a855f7);
}

/* Multiple colors */
.box {
  background: linear-gradient(to bottom,
    #0ea5e9,
    #a855f7,
    #ec4899
  );
}

/* Color stops */
.box {
  background: linear-gradient(to right,
    #0ea5e9 0%,
    #a855f7 50%,
    #ec4899 100%
  );
}
```

### Radial Gradient

```css
.circle {
  background: radial-gradient(circle, #0ea5e9, #a855f7);
}

.ellipse {
  background: radial-gradient(ellipse, white, #0ea5e9);
}

/* At position */
.box {
  background: radial-gradient(circle at top right, #0ea5e9, #a855f7);
}
```

## Box Shadow

```css
.card {
  /* x y blur spread color */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Multiple shadows */
.card {
  box-shadow:
    0 1px 3px rgba(0,0,0,0.12),
    0 1px 2px rgba(0,0,0,0.24);
}

/* Inset shadow */
.input {
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}
```

## Text Shadow

```css
h1 {
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  /* x y blur color */
}

/* Glow effect */
.glow {
  text-shadow: 0 0 10px #0ea5e9;
}
```

## Border Radius

```css
.card {
  border-radius: 8px;
}

/* Circle */
.avatar {
  border-radius: 50%;
}

/* Individual corners */
.element {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
```

## Opacity and Transparency

```css
.overlay {
  opacity: 0.5;  /* 50% transparent */
}

/* Better for backgrounds */
.overlay {
  background-color: rgba(0, 0, 0, 0.5);
}
```

## Transform

```css
.card:hover {
  transform: scale(1.05);
  transform: rotate(5deg);
  transform: translateY(-5px);
  transform: skew(5deg);
}

/* Multiple transforms */
.card:hover {
  transform: translateY(-5px) scale(1.02);
}
```

## Filter Effects

```css
img {
  filter: grayscale(100%);
  filter: blur(5px);
  filter: brightness(1.2);
  filter: contrast(1.5);
  filter: saturate(2);
  filter: sepia(100%);
}

/* Multiple filters */
img {
  filter: brightness(1.1) contrast(1.2) saturate(1.3);
}
```

## Backdrop Filter

```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

## Blend Modes

```css
.overlay {
  background: #0ea5e9;
  mix-blend-mode: multiply;
  mix-blend-mode: screen;
  mix-blend-mode: overlay;
}
```

## Practical Examples

### Modern Card

```css
.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.07),
              0 10px 20px rgba(0,0,0,0.03);
  transition: all 0.3s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1),
              0 20px 40px rgba(0,0,0,0.05);
}
```

### Gradient Button

```css
.button {
  background: linear-gradient(135deg, #0ea5e9, #a855f7);
  color: white;
  padding: 12px 32px;
  border-radius: 8px;
  border: none;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
}

.button:hover {
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
  transform: translateY(-2px);
}
```

### Glassmorphism

```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}
```

## Key Takeaways

✓ **Gradients**: linear-gradient(), radial-gradient()
✓ **Shadows**: box-shadow for elements, text-shadow for text
✓ **Border-radius**: rounded corners, 50% for circles
✓ **Transform**: scale, rotate, translate for hover effects
✓ **Filter**: blur, brightness, grayscale for image effects
✓ **Backdrop-filter**: blur background behind element
✓ Combine effects for modern designs

You''ve mastered visual effects!',
  35,
  17,
  ARRAY[
    'Create gradients with linear-gradient and radial-gradient',
    'Apply shadows to elements and text',
    'Use transform for hover effects',
    'Apply filters and backdrop-filter'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/CSS/gradient", "https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Lesson 18: CSS Transitions and Animations
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
  'f8a9b0c1-d2e3-4f5a-6b7c-8d9e0f1a2b3c',
  'e7f9a1b2-c3d4-5e6f-7a8b-9c0d1e2f3a4b',
  'CSS Transitions and Animations',
  'Bring your designs to life with smooth transitions and animations.',
  'quiz',
  '# CSS Transitions and Animations

## CSS Transitions

Smoothly animate property changes:

### Basic Transition

```css
.button {
  background-color: #0ea5e9;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #0284c7;
}
```

### Transition Properties

```css
.element {
  transition-property: background-color;  /* What to animate */
  transition-duration: 0.3s;              /* How long */
  transition-timing-function: ease;       /* Speed curve */
  transition-delay: 0.1s;                 /* Wait before start */
}
```

### Transition Shorthand

```css
.element {
  /* property duration timing-function delay */
  transition: background-color 0.3s ease 0.1s;
}

/* Multiple properties */
.element {
  transition:
    background-color 0.3s ease,
    transform 0.2s ease,
    box-shadow 0.3s ease;
}

/* All properties */
.element {
  transition: all 0.3s ease;
}
```

### Timing Functions

```css
transition-timing-function: ease;         /* Slow start, fast, slow end (default) */
transition-timing-function: linear;       /* Constant speed */
transition-timing-function: ease-in;      /* Slow start */
transition-timing-function: ease-out;     /* Slow end */
transition-timing-function: ease-in-out;  /* Slow start and end */

/* Custom cubic-bezier */
transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

## CSS Animations

Complex animations with keyframes:

### Define Keyframes

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Or with percentages */
@keyframes slideIn {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
```

### Apply Animation

```css
.element {
  animation-name: fadeIn;
  animation-duration: 1s;
  animation-timing-function: ease;
  animation-delay: 0.5s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: forwards;
}
```

### Animation Shorthand

```css
.element {
  /* name duration timing-function delay iteration-count direction fill-mode */
  animation: fadeIn 1s ease 0.5s 1 normal forwards;
}
```

### Animation Properties

```css
animation-iteration-count: 3;        /* Run 3 times */
animation-iteration-count: infinite; /* Loop forever */

animation-direction: normal;         /* Start to end */
animation-direction: reverse;        /* End to start */
animation-direction: alternate;      /* Forward then backward */

animation-fill-mode: forwards;       /* Keep final state */
animation-fill-mode: backwards;      /* Start from first keyframe */
animation-fill-mode: both;           /* Both */

animation-play-state: running;       /* Play */
animation-play-state: paused;        /* Pause */
```

## Practical Examples

### Button Hover

```css
.button {
  background: #0ea5e9;
  transform: scale(1);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
}

.button:hover {
  background: #0284c7;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.button:active {
  transform: scale(0.98);
}
```

### Loading Spinner

```css
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0ea5e9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

### Pulse Animation

```css
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.notification-badge {
  animation: pulse 2s ease-in-out infinite;
}
```

### Fade In

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: fadeIn 0.6s ease;
}
```

### Slide In

```css
@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.sidebar {
  animation: slideInLeft 0.4s ease;
}
```

### Bounce

```css
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

.icon {
  animation: bounce 1s ease infinite;
}
```

## Performance Tips

✓ **Animate transform and opacity** - GPU accelerated
❌ **Avoid animating width/height** - causes reflow
✓ **Use will-change** for complex animations:

```css
.animated {
  will-change: transform, opacity;
}
```

✓ **Use requestAnimationFrame** for JS animations
✓ **Keep animations under 1 second** for UI
✓ **Use prefers-reduced-motion**:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Best Practices

✓ **Subtle is better** - don''t overanimate
✓ **Match brand personality** - playful vs professional
✓ **Use easing** - makes animations feel natural
✓ **Provide feedback** - button clicks, form submissions
✓ **Performance first** - animate transform/opacity
✓ **Respect accessibility** - honor reduced-motion
✓ **Test on devices** - ensure smooth performance

## Key Takeaways

✓ **Transitions**: Smooth property changes (hover, focus)
✓ **Animations**: Complex multi-step animations with @keyframes
✓ **Timing functions**: Control animation speed curve
✓ **Transform & opacity**: Best properties for performance
✓ **Infinite animations**: Use for loading states
✓ **prefers-reduced-motion**: Respect user preferences
✓ Keep animations short and purposeful

Congratulations! You''ve completed the HTML & CSS Fundamentals course!',
  40,
  18,
  ARRAY[
    'Create smooth transitions for interactive elements',
    'Build complex animations with @keyframes',
    'Understand animation timing and easing',
    'Follow performance and accessibility best practices'
  ],
  '{"external_links": ["https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions", "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations"]}'::jsonb
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

-- Quiz for Lesson 4: HTML Forms and Input Types
INSERT INTO html_css_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, order_index, difficulty) VALUES
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'What is the correct method to use for submitting sensitive data like passwords?', 'multiple_choice',
 '{"A": "GET", "B": "POST", "C": "PUT", "D": "SUBMIT"}',
 'B',
 'POST method should be used for sensitive data because it hides the data from the URL. GET shows data in the URL which is visible in browser history and logs.',
 1, 'easy'),

('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Which input type automatically validates email addresses?', 'multiple_choice',
 '{"A": "type=\"text\"", "B": "type=\"email\"", "C": "type=\"mail\"", "D": "type=\"validate-email\""}',
 'B',
 'The type="email" input automatically validates that the entered value is a valid email format before form submission.',
 2, 'easy'),

('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Radio buttons with the same name attribute allow multiple selections.', 'true_false',
 '{"true": "True", "false": "False"}',
 'false',
 'False! Radio buttons with the same name attribute allow only ONE selection. Use checkboxes for multiple selections.',
 3, 'medium'),

('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Which attribute makes a form field mandatory?', 'multiple_choice',
 '{"A": "mandatory", "B": "required", "C": "must-fill", "D": "validate"}',
 'B',
 'The required attribute makes a form field mandatory. The browser will prevent form submission if required fields are empty.',
 4, 'easy'),

('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'What is the purpose of the label element in forms?', 'multiple_choice',
 '{"A": "To style the form", "B": "To validate input", "C": "To associate text with an input field for accessibility", "D": "To submit the form"}',
 'C',
 'The <label> element associates descriptive text with an input field, improving accessibility for screen readers and allowing users to click the label to focus the input.',
 5, 'medium');

-- Quiz for Lesson 5: Tables and Data Presentation
INSERT INTO html_css_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, order_index, difficulty) VALUES
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Which element creates a table row?', 'multiple_choice',
 '{"A": "<row>", "B": "<tr>", "C": "<table-row>", "D": "<trow>"}',
 'B',
 'The <tr> (table row) element creates a row in an HTML table. It contains <th> (table header) or <td> (table data) cells.',
 1, 'easy'),

('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'What attribute makes a table cell span multiple columns?', 'multiple_choice',
 '{"A": "span-columns", "B": "colspan", "C": "column-span", "D": "merge-columns"}',
 'B',
 'The colspan attribute makes a cell span multiple columns. Example: <td colspan="3"> spans 3 columns.',
 2, 'medium'),

('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Tables should be used for page layout and positioning elements.', 'true_false',
 '{"true": "True", "false": "False"}',
 'false',
 'False! Tables should only be used for tabular data, NOT for page layout. Use CSS Flexbox or Grid for layouts.',
 3, 'medium'),

('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Which element provides a title or description for a table?', 'multiple_choice',
 '{"A": "<title>", "B": "<caption>", "C": "<table-title>", "D": "<heading>"}',
 'B',
 'The <caption> element provides a title or description for a table and should be placed immediately after the opening <table> tag.',
 4, 'easy'),

('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'What is the purpose of <thead>, <tbody>, and <tfoot>?', 'multiple_choice',
 '{"A": "To add colors to tables", "B": "To organize table content into logical sections", "C": "To make tables responsive", "D": "To add borders"}',
 'B',
 'These elements organize table content into logical sections: <thead> for headers, <tbody> for main content, and <tfoot> for footers. This improves semantics and makes styling easier.',
 5, 'medium');

-- Quiz for Lesson 6: Semantic HTML5 Elements
INSERT INTO html_css_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, order_index, difficulty) VALUES
('f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c', 'Which element represents the main content of a document?', 'multiple_choice',
 '{"A": "<content>", "B": "<main>", "C": "<primary>", "D": "<body>"}',
 'B',
 'The <main> element represents the primary content of a document. There should be only ONE <main> element per page.',
 1, 'easy'),

('f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c', 'You can have multiple <main> elements on a single page.', 'true_false',
 '{"true": "True", "false": "False"}',
 'false',
 'False! There should be only ONE <main> element per page. It represents the dominant content, excluding repeated content like headers, footers, and sidebars.',
 2, 'medium'),

('f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c', 'Which element is used for self-contained, independent content?', 'multiple_choice',
 '{"A": "<section>", "B": "<div>", "C": "<article>", "D": "<content>"}',
 'C',
 'The <article> element represents self-contained, independent content that could stand alone, like blog posts, news articles, or forum posts.',
 3, 'medium'),

('f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c', 'What is the main benefit of using semantic HTML?', 'multiple_choice',
 '{"A": "Faster page loading", "B": "Better SEO and accessibility", "C": "Smaller file sizes", "D": "More color options"}',
 'B',
 'Semantic HTML improves SEO (search engines understand content better) and accessibility (screen readers can navigate more easily). It also makes code more readable.',
 4, 'easy'),

('f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c', 'Which element represents tangentially related content?', 'multiple_choice',
 '{"A": "<sidebar>", "B": "<aside>", "C": "<related>", "D": "<secondary>"}',
 'B',
 'The <aside> element represents content that is tangentially related to the main content, like sidebars, pull quotes, or related links.',
 5, 'hard');

-- Quiz for Lesson 7: Images and Media Elements
INSERT INTO html_css_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, order_index, difficulty) VALUES
('a7b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d', 'Which attribute is required for the <img> tag?', 'multiple_choice',
 '{"A": "src and alt", "B": "src only", "C": "alt only", "D": "width and height"}',
 'A',
 'Both src (source of the image) and alt (alternative text description) are required attributes for accessibility and proper functionality.',
 1, 'easy'),

('a7b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d', 'What is the purpose of the alt attribute in images?', 'multiple_choice',
 '{"A": "To add a border", "B": "To provide alternative text for accessibility and SEO", "C": "To resize the image", "D": "To add a caption"}',
 'B',
 'The alt attribute provides alternative text that describes the image for screen readers and appears if the image fails to load. It''s crucial for accessibility and SEO.',
 2, 'easy'),

('a7b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d', 'The loading="lazy" attribute improves performance by loading images only when needed.', 'true_false',
 '{"true": "True", "false": "False"}',
 'true',
 'True! The loading="lazy" attribute defers loading images until they''re near the viewport, improving initial page load performance.',
 3, 'medium'),

('a7b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d', 'Which HTML5 element embeds video content?', 'multiple_choice',
 '{"A": "<movie>", "B": "<video>", "C": "<media>", "D": "<film>"}',
 'B',
 'The <video> element embeds video content natively in HTML5. It supports multiple source formats and includes controls for playback.',
 4, 'easy'),

('a7b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d', 'Which combination provides an image with a caption semantically?', 'multiple_choice',
 '{"A": "<div> and <p>", "B": "<img> and <caption>", "C": "<figure> and <figcaption>", "D": "<picture> and <title>"}',
 'C',
 'The <figure> and <figcaption> elements semantically group an image with its caption, improving accessibility and SEO.',
 5, 'medium');

-- Quiz for Lesson 8: HTML Attributes and Metadata
INSERT INTO html_css_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, order_index, difficulty) VALUES
('b8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e', 'What is the difference between id and class attributes?', 'multiple_choice',
 '{"A": "No difference", "B": "id must be unique, class can be reused", "C": "class must be unique, id can be reused", "D": "id is for JavaScript, class is for CSS"}',
 'B',
 'The id attribute must be unique on a page (use once), while class can be reused on multiple elements. Both can be used with CSS and JavaScript.',
 1, 'medium'),

('b8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e', 'Data attributes in HTML5 must start with which prefix?', 'multiple_choice',
 '{"A": "data-", "B": "custom-", "C": "attr-", "D": "x-"}',
 'A',
 'Data attributes must start with "data-" prefix. Example: data-user-id="123". They''re used to store custom data on HTML elements.',
 2, 'easy'),

('b8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e', 'The viewport meta tag is essential for responsive design.', 'true_false',
 '{"true": "True", "false": "False"}',
 'true',
 'True! The viewport meta tag (<meta name="viewport" content="width=device-width, initial-scale=1.0">) is essential for responsive design on mobile devices.',
 3, 'easy'),

('b8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e', 'Which meta tag controls how your page appears when shared on social media?', 'multiple_choice',
 '{"A": "Social meta tags", "B": "Open Graph tags", "C": "Share tags", "D": "Media tags"}',
 'B',
 'Open Graph tags (og:title, og:description, og:image) control how your page appears when shared on Facebook, LinkedIn, and other social platforms.',
 4, 'hard'),

('b8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e', 'What does the charset meta tag specify?', 'multiple_choice',
 '{"A": "The page language", "B": "The character encoding", "C": "The page title", "D": "The page author"}',
 'B',
 'The charset meta tag (usually <meta charset="UTF-8">) specifies the character encoding, ensuring special characters display correctly.',
 5, 'easy');

-- Quiz for Lesson 9: CSS Selectors and Specificity
INSERT INTO html_css_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, order_index, difficulty) VALUES
('c9d0e1f2-a3b4-5c6d-7e8f-9a0b1c2d3e4f', 'Which selector has the highest specificity?', 'multiple_choice',
 '{"A": "Element selector", "B": "Class selector", "C": "ID selector", "D": "Universal selector"}',
 'C',
 'ID selectors have the highest specificity (after inline styles), followed by class selectors, then element selectors. Universal selector (*) has the lowest.',
 1, 'medium'),

('c9d0e1f2-a3b4-5c6d-7e8f-9a0b1c2d3e4f', 'What does the > combinator select?', 'multiple_choice',
 '{"A": "All descendants", "B": "Direct children only", "C": "Adjacent siblings", "D": "General siblings"}',
 'B',
 'The > (child combinator) selects direct children only. Example: ul > li selects only <li> elements that are direct children of <ul>.',
 2, 'medium'),

('c9d0e1f2-a3b4-5c6d-7e8f-9a0b1c2d3e4f', 'Pseudo-elements use a double colon (::) while pseudo-classes use a single colon (:).', 'true_false',
 '{"true": "True", "false": "False"}',
 'true',
 'True! Pseudo-elements like ::before and ::after use double colons, while pseudo-classes like :hover and :focus use single colons.',
 3, 'medium'),

('c9d0e1f2-a3b4-5c6d-7e8f-9a0b1c2d3e4f', 'Which pseudo-class selects every other row in a list?', 'multiple_choice',
 '{"A": ":every-other", "B": ":alternate", "C": ":nth-child(odd)", "D": ":second-child"}',
 'C',
 'The :nth-child(odd) pseudo-class selects every odd-numbered child element. You can also use :nth-child(even) for even elements.',
 4, 'hard'),

('c9d0e1f2-a3b4-5c6d-7e8f-9a0b1c2d3e4f', 'What should you avoid using for maintainable CSS?', 'multiple_choice',
 '{"A": "Class selectors", "B": "!important", "C": "Pseudo-classes", "D": "Element selectors"}',
 'B',
 'Avoid using !important as it makes CSS hard to maintain and override. Use proper specificity instead.',
 5, 'easy');

-- Quiz for Lesson 10: The CSS Box Model
INSERT INTO html_css_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, order_index, difficulty) VALUES
('d0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a', 'What are the four parts of the CSS Box Model?', 'multiple_choice',
 '{"A": "Content, style, border, outline", "B": "Content, padding, border, margin", "C": "Width, height, padding, margin", "D": "Content, spacing, edge, outer"}',
 'B',
 'The CSS Box Model consists of four layers: Content (innermost), Padding, Border, and Margin (outermost).',
 1, 'easy'),

('d0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a', 'What does box-sizing: border-box do?', 'multiple_choice',
 '{"A": "Adds border to width", "B": "Includes padding and border in the width", "C": "Removes the border", "D": "Only affects borders"}',
 'B',
 'box-sizing: border-box includes padding and border in the element''s width/height, making sizing more intuitive and predictable.',
 2, 'medium'),

('d0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a', 'Vertical margins between adjacent elements collapse to the larger margin value.', 'true_false',
 '{"true": "True", "false": "False"}',
 'true',
 'True! This is called margin collapse. If one element has margin-bottom: 30px and the next has margin-top: 20px, the gap is 30px (not 50px).',
 3, 'hard'),

('d0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a', 'How do you center a block element horizontally?', 'multiple_choice',
 '{"A": "text-align: center", "B": "margin: 0 auto", "C": "padding: 0 auto", "D": "align: center"}',
 'B',
 'margin: 0 auto centers a block element horizontally if it has a defined width. The auto value distributes remaining space equally.',
 4, 'medium'),

('d0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a', 'What is the difference between padding and margin?', 'multiple_choice',
 '{"A": "No difference", "B": "Padding is inside, margin is outside", "C": "Padding is outside, margin is inside", "D": "Padding is for text only"}',
 'B',
 'Padding is internal spacing (between content and border), while margin is external spacing (between elements). Backgrounds extend through padding but not margin.',
 5, 'easy');

-- Quiz for Lesson 11: Colors, Units, and Typography
INSERT INTO html_css_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, order_index, difficulty) VALUES
('e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b', 'Which CSS unit is best for responsive, scalable design?', 'multiple_choice',
 '{"A": "px", "B": "pt", "C": "rem", "D": "cm"}',
 'C',
 'rem (root em) units are best for responsive design because they scale relative to the root font size, making everything proportional.',
 1, 'medium'),

('e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b', 'What is the difference between em and rem units?', 'multiple_choice',
 '{"A": "No difference", "B": "em is relative to parent, rem is relative to root", "C": "em is for fonts, rem is for spacing", "D": "rem is older, em is newer"}',
 'B',
 'em is relative to the parent element''s font size (compounds with nesting), while rem is always relative to the root <html> font size (predictable).',
 2, 'hard'),

('e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b', 'The font-weight value of 400 is equivalent to "normal".', 'true_false',
 '{"true": "True", "false": "False"}',
 'true',
 'True! font-weight: 400 is the same as font-weight: normal. Similarly, 700 equals bold.',
 3, 'easy'),

('e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b', 'Which color format includes transparency?', 'multiple_choice',
 '{"A": "Hex", "B": "RGB", "C": "RGBA", "D": "HSL"}',
 'C',
 'RGBA (Red, Green, Blue, Alpha) includes an alpha channel for transparency. Example: rgba(14, 165, 233, 0.5) is 50% transparent.',
 4, 'easy'),

('e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b', 'What is a recommended line-height for body text readability?', 'multiple_choice',
 '{"A": "1.0", "B": "1.2", "C": "1.5-1.7", "D": "2.0"}',
 'C',
 'A line-height of 1.5-1.7 is recommended for body text to ensure comfortable reading. Too tight (< 1.3) or too loose (> 2.0) reduces readability.',
 5, 'medium');

-- Quiz for Lesson 12: Flexbox Layout Fundamentals
INSERT INTO html_css_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, order_index, difficulty) VALUES
('f2a3b4c5-d6e7-8f9a-0b1c-2d3e4f5a6b7c', 'What property makes an element a flex container?', 'multiple_choice',
 '{"A": "flex: 1", "B": "display: flex", "C": "flex-container: true", "D": "flexbox: on"}',
 'B',
 'display: flex makes an element a flex container, and its direct children automatically become flex items.',
 1, 'easy'),

('f2a3b4c5-d6e7-8f9a-0b1c-2d3e4f5a6b7c', 'Which property aligns items along the main axis in Flexbox?', 'multiple_choice',
 '{"A": "align-items", "B": "justify-content", "C": "flex-align", "D": "main-align"}',
 'B',
 'justify-content aligns items along the main axis (horizontal if flex-direction: row, vertical if flex-direction: column).',
 2, 'medium'),

('f2a3b4c5-d6e7-8f9a-0b1c-2d3e4f5a6b7c', 'The gap property is better than using margins for spacing flex items.', 'true_false',
 '{"true": "True", "false": "False"}',
 'true',
 'True! The gap property is cleaner and more maintainable than using margins, as it only adds space between items (not on outer edges).',
 3, 'medium'),

('f2a3b4c5-d6e7-8f9a-0b1c-2d3e4f5a6b7c', 'How do you perfectly center content both horizontally and vertically with Flexbox?', 'multiple_choice',
 '{"A": "text-align: center; vertical-align: middle", "B": "justify-content: center; align-items: center", "C": "flex-center: true", "D": "center: both"}',
 'B',
 'justify-content: center (horizontal) and align-items: center (vertical) together perfectly center content in a flex container.',
 4, 'easy'),

('f2a3b4c5-d6e7-8f9a-0b1c-2d3e4f5a6b7c', 'What does flex-wrap: wrap do?', 'multiple_choice',
 '{"A": "Wraps text inside items", "B": "Allows items to wrap to next line when needed", "C": "Makes items smaller", "D": "Adds borders"}',
 'B',
 'flex-wrap: wrap allows flex items to wrap onto multiple lines when they don''t fit in a single line, creating responsive layouts.',
 5, 'medium');

-- Quiz for Lesson 13: Flexbox Advanced Techniques
INSERT INTO html_css_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, order_index, difficulty) VALUES
('a3b4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d', 'What does flex: 1 mean?', 'multiple_choice',
 '{"A": "1px width", "B": "flex-grow: 1, flex-shrink: 1, flex-basis: 0", "C": "The first item", "D": "Order number 1"}',
 'B',
 'flex: 1 is shorthand for flex-grow: 1, flex-shrink: 1, flex-basis: 0. It means the item will grow to fill available space equally with other flex: 1 items.',
 1, 'hard'),

('a3b4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d', 'What does flex-grow control?', 'multiple_choice',
 '{"A": "How much an item shrinks", "B": "How much an item grows to fill space", "C": "The item order", "D": "The item''s initial size"}',
 'B',
 'flex-grow controls how much an item grows relative to other flex items when there''s extra space available. Default is 0 (don''t grow).',
 2, 'medium'),

('a3b4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d', 'The order property changes the HTML source order of elements.', 'true_false',
 '{"true": "True", "false": "False"}',
 'false',
 'False! The order property only changes the VISUAL order of elements, not the source order in HTML. This is important for accessibility.',
 3, 'hard'),

('a3b4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d', 'How do you prevent a flex item from shrinking?', 'multiple_choice',
 '{"A": "flex-shrink: 0", "B": "no-shrink: true", "C": "flex-grow: 0", "D": "flex-basis: fixed"}',
 'A',
 'flex-shrink: 0 prevents a flex item from shrinking below its natural size, even when space is tight.',
 4, 'medium'),

('a3b4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d', 'What does margin-left: auto do in a flex container?', 'multiple_choice',
 '{"A": "Nothing special", "B": "Centers the item", "C": "Pushes the item to the right", "D": "Adds automatic spacing"}',
 'C',
 'margin-left: auto pushes a flex item to the right by consuming all available space on the left. It''s a useful trick for layouts.',
 5, 'hard');

-- Quiz for Lesson 14: CSS Grid Layout
INSERT INTO html_css_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, order_index, difficulty) VALUES
('b4c5d6e7-f8a9-0b1c-2d3e-4f5a6b7c8d9e', 'When should you use CSS Grid instead of Flexbox?', 'multiple_choice',
 '{"A": "Never, Flexbox is always better", "B": "For two-dimensional layouts (rows AND columns)", "C": "Only for tables", "D": "When you need colors"}',
 'B',
 'Use Grid for two-dimensional layouts where you need to control both rows and columns. Use Flexbox for one-dimensional layouts (row OR column).',
 1, 'medium'),

('b4c5d6e7-f8a9-0b1c-2d3e-4f5a6b7c8d9e', 'What does the fr unit stand for in CSS Grid?', 'multiple_choice',
 '{"A": "Frame", "B": "Fraction", "C": "Fixed ratio", "D": "Free"}',
 'B',
 'fr stands for "fraction" and represents a fraction of the available space in the grid container. 1fr = one part of the available space.',
 2, 'easy'),

('b4c5d6e7-f8a9-0b1c-2d3e-4f5a6b7c8d9e', 'Grid-column: span 2 makes an item span 2 columns.', 'true_false',
 '{"true": "True", "false": "False"}',
 'true',
 'True! grid-column: span 2 makes a grid item span across 2 columns, taking up more horizontal space.',
 3, 'easy'),

('b4c5d6e7-f8a9-0b1c-2d3e-4f5a6b7c8d9e', 'Which combination creates a responsive grid without media queries?', 'multiple_choice',
 '{"A": "repeat(3, 1fr)", "B": "repeat(auto-fit, minmax(250px, 1fr))", "C": "grid-template-columns: 3", "D": "auto-grid: true"}',
 'B',
 'repeat(auto-fit, minmax(250px, 1fr)) creates a responsive grid that automatically adjusts columns based on available space, with each column at least 250px.',
 4, 'hard'),

('b4c5d6e7-f8a9-0b1c-2d3e-4f5a6b7c8d9e', 'What is the purpose of grid-template-areas?', 'multiple_choice',
 '{"A": "To add borders", "B": "To name and arrange grid areas visually", "C": "To set column widths", "D": "To add spacing"}',
 'B',
 'grid-template-areas allows you to name and visually arrange grid areas using ASCII art-like syntax, making layouts very intuitive to understand.',
 5, 'medium');

-- Quiz for Lesson 15: Positioning and Z-Index
INSERT INTO html_css_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, order_index, difficulty) VALUES
('c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', 'Which position value removes an element from document flow?', 'multiple_choice',
 '{"A": "static", "B": "relative", "C": "absolute", "D": "normal"}',
 'C',
 'position: absolute (and fixed) remove an element from the document flow. Relative keeps the element in flow but offset from its position.',
 1, 'medium'),

('c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', 'Position: fixed elements stay in place when scrolling.', 'true_false',
 '{"true": "True", "false": "False"}',
 'true',
 'True! position: fixed elements are positioned relative to the viewport and stay in place when scrolling, perfect for fixed headers.',
 2, 'easy'),

('c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', 'Z-index works on elements with which position values?', 'multiple_choice',
 '{"A": "All elements", "B": "Only absolute", "C": "Positioned elements (not static)", "D": "Only fixed"}',
 'C',
 'z-index only works on positioned elements (relative, absolute, fixed, sticky), not on static (default) elements.',
 3, 'hard'),

('c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', 'What does position: sticky do?', 'multiple_choice',
 '{"A": "Makes elements stick together", "B": "Glues elements to the page", "C": "Acts relative until scroll threshold, then fixed", "D": "Same as position: fixed"}',
 'C',
 'position: sticky is a hybrid that acts like position: relative until you scroll past a threshold, then it acts like position: fixed.',
 4, 'hard'),

('c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', 'Absolute positioned elements are positioned relative to what?', 'multiple_choice',
 '{"A": "The viewport", "B": "The body element", "C": "The nearest positioned ancestor", "D": "The parent element"}',
 'C',
 'Absolute positioned elements are positioned relative to the nearest positioned ancestor (not static). If none exists, they use the document body.',
 5, 'medium');

-- Quiz for Lesson 16: Responsive Design and Media Queries
INSERT INTO html_css_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, order_index, difficulty) VALUES
('d6e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'What is the mobile-first approach?', 'multiple_choice',
 '{"A": "Design for mobile after desktop", "B": "Start with mobile styles, enhance for larger screens", "C": "Only design for mobile", "D": "Mobile users are most important"}',
 'B',
 'Mobile-first means starting with mobile styles as the default, then using min-width media queries to enhance the design for larger screens.',
 1, 'easy'),

('d6e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'Which media query applies styles for screens 768px and wider?', 'multiple_choice',
 '{"A": "@media (width: 768px)", "B": "@media (min-width: 768px)", "C": "@media (max-width: 768px)", "D": "@media screen-size: 768px"}',
 'B',
 '@media (min-width: 768px) applies styles to screens 768px and wider. This is common for tablet and desktop styles in mobile-first design.',
 2, 'medium'),

('d6e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'The viewport meta tag is required for responsive design to work properly on mobile.', 'true_false',
 '{"true": "True", "false": "False"}',
 'true',
 'True! <meta name="viewport" content="width=device-width, initial-scale=1.0"> is essential for responsive design to work correctly on mobile devices.',
 3, 'easy'),

('d6e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'What are common breakpoints for responsive design?', 'multiple_choice',
 '{"A": "100px, 200px, 300px", "B": "768px (tablet), 1024px (desktop)", "C": "500px, 1000px, 1500px", "D": "No standard breakpoints"}',
 'B',
 'Common breakpoints are 768px for tablets and 1024px for desktops, though content-based breakpoints (breaking when content needs it) are best.',
 4, 'medium'),

('d6e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'How do you make images responsive?', 'multiple_choice',
 '{"A": "width: 100%", "B": "max-width: 100%; height: auto", "C": "responsive: true", "D": "auto-resize: on"}',
 'B',
 'max-width: 100% and height: auto make images scale down to fit their container while maintaining aspect ratio, making them responsive.',
 5, 'easy');

-- Quiz for Lesson 17: Backgrounds and Visual Effects
INSERT INTO html_css_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, order_index, difficulty) VALUES
('e7f8a9b0-c1d2-3e4f-5a6b-7c8d9e0f1a2b', 'Which CSS property creates gradients?', 'multiple_choice',
 '{"A": "gradient", "B": "background: linear-gradient() or radial-gradient()", "C": "color-gradient", "D": "background-gradient"}',
 'B',
 'Gradients are created using background: linear-gradient() for straight gradients or background: radial-gradient() for circular gradients.',
 1, 'easy'),

('e7f8a9b0-c1d2-3e4f-5a6b-7c8d9e0f1a2b', 'Box-shadow syntax follows which order?', 'multiple_choice',
 '{"A": "color blur spread x y", "B": "x y blur spread color", "C": "blur x y color spread", "D": "x y color blur spread"}',
 'B',
 'box-shadow syntax is: x-offset y-offset blur spread color. Example: box-shadow: 0 4px 6px rgba(0,0,0,0.1).',
 2, 'hard'),

('e7f8a9b0-c1d2-3e4f-5a6b-7c8d9e0f1a2b', 'Border-radius: 50% creates a circle from a square element.', 'true_false',
 '{"true": "True", "false": "False"}',
 'true',
 'True! border-radius: 50% creates a perfect circle from a square element (equal width and height). Use this for circular avatars or buttons.',
 3, 'easy'),

('e7f8a9b0-c1d2-3e4f-5a6b-7c8d9e0f1a2b', 'What does backdrop-filter: blur() do?', 'multiple_choice',
 '{"A": "Blurs the element", "B": "Blurs the background behind the element", "C": "Blurs text", "D": "Adds a blurry border"}',
 'B',
 'backdrop-filter: blur() blurs the content BEHIND an element, creating a glassmorphism effect. The element itself remains clear.',
 4, 'medium'),

('e7f8a9b0-c1d2-3e4f-5a6b-7c8d9e0f1a2b', 'Which transform function scales an element?', 'multiple_choice',
 '{"A": "transform: size()", "B": "transform: scale()", "C": "transform: grow()", "D": "transform: resize()"}',
 'B',
 'transform: scale() scales an element. scale(1.1) makes it 110% of original size, perfect for hover effects.',
 5, 'easy');

-- Quiz for Lesson 18: CSS Transitions and Animations
INSERT INTO html_css_quiz_questions (lesson_id, question_text, question_type, options, correct_answer, explanation, order_index, difficulty) VALUES
('f8a9b0c1-d2e3-4f5a-6b7c-8d9e0f1a2b3c', 'What is the difference between transitions and animations?', 'multiple_choice',
 '{"A": "No difference", "B": "Transitions are for simple state changes, animations are for complex keyframe sequences", "C": "Animations are faster", "D": "Transitions are newer"}',
 'B',
 'Transitions smoothly animate property changes between states (like hover). Animations use @keyframes for complex multi-step sequences.',
 1, 'medium'),

('f8a9b0c1-d2e3-4f5a-6b7c-8d9e0f1a2b3c', 'Which properties are best for performance when animating?', 'multiple_choice',
 '{"A": "width and height", "B": "transform and opacity", "C": "margin and padding", "D": "color and background"}',
 'B',
 'transform and opacity are GPU-accelerated and don''t cause reflow, making them the best choices for smooth, performant animations.',
 2, 'hard'),

('f8a9b0c1-d2e3-4f5a-6b7c-8d9e0f1a2b3c', 'Animation-iteration-count: infinite makes an animation loop forever.', 'true_false',
 '{"true": "True", "false": "False"}',
 'true',
 'True! animation-iteration-count: infinite makes an animation loop continuously, perfect for loading spinners or attention-grabbing effects.',
 3, 'easy'),

('f8a9b0c1-d2e3-4f5a-6b7c-8d9e0f1a2b3c', 'What does transition: all 0.3s ease mean?', 'multiple_choice',
 '{"A": "Animate all properties over 0.3 seconds with ease timing", "B": "Make everything easy in 0.3 seconds", "C": "Apply to all elements", "D": "Transition all colors"}',
 'A',
 'transition: all 0.3s ease animates ALL property changes on that element over 0.3 seconds using the ease timing function (slow-fast-slow).',
 4, 'medium'),

('f8a9b0c1-d2e3-4f5a-6b7c-8d9e0f1a2b3c', 'Why should you respect prefers-reduced-motion?', 'multiple_choice',
 '{"A": "It''s a legal requirement", "B": "For accessibility - some users get motion sickness", "C": "It improves performance", "D": "Modern browsers require it"}',
 'B',
 'prefers-reduced-motion respects user preferences for accessibility. Some users experience motion sickness or vestibular disorders and need reduced animations.',
 5, 'medium');

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

  IF path_count = 1 AND lesson_count = 18 AND question_count = 90 THEN
    RAISE NOTICE 'SUCCESS: All data seeded correctly!';
  ELSE
    RAISE WARNING 'Some data may not have been seeded correctly.';
  END IF;
END $$;
