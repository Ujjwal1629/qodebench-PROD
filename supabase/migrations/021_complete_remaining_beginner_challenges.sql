-- =============================================
-- Migration: Complete Remaining Beginner Challenges (8-10)
-- Description: Add detailed content for final beginner challenges
-- Version: 021
-- =============================================

-- ============================================================================
-- Challenge #8: Debug Props Passing in React
-- ============================================================================

UPDATE challenges
SET
  description = E'## Challenge\n\nYou have a parent component passing data to child components, but the data isn''t showing up correctly!\n\n## Bug Reports\n\n- UserCard component shows "undefined" for user name\n- Age displays as "NaN"\n- Email prop is completely missing\n- Console shows "Cannot read property ''name'' of undefined"\n\n## The Problem\n\nProps are being passed incorrectly, causing undefined values in child components.\n\n## Requirements\n\n1. Fix prop passing from parent to child\n2. Ensure correct prop names are used\n3. Fix object destructuring issues\n4. Make sure all data displays correctly\n\n## Expected Output\n\n```\nUser: Alice Johnson\nAge: 28 years old\nEmail: alice@example.com\n```\n\n## Your Task\n\nFix the prop passing issues in both components below.',

  starter_code = '{"javascript": "// Parent Component\nfunction UserProfile() {\n  const userData = {\n    name: \"Alice Johnson\",\n    age: 28,\n    email: \"alice@example.com\"\n  };\n  \n  // Bug: Passing wrong prop name!\n  return <UserCard user={userData} />;\n}\n\n// Child Component\nfunction UserCard({ userInfo }) {  // Bug: Wrong prop name in destructuring!\n  // Bug: Trying to destructure from undefined\n  const { name, age, email } = userInfo;\n  \n  return (\n    <div>\n      <h2>User: {name}</h2>\n      <p>Age: {age} years old</p>\n      <p>Email: {email}</p>\n    </div>\n  );\n}"}',

  test_cases = '[{
    "type": "ai_validation",
    "criteria": {
      "prop_passing": {
        "weight": 40,
        "description": "Correctly passes props from parent to child"
      },
      "destructuring": {
        "weight": 30,
        "description": "Proper prop destructuring in child component"
      },
      "data_display": {
        "weight": 30,
        "description": "All data displays correctly without errors"
      }
    }
  }]',

  learning_objectives = ARRAY[
    'Understand React props flow',
    'Master prop destructuring',
    'Debug prop-related errors',
    'Ensure prop name consistency'
  ]

WHERE slug = 'beginner-props-passing';

-- ============================================================================
-- Challenge #9: Fix Event Handler Binding
-- ============================================================================

UPDATE challenges
SET
  description = E'## Challenge\n\nYou have a shopping cart component with "Add to Cart" buttons, but clicking them doesn''t work correctly!\n\n## Bug Reports\n\n- Clicking "Add to Cart" adds the wrong product\n- All buttons add the same item (the last one)\n- Product ID is always undefined or incorrect\n- Console shows stale closure warnings\n\n## The Problem\n\nEvent handlers aren''t properly bound with the correct parameters.\n\n## Requirements\n\n1. Fix event handler binding to pass correct product data\n2. Ensure each button adds its own product\n3. Handle click events with proper parameters\n4. Display added item correctly\n\n## Expected Behavior\n\n```\nClicking "Add to Cart" on "Laptop" → Adds: Laptop (ID: 1)\nClicking "Add to Cart" on "Phone" → Adds: Phone (ID: 2)\nClicking "Add to Cart" on "Tablet" → Adds: Tablet (ID: 3)\n```\n\n## Your Task\n\nFix the event handler binding in the component below.',

  starter_code = '{"javascript": "import { useState } from ''react'';\n\nfunction ProductList() {\n  const [cartItems, setCartItems] = useState([]);\n  \n  const products = [\n    { id: 1, name: \"Laptop\", price: 999 },\n    { id: 2, name: \"Phone\", price: 699 },\n    { id: 3, name: \"Tablet\", price: 499 }\n  ];\n  \n  // Bug: This won''t work correctly in a loop!\n  const handleAddToCart = (product) => {\n    setCartItems([...cartItems, product]);\n    alert(`Added: ${product.name}`);\n  };\n  \n  return (\n    <div>\n      <h2>Products</h2>\n      {products.map(product => (\n        <div key={product.id}>\n          <h3>{product.name} - ${product.price}</h3>\n          {/* Bug: This will only pass the last product! */}\n          <button onClick={handleAddToCart(product)}>\n            Add to Cart\n          </button>\n        </div>\n      ))}\n      \n      <h3>Cart ({cartItems.length} items)</h3>\n      {cartItems.map((item, index) => (\n        <div key={index}>{item.name}</div>\n      ))}\n    </div>\n  );\n}"}',

  test_cases = '[{
    "type": "ai_validation",
    "criteria": {
      "event_binding": {
        "weight": 45,
        "description": "Correctly binds event handlers with parameters"
      },
      "functionality": {
        "weight": 35,
        "description": "Each button adds its corresponding product"
      },
      "best_practices": {
        "weight": 20,
        "description": "Uses arrow functions or bind correctly"
      }
    }
  }]',

  learning_objectives = ARRAY[
    'Master event handler binding in React',
    'Pass parameters to event handlers',
    'Understand closure issues in loops',
    'Use arrow functions correctly'
  ]

WHERE slug = 'beginner-event-handlers';

-- ============================================================================
-- Challenge #10: Implement Simple State Management with Context
-- ============================================================================

UPDATE challenges
SET
  description = E'## Challenge\n\nYou''re building a theme switcher (light/dark mode) that needs to be accessible throughout the app, but the current implementation doesn''t work!\n\n## Bug Reports\n\n- Theme context is not defined\n- Components can''t access theme state\n- Toggle button doesn''t switch themes\n- Console shows "useContext must be used within a Provider"\n\n## The Problem\n\nContext is created but not properly set up with Provider and consumer logic.\n\n## Requirements\n\n1. Create a ThemeContext with Provider\n2. Provide theme state and toggle function\n3. Wrap app with ThemeProvider\n4. Consume context in child components\n5. Make the theme toggle work\n\n## Expected Behavior\n\n```\nInitial state: Light mode (white background)\nClick "Toggle Theme" → Dark mode (dark background)\nClick again → Light mode\n```\n\n## Your Task\n\nImplement a working Context-based theme system.',

  starter_code = '{"javascript": "import { createContext, useContext, useState } from ''react'';\n\n// Context created but not properly set up\nconst ThemeContext = createContext();\n\n// Bug: No Provider component!\nfunction App() {\n  return (\n    <div>\n      <Header />\n      <Content />\n    </div>\n  );\n}\n\nfunction Header() {\n  // Bug: Using context without Provider!\n  const { theme, toggleTheme } = useContext(ThemeContext);\n  \n  return (\n    <header style={{ background: theme === ''light'' ? ''white'' : ''black'' }}>\n      <h1>My App</h1>\n      <button onClick={toggleTheme}>Toggle Theme</button>\n    </header>\n  );\n}\n\nfunction Content() {\n  const { theme } = useContext(ThemeContext);\n  \n  return (\n    <div style={{ background: theme === ''light'' ? ''white'' : ''#333'' }}>\n      <p>Current theme: {theme}</p>\n    </div>\n  );\n}"}',

  test_cases = '[{
    "type": "ai_validation",
    "criteria": {
      "context_setup": {
        "weight": 35,
        "description": "Properly creates Context and Provider component"
      },
      "provider_implementation": {
        "weight": 30,
        "description": "Wraps app with Provider and provides value"
      },
      "consumer_usage": {
        "weight": 20,
        "description": "Components correctly consume context"
      },
      "functionality": {
        "weight": 15,
        "description": "Theme toggle works across all components"
      }
    }
  }]',

  learning_objectives = ARRAY[
    'Understand React Context API',
    'Create Context Providers',
    'Share state across components',
    'Implement global state management'
  ]

WHERE slug = 'beginner-state-management';

-- Verify all updates
SELECT
  slug,
  title,
  CASE
    WHEN starter_code IS NULL THEN '❌ Missing starter_code'
    WHEN test_cases IS NULL THEN '❌ Missing test_cases'
    WHEN LENGTH(description) < 200 THEN '❌ Description too short'
    ELSE '✅ Complete'
  END as status
FROM challenges
WHERE slug IN (
  'beginner-props-passing',
  'beginner-event-handlers',
  'beginner-state-management'
)
ORDER BY order_in_tier;
