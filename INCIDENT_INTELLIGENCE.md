# Incident Intelligence Module

This module provides a production-ready RAG (Retrieval Augmented Generation) pipeline for querying incident data using a local LLM (Ollama).

## Features
- **Vector Search**: Uses `HNSW` (Hierarchical Navigable Small World) for fast, persistent similarity search (Pure Java).
- **Local AI**: Connects to Ollama for privacy-first, offline inference.
- **Ingestion Pipeline**: Automatically chunks and indexes JSON incident logs.
- **REST API**: Simple endpoint to ask questions and get cited answers.

## Prerequisites
1. **Ollama**: Must be installed and running.
   ```bash
   ollama serve
   ```
2. **Models**:
   ```bash
   ollama pull mixtral
   ollama pull nomic-embed-text
   ```

## Getting Started

### 1. Ingest Data
Drop your incident JSON files into `src/main/resources/incidents/`.
Format:
```json
[
  {
    "id": "1",
    "source": "ticket",
    "title": "Database Latency",
    "text": "Postgres connection pool exhaustion caused 500 errors...",
    "created": "2023-10-01",
    "tags": ["db", "latency"]
  }
]
```

Run the ingestion utility:
```bash
# Provide the IngestionRunner class to existing classpath or run via Spring Boot profile if configured
# For now, rely on standard Spring Boot startup scanning it if it's a Component, 
# OR run the provided main class via IDE.
```
*Note: The `IngestionRunner` is a `@Component` implementing `CommandLineRunner`. It will run automatically when you start the full Spring Boot app, scanning for files.*

### 2. Run the Server
```bash
mvn spring-boot:run
```

### 3. Query
```bash
curl -X POST http://localhost:8080/api/v1/incident/query \
     -H "Content-Type: application/json" \
     -d '{
           "question": "What caused the database latency?",
           "stream": false
         }'
```

## Configuration
See `application.yml`:
- `ollama.base-url`: Default `http://127.0.0.1:11434`
- `retrieval.top-k`: Default 5 chunks.
