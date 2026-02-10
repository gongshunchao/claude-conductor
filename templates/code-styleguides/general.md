# General Styleguide

Universal coding standards that apply across all languages and frameworks.

## Core Principles

- **Readability over cleverness**: Code is read far more than it is written
- **Consistency over preference**: Follow the project's established patterns
- **Explicitness over implicitness**: Make intent clear
- **Simplicity over complexity**: Choose the simplest solution that works

## Naming

### Be Descriptive and Meaningful

```
# Good
getUserById, calculateTotalPrice, isAuthenticated, maxRetryCount

# Bad
getData, calc, flag, n
```

### Use Domain Language

Name things using the project's domain vocabulary (from `product.md`):
- If the product calls it "workspace", don't call it "project" in code
- If the spec says "subscription", don't use "plan" or "membership"

### Naming Patterns

| Element | Guideline |
|---------|-----------|
| Functions/Methods | Verb + noun: `createUser`, `validateInput` |
| Booleans | Question form: `isActive`, `hasPermission`, `canEdit` |
| Collections | Plural: `users`, `orderItems`, `activeConnections` |
| Constants | Describe the value: `MAX_RETRY_COUNT`, `DEFAULT_TIMEOUT_MS` |
| Callbacks/Handlers | `on` + event: `onSubmit`, `handleClick`, `onUserCreated` |

## File Organization

### Small, Focused Files

| Guideline | Target |
|-----------|--------|
| Lines per file | 200-400 typical, 800 max |
| Functions per file | 5-15 |
| Responsibility | Single, clear purpose |

### Organize by Feature, Not Type

```
# Good: Feature-based
src/
  auth/
    login.ts
    login.test.ts
    register.ts
    register.test.ts
  users/
    user-service.ts
    user-service.test.ts

# Avoid: Type-based
src/
  controllers/
  services/
  models/
  tests/
```

## Functions

### Keep Functions Small

- **Target**: Under 30 lines, max 50
- **Parameters**: Max 3-4; use an options object for more
- **Single responsibility**: One function does one thing
- **Single level of abstraction**: Don't mix high-level logic with low-level details

### Early Returns (Guard Clauses)

```
# Good: Guard clauses reduce nesting
function processOrder(order) {
  if (!order) return null
  if (!order.items.length) return emptyResult()
  if (order.status === 'cancelled') return cancelledResult()

  // Main logic at base indentation
  return calculateTotal(order)
}

# Bad: Deep nesting
function processOrder(order) {
  if (order) {
    if (order.items.length) {
      if (order.status !== 'cancelled') {
        return calculateTotal(order)
      }
    }
  }
}
```

## Error Handling

### Handle Errors Explicitly

- Never swallow errors silently
- Provide context in error messages
- Use typed/custom errors when possible
- Fail fast with clear messages

### Error Message Quality

```
# Good: Actionable error messages
"Failed to connect to database at localhost:5432. Check that PostgreSQL is running."
"User 'alice@example.com' not found. Verify the email address."

# Bad: Vague messages
"Error occurred"
"Something went wrong"
"null"
```

## Comments and Documentation

### Comment the Why, Not the What

```
# Good: Explains reasoning
// Use a 30-second timeout because the upstream API has a known
// cold-start delay of up to 25 seconds on first request.
const TIMEOUT_MS = 30000

# Bad: Restates the code
// Set timeout to 30000
const TIMEOUT_MS = 30000
```

### Document Public APIs

Every public function/method/class should have:
- Brief description of purpose
- Parameter descriptions (if not obvious)
- Return value description
- Thrown errors/exceptions

### Remove Dead Comments

- Delete commented-out code (use git history instead)
- Remove TODO comments older than 2 weeks (create issues instead)
- Remove obvious comments that add no value

## Code Structure

### Maximum Nesting: 3-4 Levels

If nesting exceeds 3-4 levels, refactor:
- Extract helper functions
- Use early returns
- Invert conditions

### DRY with Judgment

- **Do repeat** if the duplication is coincidental (same code, different reasons)
- **Don't repeat** if the duplication is structural (same reason, same logic)
- Rule of three: Refactor on the third occurrence

### Immutability by Default

- Create new objects instead of mutating existing ones
- Use `const`/`final`/`readonly` by default
- Only use mutable state when performance requires it

## Security Basics

### Never Hardcode Secrets

```
# Bad
API_KEY = "sk-proj-abc123..."

# Good
API_KEY = env.get("API_KEY")
```

### Validate All Input

- Validate at system boundaries (API endpoints, form handlers)
- Use schema validation libraries (Zod, Pydantic, etc.)
- Sanitize before rendering (prevent XSS)
- Parameterize queries (prevent SQL injection)

### Principle of Least Privilege

- Request minimum permissions needed
- Scope access tokens narrowly
- Don't expose internal errors to users

## Testing

### Test Behavior, Not Implementation

```
# Good: Tests what the function does
test "calculateTotal returns sum of item prices with tax"

# Bad: Tests how it does it
test "calculateTotal calls reduce on items array"
```

### Test Structure

Follow Arrange-Act-Assert (or Given-When-Then):

1. **Arrange**: Set up test data and dependencies
2. **Act**: Execute the code under test
3. **Assert**: Verify the expected outcome

### Test Naming

Use descriptive names that read as specifications:
```
should_return_empty_list_when_no_users_found
should_throw_validation_error_for_invalid_email
should_retry_three_times_on_network_failure
```

## Git Commit Messages

### Conventional Commits

```
<type>: <description>

<optional body>
```

| Type | Use For |
|------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code restructuring |
| `test` | Adding/updating tests |
| `docs` | Documentation changes |
| `chore` | Build, config, tooling |
| `perf` | Performance improvement |

### Good Commit Messages

```
# Good: Specific and actionable
feat: add email validation to registration form
fix: prevent duplicate orders when double-clicking submit
refactor: extract payment processing into separate service

# Bad: Vague
fix: bug fix
update: updated stuff
wip: work in progress
```

## Quick Reference

| Aspect | Recommendation |
|--------|----------------|
| File size | 200-400 lines typical, 800 max |
| Function size | Under 30 lines, max 50 |
| Parameters | Max 3-4 per function |
| Nesting | Max 3-4 levels |
| Naming | Descriptive, domain-aligned |
| Comments | Why, not what |
| Errors | Explicit, actionable messages |
| Secrets | Always from environment |
| Tests | Behavior-focused, AAA pattern |
| Commits | Conventional format |