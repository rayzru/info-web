# Performance Development Guidelines

This comprehensive guideline consolidates essential performance patterns and best practices for Fenix development, focusing on Entity Framework Core N+1 query prevention and database optimization.

> **LLM Compliance Note**: Use this file as the definitive instruction set for performance-related work. Read it entirely before tuning code, follow each directive precisely, and apply every referenced pattern without modification.

## How to Use This Guideline
1. Read the whole document before planning optimizations or diagnostics.
2. Execute procedures in the order presented unless the text explicitly states otherwise.
3. Reference any linked recipes or tools immediately and implement the documented approach exactly.
4. Capture any deviations or blockers as risks and escalate them promptly.

**Tags:** performance, ef-core, n+1, database, optimization
**Agents:** performance-profiler, dotnet-specialist
**Risk:** High - Can cause database connection pool exhaustion
**Context:** Entity Framework Core 9.0 with SQL Server

## 🛑 CRITICAL: IReadDbContext vs IWriteDbContext AsNoTracking Rules

### Fenix-Specific Configuration

**`IReadDbContext`** is **globally configured** with `AsNoTracking()` via `UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)` in `ReadDbContext.OnConfiguring()`.

### Mandatory Rules

#### ❌ WRONG - DO NOT use `.AsNoTracking()` with `IReadDbContext`
```csharp
// ❌ REDUNDANT - readDbContext already has NoTracking globally
var employee = await readDbContext
    .Employees
    .AsNoTracking()  // ❌ REMOVE THIS - it's redundant!
    .FirstOrDefaultAsync(e => e.Id == id);
```

#### ✅ CORRECT - NO `.AsNoTracking()` with `IReadDbContext`
```csharp
// ✅ CORRECT - readDbContext already has NoTracking
var employee = await readDbContext
    .Employees
    .FirstOrDefaultAsync(e => e.Id == id);
```

#### ✅ REQUIRED - ALWAYS use `.AsNoTracking()` with `IWriteDbContext` for reads
```csharp
// ✅ REQUIRED - writeDbContext needs explicit AsNoTracking for reads
var employee = await writeDbContext
    .Employees
    .AsNoTracking()  // ✅ REQUIRED - writeDbContext tracks by default!
    .FirstOrDefaultAsync(e => e.Id == id);
```

### Quick Reference

| Context | Default Behavior | AsNoTracking Required? |
|---------|-----------------|------------------------|
| `IReadDbContext` | NoTracking (global) | ❌ NO - Already configured |
| `IWriteDbContext` | Tracking (default) | ✅ YES - For read-only queries |

**Why This Matters:**
- Adding `.AsNoTracking()` to `IReadDbContext` queries is redundant noise
- Forgetting `.AsNoTracking()` on `IWriteDbContext` read queries wastes memory
- Following this rule keeps code clean and performant

---

## Part 1: EF Core N+1 Query Prevention

**Note:** The examples below show general EF Core patterns using a generic `DbContext`. When using Fenix-specific contexts (`IReadDbContext` or `IWriteDbContext`), follow the rules above.

### Problem
N+1 queries occur when code makes 1 query for a list of entities, then N additional queries for related data of each entity.

### Solution

#### Include Pattern for Eager Loading
```csharp
// ❌ WRONG - N+1 query problem
var shifts = await db.Shifts.ToListAsync();
foreach (var shift in shifts)
{
    // This triggers a query for EACH shift!
    shift.Employee = await db.Employees.FindAsync(shift.EmployeeId);
}

// ✅ CORRECT - Single query with Include
var shifts = await db.Shifts
    .Include(s => s.Employee)
    .Include(s => s.ShiftType)
    .AsNoTracking()
    .ToListAsync(ct);
```

#### Projection for Read-Only Data
```csharp
// ✅ BEST for read-only - Project to DTO
var shiftDtos = await db.Shifts
    .Select(s => new ShiftDto
    {
        Id = s.Id,
        StartTime = s.StartTime,
        EndTime = s.EndTime,
        EmployeeName = s.Employee.Name,
        ShiftTypeName = s.ShiftType.Name
    })
    .AsNoTracking()
    .ToListAsync(ct);
```

#### Split Queries for Multiple Collections
```csharp
// ❌ WRONG - Cartesian explosion with multiple collections
var employees = await db.Employees
    .Include(e => e.Shifts)        // Many
    .Include(e => e.Certifications) // Many
    .ToListAsync(); // Results in M x N rows!

// ✅ CORRECT - Split into separate queries
var employees = await db.Employees
    .AsSplitQuery() // Splits into separate queries
    .Include(e => e.Shifts)
    .Include(e => e.Certifications)
    .AsNoTracking()
    .ToListAsync(ct);
```

#### Compiled Queries for Hot Paths
```csharp
// Define compiled query (startup cost, but faster execution)
private static readonly Func<AppDbContext, Guid, CancellationToken, Task<EmployeeDto?>>
    GetEmployeeCompiled = EF.CompileAsyncQuery(
        (AppDbContext db, Guid id, CancellationToken ct) =>
            db.Employees
                .Where(e => e.Id == id)
                .Select(e => new EmployeeDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    Department = e.Department.Name
                })
                .AsNoTracking()
                .FirstOrDefault());

// Usage
var employee = await GetEmployeeCompiled(db, employeeId, ct);
```

#### Batch Loading Pattern
```csharp
// When you need related data for multiple entities
public async Task<Dictionary<Guid, List<Shift>>> GetShiftsByEmployeeIds(
    IEnumerable<Guid> employeeIds,
    CancellationToken ct)
{
    var shifts = await db.Shifts
        .Where(s => employeeIds.Contains(s.EmployeeId))
        .AsNoTracking()
        .ToListAsync(ct);

    return shifts.GroupBy(s => s.EmployeeId)
        .ToDictionary(g => g.Key, g => g.ToList());
}
```

#### Detection with MiniProfiler
```csharp
// In Startup/Program.cs
services.AddMiniProfiler(options =>
{
    options.RouteBasePath = "/profiler";
    options.ColorScheme = ColorScheme.Dark;
})
.AddEntityFramework(); // Tracks EF queries

// In DbContext
protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
{
    if (_env.IsDevelopment())
    {
        optionsBuilder.EnableSensitiveDataLogging(); // See parameter values
        optionsBuilder.EnableDetailedErrors();
    }
}
```

### Testing for N+1
```csharp
[Fact]
public async Task GetShifts_ShouldNotCauseNPlusOne()
{
    // Arrange
    using var dbContext = CreateDbContext();
    var queryCount = 0;

    // Track queries
    dbContext.Database.Log = sql => queryCount++;

    // Seed data
    await SeedShiftsWithEmployees(count: 10);

    // Act
    var shifts = await _repository.GetShiftsWithEmployees();

    // Assert
    queryCount.Should().BeLessThanOrEqualTo(2); // 1 for shifts, 1 for employees
    shifts.Should().HaveCount(10);
    shifts.Should().OnlyContain(s => s.Employee != null);
}
```

### Monitoring Queries
```csharp
// Log EF Core queries in development
{
  "Logging": {
    "LogLevel": {
      "Microsoft.EntityFrameworkCore.Database.Command": "Information"
    }
  }
}
```

## Performance Best Practices

### Query Optimization Strategies

#### 1. Use Appropriate Loading Strategy
- **Eager Loading (Include)**: When you need related data upfront
- **Projection (Select)**: When you need specific fields only
- **Split Queries**: When loading multiple collections
- **Explicit Loading**: When conditionally loading related data

#### 2. AsNoTracking for Read Operations
```csharp
// For read-only operations, always use AsNoTracking
var data = await db.Entities
    .AsNoTracking()
    .Where(e => e.IsActive)
    .ToListAsync();
```

#### 3. Pagination for Large Data Sets
```csharp
// Always paginate large result sets
var pageSize = 50;
var pageNumber = 1;

var results = await db.Entities
    .Skip((pageNumber - 1) * pageSize)
    .Take(pageSize)
    .AsNoTracking()
    .ToListAsync();
```

#### 4. Use Indexes Appropriately
```csharp
// EF Core configuration for indexes
modelBuilder.Entity<Employee>()
    .HasIndex(e => e.Email)
    .IsUnique();

modelBuilder.Entity<Shift>()
    .HasIndex(s => new { s.Date, s.EmployeeId })
    .HasDatabaseName("IX_Shift_Date_Employee");
```

#### 5. Avoid Client-Side Evaluation
```csharp
// ❌ WRONG - Client-side evaluation
var results = await db.Entities
    .Where(e => MyCustomMethod(e.Name)) // Evaluated in memory!
    .ToListAsync();

// ✅ CORRECT - Server-side evaluation
var results = await db.Entities
    .Where(e => e.Name.StartsWith("A")) // Translated to SQL
    .ToListAsync();
```

### Connection Pool Management

#### Configure Connection Pool
```csharp
// In connection string
"Server=.;Database=MyDb;...;Max Pool Size=100;Min Pool Size=5"

// Or in DbContext configuration
optionsBuilder.UseSqlServer(connectionString, options =>
{
    options.EnableRetryOnFailure(
        maxRetryCount: 3,
        maxRetryDelay: TimeSpan.FromSeconds(5),
        errorNumbersToAdd: null);
});
```

#### Dispose DbContext Properly
```csharp
// ❌ WRONG - DbContext not disposed
public async Task<List<Entity>> GetData()
{
    var db = new AppDbContext();
    return await db.Entities.ToListAsync();
}

// ✅ CORRECT - Using statement ensures disposal
public async Task<List<Entity>> GetData()
{
    using var db = new AppDbContext();
    return await db.Entities.ToListAsync();
}

// ✅ BEST - Dependency injection handles lifecycle
public class MyService
{
    private readonly IReadDbContext _db;

    public MyService(IReadDbContext db) => _db = db;

    public async Task<List<Entity>> GetData() =>
        await _db.Entities.ToListAsync();
}
```

### Caching Strategies

#### In-Memory Caching
```csharp
public class CachedEmployeeService
{
    private readonly IMemoryCache _cache;
    private readonly IReadDbContext _db;

    public async Task<Employee?> GetEmployeeAsync(Guid id)
    {
        var cacheKey = $"employee_{id}";

        if (!_cache.TryGetValue<Employee>(cacheKey, out var employee))
        {
            employee = await _db.Employees
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id);

            if (employee != null)
            {
                _cache.Set(cacheKey, employee, TimeSpan.FromMinutes(5));
            }
        }

        return employee;
    }
}
```

#### Distributed Caching (Redis)
```csharp
public class DistributedEmployeeService
{
    private readonly IDistributedCache _cache;
    private readonly IReadDbContext _db;

    public async Task<Employee?> GetEmployeeAsync(Guid id)
    {
        var cacheKey = $"employee:{id}";
        var cachedData = await _cache.GetStringAsync(cacheKey);

        if (cachedData != null)
        {
            return JsonSerializer.Deserialize<Employee>(cachedData);
        }

        var employee = await _db.Employees
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id);

        if (employee != null)
        {
            var serialized = JsonSerializer.Serialize(employee);
            await _cache.SetStringAsync(cacheKey, serialized,
                new DistributedCacheEntryOptions
                {
                    SlidingExpiration = TimeSpan.FromMinutes(5)
                });
        }

        return employee;
    }
}
```

## Performance Checklist

### Query Optimization
- [ ] Using Include() for known relationships
- [ ] Using Projection (Select) for read-only data
- [ ] AsNoTracking() for read operations
- [ ] AsSplitQuery() for multiple collections
- [ ] Compiled queries for hot paths
- [ ] Batch loading for multiple parent entities
- [ ] MiniProfiler enabled in development
- [ ] Reviewed query count in tests

### Database Optimization
- [ ] Appropriate indexes created
- [ ] Connection pooling configured
- [ ] Query timeouts set appropriately
- [ ] Statistics updated regularly
- [ ] Execution plans reviewed
- [ ] Slow query log monitored

### Caching Strategy
- [ ] Hot data cached appropriately
- [ ] Cache invalidation strategy defined
- [ ] Cache hit/miss ratios monitored
- [ ] Memory usage monitored
- [ ] Distributed cache for multi-instance

### Monitoring & Profiling
- [ ] Application Insights configured
- [ ] Custom performance counters
- [ ] Query execution time tracked
- [ ] Memory usage monitored
- [ ] Connection pool metrics tracked

## Common Performance Mistakes

### EF Core Mistakes
- ❌ Lazy loading enabled globally (hidden N+1)
- ❌ Include() on multiple collection properties (cartesian product)
- ❌ **Using `.AsNoTracking()` with `IReadDbContext` (redundant - it's already configured globally)**
- ❌ **Forgetting `.AsNoTracking()` with `IWriteDbContext` for read-only queries**
- ❌ Using FindAsync in loops
- ❌ Not projecting to DTOs for read operations
- ❌ Over-including unnecessary relationships

### Query Mistakes
- ❌ Client-side evaluation of complex logic
- ❌ Missing indexes on frequently queried columns
- ❌ Not using pagination for large result sets
- ❌ Using Contains() with large collections
- ❌ Unnecessary ORDER BY clauses

### Connection Management Mistakes
- ❌ Not disposing DbContext properly
- ❌ Creating DbContext per query instead of per request
- ❌ Connection pool size too small
- ❌ Long-running transactions holding connections

### Caching Mistakes
- ❌ Caching mutable data without proper invalidation
- ❌ Cache keys not including tenant context
- ❌ Caching large objects unnecessarily
- ❌ Not monitoring cache effectiveness

## Performance Testing Examples

### Load Testing
```csharp
[Fact]
public async Task GetShifts_ShouldPerformUnderLoad()
{
    // Arrange
    await SeedLargeDataset(shiftCount: 10000);
    var stopwatch = new Stopwatch();

    // Act
    stopwatch.Start();
    var tasks = Enumerable.Range(1, 100)
        .Select(_ => _service.GetShiftsAsync())
        .ToArray();

    await Task.WhenAll(tasks);
    stopwatch.Stop();

    // Assert
    stopwatch.ElapsedMilliseconds.Should().BeLessThan(5000);
}
```

### Memory Usage Testing
```csharp
[Fact]
public async Task LargeQuery_ShouldNotExceedMemoryLimit()
{
    // Arrange
    var initialMemory = GC.GetTotalMemory(true);

    // Act
    var results = await _service.GetLargeDatasetAsync();
    GC.Collect();
    GC.WaitForPendingFinalizers();
    GC.Collect();
    var finalMemory = GC.GetTotalMemory(true);

    // Assert
    var memoryIncrease = finalMemory - initialMemory;
    memoryIncrease.Should().BeLessThan(100_000_000); // 100MB limit
}
```

### Query Count Testing
```csharp
[Fact]
public async Task ComplexOperation_ShouldMinimizeQueries()
{
    // Arrange
    var commandInterceptor = new QueryCountInterceptor();
    _dbContext.Database.AddInterceptor(commandInterceptor);

    // Act
    await _service.ComplexOperationAsync();

    // Assert
    commandInterceptor.QueryCount.Should().BeLessThanOrEqualTo(5);
}
```

## Performance Monitoring

### Application Insights Integration
```csharp
// Track custom metrics
public class PerformanceTracker
{
    private readonly TelemetryClient _telemetryClient;

    public async Task<T> TrackQueryPerformance<T>(
        string queryName,
        Func<Task<T>> query)
    {
        var stopwatch = Stopwatch.StartNew();

        try
        {
            var result = await query();

            _telemetryClient.TrackMetric(
                $"Query.{queryName}.Duration",
                stopwatch.ElapsedMilliseconds);

            return result;
        }
        catch (Exception ex)
        {
            _telemetryClient.TrackException(ex);
            throw;
        }
    }
}
```

### Health Checks
```csharp
// In Program.cs
services.AddHealthChecks()
    .AddDbContextCheck<AppDbContext>("database")
    .AddCheck("memory", () =>
    {
        var allocated = GC.GetTotalMemory(false);
        return allocated < 1_000_000_000 // 1GB limit
            ? HealthCheckResult.Healthy()
            : HealthCheckResult.Degraded("High memory usage");
    });
```

## Related References

- [GRAPHQL_GUIDELINE.MD](./GRAPHQL_GUIDELINE.MD) - DataLoader and GraphQL N+1 prevention
- [BACKEND_GUIDELINE.MD](./BACKEND_GUIDELINE.MD) - Collection optimization patterns
- [/src/CLAUDE.md](../../src/CLAUDE.md) - Backend performance standards
- [EF Core Performance](https://docs.microsoft.com/ef/core/performance/) - Microsoft documentation
- [SQL Server Query Store](https://docs.microsoft.com/sql/relational-databases/performance/query-store) - Query monitoring
- [Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview) - Performance monitoring

**Note**: Additional performance documentation (advanced query optimization, caching strategies) should be created in this directory as performance patterns mature.
