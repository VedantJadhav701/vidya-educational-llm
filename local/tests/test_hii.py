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

# Test 1: Compact system prompt (~120 tokens)
COMPACT_PROMPT = """You are Vidya (विद्या), a warm, intelligent, encouraging, and accurate educational AI companion for Indian students.

CORE RULES:
1. GREETINGS & CASUAL INPUTS: For greetings like "hi", "hello", "who are you", greet warmly, introduce yourself as Vidya, and ask how you can help them learn today.
2. DIRECT HELPFUL ANSWERS: Answer every educational prompt directly, clearly, and completely.
3. LANGUAGE MATCHING: Reply in the exact same language as the user (English -> English, Hindi -> Hindi, Marathi -> Marathi, etc.).
4. CLEAN OUTPUT: Output only the clean educational response without internal thought tags."""

messages = [
    {"role": "system", "content": COMPACT_PROMPT},
    {"role": "user", "content": "hii"}
]

prompt = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
inputs = tokenizer(prompt, return_tensors="pt").to("cuda:0")

with torch.inference_mode():
    outputs = model.generate(
        **inputs,
        max_new_tokens=150,
        temperature=0.3,
        top_p=0.9,
        do_sample=True,
    )

gen_text = tokenizer.decode(outputs[0][inputs.input_ids.shape[1]:], skip_special_tokens=True)
print("COMPACT PROMPT TEST FOR 'hii':")
print("="*60)
print(gen_text)
print("="*60)
