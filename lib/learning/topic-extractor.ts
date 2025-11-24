/**
 * Topic Extraction Utility
 * Extracts key topics, concepts, and keywords from lesson markdown content
 */

export interface LessonTopics {
  title: string;
  mainTopics: string[];
  keywords: string[];
  codeLanguages: string[];
}

/**
 * Extract topics and keywords from lesson markdown content
 */
export function extractTopicsFromLesson(
  lessonContent: string,
  lessonTitle?: string
): LessonTopics {
  const topics: LessonTopics = {
    title: lessonTitle || 'this lesson',
    mainTopics: [],
    keywords: [],
    codeLanguages: [],
  };

  if (!lessonContent) {
    return topics;
  }

  // Extract headings (main topics)
  const headingRegex = /^#{1,3}\s+(.+)$/gm;
  let match;
  while ((match = headingRegex.exec(lessonContent)) !== null) {
    const heading = match[1].trim();
    // Filter out common non-topic headings
    if (
      !heading.toLowerCase().includes('exercise') &&
      !heading.toLowerCase().includes('summary') &&
      !heading.toLowerCase().includes('quiz') &&
      heading.length > 3
    ) {
      topics.mainTopics.push(heading);
    }
  }

  // Extract bold/emphasized terms (likely important concepts)
  const boldRegex = /\*\*([^*]+)\*\*/g;
  while ((match = boldRegex.exec(lessonContent)) !== null) {
    const term = match[1].trim();
    if (term.length > 2 && term.length < 50 && !topics.keywords.includes(term)) {
      topics.keywords.push(term);
    }
  }

  // Extract inline code terms (technical keywords)
  const inlineCodeRegex = /`([^`]+)`/g;
  while ((match = inlineCodeRegex.exec(lessonContent)) !== null) {
    const term = match[1].trim();
    if (
      term.length > 1 &&
      term.length < 30 &&
      !topics.keywords.includes(term) &&
      !term.includes(' ')
    ) {
      topics.keywords.push(term);
    }
  }

  // Extract code block languages
  const codeBlockRegex = /```(\w+)/g;
  while ((match = codeBlockRegex.exec(lessonContent)) !== null) {
    const lang = match[1].toLowerCase();
    if (!topics.codeLanguages.includes(lang)) {
      topics.codeLanguages.push(lang);
    }
  }

  // Deduplicate and limit
  topics.mainTopics = [...new Set(topics.mainTopics)].slice(0, 10);
  topics.keywords = [...new Set(topics.keywords)].slice(0, 30);

  return topics;
}

/**
 * Generate a human-readable summary of lesson topics
 */
export function getTopicSummary(topics: LessonTopics): string {
  const parts: string[] = [];

  if (topics.mainTopics.length > 0) {
    parts.push(topics.mainTopics.slice(0, 5).join(', '));
  }

  if (topics.codeLanguages.length > 0) {
    parts.push(topics.codeLanguages.join('/').toUpperCase());
  }

  return parts.join(' - ') || topics.title;
}
