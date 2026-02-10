# C# Styleguide

Standards for writing clean, idiomatic C# code following Google C# conventions.

## General Principles

- Target the latest stable C# language version
- Enable nullable reference types (`#nullable enable`)
- Prefer immutability where possible
- Use records for immutable data models

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Classes | PascalCase | `UserService` |
| Interfaces | `I` + PascalCase | `IUserRepository` |
| Methods | PascalCase | `GetUserById` |
| Properties | PascalCase | `FirstName` |
| Local variables | camelCase | `userName` |
| Parameters | camelCase | `userId` |
| Constants | PascalCase | `MaxRetries` |
| Private fields | `_` + camelCase | `_cache`, `_logger` |
| Type parameters | `T` prefix | `TValue`, `TKey` |
| Enums | PascalCase (singular) | `HttpStatus.NotFound` |

## Formatting Rules

- Indentation: Use 4 spaces (never tabs)
- Braces: K&R style — no line break before opening brace; `} else` on one line
- Braces required even when optional

```csharp
// Good: K&R style with required braces
if (condition) {
    DoSomething();
} else {
    DoOther();
}

// Bad: Omitting braces
if (condition)
    DoSomething();
```

## Type Usage

### Use `var` Appropriately

```csharp
// Good: Type is obvious from right side
var users = new List<User>();
var name = "Alice";
var count = items.Count;

// Good: Explicit type when not obvious
IUserRepository repository = GetRepository();
int result = CalculateScore(input);
```

### Records for Immutable Data

```csharp
// Good: Record for data models
public record User(string Id, string Name, string Email);

// Good: Record with init-only properties
public record UserConfig {
    public required string ConnectionString { get; init; }
    public int MaxRetries { get; init; } = 3;
}
```

### Nullable Reference Types

```csharp
// Good: Explicit nullability
public User? FindUser(string id) {
    return _users.FirstOrDefault(u => u.Id == id);
}

// Good: Null checks
public void Process(User? user) {
    if (user is null) {
        throw new ArgumentNullException(nameof(user));
    }
    // user is non-null here
}
```

## Pattern Matching

### Switch Expressions

```csharp
// Good: Switch expression for assignments
var message = status switch {
    HttpStatus.Ok => "Success",
    HttpStatus.NotFound => "Not found",
    HttpStatus.ServerError => "Internal error",
    _ => throw new ArgumentOutOfRangeException(nameof(status))
};
```

### Property Patterns

```csharp
// Good: Pattern matching with properties
if (response is { StatusCode: 200, Body: not null } success) {
    ProcessBody(success.Body);
}
```

## Error Handling

### Custom Exceptions

```csharp
public class ValidationException : Exception {
    public string Field { get; }

    public ValidationException(string field, string message)
        : base(message) {
        Field = field;
    }
}
```

### Guard Clauses

```csharp
public void UpdateUser(string id, UserUpdate update) {
    ArgumentNullException.ThrowIfNull(update);
    ArgumentException.ThrowIfNullOrWhiteSpace(id);

    var user = _repository.Find(id)
        ?? throw new NotFoundException($"User {id} not found");

    // proceed with update
}
```

## Async/Await

```csharp
// Good: Async suffix, CancellationToken support
public async Task<User> GetUserAsync(
    string id,
    CancellationToken cancellationToken = default) {
    var response = await _httpClient.GetAsync($"/users/{id}", cancellationToken);
    response.EnsureSuccessStatusCode();
    return await response.Content.ReadFromJsonAsync<User>(cancellationToken)
        ?? throw new InvalidOperationException("Failed to deserialize user");
}

// Avoid: Mixing async/await with .Result or .Wait()
```

## Collections

```csharp
// Good: Use interfaces for parameters
public void ProcessItems(IReadOnlyList<Item> items) { ... }

// Good: Use concrete types for local variables
var items = new List<Item>();
var lookup = new Dictionary<string, User>();

// Good: Collection expressions (C# 12+)
List<int> numbers = [1, 2, 3, 4, 5];
```

## LINQ

```csharp
// Good: Method syntax for simple queries
var activeUsers = users
    .Where(u => u.IsActive)
    .OrderBy(u => u.Name)
    .ToList();

// Good: Query syntax for complex joins
var results = from order in orders
              join customer in customers on order.CustomerId equals customer.Id
              where order.Total > 100
              select new { customer.Name, order.Total };
```

## File Organization

### Member Ordering

1. Constants and static fields
2. Instance fields
3. Constructors
4. Properties
5. Public methods
6. Private methods

### One Type Per File

```csharp
// File: UserService.cs — contains only UserService class
// File: IUserRepository.cs — contains only IUserRepository interface
```

## Dependency Injection

```csharp
// Good: Constructor injection with readonly fields
public class UserService {
    private readonly IUserRepository _repository;
    private readonly ILogger<UserService> _logger;

    public UserService(
        IUserRepository repository,
        ILogger<UserService> logger) {
        _repository = repository;
        _logger = logger;
    }
}
```

## Testing Patterns

### Test Structure

```csharp
public class UserServiceTests {
    private readonly Mock<IUserRepository> _mockRepo;
    private readonly UserService _sut;

    public UserServiceTests() {
        _mockRepo = new Mock<IUserRepository>();
        _sut = new UserService(_mockRepo.Object);
    }

    [Fact]
    public async Task GetUser_WithValidId_ReturnsUser() {
        // Arrange
        var expected = new User("1", "Alice", "alice@test.com");
        _mockRepo.Setup(r => r.FindAsync("1"))
            .ReturnsAsync(expected);

        // Act
        var result = await _sut.GetUserAsync("1");

        // Assert
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public async Task GetUser_WithInvalidId_ThrowsArgumentException(string? id) {
        await Assert.ThrowsAsync<ArgumentException>(
            () => _sut.GetUserAsync(id!));
    }
}
```

## Quick Reference

| Aspect | Recommendation |
|--------|----------------|
| Nullable refs | Always enabled |
| `var` | Use when type is obvious |
| Records | For immutable data |
| Async | Always use async/await, never `.Result` |
| Braces | Always required, K&R style |
| Fields | `_camelCase` for private |
| Tests | Fact/Theory with Arrange-Act-Assert |