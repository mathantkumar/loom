# Sentinel

## Incident Intelligence Module Setup

### Prerequisites
1. **Ollama**: Ensure Ollama is installed and running.
   ```bash
   ollama serve
   ```
   Verify it's running:
   ```bash
   ollama list
   ```
   Pull required models:
   ```bash
   ollama pull mixtral
   ollama pull nomic-embed-text
   ```

### Running the Application
Run the Spring Boot application using Maven:
```bash
mvn spring-boot:run
```

### Testing the API
You can test the incident query endpoint using `curl`:

```bash
curl -X POST http://localhost:8080/api/v1/incident/query \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What happened during the database outage?"
  }'
```

Health check:
```bash
curl http://localhost:8080/api/v1/incident/health
```