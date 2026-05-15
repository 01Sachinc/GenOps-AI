# GenOps AI Platform Architecture

## Cloud-Native Infrastructure

```mermaid
graph TD
    subgraph "External"
        User((User))
        GH[GitHub Repo]
    end

    subgraph "CI/CD Pipeline"
        GA[GitHub Actions]
        JK[Jenkins]
        TR[Trivy Security Scan]
        DH[Docker Hub]
    end

    subgraph "Kubernetes Cluster (EKS)"
        IG[Ingress Nginx]
        
        subgraph "Application Layer"
            FE[React Frontend]
            BE[Spring Boot WebFlux]
        end

        subgraph "Data & AI Layer"
            PG[(PostgreSQL + PGVector)]
            RD[(Redis Memory)]
            VL[vLLM Inference]
        end

        subgraph "Observability"
            PR[Prometheus]
            GR[Grafana]
        end
    end

    User --> IG
    IG --> FE
    FE --> BE
    BE --> PG
    BE --> RD
    BE --> VL
    
    GH --> GA
    GH --> JK
    GA --> DH
    JK --> DH
    DH --> Application Layer
    
    PR --> BE
    GR --> PR
```

## RAG Pipeline Flow

1.  **Ingestion**: User uploads PDF via Frontend.
2.  **Processing**: Backend parses PDF using Apache Tika.
3.  **Embedding**: Text chunks are converted to vectors using HuggingFace models.
4.  **Storage**: Vectors and metadata are stored in PGVector.
5.  **Retrieval**: During chat, the system performs a similarity search.
6.  **Augmentation**: Top-K context snippets are injected into the LLM prompt.
