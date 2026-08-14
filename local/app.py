"""
🎓 Vidya 1.7B — Local Desktop App
Runs entirely on your NVIDIA RTX 3050 GPU.
No internet needed after first model download.
"""

import os
import sys
import webbrowser
import threading

# Fix encoding on Windows stdout/stderr to prevent UnicodeEncodeError
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Fix OpenMP duplicate library issue on Windows
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

import torch
import gradio as gr
from transformers import AutoTokenizer, AutoModelForCausalLM

# ──────────────────────────────────────────────
# Configuration
# ──────────────────────────────────────────────

MODEL_ID = "vedantjadhav701/edu-qwen-1.7b-merged"
MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models", "edu-qwen-1.7b-merged")

MAX_NEW_TOKENS = 512
TEMPERATURE = 0.3
TOP_P = 0.9
REPETITION_PENALTY = 1.05

SYSTEM_PROMPT = """You are Vidya (विद्या), a multilingual educational AI assistant designed for Indian students (Classes 6-12, JEE, NEET, competitive exams). You follow NCERT and standard Indian curricula.

CORE RULES:
1. LANGUAGE: Always reply in the SAME language the student uses. Support Hindi, English, Marathi, Tamil, Telugu, Kannada, Bengali, Gujarati, Malayalam, Punjabi, Odia.
2. STRUCTURE: Use clear headings, bullet points, numbered steps, and formulas.
3. FORMULAS: Write math formulas in LaTeX notation wrapped in $ or $$ delimiters.
4. ACCURACY: Only provide factually correct, curriculum-aligned information.
5. TONE: Be encouraging, patient, and supportive like a favorite teacher.
6. DEPTH: Give thorough explanations with examples and real-world connections.
7. If a student asks something harmful, off-topic, or inappropriate, politely redirect them to educational topics."""

# ──────────────────────────────────────────────
# Model Loading
# ──────────────────────────────────────────────

_tokenizer = None
_model = None


def download_and_load_model():
    """Download model (first time only) and load onto GPU."""
    global _tokenizer, _model

    if _model is not None:
        return _tokenizer, _model

    hf_token = os.environ.get("HF_TOKEN") or os.environ.get("HUGGING_FACE_HUB_TOKEN")

    # Check if model is already downloaded locally
    if os.path.exists(os.path.join(MODEL_DIR, "model.safetensors")):
        print(f"[OK] Loading model from local cache: {MODEL_DIR}")
        model_path = MODEL_DIR
    else:
        print(f"[+] Downloading model: {MODEL_ID}")
        print(f"  This is a one-time download (~3.5 GB)...")
        print(f"  Saving to: {MODEL_DIR}")
        os.makedirs(MODEL_DIR, exist_ok=True)

        from huggingface_hub import snapshot_download
        model_path = snapshot_download(
            repo_id=MODEL_ID,
            local_dir=MODEL_DIR,
            token=hf_token,
        )
        print(f"[OK] Model downloaded to: {model_path}")

    print("Loading tokenizer...")
    _tokenizer = AutoTokenizer.from_pretrained(
        model_path,
        trust_remote_code=True,
    )

    # Use GPU with float16 for fast inference on RTX 3050 (4GB VRAM)
    device = "cuda" if torch.cuda.is_available() else "cpu"
    dtype = torch.float16 if device == "cuda" else torch.float32

    print(f"Loading model onto {device.upper()} ({dtype})...")
    _model = AutoModelForCausalLM.from_pretrained(
        model_path,
        torch_dtype=dtype,
        trust_remote_code=True,
    )
    _model = _model.to(device)
    _model.eval()

    if device == "cuda":
        vram_used = torch.cuda.memory_allocated() / 1024**3
        print(f"[OK] Model loaded 100% on GPU - VRAM used: {vram_used:.1f} GB")
    else:
        print("[OK] Model loaded on CPU")

    return _tokenizer, _model


# ──────────────────────────────────────────────
# Generation (Streaming)
# ──────────────────────────────────────────────

def generate_response(message: str, history: list):
    """Generate an educational response using streaming for real-time UI updates."""
    from transformers import TextIteratorStreamer
    from threading import Thread

    tokenizer, model = download_and_load_model()

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    # Add conversation history
    for item in history:
        if isinstance(item, dict):
            messages.append({"role": item["role"], "content": item["content"]})
        elif isinstance(item, (list, tuple)) and len(item) == 2:
            if item[0]:
                messages.append({"role": "user", "content": item[0]})
            if item[1]:
                messages.append({"role": "assistant", "content": item[1]})

    messages.append({"role": "user", "content": message})

    # Tokenize
    try:
        inputs = tokenizer.apply_chat_template(
            messages,
            tokenize=True,
            add_generation_prompt=True,
            return_tensors="pt",
        )
    except Exception:
        prompt_str = f"<|im_start|>system\n{SYSTEM_PROMPT}<|im_end|>\n"
        for m in messages[1:]:
            prompt_str += f"<|im_start|>{m['role']}\n{m['content']}<|im_end|>\n"
        prompt_str += "<|im_start|>assistant\n"
        inputs = tokenizer(prompt_str, return_tensors="pt")

    if isinstance(inputs, torch.Tensor):
        input_ids = inputs.to(model.device)
        attention_mask = None
    else:
        input_ids = inputs["input_ids"].to(model.device)
        attention_mask = inputs.get("attention_mask")
        if attention_mask is not None:
            attention_mask = attention_mask.to(model.device)

    # Set up streamer for real-time word-by-word updates
    streamer = TextIteratorStreamer(
        tokenizer, skip_prompt=True, skip_special_tokens=True
    )

    gen_kwargs = {
        "input_ids": input_ids,
        "max_new_tokens": MAX_NEW_TOKENS,
        "temperature": TEMPERATURE,
        "top_p": TOP_P,
        "repetition_penalty": REPETITION_PENALTY,
        "do_sample": True,
        "streamer": streamer,
    }
    if attention_mask is not None:
        gen_kwargs["attention_mask"] = attention_mask

    # Run generation in a separate thread so streamer yields live tokens
    thread = Thread(target=model.generate, kwargs=gen_kwargs)
    thread.start()

    partial_text = ""
    for new_text in streamer:
        partial_text += new_text

        # Live cleanup of thinking tags
        clean_text = partial_text
        if "<think>" in clean_text:
            clean_text = clean_text.split("<think>", 1)[0].strip()
        if "</think>" in clean_text:
            clean_text = clean_text.split("</think>", 1)[-1].strip()

        yield clean_text


# ──────────────────────────────────────────────
# Gradio UI
# ──────────────────────────────────────────────

CUSTOM_CSS = """
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* { font-family: 'Inter', sans-serif !important; }

.gradio-container {
    max-width: 900px !important;
    margin: 0 auto !important;
}

.header-banner {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
    border-radius: 16px;
    padding: 28px 32px;
    margin-bottom: 16px;
    text-align: center;
    color: white;
    border: 1px solid rgba(255,255,255,0.08);
}

.header-banner h1 {
    margin: 0 0 6px 0;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.5px;
}

.header-banner p {
    margin: 0;
    font-size: 14px;
    opacity: 0.7;
}

.status-chip {
    display: inline-block;
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    margin-top: 10px;
    border: 1px solid rgba(34, 197, 94, 0.25);
}

footer { display: none !important; }
"""

def respond(message: str, history: list):
    """ChatInterface streaming handler function."""
    if not message or not message.strip():
        return
    for chunk in generate_response(message.strip(), history):
        yield chunk


def create_app():
    """Create the Gradio chat interface using ChatInterface for maximum stability."""
    demo = gr.ChatInterface(
        fn=respond,
        title="🎓 Vidya — AI Learning Assistant",
        description="⚡ Running locally on your NVIDIA GPU • No internet needed • Unlimited & private",
        textbox=gr.Textbox(
            placeholder="Ask Vidya any question about Math, Science, Physics, Chemistry, Biology, History...",
            container=False,
            scale=7,
        ),
        chatbot=gr.Chatbot(
            height=520,
            avatar_images=(None, None),
            latex_delimiters=[
                {"left": "$$", "right": "$$", "display": True},
                {"left": "$", "right": "$", "display": False},
            ],
        ),
        examples=[
            "Explain Newton's Laws of Motion with real-world examples.",
            "Solve the quadratic equation: x² - 5x + 6 = 0 step by step.",
            "What is photosynthesis? Explain the light and dark reactions.",
            "प्रकाश संश्लेषण क्या है? समझाइए।",
        ],
        cache_examples=False,
    )
    return demo


# ──────────────────────────────────────────────
# Entry Point
# ──────────────────────────────────────────────

if __name__ == "__main__":
    print()
    print("=" * 60)
    print("  🎓 Vidya 1.7B — Local Desktop App")
    print("=" * 60)
    print()

    # Pre-load model before starting server
    download_and_load_model()

    print()
    print("Starting Vidya web interface...")
    print()

    app = create_app()

    # Open browser automatically after a short delay
    def open_browser():
        import time
        time.sleep(2)
        webbrowser.open("http://localhost:7860")

    threading.Thread(target=open_browser, daemon=True).start()

    app.launch(
        server_name="127.0.0.1",
        server_port=7860,
        share=False,
        inbrowser=False,  # We handle browser opening ourselves
        css=CUSTOM_CSS,
        theme=gr.themes.Soft(primary_hue="blue", neutral_hue="slate"),
    )
