/**
 * Relevance Validation Utility
 * Determines if a user question is relevant to the current lesson
 */

import { LessonTopics } from './topic-extractor';

export type RelevanceCategory = 'on-topic' | 'related' | 'off-topic';

export interface RelevanceResult {
  category: RelevanceCategory;
  confidence: number; // 0-1
  matchedTopics: string[];
  isOffTopic: boolean;
}

/**
 * Common programming terms that are considered "related" across most lessons
 */
const RELATED_PROGRAMMING_TERMS = [
  'variable',
  'function',
  'loop',
  'array',
  'object',
  'string',
  'number',
  'boolean',
  'condition',
  'syntax',
  'error',
  'debug',
  'console',
  'comment',
  'import',
  'export',
];

/**
 * Technology/language names that are likely off-topic if not in lesson
 */
const SPECIFIC_TECHNOLOGIES = [
  'java',
  'python',
  'c++',
  'ruby',
  'php',
  'swift',
  'kotlin',
  'rust',
  'go',
  'angular',
  'vue',
  'django',
  'flask',
  'spring',
  'laravel',
  '.net',
  'android',
  'ios',
];

/**
 * Validate if a question is relevant to the lesson topics
 */
export function validateQuestionRelevance(
  question: string,
  lessonTopics: LessonTopics
): RelevanceResult {
  const result: RelevanceResult = {
    category: 'off-topic',
    confidence: 0,
    matchedTopics: [],
    isOffTopic: true,
  };

  if (!question || question.trim().length === 0) {
    return result;
  }

  const questionLower = question.toLowerCase();
  const allTopicTerms = [
    ...lessonTopics.mainTopics.map((t) => t.toLowerCase()),
    ...lessonTopics.keywords.map((k) => k.toLowerCase()),
    ...lessonTopics.codeLanguages.map((l) => l.toLowerCase()),
  ];

  // Check for direct topic matches
  let directMatches = 0;
  for (const term of allTopicTerms) {
    if (questionLower.includes(term.toLowerCase())) {
      result.matchedTopics.push(term);
      directMatches++;
    }
  }

  // Strong direct match = on-topic
  if (directMatches >= 2 || (directMatches === 1 && allTopicTerms.length <= 3)) {
    result.category = 'on-topic';
    result.confidence = Math.min(0.7 + directMatches * 0.1, 1.0);
    result.isOffTopic = false;
    return result;
  }

  // Single match = likely on-topic, but check for competing topics
  if (directMatches === 1) {
    // Check if question mentions other specific technologies
    const mentionsOtherTech = SPECIFIC_TECHNOLOGIES.some(
      (tech) => questionLower.includes(tech) && !allTopicTerms.includes(tech)
    );

    if (!mentionsOtherTech) {
      result.category = 'on-topic';
      result.confidence = 0.6;
      result.isOffTopic = false;
      return result;
    }
  }

  // Check if question is about general programming concepts (related)
  const hasRelatedTerms = RELATED_PROGRAMMING_TERMS.some((term) =>
    questionLower.includes(term)
  );

  if (hasRelatedTerms) {
    // Check if it's specifically asking about another technology
    const asksAboutOtherTech = SPECIFIC_TECHNOLOGIES.some((tech) => {
      const patterns = [
        `what is ${tech}`,
        `what's ${tech}`,
        `explain ${tech}`,
        `how does ${tech}`,
        `${tech} vs`,
      ];
      return patterns.some((pattern) => questionLower.includes(pattern));
    });

    if (asksAboutOtherTech) {
      result.category = 'off-topic';
      result.confidence = 0.8;
      result.isOffTopic = true;
      return result;
    }

    // General programming question without specific tech = related
    result.category = 'related';
    result.confidence = 0.5;
    result.isOffTopic = false;
    return result;
  }

  // Check for code-related keywords
  const codeKeywords = [
    'code',
    'program',
    'script',
    'develop',
    'build',
    'create',
    'make',
    'write',
  ];
  const hasCodeKeywords = codeKeywords.some((kw) => questionLower.includes(kw));

  if (hasCodeKeywords && questionLower.split(' ').length <= 10) {
    // Short code-related question = possibly related
    result.category = 'related';
    result.confidence = 0.4;
    result.isOffTopic = false;
    return result;
  }

  // Default: off-topic
  result.category = 'off-topic';
  result.confidence = 0.7;
  result.isOffTopic = true;
  return result;
}

/**
 * Generate a contextual message based on relevance result
 */
export function getRelevanceMessage(
  result: RelevanceResult,
  lessonTitle: string
): string | null {
  if (result.category === 'on-topic') {
    return null; // No message needed
  }

  if (result.category === 'related') {
    return `This isn't directly covered in the "${lessonTitle}" lesson, but it's a related programming concept. Let me explain briefly:`;
  }

  // off-topic
  return `This topic is outside our current lesson on "${lessonTitle}". While I can give you a brief overview, I'd recommend focusing on the lesson content first. Here's a quick answer:`;
}
