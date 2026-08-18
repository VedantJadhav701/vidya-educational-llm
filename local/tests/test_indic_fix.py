import os, sys
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
sys.path.insert(0, r"C:\Users\HP\projects\Vidya-1.7B\local")
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from queue import Queue
from threading import Thread

model_path = r"C:\Users\HP\projects\Vidya-1.7B\local\models\edu-qwen-1.7b-merged"
tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained(model_path, torch_dtype=torch.float16, device_map="cuda:0", trust_remote_code=True)

messages = [{"role": "user", "content": "प्रकाश संश्लेषण क्या है? संक्षेप में समझाइए।"}]
inputs = tokenizer.apply_chat_template(messages, tokenize=True, add_generation_prompt=True, return_dict=True, return_tensors="pt")
input_ids = inputs["input_ids"].to("cuda")
prompt_len = input_ids.shape[-1]

class IndicTokenStreamer:
    def __init__(self, tokenizer):
        self.tokenizer = tokenizer
        self.queue = Queue()
        self.tokens = []

    def put(self, value):
        if len(value.shape) > 1:
            value = value[0]
        for t in value.tolist():
            self.queue.put(t)

    def end(self):
        self.queue.put(None)

streamer = IndicTokenStreamer(tokenizer)

def generate_worker():
    with torch.inference_mode():
        model.generate(
            input_ids=input_ids,
            max_new_tokens=150,
            temperature=0.3,
            top_p=0.9,
            repetition_penalty=1.0,
            do_sample=True,
            streamer=streamer,
        )

thread = Thread(target=generate_worker)
thread.start()

generated_token_ids = []
print("Testing Indic token streaming:")
while True:
    token_id = streamer.queue.get()
    if token_id is None:
        break
    generated_token_ids.append(token_id)
    # Decode the full generated token sequence to preserve multi-byte Indic characters
    current_text = tokenizer.decode(generated_token_ids, skip_special_tokens=True)
    if "<think>" in current_text:
        if "</think>" in current_text:
            current_text = current_text.split("</think>", 1)[-1].strip()
        else:
            current_text = ""
    print("\r" + current_text.replace("\n", " "), end="", flush=True)

thread.join()
print("\n\nFINAL DECODED HINDI TEXT:")
final_text = tokenizer.decode(generated_token_ids, skip_special_tokens=True)
if "</think>" in final_text:
    final_text = final_text.split("</think>", 1)[-1].strip()
print(final_text)
