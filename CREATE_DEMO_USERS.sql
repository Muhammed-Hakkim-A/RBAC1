-- ============================================
-- CREATE DEMO USERS FOR BK BUILDERS
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- CREATE MANAGER USER
-- ============================================

DO $$
DECLARE
    manager_user_id UUID;
BEGIN
    -- Create manager auth user
    INSERT INTO auth.users (
        instance_id, id, aud, role, email,
        encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at, confirmation_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated', 'authenticated',
        'manager@bkbuilders.com',
        crypt('manager123', gen_salt('bf')),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{}', NOW(), NOW(), ''
    )
    ON CONFLICT (email) DO NOTHING
    RETURNING id INTO manager_user_id;

    -- Create manager profile
    IF manager_user_id IS NOT NULL THEN
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
        ON CONFLICT (id) DO NOTHING;
        
        RAISE NOTICE 'Manager user created with ID: %', manager_user_id;
    ELSE
        RAISE NOTICE 'Manager user already exists';
    END IF;
END $$;

-- ============================================
-- CREATE WORKER USER
-- ============================================

DO $$
DECLARE
    worker_user_id UUID;
BEGIN
    -- Create worker auth user
    INSERT INTO auth.users (
        instance_id, id, aud, role, email,
        encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at, confirmation_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated', 'authenticated',
        'worker@bkbuilders.com',
        crypt('worker123', gen_salt('bf')),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{}', NOW(), NOW(), ''
    )
    ON CONFLICT (email) DO NOTHING
    RETURNING id INTO worker_user_id;

    -- Create worker profile
    IF worker_user_id IS NOT NULL THEN
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
        ON CONFLICT (id) DO NOTHING;
        
        RAISE NOTICE 'Worker user created with ID: %', worker_user_id;
    ELSE
        RAISE NOTICE 'Worker user already exists';
    END IF;
END $$;

-- ============================================
-- VERIFY USERS CREATED
-- ============================================

SELECT 'All demo users:' as status;
SELECT email, name, role, active FROM users ORDER BY role;

-- ============================================
-- CREDENTIALS
-- ============================================

SELECT '✅ Demo users created!' as status;
SELECT 'Login credentials:' as info;
SELECT 'Admin: admin@bkbuilders.com / admin123' as credentials
UNION ALL
SELECT 'Manager: manager@bkbuilders.com / manager123'
UNION ALL
SELECT 'Worker: worker@bkbuilders.com / worker123';
