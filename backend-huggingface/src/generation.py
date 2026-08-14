import torch

try:
    import spaces
    gpu_decorator = spaces.GPU(duration=120)
except ImportError:
    def gpu_decorator(func):
        return func

from .config import (
    MAX_NEW_TOKENS,
    TEMPERATURE,
    TOP_P,
    REPETITION_PENALTY,
)
from .model import get_model
from .prompts import SYSTEM_PROMPT


@gpu_decorator
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

    try:
        inputs = tokenizer.apply_chat_template(
            messages,
            tokenize=True,
            add_generation_prompt=True,
            return_tensors="pt",
        )
    except Exception:
        # Fallback manual template formatting if chat_template fails
        prompt_str = f"<|im_start|>system\n{SYSTEM_PROMPT}<|im_end|>\n"
        for m in messages[1:]:
            prompt_str += f"<|im_start|>{m['role']}\n{m['content']}<|im_end|>\n"
        prompt_str += "<|im_start|>assistant\n"
        inputs = tokenizer(prompt_str, return_tensors="pt")

    if isinstance(inputs, torch.Tensor):
        input_ids = inputs.to(model.device)
        attention_mask = None
    elif isinstance(inputs, dict) or hasattr(inputs, "items"):
        input_ids = inputs["input_ids"].to(model.device)
        attention_mask = inputs.get("attention_mask")
        if attention_mask is not None:
            attention_mask = attention_mask.to(model.device)
    else:
        input_ids = inputs.to(model.device)
        attention_mask = None

    prompt_len = input_ids.shape[-1]

    # --------------------------------------------------------
    # GENERATION
    # --------------------------------------------------------

    with torch.inference_mode():
        gen_kwargs = {
            "input_ids": input_ids,
            "max_new_tokens": MAX_NEW_TOKENS,
            "temperature": TEMPERATURE,
            "top_p": TOP_P,
            "repetition_penalty": REPETITION_PENALTY,
            "do_sample": True,
        }
        if attention_mask is not None:
            gen_kwargs["attention_mask"] = attention_mask

        outputs = model.generate(**gen_kwargs)

    # Remove prompt tokens
    generated_tokens = outputs[0][prompt_len:]

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
