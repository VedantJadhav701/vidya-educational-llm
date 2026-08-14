from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

model_id = "vedantjadhav701/edu-qwen-1.7b-merged"

print(f"Loading tokenizer from {model_id}...")
tokenizer = AutoTokenizer.from_pretrained(model_id, trust_remote_code=True)

print(f"Loading model from {model_id}...")
# Use torch_dtype="auto" or torch.float16, and device_map="auto" to load on GPU if available.
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    device_map="auto",
    torch_dtype=torch.float16,
    trust_remote_code=True
)

prompt = "Explain the concept of gravity in simple terms."
print(f"\nPrompt: {prompt}\n")

# Qwen models often use specific chat templates, but we can do a simple generate here
inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

print("Generating response...")
# Adjust generation parameters as needed
outputs = model.generate(
    **inputs, 
    max_new_tokens=100, 
    temperature=0.7, 
    do_sample=True,
    pad_token_id=tokenizer.pad_token_id or tokenizer.eos_token_id
)

response = tokenizer.decode(outputs[0], skip_special_tokens=True)

print("\n--- Generated Output ---")
print(response)
