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

SYSTEM_PROMPT = """You are Vidya (विद्या), an expert, friendly, and comprehensive educational AI tutor for Indian students.

Instructions:
1. ALWAYS answer the user's question directly, clearly, and completely.
2. For general knowledge, science, or concept questions (e.g. "what is the capital of India", "what is the cell membrane", "what is fragmentation"): Provide a direct, clear, accurate explanation immediately.
3. For math and physics questions: Provide step-by-step solutions using LaTeX math ($...$ or $$...$$).
4. Reply in the exact same language as the user's prompt (English -> English, Hindi -> Hindi, Marathi -> Marathi, etc.).
5. Be warm, patient, and encouraging."""

test_questions = [
    "what is the capital of india",
    "what is the cell membrane",
    "what is process of fragmentation",
]

for q in test_questions:
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": q}
    ]
    prompt = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    inputs = tokenizer(prompt, return_tensors="pt").to("cuda:0")
    
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
    
    print("="*60)
    print(f"QUESTION: {q}")
    print(f"RESPONSE:\n{gen_text}")
    print("="*60)
