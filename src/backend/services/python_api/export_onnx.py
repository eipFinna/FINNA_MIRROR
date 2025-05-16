#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""export_onnx.py – Finna
====================================

Script CLI pour **exporter** un modèle Hugging Face *seq2seq* en **ONNX** puis
autant que souhaité **quantifier dynamiquement** le graph pour accélérer
d’inférence. Il s’aligne sur la nouvelle API FastAPI (aiAPI.py) :

* export toujours en **opset 17** compatible ORT >= 1.17 ;
* nom de provider passé en option — utile si vous testez la validation (GPU,
  OpenVINO, etc.) ;
* sauvegarde dans un dossier prêt à être chargé par
  `ORTModelForSeq2SeqLM.from_pretrained(...)` (tokenizer + model.onnx).

Usage rapide :
--------------
```bash
python3 export_onnx.py --model plguillou/t5-base-fr-sum-cnndm --output onnx-t5-base-fr-quant --quantize
```

Options avancées :
------------------
```
--optimize           # passe onnx-simplifier + fusion ORT
--provider CUDAExecutionProvider|OpenVINOExecutionProvider|CPUExecutionProvider
--openvino           # exporte en IR OpenVINO (créera dossier openvino_model/)
--max-length 1024    # longueur max des séquences d’entrée pour le tracer
```
"""
from __future__ import annotations

import argparse
import os
import time
from pathlib import Path

from optimum.onnxruntime import ORTModelForSeq2SeqLM
from optimum.onnxruntime.configuration import AutoQuantizationConfig
from transformers import AutoTokenizer
from optimum.onnxruntime import ORTQuantizer
# from optimum.exporters import openvino as ov_export


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _print(msg: str):
    print(f"\033[92m[export_onnx] {msg}\033[0m")


# ---------------------------------------------------------------------------
# Main export routine
# ---------------------------------------------------------------------------

def export_model(
    model_name: str,
    output_dir: Path,
    quantize: bool = False,
    # optimize: bool = False,
    provider: str = "CPUExecutionProvider",
    openvino: bool = False,
    max_length: int = 1024,
) -> None:
    """Export a Transformers seq2seq model to ONNX and (optionally) INT8."""

    output_dir.mkdir(parents=True, exist_ok=True)
    t0 = time.time()

    _print("Chargement et export ONNX…")
    _print(f"  - modèle : {model_name}")
    _print(f"  - sortie : {output_dir}")
    model = ORTModelForSeq2SeqLM.from_pretrained(
        model_name,
        export=True,
        provider=provider,
    )

    if quantize:
        _print("Quantification dynamique INT8…")
        qconfig = AutoQuantizationConfig.avx512_vnni(is_static=False)
        # Lister tous les fichiers ONNX du dossier, ignorer ceux déjà quantifiés
        onnx_files = [f for f in output_dir.glob("*.onnx") if "quantized" not in f.name]
        for onnx_path in onnx_files:
            _print(f"  - Quantification de {onnx_path.name}")
            quantizer = ORTQuantizer.from_pretrained(
                model,
                file_name=onnx_path
            )
            quantizer.quantize(
                save_dir=output_dir,
                quantization_config=qconfig,
            )
        # Recharger le modèle quantifié pour la suite du pipeline
        # model = ORTModelForSeq2SeqLM.from_pretrained(output_dir)

    # if optimize:                                                       #### /!\ Marche pas /!\ ####
    #     _print("Optimisation ORT graph…")
    #     from optimum.onnxruntime import ORTOptimizer
    #     optimizer = ORTOptimizer.from_pretrained(model)
    #     optimization_config = optimizer.get_default_config()
    #     optimizer.optimize(
    #         save_dir=output_dir,
    #         optimization_config=optimization_config
    #     )
    #     # Reload the optimized model for further steps
    #     model = ORTModelForSeq2SeqLM.from_pretrained(output_dir, provider=provider)

    _print("Sauvegarde du modèle ONNX…")
    model.save_pretrained(output_dir)
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    tokenizer.save_pretrained(output_dir)

    # Supprimer les fichiers quantifiés existants pour éviter SameFileError
    for f in output_dir.glob("*_quantized.onnx"):
        try:
            os.remove(f)
        except Exception as e:
            _print(f"Erreur lors de la suppression de {f}: {e}")

    # if openvino:
    #     try:
    #         _print("Export vers IR OpenVINO…")
    #         ov_export.export(
    #             model_path_or_name=output_dir,
    #             output=output_dir / "openvino_model",
    #             task="text2text-generation",
    #             input_shape=(1, max_length),
    #         )
    #     except ImportError:
    #         _print("openvino-dev n’est pas installé – export IR ignoré.")

    _print(f"Terminé en {time.time() - t0:.1f}s – dossier prêt : {output_dir}")

# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def parse_args() -> argparse.Namespace:  # noqa: D401
    p = argparse.ArgumentParser(description="Export Transformers seq2seq → ONNX")
    p.add_argument("--model", required=True, help="Nom ou chemin du modèle HF")
    p.add_argument("--output", required=True, help="Répertoire de sortie")
    p.add_argument("--quantize", action="store_true", help="INT8 dynamique")
    # p.add_argument("--optimize", action="store_true", help="Optimise le graph")
    p.add_argument(
        "--provider",
        default="CPUExecutionProvider",
        help="Provider ORT à tester (CPU, CUDAExecutionProvider, …)",
    )
    # p.add_argument("--openvino", action="store_true", help="Export IR OpenVINO") # pas sur de garder l'option car je ne l'utilise pas dans aiAPI.py
    p.add_argument("--max-length", type=int, default=1024, help="Max tokens entrée")
    return p.parse_args()


if __name__ == "__main__":
    args = parse_args()
    export_model(
        model_name=args.model,
        output_dir=Path(args.output),
        quantize=args.quantize,
        # optimize=args.optimize,
        provider=args.provider,
        # openvino=args.openvino,
        max_length=args.max_length,
    )