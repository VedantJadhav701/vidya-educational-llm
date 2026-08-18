import os, sys
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
sys.path.insert(0, r"C:\Users\HP\projects\Vidya-1.7B\local")
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, TextIteratorStreamer
from threading import Thread

print("Testing CUDA streaming with thread...")
model_path = r"C:\Users\HP\projects\Vidya-1.7B\local\models\edu-qwen-1.7b-merged"
tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained(model_path, torch_dtype=torch.float16, device_map="cuda:0", trust_remote_code=True)

messages = [{"role": "user", "content": "Explain Pythagoras Theorem in English."}]
inputs = tokenizer.apply_chat_template(messages, tokenize=True, add_generation_prompt=True, return_dict=True, return_tensors="pt")
input_ids = inputs["input_ids"].to("cuda")

streamer = TextIteratorStreamer(tokenizer, skip_prompt=True, skip_special_tokens=True)

def generate_task():
    with torch.inference_mode():
        model.generate(
            input_ids=input_ids,
            max_new_tokens=100,
            temperature=0.3,
            top_p=0.9,
            repetition_penalty=1.0,
            do_sample=True,
            streamer=streamer,
        )

thread = Thread(target=generate_task)
thread.start()

print("Streaming output:")
for text in streamer:
    print(text, end="", flush=True)

thread.join()
print("\nStream test PASSED!")
