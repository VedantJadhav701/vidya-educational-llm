import os
import torch

from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
)

from .config import MODEL_ID

print("=" * 70)
print("Loading Vidya 1.7B (Global Startup)")
print("=" * 70)
print(f"Model: {MODEL_ID}")

hf_token = os.environ.get("HF_TOKEN") or os.environ.get("HUGGING_FACE_HUB_TOKEN")

_tokenizer = AutoTokenizer.from_pretrained(
    MODEL_ID,
    token=hf_token,
    trust_remote_code=True,
)

# On Hugging Face ZeroGPU, we load using bfloat16/float16 and let spaces.GPU manage device placement
dtype = torch.bfloat16 if torch.cuda.is_available() else torch.float32

_model = AutoModelForCausalLM.from_pretrained(
    MODEL_ID,
    token=hf_token,
    torch_dtype=dtype,
    device_map="auto",
    trust_remote_code=True,
)

_model.eval()
print("✓ Vidya loaded and cached globally")


def get_model():
    return _tokenizer, _model
