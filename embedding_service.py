from sentence_transformers import SentenceTransformer
from flask import Flask, request, jsonify

# Load model locally (will download on first run)
model = SentenceTransformer("all-MiniLM-L6-v2")
app = Flask(__name__)

@app.route("/embed", methods=["POST"])
def embed():
    data = request.get_json()
    text = data.get("text", "")
    # Generate 384-dimensional embedding
    vec = model.encode(text).tolist()
    return jsonify(vec)

if __name__ == "__main__":
    print("Starting Embedding Service on port 8001...")
    # Use threaded=True for basic concurrency support during dev
    app.run(port=8001, debug=False, threaded=True)
