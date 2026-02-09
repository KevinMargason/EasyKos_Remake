# EasyKos Frontend

Modern Next.js frontend for EasyKos application.

## Features

- Built with Next.js 15 and React 19
- TypeScript for type safety
- Tailwind CSS for styling
- API integration with Laravel backend
- Authentication flow with JWT
- Responsive design
- Ready for Vercel deployment

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Hooks
- **HTTP Client:** Fetch API

## Getting Started

### Prerequisites

- Node.js 18+ or higher
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.local.example .env.local
```

3. Update `.env.local` with your backend API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

4. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── login/             # Login page
│   ├── dashboard/         # Dashboard page
│   ├── rooms/             # Rooms management
│   ├── tenants/           # Tenants management
│   ├── payments/          # Payments management
│   └── achievements/      # Achievements & rewards
├── lib/                   # Utility libraries
│   └── api.ts            # API client
├── public/               # Static assets
└── ...config files

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

The frontend connects to the Laravel backend API using the API client located in `lib/api.ts`.

### Authentication

The app uses JWT tokens for authentication:
- Tokens are stored in localStorage
- Automatically included in API requests
- Redirects to login if token is missing

### Example API Usage

```typescript
import { api } from '@/lib/api';

// Login
const response = await api.login(email, password);
localStorage.setItem('token', response.access_token);

// Get rooms
const token = localStorage.getItem('token');
const rooms = await api.getRooms(token);
```

## Deployment to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL` - Your backend API URL

### Environment Variables

For production deployment, configure these variables in Vercel:

- `NEXT_PUBLIC_API_URL` - Backend API endpoint (e.g., https://api.easykos.com/api)

## Pages

### Login (`/login`)
- User authentication
- Redirects to dashboard on success

### Dashboard (`/dashboard`)
- Overview of the system
- Quick access to all features

### Rooms (`/rooms`)
- List all rooms
- Add new rooms
- Edit/delete rooms

### Tenants (`/tenants`)
- Manage tenant information
- View tenant history

### Payments (`/payments`)
- Track payments
- Payment status

### Achievements (`/achievements`)
- Gamification features
- View rewards

## Development Guidelines

### Adding New Pages

1. Create a new directory in `app/`
2. Add `page.tsx` file
3. Use client components with `'use client'` directive
4. Implement authentication check

### Styling

- Use Tailwind CSS utility classes
- Follow existing component patterns
- Maintain responsive design

## License

MIT License
