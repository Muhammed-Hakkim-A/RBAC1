# 🏗️ BK Builders - Construction Management System

A modern, full-featured construction management system built with **React + Vite** and **Supabase**.

**100% FREE to deploy and run** - No credit card required!

---

## ✨ Features

### 🔐 **Authentication & Authorization**
- Secure email/password authentication via Supabase
- Role-based access control (Admin, Manager, Worker)
- Protected routes and role-based UI

### 📊 **Project Management**
- Create and manage construction projects
- Track project progress with visual indicators
- **Upload full-size construction photos** (2MB, 5MB, 10MB+)
- Site progress tracking with images and descriptions
- Budget and timeline management

### 🔧 **Tools Management**
- Track owned and rental tools
- Tool status monitoring (Available, In-Use, Maintenance)
- Rental cost and vendor tracking
- Location and condition management

### 👷 **Employee Management**
- Comprehensive employee records
- Role assignment and skill tracking
- Salary and site assignment management
- Active/inactive status tracking

### 📸 **Image Upload**
- **Full-size image support** - No compression needed!
- Upload construction photos at original quality
- Stored securely in Supabase Storage
- 1GB free storage (~200-500 full-size images)

---

## 🚀 Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Supabase (PostgreSQL + Storage + Auth)
- **Styling**: Custom CSS with design system
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Deployment**: Vercel/Netlify (FREE)

---

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm
- Supabase account (free, no credit card required)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd RBAC
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

**Follow the complete guide:** `SUPABASE_SETUP.md`

**Quick steps:**
1. Create free Supabase account at https://supabase.com
2. Create new project
3. Copy your Project URL and anon key
4. Update `src/supabase/config.js` with your credentials
5. Run SQL scripts to create database tables
6. Create storage bucket for images
7. Create demo users

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173

### 5. Login with Demo Credentials

- **Admin**: `admin@bkbuilders.com` / `admin123`
- **Manager**: `manager@bkbuilders.com` / `manager123`
- **Worker**: `worker@bkbuilders.com` / `worker123`

---

## 📚 Documentation

- **`SUPABASE_SETUP.md`** - Complete Supabase setup guide (15 min)
- **`QUICK_SUPABASE_SETUP.md`** - Quick reference card
- **`DEPLOYMENT.md`** - Deploy to Vercel/Netlify
- **`FEATURES.md`** - Detailed feature list

---

## 🎯 Key Benefits

### **100% FREE**
- No credit card required
- Free Supabase tier (1GB storage, 2GB bandwidth)
- Free hosting on Vercel/Netlify
- Perfect for small to medium construction companies

### **Full-Size Images**
- Upload construction photos at **original quality**
- Support for 2MB, 5MB, 10MB+ images
- No compression needed
- Store ~200-500 full-size images in free tier

### **Powerful Database**
- PostgreSQL (more powerful than NoSQL)
- Fast queries and better performance
- SQL support for complex operations

### **Production Ready**
- Secure authentication
- Role-based access control
- Responsive design (mobile + desktop)
- Professional UI/UX

---

## 🏗️ Project Structure

```
RBAC/
├── src/
│   ├── components/
│   │   ├── DashboardLayout.jsx    # Main layout with sidebar
│   │   └── Login.jsx               # Login page
│   ├── contexts/
│   │   └── AuthContext.jsx         # Authentication context
│   ├── pages/
│   │   ├── Dashboard.jsx           # Main dashboard
│   │   ├── Projects.jsx            # Project management
│   │   ├── Tools.jsx               # Tools management
│   │   └── Employees.jsx           # Employee management
│   ├── supabase/
│   │   └── config.js               # Supabase configuration
│   ├── App.jsx                     # Main app component
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
├── public/                         # Static assets
├── SUPABASE_SETUP.md              # Setup guide
├── DEPLOYMENT.md                   # Deployment guide
└── package.json                    # Dependencies
```

---

## 🎨 Design System

### **Color Palette**
- **Primary**: Blue (#0066CC, #004C99, #3399FF)
- **Background**: White and light grays
- **Accents**: Blue gradients
- **Status Colors**: Success, Warning, Danger, Info

### **Typography**
- **Headings**: Poppins
- **Body**: Inter
- **Responsive**: Mobile-first design

---

## 🔒 Security

### **Authentication**
- Secure email/password authentication
- JWT tokens managed by Supabase
- Protected routes

### **Authorization**
- Row Level Security (RLS) policies
- Role-based access control
- Admin, Manager, Worker roles

### **Data Protection**
- PostgreSQL with RLS
- Secure storage policies
- HTTPS encryption

---

## 📊 Database Schema

### **Tables**
- `users` - User profiles and roles
- `projects` - Construction projects
- `tools` - Tool inventory
- `employees` - Employee records

### **Storage**
- `project-images` - Construction photos

See `SUPABASE_SETUP.md` for complete SQL schema.

---

## 🚀 Deployment

Deploy to **Vercel** or **Netlify** for FREE:

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

See `DEPLOYMENT.md` for detailed deployment instructions.

---

## 🆘 Troubleshooting

### **Can't login?**
- Verify Supabase config in `src/supabase/config.js`
- Check if demo users are created
- Ensure user profiles exist in `users` table

### **Database errors?**
- Run all SQL scripts from `SUPABASE_SETUP.md`
- Check if tables exist in Supabase dashboard
- Verify RLS policies are enabled

### **Image upload fails?**
- Create `project-images` bucket in Supabase Storage
- Make bucket public
- Add storage policies from setup guide

### **App won't start?**
- Run `npm install`
- Check Node.js version (16+)
- Clear node_modules and reinstall

---

## 📈 Free Tier Limits

### **Supabase Free Tier**
- **Database**: 500MB
- **Storage**: 1GB (~200-500 full-size images)
- **Bandwidth**: 2GB/month
- **Users**: 50,000 monthly active users

**Perfect for:**
- Small to medium construction companies
- 10-50 active projects
- 20-100 employees
- Daily photo uploads

---

## 🛠️ Development

### **Available Scripts**

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🤝 Contributing

This is a private project for BK Builders. For issues or feature requests, contact the development team.

---

## 📝 License

Proprietary - BK Builders © 2026

---

## 🎉 Getting Started

1. **Read** `QUICK_SUPABASE_SETUP.md` for quick overview
2. **Follow** `SUPABASE_SETUP.md` for complete setup (15 min)
3. **Deploy** using `DEPLOYMENT.md` guide
4. **Start building!**

---

## 💡 Tips

### **Image Upload Best Practices**
- Upload photos directly from phone camera
- No need to compress - full-size supported!
- Recommended: 2-5MB per image
- Supported formats: JPG, PNG, WebP

### **Database Best Practices**
- Regular backups (Supabase auto-backs up daily)
- Monitor usage in Supabase dashboard
- Use RLS policies for security

### **Performance Tips**
- Images are cached automatically
- PostgreSQL indexes for fast queries
- Optimized for mobile and desktop

---

**Need Help?**
- Check `SUPABASE_SETUP.md` for setup issues
- See `DEPLOYMENT.md` for deployment help
- Review `FEATURES.md` for feature details

**Happy Building! 🏗️**
