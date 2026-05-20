# Architecture Constraints

> **Quick Summary**
> 
> **Purpose**: Document all constraints that limit the freedom of design decisions - the "rules of the game" you must play by.
> 
> **Key Questions**:
> - What technical constraints exist?
> - What organizational constraints apply?
> - What conventions must be followed?

---

---

**What to Document**

Constraints are **requirements that limit your design freedom**. They are non-negotiable (or very expensive to change) and must be considered in every architectural decision.

> **Important**: Constraints are NOT decisions - they are given. Document where they come from and why they exist.

---

**Types of Constraints**

## Technical Constraints

Technology restrictions imposed on the implementation:

| Constraint | Background/Motivation |
|------------|----------------------|
| **Must run on Azure** | Corporate cloud strategy, existing investments |
| **Python 3.10+** | Team expertise, existing codebase |
| **PostgreSQL database** | Mandated by data platform team |
| **REST APIs only** | Integration with legacy systems |
| **Max 512MB memory per container** | Kubernetes cluster limits |

## Organizational Constraints

Process and team-related restrictions:

| Constraint | Background/Motivation |
|------------|----------------------|
| **Agile/Scrum process** | Company methodology |
| **Two-week sprints** | Aligned with release cadence |
| **Code review required** | Quality gate policy |
| **Max 5 person team** | Budget limitations |
| **Remote-first development** | Distributed team locations |

## Political Constraints

Business and strategic limitations:

| Constraint | Background/Motivation |
|------------|----------------------|
| **Must use vendor X** | Existing enterprise agreement |
| **No open-source for core** | Legal/IP concerns |
| **Must integrate with legacy system Y** | Cannot replace until 2026 |
| **Budget cap: €500K** | Approved project funding |

## Conventions

Standards and guidelines to follow:

| Convention | Background/Motivation |
|------------|----------------------|
| **API Design Guidelines v2.1** | Company standard |
| **Semantic Versioning** | Release management |
| **GitFlow branching** | Development workflow |
| **OWASP Top 10 compliance** | Security standard |
| **WCAG 2.1 AA accessibility** | Legal requirement |

---

**Constraint Documentation Template**

```markdown
## Constraint: [Name]

**Category**: Technical | Organizational | Political | Convention

**Description**: [What is the constraint?]

**Source**: [Who/what imposed this constraint?]

**Background**: [Why does this constraint exist?]

**Impact on Architecture**: 
- [How does this limit design options?]
- [What decisions are forced by this?]

**Negotiability**: Fixed | Negotiable with [stakeholder] | Time-limited until [date]
```

**Example Constraint**

```markdown
## Constraint: Azure Cloud Only

**Category**: Technical / Political

**Description**: All infrastructure must be deployed on Microsoft Azure.

**Source**: CTO Office, Enterprise Architecture Board

**Background**: 
- Corporate cloud strategy standardized on Azure
- Existing enterprise agreement provides cost benefits
- Operations team trained only on Azure

**Impact on Architecture**:
- Cannot use AWS-specific services (Lambda, DynamoDB)
- Must use Azure equivalents (Functions, Cosmos DB)
- Limits multi-cloud disaster recovery options

**Negotiability**: Fixed for next 3 years (contract term)
```

---

**Constraint Impact Analysis**

Understand how constraints affect your options:

| Constraint | Affects | Forces Decision | Alternative Blocked |
|------------|---------|-----------------|---------------------|
| Azure only | Cloud provider | Use Azure services | AWS, GCP |
| Python 3.10+ | Language | Async patterns available | Older Python versions |
| REST APIs | Integration | HTTP/JSON interfaces | gRPC, GraphQL |
| 512MB containers | Deployment | Optimize memory usage | Memory-heavy approaches |

---

---

**📝 Tips and Best Practices**

| Tip | Description | Style |
|-----|-------------|-------|
| 2-1 | **Categorize constraints** (technical, organizational, political) | ⭐ Essential |
| 2-2 | Document the **source** of each constraint | ⭐ Essential |
| 2-3 | Explain the **background/motivation** | 📚 Thorough |
| 2-4 | Note if constraints are **negotiable** | ⭐ Essential |
| 2-5 | Keep constraints **separate from decisions** | ⭐ Essential |

**Style Legend**: 🏃 Lean | ⭐ Essential | 📚 Thorough

---

---

**❌ Common Mistakes to Avoid**

**❌ Don't do this:**

1. Confusing constraints with decisions (constraints are given, decisions are made)
2. Not documenting where constraints come from
3. Assuming all constraints are permanent
4. Missing implicit constraints (team skills, existing systems)
5. Not explaining impact on architecture

**✅ Do this instead:**

1. Clearly separate "we must" (constraints) from "we chose" (decisions)
2. Always note the source and stakeholder
3. Mark time-limited or negotiable constraints
4. Interview stakeholders to uncover hidden constraints
5. Explain how each constraint limits your options

---

**✅ Constraints Checklist**

| ✓ | Item | Status |
|---|------|--------|
| ☐ | Technical constraints documented | |
| ☐ | Organizational constraints documented | |
| ☐ | Political constraints acknowledged | |
| ☐ | Conventions/standards listed | |
| ☐ | Sources identified for all constraints | |
| ☐ | Impact on architecture explained | |

---

---

**🔗 Related Sections**

- [Section 1: Introduction](arc42_01_introduction.md) - Requirements and stakeholders
- [Section 4: Solution Strategy](arc42_04_solution_strategy.md) - Decisions within constraints
- [Section 9: Decisions](arc42_09_decisions.md) - Architecture decisions respecting constraints

---

---

**📖 Further Reading**

- [arc42 Tips for Section 2](https://docs.arc42.org/section-2/)
- [Documenting Constraints](https://www.viewpoints-and-perspectives.info/home/perspectives/development-resource-constraints/)
