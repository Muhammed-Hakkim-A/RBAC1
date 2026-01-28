# 🚀 Supabase Setup Guide for BK Builders

**100% FREE - NO CREDIT CARD REQUIRED - FULL-SIZE IMAGES SUPPORTED!**

Complete step-by-step guide to set up Supabase for your BK Builders application.

## 🎯 Why Supabase?

✅ **1GB Storage FREE** - Upload full-size construction photos (2-5MB each)  
✅ **2GB Bandwidth/month FREE** - More than enough for small-medium companies  
✅ **PostgreSQL Database** - More powerful than Firestore  
✅ **Built-in Authentication** - Secure email/password login  
✅ **No Credit Card Required** - Truly 100% FREE  
✅ **Better Performance** - Faster queries and uploads  

---

## 📋 What You'll Set Up

1. Supabase Project
2. Database Tables
3. Authentication
4. Storage Bucket
5. Security Policies
6. Demo Users

---

## Step 1: Create Supabase Account

### 1.1 Go to Supabase

Visit: [https://supabase.com/](https://supabase.com/)

### 1.2 Sign Up

1. Click **"Start your project"** or **"Sign Up"**
2. Sign up with:
   - GitHub account (recommended)
   - Or email/password
3. **No credit card required!**

---

## Step 2: Create New Project

### 2.1 Create Organization (if first time)

1. Enter organization name: `BK Builders` (or your company name)
2. Click **"Create organization"**

### 2.2 Create Project

1. Click **"New project"**
2. Fill in details:
   - **Name**: `bk-builders`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you (e.g., `Mumbai` for India)
   - **Pricing Plan**: **Free** (already selected)
3. Click **"Create new project"**
4. Wait 1-2 minutes for project setup

---

## Step 3: Get API Keys

### 3.1 Navigate to Settings

1. In your project dashboard
2. Click **"Settings"** (gear icon) in left sidebar
3. Click **"API"**

### 3.2 Copy Your Credentials

You'll see:
- **Project URL**: `https://xxxxx.supabase.co`
- **anon/public key**: `eyJhbGc...` (long string)

**IMPORTANT**: Copy both of these. You'll need them in Step 8.

---

## Step 4: Create Database Tables

### 4.1 Navigate to SQL Editor

1. Click **"SQL Editor"** in left sidebar
2. Click **"New query"**

### 4.2 Run This SQL Script

Copy and paste this entire script, then click **"Run"**:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'worker')),
    phone TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
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
CREATE TABLE tools (
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
CREATE TABLE employees (
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

-- Create indexes for better performance
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_tools_type ON tools(type);
CREATE INDEX idx_tools_status ON tools(status);
CREATE INDEX idx_employees_status ON employees(status);
```

You should see **"Success. No rows returned"** - that's perfect!

---

## Step 5: Set Up Storage

### 5.1 Navigate to Storage

1. Click **"Storage"** in left sidebar
2. Click **"Create a new bucket"**

### 5.2 Create Storage Bucket

1. **Name**: `project-images`
2. **Public bucket**: Toggle **ON** (so images can be viewed)
3. Click **"Create bucket"**

### 5.3 Set Storage Policies

1. Click on `project-images` bucket
2. Click **"Policies"** tab
3. Click **"New policy"**
4. Select **"For full customization"**
5. **Policy name**: `Allow authenticated uploads`
6. **Policy definition**: Paste this:

```sql
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
```

6. Click **"Review"** then **"Save policy"**

---

## Step 6: Set Up Row Level Security (RLS)

### 6.1 Navigate to SQL Editor

Click **"SQL Editor"** > **"New query"**

### 6.2 Run Security Policies

Copy and paste this script, then click **"Run"**:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read all users"
ON users FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Anyone can read projects"
ON projects FOR SELECT
TO authenticated
USING (true);

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

-- Tools policies (same as projects)
CREATE POLICY "Anyone can read tools"
ON tools FOR SELECT
TO authenticated
USING (true);

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

-- Employees policies (same as projects)
CREATE POLICY "Anyone can read employees"
ON employees FOR SELECT
TO authenticated
USING (true);

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
```

---

## Step 7: Enable Email Authentication

### 7.1 Navigate to Authentication

1. Click **"Authentication"** in left sidebar
2. Click **"Providers"**
3. **Email** should already be enabled (it's default)

### 7.2 Configure Email Settings (Optional)

1. Click **"Email"**
2. You can customize email templates later
3. For now, default settings are fine

---

## Step 8: Update Your Application Config

### 8.1 Open Your Project

Navigate to: `src/supabase/config.js`

### 8.2 Replace Configuration

Replace the placeholder values with your Supabase credentials from Step 3:

```javascript
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Get these from: https://app.supabase.com/project/_/settings/api
const supabaseUrl = 'https://xxxxx.supabase.co'; // Your Project URL
const supabaseAnonKey = 'eyJhbGc...'; // Your anon/public key

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
```

### 8.3 Save the File

---

## Step 9: Create Demo Users

### 9.1 Navigate to SQL Editor

Click **"SQL Editor"** > **"New query"**

### 9.2 Create Admin User

Run this script (replace with your desired password):

```sql
-- Create admin user
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@bkbuilders.com',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    FALSE,
    '',
    '',
    '',
    ''
) RETURNING id;
```

**IMPORTANT**: Copy the returned UUID!

### 9.3 Add User Profile

Replace `USER_UUID_HERE` with the UUID from above:

```sql
-- Add admin profile
INSERT INTO users (id, email, name, role, phone, active, created_at)
VALUES (
    'USER_UUID_HERE',
    'admin@bkbuilders.com',
    'Admin User',
    'admin',
    '+91 9876543210',
    true,
    NOW()
);
```

### 9.4 Create Manager and Worker Users

Repeat steps 9.2 and 9.3 for:

**Manager**:
- Email: `manager@bkbuilders.com`
- Password: `manager123`
- Role: `manager`

**Worker**:
- Email: `worker@bkbuilders.com`
- Password: `worker123`
- Role: `worker`

---

## Step 10: Test Your Setup

### 10.1 Run Your Application

```bash
npm run dev
```

### 10.2 Test Login

1. Open `http://localhost:5173`
2. Try logging in with:
   - Email: `admin@bkbuilders.com`
   - Password: `admin123`
3. You should be redirected to the dashboard

### 10.3 Test Features

1. **Dashboard**: Should load with statistics
2. **Projects**: Try creating a new project
3. **Upload Image**: Upload a FULL-SIZE image (2MB, 5MB - any size!)
4. **Tools**: Try adding a tool
5. **Employees**: Try adding an employee

### 10.4 Check Supabase Dashboard

1. Go to **Table Editor**
2. You should see data in:
   - `projects`
   - `tools`
   - `employees`
3. Go to **Storage** > `project-images`
4. You should see uploaded images

---

## ✅ Production Checklist

Before going to production:

- [ ] Supabase config updated in code
- [ ] All three demo users created
- [ ] User profiles added in `users` table
- [ ] Storage bucket created (`project-images`)
- [ ] RLS policies enabled
- [ ] Storage policies set
- [ ] Application tested locally
- [ ] All features working correctly
- [ ] Full-size image upload tested

---

## 📊 Understanding Supabase Limits (Free Tier)

### Database
- **Storage**: 500MB database
- **Bandwidth**: 2GB/month
- **API Requests**: Unlimited

### Storage
- **Storage**: 1GB ✅
- **Bandwidth**: 2GB/month ✅
- **File Size**: No limit per file! ✅

### Authentication
- **Users**: 50,000 monthly active users ✅
- **Email/Password**: Unlimited ✅

**Perfect for construction companies with:**
- 200-500 full-size images (2-5MB each)
- 10-50 active projects
- 20-100 employees
- Unlimited users

---

## 🆘 Troubleshooting

### Issue: "Invalid API key"

**Solution**:
- Check if you copied the correct `anon/public` key (not the `service_role` key)
- Verify the Project URL is correct
- Make sure there are no extra spaces

### Issue: "Row Level Security policy violation"

**Solution**:
- Check if RLS policies are created (Step 6)
- Verify user has correct role in `users` table
- Check if user is authenticated

### Issue: "Storage upload failed"

**Solution**:
- Verify storage bucket `project-images` exists
- Check storage policies are set (Step 5.3)
- Ensure file is an image type

### Issue: Can't login

**Solution**:
- Verify user exists in `auth.users` table
- Check if user profile exists in `users` table
- Try resetting password in Supabase dashboard

---

## 💡 Image Upload Tips

### ✅ **NO COMPRESSION NEEDED!**

With Supabase, you can upload:
- **2MB images** - ✅ Perfect
- **5MB images** - ✅ Perfect
- **10MB images** - ✅ Still works!

### Recommended Workflow:

1. **Take photos** with phone camera (any quality)
2. **Upload directly** - no compression needed
3. **Store ~200-500 images** in free tier
4. **View full-quality** images anytime

---

## 🚀 Advanced Features (Optional)

### Automatic Thumbnails

Add this function to auto-create thumbnails:

```sql
-- Coming soon in documentation
```

### Backup Strategy

Supabase automatically backs up your data daily!

### Monitoring

1. Go to **Reports** in Supabase dashboard
2. Monitor:
   - Database size
   - Storage usage
   - API requests
   - Bandwidth

---

## ✅ Supabase Setup Complete!

Your Supabase backend is now fully configured and ready for production use - **100% FREE with full-size image support!**

**What's Next?**
1. Deploy your application (see DEPLOYMENT.md)
2. Create real user accounts
3. Start uploading construction photos
4. Manage your projects!

---

**Need Help?**
- Supabase Documentation: [https://supabase.com/docs](https://supabase.com/docs)
- Supabase Dashboard: [https://app.supabase.com/](https://app.supabase.com/)
- Check browser console for error messages

**Happy Building with Supabase! 🚀**

**Remember: Upload FULL-SIZE images - 2MB, 5MB, 10MB - ALL SUPPORTED FOR FREE!** 🎉
