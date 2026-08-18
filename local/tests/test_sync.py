import os, sys
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
sys.path.insert(0, r"C:\Users\HP\projects\Vidya-1.7B\local")
import torch
from app import download_and_load_model, SYSTEM_PROMPT

print("Testing direct model.generate synchronously...")
tokenizer, model = download_and_load_model()

messages = [
    {"role": "system", "content": SYSTEM_PROMPT},
    {"role": "user", "content": "Explain Newton's Laws of Motion with real-world examples."}
]

inputs = tokenizer.apply_chat_template(
    messages,
    tokenize=True,
    add_generation_prompt=True,
    return_dict=True,
    return_tensors="pt"
)

if hasattr(inputs, "input_ids"):
    input_ids = inputs.input_ids.to(model.device)
    attention_mask = getattr(inputs, "attention_mask", None)
    if attention_mask is not None:
        attention_mask = attention_mask.to(model.device)
elif isinstance(inputs, torch.Tensor):
    input_ids = inputs.to(model.device)
    attention_mask = None

print("Starting model.generate (synchronous)...")
with torch.inference_mode():
    outputs = model.generate(
        input_ids=input_ids,
        attention_mask=attention_mask,
        max_new_tokens=256,
        temperature=0.3,
        top_p=0.9,
        do_sample=True
    )

print("Decoding output...")
text = tokenizer.decode(outputs[0][inputs.shape[-1]:], skip_special_tokens=True)
print("\n=== GENERATED RESPONSE ===")
print(text)
print("=== END RESPONSE ===")
