# EasyKos Backend API

Modern Laravel API backend for EasyKos application with MongoDB support.

## Features

- RESTful API architecture
- JWT authentication with Laravel Sanctum
- MongoDB database support (ready for production)
- CORS enabled for frontend access
- Modular structure for easy scaling

## Tech Stack

- **Framework:** Laravel 12.x
- **Authentication:** Laravel Sanctum
- **Database:** MongoDB (production) / SQLite (development)
- **PHP:** 8.3+

## Installation

### Prerequisites

- PHP 8.3 or higher
- Composer
- MongoDB extension for PHP (for production)

### Setup

1. Install dependencies:
```bash
composer install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Generate application key:
```bash
php artisan key:generate
```

4. Run migrations (SQLite for local development):
```bash
php artisan migrate
```

5. Start development server:
```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user (protected)
- `GET /api/me` - Get current user (protected)

### Rooms
- `GET /api/rooms` - List all rooms
- `POST /api/rooms` - Create new room
- `GET /api/rooms/{id}` - Get room details
- `PUT/PATCH /api/rooms/{id}` - Update room
- `DELETE /api/rooms/{id}` - Delete room

### Tenants, Payments, Achievements, Rewards
- Similar RESTful endpoints for each resource

## MongoDB Configuration

For production with MongoDB Atlas:

1. Install MongoDB package: `composer require mongodb/laravel-mongodb`
2. Update `.env` with MongoDB connection string
3. See detailed setup instructions in deployment guide

## License

MIT License
