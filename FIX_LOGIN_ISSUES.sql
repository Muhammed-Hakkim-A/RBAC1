-- ============================================
-- TROUBLESHOOT & FIX LOGIN ISSUES
-- Run this to check and fix user setup
-- ============================================

-- ============================================
-- STEP 1: CHECK IF USERS EXIST
-- ============================================

SELECT '=== CHECKING AUTH USERS ===' as step;
SELECT 
    email,
    email_confirmed_at,
    created_at,
    last_sign_in_at
FROM auth.users
WHERE email IN ('admin@bkbuilders.com', 'manager@bkbuilders.com', 'worker@bkbuilders.com')
ORDER BY email;

SELECT '=== CHECKING USER PROFILES ===' as step;
SELECT 
    email,
    name,
    role,
    active,
    created_at
FROM users
WHERE email IN ('admin@bkbuilders.com', 'manager@bkbuilders.com', 'worker@bkbuilders.com')
ORDER BY email;

-- ============================================
-- STEP 2: DELETE EXISTING USERS (IF NEEDED)
-- ============================================

-- Uncomment these lines if you need to start fresh
-- DELETE FROM users WHERE email IN ('manager@bkbuilders.com', 'worker@bkbuilders.com');
-- DELETE FROM auth.users WHERE email IN ('manager@bkbuilders.com', 'worker@bkbuilders.com');

-- ============================================
-- STEP 3: CREATE MANAGER USER
-- ============================================

DO $$
DECLARE
    manager_user_id UUID;
    existing_user_id UUID;
BEGIN
    -- Check if manager already exists in auth.users
    SELECT id INTO existing_user_id 
    FROM auth.users 
    WHERE email = 'manager@bkbuilders.com';

    IF existing_user_id IS NULL THEN
        -- Create new manager auth user
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'manager@bkbuilders.com',
            crypt('manager123', gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"]}',
            '{}',
            NOW(),
            NOW(),
            '',
            '',
            ''
        ) RETURNING id INTO manager_user_id;

        RAISE NOTICE 'Created manager auth user with ID: %', manager_user_id;
    ELSE
        manager_user_id := existing_user_id;
        RAISE NOTICE 'Manager auth user already exists with ID: %', manager_user_id;
    END IF;

    -- Create or update manager profile
    INSERT INTO users (id, email, name, role, phone, active, created_at)
    VALUES (
        manager_user_id,
        'manager@bkbuilders.com',
        'Manager User',
        'manager',
        '+91 9876543211',
        true,
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        phone = EXCLUDED.phone,
        active = EXCLUDED.active;

    RAISE NOTICE '✅ Manager user ready: manager@bkbuilders.com / manager123';
END $$;

-- ============================================
-- STEP 4: CREATE WORKER USER
-- ============================================

DO $$
DECLARE
    worker_user_id UUID;
    existing_user_id UUID;
BEGIN
    -- Check if worker already exists in auth.users
    SELECT id INTO existing_user_id 
    FROM auth.users 
    WHERE email = 'worker@bkbuilders.com';

    IF existing_user_id IS NULL THEN
        -- Create new worker auth user
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'worker@bkbuilders.com',
            crypt('worker123', gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"]}',
            '{}',
            NOW(),
            NOW(),
            '',
            '',
            ''
        ) RETURNING id INTO worker_user_id;

        RAISE NOTICE 'Created worker auth user with ID: %', worker_user_id;
    ELSE
        worker_user_id := existing_user_id;
        RAISE NOTICE 'Worker auth user already exists with ID: %', worker_user_id;
    END IF;

    -- Create or update worker profile
    INSERT INTO users (id, email, name, role, phone, active, created_at)
    VALUES (
        worker_user_id,
        'worker@bkbuilders.com',
        'Worker User',
        'worker',
        '+91 9876543212',
        true,
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        phone = EXCLUDED.phone,
        active = EXCLUDED.active;

    RAISE NOTICE '✅ Worker user ready: worker@bkbuilders.com / worker123';
END $$;

-- ============================================
-- STEP 5: VERIFY ALL USERS
-- ============================================

SELECT '=== FINAL VERIFICATION ===' as step;

SELECT 
    'Auth Users:' as type,
    COUNT(*) as count
FROM auth.users
WHERE email IN ('admin@bkbuilders.com', 'manager@bkbuilders.com', 'worker@bkbuilders.com');

SELECT 
    'User Profiles:' as type,
    COUNT(*) as count
FROM users
WHERE email IN ('admin@bkbuilders.com', 'manager@bkbuilders.com', 'worker@bkbuilders.com');

SELECT '=== ALL USERS ===' as step;
SELECT 
    u.email,
    u.name,
    u.role,
    u.active,
    CASE 
        WHEN au.id IS NOT NULL THEN '✅ Has Auth'
        ELSE '❌ Missing Auth'
    END as auth_status
FROM users u
LEFT JOIN auth.users au ON u.id = au.id
ORDER BY u.role, u.email;

-- ============================================
-- STEP 6: CHECK RLS POLICIES
-- ============================================

SELECT '=== RLS POLICIES ===' as step;
SELECT 
    tablename,
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

SELECT '✅ SETUP COMPLETE!' as status;
SELECT 'You can now login with:' as message;
SELECT 
    email || ' / ' || 
    CASE 
        WHEN email = 'admin@bkbuilders.com' THEN 'admin123'
        WHEN email = 'manager@bkbuilders.com' THEN 'manager123'
        WHEN email = 'worker@bkbuilders.com' THEN 'worker123'
    END as credentials
FROM users
WHERE email IN ('admin@bkbuilders.com', 'manager@bkbuilders.com', 'worker@bkbuilders.com')
ORDER BY role;
