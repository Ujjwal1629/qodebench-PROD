# Challenge Components Architecture Guide

## Component Tree

```
ChallengeWorkspace (Main Container)
├── ChallengeHeader (Top Bar)
├── Main Layout (Flex Row)
│   ├── ChallengeSidebar (Left 25%)
│   │   ├── Description Section
│   │   ├── Requirements Section
│   │   ├── Learning Objectives Section
│   │   └── AI Assistant Button
│   └── Editor Area (Right 75%)
│       ├── SuccessMessage (conditional)
│       ├── FlexibleEditor (main editor)
│       ├── InlineValidation (conditional)
│       └── Action Bar (buttons)
└── AIAssistantPanel (conditional, fixed bottom)
```

---

## Component Details

### 1. ChallengeHeader
**File:** `/components/challenges/challenge-header.tsx`

**Purpose:** Top navigation and challenge metadata

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│ ← Back to Challenges | Challenge Title | [Meta Info] │
└──────────────────────────────────────────────────────┘
```

**Props:**
```typescript
interface ChallengeHeaderProps {
  challenge: {
    id: string;
    title: string;
    difficulty: string;
    points: number;
    estimated_time?: number;
  };
}
```

**Styling:**
- White background (`bg-white`)
- Bottom border (`border-b border-gray-200`)
- Padding: `px-6 py-4`
- Flex layout: space-between

**Key Elements:**
- Back button with router navigation
- Centered title (truncated on small screens)
- Right-aligned stats (difficulty badge, points, time)

---

### 2. ChallengeSidebar
**File:** `/components/challenges/challenge-sidebar.tsx`

**Purpose:** Display challenge information and navigation

**Layout:**
```
┌────────────────────┐
│ Description        │ ← Section header
│ ─────────────────  │
│ [Markdown content] │
│                    │
│ Requirements       │
│ ─────────────────  │
│ • Item 1           │
│ • Item 2           │
│                    │
│ Learning Objectives│
│ ─────────────────  │
│ ✓ Objective 1      │
│ ✓ Objective 2      │
│                    │
│ [AI Assistant]     │ ← Button at bottom
└────────────────────┘
```

**Props:**
```typescript
interface ChallengeSidebarProps {
  description: string;
  requirements?: string[];
  objectives?: string[];
  onOpenAI: () => void;
}
```

**Styling:**
- White background with right border
- Full height with scroll (`overflow-y-auto`)
- Sections separated by borders (`border-b border-gray-200`)
- Padding: `p-6` per section
- ReactMarkdown with custom styling

**Key Features:**
- Conditional rendering of requirements/objectives
- Custom markdown components (minimal styling)
- Green checkmarks for objectives (only color accent)
- AI button at bottom with outline style

---

### 3. InlineValidation
**File:** `/components/challenges/inline-validation.tsx`

**Purpose:** Display validation results in ESLint style

**Layout:**
```
┌──────────────────────────────────────┐
│ > Validation Results    Score: 85/100│ ← Collapsible header
│ ──────────────────────────────────── │
│ ✓ Strength 1                         │ ← Green icon
│ ✓ Strength 2                         │
│ ✗ Improvement needed                 │ ← Red icon
│ ⚠ Suggestion                         │ ← Amber icon
│ ──────────────────────────────────── │
│ Final Score: 85/100 • Passed         │
│ Structure: 45/50                     │
│ Quality: 40/50                       │
└──────────────────────────────────────┘
```

**Props:**
```typescript
interface ValidationResult {
  passed: boolean;
  score: number;
  strengths?: string[];
  improvements?: Array<string | { text: string; line?: number }>;
  suggestions?: string[];
  structureScore?: number;
  qualityScore?: number;
  pointsEarned?: number;
}

interface InlineValidationProps {
  result: ValidationResult;
}
```

**Styling:**
- Light gray background (`bg-gray-50`)
- Top border (`border-t border-gray-200`)
- Padding: `px-6 py-4`
- Collapsible with chevron animation
- Icons: CheckCircle2 (green), XCircle (red), AlertCircle (amber)

**Key Features:**
- Expandable/collapsible section
- Score displayed in header (always visible)
- Grouped feedback by type
- Breakdown scores for hybrid validation

---

### 4. AIAssistantPanel
**File:** `/components/challenges/ai-assistant-panel.tsx`

**Purpose:** Bottom drawer for AI assistance

**Layout:**
```
┌──────────────────────────────────────────────────┐
│ 🤖 AI Assistant                            [X]   │ ← Header
│ ──────────────────────────────────────────────── │
│ [Chat] [Hints] [Code Review]                     │ ← Tabs
│ ──────────────────────────────────────────────── │
│                                                  │
│ [Content area with scroll]                       │
│                                                  │
│ ──────────────────────────────────────────────── │
│ [Input] ............................ [Send]      │ ← Input area
└──────────────────────────────────────────────────┘
```

**Props:**
```typescript
interface AIAssistantPanelProps {
  onClose: () => void;
  challengeId: string;
  challengeTitle: string;
  challengeDescription: string;
  currentCode: string;
  difficulty: string;
}
```

**Styling:**
- Fixed bottom position (`fixed bottom-0 left-0 right-0`)
- Height: 350px
- White background with top border
- Shadow: `shadow-lg`
- Z-index: 50 (above content)

**Features:**
- Three tabs: Chat, Hints, Code Review
- Chat history with user/assistant messages
- Progressive hints system
- Code review on demand
- Integrates with `/api/ai/companion` endpoint

**Tab Styles:**
- Underline on active tab (sky-500)
- Gray text for inactive tabs
- Clean minimal tab design

---

### 5. SuccessMessage
**File:** `/components/challenges/success-message.tsx`

**Purpose:** Inline success notification

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ ✓ Challenge Completed • +100 points            │
│   [View Solution]      [Next Challenge →]      │
└─────────────────────────────────────────────────┘
```

**Props:**
```typescript
interface SuccessMessageProps {
  points: number;
  onNext?: () => void;
  onViewSolution?: () => void;
  autoDismiss?: boolean;
}
```

**Styling:**
- Green background (`bg-green-50`)
- Green left border (4px, `border-green-600`)
- Padding: `px-6 py-4`
- Flex layout with space-between
- Optional auto-dismiss after 5 seconds

**Key Elements:**
- CheckCircle2 icon (green)
- Points earned message
- Action buttons (ghost and primary variants)

---

### 6. ChallengeWorkspace (Main)
**File:** `/components/challenges/challenge-workspace.tsx`

**Purpose:** Main container and state management

**State:**
```typescript
const [code, setCode] = useState<string>();
const [validationResult, setValidationResult] = useState<any>();
const [isValidating, setIsValidating] = useState<boolean>();
const [isSubmitting, setIsSubmitting] = useState<boolean>();
const [hasSubmitted, setHasSubmitted] = useState<boolean>();
const [submissionResult, setSubmissionResult] = useState<any>();
const [showAI, setShowAI] = useState<boolean>();
const [isModified, setIsModified] = useState<boolean>();
```

**Layout Structure:**
```
<div className="h-screen flex flex-col bg-white overflow-hidden">
  <ChallengeHeader />

  <div className="flex flex-1 overflow-hidden">
    {/* Sidebar (25%, hidden on mobile) */}
    <div className="hidden lg:block w-[25%] min-w-[280px]">
      <ChallengeSidebar />
    </div>

    {/* Main editor area (75%) */}
    <main className="flex-1 flex flex-col">
      {/* Success message if completed */}
      {submissionResult?.passed && <SuccessMessage />}

      {/* Editor */}
      <div className="flex-1 p-6">
        <FlexibleEditor />
      </div>

      {/* Validation results */}
      {validationResult && <InlineValidation />}

      {/* Action bar */}
      <div className="border-t px-6 py-4">
        <Button onClick={handleValidate}>Validate</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </main>
  </div>

  {/* AI panel (conditional) */}
  {showAI && <AIAssistantPanel />}
</div>
```

**Key Functions:**

1. **handleValidate():**
   - Validates code against requirements
   - Calls `/api/ai/validate-hybrid` or `/api/ai/validate`
   - Updates `validationResult` state
   - Saves to localStorage for comparison

2. **handleSubmit():**
   - Submits code to `/api/challenges/submit`
   - Updates submission state
   - Shows success message if passed
   - Clears localStorage cache

3. **extractRequirements():**
   - Parses description for bullet points
   - Returns array of requirements
   - Used for sidebar display

**Validation Logic:**
```typescript
// Office challenges use hybrid validation
const useHybridValidation = isOfficeChallenge;

const validationEndpoint = useHybridValidation
  ? '/api/ai/validate-hybrid'
  : '/api/ai/validate';
```

**Starter Code Logic:**
- Smart detection based on response format
- Challenge-specific templates (PR, RCA, etc.)
- Fallback to generic templates

---

## Styling System

### Colors
```typescript
// Backgrounds
bg-white          // All backgrounds
bg-gray-50        // Validation panel, light sections

// Text
text-gray-900     // Primary text
text-gray-600     // Secondary text
text-gray-400     // Muted text

// Functional Colors
text-green-600    // Success (icons only)
text-red-600      // Error (icons only)
text-amber-600    // Warning (icons only)
bg-sky-500        // Primary action buttons

// Borders
border-gray-200   // All borders (1px)
```

### Spacing
```typescript
p-6               // Standard padding
px-6 py-4         // Compact padding
gap-3, gap-4      // Element gaps
```

### Typography
```typescript
text-sm           // Body text
text-lg           // Headers
font-medium       // Headers
font-normal       // Body
```

### Borders & Corners
```typescript
border-gray-200   // 1px solid
rounded-sm        // Minimal rounding (no rounded-xl)
```

---

## Responsive Behavior

### Desktop (lg: 1024px+)
- Sidebar visible (25% width)
- Editor 75% width
- AI panel as bottom drawer (350px height)

### Tablet/Mobile (<1024px)
- Sidebar hidden
- Editor full width
- "Need Help?" floating button (bottom-left)
- AI panel opens on button click

### Breakpoints
```typescript
lg:block          // Show on desktop
lg:w-[25%]        // Sidebar width
hidden lg:block   // Mobile hide, desktop show
```

---

## Integration Points

### API Endpoints
```
POST /api/ai/validate-hybrid     // Hybrid validation (office challenges)
POST /api/ai/validate            // Standard validation
POST /api/challenges/submit      // Submit solution
POST /api/ai/companion           // AI assistant chat
```

### LocalStorage Keys
```
validation_${challengeId}        // Cache validation attempts
```

### Toast Notifications
```
toast.error()     // Validation errors
toast.success()   // Completion messages
toast.info()      // General info
```

---

## Testing Checklist

### Visual
- [ ] White backgrounds everywhere
- [ ] No gradients or colorful elements
- [ ] Only functional colors (green/red/amber/sky)
- [ ] Thin 1px borders
- [ ] Minimal spacing

### Functional
- [ ] Validate button triggers validation
- [ ] Submit button appears after passing validation
- [ ] Success message shows after submission
- [ ] AI Assistant opens on button click
- [ ] Sidebar displays all sections correctly
- [ ] Back button navigates to challenges list

### Responsive
- [ ] Sidebar hidden on mobile
- [ ] Help button appears on mobile
- [ ] Editor takes full width on mobile
- [ ] Touch interactions work

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader labels present
- [ ] Color contrast meets WCAG AA

---

## File Locations

```
/components/challenges/
├── challenge-header.tsx        ✅ New minimal header
├── challenge-sidebar.tsx       ✅ New sidebar component
├── inline-validation.tsx       ✅ New validation display
├── ai-assistant-panel.tsx      ✅ New AI drawer
├── success-message.tsx         ✅ New success banner
├── challenge-workspace.tsx     ✅ Refactored main component
├── flexible-editor.tsx         ✅ Existing (unchanged)
├── code-editor.tsx             ✅ Existing (unchanged)
├── markdown-editor.tsx         ✅ Existing (unchanged)
└── text-editor.tsx             ✅ Existing (unchanged)
```

**Removed Files:**
- ❌ mission-brief-header.tsx
- ❌ celebration-modal.tsx
- ❌ progress-timeline.tsx
- ❌ floating-ai-mentor.tsx
- ❌ enhanced-validation-result.tsx
- ❌ collapsible-section.tsx

---

## Usage Example

```tsx
import { ChallengeWorkspace } from '@/components/challenges/challenge-workspace';

// In page component
export default async function ChallengePage({ params }) {
  const challenge = await getChallengeById(params.slug);

  return <ChallengeWorkspace challenge={challenge} />;
}
```

The component handles all internal state and interactions. No additional props or wrappers needed.

---

## Future Enhancements

Potential improvements while maintaining minimal design:

1. **Resizable sidebar** - Allow users to adjust sidebar width
2. **Keyboard shortcuts** - Ctrl+Enter to validate, Ctrl+S to save
3. **Code snippets** - Insertable code templates
4. **Split editor** - Side-by-side for markdown preview
5. **Test cases view** - Show expected vs actual in clean format

All enhancements should follow the same minimal design principles:
- No gradients or animations
- Functional colors only
- Clean, professional aesthetic
- IDE-like interactions
