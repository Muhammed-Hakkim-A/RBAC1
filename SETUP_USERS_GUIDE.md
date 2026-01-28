# 🚀 QUICK SETUP - Demo Users & Signup

## 📝 **Step 1: Create Demo Users (Manager & Worker)**

### **Option A: Run SQL Script (Recommended)**

1. Open Supabase SQL Editor: https://app.supabase.com/project/lketogkgdilevseqwbau/sql
2. Click **"New query"**
3. Copy the entire content from `CREATE_DEMO_USERS.sql`
4. Click **"Run"**
5. You should see: "Manager user created" and "Worker user created"

### **Option B: Manual Creation**

If the script doesn't work, create users one by one:

**For Manager:**
```sql
DO $$
DECLARE
    manager_user_id UUID;
BEGIN
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
    ) RETURNING id INTO manager_user_id;

    INSERT INTO users (id, email, name, role, phone, active)
    VALUES (
        manager_user_id,
        'manager@bkbuilders.com',
        'Manager User',
        'manager',
        '+91 9876543211',
        true
    );
END $$;
```

**For Worker:**
```sql
DO $$
DECLARE
    worker_user_id UUID;
BEGIN
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
    ) RETURNING id INTO worker_user_id;

    INSERT INTO users (id, email, name, role, phone, active)
    VALUES (
        worker_user_id,
        'worker@bkbuilders.com',
        'Worker User',
        'worker',
        '+91 9876543212',
        true
    );
END $$;
```

---

## 📝 **Step 2: Verify Users Created**

Run this to check:
```sql
SELECT email, name, role, active FROM users ORDER BY role;
```

You should see:
- admin@bkbuilders.com (admin)
- manager@bkbuilders.com (manager)
- worker@bkbuilders.com (worker)

---

## 🔐 **Step 3: Test Login**

### **Admin Login:**
- Email: `admin@bkbuilders.com`
- Password: `admin123`
- Access: Full (can create, edit, delete everything)

### **Manager Login:**
- Email: `manager@bkbuilders.com`
- Password: `manager123`
- Access: Can manage projects, tools, employees

### **Worker Login:**
- Email: `worker@bkbuilders.com`
- Password: `worker123`
- Access: View-only

---

## 👥 **Step 4: Test Signup (New Staff)**

### **How Signup Works:**

1. Go to login page: `http://localhost:5173`
2. Click **"Sign Up"** link
3. Fill in:
   - Full Name
   - Phone Number
   - Email
   - Password
4. Click **"Create Account"**
5. **New users get "worker" role by default**

### **Important Notes:**

✅ **Signup is working!** The AuthContext already:
- Creates user in `auth.users`
- Creates profile in `users` table
- Assigns "worker" role by default
- Auto-logs in after signup

⚠️ **Rate Limit:** If you get "email rate limit exceeded":
- Wait 5-10 minutes
- OR create user via SQL (see below)

---

## 🔧 **Step 5: Create New Staff via SQL (If Signup Fails)**

If signup is rate-limited, create users via SQL:

```sql
DO $$
DECLARE
    new_user_id UUID;
BEGIN
    -- Replace with actual details
    INSERT INTO auth.users (
        instance_id, id, aud, role, email,
        encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at, confirmation_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated', 'authenticated',
        'newstaff@example.com',  -- Change this
        crypt('password123', gen_salt('bf')),  -- Change this
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{}', NOW(), NOW(), ''
    ) RETURNING id INTO new_user_id;

    INSERT INTO users (id, email, name, role, phone, active)
    VALUES (
        new_user_id,
        'newstaff@example.com',  -- Change this
        'New Staff Name',         -- Change this
        'worker',                 -- Or 'manager'
        '+91 1234567890',        -- Change this
        true
    );
    
    RAISE NOTICE 'User created with ID: %', new_user_id;
END $$;
```

---

## 🎯 **Step 6: Change User Role (Admin/Manager)**

To promote a user from worker to manager/admin:

### **Via Supabase Dashboard:**
1. Go to **Table Editor** > **users**
2. Find the user
3. Click on their row
4. Change `role` to `admin` or `manager`
5. Click **Save**

### **Via SQL:**
```sql
UPDATE users 
SET role = 'manager'  -- or 'admin'
WHERE email = 'user@example.com';
```

---

## ✅ **Verification Checklist**

- [ ] Admin user exists and can login
- [ ] Manager user exists and can login
- [ ] Worker user exists and can login
- [ ] Signup form appears when clicking "Sign Up"
- [ ] New signups create user in database
- [ ] New signups get "worker" role
- [ ] Users can login after signup

---

## 🐛 **Troubleshooting**

### **"User not found" error:**
- Check if user exists in `auth.users` table
- Check if profile exists in `users` table
- Both must exist with matching IDs

### **"Email rate limit exceeded":**
- Wait 10 minutes
- OR create user via SQL
- OR disable rate limiting in Supabase settings

### **"Permission denied" error:**
- Check RLS policies are correct
- Verify "Allow user creation" policy exists
- Check user's role in database

### **Signup doesn't create profile:**
- Check browser console for errors
- Verify RLS policy allows INSERT
- Check AuthContext signup function

---

## 📊 **Current Status**

### **✅ Working:**
- Admin login
- Signup functionality
- User profile creation
- Role assignment

### **⏳ Need to Create:**
- Manager demo user (run SQL script)
- Worker demo user (run SQL script)

---

## 🚀 **Quick Start**

**To get everything working in 2 minutes:**

1. **Run `CREATE_DEMO_USERS.sql`** in Supabase SQL Editor
2. **Test logins:**
   - Admin: admin@bkbuilders.com / admin123
   - Manager: manager@bkbuilders.com / manager123
   - Worker: worker@bkbuilders.com / worker123
3. **Test signup:** Create a new account
4. **Done!** ✅

---

## 📝 **Notes**

- **Default role for signup:** worker
- **To make someone admin:** Update via SQL or Supabase dashboard
- **Password requirements:** Minimum 6 characters (Supabase default)
- **Email confirmation:** Disabled for easier testing

---

**All set! Your login and signup are ready to use!** 🎉
