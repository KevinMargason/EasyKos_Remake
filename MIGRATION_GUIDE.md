# EasyKos Migration Guide

This document outlines the migration from the monolithic Ionic/Laravel/MySQL architecture to the modern Next.js/Laravel API/MongoDB stack.

## Overview

### Old Architecture (Monolith)
- **Frontend:** Ionic Framework (hybrid mobile app)
- **Backend:** Laravel (monolithic with Blade views)
- **Database:** MySQL (relational database)
- **Deployment:** Single server deployment

### New Architecture (Modern/Microservices)
- **Frontend:** Next.js (React framework, deployable to Vercel)
- **Backend:** Laravel API (headless API server)
- **Database:** MongoDB (NoSQL, cloud-ready via Atlas)
- **Deployment:** Separate frontend (Vercel) and backend (any Laravel host)

## Migration Benefits

1. **Scalability** - Frontend and backend can scale independently
2. **Performance** - Static generation with Next.js, faster page loads
3. **Developer Experience** - TypeScript, modern tooling, hot reload
4. **Deployment** - Easy deployment to modern cloud platforms
5. **Flexibility** - MongoDB's schema-less structure for rapid iteration
6. **Mobile-First** - Progressive Web App capabilities with Next.js

## Data Migration

### Step 1: Export Data from MySQL

```sql
-- Export users
SELECT * FROM users INTO OUTFILE '/tmp/users.json';

-- Export rooms
SELECT * FROM rooms INTO OUTFILE '/tmp/rooms.json';

-- Export tenants
SELECT * FROM tenants INTO OUTFILE '/tmp/tenants.json';

-- Export payments
SELECT * FROM payments INTO OUTFILE '/tmp/payments.json';
```

### Step 2: Transform Data for MongoDB

Create transformation scripts to convert relational data to document format:

```javascript
// Example: Transform users
const users = mysqlUsers.map(user => ({
  name: user.name,
  email: user.email,
  password: user.password, // Already hashed
  created_at: new Date(user.created_at),
  updated_at: new Date(user.updated_at)
}));
```

### Step 3: Import to MongoDB

```javascript
// Using MongoDB client or Compass
db.users.insertMany(users);
db.rooms.insertMany(rooms);
db.tenants.insertMany(tenants);
db.payments.insertMany(payments);
```

Or use mongoimport:

```bash
mongoimport --uri="mongodb+srv://..." --collection=users --file=users.json --jsonArray
mongoimport --uri="mongodb+srv://..." --collection=rooms --file=rooms.json --jsonArray
```

## API Migration

### Old Routes (Laravel Monolith)

```php
// web.php
Route::get('/rooms', 'RoomController@index');
Route::post('/rooms', 'RoomController@store');
```

### New Routes (Laravel API)

```php
// api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('rooms', RoomController::class);
});
```

### Key Changes:

1. **Prefix:** All routes now under `/api` prefix
2. **Authentication:** Changed from session to token-based (Sanctum)
3. **Response Format:** Always JSON (no Blade views)
4. **CORS:** Configured to accept requests from frontend domain

## Frontend Migration

### From Ionic Components to Next.js

**Old (Ionic):**
```html
<ion-header>
  <ion-toolbar>
    <ion-title>Rooms</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-card *ngFor="let room of rooms">
    <ion-card-header>
      <ion-card-title>Room {{room.number}}</ion-card-title>
    </ion-card-header>
  </ion-card>
</ion-content>
```

**New (Next.js + Tailwind):**
```tsx
export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold">Rooms</h1>
      <div className="grid grid-cols-3 gap-4">
        {rooms.map(room => (
          <div key={room.id} className="bg-white shadow rounded p-4">
            <h2 className="text-lg font-semibold">Room {room.number}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Authentication Migration

### Old (Session-Based)

```php
// Login
if (Auth::attempt(['email' => $email, 'password' => $password])) {
    return redirect()->intended('dashboard');
}
```

### New (Token-Based)

**Backend:**
```php
public function login(Request $request) {
    if (!Auth::attempt($request->only('email', 'password'))) {
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }
    
    $user = User::where('email', $request->email)->firstOrFail();
    $token = $user->createToken('auth_token')->plainTextToken;
    
    return response()->json([
        'access_token' => $token,
        'token_type' => 'Bearer',
        'user' => $user
    ]);
}
```

**Frontend:**
```typescript
const response = await api.login(email, password);
localStorage.setItem('token', response.access_token);
localStorage.setItem('user', JSON.stringify(response.user));
```

## Database Schema Changes

### Rooms Table/Collection

**MySQL (Old):**
```sql
CREATE TABLE rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_number VARCHAR(10),
    price DECIMAL(10,2),
    facilities TEXT,  -- Comma-separated
    created_at TIMESTAMP
);
```

**MongoDB (New):**
```javascript
{
  _id: ObjectId("..."),
  room_number: "101",
  room_type: "Standard",
  floor: 1,
  capacity: 2,
  price: 1500000,
  facilities: ["AC", "WiFi", "Hot Water"],  // Array
  status: "available",
  description: "...",
  images: ["url1", "url2"],  // Array
  created_at: ISODate("..."),
  updated_at: ISODate("...")
}
```

### Benefits of MongoDB Structure:
- **Arrays:** Native support for multi-value fields (facilities, images)
- **Embedded Documents:** Can include related data
- **Flexible Schema:** Easy to add new fields without migrations
- **JSON-like:** Direct mapping to JavaScript objects

## Deployment Migration

### Old Deployment

1. Single server with Apache/Nginx
2. Deploy entire application
3. MySQL on same or separate server
4. Manual deployment or basic CI/CD

### New Deployment

**Frontend (Vercel):**
1. Connect GitHub repository
2. Configure build settings (automatic)
3. Set environment variables
4. Automatic deployments on push

**Backend (Various Options):**
1. Laravel Vapor (AWS Lambda)
2. DigitalOcean App Platform
3. Heroku
4. Traditional VPS

**Database (MongoDB Atlas):**
1. Cloud-hosted, managed service
2. Automatic backups
3. Scaling with a click
4. Built-in monitoring

## Testing Strategy

### Old Testing
```php
public function testRoomCreation() {
    $response = $this->post('/rooms', $data);
    $response->assertRedirect('/rooms');
}
```

### New Testing

**Backend:**
```php
public function test_room_creation() {
    $response = $this->actingAs($user)
        ->postJson('/api/rooms', $data);
    $response->assertStatus(201)
        ->assertJson(['room_number' => '101']);
}
```

**Frontend:**
```typescript
describe('RoomsPage', () => {
  it('displays rooms list', async () => {
    const { getByText } = render(<RoomsPage />);
    await waitFor(() => {
      expect(getByText('Room 101')).toBeInTheDocument();
    });
  });
});
```

## Rollback Plan

If migration encounters issues:

1. **Keep old system running** during migration
2. **Parallel deployment** - Run both systems simultaneously
3. **Data sync** - Keep MySQL and MongoDB in sync during transition
4. **Gradual cutover** - Move users gradually
5. **Monitoring** - Track errors and performance

## Checklist

### Pre-Migration
- [ ] Backup all MySQL data
- [ ] Document custom features and integrations
- [ ] Set up development environment for new stack
- [ ] Create MongoDB Atlas cluster

### Migration
- [ ] Export data from MySQL
- [ ] Transform data for MongoDB
- [ ] Import data to MongoDB
- [ ] Update API endpoints
- [ ] Migrate frontend components
- [ ] Update authentication flow
- [ ] Test all features

### Post-Migration
- [ ] Monitor application performance
- [ ] Verify data integrity
- [ ] Train users on new interface
- [ ] Update documentation
- [ ] Decommission old system (after verification period)

## Timeline Estimate

- **Week 1:** Setup new infrastructure, export data
- **Week 2:** Backend API development and testing
- **Week 3:** Frontend development
- **Week 4:** Integration testing and bug fixes
- **Week 5:** User acceptance testing
- **Week 6:** Production deployment and monitoring

## Support

For migration assistance:
- Review this guide thoroughly
- Test in development environment first
- Document any custom modifications
- Maintain backups throughout process
