-- Manual test: Create a test profile directly
-- This bypasses the trigger to see if the table works

INSERT INTO profiles (
    id,
    username,
    full_name
) VALUES (
    gen_random_uuid(),  -- Generate a fake UUID for testing
    'testuser_manual',
    'Manual Test User'
);

-- Check if it was created
SELECT * FROM profiles WHERE username = 'testuser_manual';
