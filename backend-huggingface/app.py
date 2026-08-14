import gradio as gr
from src.generation import generate_response


def respond(message: str, history=None) -> str:
    if not message or not str(message).strip():
        return "Please ask a question."

    hist = history or []
    return generate_response(
        message=str(message).strip(),
        history=hist,
    )


# Build Gradio Blocks with explicit named API endpoint
with gr.Blocks(title="Vidya 1.7B Educational LLM", theme=gr.themes.Soft()) as demo:
    gr.Markdown("# 🎓 Vidya 1.7B Educational LLM")
    gr.Markdown(
        "Multilingual NCERT-focused educational assistant supporting 11 Indian languages. "
        "Powered by `vedantjadhav701/edu-qwen-1.7b-merged` on ZeroGPU."
    )

    chat = gr.ChatInterface(
        fn=respond,
        type="messages",
        textbox=gr.Textbox(placeholder="Ask Vidya anything in English, Hindi, Marathi, Tamil...", lines=2),
        api_name="chat",
    )


if __name__ == "__main__":
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860,
        ssr_mode=False,
    )
