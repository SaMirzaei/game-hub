# Deployment View

> **Quick Summary**
> 
> **Purpose**: Describe the **technical infrastructure** where the system runs - servers, containers, networks, and how components are mapped to infrastructure.
> 
> **Key Questions**:
> - What infrastructure is needed?
> - How are building blocks mapped to infrastructure elements?
> - What are the network zones and communication paths?

---

---

**What to Document**

The deployment view describes:

1. **Technical infrastructure** - Physical/virtual hardware, network topology
2. **Component-to-infrastructure mapping** - Which building block runs where
3. **Environment specifics** - Development, staging, production differences

> **Important**: This view bridges the gap between software architecture and IT operations.

---

**Infrastructure Elements**

| Element | Description | Examples |
|---------|-------------|----------|
| **Nodes** | Physical or virtual machines | Server, VM, Container |
| **Execution Environments** | Runtime platforms | JVM, .NET CLR, Node.js |
| **Infrastructure Services** | Cloud/infra services | Load balancer, CDN, DNS |
| **Network Zones** | Security boundaries | DMZ, Internal, Database tier |
| **Artifacts** | Deployable units | Docker image, WAR, executable |

---

## Level 1: Infrastructure Overview

**Deployment Diagram**

```
┌─────────────────────────────────────────────────────────────────┐
│                     PRODUCTION ENVIRONMENT                       │
│                                                                  │
│  ┌─────────────┐                           ┌─────────────┐      │
│  │   Azure     │                           │   Azure     │      │
│  │   CDN       │                           │ Front Door  │      │
│  └──────┬──────┘                           └──────┬──────┘      │
│         │                                         │              │
│         │              ┌──────────────────────────┼──────────┐  │
│         │              │    Azure Kubernetes Service (AKS)   │  │
│         │              │                                     │  │
│         │              │  ┌─────────┐  ┌─────────┐  ┌─────┐  │  │
│         └─────────────►│  │ Web App │  │   API   │  │ Job │  │  │
│                        │  │ (3x)    │  │  (3x)   │  │ Pod │  │  │
│                        │  └────┬────┘  └────┬────┘  └──┬──┘  │  │
│                        │       │            │          │     │  │
│                        └───────┼────────────┼──────────┼─────┘  │
│                                │            │          │        │
│  ┌─────────────────────────────┼────────────┼──────────┼─────┐  │
│  │              Data Tier      │            │          │     │  │
│  │  ┌─────────────┐  ┌────────────────┐  ┌─────────────┐     │  │
│  │  │ PostgreSQL  │  │     Redis      │  │    Blob     │     │  │
│  │  │   (HA)      │  │   (Cluster)    │  │   Storage   │     │  │
│  │  └─────────────┘  └────────────────┘  └─────────────┘     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Level 2: Environment Details

**Infrastructure Node Template**

```markdown
## Node: [Node Name]

**Type**: Physical Server | VM | Container | Serverless

**Purpose**: [What runs on this node?]

**Specifications**:
- CPU: [cores/type]
- Memory: [size]
- Storage: [type/size]
- OS: [operating system]

**Network**: [Zone/subnet, IP ranges]

**Deployed Artifacts**:
| Artifact | Version | Port |
|----------|---------|------|
| [app.jar] | 1.2.3 | 8080 |

**Scaling**: [Manual | Auto-scaling rules]

**Monitoring**: [How is this node monitored?]
```

---

**Kubernetes Deployment Example**

```yaml
# deployment-diagram.yaml - simplified representation

# Namespace: production
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service
  namespace: production
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: api
        image: myregistry.azurecr.io/api:1.2.3
        resources:
          limits:
            memory: "512Mi"
            cpu: "500m"
        ports:
        - containerPort: 8080
```

**K8s Architecture Representation**

```
┌─────────────────────────────────────────────────────────────┐
│                 Kubernetes Cluster (AKS)                     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                Namespace: production                  │   │
│  │                                                       │   │
│  │   ┌─────────────────┐    ┌─────────────────┐         │   │
│  │   │  Deployment:    │    │  Deployment:    │         │   │
│  │   │  frontend       │    │  backend-api    │         │   │
│  │   │  replicas: 3    │    │  replicas: 3    │         │   │
│  │   └────────┬────────┘    └────────┬────────┘         │   │
│  │            │                      │                   │   │
│  │   ┌────────▼────────┐    ┌────────▼────────┐         │   │
│  │   │  Service:       │    │  Service:       │         │   │
│  │   │  frontend-svc   │    │  api-svc        │         │   │
│  │   │  ClusterIP      │    │  ClusterIP      │         │   │
│  │   └────────┬────────┘    └────────┬────────┘         │   │
│  │            │                      │                   │   │
│  │   ┌────────▼──────────────────────▼────────┐         │   │
│  │   │            Ingress Controller          │         │   │
│  │   │         (NGINX / Azure App GW)         │         │   │
│  │   └────────────────────────────────────────┘         │   │
│  │                                                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

**Environment Comparison**

| Aspect | Development | Staging | Production |
|--------|-------------|---------|------------|
| **Infrastructure** | Local Docker | AKS (1 node) | AKS (3 nodes) |
| **Database** | PostgreSQL (Docker) | Azure PostgreSQL (Basic) | Azure PostgreSQL (HA) |
| **Replicas** | 1 | 1 | 3 |
| **SSL** | Self-signed | Let's Encrypt | Azure-managed |
| **Monitoring** | Console logs | Basic metrics | Full observability |
| **Backup** | None | Daily | Continuous |

---

---

**📝 Tips and Best Practices**

| Tip | Description | Style |
|-----|-------------|-------|
| 7-1 | Show **all environments** (dev, staging, prod) | ⭐ Essential |
| 7-2 | **Map artifacts to nodes** explicitly | ⭐ Essential |
| 7-3 | Show **network zones** and boundaries | ⭐ Essential |
| 7-4 | Document **scaling approach** | ⭐ Essential |
| 7-5 | Include **external services** used | ⭐ Essential |
| 7-6 | Show **security boundaries** (firewalls, VPNs) | 📚 Thorough |
| 7-7 | Document **redundancy and HA** setup | 📚 Thorough |
| 7-8 | Include **infrastructure as code** references | 📚 Thorough |
| 7-9 | Show **data flow** through infrastructure | 📚 Thorough |
| 7-10 | Note **cost implications** of infrastructure choices | 📚 Thorough |

**Style Legend**: 🏃 Lean | ⭐ Essential | 📚 Thorough

---

**Infrastructure Documentation Template**

```markdown
## Deployment: [Environment Name]

### Overview Diagram
[Insert deployment diagram]

### Nodes

#### [Node Name 1]
- **Type**: [VM/Container/Serverless]
- **Specs**: [CPU, Memory, Storage]
- **Network**: [Zone, IP range]
- **Purpose**: [What runs here]

### Network Configuration
- **Ingress**: [Entry points, load balancers]
- **Egress**: [Outbound rules, NAT]
- **Internal**: [Service communication]

### External Services
| Service | Provider | Purpose | SLA |
|---------|----------|---------|-----|
| [Database] | Azure | Primary data store | 99.99% |

### Security
- **Firewall rules**: [Summary]
- **SSL/TLS**: [Certificate management]
- **Secrets**: [How secrets are managed]
```

---

---

**❌ Common Mistakes to Avoid**

**❌ Don't do this:**

1. Only showing production (forget dev/staging)
2. Missing network and security zones
3. No mapping between components and infrastructure
4. Ignoring scaling considerations
5. Not documenting external dependencies

**✅ Do this instead:**

1. Document all environments with differences
2. Clearly show network boundaries and security zones
3. Explicitly map each artifact to its deployment target
4. Explain scaling strategy (manual vs auto)
5. List all external services with SLAs

---

**✅ Deployment View Checklist**

| ✓ | Item | Status |
|---|------|--------|
| ☐ | All environments documented | |
| ☐ | Deployment diagrams created | |
| ☐ | Artifact-to-node mapping complete | |
| ☐ | Network topology described | |
| ☐ | External services listed | |
| ☐ | Scaling approach documented | |

---

---

**🔗 Related Sections**

- [Section 5: Building Blocks](arc42_05_building_blocks.md) - What gets deployed
- [Section 8: Concepts](arc42_08_concepts.md) - Infrastructure-related concepts
- [Section 11: Risks](arc42_11_risks.md) - Infrastructure risks

---

---

**📖 Further Reading**

- [arc42 Tips for Section 7](https://docs.arc42.org/section-7/)
- [C4 Model Deployment Diagrams](https://c4model.com/#DeploymentDiagram)
- [Infrastructure as Code](https://www.hashicorp.com/resources/what-is-infrastructure-as-code)
