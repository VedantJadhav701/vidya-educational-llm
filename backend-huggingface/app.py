import gradio as gr
from src.generation import generate_response


def respond(message: str) -> str:
    if not message or not str(message).strip():
        return "Please ask a question."

    return generate_response(
        message=str(message).strip(),
    )


with gr.Blocks(title="Vidya 1.7B Educational LLM", theme=gr.themes.Soft()) as demo:
    gr.Markdown("# 🎓 Vidya 1.7B Educational LLM")
    gr.Markdown(
        "Multilingual NCERT-focused educational assistant supporting 11 Indian languages. "
        "Powered by `vedantjadhav701/edu-qwen-1.7b-merged` on ZeroGPU."
    )

    with gr.Row():
        question_input = gr.Textbox(
            lines=2,
            placeholder="Ask Vidya anything in English, Hindi, Marathi, Tamil...",
            label="Your Educational Question",
        )
        answer_output = gr.Textbox(label="Vidya Answer")

    submit_btn = gr.Button("Ask Vidya", variant="primary")

    # Register both 'predict' and 'chat' API names for complete client compatibility
    submit_btn.click(
        fn=respond,
        inputs=question_input,
        outputs=answer_output,
        api_name="predict",
    )
    submit_btn.click(
        fn=respond,
        inputs=question_input,
        outputs=answer_output,
        api_name="chat",
    )


if __name__ == "__main__":
    demo.launch(ssr_mode=False)
