#!/usr/bin/env python3
from transformers import T5ForConditionalGeneration, T5Tokenizer
import sys

# Charger le modèle T5 et le tokenizer
model_name = "t5-large"  # "t5-small", "t5-base", "t5-large", "t5-3b", "t5-11b" sont aussi disponibles
model = T5ForConditionalGeneration.from_pretrained(model_name)
tokenizer = T5Tokenizer.from_pretrained(model_name, legacy=False)

def summarize(text, max_length=200, min_length=50):
    # Préparer l'entrée pour T5
    input_text = "summarize: " + text
    inputs = tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True)

    # Générer un résumé
    summary_ids = model.generate(
        inputs,
        max_length=max_length,
        min_length=min_length,
        length_penalty=2.0,
        num_beams=4,
        early_stopping=True,
    )

    # Décoder le résumé généré
    return tokenizer.decode(summary_ids[0], skip_special_tokens=True)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Erreur : Aucun texte fourni pour le résumé.")
        sys.exit(1)

    # Concaténer tout le texte passé en argument
    text_to_summarize = " ".join(sys.argv[1:])
    result = summarize(text_to_summarize)
    print(result)
