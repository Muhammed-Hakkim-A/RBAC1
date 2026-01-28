-- ============================================
-- CREATE NEW EMPLOYEE (BYPASS RATE LIMIT)
-- Replace the values below with actual employee details
-- ============================================

DO $$
DECLARE
    new_user_id UUID;
BEGIN
    -- Create user in auth.users
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
        'newemployee@example.com',  -- ⚠️ CHANGE THIS
        crypt('password123', gen_salt('bf')),  -- ⚠️ CHANGE THIS
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{}',
        NOW(),
        NOW(),
        ''
    ) RETURNING id INTO new_user_id;

    -- Create user profile
    INSERT INTO users (id, email, name, role, phone, active, created_at)
    VALUES (
        new_user_id,
        'newemployee@example.com',  -- ⚠️ CHANGE THIS (same as above)
        'New Employee Name',         -- ⚠️ CHANGE THIS
        'worker',                    -- Can be: worker, manager, or admin
        '+91 1234567890',           -- ⚠️ CHANGE THIS
        true,
        NOW()
    );

    RAISE NOTICE 'User created successfully with ID: %', new_user_id;
    RAISE NOTICE 'Login: newemployee@example.com / password123';
END $$;
