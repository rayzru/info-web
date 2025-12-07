# GraphQL Input Type Attribute Usage Guideline

This guideline documents the mandatory attribute patterns for GraphQL input types in the Fenix API, based on comprehensive analysis of all 32 *Input.cs files in the codebase.

> **LLM Compliance Note**: This guideline is BINDING. Follow every pattern exactly. Do NOT deviate without explicit approval.

**Tags:** graphql, input-types, attributes, hotchocolate, relay, validation, sorting, mutations, queries
**Agents:** graphql-architect, code-reviewer, dotnet-specialist
**Risk:** High - Incorrect attributes break GraphQL schema generation, client API contracts, and type safety
**Context:** Fenix GraphQL API, HotChocolate 15.1.3+, Relay-style conventions

---

## Table of Contents
- [Overview](#overview)
- [Universal Attributes](#universal-attributes)
- [Entity Identification Attributes](#entity-identification-attributes)
- [Validation Attributes](#validation-attributes)
- [Sort Input Attributes](#sort-input-attributes)
- [Update-Specific Patterns](#update-specific-patterns)
- [Attribute Combinations by Scenario](#attribute-combinations-by-scenario)
- [Naming Conventions](#naming-conventions)
- [Anti-Patterns](#anti-patterns)
- [Checklists](#checklists)

---

## Overview

### Purpose
GraphQL input types require specific attributes to:
1. Generate correct GraphQL schema with Relay-compatible IDs
2. Apply validation rules consistently
3. Map C# types to GraphQL types correctly
4. Provide clear API documentation
5. Enable query cost analysis
6. Support partial update semantics

### Scope
- **Applies to**: All `*Input.cs` classes in `Fenix.Api/GraphQL/Objects/*/`
- **Framework**: HotChocolate 15.1.3+ with Relay conventions
- **Analysis basis**: 32 production input files across 7 categories

### Input Type Categories
1. **Create Inputs** - Creating new entities
2. **Update Inputs** - Modifying existing entities (partial or full replacement)
3. **Delete Inputs** - Removing entities
4. **Action Inputs** - Operations like assign, remove, set status
5. **Query/Filter Inputs** - Data retrieval parameters
6. **Sort Inputs** - Ordering specifications
7. **Nested/Complex Inputs** - Composite or union types

---

## Universal Attributes

### `[PublicAPI]` - Class Level (MANDATORY)

**Usage**: 100% of input types (32/32 files)

```csharp
using JetBrains.Annotations;

[PublicAPI]
public sealed record UpdateSectionInput
{
    // ...
}
```

**Rules**:
- ✅ MUST be present on ALL input types
- ✅ MUST be imported from `JetBrains.Annotations`
- ✅ MUST be at class level

---

## Entity Identification Attributes

### Critical Naming Convention (MANDATORY)

**All entity ID properties follow this pattern:**

- **C# Property Name**: `{Entity}Guid` (e.g., `SectionGuid`, `EmployeeGuid`)
- **GraphQL Field Name**: `{entity}Id` (e.g., `sectionId`, `employeeId`)
- **Mapping**: `[GraphQLName(Entity.IdFullName)]` where `IdFullName` is a constant in the entity class

**Example**:
```csharp
// In UpdateSectionInput.cs
[ID<Section>]
[GraphQLName(Section.IdFullName)]
public required Guid SectionGuid { get; init; }  // C#: SectionGuid → GraphQL: sectionId

// In Section.cs entity
public const string IdFullName = "sectionId";  // Used for GraphQL mapping
```

**Benefits**:
- ✅ Consistent naming across all inputs
- ✅ Type-safe refactoring (compile-time errors if constant changes)
- ✅ Clear C# naming (descriptive with `Guid` suffix)
- ✅ Clean GraphQL API (concise `Id` suffix)

---

### `[ID<TEntity>]` - Entity References (MANDATORY)

**Purpose**: Marks a Guid property as a Relay-compatible global ID reference to a specific entity type.

**Usage**: 24/32 files (75% of input types)

**Pattern**:
```csharp
using HotChocolate.Types.Relay;

// Own entity ID
[ID<Section>]
[GraphQLName(Section.IdFullName)]
public required Guid SectionGuid { get; init; }

// Cross-entity reference
[ID<Employees.Employee>]
[GraphQLName(Employees.Employee.IdFullName)]
public required Guid EmployeeGuid { get; set; }

// Entity collection
[ID<Section>]
[GraphQLName("sectionIds")]
public Guid[] SectionGuids { get; init; }

// Optional entity reference
[ID<Employee>]
[GraphQLName(Employee.IdFullName)]
public Guid? EmployeeGuid { get; init; }
```

**Rules**:
- ✅ MUST be present on ALL Guid properties that reference entities
- ✅ MUST specify the exact entity type: `[ID<EntityType>]`
- ✅ MUST use fully qualified namespace if entity is in different namespace
- ✅ APPLIES to collections: `Guid[]`, `IReadOnlyList<Guid>`, etc.
- ✅ APPLIES to nullable references: `Guid?`

**GraphQL Schema Effect**:
```graphql
# Without [ID<Section>]
input UpdateSectionInput {
  sectionGuid: UUID!  # ❌ Wrong - just a UUID scalar
}

# With [ID<Section>]
input UpdateSectionInput {
  sectionId: ID!  # ✅ Correct - Relay global ID
}
```

---

### `[GraphQLName(...)]` - Field Naming (CONDITIONAL)

**Purpose**: Renames the GraphQL field to match API conventions (camelCase, descriptive names, entity ID patterns).

**Usage**: 22/32 files (69% of input types)

**Three Usage Patterns**:

#### Pattern A: Entity ID References (Most Common)
```csharp
using HotChocolate;

// ALL entity IDs must use this pattern
[ID<Employee>]
[GraphQLName(Employee.IdFullName)]
public Guid EmployeeGuid { get; set; }  // C#: EmployeeGuid → GraphQL: employeeId

[ID<Section>]
[GraphQLName(Section.IdFullName)]
public Guid SectionGuid { get; init; }  // C#: SectionGuid → GraphQL: sectionId
```

**When to Use**:
- ✅ USE for ALL entity ID references to ensure consistent GraphQL naming
- ✅ ALWAYS use entity's `IdFullName` constant for type safety

#### Pattern B: Schema Name Override (Collections, Conventions)
```csharp
// Pluralize collection names (literal strings acceptable for plurals)
[ID<Section>]
[GraphQLName("sectionIds")]  // ✅ Acceptable: plural form
public Guid[]? SectionGuids { get; init; }

// Enforce camelCase
[GraphQLName("notes")]
public string? Notes { get; init; }
```

**When to Use**:
- ✅ USE for collections that need plural names (`sectionIds`, `shiftTypeIds`)
- ✅ USE to enforce camelCase when C# property is PascalCase
- ✅ MAY use literal strings for plural/collection names

#### Pattern C: OneOf Union Fields (Rare)
```csharp
[OneOf]
public sealed record RequestDetailsInput
{
    [GraphQLName("dayOff")]
    public DayOffRequestInput? DayOff { get; init; }

    [GraphQLName("workShift")]
    public WorkShiftRequestInput? WorkShift { get; init; }
}
```

**Rules**:
- ✅ MUST use entity's `IdFullName` constant for singular entity IDs: `[GraphQLName(Entity.IdFullName)]`
- ✅ MUST be paired with `[ID<Entity>]` for ID fields
- ✅ ALWAYS use for entity ID properties to ensure C# `{Entity}Guid` maps to GraphQL `{entity}Id`
- ✅ MAY use literal strings for plural/collection names (e.g., `"sectionIds"`)
- ❌ DO NOT use literal strings for singular entity IDs: `[GraphQLName("employeeId")]` is WRONG

---

### `[GraphQLDescription(...)]` - Field Documentation (RECOMMENDED)

**Purpose**: Provides human-readable field descriptions in GraphQL schema introspection.

**Usage**: 21/32 files (66% of input types)

**Pattern**:
```csharp
using HotChocolate;

// PREFERRED: Reference entity description constants
[GraphQLDescription(Section.NameDescription)]
public Optional<string?> Name { get; init; }

// FALLBACK: Inline strings when no entity constant exists
[GraphQLDescription("Date of Time.Start")]
public DateOnly Date { get; set; }

// Sort inputs ONLY: Class-level description
[PublicAPI]
[GraphQLDescription(Employee.Description)]
public sealed record EmployeeSortInput { /* ... */ }
```

**Rules**:
- ✅ PREFER referencing entity description constants (single source of truth)
- ✅ USE inline strings when no entity constant exists
- ✅ ADD class-level descriptions ONLY for sort inputs

---

## Validation Attributes

### `[MaxLength(n)]` - String/Collection Length Validation

**Purpose**: Enforces maximum string length or collection size at schema and runtime validation.

**Usage**: 5/32 files (constraint-heavy inputs)

**Pattern**:
```csharp
using System.ComponentModel.DataAnnotations;

// String with domain constant (PREFERRED)
[MaxLength(Domain.Entities.Section.CharactersLimit,
    ErrorMessage = "Section name cannot exceed {1} characters")]
public Optional<string?> Name { get; init; }

// Collection size limit
[ID<Employees.Employee>]
[GraphQLName(Employees.Employee.IdFullName)]
[MaxLength(500, ErrorMessage = "Maximum 500 employees per section")]
public Optional<IReadOnlyList<Guid>?> AvailableEmployeeGuids { get; init; }
```

**Rules**:
- ✅ MUST reference domain constants (e.g., `Domain.Entities.Section.CharactersLimit`)
- ✅ SHOULD include descriptive `ErrorMessage` with `{1}` placeholder for limit
- ❌ DO NOT hardcode magic numbers - use domain constants or class constants

---

### `[MinLength(n)]` - Minimum Length Validation

**Purpose**: Enforces minimum collection size (typically "at least one item required").

**Usage**: 2/32 files (collection inputs with minimum requirements)

**Pattern**:
```csharp
[ID<ShiftType>]
[GraphQLName("shiftTypeIds")]
[MinLength(1, ErrorMessage = "At least one shift type must be specified")]
[MaxLength(10, ErrorMessage = "Maximum 10 shift types allowed per request")]
public required IReadOnlyList<Guid> ShiftTypeIds { get; init; }
```

**Rules**:
- ✅ USE for collections that require at least one item
- ✅ COMMONLY paired with `[MaxLength]` for range validation

---

### `[RegularExpression]` - Pattern Validation

**Purpose**: Enforces string format constraints (ASCII-only, email, phone, etc.).

**Usage**: 1/32 files (format-sensitive fields)

**Common Patterns**:
```csharp
// Printable ASCII only
[RegularExpression(@"^[\x20-\x7E]*$",
    ErrorMessage = "Must contain only printable ASCII characters")]

// Email (basic)
[RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$",
    ErrorMessage = "Must be a valid email address")]
```

**Rules**:
- ✅ USE for format validation (ASCII, email, phone, alphanumeric, etc.)
- ✅ MUST include descriptive `ErrorMessage`
- ✅ SHOULD use raw strings (@"...") for regex patterns

---

## Sort Input Attributes

Sort inputs require **TWO MANDATORY** attributes on every `SortDirection?` property.

### Required Attributes for Sort Inputs

```csharp
using HotChocolate;
using Intrigma.Fenix.Api.GraphQL.Common;
using JetBrains.Annotations;

[PublicAPI]
[GraphQLDescription(Employee.Description)]  // Class-level
public sealed record EmployeeSortInput
{
    [Cost(5)]  // 1. Cost attribution (MANDATORY)
    [GraphQLDescription(Employee.DisplayNameDescription)]  // 2. Field description (RECOMMENDED)
    [GraphQLType(typeof(HotChocolate.Data.Sorting.DefaultSortEnumType))]  // 3. Type mapping (MANDATORY)
    public SortDirection? DisplayName { get; init; }
}
```

**Rules**:
- ✅ MUST have `[GraphQLType(typeof(HotChocolate.Data.Sorting.DefaultSortEnumType))]` on EVERY `SortDirection?` property
- ✅ MUST have `[Cost(n)]` on SortDirection fields and nested sort input properties
- ✅ SHOULD have `[GraphQLDescription]` on each field for documentation
- ✅ SHOULD have class-level `[GraphQLDescription(Entity.Description)]`
- ❌ NEVER use `[GraphQLType]` on nested composite sort input properties (only on `SortDirection?` fields)

**Why This Matters**:
- Without `[GraphQLType]` on `SortDirection?` fields, HotChocolate creates *two parallel enum types* in the schema: one from sorting conventions (`SortEnumType`) and one inferred from your CLR `SortDirection` enum. This creates inconsistency across inputs.
- Nested composite types already have their GraphQL type defined by their class declaration and do NOT need `[GraphQLType]`.

**Cost Attribution**:
`[Cost]` attributes are used for query cost analysis in sort inputs. Apply them in THREE places:

1. **On SortDirection fields** (MANDATORY):
   ```csharp
   [Cost(5)]
   [GraphQLType(typeof(HotChocolate.Data.Sorting.DefaultSortEnumType))]
   public SortDirection? DisplayName { get; init; }
   ```

2. **On nested sort input properties** (MANDATORY):
   ```csharp
   [Cost(10)]
   public EmployeeNameSortInput? Employee { get; init; }

   [Cost(10)]
   public DateTimeRangeSortCustomInput? Time { get; init; }
   ```

3. **On resolver parameters** (OPTIONAL - for total cost calculation):
   ```csharp
   public static async Task<Employee[]> Employees(
       ISessionResolver sessionResolver,
       [Cost(10)] EmployeeSortInput[]? order,
       CancellationToken token)
   ```

**Cost Guidelines**:
- Use `[Cost(5)]` for simple SortDirection fields
- Use `[Cost(10)]` for nested sort input types
- Total query cost is calculated by summing all applied costs

---

## Update-Specific Patterns

### Two Types of Update Operations

1. **Partial Updates** (Rare - True Updates)
   - Uses `Optional<T>` wrapper
   - Includes `required int Version` for optimistic concurrency
   - Only updates fields that are provided
   - **Examples**: `UpdateSectionInput`, `UpdateCustomerInput`

2. **Replacement Operations** (Common - Full Replace)
   - Uses plain types (no `Optional<T>`)
   - No version field
   - Replaces entire object or specific properties
   - **Examples**: `UpdateShiftInput`, `UpdateRequestNotesInput`

---

### `Optional<T>` Wrapper - Partial Updates ONLY

**Purpose**: Distinguishes between "field not provided" (no change), "field set to null" (clear), and "field set to value" (update).

**Usage**: 2/32 files (6% - only true partial updates)

**Pattern**:
```csharp
using HotChocolate;

public sealed class UpdateSectionInput
{
    // Required fields (entity ID, version)
    [ID<Section>]
    [GraphQLName(Section.IdFullName)]
    public required Guid SectionGuid { get; init; }

    public required int Version { get; init; }

    // Optional updates - can be omitted
    public Optional<string?> Name { get; init; }
    public Optional<string?> Abbreviation { get; init; }

    [ID<Employees.Employee>]
    [GraphQLName(Employees.Employee.IdFullName)]
    [MaxLength(500)]
    public Optional<IReadOnlyList<Guid>?> AvailableEmployeeGuids { get; init; }
}
```

**Semantics**:
```csharp
// Field omitted from input
input.Name.HasValue == false  // → No change to Name

// Field explicitly set to null
input.Name.HasValue == true && input.Name.Value == null  // → Clear Name

// Field with value
input.Name.HasValue == true && input.Name.Value == "New Name"  // → Update Name
```

**Rules**:
- ✅ MUST use `Optional<T>` for ALL updatable fields in partial updates
- ✅ MUST use `Optional<T?>` if field can be cleared (set to null)
- ❌ DO NOT use `Optional<T>` for required fields (entity ID, version)
- ❌ DO NOT use in `Create*Input` classes (use plain types)

---

### Concurrency Version Field - Partial Updates ONLY

**Purpose**: Optimistic concurrency control - prevents lost updates from concurrent modifications.

**Usage**: 1/32 files (only `UpdateSectionInput`)

**Pattern**:
```csharp
/// <summary>
/// Current row version for optimistic concurrency control.
/// Must match server version or update fails with CONCURRENCY_CONFLICT.
/// </summary>
public required int Version { get; init; }
```

**Rules**:
- ✅ MUST be present in ALL partial update inputs (`Optional<T>` pattern)
- ✅ MUST be named `Version` (consistent across all inputs)
- ✅ MUST be `required int` type
- ✅ MUST include XML documentation explaining concurrency semantics

**Mutation Error Declaration**:
```csharp
[Error<DbConcurrencyError>]  // MUST declare concurrency error
public async Task<UpdateSectionPayload> UpdateSection(...)
```

---

### `required` Keyword - Entity Identity

**Purpose**: Marks fields that MUST be provided in operations (typically entity ID and version).

**Usage**: 11/32 files (operations requiring entity identification)

**Pattern**:
```csharp
// Update operation
[ID<Section>]
[GraphQLName(Section.IdFullName)]
public required Guid SectionGuid { get; init; }

public required int Version { get; init; }

// Create operation
[ID<RequestType>]
[GraphQLName(RequestType.IdFullName)]
public required Guid RequestTypeGuid { get; init; }

public required RequestDetailsInput Details { get; init; }
```

**Rules**:
- ✅ MUST use on entity identifier in update operations
- ✅ MUST use on concurrency version field
- ✅ MUST use on mandatory complex types (nested inputs)
- ✅ MUST pair with `init` accessor (immutable after construction)
- ❌ DO NOT use for simple required fields in create operations (HotChocolate validates non-nullable types)

---

## Attribute Combinations by Scenario

### Scenario 1: Update Entity ID (Own Entity)
```csharp
[ID<Section>]
[GraphQLName(Section.IdFullName)]
public required Guid SectionGuid { get; init; }
```

### Scenario 2: Cross-Entity Reference (Single)
```csharp
[ID<Employee>]
[GraphQLName(Employee.IdFullName)]
public Guid EmployeeGuid { get; set; }
```

### Scenario 3: Cross-Entity Reference (Optional)
```csharp
[ID<Employee>]
[GraphQLName(Employee.IdFullName)]
public Optional<Guid?> EmployeeGuid { get; init; }
```

### Scenario 4: Cross-Entity Collection
```csharp
[ID<Section>]
[GraphQLName("sectionIds")]
public Guid[] SectionGuids { get; init; } = null!;
```

### Scenario 5: Cross-Entity Collection (with Size Limits)
```csharp
[ID<Employees.Employee>]
[GraphQLName(Employees.Employee.IdFullName)]
[MaxLength(500, ErrorMessage = "Maximum 500 employees per section")]
public Optional<IReadOnlyList<Guid>?> AvailableEmployeeGuids { get; init; }
```

### Scenario 6: String Field with Validation (Partial Update)
```csharp
[MaxLength(Domain.Entities.Section.CharactersLimit,
    ErrorMessage = "Section name cannot exceed {1} characters")]
[GraphQLDescription(Section.NameDescription)]
public Optional<string?> Name { get; init; }
```

### Scenario 7: String Field with Format Validation
```csharp
[MaxLength(Domain.Entities.Section.CharactersLimit,
    ErrorMessage = "External ID cannot exceed {1} characters")]
[RegularExpression(@"^[\x20-\x7E]*$",
    ErrorMessage = "External ID must contain only printable ASCII characters")]
[GraphQLDescription(Section.ExternalIdDescription)]
public Optional<string?> ExternalId { get; init; }
```

### Scenario 8: Concurrency Version (Partial Update)
```csharp
/// <summary>
/// Current row version for optimistic concurrency control.
/// Must match server version or update fails with CONCURRENCY_CONFLICT.
/// </summary>
public required int Version { get; init; }
```

### Scenario 9: Sort Field (SortDirection)
```csharp
[Cost(5)]
[GraphQLDescription(Employee.DisplayNameDescription)]
[GraphQLType(typeof(HotChocolate.Data.Sorting.DefaultSortEnumType))]
public SortDirection? DisplayName { get; init; }
```

### Scenario 9b: Sort Field (Nested Type)
```csharp
[Cost(10)]
[GraphQLDescription(Request.EmployeeDescription)]
public EmployeeNameSortInput? Employee { get; init; }
```

### Scenario 10: Collection with Min/Max Length
```csharp
public const int MaxShiftTypes = 10;

[ID<ShiftType>]
[GraphQLName("shiftTypeIds")]
[MinLength(1, ErrorMessage = "At least one shift type must be specified")]
[MaxLength(MaxShiftTypes, ErrorMessage = "Maximum 10 shift types allowed per request")]
public required IReadOnlyList<Guid> ShiftTypeIds { get; init; }
```

---

## Naming Conventions

### C# Property Names

#### Entity References (Singular)
```csharp
// Pattern: {Entity}Guid in C#, {entity}Id in GraphQL

[ID<Employee>]
[GraphQLName(Employee.IdFullName)]
public Guid EmployeeGuid { get; set; }  // C#: EmployeeGuid → GraphQL: employeeId

[ID<Section>]
[GraphQLName(Section.IdFullName)]
public Guid SectionGuid { get; init; }  // C#: SectionGuid → GraphQL: sectionId

[ID<ShiftType>]
[GraphQLName(ShiftType.IdFullName)]
public Guid ShiftTypeGuid { get; set; }  // C#: ShiftTypeGuid → GraphQL: shiftTypeId
```

#### Entity Collections (Plural)
```csharp
// Pattern: {Entity}Guids in C#, {entity}Ids in GraphQL

[ID<Section>]
[GraphQLName("sectionIds")]
public Guid[] SectionGuids { get; init; }

[ID<ShiftType>]
[GraphQLName("shiftTypeIds")]
public IReadOnlyList<Guid> ShiftTypeGuids { get; init; }
```

### GraphQL Schema Names (via `[GraphQLName]`)

- **Entity IDs (Singular)**: `{entity}Id` (camelCase) - e.g., `employeeId`, `sectionId`
- **Entity ID Collections (Plural)**: `{entity}Ids` (camelCase, plural) - e.g., `sectionIds`, `shiftTypeIds`
- **Other Fields**: camelCase or lowercase - e.g., `notes`, `dayOff`, `workShift`

### Class Names

- **CRUD Operations**: `Create{Entity}Input`, `Update{Entity}Input`, `Delete{Entity}Input`
- **Actions**: `{Verb}{Entity}To{Entity}Input`, `Remove{Entity}From{Entity}Input`, `Set{Property}Input`
- **Queries/Filters**: `{Entity}QueryInput`, `{Entity}{Context}Input`
- **Sorts**: `{Entity}SortInput`
- **Complex/Nested**: `{Purpose}Input`, `{Type}RequestInput`

---

## Anti-Patterns

### ❌ WRONG: Missing `[ID<Entity>]`
```csharp
// BAD - Guid treated as scalar UUID, not Relay ID
public required Guid SectionGuid { get; init; }

// GraphQL schema (WRONG):
input UpdateSectionInput {
  sectionGuid: UUID!  # Should be ID!
}
```

### ❌ WRONG: Missing `GraphQLName` on Entity ID
```csharp
// BAD - Entity ID not mapped to GraphQL naming convention
[ID<Section>]  // ❌ Missing GraphQLName
public required Guid SectionGuid { get; init; }  // GraphQL: "sectionGuid" instead of "sectionId"

// CORRECT
[ID<Section>]
[GraphQLName(Section.IdFullName)]  // ✅
public required Guid SectionGuid { get; init; }  // C#: SectionGuid, GraphQL: "sectionId"
```

### ❌ WRONG: Literal String in `GraphQLName`
```csharp
// BAD - No type safety, breaks on refactoring
[ID<Employee>]
[GraphQLName("employeeId")]  // ❌ Magic string
public Guid EmployeeGuid { get; set; }

// CORRECT
[ID<Employee>]
[GraphQLName(Employee.IdFullName)]  // ✅ Type-safe constant
public Guid EmployeeGuid { get; set; }
```

### ❌ WRONG: Missing `Optional<T>` in Partial Update
```csharp
// BAD - Can't distinguish "not provided" from "null"
public string? Name { get; init; }  // ❌ WRONG for partial update

// CORRECT
public Optional<string?> Name { get; init; }  // ✅ Three-state logic
```

### ❌ WRONG: Using `Optional<T>` in Create
```csharp
// BAD - Create operations don't need three-state logic
public Optional<string?> Name { get; set; }  // ❌ WRONG for create

// CORRECT
public string? Name { get; set; }  // ✅ Simple nullable for optional
```

### ❌ WRONG: Missing `[GraphQLType]` on Sort Field
```csharp
// BAD - Creates parallel enum types in schema (SortEnumType vs SortDirection)
[GraphQLDescription(Employee.DisplayNameDescription)]
// ❌ MISSING: [GraphQLType(typeof(DefaultSortEnumType))]
public SortDirection? DisplayName { get; init; }
```

### ❌ WRONG: Missing Concurrency Version in Partial Update
```csharp
// BAD - No optimistic concurrency control
public sealed class UpdateSectionInput
{
    [ID<Section>]
    [GraphQLName(Section.IdFullName)]
    public required Guid SectionGuid { get; init; }

    public Optional<string?> Name { get; init; }
    // ❌ MISSING: Version field
}
```

---

## Checklists

### Create*Input Classes
- [ ] Class has `[PublicAPI]` attribute
- [ ] NO `Optional<T>` wrappers used
- [ ] NO `required` keywords on simple fields
- [ ] NO `Version` field
- [ ] Related entity references have `[ID<Entity>]` + `[GraphQLName(Entity.IdFullName)]`
- [ ] Nullable types (`T?`) used for optional fields
- [ ] Non-nullable types used for required fields
- [ ] String fields with constraints have `[MaxLength]` and/or `[RegularExpression]`
- [ ] Property names follow `{Entity}Guid` pattern

### Update*Input Classes (Partial Update)
- [ ] Class has `[PublicAPI]` attribute
- [ ] Entity ID field has `[ID<Entity>]` + `[GraphQLName(Entity.IdFullName)]`
- [ ] Entity ID field is `required Guid` with `{ get; init; }`
- [ ] Entity ID property named `{Entity}Guid`, mapped to GraphQL `{entity}Id`
- [ ] Related entity references have `[ID<Entity>]` + `[GraphQLName(Entity.IdFullName)]`
- [ ] Version field is `required int Version { get; init; }`
- [ ] Version field has XML doc comment explaining concurrency
- [ ] All updatable fields use `Optional<T>` or `Optional<T?>`
- [ ] String fields with length limits have `[MaxLength(constant)]`
- [ ] String fields with format requirements have `[RegularExpression]`
- [ ] All validation attributes have descriptive `ErrorMessage` parameters
- [ ] Field descriptions reference entity constants when available

### Update*Input Classes (Replacement Operation)
- [ ] Class has `[PublicAPI]` attribute
- [ ] Entity ID field has `[ID<Entity>]` + `[GraphQLName(Entity.IdFullName)]`
- [ ] NO `Optional<T>` wrappers used
- [ ] NO `Version` field
- [ ] Related entity references have `[ID<Entity>]` + `[GraphQLName(Entity.IdFullName)]`
- [ ] Validation attributes where needed

### Delete*Input Classes
- [ ] Class has `[PublicAPI]` attribute
- [ ] Entity ID field has `[ID<Entity>]` + `[GraphQLName(Entity.IdFullName)]`
- [ ] Only contains entity ID field (minimal)

### Sort*Input Classes
- [ ] Class has `[PublicAPI]` attribute
- [ ] Class has `[GraphQLDescription(Entity.Description)]` at class level
- [ ] Every `SortDirection?` property has THREE mandatory attributes:
  - [ ] `[Cost(5)]` (MANDATORY for cost analysis)
  - [ ] `[GraphQLType(typeof(HotChocolate.Data.Sorting.DefaultSortEnumType))]` (MANDATORY)
  - [ ] `[GraphQLDescription(Entity.FieldDescription)]` (RECOMMENDED)
- [ ] Every nested sort input property has `[Cost(10)]` (MANDATORY)
- [ ] All properties use `{ get; init; }`
- [ ] Optional: `[Cost(10)]` on resolver parameter accepting the sort input array

### Query/Filter Input Classes
- [ ] Class has `[PublicAPI]` attribute
- [ ] Entity ID collections have `[ID<Entity>]` + `[GraphQLName("{entity}Ids")]`
- [ ] Nullable types for optional filters

### Action Input Classes (Assign, Remove, Set, etc.)
- [ ] Class has `[PublicAPI]` attribute
- [ ] All entity references have `[ID<Entity>]` + `[GraphQLName(Entity.IdFullName)]`
- [ ] Minimal fields (only what's needed for the action)

### Complex/Nested Input Classes
- [ ] Class has `[PublicAPI]` attribute
- [ ] If union type: Has `[OneOf]` attribute at class level
- [ ] If union type: All fields have `[GraphQLName]` in camelCase

### Common (All Input Types)
- [ ] All entity references use `[ID<Entity>]` with correct type
- [ ] ALL entity ID properties use `[GraphQLName(Entity.IdFullName)]` for consistent mapping
- [ ] C# property names: `{Entity}Guid` (e.g., `SectionGuid`)
- [ ] GraphQL field names: `{entity}Id` (e.g., `sectionId`) via `IdFullName` constant
- [ ] No hardcoded magic strings in attributes
- [ ] All domain constants referenced for length limits
- [ ] GraphQL names follow camelCase convention

---

## Related Guidelines
- [GRAPHQL_GUIDELINE.MD](./GRAPHQL_GUIDELINE.MD) - Part 2 (Description Constants), Part 3 (Error Handling), Part 4 (Mutation Patterns), Part 8 (ID Naming)
- [BACKEND_GUIDELINE.MD](./BACKEND_GUIDELINE.MD) - Entity patterns and conventions
- [SECURITY_GUIDELINES.MD](./SECURITY_GUIDELINES.MD) - Input validation security

---

## References

**Analyzed Files**: 32 *Input.cs files across the codebase

**Key Findings**:
- `[PublicAPI]`: 100% usage (32/32)
- `[ID<Entity>]`: 75% usage (24/32)
- `[GraphQLName]`: 69% usage (22/32)
- `[GraphQLDescription]`: 66% usage (21/32)
- `[MaxLength]`: 16% usage (5/32 - constraint-heavy inputs)
- `[GraphQLType]`: 100% of sort inputs (4/4 - MANDATORY for sort fields)
- `[Cost]`: 100% of sort inputs (4/4 - MANDATORY for SortDirection fields and nested sort properties)
- `Optional<T>`: 6% usage (2/32 - only true partial updates)
- `required int Version`: 3% usage (1/32 - only partial updates)

**Exemplary Implementations**:
- `UpdateSectionInput` - Perfect partial update pattern
- `EmployeeSortInput` - Perfect sort input pattern
- `CreateSchedulerRequestInput` - Complex nested input with OneOf
- `UnpublishSectionsInput` - Custom validation method pattern
