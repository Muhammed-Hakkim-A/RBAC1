# 🔧 LOGIN & SIGNUP TROUBLESHOOTING GUIDE

## 🚨 **IMMEDIATE FIX**

### **Step 1: Run the Fix Script**
1. Open Supabase SQL Editor: https://app.supabase.com/project/lketogkgdilevseqwbau/sql
2. Copy **entire content** from `FIX_LOGIN_ISSUES.sql`
3. Click **"Run"**
4. Check the output - you should see ✅ messages

### **Step 2: Test Login**
1. Go to `http://localhost:5173`
2. Try logging in with:
   - **Manager:** manager@bkbuilders.com / manager123
   - **Worker:** worker@bkbuilders.com / worker123

---

## 🐛 **COMMON ISSUES & FIXES**

### **Issue 1: "Invalid login credentials"**

**Cause:** User doesn't exist in database

**Fix:**
1. Run `FIX_LOGIN_ISSUES.sql` 
2. This will create manager and worker users
3. Try logging in again

---

### **Issue 2: "Email rate limit exceeded" (Signup)**

**Cause:** Supabase rate limiting

**Fix Option A - Wait:**
- Wait 10-15 minutes
- Try signup again

**Fix Option B - Disable Rate Limiting:**
1. Go to: https://app.supabase.com/project/lketogkgdilevseqwbau/auth/rate-limits
2. Find "Enable rate limiting"
3. Turn it **OFF**
4. Click "Save"

**Fix Option C - Create User via SQL:**
```sql
DO $$
DECLARE
    new_user_id UUID;
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
        'newemployee@example.com',  -- Change this
        crypt('password123', gen_salt('bf')),  -- Change this
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{}', NOW(), NOW(), ''
    ) RETURNING id INTO new_user_id;

    INSERT INTO users (id, email, name, role, phone, active)
    VALUES (
        new_user_id,
        'newemployee@example.com',  -- Change this
        'New Employee',              -- Change this
        'worker',
        '+91 1234567890',           -- Change this
        true
    );
END $$;
```

---

### **Issue 3: "Row-level security policy violation"**

**Cause:** RLS policy blocking user creation

**Fix:**
Run this SQL to check and fix policies:

```sql
-- Check if policy exists
SELECT policyname FROM pg_policies WHERE tablename = 'users';

-- If "Allow user creation" is missing, create it:
CREATE POLICY "Allow user creation"
ON users FOR INSERT
WITH CHECK (true);
```

---

### **Issue 4: Login works but shows blank screen**

**Cause:** User profile missing in `users` table

**Fix:**
```sql
-- Check if profile exists
SELECT * FROM users WHERE email = 'manager@bkbuilders.com';

-- If missing, create it:
INSERT INTO users (id, email, name, role, phone, active)
SELECT 
    id,
    email,
    'Manager User',
    'manager',
    '+91 9876543211',
    true
FROM auth.users
WHERE email = 'manager@bkbuilders.com'
ON CONFLICT (id) DO NOTHING;
```

---

### **Issue 5: "Failed to create account" (Signup)**

**Possible Causes:**
1. Email already exists
2. RLS policy blocking
3. Password too short (min 6 characters)

**Fix:**
1. Try different email
2. Use password with 6+ characters
3. Check browser console for specific error
4. Run `FIX_LOGIN_ISSUES.sql` to verify RLS policies

---

## ✅ **VERIFICATION STEPS**

### **1. Check Users Exist:**
```sql
SELECT email, name, role FROM users;
```
Should show:
- admin@bkbuilders.com (admin)
- manager@bkbuilders.com (manager)
- worker@bkbuilders.com (worker)

### **2. Check Auth Users:**
```sql
SELECT email, email_confirmed_at FROM auth.users;
```
Should show same 3 emails

### **3. Check RLS Policies:**
```sql
SELECT tablename, policyname FROM pg_policies WHERE tablename = 'users';
```
Should show:
- Allow user creation
- Users can read all users
- Users can update own profile

---

## 🎯 **TESTING CHECKLIST**

After running fixes:

- [ ] Admin login works (admin@bkbuilders.com / admin123)
- [ ] Manager login works (manager@bkbuilders.com / manager123)
- [ ] Worker login works (worker@bkbuilders.com / worker123)
- [ ] Signup form appears when clicking "Sign Up"
- [ ] Can create new account with unique email
- [ ] New account gets "worker" role
- [ ] Can login with newly created account
- [ ] Error messages show when login fails
- [ ] Loading spinner shows during login

---

## 🔍 **DEBUGGING TIPS**

### **Check Browser Console:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try logging in
4. Look for error messages

### **Common Console Errors:**

**"Invalid login credentials"**
- User doesn't exist
- Wrong password
- Run `FIX_LOGIN_ISSUES.sql`

**"Failed to fetch"**
- Network issue
- Check Supabase URL in `src/supabase/config.js`
- Check internet connection

**"Row-level security policy violation"**
- RLS blocking operation
- Run policy fix SQL above

---

## 📊 **WHAT WAS FIXED**

### **Login Component (`src/components/Login.jsx`):**
✅ Fixed error handling
✅ Added proper error messages
✅ Fixed loading state management
✅ Prevented navigation on error
✅ Better error display

### **Changes Made:**
- Error handling now properly stops execution
- Loading state resets on error
- User-friendly error messages
- Proper return on error

---

## 🚀 **QUICK FIX SUMMARY**

**For Login Issues:**
1. Run `FIX_LOGIN_ISSUES.sql`
2. Test all 3 logins
3. ✅ Done!

**For Signup Issues:**
1. Disable rate limiting OR wait 10 min
2. Use unique email
3. Use 6+ character password
4. ✅ Done!

---

## 📝 **CREDENTIALS REFERENCE**

**Admin:**
- Email: admin@bkbuilders.com
- Password: admin123
- Role: admin (full access)

**Manager:**
- Email: manager@bkbuilders.com
- Password: manager123
- Role: manager (can manage projects/tools/employees)

**Worker:**
- Email: worker@bkbuilders.com
- Password: worker123
- Role: worker (view only)

---

## 🆘 **STILL NOT WORKING?**

### **Check These:**

1. **Supabase Config:**
   - Open `src/supabase/config.js`
   - Verify URL and anon key are correct
   - URL should be: `https://lketogkgdilevseqwbau.supabase.co`

2. **Database Connection:**
   - Go to Supabase dashboard
   - Check if project is active
   - Check if database is running

3. **Browser Issues:**
   - Clear browser cache
   - Try incognito mode
   - Try different browser

4. **Network Issues:**
   - Check internet connection
   - Check if Supabase is accessible
   - Try: `ping lketogkgdilevseqwbau.supabase.co`

---

## ✅ **EXPECTED BEHAVIOR**

### **Successful Login:**
1. Enter email and password
2. Click "Sign In"
3. See loading spinner
4. Redirect to dashboard
5. See user name in navbar

### **Failed Login:**
1. Enter wrong credentials
2. Click "Sign In"
3. See error message: "Invalid email or password"
4. Stay on login page
5. Can try again

### **Successful Signup:**
1. Click "Sign Up"
2. Fill in all fields
3. Click "Create Account"
4. Account created
5. Auto-login
6. Redirect to dashboard

### **Failed Signup:**
1. Fill in fields
2. Click "Create Account"
3. See specific error message
4. Stay on signup form
5. Can fix and try again

---

**Run `FIX_LOGIN_ISSUES.sql` and everything should work!** 🎉
