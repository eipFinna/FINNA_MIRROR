#!/usr/bin/env python3

from transformers import AutoTokenizer, BartForConditionalGeneration

model = BartForConditionalGeneration.from_pretrained("facebook/bart-large-cnn")
tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-cnn")

ARTICLE_TO_SUMMARIZE = (
    "\"Nous avons retrouvé Panga\", écrivent sur leur compte Facebook les éleveurs du Groupement agricole d'exploitation en commun du nid, au Chambon-sur-Lignon (Haute-Loire). \"Elle a parcouru plusieurs kilomètres avant de finir dans un pré juste avant Tence\", ajoutent-ils dans un message accompagné d'une photo de la carcasse de l'animal, camouflée par un émoji. "
    "Panga faisait partie d'un troupeau de cinq vaches qui avaient été prises par les eaux du Lignon, entré dans une crue historique au plus fort des inondations, jeudi. \"Elles ont été encerclées par le Lignon. Il y avait au moins 1,50 mètre d'eau sur la parcelle avec un fort courant\", a précisé Etienne Valla, le propriétaire du cheptel, dans une vidéo du quotidien local Le Progrès(Nouvelle fenêtre). \"Quatre se sont sauvées sur les rives et la cinquième [Panga] est partie en divagation\", a-t-il ajouté."
)
inputs = tokenizer([ARTICLE_TO_SUMMARIZE], return_tensors="pt")

# Generate Summary
summary_ids = model.generate(inputs["input_ids"], num_beams=16)
output = tokenizer.batch_decode(summary_ids, skip_special_tokens=True, clean_up_tokenization_spaces=False)[0]

print(output)