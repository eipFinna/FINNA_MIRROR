#!/usr/bin/env python3
# src/backend/services/aiServer/aiAPI.py

import os
import logging
import time
from flask import Flask, request, jsonify
import re
from collections import Counter

# ONNX Runtime + optimal quantization
import onnxruntime as ort
from optimum.onnxruntime import ORTModelForSeq2SeqLM
from transformers import AutoTokenizer

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

# --- Configurations ---
MODEL_NAME     = "plguillou/t5-base-fr-sum-cnndm"
ONNX_QUANT_DIR = "./onnx-t5-base-fr-quant"  # chemin vers votre modèle ONNX quantifié

# --- Tokenizer ---
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

# --- ONNX Runtime session options ---
sess_options = ort.SessionOptions()
sess_options.intra_op_num_threads = os.cpu_count()
sess_options.inter_op_num_threads = os.cpu_count()

# Choisir CUDA si dispo, fallback CPU
providers = (
    ["CUDAExecutionProvider", "CPUExecutionProvider"]
    if "CUDAExecutionProvider" in ort.get_available_providers()
    else ["CPUExecutionProvider"]
)

# --- Chargement du modèle ONNX quantifié ---
model = ORTModelForSeq2SeqLM.from_pretrained(
    ONNX_QUANT_DIR,
    session_options=sess_options,
    providers=providers
)
logging.info("✅ Loaded ONNX Runtime quantized model from %s", ONNX_QUANT_DIR)

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


def summarize_chunk(
    chunk: str,
    max_length: int = 512,
    max_new_tokens: int = 80,
    num_beams: int = 2
) -> str:
    """Résume un seul chunk de texte en 2–3 phrases."""
    inputs = tokenizer(
        chunk,
        max_length=max_length,
        truncation=True,
        padding="max_length",
        return_tensors="pt"
    )
    summary_ids = model.generate(
        **inputs,
        num_beams=num_beams,
        max_new_tokens=max_new_tokens,
        length_penalty=2.0,
        no_repeat_ngram_size=3,
        early_stopping=True,
        return_dict_in_generate=False
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

    # 1) Chunking adaptatif : si court, un seul chunk
    max_chars = 1000
    if len(text) <= max_chars:
        chunks = [text]
    else:
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

    # 3) Résumé agrégé (on fait un seul appel de résumé final)
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

    t0 = time.time()
    app.logger.info(f"[BATCH] Reçu {len(texts)} textes")

    # 1) Chunking adaptatif pour tous
    all_chunks = []
    owners = []
    max_chars = 1000
    for idx, txt in enumerate(texts):
        if len(txt) <= max_chars:
            all_chunks.append(txt)
            owners.append(idx)
        else:
            for i in range(0, len(txt), max_chars):
                all_chunks.append(txt[i:i+max_chars])
                owners.append(idx)
    app.logger.info(f"[BATCH] {len(all_chunks)} chunks en {time.time()-t0:.2f}s")

    # 2) Batch tokenization + inference
    t1 = time.time()
    enc = tokenizer(
        all_chunks,
        max_length=512,
        truncation=True,
        padding="max_length",
        return_tensors="pt"
    )
    summary_ids = model.generate(
        **enc,
        num_beams=2,
        max_new_tokens=80,
        length_penalty=2.0,
        no_repeat_ngram_size=3,
        early_stopping=True,
        return_dict_in_generate=False
    )
    mini_summaries = [tokenizer.decode(g, skip_special_tokens=True)
                      for g in summary_ids]
    app.logger.info(f"[BATCH] 1st generate: {len(mini_summaries)} partials en {time.time()-t1:.2f}s")

    # 3) Regroupement par document
    aggregated = [[] for _ in texts]
    for summary, owner in zip(mini_summaries, owners):
        aggregated[owner].append(summary)
    final_inputs = [" ".join(parts) for parts in aggregated]

    # 4) Deuxième batch inference
    t2 = time.time()
    enc2 = tokenizer(
        final_inputs,
        max_length=512,
        truncation=True,
        padding="max_length",
        return_tensors="pt"
    )
    final_ids = model.generate(
        **enc2,
        num_beams=2,
        max_new_tokens=80,
        length_penalty=2.0,
        no_repeat_ngram_size=3,
        early_stopping=True,
        return_dict_in_generate=False
    )
    final_summaries = [tokenizer.decode(g, skip_special_tokens=True)
                       for g in final_ids]
    app.logger.info(f"[BATCH] 2nd generate: {len(final_summaries)} finals en {time.time()-t2:.2f}s")
    app.logger.info(f"[BATCH] Total duration: {time.time()-t0:.2f}s")

    return jsonify({"summaries": final_summaries})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
