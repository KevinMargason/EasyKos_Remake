# Contributing to EasyKos

Thank you for your interest in contributing to EasyKos! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/EasyKos_Remake.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes thoroughly
6. Commit: `git commit -m "Add: your feature description"`
7. Push: `git push origin feature/your-feature-name`
8. Create a Pull Request

## Development Setup

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

## Coding Standards

### Backend (Laravel/PHP)

- Follow PSR-12 coding standards
- Use type hints for method parameters and return types
- Write descriptive method and variable names
- Add PHPDoc comments for complex methods
- Run Laravel Pint before committing: `./vendor/bin/pint`

Example:

```php
/**
 * Create a new room in the system.
 *
 * @param array $data Room data
 * @return Room
 */
public function createRoom(array $data): Room
{
    return Room::create($data);
}
```

### Frontend (Next.js/TypeScript)

- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Use Tailwind CSS for styling
- Run ESLint before committing: `npm run lint`

Example:

```typescript
interface RoomProps {
  room: Room;
  onEdit: (id: string) => void;
}

export default function RoomCard({ room, onEdit }: RoomProps) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold">{room.room_number}</h3>
    </div>
  );
}
```

## Commit Messages

Use conventional commit format:

- `feat: Add new feature`
- `fix: Fix bug in payment calculation`
- `docs: Update README`
- `style: Format code with Prettier`
- `refactor: Restructure room service`
- `test: Add tests for tenant controller`
- `chore: Update dependencies`

## Testing

### Backend

```bash
cd backend
php artisan test
```

Write tests for:

- API endpoints
- Model methods
- Service classes
- Critical business logic

### Frontend

```bash
npm run test
```

Write tests for:

- Component rendering
- User interactions
- API integration
- Utility functions

## Pull Request Process

1. **Update Documentation**
   - Update README if adding features
   - Add inline code comments
   - Update API documentation

2. **Testing**
   - Add tests for new features
   - Ensure all tests pass
   - Test manually in browser

3. **Code Review**
   - Address review comments
   - Keep discussion professional
   - Be open to feedback

4. **Merging**
   - Squash commits if requested
   - Ensure CI/CD passes
   - Wait for maintainer approval

## Feature Requests

- Open an issue with label "enhancement"
- Describe the feature clearly
- Explain the use case
- Provide examples if possible

## Bug Reports

Include:

- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Environment (OS, browser, versions)

## Project Structure

```
EasyKos_Remake/
├── app/                          # Next.js App Router pages
├── component/                    # React components
├── core/                         # Redux store, hooks, services
├── lib/                          # Utilities
│   └── api.ts                   # API client
├── public/                       # Static assets
├── backend/
│   ├── app/
│   │   ├── Http/Controllers/Api/  # API controllers
│   │   ├── Models/                # Eloquent models
│   │   └── ...
│   ├── routes/api.php             # API routes
│   └── ...
└── docs/                          # Documentation
```

## Areas for Contribution

### High Priority

- Complete CRUD implementations for all resources
- Add comprehensive test coverage
- Improve error handling
- Enhance UI/UX

### Features

- Real-time notifications
- Advanced search and filtering
- Reporting and analytics
- Export to PDF/Excel
- Email notifications
- Mobile app (React Native)

### Documentation

- API documentation
- User guide
- Video tutorials
- Code examples

### Testing

- Unit tests
- Integration tests
- End-to-end tests
- Performance tests

## Questions?

Feel free to:

- Open an issue for discussion
- Join our community chat
- Email maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to EasyKos! 🎉
