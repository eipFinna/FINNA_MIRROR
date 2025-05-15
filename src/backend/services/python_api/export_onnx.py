#!/usr/bin/env python3
# export_onnx.py

from pathlib import Path
from optimum.onnxruntime import ORTModelForSeq2SeqLM, ORTQuantizer
from optimum.onnxruntime.configuration import AutoQuantizationConfig

# ————— Paramètres —————
MODEL_NAME   = "plguillou/t5-base-fr-sum-cnndm"
EXPORT_DIR   = Path("./onnx-t5-base-fr")  # dossier de sortie
QUANT_DIR    = Path("./onnx-t5-base-fr-quant")  # dossier de sortie quantifié
EXPORT_DIR.mkdir(exist_ok=True)
QUANT_DIR.mkdir(exist_ok=True)

# ————— 1) Export vanilla —————
print(f"➡️  Export ONNX initial dans {EXPORT_DIR} …")
ort_model = ORTModelForSeq2SeqLM.from_pretrained(
    MODEL_NAME,
    export=True           # génère plusieurs .onnx dans EXPORT_DIR
)
ort_model.save_pretrained(EXPORT_DIR)
print("✅ Export ONNX terminé.")

# ————— 2) Quantification DYNAMIQUE de chaque fichier —————
print(f"➡️  Quantification dynamique dans {QUANT_DIR} …")
# config quant dynamique 8-bit
dqconfig = AutoQuantizationConfig.avx512_vnni(
    is_static=False,
    per_channel=False
)

# pour chaque fichier .onnx produit par l’export
for onnx_path in EXPORT_DIR.glob("*.onnx"):
    print(f"   • Quantification de {onnx_path.name} …")
    quantizer = ORTQuantizer.from_pretrained(
        EXPORT_DIR,
        file_name=onnx_path.name
    )
    quantizer.quantize(
        save_dir=str(QUANT_DIR),
        quantization_config=dqconfig
    )

print("✅ Quantification ONNX dynamique terminée pour tous les fichiers.")
