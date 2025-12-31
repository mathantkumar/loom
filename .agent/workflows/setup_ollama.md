---
description: How to install and configure Ollama for local LLM inference
---

# Setup Ollama on macOS

1. **Install via Homebrew**:
   ```bash
   brew install ollama
   ```
   *(If you don't have Homebrew, download from [ollama.com](https://ollama.com/download))*

2. **Start the Service**:
   Open a terminal and run:
   ```bash
   ollama serve
   ```
   *Keep this terminal open.*

3. **Pull the Model**:
   Open a **new** terminal tab/window and run:
   ```bash
   ollama pull mistral
   ```
   *This will download the ~4GB model.*

4. **Verify**:
   Run a simple test:
   ```bash
   curl -d '{"model": "mistral", "prompt": "hi", "stream": false}' http://localhost:11434/api/generate
   ```
