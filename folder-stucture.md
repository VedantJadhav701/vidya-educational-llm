Yes. Since you already have:

C:\Users\HP\projects\Vidya-1.7B\backend-huggingface

I recommend making this a self-contained Hugging Face Space repository.

For the first deployment, use your merged model:

vedantjadhav701/edu-qwen-1.7b-merged

and ZeroGPU + Gradio + Transformers.

1. Final folder structure

Ask Antigravity CLI to create exactly this:

backend-huggingface/
│
├── app.py
├── requirements.txt
├── README.md
├── .gitignore
│
└── src/
    ├── __init__.py
    ├── config.py
    ├── model.py
    ├── prompts.py
    ├── generation.py
    └── language.py

You do not need to put the 3.4 GB model inside this repository. The Space downloads:

vedantjadhav701/edu-qwen-1.7b-merged

from Hugging Face when required.

2. app.py

This is the main Gradio application.

import gradio as gr

from src.generation import generate_response


def respond(message, history):
    if not message or not message.strip():
        return "Please enter a question."

    return generate_response(
        message=message.strip(),
        history=history or [],
    )


demo = gr.ChatInterface(
    fn=respond,
    type="messages",
    title="Vidya 1.7B",
    description=(
        "Vidya is a multilingual NCERT-focused educational AI "
        "assistant supporting 11 Indian languages."
    ),
    textbox=gr.Textbox(
        placeholder="Ask Vidya a question...",
        lines=3,
        max_lines=8,
    ),
    examples=[
        "What is photosynthesis?",
        "Explain Newton's three laws of motion.",
        "What is the area of a rectangle of length 20 m and width 10 m?",
        "प्रकाश संश्लेषण क्या है?",
        "प्रकाश संश्लेषण म्हणजे काय?",
        "தமிழில் ஒளிச்சேர்க்கை என்றால் என்ன?",
    ],
    theme=gr.themes.Soft(),
)


if __name__ == "__main__":
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860,
        ssr_mode=False,
    )
3. src/config.py
MODEL_ID = "vedantjadhav701/edu-qwen-1.7b-merged"

MAX_NEW_TOKENS = 1024
TEMPERATURE = 0.3
TOP_P = 0.9
REPETITION_PENALTY = 1.05

MAX_INPUT_TOKENS = 4096

THINKING_ENABLED = False
4. src/prompts.py

Keep the system prompt here instead of putting a huge prompt directly inside app.py.

SYSTEM_PROMPT = """
You are Vidya, an NCERT-focused multilingual educational AI assistant.

============================================================
CORE RULES
============================================================

1. Understand the user's question correctly.
2. Answer the question directly.
3. Answer every requested part.
4. Use scientifically, mathematically, and factually accurate
   information.
5. Use language appropriate for NCERT/student learning.
6. Do not invent facts, formulas, definitions, or explanations.
7. Do not reveal internal reasoning or chain-of-thought.
8. Return only the final educational answer.

============================================================
SUPPORTED LANGUAGES
============================================================

English
Hindi
Marathi
Tamil
Telugu
Bengali
Gujarati
Kannada
Malayalam
Punjabi
Maithili

============================================================
LANGUAGE RULE
============================================================

Answer in the same language as the user's question.

English → English
Hindi → Hindi
Marathi → Marathi
Tamil → Tamil
Telugu → Telugu
Bengali → Bengali
Gujarati → Gujarati
Kannada → Kannada
Malayalam → Malayalam
Punjabi → Punjabi
Maithili → Maithili

Never automatically switch to Hindi.

Never use Hindi as a fallback language.

Hindi, Marathi, and Maithili are different languages.

Marathi must remain Marathi.

Maithili must remain Maithili.

Do not replace Marathi vocabulary with Hindi vocabulary.

Do not replace Maithili vocabulary with Hindi vocabulary.

Do not mix Hindi grammar with Marathi or Maithili.

============================================================
SCRIPT
============================================================

English → Latin
Hindi → Devanagari
Marathi → Devanagari
Maithili → Devanagari
Tamil → Tamil
Telugu → Telugu
Bengali → Bengali
Gujarati → Gujarati
Kannada → Kannada
Malayalam → Malayalam
Punjabi → Gurmukhi

Use the correct writing system for the requested language.

============================================================
LANGUAGE PURITY
============================================================

Do not translate the user's question into another language.

Do not switch languages during the answer.

Do not mix languages unnecessarily.

Standard English technical terms may be used when they are
conventionally used in science, mathematics, medicine,
programming, or engineering.

Keep the surrounding sentence in the user's language.

============================================================
EDUCATIONAL STYLE
============================================================

Use:

- clear explanations
- concise paragraphs
- numbered steps when useful
- bullet points when useful
- correct formulas
- relevant examples
- correct units
- simple terminology

For simple questions, be concise.

For complex questions, provide enough explanation and all
necessary steps.

============================================================
MATHEMATICS
============================================================

For mathematics:

- Calculate carefully.
- Preserve signs.
- Preserve units.
- Show necessary steps.
- Verify intermediate calculations.
- Verify the final result.
- Do not invent algebraic operations.
- Do not force calculations to match an expected answer.
- Make sure the conclusion agrees with the calculations.

For geometry, verify dimensions before calculating areas.

For percentages, verify that the percentage is associated with
the correct quantity.

============================================================
MATHEMATICAL FORMATTING
============================================================

Prefer simple readable mathematical notation.

Example:

Area = length × width

80 × 50 = 4000 m²

Percentage = (464 / 4000) × 100 = 11.6%

Avoid complicated LaTeX when it is unnecessary.

Never produce malformed LaTeX such as:

ext{Area}
ext{length}
frac{a}{b}
times

If LaTeX is used, all commands must be valid.

============================================================
SCIENCE
============================================================

Use established scientific principles.

Do not invent mechanisms.

Do not confuse causes and effects.

Do not attribute energy or processes to incorrect sources.

Use correct scientific terminology.

If uncertain, do not fabricate an answer.

============================================================
AMBIGUOUS INPUT
============================================================

If the input is extremely short or ambiguous and its meaning cannot
be determined reliably, ask for clarification.

Do not fabricate a scientific definition for an unknown term.

============================================================
THINKING
============================================================

Do not output chain-of-thought.

Do not output:

<think>
...
</think>

Do not output:

Thinking...
Reasoning...
Analysis...
Planning...

Only provide the final answer.

For problems requiring reasoning, provide only the concise
solution steps necessary for the student.

============================================================
FINAL CHECK
============================================================

Before answering, internally verify:

- Did I understand the question?
- Did I answer every requested part?
- Am I using the same language?
- Am I using the correct script?
- Did I accidentally switch to Hindi?
- Did I mix languages?
- Are the facts correct?
- Are mathematical calculations correct?
- Are units correct?
- Does the conclusion agree with the calculations?
- Did I invent anything?
- Is the answer complete?

Then output only the final educational answer.
"""
5. src/language.py

For now, keep this lightweight. Don't try to build a separate language classifier model. Your Qwen model can identify the language from context.

SUPPORTED_LANGUAGES = [
    "English",
    "Hindi",
    "Marathi",
    "Tamil",
    "Telugu",
    "Bengali",
    "Gujarati",
    "Kannada",
    "Malayalam",
    "Punjabi",
    "Maithili",
]


def language_instruction():
    return (
        "Answer in exactly the same language as the user's question. "
        "Do not switch to Hindi unless the user asked in Hindi."
    )
6. src/model.py

This handles model loading.

import torch
import spaces

from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
)

from .config import MODEL_ID


_tokenizer = None
_model = None


@spaces.GPU(duration=120)
def load_model():
    global _tokenizer
    global _model

    if _model is not None and _tokenizer is not None:
        return _tokenizer, _model

    print("=" * 70)
    print("Loading Vidya")
    print("=" * 70)

    print(f"Model: {MODEL_ID}")

    _tokenizer = AutoTokenizer.from_pretrained(
        MODEL_ID,
        trust_remote_code=True,
    )

    if torch.cuda.is_available():
        dtype = torch.bfloat16
    else:
        dtype = torch.float32

    _model = AutoModelForCausalLM.from_pretrained(
        MODEL_ID,
        dtype=dtype,
        device_map="auto",
        trust_remote_code=True,
    )

    _model.eval()

    print("✓ Vidya loaded")

    return _tokenizer, _model
7. Important improvement

Actually, don't load the model using a @spaces.GPU function.

The GPU decorator should be used around the inference function, while model loading should happen lazily during the first GPU invocation.

So use this better version of model.py:

import torch
import spaces

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

    _tokenizer = AutoTokenizer.from_pretrained(
        MODEL_ID,
        trust_remote_code=True,
    )

    if torch.cuda.is_available():
        dtype = torch.bfloat16
    else:
        dtype = torch.float32

    _model = AutoModelForCausalLM.from_pretrained(
        MODEL_ID,
        dtype=dtype,
        device_map="auto",
        trust_remote_code=True,
    )

    _model.eval()

    print("✓ Vidya loaded")

    return _tokenizer, _model

Use this version.

8. src/generation.py

This is the most important file.

import torch
import spaces

from .config import (
    MAX_NEW_TOKENS,
    TEMPERATURE,
    TOP_P,
    REPETITION_PENALTY,
)
from .model import get_model
from .prompts import SYSTEM_PROMPT


@spaces.GPU(duration=120)
def generate_response(message, history=None):

    tokenizer, model = get_model()

    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT,
        }
    ]

    history = history or []

    for item in history:

        if isinstance(item, dict):

            role = item.get("role")
            content = item.get("content")

            if role in ("user", "assistant") and content:

                messages.append(
                    {
                        "role": role,
                        "content": content,
                    }
                )

        elif isinstance(item, (list, tuple)) and len(item) == 2:

            user_message, assistant_message = item

            if user_message:
                messages.append(
                    {
                        "role": "user",
                        "content": user_message,
                    }
                )

            if assistant_message:
                messages.append(
                    {
                        "role": "assistant",
                        "content": assistant_message,
                    }
                )

    messages.append(
        {
            "role": "user",
            "content": message,
        }
    )

    # --------------------------------------------------------
    # QWEN CHAT TEMPLATE
    # --------------------------------------------------------

    inputs = tokenizer.apply_chat_template(
        messages,
        tokenize=True,
        add_generation_prompt=True,
        return_tensors="pt",
        enable_thinking=False,
    )

    inputs = inputs.to(model.device)

    # --------------------------------------------------------
    # GENERATION
    # --------------------------------------------------------

    with torch.inference_mode():

        outputs = model.generate(
            input_ids=inputs,

            max_new_tokens=MAX_NEW_TOKENS,

            temperature=TEMPERATURE,
            top_p=TOP_P,

            repetition_penalty=REPETITION_PENALTY,

            do_sample=True,

            enable_thinking=False,
        )

    # Remove prompt tokens
    generated_tokens = outputs[0][inputs.shape[-1]:]

    response = tokenizer.decode(
        generated_tokens,
        skip_special_tokens=True,
    )

    response = response.strip()

    # --------------------------------------------------------
    # SAFETY CLEANUP
    # --------------------------------------------------------

    if "<think>" in response:

        response = response.split("<think>", 1)[0].strip()

    if "</think>" in response:

        response = response.split("</think>", 1)[-1].strip()

    return response
One caveat

Depending on the exact Transformers version used by the Space, enable_thinking=False may need to be passed through apply_chat_template() rather than generate().

For Qwen3, the chat-template control is the important one.

9. src/__init__.py

This can simply be:

"""
Vidya 1.7B backend package.
"""
10. requirements.txt

Use pinned versions rather than completely floating dependencies.

torch==2.10.0
transformers==4.57.6
accelerate==1.12.0
gradio==5.43.1
spaces==0.41.0
safetensors>=0.6.2
sentencepiece>=0.2.1

If Hugging Face's current ZeroGPU environment rejects a specific version, we can adjust based on the build log.

11. README.md

Use this:

---
title: Vidya 1.7B
emoji: 🎓
colorFrom: blue
colorTo: indigo
sdk: gradio
sdk_version: 5.43.1
app_file: app.py
pinned: false
---

# Vidya 1.7B

Vidya is a multilingual NCERT-focused educational AI assistant.

## Model

Base/fine-tuned model:

`vedantjadhav701/edu-qwen-1.7b-merged`

## Supported Languages

- English
- Hindi
- Marathi
- Tamil
- Telugu
- Bengali
- Gujarati
- Kannada
- Malayalam
- Punjabi
- Maithili

## Features

- Multilingual educational assistance
- NCERT-focused responses
- Mathematics
- Science
- Step-by-step solutions
- Language-aware responses
- Thinking disabled for final-answer-only responses

## Deployment

Built with:

- Hugging Face Spaces
- Gradio
- Transformers
- PyTorch
- ZeroGPU
12. .gitignore
__pycache__/
*.pyc
*.pyo
*.pyd

.venv/
venv/
env/

.env
.env.*

.cache/
huggingface/
.huggingface/

*.log

.vscode/
.idea/

.DS_Store
Thumbs.db
Final structure

Your local folder should become:

C:\Users\HP\projects\Vidya-1.7B\backend-huggingface
│
├── app.py
├── requirements.txt
├── README.md
├── .gitignore
│
└── src
    ├── __init__.py
    ├── config.py
    ├── model.py
    ├── prompts.py
    ├── generation.py
    └── language.py

And no model files need to be inside this folder.

The model comes from:

vedantjadhav701/edu-qwen-1.7b-merged