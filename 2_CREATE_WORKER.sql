-- ============================================
-- SECTION 2: CREATE WORKER USER
-- Copy and run this after creating manager
-- ============================================

DO $$
DECLARE
    worker_user_id UUID;
BEGIN
    -- Create worker in auth.users
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
        confirmation_token
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
        ''
    )
    ON CONFLICT (email) DO UPDATE SET
        encrypted_password = crypt('worker123', gen_salt('bf'))
    RETURNING id INTO worker_user_id;

    -- If user already existed, get the ID
    IF worker_user_id IS NULL THEN
        SELECT id INTO worker_user_id FROM auth.users WHERE email = 'worker@bkbuilders.com';
    END IF;

    -- Create worker profile
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
        name = 'Worker User',
        role = 'worker',
        phone = '+91 9876543212',
        active = true;

    RAISE NOTICE 'Worker user created/updated successfully';
END $$;
