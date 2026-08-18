"""Download the Vidya model for local use."""
import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

from huggingface_hub import snapshot_download

MODEL_ID = "vedantjadhav701/edu-qwen-1.7b-merged"
MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models", "edu-qwen-1.7b-merged")

if os.path.exists(os.path.join(MODEL_DIR, "model.safetensors")):
    size_gb = os.path.getsize(os.path.join(MODEL_DIR, "model.safetensors")) / 1024**3
    print(f"✓ Model already downloaded! ({size_gb:.1f} GB)")
    print(f"  Location: {MODEL_DIR}")
else:
    print(f"⬇ Downloading: {MODEL_ID}")
    print(f"  This is a one-time download (~3.5 GB)...")
    os.makedirs(MODEL_DIR, exist_ok=True)
    snapshot_download(
        repo_id=MODEL_ID,
        local_dir=MODEL_DIR,
    )
    print(f"✓ Download complete!")
    print(f"  Saved to: {MODEL_DIR}")
