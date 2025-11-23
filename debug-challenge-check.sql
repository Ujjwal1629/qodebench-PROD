-- Check if beginner challenges have validation_type set correctly
SELECT
  slug,
  title,
  validation_type,
  CASE
    WHEN test_cases IS NOT NULL THEN 'Has test_cases'
    ELSE 'NO test_cases'
  END as test_cases_status,
  CASE
    WHEN starter_code IS NOT NULL THEN 'Has starter_code'
    ELSE 'NO starter_code'
  END as starter_code_status,
  is_active
FROM challenges
WHERE tier = 'beginner'
ORDER BY order_in_tier;
