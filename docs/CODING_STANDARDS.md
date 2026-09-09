# Enterprise Coding Standards & Policy Gates

This document defines the engineering standards, conventions, and quality gates enforced in this codebase.

---

## 1. Module System & File Organization

- **Pure JavaScript (ES2022 ESM)**: All files must use native `import` and `export` statements. CommonJS `require()` is prohibited except in legacy config files (`.eslintrc.cjs`).
- **Explicit File Extensions**: In Node.js ES Modules, all relative imports MUST include the `.js` extension (e.g., `import { logger } from './logger.js'`).
- **File Naming**:
  - Constants: `*.constant.js`
  - Middlewares: `*.middleware.js`
  - Controllers: `*.controller.js`
  - Services: `*.service.js`
  - Repositories: `*.repository.js`
  - DTOs & Schemas: `*.dto.js`
  - Unit/Integration Tests: `*.test.js`

---

## 2. JSDoc Documentation Standard

Every class, constructor, public method, function, and custom type MUST have comprehensive JSDoc block comments:

```javascript
/**
 * Hashes a plaintext password securely with bcrypt.
 * @param {string} password Plaintext password
 * @returns {Promise<string>} Bcrypt hash string
 * @throws {Error} If hashing algorithm fails
 */
export async function hashPassword(password) { ... }
```

Tag requirements:
- `@param {type} name Description`
- `@returns {type} Description`
- `@throws {ErrorClass} Under what condition this is thrown`
- `@typedef {Object} Name` for domain objects and options
- `@override` when overriding a base class method

---

## 3. Error Handling Conventions

1. **Never throw raw errors or strings**:
   ```javascript
   // BAD:
   throw 'User not found';
   throw new Error('User not found');

   // GOOD:
   throw new NotFoundError(`User with ID '${userId}' not found`);
   ```

2. **RFC 7807 Compliance**: Every custom error extends `AppError` and implements `toProblemDetails(instance)`.
3. **No Uncaught Rejections**: All Express async route handlers must either use `try/catch` passing errors to `next(error)` or be wrapped in an async handler utility.

---

## 4. Git & Commit Conventions

Commit messages must follow the **Conventional Commits** specification:
```
<type>(<scope>): <short summary>

[optional body]

[optional footer(s)]
```

Allowed types:
- `feat`: A new user-facing feature or domain capability
- `fix`: A bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring without behavioral alterations
- `test`: Adding or correcting tests
- `chore`: Build scripts, dependencies, CI configuration

---

## 5. Automated Policy Gates Checklist

Every commit and pull request must pass the automated policy pipeline:

| Gate | Tool | Command | Threshold / Expectation |
| :--- | :--- | :--- | :--- |
| **Gate 1: Format** | Prettier | `npm run format:check` | Zero formatting violations |
| **Gate 2: Static Analysis** | ESLint | `npm run lint` | 0 errors, 0 warnings (`--max-warnings 0`) |
| **Gate 3: Test Suite** | Vitest | `npm run test` | 100% test pass rate |
| **Gate 4: Test Coverage** | Vitest Coverage (v8) | `npm run test:coverage` | **Statements >= 80%**, **Lines >= 80%**, **Functions >= 80%**, **Branches >= 75%** |
| **Gate 5: Security Audit** | npm audit | `npm run audit:security` | Zero high/critical production vulnerabilities |
