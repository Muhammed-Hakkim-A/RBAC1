-- ============================================
-- SIMPLE FIX - RUN EACH SECTION SEPARATELY
-- Copy and run ONE section at a time
-- ============================================

-- ============================================
-- SECTION 1: CREATE MANAGER USER
-- Copy and run this first
-- ============================================

DO $$
DECLARE
    manager_user_id UUID;
BEGIN
    -- Create manager in auth.users
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
        'manager@bkbuilders.com',
        crypt('manager123', gen_salt('bf')),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{}',
        NOW(),
        NOW(),
        ''
    )
    ON CONFLICT (email) DO UPDATE SET
        encrypted_password = crypt('manager123', gen_salt('bf'))
    RETURNING id INTO manager_user_id;

    -- If user already existed, get the ID
    IF manager_user_id IS NULL THEN
        SELECT id INTO manager_user_id FROM auth.users WHERE email = 'manager@bkbuilders.com';
    END IF;

    -- Create manager profile
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
        name = 'Manager User',
        role = 'manager',
        phone = '+91 9876543211',
        active = true;

    RAISE NOTICE 'Manager user created/updated successfully';
END $$;
