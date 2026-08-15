"""
🎓 Vidya 1.7B — Futuristic Neural Network Desktop Interface
Featuring:
- Interactive Neural Network Canvas Synapse Particles (3D Cyber Intro)
- Flicker-Free Smooth Token Streaming (~35ms batched DOM rendering)
- Multi-byte Indic UTF-8 preservation (Devanagari, Tamil, Telugu, Bengali, Urdu)
- 4 Pedagogical Modes (NCERT, JEE/NEET, Elementary, Interactive Quiz)
"""

import os
import sys
import time
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
# Model Configuration & Path Setup
# ──────────────────────────────────────────────

MODEL_ID = "vedantjadhav701/edu-qwen-1.7b-merged"
MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models", "edu-qwen-1.7b-merged")

_tokenizer = None
_model = None


def download_and_load_model():
    """Download model (first time only) and load onto local GPU."""
    global _tokenizer, _model

    if _model is not None:
        return _tokenizer, _model

    hf_token = os.environ.get("HF_TOKEN") or os.environ.get("HUGGING_FACE_HUB_TOKEN")

    if os.path.exists(os.path.join(MODEL_DIR, "model.safetensors")):
        print(f"[OK] Loading model from local directory: {MODEL_DIR}")
        model_path = MODEL_DIR
    else:
        print(f"[+] Downloading model: {MODEL_ID}")
        print(f"  Saving to local directory: {MODEL_DIR}")
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

    device = "cuda" if torch.cuda.is_available() else "cpu"
    dtype = torch.float16 if device == "cuda" else torch.float32

    print(f"Loading Vidya 1.7B model onto {device.upper()} ({dtype})...")
    _model = AutoModelForCausalLM.from_pretrained(
        model_path,
        torch_dtype=dtype,
        device_map="cuda:0" if device == "cuda" else None,
        trust_remote_code=True,
    )
    _model.eval()

    if device == "cuda":
        vram_used = torch.cuda.memory_allocated() / 1024**3
        print(f"[OK] Model loaded 100% on GPU — VRAM used: {vram_used:.1f} GB")
    else:
        print("[OK] Model loaded on CPU")

    return _tokenizer, _model


# ──────────────────────────────────────────────
# Pedagogical System Prompts
# ──────────────────────────────────────────────

SYSTEM_PROMPTS = {
    "👨‍🏫 NCERT School Tutor (Class 6-12)": """You are Vidya (विद्या), a multilingual educational AI assistant designed for Indian students (Classes 6-12). You follow NCERT and standard Indian curricula.
CORE RULES:
1. STRICT LANGUAGE MATCHING: Always reply in the EXACT SAME LANGUAGE as the user's prompt. If the user asks in English, reply ONLY in English. If the user asks in Hindi/Devanagari, reply ONLY in Hindi. If the user asks in Marathi/Tamil/Telugu/Gujarati/Bengali/Urdu/Maithili, reply strictly in that language.
2. STRUCTURE: Use clear headings, bullet points, numbered steps, and formulas.
3. FORMULAS: Write math formulas in LaTeX notation wrapped in $ or $$ delimiters.
4. ACCURACY: Only provide factually correct, curriculum-aligned information.
5. TONE: Be encouraging, patient, and supportive like a favorite teacher.
6. DEPTH: Give complete, detailed explanations with examples and real-world connections. Do not stop midway.""",

    "🚀 JEE / NEET Exam Prep Mode": """You are Vidya (विद्या) in JEE/NEET Competitive Exam Mode. You provide rigorous, high-level problem-solving guidance for Indian entrance exams (JEE Main, JEE Advanced, NEET, KVPY).
CORE RULES:
1. STRICT LANGUAGE MATCHING: Reply strictly in the user's prompt language.
2. RIGOR: Provide complete step-by-step mathematical proofs, physical derivations, chemical balancing, shortcuts, and key conceptual pitfalls.
3. FORMULAS: Use precise LaTeX math notation ($/$$).
4. TIPS: Include "JEE/NEET Exam Strategy Tip" at the end of your response.""",

    "👶 Simple Tutor Mode (Class 1-5)": """You are Vidya (विद्या) in Simple Tutor Mode for younger elementary students (Classes 1-5).
CORE RULES:
1. STRICT LANGUAGE MATCHING: Reply strictly in the user's prompt language.
2. SIMPLICITY: Use short sentences, simple words, friendly emojis, and easy real-world analogies (like toys, fruits, playground physics).
3. ENCOURAGEMENT: Praise the student for asking great questions!""",

    "🧪 Interactive Quiz Tutor": """You are Vidya (विद्या) in Interactive Quiz Master Mode.
CORE RULES:
1. STRICT LANGUAGE MATCHING: Reply strictly in the user's prompt language.
2. EXPLANATION: Briefly explain the core educational topic requested by the student (2-3 paragraphs).
3. QUIZ: End your response with 2 interactive multiple-choice practice questions (A, B, C, D) to test the student's understanding and ask them to choose the correct answer!"""
}


# ──────────────────────────────────────────────
# Indic Token Streamer
# ──────────────────────────────────────────────

class IndicTokenStreamer:
    """Queue-based streamer that yields accumulated generated token IDs to preserve multi-byte Indic UTF-8 characters."""
    def __init__(self, tokenizer):
        self.tokenizer = tokenizer
        from queue import Queue
        self.queue = Queue()

    def put(self, value):
        if len(value.shape) > 1:
            value = value[0]
        for t in value.tolist():
            self.queue.put(t)

    def end(self):
        self.queue.put(None)


def generate_response_stream(message: str, history: list, mode_name: str, temperature: float, top_p: float, max_tokens: int):
    """Generate educational response with smooth, flicker-free batched streaming (~35ms updates)."""
    tokenizer, model = download_and_load_model()

    system_prompt = SYSTEM_PROMPTS.get(mode_name, SYSTEM_PROMPTS["👨‍🏫 NCERT School Tutor (Class 6-12)"])
    messages = [{"role": "system", "content": system_prompt}]

    # Reconstruct chat history
    for item in history:
        if isinstance(item, dict):
            messages.append({"role": item["role"], "content": item["content"]})
        elif isinstance(item, (list, tuple)) and len(item) == 2:
            if item[0]:
                messages.append({"role": "user", "content": item[0]})
            if item[1]:
                messages.append({"role": "assistant", "content": item[1]})

    messages.append({"role": "user", "content": message})

    # Tokenize input
    try:
        encoded = tokenizer.apply_chat_template(
            messages,
            tokenize=True,
            add_generation_prompt=True,
            return_dict=True,
            return_tensors="pt",
        )
        if isinstance(encoded, torch.Tensor):
            input_ids = encoded.to(model.device)
            attention_mask = None
        elif isinstance(encoded, dict):
            raw_ids = encoded["input_ids"]
            input_ids = raw_ids.to(model.device) if isinstance(raw_ids, torch.Tensor) else torch.tensor([raw_ids], device=model.device)
            raw_mask = encoded.get("attention_mask")
            attention_mask = raw_mask.to(model.device) if isinstance(raw_mask, torch.Tensor) else (torch.tensor([raw_mask], device=model.device) if raw_mask is not None else None)
        elif hasattr(encoded, "input_ids"):
            input_ids = encoded.input_ids.to(model.device)
            raw_mask = getattr(encoded, "attention_mask", None)
            attention_mask = raw_mask.to(model.device) if raw_mask is not None else None
    except Exception:
        prompt_str = f"<|im_start|>system\n{system_prompt}<|im_end|>\n"
        for m in messages[1:]:
            prompt_str += f"<|im_start|>{m['role']}\n{m['content']}<|im_end|>\n"
        prompt_str += "<|im_start|>assistant\n"
        inputs = tokenizer(prompt_str, return_tensors="pt")
        input_ids = inputs["input_ids"].to(model.device)
        attention_mask = inputs.get("attention_mask")
        if attention_mask is not None:
            attention_mask = attention_mask.to(model.device)

    streamer = IndicTokenStreamer(tokenizer)

    gen_kwargs = {
        "input_ids": input_ids,
        "max_new_tokens": int(max_tokens),
        "temperature": float(temperature),
        "top_p": float(top_p),
        "repetition_penalty": 1.0,
        "do_sample": True if temperature > 0.05 else False,
        "streamer": streamer,
    }
    if attention_mask is not None:
        gen_kwargs["attention_mask"] = attention_mask

    def generate_worker():
        with torch.inference_mode():
            model.generate(**gen_kwargs)

    from threading import Thread
    thread = Thread(target=generate_worker)
    thread.start()

    generated_token_ids = []
    last_yield_time = time.time()
    pending_tokens = 0

    while True:
        token_id = streamer.queue.get()
        if token_id is None:
            # Yield final text on complete token stream
            if pending_tokens > 0:
                text = tokenizer.decode(generated_token_ids, skip_special_tokens=True)
                clean_text = text
                if "</think>" in clean_text:
                    clean_text = clean_text.split("</think>", 1)[-1].strip()
                elif "<think>" in clean_text:
                    clean_text = ""
                yield clean_text
            break

        generated_token_ids.append(token_id)
        pending_tokens += 1

        # Smooth Token Batching: Yield every ~35ms or every 3 tokens to prevent DOM flickering
        now = time.time()
        if (now - last_yield_time) > 0.035 or pending_tokens >= 3:
            text = tokenizer.decode(generated_token_ids, skip_special_tokens=True)
            clean_text = text
            if "</think>" in clean_text:
                clean_text = clean_text.split("</think>", 1)[-1].strip()
            elif "<think>" in clean_text:
                clean_text = ""
            yield clean_text
            last_yield_time = now
            pending_tokens = 0


# ──────────────────────────────────────────────
# Neural Network Canvas & Flicker-Free CSS
# ──────────────────────────────────────────────

CUSTOM_CSS = """
:root {
    --primary-color: #3b82f6;
    --bg-dark: #070a13;
    --card-bg: #0f172a;
}

body, .gradio-container {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
    background-color: #030712 !important;
    color: #f3f4f6 !important;
}

/* 🧠 Neural Network Hero Banner */
.neural-banner {
    position: relative;
    width: 100%;
    height: 180px;
    background: linear-gradient(135deg, #090d16 0%, #0f172a 50%, #1e1b4b 100%);
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 20px;
    border: 1px solid rgba(99, 102, 241, 0.25);
    box-shadow: 0 12px 40px -10px rgba(0, 0, 0, 0.7), 0 0 20px rgba(99, 102, 241, 0.15);
}

#neuralCanvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: 0.85;
}

.neural-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle at center, rgba(3, 7, 18, 0.2) 0%, rgba(3, 7, 18, 0.7) 100%);
    pointer-events: none;
    text-align: center;
    padding: 10px 20px;
}

.neural-title {
    font-size: 30px;
    font-weight: 800;
    margin: 0 0 6px 0;
    background: linear-gradient(90deg, #38bdf8, #818cf8, #c084fc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.5px;
    text-shadow: 0 0 30px rgba(96, 165, 250, 0.3);
}

.neural-subtitle {
    font-size: 14px;
    color: #94a3b8;
    margin: 0 0 12px 0;
    font-weight: 500;
}

.badge-container {
    display: flex;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
}

.badge-pill {
    background: rgba(15, 23, 42, 0.75);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    color: #e2e8f0;
}

.badge-green {
    background: rgba(34, 197, 94, 0.15);
    border-color: rgba(34, 197, 94, 0.3);
    color: #4ade80;
}

.badge-purple {
    background: rgba(168, 85, 247, 0.15);
    border-color: rgba(168, 85, 247, 0.3);
    color: #c084fc;
}

.badge-blue {
    background: rgba(59, 130, 246, 0.15);
    border-color: rgba(59, 130, 246, 0.3);
    color: #60a5fa;
}

/* ⚡ Anti-Flicker & UI Stabilization */
.chatbot .message {
    contain: content;
    will-change: transform, opacity;
}

.message-wrap {
    transition: none !important;
}

.preset-btn {
    border-radius: 12px !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    background: rgba(30, 41, 59, 0.7) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    transition: all 0.2s ease !important;
}

.preset-btn:hover {
    transform: translateY(-2px);
    background: rgba(59, 130, 246, 0.2) !important;
    border-color: rgba(59, 130, 246, 0.4) !important;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25) !important;
}

footer { display: none !important; }
"""

# HTML5 Neural Network Particle Synapse Canvas Script
NEURAL_CANVAS_HTML = """
<div class="neural-banner">
    <canvas id="neuralCanvas"></canvas>
    <div class="neural-overlay">
        <div class="neural-title">🧠 VIDYA 1.7B — NEURAL MATRIX INTERFACE</div>
        <div class="neural-subtitle">QUANTUM EDUCATIONAL INTELLIGENCE • RTX 3050 ACCELERATED</div>
        <div class="badge-container">
            <span class="badge-pill badge-green">⚡ GPU Accelerator (RTX 3050 FP16)</span>
            <span class="badge-pill badge-purple">🏆 Benchmark Score: 93.3% Accuracy</span>
            <span class="badge-pill badge-blue">🧪 Chem 99.4% • ⚛️ Phys 95.6% • 🧬 Bio 95.6%</span>
            <span class="badge-pill">🔒 100% Private Offline Engine</span>
        </div>
    </div>
</div>

<script>
(function initNeuralCanvas() {
    function setup() {
        const canvas = document.getElementById('neuralCanvas');
        if (!canvas) {
            setTimeout(setup, 100);
            return;
        }
        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.parentElement.clientWidth || 800;
        let height = canvas.height = canvas.parentElement.clientHeight || 180;

        window.addEventListener('resize', () => {
            if (canvas && canvas.parentElement) {
                width = canvas.width = canvas.parentElement.clientWidth;
                height = canvas.height = canvas.parentElement.clientHeight;
            }
        });

        const particles = [];
        const numParticles = 48;

        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.9,
                vy: (Math.random() - 0.5) * 0.9,
                radius: Math.random() * 2.2 + 1.2,
                color: Math.random() > 0.4 ? '#38bdf8' : (Math.random() > 0.5 ? '#a855f7' : '#ec4899')
            });
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);

            // Draw connecting Synapse lines between close neural nodes
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 110) {
                        const alpha = (1 - dist / 110) * 0.65;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
                        ctx.lineWidth = 0.95;
                        ctx.stroke();
                    }
                }
            }

            // Update particle positions and render glowing nodes
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.shadowBlur = 12;
                ctx.shadowColor = p.color;
                ctx.fill();
            });

            requestAnimationFrame(draw);
        }
        draw();
    }
    setup();
})();
</script>
"""


# ──────────────────────────────────────────────
# Build Gradio UI
# ──────────────────────────────────────────────

def create_interactive_ui():
    """Build a rich, tabbed, highly interactive Gradio UI with Neural Synapse Canvas."""
    with gr.Blocks(title="Vidya 1.7B — Neural AI Learning Companion", css=CUSTOM_CSS) as demo:

        # Neural Network Synapse Banner
        gr.HTML(NEURAL_CANVAS_HTML)

        with gr.Row():
            # Left Column: Chatbot & Prompt Explorer
            with gr.Column(scale=3):
                chatbot = gr.Chatbot(
                    height=540,
                    avatar_images=(None, "https://api.iconify.design/heroicons:academic-cap-20-solid.svg?color=%2360a5fa"),
                    latex_delimiters=[
                        {"left": "$$", "right": "$$", "display": True},
                        {"left": "$", "right": "$", "display": False},
                    ],
                    show_label=False,
                )

                with gr.Row():
                    msg_input = gr.Textbox(
                        placeholder="Ask Vidya anything about Maths, Physics, Chemistry, Biology, NCERT...",
                        show_label=False,
                        container=False,
                        scale=5,
                        autofocus=True,
                    )
                    send_btn = gr.Button("Send 🚀", variant="primary", scale=1)

                with gr.Row():
                    clear_btn = gr.Button("🗑️ Clear Chat", variant="secondary", size="sm")
                    stop_btn = gr.Button("🛑 Stop", variant="stop", size="sm")

                # Interactive Prompt Explorer Chips
                gr.Markdown("### 💡 Quick Prompt Explorer (Click to Ask)")
                with gr.Tabs():
                    with gr.TabItem("📐 Mathematics"):
                        with gr.Row():
                            p_math1 = gr.Button("Solve x² - 5x + 6 = 0 step by step.", elem_classes=["preset-btn"], size="sm")
                            p_math2 = gr.Button("Explain Pythagoras theorem with proof.", elem_classes=["preset-btn"], size="sm")
                            p_math3 = gr.Button("What is differentiation? Give real examples.", elem_classes=["preset-btn"], size="sm")

                    with gr.TabItem("⚛️ Physics"):
                        with gr.Row():
                            p_phys1 = gr.Button("Explain Newton's Laws of Motion with real examples.", elem_classes=["preset-btn"], size="sm")
                            p_phys2 = gr.Button("What is Ohm's Law? Write formula and units.", elem_classes=["preset-btn"], size="sm")
                            p_phys3 = gr.Button("Explain Work-Energy Theorem.", elem_classes=["preset-btn"], size="sm")

                    with gr.TabItem("🧪 Chemistry"):
                        with gr.Row():
                            p_chem1 = gr.Button("Explain periodic table trends in electronegativity.", elem_classes=["preset-btn"], size="sm")
                            p_chem2 = gr.Button("How to balance chemical equations?", elem_classes=["preset-btn"], size="sm")
                            p_chem3 = gr.Button("What is Avogadro's number and mole concept?", elem_classes=["preset-btn"], size="sm")

                    with gr.TabItem("🧬 Biology"):
                        with gr.Row():
                            p_bio1 = gr.Button("What is photosynthesis? Explain light reactions.", elem_classes=["preset-btn"], size="sm")
                            p_bio2 = gr.Button("Difference between Plant Cell and Animal Cell.", elem_classes=["preset-btn"], size="sm")
                            p_bio3 = gr.Button("Explain structure and function of DNA.", elem_classes=["preset-btn"], size="sm")

                    with gr.TabItem("🇮🇳 Indic Prompts"):
                        with gr.Row():
                            p_ind1 = gr.Button("प्रकाश संश्लेषण क्या है? विस्तार से समझाइए।", elem_classes=["preset-btn"], size="sm")
                            p_ind2 = gr.Button("पायथागोरसचे प्रमेय सांगा आणि सिद्ध करा.", elem_classes=["preset-btn"], size="sm")
                            p_ind3 = gr.Button("ஒளிச்சேர்க்கை என்றால் என்ன?", elem_classes=["preset-btn"], size="sm")
                            p_ind4 = gr.Button("కిరణజన్య సంయోగ క్రియ అంటే ఏమిటి?", elem_classes=["preset-btn"], size="sm")

            # Right Column: Pedagogical Modes & Advanced Controls
            with gr.Column(scale=1):
                gr.Markdown("### 👨‍🏫 Pedagogical Tutor Mode")
                mode_dropdown = gr.Dropdown(
                    choices=list(SYSTEM_PROMPTS.keys()),
                    value="👨‍🏫 NCERT School Tutor (Class 6-12)",
                    label="Select Learning Mode",
                    interactive=True,
                )

                with gr.Accordion("⚙️ Generation Parameters", open=True):
                    temp_slider = gr.Slider(
                        minimum=0.0,
                        maximum=1.0,
                        value=0.3,
                        step=0.05,
                        label="Temperature (Creativity vs Determinism)",
                    )
                    top_p_slider = gr.Slider(
                        minimum=0.1,
                        maximum=1.0,
                        value=0.9,
                        step=0.05,
                        label="Top-P (Nucleus Sampling)",
                    )
                    max_tokens_slider = gr.Slider(
                        minimum=256,
                        maximum=2048,
                        value=1024,
                        step=128,
                        label="Max New Tokens",
                    )

                with gr.Accordion("📊 Local System Hardware Stats", open=False):
                    device_name = torch.cuda.get_device_name(0) if torch.cuda.is_available() else "CPU"
                    gr.Markdown(f"""
                    - **Execution Device**: `{device_name}`
                    - **Precision**: `FP16 (Half Precision)`
                    - **Local Model Path**: `local/models/edu-qwen-1.7b-merged`
                    - **Benchmark Accuracy**: **93.3%**
                    - **Streaming Polish**: **Flicker-Free ~35ms Batched Rendering**
                    """)

        # ──────────────────────────────────────────────
        # Event Logic
        # ──────────────────────────────────────────────

        def user_submit(user_message, history):
            if not user_message or not user_message.strip():
                return "", history
            history = history or []
            history.append({"role": "user", "content": user_message})
            return "", history

        def bot_stream(history, mode_name, temperature, top_p, max_tokens):
            if not history or history[-1]["role"] != "user":
                return
            user_message = history[-1]["content"]

            history.append({"role": "assistant", "content": "..."})

            for chunk in generate_response_stream(
                message=user_message,
                history=history[:-2],
                mode_name=mode_name,
                temperature=temperature,
                top_p=top_p,
                max_tokens=max_tokens,
            ):
                history[-1]["content"] = chunk
                yield history

        submit_event = msg_input.submit(
            user_submit, [msg_input, chatbot], [msg_input, chatbot], queue=False
        ).then(
            bot_stream,
            [chatbot, mode_dropdown, temp_slider, top_p_slider, max_tokens_slider],
            [chatbot],
        )

        send_event = send_btn.click(
            user_submit, [msg_input, chatbot], [msg_input, chatbot], queue=False
        ).then(
            bot_stream,
            [chatbot, mode_dropdown, temp_slider, top_p_slider, max_tokens_slider],
            [chatbot],
        )

        stop_btn.click(fn=None, cancels=[submit_event, send_event])

        def clear_chat():
            return []

        clear_btn.click(clear_chat, None, chatbot, queue=False)

        # Preset Chips Handler
        def load_preset_and_trigger(preset_text, history, mode_name, temp, top_p, max_t):
            history = history or []
            history.append({"role": "user", "content": preset_text})
            history.append({"role": "assistant", "content": "..."})

            for chunk in generate_response_stream(
                message=preset_text,
                history=history[:-2],
                mode_name=mode_name,
                temperature=temp,
                top_p=top_p,
                max_tokens=max_t,
            ):
                history[-1]["content"] = chunk
                yield history

        preset_buttons = [
            p_math1, p_math2, p_math3,
            p_phys1, p_phys2, p_phys3,
            p_chem1, p_chem2, p_chem3,
            p_bio1, p_bio2, p_bio3,
            p_ind1, p_ind2, p_ind3, p_ind4,
        ]

        for btn in preset_buttons:
            btn.click(
                fn=load_preset_and_trigger,
                inputs=[btn, chatbot, mode_dropdown, temp_slider, top_p_slider, max_tokens_slider],
                outputs=[chatbot],
            )

    return demo


# ──────────────────────────────────────────────
# Main Launcher
# ──────────────────────────────────────────────

if __name__ == "__main__":
    print()
    print("=" * 70)
    print("  🧠 Vidya 1.7B — Futuristic Neural Network Desktop Interface")
    print("=" * 70)
    print()

    # Pre-load model before starting server
    download_and_load_model()

    print()
    print("Starting Vidya Neural Web Interface...")
    print("Local URL: http://localhost:7860")
    print()

    demo_app = create_interactive_ui()

    def auto_open_browser():
        time.sleep(2)
        webbrowser.open("http://localhost:7860")

    threading.Thread(target=auto_open_browser, daemon=True).start()

    demo_app.launch(
        server_name="127.0.0.1",
        server_port=7860,
        share=False,
        inbrowser=False,
        theme=gr.themes.Soft(primary_hue="blue", neutral_hue="slate"),
    )
