# GraphQL Development Guidelines

This comprehensive guideline consolidates essential GraphQL patterns and best practices for Fenix development, combining DataLoader patterns, error handling, mutations, pagination, projections, sorting, and description management.

> **LLM Compliance Note**: This guideline is a binding playbook for GraphQL work. Read everything before acting, obey every directive exactly, and debate Codex feedback only within the limits defined here.

## How to Use This Guideline
1. Study the full document before designing or implementing GraphQL features.
2. Execute instructions in sequence within each section unless the text explicitly indicates parallel work.
3. Use the cited recipes and agent guides immediately when referenced—do not invent alternative patterns.
4. Log any departures as risks and seek approval before proceeding.

**Tags:** graphql, n+1, performance, hotchocolate, dataloader, mutations, error-handling, validation, pagination, cursor, relay, projection, filtering, sorting, nested-structure, input-types, schema, documentation, maintainability
**Agents:** graphql-architect, performance-profiler, code-reviewer, dotnet-specialist
**Risk:** High - N+1 queries can crash production, poor error handling leads to bad UX, unbounded queries can crash servers
**Context:** Fenix GraphQL API, HotChocolate 15.1.3+, Relay-style pagination

## Part 1: DataLoader Patterns for N+1 Prevention

### ✅ IMPORTANT: Automatic Tenant Filtering (2025+)

**Tenant isolation is now automatic** - ReadDbContext and WriteDbContext apply Global Query Filters to all entities.

**What This Means**:
- ✅ **NO manual tenant filtering needed** in DataLoaders
- ✅ **Security by default** - Impossible to accidentally query cross-tenant data
- ✅ **Simpler code** - Just query by IDs, tenant filtering happens automatically
- ❌ **DO NOT add manual filters** - They're redundant and may cause bugs
- ⚠️ **Exceptions: Person and MailLog** - These entities do NOT have automatic filtering

**Implementation**:
- Global Query Filters applied to all entities except Person and MailLog
- ITenantContext (Fenix.App) interface uses `int?` properties
- HttpSessionTenantContext validates non-null on construction
- See `/specs/tenant-filtering_spec.md` for architecture details

### Problem
N+1 queries occur when fetching related data in GraphQL resolvers, causing one query for the parent and N queries for children.

### Solution: [DataLoader] Attribute Pattern

HotChocolate 15.1.3+ provides the `[DataLoader]` attribute for all DataLoader scenarios - both simple and complex keys.

#### Simple Key Example
```csharp
public static class EmployeeDataLoaders
{
    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, Employee>> GetEmployeeByIdAsync(
        IReadOnlyList<Guid> ids,
        IReadDbContext dbContext,
        CancellationToken ct)
    {
        // ✅ Tenant filtering is AUTOMATIC via Global Query Filters
        // ReadDbContext automatically filters by CustomerId/ScheduleId
        // No manual filtering needed!
        var employees = await dbContext.Employees
            .Where(e => ids.Contains(e.Id))
            .ToDictionaryAsync(e => e.Id, ct);

        return employees;
    }
}
```

**Generated interface**: `IEmployeeByIdDataLoader`

**Usage in resolver**:
```csharp
public async Task<Employee?> GetEmployee(
    IEmployeeByIdDataLoader loader,
    CancellationToken ct)
{
    return shift.EmployeeId.HasValue
        ? await loader.LoadAsync(shift.EmployeeId.Value, ct)
        : null;
}
```

#### Complex/Composite Key Example

For composite keys, define a key class with proper equality and defensive copying:

```csharp
// 1. Define key with defensive copying and proper equality
public sealed record ShiftsByDayKey
{
    public DateOnly Date { get; }
    public Guid CustomerGuid { get; }
    public Guid[]? SectionGuids { get; }

    public ShiftsByDayKey(DateOnly date, Guid customerGuid, Guid[]? sectionGuids)
    {
        Date = date;
        CustomerGuid = customerGuid;
        // CRITICAL: Defensive copy to prevent mutations
        SectionGuids = sectionGuids switch
        {
            null => null,
            [] => [],
            _ => (Guid[])sectionGuids.Clone()
        };
    }

    // Order-agnostic equality for filter arrays
    public virtual bool Equals(ShiftsByDayKey? other)
    {
        if (other is null) return false;
        return Date == other.Date &&
               CustomerGuid == other.CustomerGuid &&
               Ch.Equivalent(SectionGuids, other.SectionGuids); // Order doesn't matter!
    }

    public override int GetHashCode()
    {
        return HashCode.Combine(
            Date,
            CustomerGuid,
            SectionGuids?.GetHashCodeEx()); // Order-agnostic hash
    }
}

// 2. Implement DataLoader with the same [DataLoader] attribute
[DataLoader]
public static async Task<IReadOnlyDictionary<ShiftsByDayKey, Shift[]>> GetShiftsByDayKeyAsync(
    IReadOnlyList<ShiftsByDayKey> keys,
    IReadDbContext dbContext,
    CancellationToken ct)
{
    // Efficient batching logic
    var dates = keys.Select(k => k.Date).Distinct().ToArray();
    var customerGuids = keys.Select(k => k.CustomerGuid).Distinct().ToArray();

    // CRITICAL: Distinguish null (no filter) from empty (filter to none)
    var hasUnfilteredRequests = keys.Any(k => k.SectionGuids is null);
    var filteredSectionGuids = keys
        .Where(k => k.SectionGuids is not null)
        .SelectMany(k => k.SectionGuids!)
        .Distinct()
        .ToArray();

    // Build efficient query
    var query = dbContext.Shifts
        .Where(s => dates.Contains(s.Date))
        .Where(s => customerGuids.Contains(s.CustomerGuid));

    if (!hasUnfilteredRequests && filteredSectionGuids.Length > 0)
    {
        query = query.Where(s => filteredSectionGuids.Contains(s.SectionGuid));
    }

    var allShifts = await query.ToArrayAsync(ct);

    // Distribute results to each key
    var result = new Dictionary<ShiftsByDayKey, Shift[]>();
    foreach (var key in keys)
    {
        var matchingShifts = allShifts
            .Where(s => s.Date == key.Date)
            .Where(s => s.CustomerGuid == key.CustomerGuid)
            .Where(s => key.SectionGuids is null ||
                       key.SectionGuids.Contains(s.SectionGuid))
            .ToArray();

        result[key] = matchingShifts;
    }

    return result;
}
```

**Generated interface**: `IShiftsByDayKeyDataLoader`

### Key Design Principles

#### 1. Defensive Copying
Always clone mutable collections to prevent external mutations:
```csharp
public MyKey(int[] values)
{
    Values = values switch
    {
        null => null,
        [] => [],
        _ => (int[])values.Clone()
    };
}
```

#### 2. Null vs Empty Semantics
Distinguish between null (no filter) and empty (explicit filter to none):
- `null` = no filter applied (return all results)
- `empty array` = explicit filter to none (return no results)

#### 3. Order-Agnostic Equality
Use `Ch.Equivalent()` for filter arrays where order doesn't matter:
```csharp
public bool Equals(MyKey? other)
{
    return other is not null && Ch.Equivalent(FilterIds, other.FilterIds);
}
```

#### 4. Efficient and Safe Batching
Minimize database queries while respecting database limits:

```csharp
// ⚠️ WARNING: SQL Server has a limit of ~2100 parameters
// EF Core does NOT automatically chunk large IN clauses!
const int MaxSqlParameters = 1000; // Conservative limit for safety

var allIds = keys.SelectMany(k => k.Ids ?? []).Distinct().ToList();

// For small sets, single query
if (allIds.Count <= MaxSqlParameters)
{
    var allData = await dbContext.Items
        .Where(i => allIds.Contains(i.Id))
        .ToArrayAsync();
}
else
{
    // For large sets, chunk to avoid SQL parameter limit
    var allData = new List<Item>();
    foreach (var batch in allIds.Chunk(MaxSqlParameters))
    {
        var batchData = await dbContext.Items
            .Where(i => batch.Contains(i.Id))
            .ToArrayAsync();
        allData.AddRange(batchData);
    }
}
```

**Alternative using extension method:**
```csharp
// Consider creating a reusable extension for this pattern
public static async Task<T[]> ChunkedWhereInAsync<T, TKey>(
    this IQueryable<T> query,
    Expression<Func<T, TKey>> keySelector,
    IEnumerable<TKey> keys,
    int chunkSize = 1000,
    CancellationToken ct = default)
{
    var keyList = keys.ToList();
    if (keyList.Count <= chunkSize)
    {
        // Compile expression to get the property name for Contains
        var compiled = keySelector.Compile();
        return await query
            .Where(item => keyList.Contains(compiled(item)))
            .ToArrayAsync(ct);
    }

    var results = new List<T>();
    foreach (var batch in keyList.Chunk(chunkSize))
    {
        var batchList = batch.ToList();
        var compiled = keySelector.Compile();
        var batchResults = await query
            .Where(item => batchList.Contains(compiled(item)))
            .ToArrayAsync(ct);
        results.AddRange(batchResults);
    }
    return results.ToArray();
}

// Usage in DataLoader:
var allData = await dbContext.Items
    .ChunkedWhereInAsync(i => i.Id, allIds, ct: cancellationToken);
```

### Naming Convention

The method name determines the generated interface name:
- Method: `GetEmployeeByIdAsync` → Interface: `IEmployeeByIdDataLoader`
- Method: `GetShiftsByDayKeyAsync` → Interface: `IShiftsByDayKeyDataLoader`

### DataLoader Testing
```csharp
[Fact]
public async Task DataLoader_Should_Batch_Requests()
{
    var dbContext = CreateTestContext();
    var keys = new[]
    {
        new MyKey(1, new[] { "a", "b" }),
        new MyKey(1, new[] { "b", "a" }), // Same due to order-agnostic
        new MyKey(2, null),  // No filter
        new MyKey(3, [])  // Empty filter
    };

    var results = await GetItemsByKeyAsync(keys, dbContext, CancellationToken.None);

    results.Should().ContainKeys(keys);
    results[keys[0]].Should().BeEquivalentTo(results[keys[1]]);
    results[keys[2]].Should().NotBeEmpty(); // null = all
    results[keys[3]].Should().BeEmpty(); // empty = none
}
```

## Part 2: GraphQL Description Constants Pattern

### Problem
GraphQL descriptions are duplicated between entity classes and their corresponding input types (SortInput, FilterInput, etc.), leading to:
- Inconsistent documentation when one is updated but not the other
- Maintenance burden of keeping descriptions synchronized
- No single source of truth for property descriptions

### Solution

#### Define Description Constants in Source Classes
Place GraphQL description constants in the entity/source classes where the properties are defined:

```csharp
// ❌ WRONG - Descriptions defined in SortInput classes
public sealed record ShiftTypeSortInput
{
    private const string CalendarSectionDescription = "Sort by calendar section";

    [GraphQLDescription(CalendarSectionDescription)]
    public SortDirection? CalendarSection { get; init; }
}

// ✅ CORRECT - Descriptions defined in source class
// ShiftType.cs (Entity class)
[PublicAPI]
[GraphQLDescription(Description)]  // Object types should have descriptions
public sealed record ShiftType
{
    // Type-level description
    public const string Description = "Shift type configuration";

    // Field description constants (used by SortInput/FilterInput classes)
    public const string CalendarSectionDescription = "Sort by shift type calendar section (groups shifts by visual section)";
    public const string OrderDescription = "Sort by shift type order (custom ordering defined per shift type)";

    [GraphQLDescription(CalendarSectionDescription)]
    public int CalendarSection { get; init; }

    [GraphQLDescription(OrderDescription)]
    public int? Order { get; init; }
}

// ShiftTypeSortInput.cs (References source constants)
[PublicAPI]
public sealed record ShiftTypeSortInput  // No class-level description needed for input types
{
    [GraphQLDescription(ShiftType.CalendarSectionDescription)]
    public SortDirection? CalendarSection { get; init; }

    [GraphQLDescription(ShiftType.OrderDescription)]
    public SortDirection? Order { get; init; }
}
```

#### Pattern for Complex Types
When properties reference other types, define descriptions for those relationships:

```csharp
// Shift.cs
[PublicAPI]
[GraphQLDescription(Description)]  // Object types should have descriptions
public sealed record Shift
{
    // Type-level description
    public const string Description = "Shift with scheduling information";

    // Field descriptions
    public const string IdDescription = "Unique shift identifier";
    public const string TimeDescription = "Scheduled time window for the shift";
    public const string ShiftTypeDescription = "Type and category of this shift";

    [GraphQLDescription(IdDescription)]
    [GraphQLName("id")]
    public required Guid Guid { get; init; }

    [GraphQLDescription(TimeDescription)]
    public required DateTimeRange Time { get; init; }

    [GraphQLDescription(ShiftTypeDescription)]
    public async Task<ShiftType?> ShiftType(...) { ... }
}

// ShiftSortInput.cs
public sealed record ShiftSortInput
{
    [GraphQLDescription(Shift.TimeDescription)]
    public TimeSortInput? Time { get; init; }

    [GraphQLDescription(Shift.ShiftTypeDescription)]
    public ShiftTypeSortInput? ShiftType { get; init; }

    [GraphQLDescription(Shift.IdDescription)]
    public SortDirection? Id { get; init; }
}
```

#### Pattern for Value Objects
Simple value objects should define their own property descriptions:

```csharp
// DateTimeRange.cs
[PublicAPI]
public sealed record DateTimeRange
{
    public const string StartDescription = "Sort by start time";
    public const string EndDescription = "Sort by end time";

    [GraphQLDescription(StartDescription)]
    public required DateTimeOffset Start { get; init; }

    [GraphQLDescription(EndDescription)]
    public required DateTimeOffset End { get; init; }
}

// TimeSortInput.cs
public sealed record TimeSortInput
{
    [GraphQLDescription(DateTimeRange.StartDescription)]
    public SortDirection? Start { get; init; }

    [GraphQLDescription(DateTimeRange.EndDescription)]
    public SortDirection? End { get; init; }
}
```

### Benefits
- **Single Source of Truth**: Descriptions defined once in the entity class
- **Automatic Synchronization**: Changes to descriptions automatically reflected everywhere
- **HotChocolate Convention**: Follows framework's design philosophy
- **Compile-time Safety**: Renamed/removed constants caught at compile time
- **Better Discoverability**: IntelliSense shows available descriptions from source class

### Description Testing
```csharp
[Fact]
public void GraphQLDescriptions_ShouldUseSourceConstants()
{
    // Verify all GraphQLDescription attributes use constants
    var type = typeof(ShiftTypeSortInput);
    var properties = type.GetProperties();

    foreach (var prop in properties)
    {
        var attr = prop.GetCustomAttribute<GraphQLDescriptionAttribute>();
        if (attr != null)
        {
            // Description should come from ShiftType class constants
            var sourceType = typeof(ShiftType);
            var constants = sourceType.GetFields(BindingFlags.Public | BindingFlags.Static);

            constants.Should().Contain(f =>
                f.IsLiteral &&
                f.FieldType == typeof(string) &&
                f.GetValue(null)?.ToString() == attr.Description);
        }
    }
}
```

## Part 3: GraphQL Mutation Error Handling Patterns

### Problem
GraphQL mutations need consistent error handling that distinguishes between business logic errors (expected) and system exceptions (unexpected), while providing clear feedback to clients.

### Solution: HotChocolate Mutation Conventions

This project uses HotChocolate's `AddMutationConventions()` which automatically generates union types for errors.

### Quick Decision Guide
```
Error Handling Decision Tree:
├─ Is it a validation error?
│  ├─ YES → Return as [Error<DomainValidationException>]
│  └─ NO → Continue...
├─ Is it a business rule violation?
│  ├─ YES → Return as domain exception via [Error<T>]
│  └─ NO → Continue...
├─ Is it an authorization error?
│  ├─ YES → Return as [Error<UnauthorizedException>]
│  └─ NO → Continue...
└─ Is it a system error?
   └─ YES → Let it bubble up to GraphQL errors array
```

### Implementation Pattern

#### 1. Define Domain Exceptions
```csharp
// Domain exceptions for business logic errors
public class DomainValidationException : Exception
{
    public string Field { get; }
    public string Code { get; }

    public DomainValidationException(string field, string message, string code)
        : base(message)
    {
        Field = field;
        Code = code;
    }
}

public class EntityNotFoundException : Exception
{
    public string EntityType { get; }
    public object Id { get; }

    public EntityNotFoundException(string entityType, object id)
        : base($"{entityType} with ID {id} not found")
    {
        EntityType = entityType;
        Id = id;
    }
}

public class BusinessRuleViolationException : Exception
{
    public string Rule { get; }

    public BusinessRuleViolationException(string rule, string message)
        : base(message)
    {
        Rule = rule;
    }
}
```

#### 2. Create Mutation with Error Attributes
```csharp
public class Mutation
{
    // Declare expected errors with [Error<T>] attributes
    [Error<DomainValidationException>]
    [Error<EntityNotFoundException>]
    [Error<BusinessRuleViolationException>]
    public async Task<CreateShiftPayload> CreateShiftAsync(
        CreateShiftInput input,
        IMediator mediator,
        CancellationToken ct)
    {
        // Validation
        if (input.StartTime >= input.EndTime)
        {
            throw new DomainValidationException(
                nameof(input.StartTime),
                "Start time must be before end time",
                "INVALID_TIME_RANGE");
        }

        // Check entity exists
        var employee = await mediator.Send(
            new GetEmployeeByIdQuery(input.EmployeeId), ct);

        if (employee is null)
        {
            throw new EntityNotFoundException("Employee", input.EmployeeId);
        }

        // Business rule check
        if (await HasConflictingShift(input, mediator, ct))
        {
            throw new BusinessRuleViolationException(
                "NO_OVERLAPPING_SHIFTS",
                "Employee already has a shift during this time period");
        }

        // Success case - return payload with data only
        var shift = await mediator.Send(
            new CreateShiftCommand(input), ct);

        return new CreateShiftPayload { Shift = shift };
    }
}
```

#### 3. Define Simple Success Payload
```csharp
// Payload only contains success data
// Errors are handled by [Error<T>] attributes
public class CreateShiftPayload
{
    public Shift? Shift { get; init; }

    // Optional: Include related data
    public Employee? Employee { get; init; }

    // Optional: Client mutation ID for Relay
    public string? ClientMutationId { get; init; }
}
```

#### 4. Generated Union Type (Automatic)
HotChocolate automatically generates:
```graphql
union CreateShiftResult =
    CreateShiftPayload |
    DomainValidationException |
    EntityNotFoundException |
    BusinessRuleViolationException
```

### Client Usage Patterns

#### JavaScript/TypeScript Client
```typescript
const result = await client.mutate({
  mutation: CREATE_SHIFT,
  variables: { input }
});

// Handle union type result
switch (result.data.createShift.__typename) {
  case 'CreateShiftPayload':
    // Success
    console.log('Shift created:', result.data.createShift.shift);
    break;

  case 'DomainValidationException':
    // Validation error
    showFieldError(
      result.data.createShift.field,
      result.data.createShift.message
    );
    break;

  case 'EntityNotFoundException':
    // Entity not found
    showError(`${result.data.createShift.entityType} not found`);
    break;

  case 'BusinessRuleViolationException':
    // Business rule violation
    showWarning(result.data.createShift.message);
    break;
}
```

#### GraphQL Query
```graphql
mutation CreateShift($input: CreateShiftInput!) {
  createShift(input: $input) {
    __typename
    ... on CreateShiftPayload {
      shift {
        id
        startTime
        endTime
        employee { firstName lastName }
      }
    }
    ... on DomainValidationException {
      field
      message
      code
    }
    ... on EntityNotFoundException {
      entityType
      id
      message
    }
    ... on BusinessRuleViolationException {
      rule
      message
    }
  }
}
```

### Validation Patterns

#### What HotChocolate Validates Automatically
HotChocolate handles these validations for you - **DO NOT duplicate them**:
- ✅ Required fields (non-nullable types in GraphQL schema)
- ✅ Type correctness (DateTime, Guid, int, string, etc.)
- ✅ Enum values match defined options
- ✅ List/array constraints from schema
- ✅ Input object structure matches schema definition

#### What Requires Custom Validation
You **MUST** validate these business rules yourself:
- ❗ Date/time ranges and logical relationships
- ❗ Business rule constraints (max hours, min values, etc.)
- ❗ Cross-field dependencies
- ❗ Format validations (email, phone, regex patterns)
- ❗ Domain-specific rules (no overlapping shifts, etc.)
- ❗ External data dependencies (entity exists, permissions, etc.)

#### Input Validation

Only add custom validation for **business logic** rules:

```csharp
public class CreateShiftInput : IValidatableObject
{
    // No [Required] needed - HotChocolate validates non-nullable types
    public DateTime StartTime { get; init; }
    public DateTime EndTime { get; init; }
    public Guid EmployeeId { get; init; }

    // Only business logic validation needed
    public IEnumerable<ValidationResult> Validate(ValidationContext context)
    {
        if (StartTime >= EndTime)
        {
            yield return new ValidationResult(
                "Start time must be before end time",
                new[] { nameof(StartTime), nameof(EndTime) });
        }

        if (StartTime < DateTime.UtcNow.AddMinutes(-5))
        {
            yield return new ValidationResult(
                "Cannot create shifts in the past",
                new[] { nameof(StartTime) });
        }
    }
}
```

#### FluentValidation Integration
```csharp
public class CreateShiftInputValidator : AbstractValidator<CreateShiftInput>
{
    public CreateShiftInputValidator()
    {
        // Business logic validation only
        RuleFor(x => x.StartTime)
            .LessThan(x => x.EndTime)
            .WithMessage("Start time must be before end time");

        // No need for NotEmpty on Guid - HotChocolate handles non-nullable validation

        RuleFor(x => x.EndTime.Subtract(x.StartTime))
            .LessThanOrEqualTo(TimeSpan.FromHours(12))
            .WithMessage("Shift cannot exceed 12 hours");

        // Add business-specific rules
        RuleFor(x => x.StartTime)
            .Must(BeInFuture)
            .WithMessage("Cannot create shifts in the past");
    }

    private bool BeInFuture(DateTime startTime) =>
        startTime >= DateTime.UtcNow.AddMinutes(-5);
}
```

### Error Types Reference

#### Business Logic Errors (Expected)
Return via `[Error<T>]` attributes:
- Validation errors
- Entity not found
- Business rule violations
- Insufficient permissions
- Concurrency conflicts

#### System Errors (Unexpected)
Let bubble to GraphQL errors array:
- Database connection failures
- External service timeouts
- Null reference exceptions
- Unhandled exceptions

### Configuration

```csharp
public static class GraphQLExtensions
{
    public static IServiceCollection AddGraphQL(this IServiceCollection services)
    {
        services
            .AddGraphQLServer()
            .AddMutationConventions()  // CRITICAL: Enables [Error<T>] pattern
            .AddMutationType<Mutation>()
            .AddErrorFilter<CustomErrorFilter>()  // Optional: Custom error filtering
            .ModifyOptions(o =>
            {
                o.IncludeExceptionDetails = Environment.IsDevelopment();
            });

        return services;
    }
}
```

### Custom Error Filter
```csharp
public class CustomErrorFilter : IErrorFilter
{
    public IError OnError(IError error)
    {
        // Log system errors
        if (error.Exception is not null)
        {
            Log.Error(error.Exception, "GraphQL execution error");
        }

        // Hide sensitive information in production
        if (!Environment.IsDevelopment() &&
            error.Exception is not DomainException)
        {
            return error.WithMessage("An error occurred processing your request");
        }

        return error;
    }
}
```

### Error Handling Testing

```csharp
[Fact]
public async Task CreateShift_WithInvalidTime_ReturnsValidationError()
{
    // Arrange
    var input = new CreateShiftInput
    {
        StartTime = DateTime.UtcNow,
        EndTime = DateTime.UtcNow.AddHours(-1), // End before start
        EmployeeId = Guid.NewGuid()
    };

    // Act
    var result = await ExecuteMutation(
        @"mutation($input: CreateShiftInput!) {
            createShift(input: $input) {
                __typename
                ... on DomainValidationException {
                    field
                    code
                    message
                }
            }
        }",
        new { input });

    // Assert
    result.Data["createShift"]["__typename"]
        .Should().Be("DomainValidationException");
    result.Data["createShift"]["field"]
        .Should().Be("StartTime");
    result.Data["createShift"]["code"]
        .Should().Be("INVALID_TIME_RANGE");
}

[Fact]
public async Task CreateShift_WithNonExistentEmployee_ReturnsNotFound()
{
    // Arrange
    var input = new CreateShiftInput
    {
        EmployeeId = Guid.NewGuid(), // Non-existent
        StartTime = DateTime.UtcNow,
        EndTime = DateTime.UtcNow.AddHours(8)
    };

    // Act & Assert
    var result = await ExecuteMutation(/* ... */);

    result.Data["createShift"]["__typename"]
        .Should().Be("EntityNotFoundException");
    result.Data["createShift"]["entityType"]
        .Should().Be("Employee");
}
```

## Part 4: GraphQL Mutation Patterns

### Problem
Inconsistent mutation patterns lead to unpredictable API and client integration issues.

### Solution

#### Input/Payload Pattern
Every mutation MUST have:
1. Single `Input` object parameter
2. Return a `Payload` object (not raw entity)
3. Include `clientMutationId` for Relay compatibility

#### Naming Conventions
- **Input**: `[Verb][Entity]Input` (e.g., `CreateShiftInput`)
- **Payload**: `[Verb][Entity]Payload` (e.g., `CreateShiftPayload`)
- **Verbs**: ONLY use `create`, `update`, `delete` (never `add`, `save`, `remove`)

#### Implementation Example

```csharp
// Input Type
public record CreateShiftInput(
    Guid EmployeeId,
    DateTime StartTime,
    DateTime EndTime,
    string? ClientMutationId = null);

// Payload Type (Success only - errors via [Error] attribute)
public record CreateShiftPayload(
    Shift? Shift,
    string? ClientMutationId = null);

// Mutation Implementation
[ExtendObjectType(OperationTypeNames.Mutation)]
public class ShiftMutations
{
    [Error<DomainValidationException>]
    [Error<UnauthorizedException>]
    public async Task<CreateShiftPayload> CreateShift(
        CreateShiftInput input,
        IMediator mediator,
        CancellationToken ct)
    {
        var command = new CreateShiftCommand(
            input.EmployeeId,
            input.StartTime,
            input.EndTime);

        var shift = await mediator.Send(command, ct);

        return new CreateShiftPayload(shift, input.ClientMutationId);
    }
}
```

#### Current Error Handling (Standard Exceptions)
Currently, errors are returned as standard GraphQL errors in the response:
```csharp
// Exceptions thrown in handlers become GraphQL errors
public async Task<CreateShiftPayload> CreateShift(
    CreateShiftInput input,
    IMediator mediator,
    CancellationToken ct)
{
    // Validation exceptions become GraphQL errors
    if (input.StartTime > input.EndTime)
        throw new GraphQLException("Start time must be before end time");

    var command = new CreateShiftCommand(/*...*/);
    var shift = await mediator.Send(command, ct);

    return new CreateShiftPayload { CreatedShift = shift };
}
```

#### Future Enhancement: Error Unions with HotChocolate Conventions
When mutation conventions are enabled, use `[Error<T>]` attributes for type-safe error handling:
```csharp
// Program.cs configuration (future)
builder.Services
    .AddGraphQLServer()
    .AddMutationConventions(); // Enables [Error] attributes

// Domain exception that becomes a user error
public class DomainValidationException : Exception
{
    public string Code { get; }
    public string[] Path { get; }

    public DomainValidationException(string code, string message, params string[] path)
        : base(message)
    {
        Code = code;
        Path = path;
    }
}
```

#### Client Usage Example
```graphql
mutation CreateShift($input: CreateShiftInput!) {
  createShift(input: $input) {
    ... on CreateShiftPayload {
      shift {
        id
        startTime
        endTime
      }
      clientMutationId
    }
    ... on DomainValidationException {
      code
      message
      path
    }
  }
}
```

### Mutation Testing
```csharp
[Fact]
public async Task CreateShift_WithValidInput_ReturnsPayload()
{
    // Arrange
    var executor = await TestHelper.CreateExecutorAsync();
    var input = new {
        employeeId = Guid.NewGuid(),
        startTime = DateTime.UtcNow,
        endTime = DateTime.UtcNow.AddHours(8)
    };

    // Act
    var result = await executor.ExecuteAsync(
        QueryRequestBuilder.New()
            .SetQuery(@"
                mutation($input: CreateShiftInput!) {
                    createShift(input: $input) {
                        ... on CreateShiftPayload {
                            shift { id }
                        }
                        ... on DomainValidationException {
                            message
                        }
                    }
                }")
            .SetVariableValue("input", input)
            .Create());

    // Assert
    result.ShouldNotHaveErrors();
    result.Data.ShouldContainKey("createShift");
}
```

## Part 5: GraphQL Pagination Patterns

### Implementation Status
⚠️ **Note**: Pagination attributes are planned features for the Fenix API.
Currently, queries may return unbounded results. When implementing pagination, follow the patterns below to prevent performance issues.

### Problem
Unbounded list queries can return millions of records, causing memory issues and timeouts.

### Solution

#### Cursor-Based Pagination (Recommended)
```csharp
// ❌ WRONG - Unbounded query
public IQueryable<Shift> GetShifts(IReadDbContext db) =>
    db.Shifts;

// ✅ CORRECT - Cursor paging with order
[UsePaging(IncludeTotalCount = true, MaxPageSize = 100)]
public IQueryable<Shift> GetShifts(IReadDbContext db) =>
    db.Shifts
        .OrderBy(s => s.StartTime);  // Order required for consistent paging
```

#### Configuration in Program.cs
```csharp
builder.Services
    .AddGraphQLServer()
    .SetPagingOptions(new PagingOptions
    {
        MaxPageSize = 100,
        DefaultPageSize = 20,
        IncludeTotalCount = true
    });
```

#### Client Query Pattern
```graphql
query GetShifts($first: Int!, $after: String) {
  shifts(first: $first, after: $after) {
    edges {
      cursor
      node {
        id
        startTime
        endTime
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount  # Only if IncludeTotalCount = true
  }
}
```

#### Offset Pagination (When Required)
```csharp
[UseOffsetPaging(MaxPageSize = 100)]
public IQueryable<Employee> GetEmployees(IReadDbContext db) =>
    db.Employees
        .OrderBy(e => e.Name);
```

### Pagination Testing
```csharp
[Fact]
public async Task Shifts_EnforcesMaxPageSize()
{
    // Arrange
    await SeedShifts(200);

    // Act - Request more than max
    var result = await ExecuteQuery(@"
        { shifts(first: 200) { edges { node { id } } } }");

    // Assert - Only returns MaxPageSize
    result.Data["shifts"]["edges"].Should().HaveCount(100);
}
```

## Part 6: GraphQL Projection & Filtering Patterns

### Implementation Status
⚠️ **Note**: Projection, filtering, and paging attributes are planned features for the Fenix API.
Currently, queries return full entities with manual field selection. When implementing these features, follow the patterns below.

### Problem
Fetching unnecessary fields from database causes performance issues and memory overhead.

### Solution

#### Basic Projection Pattern
```csharp
[UseProjection]
[UseFiltering]
[UseSorting]
[UsePaging(IncludeTotalCount = true, MaxPageSize = 100)]
public IQueryable<Employee> GetEmployees(IReadDbContext db) =>
    db.Employees;
```

#### What Each Attribute Does
- `[UseProjection]` - Only fetches requested fields from DB
- `[UseFiltering]` - Enables `where` argument for client filtering
- `[UseSorting]` - Enables `order` argument for sorting
- `[UsePaging]` - Adds cursor-based pagination

#### Client Query Example
```graphql
query {
  employees(
    where: { department: { eq: "Engineering" } }
    order: { name: ASC }
    first: 10
  ) {
    edges {
      node {
        id
        name  # Only these fields are fetched
        email # from the database
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

### Current Implementation (Without Attributes)
Until projection attributes are implemented, use this pattern:
```csharp
public async Task<IEnumerable<Employee>> GetEmployees(
    IReadDbContext db,  // No [Service] attribute needed in HotChocolate 14+
    CancellationToken ct)
{
    // Manual pagination and filtering
    return await db.Employees
        .Where(e => e.IsActive) // Manual filtering
        .OrderBy(e => e.Name)    // Manual ordering
        .Take(100)               // Manual page size limit
        .ToListAsync(ct);
}
```

## Part 7: GraphQL Sorting Patterns

### Problem
GraphQL sorting requires maintaining object hierarchy in sort inputs, matching the exact structure of GraphQL types. Flattened properties break the graph model and make APIs inconsistent.

### Critical Rule
**Sorting inputs MUST mirror the object's field structure exactly** - no flattening allowed.

### Solution: Nested Sort Input Pattern

#### Quick Decision Guide
```
Sorting Implementation Decision Tree:
├─ Does type have nested objects?
│  ├─ YES → Create nested sort inputs for each
│  └─ NO → Simple flat sort input
├─ Does nested object have properties?
│  ├─ YES → Add sort fields in nested input
│  └─ NO → Skip that nested input
└─ Are you tempted to flatten?
   └─ DON'T → Keep nested structure always
```

#### Implementation Pattern

##### 1. Analyze Type Structure
```graphql
type Shift {
  id: ID!
  time: DateTimeRange!      # Nested object
  shiftType: ShiftType       # Nested object
  section: Section           # Nested object
  employee: Employee         # Nested object
}

type DateTimeRange {
  start: DateTime!
  end: DateTime!
}

type ShiftType {
  id: ID!
  name: String!
  calendarSection: Int
}
```

##### 2. Create Matching Sort Inputs
```csharp
// Main sort input mirrors Shift structure
public record ShiftSortInput
{
    public SortEnumType? Id { get; init; }
    public TimeSortInput? Time { get; init; }           // Nested, not flattened!
    public ShiftTypeSortInput? ShiftType { get; init; } // Nested, not flattened!
    public SectionSortInput? Section { get; init; }     // Nested, not flattened!
    public EmployeeSortInput? Employee { get; init; }   // Nested, not flattened!
}

// Nested sort input for DateTimeRange
public record TimeSortInput
{
    public SortEnumType? Start { get; init; }
    public SortEnumType? End { get; init; }
}

// Nested sort input for ShiftType
public record ShiftTypeSortInput
{
    public SortEnumType? Id { get; init; }
    public SortEnumType? Name { get; init; }
    public SortEnumType? CalendarSection { get; init; }
}
```

##### 2a. CRITICAL: SortDirection Type Mapping

**MANDATORY**: All `SortDirection` properties in sort input types MUST include the `[GraphQLType]` attribute to map to HotChocolate's `SortEnumType` in the GraphQL schema.

```csharp
// ❌ WRONG - Missing GraphQLType attribute
public sealed record EmployeeSortInput
{
    public SortDirection? DisplayName { get; init; }  // Creates duplicate enum in schema!
    public SortDirection? FirstName { get; init; }    // Creates duplicate enum in schema!
}

// ✅ CORRECT - With GraphQLType attribute
public sealed record EmployeeSortInput
{
    [GraphQLType(typeof(HotChocolate.Data.Sorting.DefaultSortEnumType))]
    public SortDirection? DisplayName { get; init; }  // Maps to SortEnumType

    [GraphQLType(typeof(HotChocolate.Data.Sorting.DefaultSortEnumType))]
    public SortDirection? FirstName { get; init; }    // Maps to SortEnumType
}
```

**Why This Matters**:
- Without `[GraphQLType]`, HotChocolate exposes the internal `SortDirection` enum directly
- Creates TWO enums in schema: `SortDirection` AND `SortEnumType` (inconsistent!)
- Shifts use `SortEnumType` (via attribute), employees would use `SortDirection` (without attribute)
- Client API becomes inconsistent - same concept with different types

**Real Implementation Example**:
```csharp
using HotChocolate;
using Intrigma.Fenix.Api.GraphQL.Common;

[GraphQLName("EmployeeOrderInput")]
public sealed record EmployeeSortInput
{
    [GraphQLDescription(Employee.DisplayNameDescription)]
    [GraphQLType(typeof(HotChocolate.Data.Sorting.DefaultSortEnumType))]  // ← REQUIRED!
    public SortDirection? DisplayName { get; init; }

    [GraphQLDescription(Person.FirstNameDescription)]
    [GraphQLType(typeof(HotChocolate.Data.Sorting.DefaultSortEnumType))]  // ← REQUIRED!
    public SortDirection? FirstName { get; init; }

    [GraphQLDescription(Employee.OrderDescription)]
    [GraphQLType(typeof(HotChocolate.Data.Sorting.DefaultSortEnumType))]  // ← REQUIRED!
    public SortDirection? Order { get; init; }
}

// Same requirement for nested sort inputs
public sealed record DateTimeRangeSortCustomInput
{
    [GraphQLDescription(DateTimeRange.StartDescription)]
    [GraphQLType(typeof(HotChocolate.Data.Sorting.DefaultSortEnumType))]  // ← REQUIRED!
    public SortDirection? Start { get; init; }

    [GraphQLDescription(DateTimeRange.EndDescription)]
    [GraphQLType(typeof(HotChocolate.Data.Sorting.DefaultSortEnumType))]  // ← REQUIRED!
    public SortDirection? End { get; init; }
}
```

**Verification**:
Check your GraphQL schema - you should see ONLY `SortEnumType`, NOT `SortDirection`:
```graphql
# ✅ CORRECT Schema
input EmployeeOrderInput {
  displayName: SortEnumType
  firstName: SortEnumType
}

enum SortEnumType {
  ASC
  DESC
}

# ❌ WRONG Schema (missing attributes)
input EmployeeOrderInput {
  displayName: SortDirection  # Wrong enum!
  firstName: SortDirection    # Wrong enum!
}

enum SortDirection {  # Duplicate enum!
  ASC
  DESC
}

enum SortEnumType {   # HotChocolate's enum
  ASC
  DESC
}
```

**Checklist**:
- [ ] Every `SortDirection` property has `[GraphQLType(typeof(HotChocolate.Data.Sorting.DefaultSortEnumType))]`
- [ ] GraphQL schema contains only `SortEnumType`, no `SortDirection`
- [ ] All sort inputs (root and nested) follow this pattern consistently
- [ ] SchemaTests verify no `SortDirection` enum exists in schema

##### 3. Apply in Query
```graphql
query GetShifts {
  shifts(
    order: [
      { time: { start: ASC } }           # Correct: Nested
      { shiftType: { calendarSection: ASC } }  # Correct: Nested
    ]
  ) {
    id
    time { start end }
    shiftType { name calendarSection }
  }
}
```

#### Real-World Example: ShiftSorter Implementation

```csharp
public static class ShiftSorter
{
    public static IOrderedQueryable<Shift> ApplySorting(
        IQueryable<Shift> query,
        ShiftSortInput[]? sortInputs)
    {
        if (sortInputs is null || sortInputs.Length == 0)
            return query.OrderBy(s => s.Id);

        IOrderedQueryable<Shift>? orderedQuery = null;

        foreach (var sortInput in sortInputs)
        {
            // Time sorting (nested object)
            if (sortInput.Time is { } timeSort)
            {
                if (timeSort.Start is { } startSort)
                {
                    orderedQuery = ApplySort(query, orderedQuery,
                        s => s.Time.Start, startSort);
                }
                if (timeSort.End is { } endSort)
                {
                    orderedQuery = ApplySort(query, orderedQuery,
                        s => s.Time.End, endSort);
                }
            }

            // ShiftType sorting (nested object)
            if (sortInput.ShiftType is { } shiftTypeSort)
            {
                if (shiftTypeSort.CalendarSection is { } sectionSort)
                {
                    orderedQuery = ApplySort(query, orderedQuery,
                        s => s.ShiftType != null
                            ? s.ShiftType.CalendarSection
                            : null,
                        sectionSort);
                }
                if (shiftTypeSort.Name is { } nameSort)
                {
                    orderedQuery = ApplySort(query, orderedQuery,
                        s => s.ShiftType != null
                            ? s.ShiftType.Name
                            : null,
                        nameSort);
                }
            }

            // Direct property sorting
            if (sortInput.Id is { } idSort)
            {
                orderedQuery = ApplySort(query, orderedQuery,
                    s => s.Id, idSort);
            }
        }

        return orderedQuery ?? query.OrderBy(s => s.Id);
    }

    private static IOrderedQueryable<T> ApplySort<T, TKey>(
        IQueryable<T> source,
        IOrderedQueryable<T>? existing,
        Expression<Func<T, TKey>> keySelector,
        SortEnumType direction)
    {
        return existing is null
            ? direction == SortEnumType.ASC
                ? source.OrderBy(keySelector)
                : source.OrderByDescending(keySelector)
            : direction == SortEnumType.ASC
                ? existing.ThenBy(keySelector)
                : existing.ThenByDescending(keySelector);
    }
}
```

### Anti-Patterns to Avoid

#### ❌ The "Flattened Properties" Anti-Pattern
```csharp
// WRONG - Flattens nested structure
public record BadShiftSortInput
{
    public SortEnumType? Id { get; init; }
    public SortEnumType? StartTime { get; init; }      // ❌ Flattened!
    public SortEnumType? EndTime { get; init; }        // ❌ Flattened!
    public SortEnumType? ShiftTypeName { get; init; }  // ❌ Flattened!
}
```

#### ❌ The "String Path" Anti-Pattern
```graphql
# WRONG - Using string paths
query {
  shifts(orderBy: "time.start", direction: ASC) {
    # ...
  }
}
```

#### ❌ The "Mixed Approach" Anti-Pattern
```csharp
// WRONG - Inconsistent: some nested, some flat
public record InconsistentSortInput
{
    public TimeSortInput? Time { get; init; }     // ✅ Nested
    public SortEnumType? EmployeeName { get; init; }  // ❌ Should be Employee: { Name }
}
```

### Null Handling in Nested Properties

When sorting on nullable nested objects, handle null gracefully:

```csharp
// Handle nullable nested objects
if (sortInput.ShiftType?.Name is { } nameSort)
{
    orderedQuery = ApplySort(query, orderedQuery,
        s => s.ShiftType != null
            ? s.ShiftType.Name
            : null,  // Nulls sort first/last based on DB settings
        nameSort);
}
```

### Multiple Sort Criteria

Support arrays of sort inputs for multi-level sorting:

```graphql
query {
  shifts(
    order: [
      { time: { start: ASC } },        # Primary sort
      { shiftType: { name: ASC } },    # Secondary sort
      { id: ASC }                      # Tertiary sort
    ]
  ) {
    # ...
  }
}
```

### Schema Validation

Use introspection to verify sort input structure:

```graphql
query ValidateSortStructure {
  __type(name: "ShiftSortInput") {
    inputFields {
      name
      type {
        name
        kind
        inputFields {  # Should see nested inputs here
          name
        }
      }
    }
  }
}
```

### Decision Matrix

| Type Structure | Sort Input Pattern | Example |
|---------------|-------------------|----------|
| Flat object | Flat sort input | `{ id: ASC, name: DESC }` |
| Nested object | Nested sort input | `{ time: { start: ASC } }` |
| Array field | Not sortable | Cannot sort by `tags[]` |
| Computed field | Add to sort input if indexed | `{ fullName: ASC }` if DB has index |
| Related entity | Nested sort input | `{ employee: { lastName: ASC } }` |

### Sorting Testing
```csharp
[Fact]
public void SortInput_Should_Match_Type_Structure()
{
    // Verify sort input has nested structure
    var sortInput = new ShiftSortInput
    {
        Time = new TimeSortInput { Start = SortEnumType.ASC },
        ShiftType = new ShiftTypeSortInput { Name = SortEnumType.DESC }
    };

    sortInput.Time.Should().NotBeNull();
    sortInput.ShiftType.Should().NotBeNull();
    // No properties like StartTime or ShiftTypeName should exist
}

[Fact]
public async Task Sorting_Should_Apply_In_Correct_Order()
{
    var shifts = await GetShifts(new[]
    {
        new ShiftSortInput { Time = new() { Start = SortEnumType.ASC } },
        new ShiftSortInput { Id = SortEnumType.ASC }
    });

    shifts.Should().BeInAscendingOrder(s => s.Time.Start)
        .And.ThenBeInAscendingOrder(s => s.Id);
}
```

## Comprehensive Checklist

### DataLoader Patterns
- [ ] Using `[DataLoader]` attribute pattern
- [ ] Method name follows `GetXxxAsync` convention
- [ ] Returns `Task<IReadOnlyDictionary<TKey, TValue>>`
- [ ] Defensive copying in key constructors
- [ ] Null vs empty semantics documented
- [ ] Using IReadDbContext for reads (has AsNoTracking configured)
- [ ] Order-agnostic equality for filter keys
- [ ] Chunking large ID sets to avoid SQL parameter limits

### Description Constants
- [ ] Define description constants as `public const string` in source classes
- [ ] Use PascalCase with "Description" suffix (e.g., `CalendarSectionDescription`)
- [ ] Object types (entities) should have `[GraphQLDescription(Description)]` at class level
- [ ] Input types (QueryInput, SortInput, FilterInput) should NOT have class-level descriptions
- [ ] Query/Mutation methods should NOT have descriptions
- [ ] Apply descriptions to complex fields using `[GraphQLDescription]`
- [ ] Reference source class constants in all related input types for field descriptions
- [ ] Group description constants at the top of the class with a comment
- [ ] Make descriptions meaningful and include examples where helpful

### Error Handling
- [ ] Domain exceptions defined for business errors
- [ ] [Error<T>] attributes on mutations
- [ ] Payload contains only success data
- [ ] AddMutationConventions() in configuration
- [ ] Client handles all error types
- [ ] Validation at appropriate boundaries
- [ ] System errors logged properly
- [ ] Sensitive data not exposed in production

### Mutations
- [ ] Input type defined with `Input` suffix
- [ ] Payload type defined with `Payload` suffix
- [ ] Using approved verb (create/update/delete)
- [ ] Single input parameter
- [ ] ClientMutationId included (optional for Relay compatibility)
- [ ] [Error] attributes for expected exceptions (when conventions enabled)
- [ ] No business errors in payload type
- [ ] Validation in handler/command
- [ ] Authorization check present
- [ ] Tenant filtering applied where needed

### Pagination
- [ ] MaxPageSize configured (typically 100)
- [ ] OrderBy specified for consistent results
- [ ] Using IReadDbContext (has AsNoTracking configured)
- [ ] IncludeTotalCount only when needed (expensive)
- [ ] DefaultPageSize reasonable (10-50)
- [ ] Return IQueryable not IEnumerable

### Projection
- [ ] UseProjection on all list queries (when available)
- [ ] Using IReadDbContext (has AsNoTracking configured)
- [ ] MaxPageSize configured (manual Take() for now)
- [ ] Ordering specified for consistent pagination
- [ ] Filtering enabled where needed
- [ ] Return IQueryable (not IEnumerable) when attributes are enabled

### Sorting
- [ ] Sort inputs mirror exact type structure
- [ ] NO flattened properties (no `startTime`, use `time: { start }`)
- [ ] Nested sort input types created for each nested object
- [ ] **CRITICAL**: All `SortDirection` properties have `[GraphQLType(typeof(HotChocolate.Data.Sorting.DefaultSortEnumType))]`
- [ ] GraphQL schema contains ONLY `SortEnumType`, not `SortDirection`
- [ ] Null handling for optional nested objects
- [ ] Array support for multiple sort criteria
- [ ] Default sort order when none specified
- [ ] Pattern matching for null checks (use `is { }`)

## Common Mistakes to Avoid

### DataLoader Mistakes
- ❌ Not using defensive copies (external mutations)
- ❌ Treating null and empty the same
- ❌ Order-dependent comparison for filters
- ❌ **Adding manual tenant filters** - Redundant and may conflict with automatic filtering
- ❌ Using Include() in DataLoader
- ❌ Not chunking large IN clauses (SQL parameter limit exceeded)
- ❌ Assuming EF Core will handle chunking (it doesn't!)

### Description Mistakes
- ❌ Adding descriptions to input types at class level (they don't need them)
- ❌ Adding descriptions to query/mutation methods (they don't need them)
- ❌ Defining descriptions in SortInput/FilterInput classes instead of source
- ❌ Using inline strings in `[GraphQLDescription("...")]` attributes
- ❌ Forgetting to make constants `public` (they need to be accessible)
- ❌ Creating duplicate description constants in multiple places
- ❌ Not applying the description to the source object type itself

### Error Handling Mistakes
- ❌ Putting errors in payload type (use [Error<T>] instead)
- ❌ Using UserError[] in payload (legacy pattern)
- ❌ Throwing system exceptions for business logic
- ❌ Not declaring expected errors with [Error<T>]
- ❌ Exposing sensitive data in error messages
- ❌ Missing AddMutationConventions() configuration
- ❌ Inconsistent error types across mutations
- ❌ Using [Required] attribute on non-nullable types (HotChocolate handles this)
- ❌ Validating type correctness manually (HotChocolate validates types)
- ❌ Checking for empty GUIDs when type is non-nullable

### Mutation Mistakes
- ❌ Returning raw entity instead of payload
- ❌ Multiple parameters instead of input object
- ❌ Using `add`, `save`, `remove` verbs
- ❌ Putting errors in payload type
- ❌ Missing [Error] attributes
- ❌ No validation before persistence

### Pagination Mistakes
- ❌ No MaxPageSize - allows requests for millions of records
- ❌ Missing OrderBy - inconsistent pagination
- ❌ Using offset paging for large datasets - performance degrades
- ❌ Always including totalCount - expensive for large tables

### Projection Mistakes
- ❌ Using IWriteDbContext for read operations - causes tracking overhead
- ❌ Using IEnumerable instead of IQueryable - defeats projection
- ❌ Missing order for pagination - inconsistent results
- ❌ No MaxPageSize - allows unbounded queries

### Sorting Mistakes
- ❌ **Missing `[GraphQLType]` attribute on `SortDirection` properties** - Creates duplicate enums!
- ❌ Flattening nested properties
- ❌ Using string paths for sorting
- ❌ Inconsistent structure between type and sort input
- ❌ Not handling null nested objects
- ❌ Missing default sort order
- ❌ Using HasValue/Value instead of pattern matching

## Part 8: Entity ID Naming Constants

### Problem
Relay specification requires entity IDs named "id", but cross-entity references need descriptive names ("employeeId", "customerId").

### Solution
Every GraphQL entity MUST define two ID constants:

```csharp
public sealed record Employee
{
    public const string IdName = "id";              // Entity's own ID field
    public const string IdFullName = "employeeId";  // Cross-entity references

    [GraphQLName("id")]
    public required Guid Guid { get; init; }
}
```

### Usage Rules

**Use `IdName` (or literal `"id"`):** Entity's own ID field only
```csharp
[GraphQLName("id")]  // Entity's own field
public required Guid Guid { get; init; }
```

**Use `IdFullName`:** All cross-entity references
```csharp
// Exceptions
public class EmployeeNotFoundException : ObjectNotFoundException
{
    [GraphQLName(Employee.IdFullName)]  // "employeeId"
    public override Guid ObjectGuid { get; protected set; }
}

// Input types
public record CreateRequestInput
{
    [GraphQLName(Employee.IdFullName)]  // "employeeId"
    public required Guid EmployeeId { get; init; }
}
```

### Common Mistakes

❌ Using `IdName` for cross-references → produces confusing "id"
❌ Only defining one constant → missing flexibility
❌ Using literal strings → bypasses type safety

## Related References

- [INPUT_TYPE_ATTRIBUTES_GUIDELINE.MD](./INPUT_TYPE_ATTRIBUTES_GUIDELINE.MD) - GraphQL input type attributes, validation, and naming conventions
- [BACKEND_GUIDELINE.MD](./BACKEND_GUIDELINE.MD) - Collection patterns and Ch.cs utilities
- [PERFORMANCE_GUIDELINE.MD](./PERFORMANCE_GUIDELINE.MD) - EF Core N+1 prevention strategies
- [SECURITY_GUIDELINES.MD](./SECURITY_GUIDELINES.MD) - Multi-tenant isolation and authorization
- [/src/CLAUDE.md](../../src/CLAUDE.md) - Backend GraphQL development standards
