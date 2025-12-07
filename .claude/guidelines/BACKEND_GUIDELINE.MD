# Backend Development Guidelines

This comprehensive guideline consolidates essential backend patterns and best practices for Fenix development, combining collection handling, legacy system integration, and migration strategies.

> **LLM Compliance Note**: Treat this document as the authoritative checklist for backend work. Read it end-to-end before starting, follow every instruction exactly, and do not improvise steps or skip validations unless the guideline explicitly grants an exception.

## ✅ IMPORTANT: Automatic Tenant Filtering (2025+)

**Tenant isolation is now fully implemented** using EF Core Global Query Filters.

**What This Means for Backend Development**:
- ✅ **Automatic tenant filtering** - All EF Core queries are filtered by CustomerId/ScheduleId
- ✅ **No manual filtering needed** - You DO NOT need to add `.Where(e => e.CustomerId == ...)`
- ✅ **Security by default** - Cross-tenant data access is impossible
- ❌ **DO NOT add manual tenant filters** - They're redundant and may cause bugs
- ⚠️ **Exceptions: Person and MailLog** - These entities do NOT have automatic filtering

**Implementation**:
- ReadDbContext and WriteDbContext inherit from TenantAwareDbContext
- Global Query Filters applied to all entities except Person and MailLog
- ITenantContext (Fenix.App) interface uses `int?` properties
- HttpSessionTenantContext validates non-null values on construction
- See `/specs/tenant-filtering_spec.md` for architecture details

## How to Use This Guideline
1. Review the entire document prior to planning or coding.
2. Execute tasks in the order they appear within each section unless a section states otherwise.
3. When encountering referenced recipes or agents, consult them immediately and apply the documented patterns verbatim.
4. Record any deviations as risks in your working notes and flag them for review.

**Tags:** backend, collections, legacy, migration, patterns, ch.cs, performance, safety, memory, iss
**Agents:** dotnet-specialist, performance-profiler, code-reviewer, security-expert
**Risk:** High - Incorrect patterns can cause bugs, security issues, and performance problems
**Context:** .NET 9.0, C# 13, Fenix.Legacy Ch.cs utilities, FluentMigrator

## Part 1: Collection Patterns and Best Practices

### Quick Decision Guide
```
Collection Task Decision Tree:
├─ Need to compare collections?
│  ├─ Order matters? → Use SequenceEqual()
│  └─ Order doesn't matter? → Use Ch.Equivalent()
├─ Receiving collection parameter?
│  ├─ Will you store it? → Defensive copy
│  └─ Just iterating? → No copy needed
├─ Returning collection?
│  ├─ Internal mutable state? → Return copy or ImmutableArray
│  └─ New collection? → Return directly
├─ Creating collection?
│  ├─ Size known? → Use array or pre-sized List
│  ├─ Size unknown? → Use List with estimated capacity
│  └─ Temporary? → Consider Span<T> or ArrayPool
└─ Filter parameter?
   ├─ null → No filter (all items)
   └─ empty → Filter to none (no items)
```

### Ch.cs Utility Reference

The `Intrigma.Core.Collections.Ch` class (via Fenix.Legacy) provides essential collection utilities:

#### Equality and Comparison
```csharp
// Order-agnostic collection comparison (treats as set)
bool Ch.Equivalent<T>(ICollection<T> c1, ICollection<T> c2)
// Returns true if collections contain same elements, regardless of order
// Optimized: uses direct Contains for ≤8 items, HashSet for larger

// Order-agnostic hash code for collections
int GetHashCodeEx(this IEnumerable collection)
// Uses XOR combination - order doesn't affect result
// Perfect for cache keys where order doesn't matter

// Order-sensitive comparison (standard LINQ)
bool SequenceEqual<T>(ICollection<T> c1, ICollection<T> c2)
// Order matters - [A,B] ≠ [B,A]
```

#### Selection and Building
```csharp
// Get item with max/min projected value
// ⚠️ WARNING: Ch.cs MaxBy/MinBy throw InvalidOperationException on empty collections!
// Always check for empty collections first to avoid exceptions
T MaxBy<T, TKey>(this IEnumerable<T> items, Func<T, TKey> projection)
T MinBy<T, TKey>(this IEnumerable<T> items, Func<T, TKey> projection)

// Safe usage patterns:
var maxItem = items.Any() ? items.MaxBy(x => x.Property) : null;
var minItem = items.DefaultIfEmpty().MinBy(x => x.Property);  // Returns default(T) if empty

// Create sized collections
T[] ToArrayEx<T>(this IEnumerable<T> items, int size) // Throws if count ≠ size
List<T> ToListEx<T>(this IEnumerable<T> items, int capacity) // Pre-sized
List<T[]> ToBatch<T>(this ICollection<T> source, int batchSize) // Legacy chunking (use .Chunk() in .NET 6+)
```

### Defensive Copying Patterns

#### Constructor Parameters
```csharp
public sealed class ShiftFilter
{
    private readonly Guid[] _sectionGuids;

    public ShiftFilter(Guid[]? sectionGuids)
    {
        // CRITICAL: Defensive copy prevents external mutations
        _sectionGuids = sectionGuids switch
        {
            null => null,
            [] => [],
            _ => (Guid[])sectionGuids.Clone()
        };
    }

    public IReadOnlyList<Guid>? SectionGuids => _sectionGuids;
}
```

#### Method Returns
```csharp
public class DataContainer
{
    private readonly List<string> _data = new();

    // ❌ WRONG - Exposes internal state
    public List<string> GetDataBad() => _data;

    // ⚠️ CAREFUL - Read-only view NOT thread-safe (underlying list can still be mutated)
    public IReadOnlyList<string> GetDataReadOnly() => _data.AsReadOnly(); // Only prevents modifications via this reference

    // ✅ CORRECT for thread safety - Return defensive copies:
    public List<string> GetDataCopy() => new(_data);              // List copy
    public string[] GetDataArray() => _data.ToArray();            // Array copy

    // ✅ BEST for thread safety - Use immutable collections:
    public ImmutableList<string> GetDataImmutable() => _data.ToImmutableList();
    public ImmutableArray<string> GetDataImmutableArray() => _data.ToImmutableArray();
}
```

### Null vs Empty Semantics

Critical distinction for filtering:
- `null` = no filter applied (return all results)
- `empty array` = explicit filter to none (return no results)

#### Implementation Pattern
```csharp
public class QueryFilter
{
    /// <summary>
    /// Section filter:
    /// - null: No filter (all sections)
    /// - empty: Filter to no sections
    /// - populated: Filter to specified sections
    /// </summary>
    public Guid[]? SectionIds { get; }

    public QueryFilter(Guid[]? sectionIds)
    {
        // Preserve null vs empty distinction
        SectionIds = sectionIds switch
        {
            null => null,
            [] => [],
            _ => (Guid[])sectionIds.Clone()
        };
    }
}

// Usage in query
public async Task<Item[]> GetItems(QueryFilter filter)
{
    var query = dbContext.Items;

    if (filter.SectionIds is not null)
    {
        // Apply filter (empty array will match nothing)
        query = query.Where(i => filter.SectionIds.Contains(i.SectionId));
    }
    // null means no filter - return all

    return await query.ToArrayAsync();
}
```

### Collection Equality Patterns

#### Order-Agnostic (for filters, cache keys)
```csharp
using Intrigma.Core.Collections;

public sealed record DataLoaderKey(Guid[] Ids, string[] Tags)
{
    public bool Equals(DataLoaderKey? other)
    {
        if (other is null) return false;
        // Order doesn't matter for filters
        return Ch.Equivalent(Ids, other.Ids) &&
               Ch.Equivalent(Tags, other.Tags);
    }

    public override int GetHashCode()
    {
        // Order-agnostic hash using XOR
        return HashCode.Combine(
            Ids?.GetHashCodeEx() ?? 0,
            Tags?.GetHashCodeEx() ?? 0);
    }
}
// Result: [A,B] and [B,A] share same cache entry - better performance!
```

#### Order-Dependent (for sequences, user-ordered data)
```csharp
public sealed record SequenceKey(int[] Values)
{
    public bool Equals(SequenceKey? other)
    {
        if (other is null) return false;
        // Order matters for sequences
        return Values.SequenceEqual(other.Values);
    }

    public override int GetHashCode()
    {
        // Order-sensitive hash
        return Values.Aggregate(0, HashCode.Combine);
    }
}
// Result: [1,2,3] ≠ [3,2,1]
```

### Type Filtering Patterns

#### Use OfType<T>() for Null and Type Filtering
```csharp
// ❌ WRONG - Separate null check and cast
var validItems = collection
    .Where(item => item != null)
    .Cast<ShiftType>()
    .ToList();

// ✅ CORRECT - OfType handles both null filtering and casting
var validItems = collection
    .OfType<ShiftType>()
    .ToList();
```

Benefits of `OfType<T>()`:
- Filters out nulls automatically
- Performs safe type casting
- Single operation instead of two
- More idiomatic and readable
- Won't throw on incompatible types (just filters them out)

### Performance Optimization Patterns

#### Use Arrays When Size is Known
```csharp
// ❌ WRONG - List with conversion
public Day[] GenerateDays(DateOnly start, DateOnly end)
{
    var daysCount = (int)(end.DayNumber - start.DayNumber) + 1;
    var days = new List<Day>(daysCount);
    // ... add days ...
    return days.ToArray(); // Conversion overhead
}

// ✅ CORRECT - Direct array
public Day[] GenerateDays(DateOnly start, DateOnly end)
{
    var daysCount = (int)(end.DayNumber - start.DayNumber) + 1;
    var days = new Day[daysCount];
    for (var i = 0; i < daysCount; i++)
    {
        days[i] = new Day { Date = start.AddDays(i) };
    }
    return days; // No conversion
}
```

#### Pre-size Collections
```csharp
// ❌ WRONG - Multiple resizes
var items = new List<Item>();
foreach (var id in knownIds) // Count = 1000
{
    items.Add(LoadItem(id)); // Resizes: 4→8→16→32→...→1024
}

// ✅ CORRECT - Pre-sized
var items = new List<Item>(knownIds.Count);
// Or if returning array:
var items = new Item[knownIds.Count];
```

#### Efficient Batching
```csharp
// For .NET 6+ - Use built-in Chunk() method
var allRecords = GetMillionRecords();
var batches = allRecords.Chunk(1000); // Built-in LINQ extension (preferred)

// For legacy .NET Framework or when Ch.cs is already imported
var batches = allRecords.ToBatch(1000); // Ch.cs utility (legacy)

foreach (var batch in batches)
{
    await ProcessBatchAsync(batch); // Process without overwhelming memory
}

// Note: .Chunk() was added in .NET 6. ToBatch() is from legacy .NET Framework days.
// Prefer .Chunk() in new code, but ToBatch() remains for compatibility.
```

### Memory-Efficient Patterns

#### Avoid Unnecessary Allocations
```csharp
// ❌ WRONG - Creates unnecessary array
if (items.ToArray().Length == 0) { }

// ✅ CORRECT - No allocation
if (!items.Any()) { }
```

#### Use ArrayPool for Temporary Arrays
```csharp
var pool = ArrayPool<byte>.Shared;
var buffer = pool.Rent(4096);
try
{
    ProcessData(buffer);
}
finally
{
    pool.Return(buffer, clearArray: true);
}
```

### Thread Safety Patterns

#### ⚠️ IReadOnlyList is NOT Thread-Safe
```csharp
// ❌ WRONG - IReadOnlyList doesn't provide thread safety
public class UnsafeSharing
{
    private readonly List<string> _items = new();

    // This only prevents modifications through the returned reference
    // Other threads can still mutate _items, causing race conditions
    public IReadOnlyList<string> Items => _items.AsReadOnly();
}

// ✅ CORRECT - Use immutable collections for true thread safety
public class SafeSharing
{
    private readonly ImmutableArray<string> _items;

    public SafeSharing(string[] items)
    {
        _items = items.ToImmutableArray();
    }

    // Truly immutable - safe to share across threads
    public ImmutableArray<string> Items => _items;
}
```

#### Immutable Collections for Sharing
```csharp
using System.Collections.Immutable;

public class SharedConfig
{
    // Thread-safe, immutable
    public ImmutableArray<string> AllowedValues { get; }

    public SharedConfig(string[] values)
    {
        AllowedValues = values.ToImmutableArray();
    }
}
```

#### Concurrent Collections
```csharp
using System.Collections.Concurrent;

public class ThreadSafeCache
{
    private readonly ConcurrentDictionary<string, Item[]> _cache = new();

    // ⚠️ WARNING: GetOrAdd factory may be called multiple times under contention!
    // Only use if factory is thread-safe and idempotent (OK to call multiple times)
    public Item[] GetOrAdd(string key, Func<string, Item[]> factory)
    {
        var items = _cache.GetOrAdd(key, factory);
        // Still return defensive copy to prevent mutations
        return (Item[])items.Clone();
    }

    // ✅ SAFER: Use Lazy<T> to guarantee single factory execution
    private readonly ConcurrentDictionary<string, Lazy<Item[]>> _safeCache = new();

    public Item[] GetOrAddSafe(string key, Func<Item[]> factory)
    {
        var lazy = _safeCache.GetOrAdd(key,
            k => new Lazy<Item[]>(factory, LazyThreadSafetyMode.ExecutionAndPublication));
        try
        {
            var items = lazy.Value; // Factory called exactly once (per key)
            return (Item[])items.Clone(); // Defensive copy of array shell
        }
        catch
        {
            // Only remove if this exact Lazy is still present.
            _safeCache.TryGetValue(key, out var current);
            if (ReferenceEquals(current, lazy))
                _safeCache.TryRemove(key, out _);
            throw;
        }
    }
}
```

Notes:
- Lazy exception caching: if the factory throws, subsequent `Value` accesses will rethrow. Removing the entry on failure enables a clean retry.
- Shallow vs deep copy: cloning an array only protects the array shell. If `Item` is mutable, callers can still mutate elements. Prefer immutable element types or return `ImmutableArray<Item>`.
- Reentrancy caution: `ExecutionAndPublication` can deadlock if the factory re-enters `GetOrAddSafe` for the same key. Avoid recursive same-key calls. If unavoidable, consider `LazyThreadSafetyMode.PublicationOnly` (accepts multiple concurrent factory executions) with additional de-duplication.
- Eviction/TTL: `ConcurrentDictionary` does not evict. For bounded caches, prefer `MemoryCache` or `IMemoryCache` with expiration policies.

### Decision Matrices

#### Collection Type Selection
| Need | Use | Reason |
|------|-----|--------|
| Fixed size, no changes | `T[]` | Lowest memory, fastest access |
| Dynamic size | `List<T>` | Resizable, good locality |
| Unique items | `HashSet<T>` | O(1) contains |
| Key-value | `Dictionary<TKey, TValue>` | O(1) lookup |
| Thread-safe | `ImmutableArray<T>` or `Concurrent*` | Safe sharing |

#### Equality Method Selection
| Scenario | Method | Why |
|----------|--------|-----|
| Cache keys | `Ch.Equivalent()` | Better hit rate |
| User-ordered data | `SequenceEqual()` | Preserves intent |
| Filter/section lists | `Ch.Equivalent()` | Logical sets |
| Command sequences | `SequenceEqual()` | Order critical |

#### Immutable vs Defensive Copy vs IReadOnlyList
| Approach | When to Use | Thread-Safe? | Notes |
|----------|-------------|--------------|-------|
| `ImmutableArray<T>` | Shared across threads | ✅ Yes | Best for multi-threaded scenarios |
| Defensive copy (`ToArray()`, `new List()`) | Single-threaded, need snapshot | ✅ Yes (snapshot) | Good for returning current state |
| `IReadOnlyList<T>` | Single-threaded, prevent caller modifications | ❌ No | Only prevents modifications via that reference |

### Complete Example: DataLoader Key
```csharp
using Intrigma.Core.Collections;

public sealed record ShiftsByDayKey
{
    public DateOnly Date { get; }
    public Guid CustomerGuid { get; }
    public Guid[]? SectionGuids { get; }

    public ShiftsByDayKey(DateOnly date, Guid customerGuid, Guid[]? sectionGuids)
    {
        Date = date;
        CustomerGuid = customerGuid;
        // Defensive copy with clear null vs empty handling
        SectionGuids = sectionGuids switch
        {
            null => null,
            [] => [],
            _ => (Guid[])sectionGuids.Clone()
        };
    }

    public virtual bool Equals(ShiftsByDayKey? other)
    {
        if (other is null) return false;
        return Date == other.Date &&
               CustomerGuid == other.CustomerGuid &&
               Ch.Equivalent(SectionGuids, other.SectionGuids); // Order-agnostic
    }

    public override int GetHashCode()
    {
        return HashCode.Combine(
            Date,
            CustomerGuid,
            SectionGuids?.GetHashCodeEx());
    }
}
```

## Part 2: ISS Legacy Patterns to Reuse

### Available via Fenix.Legacy

#### HashHelper for Consistent Hashing
Located in `BusinessEntities.HashHelper`
```csharp
// Consistent hash combining for complex objects
public static int CombineHashCodes(params object[] objects)
{
    unchecked
    {
        int hash = 17;
        foreach (var obj in objects)
        {
            hash = hash * 31 + (obj?.GetHashCode() ?? 0);
        }
        return hash;
    }
}

// Usage in domain entities
public override int GetHashCode()
    => HashHelper.CombineHashCodes(Id, Name, Date);
```

#### Domain Validation Exception
Located in `BusinessEntities.DomainValidationException`
```csharp
// Structured validation errors with field-level details
public class DomainValidationException : Exception
{
    public IReadOnlyDictionary<string, string[]> Errors { get; }

    public DomainValidationException(string field, string message)
        : this(new Dictionary<string, string[]> { [field] = new[] { message } })
    { }

    public DomainValidationException(IDictionary<string, string[]> errors)
        : base("Validation failed")
    {
        Errors = new ReadOnlyDictionary<string, string[]>(errors);
    }
}

// Usage in validation
if (string.IsNullOrWhiteSpace(name))
    throw new DomainValidationException(nameof(name), "Name is required");

// Multiple errors
var errors = new Dictionary<string, string[]>();
if (startDate > endDate)
    errors["DateRange"] = new[] { "Start date must be before end date" };
if (hours < 0)
    errors["Hours"] = new[] { "Hours cannot be negative" };
if (errors.Any())
    throw new DomainValidationException(errors);
```

#### Crypto Utilities
Located in `BusinessEntities.Crypto`
```csharp
// Password hashing and validation
public static class Crypto
{
    public static string HashPassword(string password)
    {
        // BCrypt or similar implementation
    }

    public static bool VerifyPassword(string password, string hash)
    {
        // Secure comparison
    }

    public static string GenerateToken(int length = 32)
    {
        // Cryptographically secure random token
    }
}
```

#### System Time Zone Handling
Located in `BusinessEntities.SystemTimeZone`
```csharp
// Consistent timezone handling across the system
public static class SystemTimeZone
{
    // IANA to Windows timezone mapping
    private static readonly Dictionary<string, string> IanaToWindows = new()
    {
        ["America/New_York"] = "Eastern Standard Time",
        ["America/Chicago"] = "Central Standard Time",
        // ... more mappings
    };

    public static TimeZoneInfo GetTimeZone(string identifier)
    {
        // Handles both Windows and IANA identifiers
        if (IanaToWindows.TryGetValue(identifier, out var windowsId))
            return TimeZoneInfo.FindSystemTimeZoneById(windowsId);
        return TimeZoneInfo.FindSystemTimeZoneById(identifier);
    }
}
```

#### Key Generator for Random Strings
Located in `BusinessEntities.KeyGenerator`
```csharp
// Random string generation for tokens, passwords, etc.
public interface IKeyGenerator
{
    string Generate();
}

public class KeyGenerator : IKeyGenerator
{
    // Generates 15-character random strings
    // Excludes confusable characters (l, I, O)
    // Used for secure tokens, reset codes, API keys, etc.
    // NOT for entity IDs - those use database sequences/identity
```

### How to Use Legacy Utilities

#### Using Legacy Utilities in Fenix
```csharp
// Step 1: Reference via Fenix.Legacy
using Intrigma.Core.Collections;
using Intrigma.SchedulingStudio.BusinessEntities;

// Step 2: Use in new code
public sealed record CacheKey(Guid[] Ids)
{
    public bool Equals(CacheKey? other)
        => Ch.Equivalent(Ids, other?.Ids);

    public override int GetHashCode()
        => Ids?.GetHashCodeEx() ?? 0;
}
```

#### Using DomainValidationException with Modern Validation
```csharp
// Fenix pattern using FluentValidation with ISS exception for compatibility
public class CreateShiftValidator : AbstractValidator<CreateShiftCommand>
{
    public CreateShiftValidator()
    {
        RuleFor(x => x.StartTime)
            .LessThan(x => x.EndTime)
            .WithMessage("Start time must be before end time");
    }

    // Can still throw DomainValidationException for compatibility
    public void ValidateAndThrow(CreateShiftCommand command)
    {
        var result = Validate(command);
        if (!result.IsValid)
        {
            var errors = result.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.ErrorMessage).ToArray());
            throw new DomainValidationException(errors);
        }
    }
}
```

### When to Reuse vs Rewrite

#### Reuse When:
- Utility has no business logic (Ch.cs, HashHelper)
- Pattern is proven and stable
- Compatibility with ISS is required
- Performance is critical (optimized over years)

#### Rewrite When:
- Tightly coupled to ISS architecture
- Uses outdated patterns (non-async, etc.)
- Security concerns with old implementation
- Can significantly simplify with modern C#/.NET

## Part 3: Evolution and Migration Patterns

### Database Schema Evolution with FluentMigrator

#### Why FluentMigrator, Not EF Core Migrations
- FluentMigrator provides database-agnostic migration syntax
- Better control over migration execution and rollback
- Idempotent migrations (can run multiple times safely)
- Clear separation between schema changes and EF Core model

#### Migration Organization
All migrations live in `Source/Data/Migrations/` with this structure:
```
Y{year}/
  M{month}/
    D{day}/
      MigrationName.cs
```

#### Adding Indexes Safely
```csharp
// Use FluentMigrator, NOT EF Core migrations
[DateMigration(2025, 01, 08, 10, 00)]
public class AddEmployeeFirebaseTokenIndex : AutoReversingMigration
{
    public override void Up()
    {
        // Check if index already exists (idempotent)
        if (!Schema.Table("Employees").Index("IDX_Employees_FirebaseToken").Exists())
        {
            Create.Index("IDX_Employees_FirebaseToken")
                .OnTable("Employees")
                .OnColumn("FirebaseToken")
                .Ascending()
                .WithOptions().NonClustered();
        }
    }
}
```

#### Adding Columns with Defaults
```csharp
[DateMigration(2025, 01, 08, 11, 00)]
public class AddReceiveNotificationsColumn : AutoReversingMigration
{
    public override void Up()
    {
        // Add column with default value for existing rows
        Alter.Table("EmployeeNotificationSettings")
            .AddColumn("ReceiveRequestDeadlineNotifications")
            .AsBoolean()
            .NotNullable()
            .WithDefaultValue(true);

        // Optionally update based on existing data using FluentMigrator API
        Update.Table("EmployeeNotificationSettings")
            .Set(new { ReceiveRequestDeadlineNotifications = 0 })
            .Where(new { IsInactive = 1 });
    }
}
```

### API Contract Migration Patterns

#### Deprecating Fields
```csharp
public class Employee
{
    // Mark as obsolete in C#
    [Obsolete("Use FirstName and LastName instead")]
    [GraphQLDeprecated("Use firstName and lastName fields instead. Will be removed in v2.0")]
    public string FullName { get; set; }

    // New fields
    public string FirstName { get; set; }
    public string LastName { get; set; }
}
```

#### Adding Optional Parameters
```csharp
// Safe addition - optional parameter with default
public async Task<Day[]> GetDays(
    DateRange range,
    DayFilter? filter = null,  // New optional parameter
    CancellationToken ct = default)
{
    // Handle both old calls (filter = null) and new
}
```

### Collection Parameter Migration

#### Migrating to Defensive Copying
```csharp
// Before - Vulnerable to external mutations
public class FilterKey
{
    public Guid[] Ids { get; }

    public FilterKey(Guid[] ids)
    {
        Ids = ids;  // Dangerous!
    }
}

// After - Safe with defensive copy
public class FilterKey
{
    public Guid[] Ids { get; }

    public FilterKey(Guid[] ids)
    {
        Ids = ids switch
        {
            null => null,
            [] => [],
            _ => (Guid[])ids.Clone()  // Defensive copy
        };
    }
}
```

#### Migrating Equality Comparisons
```csharp
// Before - Order-dependent (wrong for filters)
public bool Equals(FilterKey? other)
{
    return other != null &&
           Ids.SequenceEqual(other.Ids);  // Wrong for filters!
}

// After - Order-agnostic (correct for filters)
public bool Equals(FilterKey? other)
{
    return other != null &&
           Ch.Equivalent(Ids, other.Ids);  // Order doesn't matter
}
```

### Testing During Migration

#### Parallel Testing Pattern
```csharp
[Fact]
public async Task NewImplementation_Should_Match_Legacy()
{
    // Arrange
    var testData = CreateTestScenarios();

    foreach (var scenario in testData)
    {
        // Act - Run both implementations
        var legacyResult = await RunLegacyImplementation(scenario);
        var newResult = await RunNewImplementation(scenario);

        // Assert - Results should match
        newResult.Should().BeEquivalentTo(legacyResult,
            options => options
                .WithStrictOrdering()  // If order matters
                .ComparingByMembers<ResultType>());
    }
}
```

#### Performance Comparison Pattern
```csharp
[Fact]
public async Task NewImplementation_Should_Not_Degrade_Performance()
{
    // Warmup
    await RunNewImplementation(TestData);

    // Measure
    var sw = Stopwatch.StartNew();
    for (int i = 0; i < 100; i++)
    {
        await RunNewImplementation(TestData);
    }
    sw.Stop();

    // Assert - Should not be significantly slower
    sw.ElapsedMilliseconds.Should().BeLessThan(
        BaselineMilliseconds * 1.1);  // Allow 10% variance
}
```

### Migration Safety Checklist

#### Pre-Migration
- [ ] Identify all usage points of the code to be migrated
- [ ] Create comprehensive test coverage if missing
- [ ] Benchmark current performance metrics
- [ ] Document current behavior including edge cases
- [ ] Plan rollback strategy

#### During Migration
- [ ] Make changes incrementally, test after each step
- [ ] Keep old and new implementations side-by-side temporarily
- [ ] Use feature flags for gradual rollout if high-risk
- [ ] Run both implementations in parallel to compare results
- [ ] Monitor error rates and performance metrics

#### Post-Migration
- [ ] Remove old implementation only after stability confirmed
- [ ] Update all documentation and code comments
- [ ] Clean up any temporary compatibility code
- [ ] Document lessons learned for future migrations
- [ ] Monitor for any delayed issues (memory leaks, etc.)

### Common Migration Pitfalls

**CONTEXT NOTE**: These patterns apply when backward compatibility is required (e.g., legacy ISS integrations).
**For new Fenix code**: We can freely make breaking changes since Fenix is not yet in production.

#### ❌ Big Bang Migrations
```csharp
// BAD - Changing everything at once
// Replaced entire module in one commit
```

#### ✅ Incremental Migration
```csharp
// GOOD - Step by step
// 1. Add new implementation alongside old
// 2. Migrate one usage at a time
// 3. Monitor each change
// 4. Remove old only when stable
```

#### ❌ No Backwards Compatibility (when required for legacy integrations)
```csharp
// BAD - Breaking change in legacy integration
public Task<Result> ProcessAsync(RequiredParam param)  // Was optional
```

#### ✅ Maintaining Compatibility (for legacy integrations only)
```csharp
// GOOD - Overload for compatibility with legacy code
public Task<Result> ProcessAsync() => ProcessAsync(null);
public Task<Result> ProcessAsync(OptionalParam? param)
```

#### ❌ Untested Migration
```csharp
// BAD - "It compiles, ship it!"
```

#### ✅ Thoroughly Tested
```csharp
// GOOD - Test all scenarios
[Theory]
[InlineData(null)]
[InlineData(new int[0])]
[InlineData(new[] { 1, 2, 3 })]
public async Task Migration_Handles_All_Input_Scenarios(int[]? input)
{
    // Test both old and new with same input
}
```

## Comprehensive Testing Examples

### Collection Testing
```csharp
[Fact]
public void DefensiveCopy_Should_Prevent_Mutations()
{
    var original = new[] { 1, 2, 3 };
    var container = new SafeContainer(original);

    original[0] = 999; // Modify original

    container.GetValues().Should().Equal(1, 2, 3); // Unaffected
}

[Fact]
public void CacheKey_Should_Be_OrderAgnostic()
{
    var key1 = new FilterKey(new[] { guid1, guid2 });
    var key2 = new FilterKey(new[] { guid2, guid1 });

    key1.Should().Be(key2);
    key1.GetHashCode().Should().Be(key2.GetHashCode());
}

[Fact]
public void NullVsEmpty_Should_Be_Distinguished()
{
    var nullFilter = new QueryFilter(null);
    var emptyFilter = new QueryFilter([]);

    nullFilter.SectionIds.Should().BeNull();
    emptyFilter.SectionIds.Should().BeEmpty();
    nullFilter.Should().NotBe(emptyFilter);
}
```

### Legacy Integration Testing
```csharp
[Fact]
public void LegacyPattern_ShouldWorkInFenix()
{
    // Test Ch.cs utilities
    var list1 = new[] { 1, 2, 3 };
    var list2 = new[] { 3, 2, 1 };
    Ch.Equivalent(list1, list2).Should().BeTrue();

    // Test DomainValidationException
    var ex = new DomainValidationException("Field", "Error");
    ex.Errors["Field"].Should().Contain("Error");
}
```

## Integration Checklist

### Collection Patterns
- [ ] Using Ch.Equivalent for order-agnostic comparison
- [ ] Defensive copying for stored collections
- [ ] Null vs empty semantics documented and implemented
- [ ] Pre-sizing collections when count known
- [ ] Using arrays when size is fixed
- [ ] Returning appropriate interfaces (IReadOnlyList, etc.)
- [ ] Thread safety considered for shared collections
- [ ] Memory efficiency for large/temporary collections

### Legacy Integration
- [ ] Check if utility exists in Fenix.Legacy
- [ ] Evaluate if pattern is still relevant
- [ ] Use via Fenix.Legacy reference
- [ ] Document usage in new code
- [ ] Consider future migration path
- [ ] Add tests for legacy integration

## Common Mistakes to Avoid

### Collection Mistakes
- ❌ Not using defensive copies (external mutations)
- ❌ Treating null and empty the same (loses semantics)
- ❌ Using SequenceEqual for cache keys (poor hit rate)
- ❌ Not pre-sizing collections
- ❌ Converting List to array unnecessarily
- ❌ Exposing internal collections
- ❌ Wrong equality method for scenario
- ❌ Not using Ch.cs utilities
- ❌ Assuming ConcurrentDictionary.GetOrAdd calls factory once (it doesn't!)
- ❌ Using non-thread-safe factories with GetOrAdd

### Migration Mistakes
- ❌ Big bang migrations instead of incremental
- ❌ Breaking backward compatibility in legacy integrations without notice (Fenix code can break freely)
- ❌ Not testing migrations thoroughly
- ❌ Not documenting migration decisions
- ❌ Removing old code before confirming stability

## Related References

- [GRAPHQL_GUIDELINE.MD](./GRAPHQL_GUIDELINE.MD) - DataLoader patterns and GraphQL best practices
- [PERFORMANCE_GUIDELINE.MD](./PERFORMANCE_GUIDELINE.MD) - EF Core optimization and N+1 prevention
- [SECURITY_GUIDELINES.MD](./SECURITY_GUIDELINES.MD) - Multi-tenant isolation and authorization
- [/src/CLAUDE.md](../../src/CLAUDE.md) - Backend development standards
