# Context and Scope

> **Quick Summary**
> 
> **Purpose**: Clearly define what is **inside** your system and what is **outside** - including all external interfaces.
> 
> **Key Questions**:
> - What are the system's boundaries?
> - Who/what communicates with the system?
> - What data flows in and out?

---

---

**What to Document**

System scope and context **delimits your system from all its communication partners** (neighboring systems and users). It specifies the external interfaces.

> **Important**: The domain interfaces and technical interfaces to communication partners are among your system's **most critical aspects**. Make sure that you completely understand them!

---

**Two Types of Context**

| Business Context | Technical Context |
|------------------|-------------------|
| Domain-specific inputs/outputs | Channels, protocols, hardware |
| **What** data is exchanged | **How** data is exchanged |
| User-focused view | Infrastructure-focused view |
| All stakeholders should understand | Hardware/infrastructure stakeholders need |

---

## Business Context

**Content**

Specification of **all communication partners** (users, IT-systems, etc.) with explanations of:

- Domain-specific inputs and outputs
- Interface definitions at the business level
- Optionally: domain-specific formats or protocols

**Motivation**

All stakeholders should understand **which data are exchanged** with the environment of the system.

**Recommended Forms**

**Context Diagram**

```
              ┌─────────────┐
              │  Customer   │
              └──────┬──────┘
                     │ Orders, Queries
                     ▼
   ┌──────────┐    ┌────────────────────┐    ┌──────────────┐
   │  ERP     │◄──►│   YOUR SYSTEM      │◄──►│  Payment     │
   │  System  │    │   (Black Box)      │    │  Provider    │
   └──────────┘    └─────────┬──────────┘    └──────────────┘
                             │
                     ▼                  ▼
              ┌──────────────┐    ┌─────────────┐
              │  Email       │    │  Analytics  │
              │  Service     │    │  Platform   │
              └──────────────┘    └─────────────┘
```

**Context Table**

| Partner | Input to System | Output from System |
|---------|-----------------|---------------------|
| Customer | Orders, Queries | Confirmations, Status updates |
| ERP System | Product data, Inventory levels | Order data, Fulfillment status |
| Payment Provider | Payment confirmation | Payment requests |

**PlantUML C4 Example**

```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml

Person(customer, "Customer", "A user of the system")
System(system, "My System", "The system being documented")
System_Ext(erp, "ERP System", "Enterprise resource planning")
System_Ext(payment, "Payment Gateway", "Payment processing")

Rel(customer, system, "Uses", "HTTPS")
Rel(system, erp, "Syncs data", "REST API")
Rel(system, payment, "Processes payments", "REST API")

@enduml
```

---

## Technical Context

**Content**

Technical interfaces (channels and transmission media) linking your system to its environment, including:

- Protocols and technologies used
- Mapping of domain I/O to channels
- Network boundaries and security zones

**Motivation**

Many stakeholders make architectural decisions based on **technical interfaces**. Especially infrastructure and hardware designers need this information.

**Recommended Form**

```markdown
**Technical Context (Details)**

| Partner | Channel | Protocol | Security |
|---------|---------|----------|----------|
| Customer | Internet | HTTPS/REST | OAuth 2.0 |
| ERP System | Corporate LAN | gRPC | mTLS |
| Payment Provider | VPN/Internet | HTTPS/REST | API Key + Signature |
| Message Queue | Internal | AMQP (RabbitMQ) | TLS |
```

---

**External Interface Documentation**

For each significant external interface, consider documenting:

```markdown
## Interface: [Interface Name]

**Partner System**: [Name of external system]

**Direction**: Inbound / Outbound / Bidirectional

**Business Purpose**: [Why this interface exists]

**Data Format**: JSON / XML / Binary / etc.

**Protocol**: REST / gRPC / AMQP / etc.

**Authentication**: OAuth 2.0 / API Key / mTLS / etc.

**SLA/Quality Requirements**:
- Response time: < 200ms
- Availability: 99.9%
- Rate limit: 1000 req/min

**Error Handling**: [How errors are handled]

**Owner/Contact**: [Who to contact for issues]
```

---

---

**📝 Tips and Best Practices**

| Tip | Description | Style |
|-----|-------------|-------|
| 3-1 | **Explicitly demarcate** your system from its environment | ⭐ Essential |
| 3-2 | **Show the context as a diagram** - essential for understanding | ⭐ Essential |
| 3-3 | **Combine** context diagram with a table | ⭐ Essential |
| 3-4 | Explicitly **indicate risks** in the context | 📚 Thorough |
| 3-5 | **Restrict to overview** - avoid too many details | 🏃 Lean |
| 3-6 | **Simplify** by categorization when many interfaces exist | 🏃 Lean |
| 3-7 | **Aggregate/cluster** similar neighbor systems | 🏃 Lean |
| 3-8 | Use **ports** to cluster similar systems | 🏃 Lean |
| 3-9 | Show **all external interfaces** - don't leave any out! | ⭐ Essential |
| 3-10 | **Differentiate** business and technical context | ⭐ Essential |
| 3-11 | In business context, show **data flows** (not dependencies) | ⭐ Essential |
| 3-12 | Show **external influences** (regulations, standards) | 📚 Thorough |
| 3-13 | Show **transitive dependencies** if relevant | 📚 Thorough |
| 3-14 | Pay attention to **quality requirements** at interfaces | ⭐ Essential |
| 3-15 | Show technical context when **hardware is central** | 📚 Thorough |
| 3-16 | Use technical context to describe **protocols/channels** | 📚 Thorough |
| 3-17 | **Combine** business context with technical info | 🏃 Lean |
| 3-18 | Explain **mapping** between domain and technical interfaces | 📚 Thorough |
| 3-19 | **Defer** technical context to deployment view if simpler | 🏃 Lean |

**Style Legend**: 🏃 Lean | ⭐ Essential | 📚 Thorough

---

---

**❌ Common Mistakes to Avoid**

**❌ Don't do this:**

1. Forgetting to show users/actors as external parties
2. Missing interfaces that "everyone knows about"
3. Over-detailing the context (save details for other sections)
4. Confusing context diagram with detailed architecture
5. Not showing data flow directions

**✅ Do this instead:**

1. Always include human users/actors
2. Document **all** interfaces, even "obvious" ones
3. Keep context diagrams at overview level
4. System should be a "black box" in context diagrams
5. Clearly indicate what flows where

---

**✅ Context Checklist**

| ✓ | Item | Status |
|---|------|--------|
| ☐ | All external actors/users identified | |
| ☐ | All neighboring systems documented | |
| ☐ | Input/output data flows specified | |
| ☐ | Business context diagram created | |
| ☐ | Technical context documented (if needed) | |
| ☐ | Protocols and channels specified | |

---

---

**🔗 Related Sections**

- [Section 5: Building Blocks](arc42_05_building_blocks.md) - Internal structure of the "black box"
- [Section 7: Deployment](arc42_07_deployment.md) - Technical infrastructure details

---

---

**📖 Further Reading**

- [arc42 Tips for Section 3](https://docs.arc42.org/section-3/)
- [C4 Model Context Diagram](https://c4model.com/#ContainerDiagram)
- [arc42 FAQ on Context](https://faq.arc42.org/category_c/#c-sec-3)
