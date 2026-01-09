# SunbirdEd Portal - Coding Instructions

## Technology Stack
- **Frontend**: React 19.2.1, TypeScript 5.9.3, Vite 7.3.1
- **Backend**: Node.js 24.12.0, Express 5.2.1, TypeScript 5.9.3
- **Testing**: Jest 30.2.0, React Testing Library 16.3.1, Vitest 4.0.16
- **Build Tools**: Vite 7.3.1, ESLint 9.39.2, Prettier 3.7.4

## Language Guidelines

### TypeScript Requirements
- **Always use strict TypeScript** - no exceptions
- **Never use `any` type** - use `unknown`, proper interfaces, or type unions instead
- **Enable strict mode** in all tsconfig.json files
- **Use `noUncheckedIndexedAccess: true`** for safer array/object access
- **Prefer type-safe approaches**: type guards, assertion functions, branded types


## Styling & UI Guidelines

### CSS Framework
- **Primary**: Tailwind CSS for all styling
- **Components**: Headless UI for accessible, unstyled components
- **Icons**: Heroicons (included with Headless UI)
- **Responsive**: Mobile-first approach with Tailwind breakpoints

### Accessibility Requirements
- **WCAG 2.1 AA compliance** minimum
- **Use semantic HTML** elements
- **Proper ARIA labels** and roles
- **Focus management** for interactive elements
- **Keyboard navigation** support

```tsx
// ✅ Accessible component example
import { Dialog, Transition } from '@headlessui/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog
        onClose={onClose}
        className="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
      >
        <div className="flex min-h-screen items-center justify-center px-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <Dialog.Title id="modal-title" className="text-lg font-semibold">
              {title}
            </Dialog.Title>
            {children}
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
```

## ⚛️ React Guidelines

### Component Structure
- **Use functional components** with hooks
- **TypeScript interfaces** for all props
- **Default exports** for page components, **named exports** for utilities
- **Custom hooks** for shared logic
- **Error boundaries** for production resilience

### State Management
- **React 19 features**: Use latest hooks and patterns
- **Local state**: useState, useReducer for component state
- **Server state**: React Query/TanStack Query for API data
- **Global state**: Context API or Zustand (avoid Redux unless necessary)


## 🗄️ Backend Guidelines

### API Design
- **RESTful conventions** with proper HTTP methods
- **Type-safe request/response** interfaces
- **Error handling** with consistent error responses
- **Validation** using Zod or similar schema validation
- **CORS configuration** for frontend integration

### Express.js Patterns
```typescript
// ✅ Type-safe Express route
interface CreateUserRequest {
  name: string;
  email: string;
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

app.post('/api/users', async (req: Request<{}, UserResponse, CreateUserRequest>, res: Response<UserResponse>) => {
  try {
    // Type-safe request handling
    const userData = req.body;
    const user = await createUser(userData);
    
    res.status(201).json(user);
  } catch (error) {
    handleApiError(error, res);
  }
});
```


## 🔧 Development Practices

### Code Style
- **Prettier** for consistent formatting
- **ESLint** for code quality
- **Conventional commits** for git history
- **Descriptive variable names** - no abbreviations
- **Pure functions** when possible

### Performance
- **React.memo** for expensive components
- **useMemo/useCallback** for expensive computations
- **Code splitting** with React.lazy
- **Bundle analysis** with Vite bundle analyzer
- **Image optimization** with proper formats and sizes

### Security
- **Input validation** on all API endpoints
- **CORS** properly configured
- **Environment variables** for sensitive data
- **Error messages** that don't leak sensitive information
- **Rate limiting** for API endpoints

## Build

### Development
- **Hot reload** enabled for both frontend and backend
- **Type checking** in development mode
- **Linting** on save
- **Auto-formatting** with Prettier


## 📚 Documentation Standards

### Code Documentation
- **JSDoc comments** for public APIs
- **README files** for each major feature
- **Type definitions** serve as documentation
- **Examples** in component stories

### Git Practices
- **Conventional commits**: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
- **Meaningful commit messages**
- **Small, focused commits**
- **Pull request templates**

## 🔍 Code Review Checklist

### Before Submitting PR
- [ ] TypeScript strict mode compliance
- [ ] All tests passing
- [ ] ESLint and Prettier checks pass
- [ ] Accessibility considerations addressed
- [ ] Performance implications considered
- [ ] Error handling implemented
- [ ] Type safety maintained

### Review Focus Areas
- [ ] Type safety and TypeScript usage
- [ ] Accessibility compliance
- [ ] Performance optimization
- [ ] Error handling robustness
- [ ] Test coverage and quality
- [ ] Code maintainability

---