# EasyKos Remake - Modern Architecture

Modern full-stack boarding house (kos) management system with gamification features, migrated from monolithic Ionic/Laravel/MySQL to Next.js/Laravel API/MongoDB architecture.

## 🏗️ Architecture Overview

This project uses a modern, scalable architecture:

- **Frontend:** Next.js 15 with TypeScript and Tailwind CSS (deployable to Vercel)
- **Backend:** Laravel 12 API with Sanctum authentication (deployable to any Laravel host)
- **Database:** MongoDB (Atlas/cloud) for production, SQLite for local development

## 📁 Project Structure

```
EasyKos_Remake/
├── app/              # Next.js App Router pages
├── component/        # React components
├── core/             # Redux store, hooks, services
├── lib/              # API client and utilities
├── public/           # Static assets
├── backend/          # Laravel API backend
│   ├── app/          # Laravel application code
│   ├── config/       # Configuration files
│   ├── routes/       # API routes
│   └── ...
└── README.md         # This file
```

## ✨ Features

### Core Features

- **Room Management** - Add, edit, delete, and track room availability
- **Tenant Management** - Manage tenant information, contracts, and history
- **Payment Tracking** - Record and monitor rent and utility payments
- **Dashboard** - Overview of occupancy, payments, and statistics

### Gamification Features

- **Achievements System** - Reward tenants for good behavior
- **Points & Rewards** - Earn points and redeem rewards
- **Leaderboards** - Foster positive competition

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (for frontend)
- **PHP** 8.3+ (for backend)
- **Composer** (for backend dependencies)
- **MongoDB** (for production) or SQLite (for development)

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
composer install
```

3. Configure environment:

```bash
cp .env.example .env
php artisan key:generate
```

4. Run migrations:

```bash
php artisan migrate
```

5. Start development server:

```bash
php artisan serve
```

Backend will be available at `http://localhost:8000`

See [backend/README.md](backend/README.md) for detailed setup instructions.

### Frontend Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.local.example .env.local
```

3. Update `.env.local` with backend API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

4. Start development server:

```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## 🔒 Authentication

The application uses JWT token-based authentication:

1. Users register or login via the frontend
2. Backend issues a JWT token via Laravel Sanctum
3. Token is stored in localStorage
4. Token is included in all subsequent API requests

## 📱 Pages & Features

### Public Pages

- `/login` - User authentication

### Protected Pages (require authentication)

- `/dashboard` - Main dashboard with statistics
- `/rooms` - Room management interface
- `/tenants` - Tenant management interface
- `/payments` - Payment tracking interface
- `/achievements` - View achievements and rewards

## 🗄️ Database Configuration

### Local Development (SQLite)

By default, the backend uses SQLite for local development. No additional configuration needed.

### Production (MongoDB Atlas)

1. Create MongoDB Atlas cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. Install MongoDB package in backend:

```bash
cd backend
composer require mongodb/laravel-mongodb
```

3. Update `backend/.env`:

```env
DB_CONNECTION=mongodb
DB_DSN=mongodb+srv://username:password@cluster.mongodb.net/easykos?retryWrites=true&w=majority
DB_DATABASE=easykos
```

4. Update models to use MongoDB connection (if needed)

## 🚢 Deployment

### Frontend Deployment (Vercel)

1. Push code to GitHub

2. Import project in Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select repository
   - Root directory is already set to project root (no additional configuration needed)

3. Configure environment variables:
   - `NEXT_PUBLIC_API_URL` - Your backend API URL

4. Deploy!

### Backend Deployment

The Laravel backend can be deployed to various platforms:

- **Heroku** - [See Laravel Heroku docs](https://devcenter.heroku.com/articles/getting-started-with-laravel)
- **DigitalOcean App Platform** - Laravel ready deployment
- **AWS** - Using Laravel Vapor or traditional EC2
- **Shared Hosting** - Any hosting with PHP 8.3+

Key deployment steps:

1. Set environment variables (especially `APP_KEY`, database credentials)
2. Run `composer install --no-dev`
3. Run `php artisan migrate`
4. Configure web server to point to `public/` directory

## 🔑 Environment Variables

### Backend (.env)

```env
APP_NAME="EasyKos API"
APP_ENV=production
APP_KEY=base64:xxx
APP_DEBUG=false
APP_URL=https://api.yourdomain.com

DB_CONNECTION=mongodb
DB_DSN=mongodb+srv://user:pass@cluster.mongodb.net/easykos

FRONTEND_URL=https://yourdomain.com
SANCTUM_STATEFUL_DOMAINS=yourdomain.com
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_APP_NAME=EasyKos
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/me` - Get current user

### Resource Endpoints

All resource endpoints require authentication (Bearer token in Authorization header):

- **Rooms:** `/api/rooms` - Full CRUD operations
- **Tenants:** `/api/tenants` - Full CRUD operations
- **Payments:** `/api/payments` - Full CRUD operations
- **Achievements:** `/api/achievements` - List and create
- **Rewards:** `/api/rewards` - List, create, and claim

## 🛠️ Development

### Running Tests

Backend:

```bash
cd backend
php artisan test
```

Frontend:

```bash
npm run test
```

### Code Linting

Backend (Laravel Pint):

```bash
cd backend
./vendor/bin/pint
```

Frontend (ESLint):

```bash
npm run lint
```

## 🔄 Migration from Monolith

This project represents a complete architectural migration:

**From:**

- Monolithic Ionic + Laravel + MySQL application
- Coupled frontend and backend
- Traditional SQL database

**To:**

- Decoupled Next.js frontend + Laravel API backend
- Modern React-based UI with TypeScript
- MongoDB for flexible, scalable data storage
- Ready for cloud deployment (Vercel + MongoDB Atlas)

## 📝 License

MIT License

## 👥 Contributing

This is a competition/learning project. Feel free to fork and adapt for your own use!

## 🆘 Support

For issues and questions:

- Review environment configuration
- Ensure all dependencies are installed
- Verify database connections
- Check backend/README.md for backend-specific setup

## 🎯 Roadmap

- [x] Backend API structure with Laravel
- [x] Frontend with Next.js and authentication
- [x] Basic CRUD operations
- [ ] Complete all CRUD interfaces
- [ ] Implement full gamification system
- [ ] Add real-time notifications
- [ ] Mobile responsive enhancements
- [ ] Advanced reporting and analytics
- [ ] Multi-language support
