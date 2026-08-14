import os
import torch

from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
)

from .config import MODEL_ID


_tokenizer = None
_model = None


def get_model():
    global _tokenizer
    global _model

    if _model is not None and _tokenizer is not None:
        return _tokenizer, _model

    print("=" * 70)
    print("Loading Vidya 1.7B")
    print("=" * 70)
    print(f"Model: {MODEL_ID}")

    hf_token = os.environ.get("HF_TOKEN") or os.environ.get("HUGGING_FACE_HUB_TOKEN")

    _tokenizer = AutoTokenizer.from_pretrained(
        MODEL_ID,
        token=hf_token,
        trust_remote_code=True,
    )

    if torch.cuda.is_available():
        dtype = torch.bfloat16
    else:
        dtype = torch.float32

    _model = AutoModelForCausalLM.from_pretrained(
        MODEL_ID,
        token=hf_token,
        torch_dtype=dtype,
        device_map="auto",
        trust_remote_code=True,
    )

    _model.eval()

    print("✓ Vidya loaded")

    return _tokenizer, _model
