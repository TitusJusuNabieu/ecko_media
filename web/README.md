# 📻 Ecko Media - Complete System Documentation

> Ecko Media, connecting voices Since 2021
> Bo, Sierra Leone 🇸🇱

## 🌟 System Overview

A modern, professional radio station management platform built with Next.js 15, featuring:
- **Public Website** - Live streaming, programs, sermons, articles
- **Admin Portal** - Comprehensive management dashboard
- **Mobile App Backend** - Unified API for mobile applications
- **Role-Based Access** - Admin, Editor, Writer, Moderator roles

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Database Setup](#-database-setup)
- [Environment Configuration](#-environment-configuration)
- [Running the Application](#-running-the-application)
- [Admin Portal](#-admin-portal)
- [Database Seeding](#-database-seeding)
- [API Endpoints](#-api-endpoints)
- [User Roles & Permissions](#-user-roles--permissions)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Security](#-security)
- [Troubleshooting](#-troubleshooting)

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 3. Setup database
mysql -u root -p < database/schema.sql

# 4. Seed demo users
npm run seed:users

# 5. Start development server
npm run dev

# 6. Access the application
# Website: http://localhost:3000
# Admin: http://localhost:3000/admin/login
```

**Demo Admin Login:**
- Email: `admin@eckomedia.sl`
- Password: `Admin123!`

---

## ✨ Features

### 🌐 Public Website

- **Live Radio Streaming** - 24/7 broadcasting via stream integration
- **Program Schedule** - Daily and weekly program listings
- **Job Listings** - Current open positions and career opportunities
- **News & Articles** - Blog posts and announcements
- **About Section** - Mission, vision, team, and branches
- **Contact Form** - Reach out to the station
- **Song Requests** - Interactive listener engagement
- **Shoutouts** - Send messages on air
- **Responsive Design** - Mobile, tablet, and desktop optimized

### 🎛️ Admin Portal

- **Modern Dashboard** - Analytics, statistics, and quick actions
- **User Management** - CRUD operations for all user roles
- **Content Management** - Articles, programs, and sermons
- **Station Management** - Configure streaming and settings
- **Contact Messages** - View and respond to inquiries
- **Donations Tracking** - Monitor financial contributions
- **Statistics Dashboard** - Real-time listener counts and engagement
- **Role-Based Access** - Granular permission control

### 📱 Mobile App Support

- **Unified API** - Same backend serves web and mobile
- **RESTful Endpoints** - JSON responses for mobile integration
- **Push Notifications** - Ready for implementation
- **User Authentication** - JWT-based secure sessions

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **ShadCN UI** - Beautiful component library
- **Radix UI** - Accessible primitives
- **Lucide React** - Modern icon library

### Backend
- **Next.js API Routes** - Serverless functions
- **MySQL** - Relational database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Zod** - Schema validation

### Development
- **ESLint** - Code linting
- **TypeScript** - Static typing
- **Git** - Version control

---

## 💾 Installation

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **MySQL** 5.7+ or 8.0+
- **Git**

### Step-by-Step Installation

```bash
# Clone the repository
git clone <repository-url>
cd web

# Install dependencies
npm install

# Verify installation
npm run build
```

---

## 🗄️ Database Setup

### 1. Create Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE ecko_media CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 2. Apply Schema

```bash
mysql -u root -p ecko_media < database/schema.sql
```

### 3. Seed Sample Data (Optional)

```bash
# Add stations, programs, articles, sermons
mysql -u root -p ecko_media < database/seed.sql

# Then seed users with proper password hashing
npm run seed:users
```

### 4. Verify Tables

```bash
mysql -u root -p ecko_media -e "SHOW TABLES;"
```

Expected tables:
- users
- stations
- programs
- articles
- sermons
- donations
- careers
- contact_messages
- song_requests
- shoutouts
- ministry_info

---

## ⚙️ Environment Configuration

Create `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ecko_media

# JWT Secret (Generate a random string)
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random

# Application
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000

# Streaming (Optional)
STREAM_URL=http://stream.eckomedia.sl:8000/live.mp3

# YouTube API (Optional)
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CHANNEL_ID=your_channel_id
```

### Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```
Access at: `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

---

## 🎛️ Admin Portal

### Accessing Admin Panel

**URLs:**
- Login: `/login` or `/admin/login`
- Dashboard: `/admin/dashboard`
- User Management: `/admin/users`

### Features

#### Dashboard (`/admin/dashboard`)
- **Statistics Cards**
  - Active listeners
  - Total articles
  - Monthly donations
  - Weekly requests/shoutouts
  - System status
- **Quick Actions**
  - Manage Stations
  - Content Management
  - User Management
  - Job Listings
- **Trend Indicators** (up/down arrows)

#### User Management (`/admin/users`)
- View all users in table format
- Search and filter
- Create new users
- Edit user details
- Change user roles
- Delete users (except super admin)
- Role badges (Admin, Editor, Writer, Moderator)
- Avatar display

#### Navigation
- **Collapsible Sidebar** - Desktop navigation
- **Hamburger Menu** - Mobile navigation
- **Global Search** - Search functionality
- **Live Indicator** - Broadcasting status
- **Notifications** - Bell icon with badge
- **User Profile** - Dropdown menu

---

## 🌱 Database Seeding

### Quick Seed

```bash
npm run seed:users
```

### What Gets Created

**11 Demo Users** across all roles:

#### 👑 Admin Users (3)
| Email | Password | Deletable |
|-------|----------|-----------|
| admin@eckomedia.sl | Admin123! | ⚠️ Protected |
| john.admin@eckomedia.sl | Admin123! | ✅ Yes |
| mary.admin@eckomedia.sl | Admin123! | ✅ Yes |

#### ✏️ Editor Users (3)
| Email | Password |
|-------|----------|
| sarah.editor@eckomedia.sl | Editor123! |
| david.editor@eckomedia.sl | Editor123! |
| grace.editor@eckomedia.sl | Editor123! |

#### 📝 Writer Users (2)
| Email | Password |
|-------|----------|
| samuel.writer@eckomedia.sl | Writer123! |
| ruth.writer@eckomedia.sl | Writer123! |

#### 🛡️ Moderator Users (3)
| Email | Password |
|-------|----------|
| james.mod@eckomedia.sl | Mod123! |
| rebecca.mod@eckomedia.sl | Mod123! |
| emmanuel.mod@eckomedia.sl | Mod123! |

### Features
- ✅ Bcrypt hashed passwords (secure)
- ✅ Auto-generated colorful avatars
- ✅ Duplicate prevention
- ✅ All users manageable from admin panel
- ✅ Can delete all except super admin

### Manual Database Operations

```bash
# List all users
mysql -u root -p ecko_media -e "SELECT id, email, name, role FROM users;"

# Delete specific user
mysql -u root -p ecko_media -e "DELETE FROM users WHERE email='user@example.com';"

# Clear all demo users
mysql -u root -p ecko_media -e "DELETE FROM users WHERE email LIKE '%@eckomedia.sl';"
```

---

## 🔌 API Endpoints

### Public APIs

#### Stations
- `GET /api/stations` - List all stations
- `GET /api/stations/:id` - Get station details
- `POST /api/stations/:id/listen` - Increment listener count
- `POST /api/stations/:id/stop` - Decrement listener count

#### Programs
- `GET /api/programs` - List all programs

#### Articles
- `GET /api/articles` - List articles
- `GET /api/articles/:slug` - Get article by slug

#### Job Listings
- `GET /api/job-listings` - List job listings

#### Contact
- `POST /api/contact` - Submit contact form

#### Requests & Shoutouts
- `POST /api/song-requests` - Submit song request
- `POST /api/shoutouts` - Submit shoutout

#### Donations
- `POST /api/donations` - Submit donation

### Admin APIs (Protected)

#### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

#### Admin Management
- `GET /api/admin/users` - List users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/statistics` - Get dashboard stats
- `GET /api/admin/stations` - Manage stations
- `GET /api/admin/articles` - Manage articles

---

## 👥 User Roles & Permissions

### Admin
- ✅ Full system access
- ✅ Manage all content
- ✅ User management (create, edit, delete)
- ✅ System configuration
- ✅ View all statistics
- ✅ Access to all features

### Editor
- ✅ Create and edit content
- ✅ Manage programs and articles
- ✅ Publish content
- ❌ User management
- ❌ System configuration

### Writer
- ✅ Create articles
- ✅ Edit own content
- ❌ Publish (needs approval)
- ❌ User management
- ❌ System configuration

### Moderator
- ✅ Moderate comments
- ✅ Manage requests and shoutouts
- ✅ View contact messages
- ❌ Content creation
- ❌ User management

---

## 📁 Project Structure

```
web/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── admin/             # Admin portal pages
│   │   │   ├── dashboard/     # Dashboard page
│   │   │   ├── login/         # Login page
│   │   │   ├── users/         # User management
│   │   │   └── page.tsx       # Admin redirect
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication
│   │   │   ├── admin/         # Admin APIs
│   │   │   ├── stations/      # Station APIs
│   │   │   └── ...
│   │   ├── login/             # Public login redirect
│   │   ├── programs/          # Programs page
│   │   ├── job-listings/     # Job listings page
│   │   ├── about/             # About page
│   │   ├── contact/           # Contact page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   ├── loading.tsx        # Loading state
│   │   ├── not-found.tsx      # 404 page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── AdminLayout.tsx    # Admin wrapper
│   │   ├── Navbar.tsx         # Public navbar
│   │   ├── Footer.tsx         # Footer
│   │   ├── AudioPlayer.tsx    # Streaming player
│   │   └── ui/                # UI components
│   ├── lib/                   # Utilities
│   │   ├── db.ts             # Database connection
│   │   ├── auth.ts           # Authentication
│   │   └── validation.ts     # Validation schemas
│   ├── types/                 # TypeScript types
│   └── middleware.ts          # Next.js middleware
├── database/
│   ├── schema.sql            # Database schema
│   ├── seed.sql              # Sample data
│   └── seed_users.sql        # User seed data
├── scripts/
│   └── seed-users.js         # Seeding script
├── public/                    # Static assets
├── .env                       # Environment variables
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # Tailwind config
├── next.config.ts            # Next.js config
└── README.md                 # This file
```

---

## 🚀 Deployment

### Production Checklist

- [ ] Update environment variables
- [ ] Change JWT secret
- [ ] Delete demo users
- [ ] Create real admin accounts
- [ ] Configure production database
- [ ] Set up SSL certificate
- [ ] Configure streaming URLs
- [ ] Test all features
- [ ] Set up monitoring
- [ ] Configure backups

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### Deploy to VPS

```bash
# Build application
npm run build

# Use PM2 for process management
npm install -g pm2
pm2 start npm --name "radio-website" -- start
pm2 save
pm2 startup
```

---

## 🔐 Security

### Best Practices

1. **Environment Variables**
   - Never commit `.env` to version control
   - Use different secrets for dev/prod
   - Generate strong JWT secrets

2. **User Management**
   - Change default passwords immediately
   - Use strong password policies
   - Enable 2FA (if implemented)
   - Regular security audits

3. **Database**
   - Use prepared statements (already implemented)
   - Regular backups
   - Restrict database access
   - Monitor queries

4. **API Security**
   - JWT authentication (implemented)
   - Input validation with Zod (implemented)
   - Rate limiting (recommended)
   - CORS configuration

5. **Password Security**
   - Bcrypt hashing with 10 rounds (implemented)
   - Never log passwords
   - Password reset functionality
   - Account lockout after failures

---

## 🐛 Troubleshooting

### Database Connection Issues

**Problem:** Cannot connect to database

**Solutions:**
```bash
# Check if MySQL is running
mysql -V

# Test connection
mysql -u root -p

# Verify credentials in .env
cat .env | grep DB_

# Create database if missing
mysql -u root -p -e "CREATE DATABASE ecko_media;"
```

### Build Errors

**Problem:** Build fails with TypeScript errors

**Solutions:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npx tsc --noEmit
```

### Login Issues

**Problem:** Can't login with seeded credentials

**Solutions:**
```bash
# Verify users exist
mysql -u root -p ecko_media -e "SELECT email, role FROM users;"

# Check JWT secret is set
cat .env | grep JWT_SECRET

# Reseed users
npm run seed:users
```

### Port Already in Use

**Problem:** Port 3000 is already in use

**Solutions:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Streaming Issues

**Problem:** Radio stream not playing

**Solutions:**
- Check stream URL in database
- Verify stream server is running
- Test stream URL directly in browser
- Check CORS configuration

---

## 📊 Performance Optimization

### Implemented
- ✅ Code splitting (Next.js automatic)
- ✅ Image optimization
- ✅ Server-side rendering
- ✅ Static generation where possible
- ✅ Optimized bundle size (~102KB shared)

### Recommended
- [ ] Enable Redis caching
- [ ] CDN for static assets
- [ ] Database query optimization
- [ ] API response caching
- [ ] Lazy loading images

---

## 🧪 Testing

### Manual Testing Checklist

#### Public Website
- [ ] Homepage loads correctly
- [ ] Radio stream plays
- [ ] Program schedule displays
- [ ] Articles load
- [ ] Contact form submits
- [ ] Song request form works
- [ ] Mobile responsive

#### Admin Portal
- [ ] Login with demo credentials
- [ ] Dashboard shows statistics
- [ ] Can view users list
- [ ] Can create new user
- [ ] Can edit user
- [ ] Can delete user (not super admin)
- [ ] Search works
- [ ] Mobile menu functions

#### APIs
- [ ] Authentication endpoints work
- [ ] Protected routes require login
- [ ] Public APIs accessible
- [ ] Error responses are proper
- [ ] Validation works

---

## 📝 Development Workflow

### Adding New Features

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Develop Feature**
   - Write code
   - Test locally
   - Update types if needed

3. **Test Changes**
   ```bash
   npm run build
   npm run lint
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Merge to Main**
   ```bash
   git checkout main
   git merge feature/new-feature
   ```

---

## 🎨 Customization

### Branding

**Colors** (`src/app/globals.css`):
```css
--primary: 45 100% 50%;     /* Gold */
--secondary: 237 44% 13%;   /* Navy */
```

**Logo** (Multiple locations):
- `src/components/Navbar.tsx`
- `src/components/AdminLayout.tsx`

**Site Name**:
- Update in layout files
- Update in metadata

### Adding New User Roles

1. Update database schema
2. Add role to TypeScript types
3. Update API validation
4. Add role to seeder
5. Update permission checks

---

## 🤝 Contributing

### Code Style
- TypeScript strict mode
- ESLint configuration
- Consistent naming conventions
- Comment complex logic

### Pull Requests
- Clear description
- Test all changes
- Update documentation
- Follow existing patterns

---

## 📞 Support

### Getting Help

1. Check this README
2. Review code comments
3. Test in development first
4. Check error logs

### Common Issues

- Database connection → Check `.env`
- Build errors → Clear cache
- Login fails → Reseed users
- Port in use → Kill process

---

## 📜 License

This project is proprietary software for Ecko Media.
All rights reserved.

---

## 🎉 Credits

**Built for:** Ecko Media
**Location:** Bo, Sierra Leone 🇸🇱
**Mission:** Broadcasting the Good News and Reaching the Unreached
**Since:** 2003

**Technology Stack:**
- Next.js 15
- TypeScript
- Tailwind CSS
- MySQL
- ShadCN UI

---

## 📈 Version History

### Version 2.0.0 (Current)
- ✅ Complete UI/UX overhaul
- ✅ Professional admin portal
- ✅ Enhanced user management
- ✅ Modern responsive design
- ✅ Database seeding system
- ✅ Comprehensive documentation

### Version 1.0.0
- Initial release
- Basic functionality
- Simple admin panel

---

## 🎯 Quick Commands Reference

```bash
# Installation
npm install

# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm start                      # Start production server
npm run lint                   # Run linter

# Database
npm run seed:users             # Seed demo users

# Access
http://localhost:3000          # Public website
http://localhost:3000/login    # Login page
http://localhost:3000/admin    # Admin dashboard
```

---

**🎙️ Ecko Media - Broadcasting Excellence Since 2003**

*For technical support or questions, contact the development team.*

**Last Updated:** January 15, 2026
**Version:** 2.0.0
