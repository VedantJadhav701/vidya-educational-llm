import gradio as gr

from src.generation import generate_response


def respond(message, history):
    if not message or not message.strip():
        return "Please enter a question."

    return generate_response(
        message=message.strip(),
        history=history or [],
    )


demo = gr.ChatInterface(
    fn=respond,
    type="messages",
    title="Vidya 1.7B",
    description=(
        "Vidya is a multilingual NCERT-focused educational AI "
        "assistant supporting 11 Indian languages."
    ),
    textbox=gr.Textbox(
        placeholder="Ask Vidya a question...",
        lines=3,
        max_lines=8,
    ),
    theme=gr.themes.Soft(),
)


if __name__ == "__main__":
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860,
        ssr_mode=False,
    )
