// Quick script to check TypeScript lesson content
// Run with: node scripts/check-lesson-content.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkLessons() {
  const { data: lessons, error } = await supabase
    .from('ai_learning_lessons')
    .select('id, title, order_index, content')
    .eq('learning_path_id', 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f')
    .order('order_index');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('\n=== TypeScript Lessons ===\n');
  lessons.forEach(lesson => {
    const hasContent = lesson.content && lesson.content.length > 100;
    const hasPractice = lesson.content?.includes(':::practice');
    const hasPracticeSteps = lesson.content?.includes(':::practice-steps');

    console.log(`Lesson ${lesson.order_index}: ${lesson.title}`);
    console.log(`  Content: ${hasContent ? 'YES' : 'NO (placeholder)'}`);
    console.log(`  Has Practice: ${hasPractice ? 'YES' : 'NO'}`);
    console.log(`  Has Practice Steps: ${hasPracticeSteps ? 'YES' : 'NO'}`);

    if (lesson.content && lesson.content.length < 200) {
      console.log(`  Preview: ${lesson.content.substring(0, 100)}`);
    }
    console.log('');
  });
}

checkLessons();
