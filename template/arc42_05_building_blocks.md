# Building Block View

> **Quick Summary**
> 
> **Purpose**: Show the **static decomposition** of the system into building blocks (modules, components, packages) and their dependencies.
> 
> **Key Questions**:
> - How is the system broken down into components?
> - What are the responsibilities of each component?
> - How do components relate to each other?

---

---

**What to Document**

The building block view shows the static decomposition of the system into building blocks, their internal structure, and their relationships.

> **Core Principle**: **Hierarchical decomposition** - Start with a high-level view and refine to more detail as needed.

---

**Levels of Decomposition**

```
Level 1: System Context → Building Blocks (Whitebox)
         The system as a whole, decomposed into major components

Level 2: Building Blocks → Sub-components (Whitebox)
         Each Level 1 block decomposed further

Level 3: Sub-components → Detailed elements
         Further refinement where needed

Rule: Only go as deep as necessary to explain the architecture!
```

---

## Level 1: Overall System (White Box)

**Content**

The top level shows the system's main building blocks that implement the functionality.

**White Box Template**

```markdown
## Level 1: System Overview

![System Overview](images/level1-overview.png)

**Motivation**: [Why this decomposition?]

**Quality Implications**: [How does this support quality goals?]

### Contained Building Blocks

| Building Block | Responsibility |
|----------------|----------------|
| [Component A]  | [Short description] |
| [Component B]  | [Short description] |
| [Component C]  | [Short description] |

### Important Interfaces

| Interface | Description | Between |
|-----------|-------------|---------|
| [API 1]   | [Purpose]   | A ↔ B   |
| [Events]  | [Purpose]   | B → C   |
```

**Visual Example - Level 1**

```
┌─────────────────────────────────────────────────────────┐
│                    YOUR SYSTEM                          │
│                                                         │
│   ┌─────────────┐    ┌─────────────┐    ┌───────────┐   │
│   │    Web      │    │   Business  │    │   Data    │   │
│   │   Layer     │───►│   Logic     │───►│   Access  │   │
│   │             │    │   Layer     │    │   Layer   │   │
│   └─────────────┘    └─────────────┘    └───────────┘   │
│         │                  │                  │         │
│         │                  │                  │         │
│         ▼                  ▼                  ▼         │
│   ┌────────────────────────────────────────────────┐   │
│   │             Cross-Cutting Concerns              │   │
│   │        (Logging, Security, Monitoring)          │   │
│   └────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Level 2: Component Details (White Box)

**Black Box Descriptions**

For each Level 1 component, provide a black box view first:

```markdown
## Component: Business Logic Layer

**Purpose**: Core domain logic and business rules

**Interface(s)**:
- `IOrderService`: Order management operations
- `IInventoryService`: Stock management
- `INotificationService`: Alert and notification triggers

**Quality/Performance**: 
- Must handle 100 concurrent operations
- All operations < 500ms

**Source**: `/src/business-logic/`
```

**White Box Refinement**

Then optionally show internal structure:

```
┌─────────────────────────────────────────────────────────┐
│               Business Logic Layer                       │
│                                                          │
│   ┌──────────────┐   ┌──────────────┐   ┌────────────┐  │
│   │    Order     │   │  Inventory   │   │   User     │  │
│   │   Service    │──►│   Service    │◄──│  Service   │  │
│   └──────────────┘   └──────────────┘   └────────────┘  │
│          │                  │                  │        │
│          │                  │                  │        │
│          └──────────────────┼──────────────────┘        │
│                             │                           │
│                             ▼                           │
│                    ┌────────────────┐                   │
│                    │   Domain       │                   │
│                    │   Events       │                   │
│                    └────────────────┘                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Level 3: Detailed Design

Only document Level 3 for complex or critical components:

```markdown
## Order Service - Internal Structure

**Classes/Modules**:
- `OrderProcessor`: Orchestrates order workflow
- `OrderValidator`: Validates business rules
- `OrderRepository`: Data persistence
- `OrderEventPublisher`: Publishes domain events

**Internal Flow**:
1. Request received by OrderProcessor
2. Validation via OrderValidator
3. Persistence via OrderRepository
4. Event publication via OrderEventPublisher
```

---

**Building Block Documentation Templates**

**Black Box Template**

```markdown
## [Building Block Name]

**Purpose/Responsibility**: 
[What does this building block do? What is its role?]

**Interface(s)**:
| Interface | Description |
|-----------|-------------|
| [Interface 1] | [Description] |
| [Interface 2] | [Description] |

**Quality/Performance Characteristics**:
- [Performance requirements]
- [Security considerations]
- [Availability requirements]

**Location/Artifact**: 
[Where is the source code? Link to repo/folder]

**Open Issues**: 
[Known problems or future improvements]
```

**White Box Template**

```markdown
## [Building Block Name] - Internal Structure

**Motivation**: 
[Why this internal decomposition?]

**Contained Building Blocks**:
| Sub-Block | Responsibility |
|-----------|----------------|
| [Sub A]   | [Description]  |
| [Sub B]   | [Description]  |

**Internal Interfaces**:
[How the sub-blocks communicate]

**Design Decisions**:
[Key internal design decisions]
```

---

---

**📝 Tips and Best Practices**

| Tip | Description | Style |
|-----|-------------|-------|
| 5-1 | Start with **Level 1** overview before details | ⭐ Essential |
| 5-2 | Use **hierarchy** - don't show everything at once | ⭐ Essential |
| 5-3 | **Black box first**, then white box if needed | ⭐ Essential |
| 5-4 | Document **responsibilities** for each block | ⭐ Essential |
| 5-5 | Show **interfaces** between building blocks | ⭐ Essential |
| 5-6 | **Combine** diagram with structured descriptions | ⭐ Essential |
| 5-7 | Use **C4 Model** notation for diagrams | 📚 Thorough |
| 5-8 | Only go **as deep as necessary** | 🏃 Lean |
| 5-9 | **Don't mix abstraction levels** in one diagram | ⭐ Essential |
| 5-10 | Use **consistent notation** throughout | ⭐ Essential |
| 5-11 | **Name building blocks** meaningfully | ⭐ Essential |
| 5-12 | Show **source code mapping** (folder/package) | 📚 Thorough |
| 5-13 | Document **cross-cutting concerns** separately | 📚 Thorough |
| 5-14 | Show **dependencies direction** clearly | ⭐ Essential |
| 5-15 | Use **tables** for structured block descriptions | 🏃 Lean |
| 5-16 | Keep diagrams **simple** (max 7±2 elements) | 🏃 Lean |
| 5-17 | **Link to code** where possible | 📚 Thorough |
| 5-18 | Document **quality implications** of structure | 📚 Thorough |
| 5-19 | Show **technology mapping** (which tech for each block) | 📚 Thorough |
| 5-20 | Consider **different views** for different stakeholders | 📚 Thorough |
| 5-21 | Explain **architectural patterns** used | 📚 Thorough |
| 5-22 | Document **known issues** and limitations | 📚 Thorough |
| 5-23 | Show **boundary** between system and external world | ⭐ Essential |
| 5-24 | Map blocks to **teams/responsibilities** | 📚 Thorough |
| 5-25 | Use **layers or slices** to organize blocks | 📚 Thorough |
| 5-26 | Document **shared components** explicitly | ⭐ Essential |
| 5-27 | Show **data flow** direction in interfaces | 📚 Thorough |
| 5-28 | **Review regularly** to keep accurate | ⭐ Essential |

**Style Legend**: 🏃 Lean | ⭐ Essential | 📚 Thorough

---

---

**❌ Common Mistakes to Avoid**

**❌ Don't do this:**

1. Showing all details at once (overwhelming)
2. Missing interfaces between components
3. Inconsistent naming or notation
4. Mixing different abstraction levels
5. Diagrams without explanations

**✅ Do this instead:**

1. Use hierarchical decomposition (Level 1, 2, 3)
2. Explicitly document all interfaces
3. Use consistent naming conventions
4. Each diagram shows ONE level of detail
5. Always pair diagrams with textual descriptions

---

**✅ Building Block View Checklist**

| ✓ | Item | Status |
|---|------|--------|
| ☐ | Level 1 overview diagram created | |
| ☐ | All major building blocks identified | |
| ☐ | Responsibilities documented for each block | |
| ☐ | Interfaces between blocks described | |
| ☐ | Critical components refined to Level 2/3 | |
| ☐ | Source code mapping provided | |

---

---

**🔗 Related Sections**

- [Section 3: Context](arc42_03_context.md) - External view (system as black box)
- [Section 6: Runtime View](arc42_06_runtime.md) - Dynamic behavior of building blocks
- [Section 7: Deployment](arc42_07_deployment.md) - Where building blocks run

---

---

**📖 Further Reading**

- [arc42 Tips for Section 5](https://docs.arc42.org/section-5/)
- [C4 Model](https://c4model.com/)
- [Documenting Software Architectures (SEI)](https://www.sei.cmu.edu/library/abstracts/books/0321552687.cfm)
