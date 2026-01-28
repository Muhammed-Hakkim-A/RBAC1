# 🚀 SIMPLE FIX - Step by Step

## ⚠️ The "Database error querying schema" means the SQL was too complex.

## ✅ **SIMPLE SOLUTION - 3 Easy Steps**

### **Step 1: Create Manager User**

1. Open Supabase SQL Editor: https://app.supabase.com/project/lketogkgdilevseqwbau/sql
2. Click **"New query"**
3. Open file: `1_CREATE_MANAGER.sql`
4. Copy **entire content**
5. Paste in SQL Editor
6. Click **"Run"**
7. You should see: "Manager user created/updated successfully"

---

### **Step 2: Create Worker User**

1. Click **"New query"** again
2. Open file: `2_CREATE_WORKER.sql`
3. Copy **entire content**
4. Paste in SQL Editor
5. Click **"Run"**
6. You should see: "Worker user created/updated successfully"

---

### **Step 3: Verify Users**

1. Click **"New query"** again
2. Open file: `3_VERIFY_USERS.sql`
3. Copy **entire content**
4. Paste in SQL Editor
5. Click **"Run"**
6. You should see 3 users:
   - admin@bkbuilders.com (admin)
   - manager@bkbuilders.com (manager)
   - worker@bkbuilders.com (worker)

---

## 🎯 **Test Login**

Now try logging in:

**Manager:**
- Email: `manager@bkbuilders.com`
- Password: `manager123`

**Worker:**
- Email: `worker@bkbuilders.com`
- Password: `worker123`

---

## ✅ **That's It!**

If you see all 3 users in Step 3, login should work!

---

## 🐛 **If Still Not Working:**

### **Check Supabase Config:**

Open `src/supabase/config.js` and verify:

```javascript
const supabaseUrl = 'https://lketogkgdilevseqwbau.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

Make sure both are correct!

---

## 📝 **Files to Use:**

1. **`1_CREATE_MANAGER.sql`** - Run first
2. **`2_CREATE_WORKER.sql`** - Run second  
3. **`3_VERIFY_USERS.sql`** - Run third to verify

---

**Simple, clean, no errors!** 🎉
