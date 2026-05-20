# Introduction and Goals

> **Quick Summary**
> 
> **Purpose**: Describe the fundamental requirements, driving forces, and key quality goals that shape the architecture.
> 
> **Key Questions**:
> - What is the system supposed to do?
> - What are the top 3-5 quality goals?
> - Who are the stakeholders and what do they expect?

---

---

**What to Document**

This section captures the **essence** of what the system should achieve and why it exists. It sets the stage for all architectural decisions.

## Requirements Overview

**Content**: A short description of the functional requirements, driving forces, and extract of the requirements. Link to detailed requirements if available.

**Motivation**: From the standpoint of users, the system is created to fulfill certain functional needs. The foundation for all following decisions.

**Requirements Overview Template**

```markdown
## Requirements Overview

### Business Context
[Brief description of the business problem this system solves]

### Core Functionality
1. [Primary function 1]
2. [Primary function 2]
3. [Primary function 3]

### Scope
- **In Scope**: [What the system does]
- **Out of Scope**: [What the system explicitly does NOT do]

### Key Use Cases
| ID | Use Case | Priority |
|----|----------|----------|
| UC-01 | [Use case name] | High |
| UC-02 | [Use case name] | Medium |
```

---

## Quality Goals

**Content**: The top 3-5 quality goals for the architecture whose fulfillment is of highest importance to the major stakeholders.

**Motivation**: You should know the quality goals of your most important stakeholders, since they will influence fundamental architectural decisions.

> **Important**: Use concrete, measurable quality goals. "The system should be fast" is not useful. "95th percentile response time < 200ms" is.

**Quality Goals Template**

| Priority | Quality Goal | Scenario | Measurement |
|----------|--------------|----------|-------------|
| 1 | **Performance** | Under peak load (1000 users) | Response time < 500ms (p95) |
| 2 | **Availability** | Normal operation | 99.9% uptime monthly |
| 3 | **Security** | User data handling | Zero data breaches, GDPR compliant |
| 4 | **Maintainability** | Adding new features | New feature in < 2 weeks |
| 5 | **Scalability** | Growth scenario | Handle 10x current load |

**ISO 25010 Quality Model Reference**

Use ISO 25010 as a checklist for quality attributes:

- **Functional Suitability** - Does it do what it should?
- **Performance Efficiency** - How fast/efficient?
- **Compatibility** - Does it work with other systems?
- **Usability** - Is it easy to use?
- **Reliability** - Does it work consistently?
- **Security** - Is it protected?
- **Maintainability** - Can it be changed easily?
- **Portability** - Can it run elsewhere?

---

## Stakeholders

**Content**: Explicit overview of stakeholders - the persons, roles, or organizations that have an interest in or impact on the architecture.

**Motivation**: You should know all parties involved in development, as they may have specific expectations, constraints, or concerns that influence architecture.

**Stakeholder Template**

| Role/Name | Contact | Expectations | Concerns |
|-----------|---------|--------------|----------|
| **Product Owner** | [email] | Feature delivery, business value | Timeline, budget |
| **Development Team** | [team channel] | Clear requirements, stable APIs | Technical debt, complexity |
| **Operations** | [email] | Deployability, monitoring | Uptime, incidents |
| **Security Officer** | [email] | Compliance, secure design | Vulnerabilities, audits |
| **End Users** | N/A | Intuitive, fast, reliable | Learning curve, downtime |

---

---

**📝 Tips and Best Practices**

| Tip | Description | Style |
|-----|-------------|-------|
| 1-1 | **Limit quality goals** to 3-5 most important ones | 🏃 Lean |
| 1-2 | Make quality goals **measurable** with concrete scenarios | ⭐ Essential |
| 1-3 | **Prioritize** quality goals - not everything can be #1 | ⭐ Essential |
| 1-4 | Reference **ISO 25010** for quality attribute checklist | 📚 Thorough |
| 1-5 | **Link to requirements** documents rather than duplicating | 🏃 Lean |
| 1-6 | Keep requirements overview **brief** - this is a summary | 🏃 Lean |
| 1-7 | **Identify all stakeholders** - missing one causes problems later | ⭐ Essential |
| 1-8 | Document stakeholder **expectations explicitly** | ⭐ Essential |
| 1-9 | Note stakeholder **concerns** to address them proactively | 📚 Thorough |
| 1-10 | Use a **stakeholder matrix** for complex projects | 📚 Thorough |
| 1-11 | Consider **indirect stakeholders** (regulators, auditors) | 📚 Thorough |
| 1-12 | Keep this section **up-to-date** as requirements evolve | ⭐ Essential |
| 1-13 | **Distinguish** functional from quality requirements | ⭐ Essential |
| 1-14 | Use **business language**, not technical jargon here | ⭐ Essential |
| 1-15 | Document the **"why"** behind requirements | 📚 Thorough |
| 1-16 | Include **constraints** that limit solutions | ⭐ Essential |
| 1-17 | Reference **external compliance** requirements (GDPR, etc.) | 📚 Thorough |
| 1-18 | Create **quality scenarios** for each quality goal | ⭐ Essential |
| 1-19 | Map quality goals to **architecture decisions** | 📚 Thorough |
| 1-20 | Get stakeholder **sign-off** on quality priorities | 📚 Thorough |
| 1-21 | Document **conflicting goals** and resolution strategy | 📚 Thorough |
| 1-22 | Use **quantitative metrics** where possible | ⭐ Essential |
| 1-23 | Consider **future stakeholders** (maintenance teams) | 📚 Thorough |
| 1-24 | Review section with **business stakeholders** for accuracy | ⭐ Essential |

**Style Legend**: 🏃 Lean | ⭐ Essential | 📚 Thorough

---

---

**❌ Common Mistakes to Avoid**

**❌ Don't do this:**

1. Vague quality goals like "good performance" or "easy to use"
2. Listing 20+ quality goals (impossible to optimize for all)
3. Forgetting non-technical stakeholders
4. Copying entire requirements documents here
5. Using technical jargon with business stakeholders

**✅ Do this instead:**

1. Specific, measurable goals: "Response time < 200ms for 95th percentile"
2. Focus on top 3-5 quality goals that drive architecture
3. Include business owners, users, operations, security, compliance
4. Summarize and link to detailed requirements
5. Use business language, define technical terms in glossary

---

**✅ Introduction Checklist**

| ✓ | Item | Status |
|---|------|--------|
| ☐ | Requirements overview written | |
| ☐ | Top 3-5 quality goals identified | |
| ☐ | Quality goals are measurable | |
| ☐ | All stakeholders listed | |
| ☐ | Stakeholder expectations documented | |
| ☐ | Section reviewed by key stakeholders | |

---

---

**🔗 Related Sections**

- [Section 2: Constraints](arc42_02_constraints.md) - Limitations that affect architecture
- [Section 4: Solution Strategy](arc42_04_solution_strategy.md) - How we achieve quality goals
- [Section 10: Quality Requirements](arc42_10_quality.md) - Detailed quality scenarios

---

---

**📖 Further Reading**

- [arc42 Tips for Section 1](https://docs.arc42.org/section-1/)
- [ISO 25010 Quality Model](https://iso25000.com/index.php/en/iso-25000-standards/iso-25010)
- [Stakeholder Analysis](https://www.mindtools.com/pages/article/newPPM_07.htm)
