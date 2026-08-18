import gradio as gr
import spaces

from src.generation import generate_response


@spaces.GPU
def respond(message: str) -> str:
    """Run Vidya inference on ZeroGPU."""
    if not message or not str(message).strip():
        return "Please ask a question."

    return generate_response(
        message=str(message).strip(),
    )


demo = gr.Interface(
    fn=respond,
    inputs=gr.Textbox(
        lines=2,
        placeholder="Ask Vidya anything in English, Hindi, Marathi, Tamil...",
        label="Your Educational Question",
    ),
    outputs=gr.Textbox(label="Vidya Answer"),
    title="🎓 Vidya 1.7B Educational LLM",
    description=(
        "Multilingual NCERT-focused educational assistant supporting "
        "11 Indian languages. Powered by Vidya 1.7B."
    ),
    flagging_mode="never",
    api_name="predict",
)


if __name__ == "__main__":
    demo.launch(ssr_mode=False)