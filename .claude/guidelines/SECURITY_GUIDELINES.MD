# Security Development Guidelines

This comprehensive guideline consolidates essential security patterns and best practices for Fenix development, combining authorization, secrets management, and multi-tenant data isolation patterns.

> **LLM Compliance Note**: Security work must follow this document verbatim. Read everything first, execute steps exactly as written, and escalate any uncertainty instead of improvising.

## How to Use This Guideline
1. Review the entire guideline before making security-related changes.
2. Treat every checklist and warning as mandatory—do not skip items without explicit approval.
3. Consult referenced recipes, policies, or agents immediately when mentioned.
4. Document any constraint that prevents compliance and raise it for human review.

**Tags:** security, authorization, authentication, policies, secrets, configuration, credentials, multi-tenancy, tenant-isolation, graphql
**Agents:** security-expert, dotnet-specialist, graphql-architect
**Risk:** CRITICAL - Unauthorized access, exposed credentials, and data leakage across tenants are all critical security risks
**Context:** .NET authorization with JWT tokens, Azure Key Vault, Healthcare scheduling with HIPAA requirements in Fenix API

## Part 1: Authorization Patterns

### Problem
Missing or incorrect authorization allows unauthorized access to protected resources.

### Solution

#### Basic Authorization
```csharp
// ❌ WRONG - Missing [Authorize]
public async Task<Employee> GetEmployee(int id) =>
    await _db.Employees.FindAsync(id);

// ✅ CORRECT - Require authentication
[Authorize]
public async Task<Employee> GetEmployee(int id, CancellationToken ct) =>
    await _db.Employees
        .FirstAsync(e => e.Id == id, ct);
```

#### Policy-Based Authorization
```csharp
// ✅ BEST - Require specific policy
[Authorize(Policy = "RequireManager")]
public async Task<Employee> GetEmployee(int id, CancellationToken ct) =>
    await _db.Employees
        .FirstAsync(e => e.Id == id, ct);
```

#### Policy Configuration
```csharp
// Program.cs
services.AddAuthorization(options =>
{
    options.AddPolicy("RequireManager", policy =>
        policy.RequireClaim("Role", "Manager", "Admin"));

    options.AddPolicy("RequireTenant", policy =>
        policy.RequireClaim("TenantId")
              .RequireAuthenticatedUser());

    options.AddPolicy("RequireEmployee", policy =>
        policy.RequireClaim("EmployeeId")
              .RequireAuthenticatedUser());
});
```

#### GraphQL Field Authorization
```csharp
[ExtendObjectType<Employee>]
public static class EmployeeExtensions
{
    [Authorize(Policy = "RequireManager")]
    public static decimal GetSalary([Parent] Employee employee) =>
        employee.Salary;

    [Authorize(Policy = "RequireHR")]
    public static string GetSsn([Parent] Employee employee) =>
        employee.Ssn;
}
```

### Authorization Testing
```csharp
[Fact]
public async Task GetEmployee_RequiresAuthorization()
{
    // Arrange
    var client = CreateClient(authenticated: false);

    // Act
    var response = await client.GetAsync("/api/employees/123");

    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
}
```

## Part 2: Secrets Management Patterns

### Problem
Hardcoded secrets in code or config files expose sensitive credentials.

### Solution

#### Configuration Provider Pattern
```csharp
// ❌ WRONG - Hardcoded connection string
var conn = "Server=.;Database=db;User Id=sa;Password=P@ssw0rd;";

// ✅ CORRECT - Use configuration provider
var conn = _config.GetConnectionString("AppDb");
```

#### Structured Configuration
```csharp
// appsettings.json (NO SECRETS HERE)
{
  "ConnectionStrings": {
    "AppDb": "Loaded from environment"
  }
}

// appsettings.Development.json (NEVER COMMIT)
{
  "ConnectionStrings": {
    "AppDb": "Server=localhost;Database=Dev;Integrated Security=true"
  }
}
```

#### Environment Variables
```bash
# Production - Set via environment
export ConnectionStrings__AppDb="Server=prod;Database=Prod;User Id=app;Password=${DB_PASSWORD}"
```

#### User Secrets (Development)
```bash
# Initialize user secrets
dotnet user-secrets init

# Set secret
dotnet user-secrets set "ConnectionStrings:AppDb" "Server=.;Database=Dev;..."

# List secrets
dotnet user-secrets list
```

#### Azure Key Vault (Production)
```csharp
// Program.cs
var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsProduction())
{
    builder.Configuration.AddAzureKeyVault(
        new Uri($"https://{keyVaultName}.vault.azure.net/"),
        new DefaultAzureCredential());
}
```

### Configuration Priority
```
1. Command-line arguments
2. Environment variables
3. User secrets (Development)
4. appsettings.{Environment}.json
5. appsettings.json
6. Key Vault (Production)
```

### Secrets Testing
```csharp
[Fact]
public void Configuration_DoesNotContainHardcodedSecrets()
{
    // Arrange
    var config = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json")
        .Build();

    // Assert
    config.GetConnectionString("AppDb")
        .Should().NotContain("Password=")
        .And.NotContain("pwd=");
}
```

## Part 3: Multi-Tenant Data Isolation Patterns

### ✅ IMPLEMENTED: Automatic Tenant Filtering

**STATUS**: Tenant isolation is now fully implemented using EF Core Global Query Filters.

**What This Means for Developers**:
- ✅ **Automatic tenant filtering** - All queries are automatically filtered by tenant at the database level
- ✅ **No manual filtering needed** - You DO NOT need to add `.Where(e => e.CustomerId == ...)` to queries
- ✅ **Security by default** - Impossible to accidentally query cross-tenant data
- ✅ **Performance optimized** - Context-aware filtering minimizes joins
- ⚠️ **Exceptions: Person and MailLog** - These entities do NOT have automatic filtering (see below)

**Implementation Details**:
- `TenantAwareDbContext` base class applies global filters to all entities (except Person and MailLog)
- `ITenantContext` interface (Fenix.App/ITenantContext.cs) uses `int?` properties
- `HttpSessionTenantContext` implementation validates non-null values on construction
- Both `ReadDbContext` and `WriteDbContext` inherit tenant filtering
- See `/specs/tenant-filtering_spec.md` and `/specs/tenant-filtering_implementation.md` for complete architecture

**What You Still Need To Do**:
- ✅ Use `ISessionResolver` in GraphQL resolvers to get tenant context (for authorization)
- ✅ Follow security best practices (authorization, input validation, etc.)
- ❌ **DO NOT** add manual tenant filters to automatically filtered entities - they're redundant and may cause bugs
- ✅ **DO** add manual filters for `Person` and `MailLog` if accessing them in tenant context

### Problem
Multi-tenant applications must ensure complete data isolation between tenants (customers) to prevent data leakage and maintain compliance.

### Solution (Implemented Automatically)

#### Entity-Level Tenant Scoping (AUTOMATIC)
```csharp
// ✅ CURRENT (2025+) - Automatic tenant filtering via Global Query Filters
// No manual filtering needed - TenantAwareDbContext handles this automatically
public async Task<ShiftType?> GetShiftType(int id, CancellationToken ct)
{
    // Tenant filter is applied automatically by ReadDbContext/WriteDbContext
    return await _db.ShiftTypes.FirstOrDefaultAsync(s => s.Id == id, ct);
}

// ❌ LEGACY PATTERN (Pre-2025) - Manual filtering (NO LONGER NEEDED)
// This was required before Global Query Filters were implemented
public async Task<ShiftType?> GetShiftType_Legacy(int id, int tenantId, CancellationToken ct)
{
    // Manual tenant check - NOW REDUNDANT, do not use
    return await _db.ShiftTypes.FirstOrDefaultAsync(s => s.Id == id && s.Customer == tenantId, ct);
}
```

#### Global Query Filters (EF Core) - ✅ IMPLEMENTED
```csharp
// ✅ IMPLEMENTED in ReadDbContext (src/Fenix.Infra/Persistance/ReadDbContext.cs) & WriteDbContext (src/Fenix.Infra/Persistance/WriteDbContext.cs)
// This code is already in place - showing for reference only
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    // Direct Customer Entities - automatic filtering
    modelBuilder.Entity<Employee>()
        .HasQueryFilter(e => e.CustomerId == CustomerId);

    modelBuilder.Entity<Section>()
        .HasQueryFilter(s => s.CustomerId == CustomerId);

    // Schedule-Based Entities - automatic filtering
    modelBuilder.Entity<SchedulingPeriod>()
        .HasQueryFilter(sp => sp.ScheduleId == ScheduleId);

    modelBuilder.Entity<Shift>()
        .HasQueryFilter(s => s.ScheduleId == ScheduleId);

    // Complex Relationship Entities - automatic filtering via navigation
    modelBuilder.Entity<SectionPeriod>()
        .HasQueryFilter(sp => sp.SchedulingPeriod.ScheduleId == ScheduleId);

    // See tenant-filtering_spec.md for complete list of filtered entities
}
```

#### ⚠️ Entities Without Global Filters

**IMPORTANT**: The following entities do NOT have automatic tenant filtering and require manual handling:

1. **`Person`** - Shared across tenants (user accounts, not tenant-specific)
   - Manual filtering required if accessing person data in tenant context
   - Typically accessed through authentication, not direct queries

2. **`MailLog`** - System-level logging entity
   - Contains system-wide email logs
   - Manual tenant filtering required if exposing in tenant-specific queries

**Developer Action Required**:
- If you need to query `Person` or `MailLog` in a tenant-specific context, **you MUST add manual filtering**
- Example: `.Where(p => p.RelatedTenantId == customerId)` (if such relationship exists)
- These entities are intentionally excluded from automatic filtering due to their system-wide nature

#### Tenant Context Provider - ✅ IMPLEMENTED
```csharp
// ✅ IMPLEMENTED in Fenix.App/ITenantContext.cs and Fenix.Api/Tenant/HttpSessionTenantContext.cs

// Interface (Fenix.App/ITenantContext.cs)
public interface ITenantContext
{
    int? CustomerId { get; }
    int? ScheduleId { get; }
}
```

#### GraphQL DataLoader with Tenant Isolation - ⚠️ SIMPLIFIED
```csharp
// ✅ CURRENT (2025+) - Automatic tenant filtering
// Global Query Filters handle tenant isolation automatically
[DataLoader]
public static async ValueTask<IReadOnlyDictionary<Guid, EmployeeGroup>> GetEmployeeGroupByGuid(
    IReadOnlyList<Guid> employeeGroupGuids,
    IReadDbContext dbContext,  // ReadDbContext already has tenant filtering
    CancellationToken token)
{
    // Tenant filter applied automatically by ReadDbContext
    // No manual filtering needed!
    var groups = await dbContext
        .EmployeeGroups
        .Where(eg => employeeGroupGuids.Contains(eg.Guid))
        .ToListAsync(token);

    return groups.ToDictionary(x => x.Guid, x => x);
}

// ❌ LEGACY PATTERN (Pre-2025) - Manual tenant filtering (NO LONGER NEEDED)
[DataLoader]
public static async ValueTask<IReadOnlyDictionary<Guid, EmployeeGroup>> GetEmployeeGroupByGuid_Legacy(
    IReadOnlyList<Guid> employeeGroupGuids,
    ISessionResolver sessionResolver,  // No longer needed for filtering
    IReadDbContext dbContext,
    CancellationToken token)
{
    var session = sessionResolver.GetRequiredSession();

    // Manual tenant check - NOW REDUNDANT
    var groups = await dbContext
        .EmployeeGroups
        .Where(eg => employeeGroupGuids.Contains(eg.Guid))
        .Where(eg => eg.Customer.Guid == session.CustomerGuid)  // Automatic now
        .ToListAsync(token);

    return groups.ToDictionary(x => x.Guid, x => x);
}
```

#### GraphQL Query with Tenant Scoping - ⚠️ SIMPLIFIED
```csharp
// ✅ CURRENT (2025+) - Automatic tenant filtering
[ExtendObjectType(OperationTypeNames.Query)]
public class TenantScopedQueries
{
    [Authorize(Policy = "RequireTenant")]
    public IQueryable<Employee> GetEmployees(IReadDbContext db)
    {
        // Tenant filter applied automatically by ReadDbContext
        // No manual filtering needed!
        return db.Employees;
    }
}

// ❌ LEGACY PATTERN (Pre-2025) - Manual filtering (NO LONGER NEEDED)
[ExtendObjectType(OperationTypeNames.Query)]
public class TenantScopedQueries_Legacy
{
    [Authorize(Policy = "RequireTenant")]
    public async Task<IQueryable<Employee>> GetEmployees(
        IReadDbContext db,
        ISessionResolver sessionResolver)
    {
        var session = sessionResolver.GetRequiredSession();

        // Manual tenant check - NOW REDUNDANT
        return db.Employees
            .Where(e => e.Customer.Guid == session.CustomerGuid);
    }
}
```

#### Authorization Policy
```csharp
// In Program.cs
services.AddAuthorization(options =>
{
    options.AddPolicy("RequireTenant", policy =>
        policy.RequireClaim("TenantId")
              .RequireAuthenticatedUser());
});
```

#### Command/Query Handler Pattern
```csharp
public class GetShiftQueryHandler : IRequestHandler<GetShiftQuery, Shift?>
{
    private readonly IReadDbContext _db;
    private readonly ITenantContext _tenantContext;

    public GetShiftQueryHandler(IReadDbContext db, ITenantContext tenantContext)
    {
        _db = db;
        _tenantContext = tenantContext;
    }

    public async Task<Shift?> Handle(GetShiftQuery request, CancellationToken ct)
    {
        // Always include tenant check
        return await _db.Shifts
            .FirstOrDefaultAsync(s =>
                s.Id == request.Id &&
                s.TenantId == _tenantContext.CurrentTenantId, ct);
    }
}
```

### Testing Tenant Isolation
```csharp
[Fact]
public async Task GetShift_WithDifferentTenant_ReturnsNull()
{
    // Arrange
    var tenant1Id = Guid.NewGuid();
    var tenant2Id = Guid.NewGuid();
    var shift = CreateShift(tenantId: tenant1Id);

    // Act - Try to access as tenant2
    var result = await _handler.Handle(
        new GetShiftQuery(shift.Id),
        CreateTenantContext(tenant2Id));

    // Assert - Should not access other tenant's data
    result.Should().BeNull();
}

[Fact]
public async Task QueryFilter_PreventsCrossTenantAccess()
{
    // Arrange
    await SeedMultipleTenants();

    // Act
    var tenant1Data = await GetDataForTenant(tenant1Id);
    var tenant2Data = await GetDataForTenant(tenant2Id);

    // Assert
    tenant1Data.Should().NotIntersectWith(tenant2Data);
}
```

## Comprehensive Security Checklist

### Authorization Checklist
- [ ] All endpoints have [Authorize] attribute
- [ ] Sensitive operations use specific policies
- [ ] Policies defined in Program.cs
- [ ] GraphQL fields authorized where needed
- [ ] No authorization bypass paths
- [ ] Token validation configured
- [ ] Claims properly validated

### Secrets Management Checklist
- [ ] No secrets in source code
- [ ] No secrets in appsettings.json
- [ ] User secrets for local development
- [ ] Environment variables for containers
- [ ] Key Vault for production
- [ ] Connection strings use Integrated Security where possible
- [ ] Secrets rotated regularly
- [ ] .gitignore includes appsettings.*.json

### Tenant Isolation Checklist
- [ ] Authorization policies require tenant claim - Apply `[Authorize]` attributes
- [ ] No cross-tenant object references - Verify domain logic doesn't create cross-tenant links
- [ ] Audit logs include tenant context - Add tenant info to application logs
- [ ] Integration tests verify isolation - Test cross-tenant data access is blocked
- [ ] DO NOT add manual tenant filters - They're redundant for filtered entities (may cause bugs)
- [ ] Exception: Person and MailLog require manual filtering - These entities are NOT automatically filtered

#### ✅ Implemented Automatically (2025+)
- [x] **Global query filters configured** - TenantAwareDbContext applies filters to all entities (except Person and MailLog)
- [x] **All queries include tenant filter** - Automatic at database level via Global Query Filters
- [x] **DataLoaders apply tenant filtering** - Automatic via ReadDbContext/WriteDbContext
- [x] **Tenant context validated on every request** - HttpSessionTenantContext validates on construction
- [x] **Using ITenantContext for current tenant** - Injected into DbContext constructors (interface uses int? but implementation validates non-null)

## Common Security Mistakes

### Authorization Mistakes
- ❌ Forgetting [Authorize] on new endpoints
- ❌ Using role names directly instead of policies
- ❌ Not checking tenant context
- ❌ Exposing sensitive fields without authorization
- ❌ Trusting client-provided IDs without validation

### Secrets Management Mistakes
- ❌ Committing appsettings.Development.json
- ❌ Logging connection strings
- ❌ Hardcoding API keys in code
- ❌ Using production secrets in development
- ❌ Not rotating secrets
- ❌ Storing secrets in plain text files

### Tenant Isolation Mistakes
- ❌ Using `.IgnoreQueryFilters()` - Bypasses tenant isolation (should be rare/audited)
- ❌ Forgetting tenant check in raw SQL or stored procedures - Global filters don't apply to raw SQL
- ❌ Adding manual tenant filters to automatically filtered entities - Redundant and may conflict with automatic filters
- ❌ Forgetting manual filters for Person and MailLog - These entities do NOT have automatic filtering
- ❌ Not validating tenant ownership before updates - Check relationships before creating cross-tenant links
- ❌ Exposing sequential IDs that allow enumeration - Use GUIDs for public IDs
- ❌ Missing tenant context in background jobs - Ensure background jobs have valid tenant context
- ❌ Caching data without tenant key - Include CustomerId/ScheduleId in cache keys

#### ✅ No Longer Applicable (Automatic in 2025+)
- ~~❌ Forgetting tenant filter in DataLoaders~~ - **AUTOMATIC** via ReadDbContext
- ~~❌ Forgetting tenant check in queries~~ - **AUTOMATIC** via Global Query Filters

## Security Best Practices Summary

### Defense in Depth
1. **Authentication**: Verify identity with JWT tokens
2. **Authorization**: Enforce access with policies
3. **Tenant Isolation**: Filter data at query level
4. **Secrets Management**: Never hardcode credentials
5. **Audit Logging**: Track all access attempts
6. **Input Validation**: Sanitize all user input
7. **Output Encoding**: Prevent XSS attacks
8. **HTTPS Only**: Encrypt data in transit
9. **Regular Updates**: Keep dependencies patched
10. **Security Testing**: Regular penetration testing

### OWASP Top 10 Considerations
- **Broken Access Control**: Use authorization policies
- **Cryptographic Failures**: Use Key Vault, never hardcode
- **Injection**: Use parameterized queries, validate input
- **Insecure Design**: Follow security patterns from start
- **Security Misconfiguration**: Regular security audits
- **Vulnerable Components**: Keep dependencies updated
- **Identification Failures**: Strong authentication required
- **Software/Data Integrity**: Sign packages, validate sources
- **Logging Failures**: Comprehensive audit logging
- **Server-Side Request Forgery**: Validate all URLs

### HIPAA Compliance (Healthcare)
- **Access Control**: Role-based access to PHI
- **Audit Controls**: Log all PHI access
- **Integrity**: Ensure PHI not improperly altered
- **Transmission Security**: Encrypt PHI in transit
- **Encryption**: Encrypt PHI at rest

## Testing Security

### Integration Test Example
```csharp
[Fact]
public async Task FullSecurityStack_PreventsCrossTenantAccess()
{
    // Arrange
    var tenant1 = CreateTenant("Hospital A");
    var tenant2 = CreateTenant("Hospital B");
    var sensitiveData = CreateSensitiveData(tenant1);

    // Act - Attempt access as tenant2
    var client = CreateAuthenticatedClient(tenant2);
    var response = await client.GetAsync($"/api/data/{sensitiveData.Id}");

    // Assert - Should be blocked
    response.StatusCode.Should().Be(HttpStatusCode.NotFound); // Not even revealing existence
}

[Fact]
public async Task Authorization_RequiresValidToken()
{
    // Arrange
    var client = CreateClient();
    client.DefaultRequestHeaders.Authorization =
        new AuthenticationHeaderValue("Bearer", "invalid-token");

    // Act
    var response = await client.GetAsync("/api/protected");

    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
}

[Fact]
public async Task Secrets_NotExposedInErrors()
{
    // Arrange
    SimulateDatabaseError();

    // Act
    var response = await client.GetAsync("/api/data");
    var content = await response.Content.ReadAsStringAsync();

    // Assert
    content.Should().NotContain("Password")
           .And.NotContain("ConnectionString")
           .And.NotContain("Server=");
}
```

## Security Incident Response

### If Security Issue Discovered
1. **Immediately**: Disable affected functionality
2. **Assess**: Determine scope of exposure
3. **Patch**: Fix vulnerability
4. **Audit**: Check logs for exploitation
5. **Notify**: Inform security team and affected users
6. **Review**: Post-mortem to prevent recurrence

### Security Review Checklist
- [ ] Code reviewed by security expert
- [ ] Penetration testing completed
- [ ] OWASP Top 10 addressed
- [ ] Compliance requirements met (HIPAA, etc.)
- [ ] Security scanning tools run
- [ ] Dependencies checked for vulnerabilities
- [ ] Secrets rotation plan in place
- [ ] Incident response plan documented

## Related References

- [BACKEND_GUIDELINE.MD](./BACKEND_GUIDELINE.MD) - Backend security patterns
- [GRAPHQL_GUIDELINE.MD](./GRAPHQL_GUIDELINE.MD) - GraphQL authorization patterns
- [/src/CLAUDE.md](../../src/CLAUDE.md) - Backend security requirements
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Security vulnerabilities
- [HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/) - Healthcare compliance

**Note**: Additional security documentation (JWT implementation, Key Vault integration, PHI handling, audit logging) should be created in this directory as the security architecture matures.
