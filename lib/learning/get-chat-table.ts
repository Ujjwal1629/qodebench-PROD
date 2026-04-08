/**
 * Get the correct chat_history table name based on lesson's learning path
 */

import { createClient } from '@/lib/supabase/server';

export async function getChatTableForLesson(lessonId: string): Promise<string | null> {
  const supabase = await createClient();

  // Get the lesson's learning path
  const { data: lesson, error } = await supabase
    .from('ai_learning_lessons')
    .select('learning_path_id, ai_learning_paths(title)')
    .eq('id', lessonId)
    .single();

  if (error || !lesson) {
    console.error('Failed to get lesson learning path:', error);
    return null;
  }

  // Map learning path title to chat table name
  const pathTitle = (lesson as any).ai_learning_paths?.title;

  if (!pathTitle) {
    console.error('No learning path title found for lesson:', lessonId);
    return null;
  }

  // Map based on title (case-insensitive partial match)
  const titleLower = pathTitle.toLowerCase();

  if (titleLower.includes('html') || titleLower.includes('css')) {
    return 'html_css_chat_history';
  } else if (titleLower.includes('javascript') || titleLower.includes('js basics')) {
    return 'javascript_chat_history';
  } else if (titleLower.includes('react') || titleLower.includes('next')) {
    return 'react_nextjs_chat_history';
  } else if (titleLower.includes('backend') || titleLower.includes('api')) {
    return 'backend_chat_history';
  } else if (titleLower.includes('office') || titleLower.includes('fundamentals')) {
    return 'office_fundamentals_chat_history';
  } else if (titleLower.includes('typescript')) {
    return 'typescript_chat_history';
  } else if (titleLower.includes('playwright')) {
    return 'playwright_chat_history';
  }

  // Default fallback: try to detect from quiz tables
  // Check which quiz table has questions for this lesson
  const quizTables = [
    { table: 'html_css_quiz_questions', chat: 'html_css_chat_history' },
    { table: 'javascript_quiz_questions', chat: 'javascript_chat_history' },
    { table: 'react_nextjs_quiz_questions', chat: 'react_nextjs_chat_history' },
    { table: 'backend_quiz_questions', chat: 'backend_chat_history' },
    { table: 'office_fundamentals_quiz_questions', chat: 'office_fundamentals_chat_history' },
    { table: 'typescript_quiz_questions', chat: 'typescript_chat_history' },
    { table: 'playwright_quiz_questions', chat: 'playwright_chat_history' },
  ];

  for (const { table, chat } of quizTables) {
    const { data } = await supabase
      .from(table as any)
      .select('id')
      .eq('lesson_id', lessonId)
      .limit(1);

    if (data && data.length > 0) {
      console.log(`Detected chat table ${chat} for lesson ${lessonId} via quiz table ${table}`);
      return chat;
    }
  }

  console.error('Could not determine chat table for lesson:', lessonId, 'with path:', pathTitle);
  return null;
}
