# 🚀 SUPABASE MIGRATION - QUICK REFERENCE

## ✅ Migration Complete!

Your BK Builders app now uses **Supabase** instead of Firebase!

---

## 📝 What You Need To Do

### **1. Create Supabase Account (2 minutes)**
1. Go to: https://supabase.com/
2. Sign up (FREE - no credit card!)
3. Create new project: `bk-builders`

### **2. Get Your Credentials (1 minute)**
1. Go to **Settings** > **API**
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...`

### **3. Update Config (1 minute)**
Open: `src/supabase/config.js`

Replace:
```javascript
const supabaseUrl = 'YOUR_PROJECT_URL';
const supabaseAnonKey = 'YOUR_ANON_KEY';
```

### **4. Create Database Tables (3 minutes)**
1. Go to **SQL Editor** in Supabase
2. Copy SQL from `SUPABASE_SETUP.md` (Step 4.2)
3. Click **Run**

### **5. Create Storage Bucket (2 minutes)**
1. Go to **Storage**
2. Create bucket: `project-images`
3. Make it **public**
4. Add policies from `SUPABASE_SETUP.md` (Step 5.3)

### **6. Create Demo Users (5 minutes)**
1. Go to **SQL Editor**
2. Run user creation scripts from `SUPABASE_SETUP.md` (Step 9)
3. Create 3 users: admin, manager, worker

### **7. Test! (1 minute)**
```bash
npm run dev
```

Login with: `admin@bkbuilders.com` / `admin123`

---

## 🎯 Key Benefits

✅ **Full-Size Images** - Upload 2MB, 5MB, 10MB photos  
✅ **100% FREE** - No credit card required  
✅ **1GB Storage** - ~200-500 full-size images  
✅ **Better Performance** - Faster than Firebase  
✅ **PostgreSQL** - More powerful database  

---

## 📚 Full Documentation

- **`SUPABASE_SETUP.md`** - Complete setup guide with SQL scripts
- **`MIGRATION_TO_SUPABASE.md`** - What changed and why

---

## 🆘 Quick Troubleshooting

**Can't login?**
- Check if you created demo users
- Verify config has correct URL and key

**Database errors?**
- Run all SQL scripts from Step 4
- Check if tables exist in Supabase dashboard

**Image upload fails?**
- Create `project-images` bucket
- Make it public
- Add storage policies

---

## ⏱️ Total Time: ~15 minutes

Follow `SUPABASE_SETUP.md` for detailed instructions!

**You're almost there!** 🚀
