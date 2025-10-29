// Onboarding quiz questions for skill assessment
// Mix of multiple choice and true/false questions covering full-stack web development

export type QuestionType = 'multiple-choice' | 'true-false';

export interface QuizQuestion {
  id: number;
  question: string;
  type: QuestionType;
  options: string[];
  correctAnswer: number; // Index of correct option (0-based)
  explanation: string;
  category: 'html-css' | 'javascript' | 'react-nextjs' | 'backend-api';
}

export const quizQuestions: QuizQuestion[] = [
  // HTML/CSS Questions (2)
  {
    id: 1,
    question: 'What is the correct way to create a flexbox container that centers its children both horizontally and vertically?',
    type: 'multiple-choice',
    options: [
      'display: flex; align-items: center; justify-content: center;',
      'display: block; text-align: center; vertical-align: middle;',
      'display: grid; place-items: middle;',
      'display: flex; align: center; justify: center;',
    ],
    correctAnswer: 0,
    explanation: 'The correct way is to use "display: flex" with "align-items: center" (vertical) and "justify-content: center" (horizontal).',
    category: 'html-css',
  },
  {
    id: 2,
    question: 'CSS Grid is only used for two-dimensional layouts, while Flexbox is for one-dimensional layouts.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 0,
    explanation: 'True! CSS Grid is designed for two-dimensional layouts (rows and columns), while Flexbox excels at one-dimensional layouts (either rows or columns).',
    category: 'html-css',
  },
  // JavaScript Questions (3)
  {
    id: 3,
    question: 'What will be the output of: console.log(typeof null)?',
    type: 'multiple-choice',
    options: [
      '"null"',
      '"object"',
      '"undefined"',
      '"number"',
    ],
    correctAnswer: 1,
    explanation: 'This is a well-known JavaScript quirk! "typeof null" returns "object" due to a legacy bug in JavaScript that was never fixed for backward compatibility.',
    category: 'javascript',
  },
  {
    id: 4,
    question: 'What is the difference between "let" and "const" in JavaScript?',
    type: 'multiple-choice',
    options: [
      'let is block-scoped, const is function-scoped',
      'let can be reassigned, const cannot be reassigned',
      'let is hoisted, const is not hoisted',
      'There is no difference, they are interchangeable',
    ],
    correctAnswer: 1,
    explanation: 'Both "let" and "const" are block-scoped, but "let" allows reassignment while "const" does not. However, const objects can still have their properties modified.',
    category: 'javascript',
  },
  {
    id: 5,
    question: 'Arrow functions in JavaScript have their own "this" binding.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 1,
    explanation: 'False! Arrow functions do NOT have their own "this" binding. They inherit "this" from the enclosing lexical scope, which is one of their key differences from regular functions.',
    category: 'javascript',
  },
  // React/Next.js Questions (3)
  {
    id: 6,
    question: 'In React, what is the purpose of the "useEffect" hook?',
    type: 'multiple-choice',
    options: [
      'To manage component state',
      'To perform side effects in functional components',
      'To create custom hooks',
      'To optimize component rendering',
    ],
    correctAnswer: 1,
    explanation: 'useEffect is used to perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM. It runs after render.',
    category: 'react-nextjs',
  },
  {
    id: 7,
    question: 'Next.js automatically code-splits your application on a per-page basis.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 0,
    explanation: 'True! Next.js automatically splits your code by pages/routes, meaning each page only loads the JavaScript it needs, improving performance.',
    category: 'react-nextjs',
  },
  {
    id: 8,
    question: 'What is the main benefit of Server Components in Next.js 13+ (App Router)?',
    type: 'multiple-choice',
    options: [
      'They make your website load faster on the client',
      'They reduce the JavaScript bundle sent to the browser by rendering on the server',
      'They allow you to use hooks in server-side code',
      'They automatically cache all data forever',
    ],
    correctAnswer: 1,
    explanation: 'Server Components render on the server and reduce JavaScript bundle size by keeping component logic on the server, sending only HTML to the client.',
    category: 'react-nextjs',
  },
  // Backend/API Questions (2)
  {
    id: 9,
    question: 'What HTTP status code indicates a successful POST request that created a new resource?',
    type: 'multiple-choice',
    options: [
      '200 OK',
      '201 Created',
      '204 No Content',
      '202 Accepted',
    ],
    correctAnswer: 1,
    explanation: '201 Created is the correct status code for a successful POST request that creates a new resource. 200 OK is for general success, but 201 is more specific.',
    category: 'backend-api',
  },
  {
    id: 10,
    question: 'REST APIs must always use JSON as the data format.',
    type: 'true-false',
    options: ['True', 'False'],
    correctAnswer: 1,
    explanation: 'False! While JSON is the most common format for REST APIs, they can use XML, plain text, or other formats. REST is architectural style, not a protocol.',
    category: 'backend-api',
  },
];

// Function to calculate experience level based on score
export function getExperienceLevelFromScore(score: number): 'intern' | 'junior' | 'mid' | 'senior' | null {
  if (score < 40) {
    return null; // Failed - should go to learning module
  } else if (score >= 40 && score < 70) {
    return 'junior';
  } else if (score >= 70 && score < 90) {
    return 'mid';
  } else {
    return 'senior';
  }
}

// Function to get recommendation message based on score
export function getRecommendationMessage(score: number): {
  title: string;
  message: string;
  shouldRedirectToLearning: boolean;
} {
  if (score < 40) {
    return {
      title: 'Let\'s Start with the Basics!',
      message: 'We recommend starting with our learning module to build a strong foundation in full-stack development.',
      shouldRedirectToLearning: true,
    };
  } else if (score >= 40 && score < 70) {
    return {
      title: 'Good Start!',
      message: 'You have a solid foundation! We\'ll recommend junior-level challenges to help you grow your skills.',
      shouldRedirectToLearning: false,
    };
  } else if (score >= 70 && score < 90) {
    return {
      title: 'Great Job!',
      message: 'You have strong full-stack knowledge! We\'ll show you mid-level challenges to advance your expertise.',
      shouldRedirectToLearning: false,
    };
  } else {
    return {
      title: 'Excellent!',
      message: 'You\'re a full-stack expert! We\'ll challenge you with our hardest problems to keep you sharp.',
      shouldRedirectToLearning: false,
    };
  }
}
