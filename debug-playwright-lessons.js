const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read .env.local file manually
const envContent = fs.readFileSync('.env.local', 'utf-8');
const envLines = envContent.split('\n');
let supabaseUrl = '';
let supabaseKey = '';

envLines.forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    supabaseUrl = line.split('=')[1].trim();
  }
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
    supabaseKey = line.split('=')[1].trim();
  }
});

const supabase = createClient(supabaseUrl, supabaseKey);

const PLAYWRIGHT_PATH_ID = 'f8a9b0c1-d2e3-4f5a-6b7c-8d9e0f1a2b3c';

async function debugLessons() {
  console.log('🔍 Debugging Playwright lessons fetch...\n');

  // Simulate what the page does
  console.log('1. Fetching all lessons for learning path...');
  const { data: lessons, error: lessonsError } = await supabase
    .from('ai_learning_lessons')
    .select('*')
    .eq('learning_path_id', PLAYWRIGHT_PATH_ID)
    .order('order_index', { ascending: true });

  if (lessonsError) {
    console.error('❌ Error fetching lessons:', lessonsError);
    return;
  }

  if (!lessons || lessons.length === 0) {
    console.error('❌ No lessons found!');
    console.log('\nThis is the problem! Lessons are not being returned.');
    console.log('Check if the learning_path_id matches in the database.');
    return;
  }

  console.log(`✅ Found ${lessons.length} lessons:\n`);
  lessons.forEach(lesson => {
    console.log(`Lesson ${lesson.order_index}:`);
    console.log(`  Title: ${lesson.title}`);
    console.log(`  ID: ${lesson.id}`);
    console.log(`  Duration: ${lesson.duration_minutes} min`);
    console.log(`  Learning Path ID: ${lesson.learning_path_id}`);
    console.log(`  Order Index: ${lesson.order_index}`);
    console.log('');
  });

  // Check quiz sessions
  console.log('2. Checking quiz sessions table...');
  const { data: quizSessions, error: quizError } = await supabase
    .from('playwright_quiz_sessions')
    .select('*')
    .limit(1);

  if (quizError) {
    console.error('❌ Error accessing quiz table:', quizError.message);
    if (quizError.message.includes('does not exist')) {
      console.log('\n⚠️  Quiz table does not exist!');
      console.log('This might cause the getLessonsWithAccess to fail.');
    }
  } else {
    console.log('✅ Quiz sessions table accessible');
  }

  // Simulate the full query that ProgressService uses
  console.log('\n3. Simulating ProgressService.getLessonsWithAccess...');

  const tablePrefix = 'playwright';
  const userId = 'test-user-id'; // Dummy user ID

  const [lessonsResult, quizSessionsResult] = await Promise.all([
    supabase
      .from('ai_learning_lessons')
      .select('*')
      .eq('learning_path_id', PLAYWRIGHT_PATH_ID)
      .order('order_index', { ascending: true }),

    supabase
      .from(`${tablePrefix}_quiz_sessions`)
      .select('lesson_id, score_percentage, passed, completed_at')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
  ]);

  if (lessonsResult.error) {
    console.error('❌ Lessons query error:', lessonsResult.error);
  } else {
    console.log(`✅ Lessons query successful: ${lessonsResult.data.length} lessons`);
  }

  if (quizSessionsResult.error) {
    console.error('❌ Quiz sessions query error:', quizSessionsResult.error.message);
    console.log('   This might cause the page to fail silently');
  } else {
    console.log(`✅ Quiz sessions query successful: ${quizSessionsResult.data.length} sessions`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('DIAGNOSIS:');
  console.log('='.repeat(60));

  if (lessonsResult.data && lessonsResult.data.length > 0 && !quizSessionsResult.error) {
    console.log('✅ All queries work! The issue is likely:');
    console.log('   1. Frontend cache (hard refresh browser)');
    console.log('   2. Server not restarted after file changes');
    console.log('   3. Check browser DevTools console for errors');
  } else if (quizSessionsResult.error) {
    console.log('❌ Quiz table access issue detected!');
    console.log('   The page may be failing when trying to query quiz sessions.');
    console.log('   This would cause a silent error and empty results.');
  } else {
    console.log('❌ Lessons not being returned from database!');
  }
}

debugLessons().catch(console.error);
