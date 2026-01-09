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

## React Guidelines

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

## Development Practices

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


## Documentation Standards

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

## Code Review Checklist

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