# 🚫 FIX: Email Rate Limit Exceeded

## ⚡ **FASTEST FIX (Recommended)**

### **Disable Rate Limiting:**

1. **Go to:** https://app.supabase.com/project/lketogkgdilevseqwbau/auth/rate-limits

2. **Find:** "Enable rate limiting" toggle

3. **Turn it OFF** (slide to left)

4. **Click "Save"**

5. **Done!** Try signup immediately

---

## 🔢 **ALTERNATIVE: Increase Limits**

If you want to keep rate limiting but allow more signups:

1. **Go to:** https://app.supabase.com/project/lketogkgdilevseqwbau/auth/rate-limits

2. **Find:** "Email signups per hour"

3. **Change to:** 100 (or higher)

4. **Click "Save"**

5. **Wait 5 minutes**, then try signup

---

## 💻 **CREATE USER VIA SQL (Bypass Completely)**

If you need to create a user RIGHT NOW:

### **Step 1: Open the SQL File**
- File: `CREATE_NEW_EMPLOYEE.sql`

### **Step 2: Edit These Lines:**
```sql
'newemployee@example.com',  -- Change to actual email
crypt('password123', gen_salt('bf')),  -- Change password
'New Employee Name',  -- Change to actual name
'+91 1234567890',  -- Change to actual phone
```

### **Step 3: Run in Supabase**
1. Copy entire file content
2. Paste in Supabase SQL Editor
3. Click "Run"
4. User created! ✅

### **Step 4: Login**
Use the email and password you set in the SQL

---

## 🎯 **WHICH OPTION TO CHOOSE?**

### **For Development/Testing:**
✅ **Option 1: Disable Rate Limiting**
- Fastest
- No limits
- Can signup unlimited times
- Perfect for testing

### **For Production:**
✅ **Option 2: Increase Limits**
- Keeps some security
- Allows more signups
- Prevents abuse
- Good balance

### **For Immediate Need:**
✅ **Option 3: SQL Creation**
- Bypasses all limits
- Create user instantly
- No waiting
- Good for adding specific employees

---

## 📊 **CURRENT SITUATION**

**Problem:** Supabase is blocking signups because you've tried too many times in a short period.

**Why:** Security feature to prevent spam/abuse

**Solution:** Disable rate limiting (for development) OR wait 1 hour OR create via SQL

---

## ⏰ **WAIT TIME**

If you don't want to disable rate limiting:

- **Default limit:** Usually 30 signups per hour
- **Reset time:** 1 hour from first signup attempt
- **Current status:** Rate limit active
- **Action:** Wait 1 hour OR disable rate limiting

---

## ✅ **RECOMMENDED STEPS**

**For NOW (Development):**
1. Disable rate limiting (Option 1)
2. Test signup freely
3. Create all demo users you need

**For LATER (Production):**
1. Re-enable rate limiting
2. Set reasonable limits (e.g., 100/hour)
3. Monitor signup activity

---

## 🔍 **VERIFY RATE LIMIT SETTINGS**

After changing settings, verify:

1. Go to: https://app.supabase.com/project/lketogkgdilevseqwbau/auth/rate-limits

2. Check:
   - "Enable rate limiting" = OFF (for dev)
   - OR "Email signups per hour" = 100+ (for prod)

3. Click "Save" if you made changes

4. Try signup again

---

## 🎉 **AFTER FIXING**

Once rate limiting is disabled or increased:

1. ✅ Signup will work immediately
2. ✅ Can create unlimited accounts (if disabled)
3. ✅ No more "rate limit exceeded" errors
4. ✅ Can test signup freely

---

## 📝 **QUICK REFERENCE**

**Disable Rate Limiting:**
- URL: https://app.supabase.com/project/lketogkgdilevseqwbau/auth/rate-limits
- Toggle: "Enable rate limiting" → OFF
- Effect: Immediate

**Create User via SQL:**
- File: `CREATE_NEW_EMPLOYEE.sql`
- Edit: Email, password, name, phone
- Run: In Supabase SQL Editor
- Effect: Instant user creation

---

**Choose Option 1 (disable rate limiting) for fastest fix!** ⚡
