# 🚀 COMPLETE PRODUCTION SETUP GUIDE
## BK Builders - Backend & Database Configuration

**Complete SQL script to set up your Supabase backend for production**

---

## 📋 Prerequisites

- Supabase account created
- Project created: `https://lketogkgdilevseqwbau.supabase.co`
- SQL Editor access

---

## 🎯 STEP 1: RUN THIS COMPLETE SQL SCRIPT

**Copy this ENTIRE script and run it in Supabase SQL Editor:**

```sql
-- ============================================
-- BK BUILDERS - COMPLETE DATABASE SETUP
-- Production-Ready Configuration
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- STEP 1: CREATE TABLES
-- ============================================

-- Users table (profiles)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'worker')),
    phone TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    client TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget NUMERIC,
    status TEXT NOT NULL CHECK (status IN ('planning', 'in-progress', 'on-hold', 'completed')),
    assigned_team TEXT,
    description TEXT,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    progress_updates JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tools table
CREATE TABLE IF NOT EXISTS tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('owned', 'rental')),
    category TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('available', 'in-use', 'maintenance', 'returned')),
    location TEXT,
    rentalCost NUMERIC,
    rentalStartDate DATE,
    rentalEndDate DATE,
    vendor TEXT,
    condition TEXT CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('worker', 'supervisor', 'engineer', 'manager')),
    address TEXT,
    joinDate DATE NOT NULL,
    salary NUMERIC NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
    skills TEXT,
    assignedSite TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 2: CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_dates ON projects(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_tools_type ON tools(type);
CREATE INDEX IF NOT EXISTS idx_tools_status ON tools(status);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_role ON employees(role);

-- ============================================
-- STEP 3: ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 4: DROP EXISTING POLICIES (CLEAN SLATE)
-- ============================================

-- Users policies
DROP POLICY IF EXISTS "Allow user creation" ON users;
DROP POLICY IF EXISTS "Users can read all users" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable insert during signup" ON users;

-- Projects policies
DROP POLICY IF EXISTS "Anyone can read projects" ON projects;
DROP POLICY IF EXISTS "Managers and admins can manage projects" ON projects;
DROP POLICY IF EXISTS "Managers and admins can create projects" ON projects;
DROP POLICY IF EXISTS "Managers and admins can update projects" ON projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON projects;

-- Tools policies
DROP POLICY IF EXISTS "Anyone can read tools" ON tools;
DROP POLICY IF EXISTS "Managers and admins can manage tools" ON tools;

-- Employees policies
DROP POLICY IF EXISTS "Anyone can read employees" ON employees;
DROP POLICY IF EXISTS "Managers and admins can manage employees" ON employees;

-- ============================================
-- STEP 5: CREATE PRODUCTION-READY RLS POLICIES
-- ============================================

-- USERS TABLE POLICIES
-- Allow anyone to create user profile during signup
CREATE POLICY "Allow user creation"
ON users FOR INSERT
WITH CHECK (true);

-- Allow authenticated users to read all users
CREATE POLICY "Users can read all users"
ON users FOR SELECT
TO authenticated
USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- PROJECTS TABLE POLICIES
-- Allow authenticated users to read all projects
CREATE POLICY "Anyone can read projects"
ON projects FOR SELECT
TO authenticated
USING (true);

-- Allow managers and admins to create projects
CREATE POLICY "Managers and admins can create projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'manager')
    )
);

-- Allow managers and admins to update projects
CREATE POLICY "Managers and admins can update projects"
ON projects FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'manager')
    )
);

-- Allow only admins to delete projects
CREATE POLICY "Admins can delete projects"
ON projects FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role = 'admin'
    )
);

-- TOOLS TABLE POLICIES
-- Allow authenticated users to read all tools
CREATE POLICY "Anyone can read tools"
ON tools FOR SELECT
TO authenticated
USING (true);

-- Allow managers and admins to manage tools
CREATE POLICY "Managers and admins can manage tools"
ON tools FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'manager')
    )
);

-- EMPLOYEES TABLE POLICIES
-- Allow authenticated users to read all employees
CREATE POLICY "Anyone can read employees"
ON employees FOR SELECT
TO authenticated
USING (true);

-- Allow managers and admins to manage employees
CREATE POLICY "Managers and admins can manage employees"
ON employees FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'manager')
    )
);

-- ============================================
-- STEP 6: CREATE ADMIN USER
-- ============================================

DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Create admin auth user
    INSERT INTO auth.users (
        instance_id, id, aud, role, email,
        encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at, confirmation_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated', 'authenticated',
        'admin@bkbuilders.com',
        crypt('admin123', gen_salt('bf')),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{}', NOW(), NOW(), ''
    ) 
    ON CONFLICT (email) DO NOTHING
    RETURNING id INTO admin_user_id;

    -- Create admin profile
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO users (id, email, name, role, phone, active, created_at)
        VALUES (
            admin_user_id,
            'admin@bkbuilders.com',
            'Admin User',
            'admin',
            '+91 9876543210',
            true,
            NOW()
        )
        ON CONFLICT (id) DO NOTHING;
        
        RAISE NOTICE 'Admin user created with ID: %', admin_user_id;
    ELSE
        RAISE NOTICE 'Admin user already exists';
    END IF;
END $$;

-- ============================================
-- STEP 7: CREATE MANAGER USER
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
-- STEP 8: CREATE WORKER USER
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
-- STEP 9: CREATE SAMPLE DATA (OPTIONAL)
-- ============================================

-- Sample project
INSERT INTO projects (name, location, client, start_date, end_date, budget, status, assigned_team, description, progress)
VALUES (
    'Downtown Plaza Construction',
    'Mumbai, Maharashtra',
    'ABC Developers',
    '2026-01-01',
    '2026-12-31',
    50000000,
    'in-progress',
    'Team A',
    'Construction of a modern commercial plaza with retail and office spaces',
    35
)
ON CONFLICT DO NOTHING;

-- Sample tool
INSERT INTO tools (name, type, category, status, location, condition)
VALUES (
    'Excavator CAT 320',
    'owned',
    'Heavy Machinery',
    'available',
    'Site A',
    'good'
)
ON CONFLICT DO NOTHING;

-- Sample employee
INSERT INTO employees (name, email, phone, role, address, joinDate, salary, status, skills, assignedSite)
VALUES (
    'Rajesh Kumar',
    'rajesh@example.com',
    '+91 9876543213',
    'supervisor',
    'Mumbai, Maharashtra',
    '2025-01-15',
    45000,
    'active',
    'Site Management, Safety Compliance',
    'Downtown Plaza'
)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check tables
SELECT 'Tables created:' as status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'projects', 'tools', 'employees');

-- Check users
SELECT 'Users created:' as status;
SELECT email, name, role FROM users;

-- Check RLS policies
SELECT 'RLS Policies:' as status;
SELECT tablename, policyname FROM pg_policies 
WHERE schemaname = 'public';

-- ============================================
-- SETUP COMPLETE!
-- ============================================

SELECT '✅ DATABASE SETUP COMPLETE!' as status;
SELECT 'You can now login with:' as info;
SELECT 'Admin: admin@bkbuilders.com / admin123' as credentials
UNION ALL
SELECT 'Manager: manager@bkbuilders.com / manager123'
UNION ALL
SELECT 'Worker: worker@bkbuilders.com / worker123';
```

---

## 🎯 STEP 2: CONFIGURE STORAGE

**Go to Supabase Dashboard > Storage**

1. Create bucket: `project-images`
2. Make it **public**
3. Run this SQL for storage policies:

```sql
-- Storage policies for project-images bucket
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-images');

CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project-images');

CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'project-images');
```

---

## 🎯 STEP 3: CONFIGURE AUTHENTICATION

**Go to Supabase Dashboard > Authentication > Providers**

1. Click **"Email"**
2. **Disable** "Confirm email" (for easier signup)
3. **Enable** "Allow new signups"
4. Click **"Save"**

---

## 🎯 STEP 4: CONFIGURE RATE LIMITS (OPTIONAL)

**Go to Supabase Dashboard > Authentication > Rate Limits**

For development/testing:
- **Email signups per hour**: 100
- **Email logins per hour**: 100

For production:
- Keep default limits or adjust based on your needs

---

## 🎯 STEP 5: VERIFY SETUP

Run these checks:

### **1. Check Tables**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

Should show: `users`, `projects`, `tools`, `employees`

### **2. Check Users**
```sql
SELECT email, name, role FROM users;
```

Should show 3 users: admin, manager, worker

### **3. Check RLS Policies**
```sql
SELECT tablename, policyname FROM pg_policies;
```

Should show multiple policies for each table

### **4. Check Storage Bucket**
Go to **Storage** > Should see `project-images` bucket

---

## ✅ PRODUCTION CHECKLIST

- [ ] All SQL scripts executed successfully
- [ ] 4 tables created (users, projects, tools, employees)
- [ ] Indexes created
- [ ] RLS enabled on all tables
- [ ] RLS policies created
- [ ] 3 demo users created (admin, manager, worker)
- [ ] Storage bucket `project-images` created
- [ ] Storage policies configured
- [ ] Email authentication configured
- [ ] Rate limits configured
- [ ] Config file updated with Supabase credentials

---

## 🔐 DEFAULT CREDENTIALS

**Admin:**
- Email: `admin@bkbuilders.com`
- Password: `admin123`
- Role: Full access

**Manager:**
- Email: `manager@bkbuilders.com`
- Password: `manager123`
- Role: Can manage projects, tools, employees

**Worker:**
- Email: `worker@bkbuilders.com`
- Password: `worker123`
- Role: View-only access

---

## 🚀 DEPLOYMENT READY

Your backend is now **production-ready** with:

✅ **Security**: Row Level Security enabled  
✅ **Performance**: Indexes on all key columns  
✅ **Authentication**: Email/password with role-based access  
✅ **Storage**: 1GB free for images  
✅ **Scalability**: PostgreSQL database  
✅ **Free**: 100% free tier, no credit card  

---

## 📊 MONITORING

Monitor your database:
1. Go to **Reports** in Supabase
2. Check:
   - Database size
   - Storage usage
   - API requests
   - Active users

---

## 🆘 TROUBLESHOOTING

**If SQL script fails:**
1. Run each section separately
2. Check error messages
3. Ensure extensions are enabled

**If users can't login:**
1. Check if user exists in `auth.users`
2. Check if profile exists in `users` table
3. Verify RLS policies are correct

**If signup fails:**
1. Check rate limits
2. Verify email confirmation is disabled
3. Check RLS policy for user creation

---

## 🎉 YOU'RE DONE!

Your BK Builders backend is **fully configured and production-ready**!

**Next steps:**
1. Test login with demo credentials
2. Create projects and upload images
3. Deploy your frontend to Vercel/Netlify

**Happy Building! 🏗️**
