-- ============================================
-- SECTION 3: VERIFY USERS
-- Run this to check if users were created
-- ============================================

-- Check all users
SELECT 
    email,
    name,
    role,
    active
FROM users
ORDER BY role, email;

-- Verify auth accounts exist
SELECT 
    email,
    email_confirmed_at,
    created_at
FROM auth.users
WHERE email IN ('admin@bkbuilders.com', 'manager@bkbuilders.com', 'worker@bkbuilders.com')
ORDER BY email;
