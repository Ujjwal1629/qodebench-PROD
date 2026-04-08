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

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyData() {
  console.log('🔍 Checking Playwright learning module data...\n');

  // Check learning path
  const { data: path, error: pathError } = await supabase
    .from('ai_learning_paths')
    .select('*')
    .eq('id', 'f8a9b0c1-d2e3-4f5a-6b7c-8d9e0f1a2b3c')
    .single();

  if (pathError) {
    console.error('❌ Learning path NOT found:', pathError.message);
  } else {
    console.log('✅ Learning path found:', path.title);
    console.log('   - Published:', path.is_published);
    console.log('   - Order:', path.order_index);
  }

  // Check lessons
  const { data: lessons, error: lessonsError } = await supabase
    .from('ai_learning_lessons')
    .select('id, title, order_index, duration_minutes')
    .eq('learning_path_id', 'f8a9b0c1-d2e3-4f5a-6b7c-8d9e0f1a2b3c')
    .order('order_index');

  if (lessonsError) {
    console.error('\n❌ Lessons NOT found:', lessonsError.message);
  } else if (!lessons || lessons.length === 0) {
    console.error('\n❌ No lessons found for Playwright module');
    console.log('\n📝 This means the migration was not fully applied.');
    console.log('   Please run the migration again or check the database.');
  } else {
    console.log(`\n✅ Found ${lessons.length} lessons:`);
    lessons.forEach(lesson => {
      console.log(`   ${lesson.order_index}. ${lesson.title} (${lesson.duration_minutes} min)`);
      console.log(`      ID: ${lesson.id}`);
    });
  }

  // Check quiz questions
  const { data: questions, error: questionsError } = await supabase
    .from('playwright_quiz_questions')
    .select('id')
    .limit(1);

  if (questionsError) {
    console.error('\n❌ Quiz table NOT found:', questionsError.message);
    console.log('   This means the migration was not applied.');
  } else {
    const { count } = await supabase
      .from('playwright_quiz_questions')
      .select('*', { count: 'exact', head: true });

    console.log(`\n✅ Quiz questions table exists with ${count} questions`);
  }

  console.log('\n' + '='.repeat(50));
  console.log('Summary:');
  console.log('='.repeat(50));

  if (path && lessons && lessons.length > 0) {
    console.log('✅ Playwright module is properly set up!');
    console.log('   If not showing in UI, try:');
    console.log('   1. Clear browser cache (hard refresh)');
    console.log('   2. Restart Next.js dev server');
  } else {
    console.log('❌ Playwright module is NOT properly set up');
    console.log('   Please run this command to apply migration:');
    console.log('   npx supabase db push');
    console.log('   OR manually execute the SQL file in Supabase dashboard');
  }
}

verifyData();
