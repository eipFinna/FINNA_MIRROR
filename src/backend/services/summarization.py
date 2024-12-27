#!/usr/bin/env python3
import sys

# from transformers import AutoTokenizer, BartForConditionalGeneration

# model = BartForConditionalGeneration.from_pretrained("facebook/bart-large-cnn")
# tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-cnn")

# ARTICLE_TO_SUMMARIZE = sys.argv[1]
# inputs = tokenizer([ARTICLE_TO_SUMMARIZE], return_tensors="pt")

# # Generate Summary
# summary_ids = model.generate(inputs["input_ids"], num_beams=32)
# output = tokenizer.batch_decode(summary_ids, skip_special_tokens=True, clean_up_tokenization_spaces=False)[0]

# print(output)

# ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# from transformers import pipeline

# summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# text = sys.argv[1]
# # summary = summarizer(text, max_length=50, min_length=25, do_sample=False)
# summary = summarizer(text, max_length=max(5, text.count(' ')//10), min_length=max(3, text.count(' ')//20), do_sample=False)
# print(summary[0]['summary_text'])

# ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


import os

# Rediriger temporairement la sortie standard pour identifier les prints
original_stdout = sys.stdout
sys.stdout = open(os.devnull, 'w')

# Importer les modules
import spacy
import pytextrank
from rake_nltk import Rake
from nltk.corpus import stopwords

# Restaurer la sortie standard après les imports
sys.stdout = original_stdout
# Charger le modèle SpaCy avec TextRank
nlp = spacy.load("fr_core_news_md")  # Utilisez le modèle français
nlp.add_pipe("textrank")

# Configurer RAKE avec une liste de stop-words française
rake = Rake(language="french")

# Stop-words personnalisés
custom_stopwords = set(stopwords.words("french") + [
    "avoir", "être", "faire", "aller", "venir", "dire", "voir", "savoir",
    "pouvoir", "falloir", "devoir", "vouloir", "prendre"
])

def summarize_and_extract_keywords(text):
    # Traitez le texte avec le pipeline SpaCy
    doc = nlp(text)

    # Générer un résumé avec TextRank
    summary = " ".join([sentence.text for sentence in doc._.textrank.summary(limit_phrases=1, limit_sentences=3)])

    # Extraire les mots-clés avec RAKE
    rake.extract_keywords_from_text(text)
    rake_keywords = [
        phrase for phrase in rake.get_ranked_phrases()[:10]
        if not any(word in custom_stopwords for word in phrase.split())
    ]

    # # Extraire les mots-clés avec TextRank et SpaCy (filtrer par POS)
    # spacy_keywords = []
    # for phrase in doc._.phrases[:10]:  # Prendre les 10 meilleures phrases par score
    #     for token in nlp(phrase.text):
    #         if token.pos_ in {"NOUN", "PROPN", "ADJ"} and token.text.lower() not in custom_stopwords:
    #             spacy_keywords.append(token.text.lower())

    # Fusionner et supprimer les doublons tout en conservant l'ordre
    combined_keywords = list(dict.fromkeys(rake_keywords)) # + spacy_keywords)) # Fusionner les deux listes de mots-clés a voir

    return summary, combined_keywords

if __name__ == "__main__":
    # Récupérer le texte depuis les arguments de la ligne de commande
    if len(sys.argv) < 2:
        print("Veuillez fournir un texte à résumer.")
        sys.exit(1)

    text_to_process = sys.argv[1]

    # Résumer et extraire les mots-clés
    summary, keywords = summarize_and_extract_keywords(text_to_process)

    # Afficher le résumé et les mots-clés
    # print("Résumé :")
    # print(summary)
    # print("\nMots-clés :")
    print(" ".join(keywords))  # Affichez les mots-clés sans répétition
