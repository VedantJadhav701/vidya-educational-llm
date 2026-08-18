import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

MODEL_DIR = r"C:\Users\HP\projects\Vidya-1.7B\local\models\edu-qwen-1.7b-merged"

tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR, trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_DIR,
    torch_dtype=torch.float16,
    device_map="cuda:0",
    trust_remote_code=True,
)
model.eval()

SIMPLE_PROMPT = """You are Vidya (विद्या), a helpful, warm, and friendly educational AI tutor for Indian students.

Instructions:
1. Always answer every user message directly, warmly, and completely.
2. For greetings like "hi", "hii", or "hello": Reply warmly, introduce yourself as Vidya, and ask how you can help them learn today.
3. For questions about math, science, or general topics (even if there are typos like "isoscalene triangle"): Provide a clear, full explanation immediately. Politely clarify any typos (e.g., explaining isosceles vs scalene triangles).
4. Reply in the exact same language as the user's message."""

test_prompts = [
    "hii",
    "what is the isoscalene triangle",
    "what is the capital of india"
]

for p in test_prompts:
    messages = [
        {"role": "system", "content": SIMPLE_PROMPT},
        {"role": "user", "content": p}
    ]
    formatted = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    inputs = tokenizer(formatted, return_tensors="pt").to("cuda:0")

    with torch.inference_mode():
        outputs = model.generate(
            **inputs,
            max_new_tokens=256,
            temperature=0.3,
            top_p=0.9,
            do_sample=True,
        )

    gen_text = tokenizer.decode(outputs[0][inputs.input_ids.shape[1]:], skip_special_tokens=True)
    if "</think>" in gen_text:
        gen_text = gen_text.split("</think>", 1)[-1].strip()

    print("=" * 60)
    print(f"USER: {p}")
    print(f"ASSISTANT:\n{gen_text}")
    print("=" * 60)
