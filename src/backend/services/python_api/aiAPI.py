#!/usr/bin/env python3
# src/backend/services/aiServer/aiAPI.py

import os
from flask import Flask, request, jsonify
import logging
import re
from collections import Counter

# ONNX Runtime + optimal quantization
from optimum.onnxruntime import ORTModelForSeq2SeqLM
from transformers import AutoTokenizer

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

# --- Chargement du tokenizer et du modèle ONNX quantifié ---
MODEL_NAME = "plguillou/t5-base-fr-sum-cnndm"
TOKENIZER_NAME = MODEL_NAME
ONNX_QUANT_DIR = "./onnx-t5-base-fr-quant"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model     = ORTModelForSeq2SeqLM.from_pretrained(ONNX_QUANT_DIR)

logging.info("Loaded ONNX Runtime quantized model from %s", ONNX_QUANT_DIR)

# --- Stopwords français (liste réduite) ---
STOPWORDS = {
    "le", "la", "les", "un", "une", "des", "du", "de", "et", "à", "en",
    "pour", "sur", "par", "avec", "dans", "que", "qui", "au", "aux",
    "est", "ce", "se", "elle", "il", "ils", "elles", "ne", "pas", "plus",
    "ou", "où", "sa", "son", "ses", "mes", "tes", "nos", "votres",
    "leur", "leurs", "du", "au", "«", "»"
}

def extract_keywords(text: str, top_n: int = 5) -> list[str]:
    words = re.findall(r"\w+", text.lower(), flags=re.UNICODE)
    filtered = [
        w for w in words
        if len(w) > 3 and not w.isdigit() and w not in STOPWORDS
    ]
    counts = Counter(filtered)
    return [w for w, _ in counts.most_common(top_n)]

def summarize_chunk(chunk: str) -> str:
    # Tokenize (batch of size 1) with padding/truncation
    inputs = tokenizer(
        chunk,
        max_length=1024,
        truncation=True,
        padding="max_length",
        return_tensors="pt"  # ONNX Runtime uses numpy arrays
    )
    # Generate summary with ONNX Runtime
    summary_ids = model.generate(
        **inputs,
        num_beams=2,          # on baisse le beam pour la vitesse
        max_new_tokens=80,    # découpe plus courte
        early_stopping=True
    )
    return tokenizer.decode(summary_ids[0], skip_special_tokens=True)

@app.route("/keywords", methods=["POST"])
def keywords_route():
    data = request.get_json(force=True)
    text = data.get("text", "")
    if not text or not isinstance(text, str):
        return jsonify({"error": 'Paramètre "text" manquant ou invalide'}), 400
    keywords = extract_keywords(text, top_n=5)
    return jsonify({"keywords": keywords})

@app.route("/summarize", methods=["POST"])
def summarize_route():
    data = request.get_json(force=True)
    text = data.get("text", "")
    if not text or not isinstance(text, str):
        return jsonify({"error": 'Paramètre "text" manquant ou invalide'}), 400

    # 1) Chunking
    max_chars = 1000
    chunks = [text[i:i+max_chars] for i in range(0, len(text), max_chars)]

    # 2) Mini-résumés
    partials = []
    for idx, chunk in enumerate(chunks):
        try:
            partials.append(summarize_chunk(chunk))
        except Exception as e:
            app.logger.error(f"Erreur sur chunk #{idx}: {e}", exc_info=True)

    if not partials:
        return jsonify({"error": "Impossible de résumer les chunks"}), 500

    # 3) Résumé agrégé
    aggregate = " ".join(partials)
    try:
        final_summary = summarize_chunk(aggregate)
    except Exception as e:
        app.logger.error(f"Erreur résumé final: {e}", exc_info=True)
        return jsonify({"error": "Erreur lors du résumé final"}), 500

    return jsonify({"summary": final_summary})

@app.route("/batch_summarize", methods=["POST"])
def batch_summarize_route():
    data = request.get_json(force=True)
    texts = data.get("texts", [])
    if not isinstance(texts, list) or any(not isinstance(t, str) for t in texts):
        return jsonify({"error": 'Paramètre "texts" manquant ou invalide'}), 400

    import time
    t0 = time.time()
    app.logger.info(f"[BATCH] Reçu {len(texts)} textes")

    # 1) Chunking
    all_chunks = []
    owners = []
    max_chars = 1000
    for idx, txt in enumerate(texts):
        for i in range(0, len(txt), max_chars):
            all_chunks.append(txt[i:i+max_chars])
            owners.append(idx)
    app.logger.info(f"[BATCH] {len(all_chunks)} chunks (en {time.time()-t0:.2f}s)")

    # 2) Batch tokenization + inference
    t1 = time.time()
    inputs = tokenizer(
        all_chunks,
        max_length=1024,
        truncation=True,
        padding="max_length",
        return_tensors="pt"
    )
    summary_ids = model.generate(
        **inputs,
        num_beams=4,
        max_new_tokens=80,
        early_stopping=True
    )
    mini_summaries = [tokenizer.decode(g, skip_special_tokens=True)
                      for g in summary_ids]
    app.logger.info(f"[BATCH] 1st generate: {len(mini_summaries)} partials in {time.time()-t1:.2f}s")

    # 3) Regroupement
    aggregated_texts = [[] for _ in texts]
    for summary, owner in zip(mini_summaries, owners):
        aggregated_texts[owner].append(summary)
    final_inputs = [" ".join(parts) for parts in aggregated_texts]

    # 4) Deuxième batch inference
    t2 = time.time()
    inputs2 = tokenizer(
        final_inputs,
        max_length=1024,
        truncation=True,
        padding="max_length",
        return_tensors="pt"
    )
    final_ids = model.generate(
        **inputs2,
        num_beams=4,
        max_new_tokens=80,
        early_stopping=True
    )
    final_summaries = [tokenizer.decode(g, skip_special_tokens=True)
                       for g in final_ids]
    app.logger.info(f"[BATCH] 2nd generate: {len(final_summaries)} finals in {time.time()-t2:.2f}s")
    app.logger.info(f"[BATCH] Total duration: {time.time()-t0:.2f}s")

    return jsonify({"summaries": final_summaries})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
