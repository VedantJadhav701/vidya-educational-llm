import os, sys
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
sys.path.insert(0, r"C:\Users\HP\projects\Vidya-1.7B\local")
import torch
from app import download_and_load_model, SYSTEM_PROMPT, MAX_NEW_TOKENS, TEMPERATURE, TOP_P, REPETITION_PENALTY

tokenizer, model = download_and_load_model()

messages = [
    {"role": "system", "content": SYSTEM_PROMPT},
    {"role": "user", "content": "What is 2+2?"}
]

print("1. Applying chat template...")
try:
    encoded = tokenizer.apply_chat_template(
        messages,
        tokenize=True,
        add_generation_prompt=True,
        return_dict=True,
        return_tensors="pt",
    )
    print("  Encoded type:", type(encoded))
    if isinstance(encoded, dict):
        raw_ids = encoded["input_ids"]
        raw_mask = encoded.get("attention_mask")
    elif hasattr(encoded, "input_ids"):
        raw_ids = encoded.input_ids
        raw_mask = getattr(encoded, "attention_mask", None)
    else:
        raw_ids = encoded
        raw_mask = None
except Exception as e:
    print("  apply_chat_template failed:", e)
    prompt_str = f"<|im_start|>system\n{SYSTEM_PROMPT}<|im_end|>\n<|im_start|>user\nWhat is 2+2?<|im_end|>\n<|im_start|>assistant\n"
    encoded = tokenizer(prompt_str, return_tensors="pt")
    raw_ids = encoded["input_ids"]
    raw_mask = encoded.get("attention_mask")

if isinstance(raw_ids, torch.Tensor):
    input_ids = raw_ids.to(model.device)
else:
    input_ids = torch.tensor(raw_ids, device=model.device)

if input_ids.ndim == 1:
    input_ids = input_ids.unsqueeze(0)

if raw_mask is not None:
    if isinstance(raw_mask, torch.Tensor):
        attention_mask = raw_mask.to(model.device)
    else:
        attention_mask = torch.tensor(raw_mask, device=model.device)
    if attention_mask.ndim == 1:
        attention_mask = attention_mask.unsqueeze(0)
else:
    attention_mask = None

print(f"2. input_ids shape: {input_ids.shape}, device: {input_ids.device}")
prompt_len = input_ids.shape[-1]
print(f"3. prompt_len: {prompt_len}")

with torch.inference_mode():
    gen_kwargs = {
        "input_ids": input_ids,
        "max_new_tokens": 128,
        "temperature": 0.3,
        "top_p": 0.9,
        "do_sample": True,
    }
    if attention_mask is not None:
        gen_kwargs["attention_mask"] = attention_mask

    outputs = model.generate(**gen_kwargs)

print(f"4. outputs shape: {outputs.shape}")
print(f"5. outputs[0] len: {len(outputs[0])}")

generated_tokens = outputs[0][prompt_len:]
print(f"6. generated_tokens len: {len(generated_tokens)}")

raw_response = tokenizer.decode(outputs[0], skip_special_tokens=False)
print("\n=== FULL RAW OUTPUT (WITH SPECIAL TOKENS) ===")
print(raw_response)
print("=== END FULL RAW OUTPUT ===")

decoded_new = tokenizer.decode(generated_tokens, skip_special_tokens=True)
print("\n=== NEW TOKENS DECODED ===")
print(repr(decoded_new))
print("=== END NEW TOKENS DECODED ===")
