# Crosscutting Concepts

> **Quick Summary**
> 
> **Purpose**: Document **concepts and patterns** that apply across multiple building blocks - the overarching principles that ensure consistency.
> 
> **Key Questions**:
> - What patterns do we use consistently across the system?
> - How do we handle common concerns like security, logging, error handling?
> - What domain concepts are shared across components?

---

---

**What to Document**

Crosscutting concepts describe **overall, principal regulations and solution ideas** that are relevant in multiple parts of the system:

- **Domain concepts** - domain model, ubiquitous language
- **Architectural patterns** - applied consistently
- **Development approaches** - coding conventions, testing
- **Operational patterns** - logging, monitoring, configuration

> **Important**: These concepts provide **consistency** across the system. Without them, each component might solve the same problem differently.

---

**Categories of Concepts**

```
┌─────────────────────────────────────────────────────────────┐
│                   CROSSCUTTING CONCEPTS                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Domain    │  │   User      │  │    Development      │  │
│  │   Model     │  │ Experience  │  │    Concepts         │  │
│  │             │  │             │  │                     │  │
│  │ • Entities  │  │ • UI/UX     │  │ • Build/Deploy      │  │
│  │ • Value Obj │  │ • Ergonomics│  │ • Code conventions  │  │
│  │ • Aggregates│  │ • i18n      │  │ • Testing strategy  │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Safety/   │  │Architecture │  │    Under-the-Hood   │  │
│  │  Security   │  │  Patterns   │  │    Concepts         │  │
│  │             │  │             │  │                     │  │
│  │ • AuthN/Z   │  │ • CQRS      │  │ • Persistence       │  │
│  │ • Encryption│  │ • Event Src │  │ • Communication     │  │
│  │ • Audit     │  │ • DDD       │  │ • Exception handling│  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Domain Model

Define core domain concepts that are used across the system:

```markdown
## Domain Model

### Core Entities

| Entity | Description | Key Attributes |
|--------|-------------|----------------|
| **Customer** | A user who can place orders | id, email, name, status |
| **Order** | A purchase transaction | id, customer_id, items, status, total |
| **Product** | An item that can be ordered | id, name, price, stock |
| **Payment** | A financial transaction | id, order_id, amount, status |

### Entity Diagram

    ┌──────────────┐
    │   Customer   │
    └───────┬──────┘
            │ 1
            │
            │ *
    ┌───────▼──────┐         ┌──────────────┐
    │    Order     │────────►│   Payment    │
    └───────┬──────┘   1   1 └──────────────┘
            │ *
            │
            │ 1..*
    ┌───────▼──────┐
    │  OrderItem   │
    └───────┬──────┘
            │ *
            │
            │ 1
    ┌───────▼──────┐
    │   Product    │
    └──────────────┘

### Ubiquitous Language

| Term | Definition |
|------|------------|
| **Active Order** | An order that is not yet fulfilled or cancelled |
| **Fulfillment** | The process of preparing and shipping an order |
| **SKU** | Stock Keeping Unit - unique product identifier |
```

---

## Security Concept

```markdown
## Security Architecture

### Authentication
- **Method**: OAuth 2.0 / OpenID Connect
- **Provider**: Azure AD B2C
- **Token Type**: JWT Bearer tokens
- **Session**: Stateless (token-based)

### Authorization
- **Model**: Role-Based Access Control (RBAC)
- **Roles**: Admin, Manager, User, Guest
- **Enforcement**: API Gateway + Service-level checks

### Data Protection
- **In Transit**: TLS 1.3 minimum
- **At Rest**: AES-256 encryption
- **Keys**: Azure Key Vault managed

### Security Flow

    User ─► Frontend ─► API Gateway ─► Backend Services
             │              │                │
             │    OAuth     │    Validate    │  RBAC
             │    Flow      │    JWT Token   │  Check
             ▼              ▼                ▼
          Azure AD      Token Claims     Permission
            B2C         Extraction       Evaluation
```

---

## Logging and Monitoring

````markdown
## Observability Concept

### Logging
- **Framework**: Structured logging (JSON format)
- **Levels**: DEBUG, INFO, WARN, ERROR
- **Correlation**: Request correlation ID across services

### Log Entry Structure
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "INFO",
  "service": "order-service",
  "correlationId": "abc-123-def",
  "message": "Order created",
  "data": {
    "orderId": "ORD-001",
    "customerId": "CUST-123"
  }
}
```

### Monitoring
- **Metrics**: Prometheus format
- **Dashboards**: Grafana
- **Alerts**: PagerDuty integration

### Key Metrics
| Metric | Type | Alert Threshold |
|--------|------|-----------------|
| `http_request_duration_seconds` | Histogram | p99 > 1s |
| `http_requests_total` | Counter | Error rate > 1% |
| `active_orders` | Gauge | - |
````

---

## Error Handling

````markdown
## Error Handling Concept

### Error Response Format
```json
{
  "error": {
    "code": "ORDER_NOT_FOUND",
    "message": "The requested order does not exist",
    "correlationId": "abc-123-def",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Error Categories
| Category | HTTP Status | Retry? | Example |
|----------|-------------|--------|---------|
| **Validation** | 400 | No | Invalid email format |
| **Authentication** | 401 | No | Invalid token |
| **Authorization** | 403 | No | Insufficient permissions |
| **Not Found** | 404 | No | Order doesn't exist |
| **Conflict** | 409 | No | Duplicate order |
| **Internal Error** | 500 | Yes | Database connection lost |
| **Service Unavailable** | 503 | Yes | Downstream service down |

### Retry Policy
- **Max Retries**: 3
- **Backoff**: Exponential (1s, 2s, 4s)
- **Circuit Breaker**: Open after 5 consecutive failures
````

---

## Persistence Concept

```markdown
## Data Persistence

### Storage Strategy
| Data Type | Storage | Rationale |
|-----------|---------|-----------|
| Transactional | PostgreSQL | ACID, relations |
| Cache | Redis | Performance, sessions |
| Files/Blobs | Azure Blob | Large objects |
| Search | Elasticsearch | Full-text queries |

### Database Patterns
- **Repository Pattern**: Abstract data access
- **Unit of Work**: Transaction management
- **CQRS**: Separate read/write models (for complex queries)

### Data Migration
- **Tool**: Flyway / Liquibase
- **Strategy**: Version-controlled migrations
- **Rollback**: All migrations reversible
```

---

---

**📝 Tips and Best Practices**

| Tip | Description | Style |
|-----|-------------|-------|
| 8-1 | Document **domain model** for shared understanding | ⭐ Essential |
| 8-2 | Define **security concept** explicitly | ⭐ Essential |
| 8-3 | Standardize **error handling** across services | ⭐ Essential |
| 8-4 | Establish **logging conventions** | ⭐ Essential |
| 8-5 | Document **persistence strategies** | ⭐ Essential |
| 8-6 | Define **coding conventions** | 📚 Thorough |
| 8-7 | Describe **testing approach** | 📚 Thorough |
| 8-8 | Document **configuration management** | 📚 Thorough |
| 8-9 | Explain **transaction handling** patterns | 📚 Thorough |
| 8-10 | Show **message/event format** standards | 📚 Thorough |
| 8-11 | Keep concepts **actionable** with examples | ⭐ Essential |

**Style Legend**: 🏃 Lean | ⭐ Essential | 📚 Thorough

---

---

**❌ Common Mistakes to Avoid**

**❌ Don't do this:**

1. Implementing the same concern differently in each service
2. No defined error handling strategy
3. Inconsistent logging formats
4. Missing security concept documentation
5. Not defining the domain model

**✅ Do this instead:**

1. Define concepts once, apply everywhere
2. Standardize error handling with codes and formats
3. Use structured logging with consistent fields
4. Document security explicitly with diagrams
5. Create shared domain model with ubiquitous language

---

**✅ Concepts Checklist**

| ✓ | Item | Status |
|---|------|--------|
| ☐ | Domain model documented | |
| ☐ | Security concept defined | |
| ☐ | Logging/monitoring approach specified | |
| ☐ | Error handling standardized | |
| ☐ | Persistence strategies documented | |
| ☐ | Coding conventions established | |

---

---

**🔗 Related Sections**

- [Section 5: Building Blocks](arc42_05_building_blocks.md) - Where concepts are applied
- [Section 9: Decisions](arc42_09_decisions.md) - Decisions behind the concepts
- [Section 12: Glossary](arc42_12_glossary.md) - Domain terminology

---

---

**📖 Further Reading**

- [arc42 Tips for Section 8](https://docs.arc42.org/section-8/)
- [Domain-Driven Design](https://www.domainlanguage.com/ddd/)
- [The Twelve-Factor App](https://12factor.net/)
