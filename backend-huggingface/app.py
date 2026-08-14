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


with gr.Blocks(title="Vidya 1.7B Educational LLM", theme=gr.themes.Soft()) as demo:
    gr.Markdown("# 🎓 Vidya 1.7B Educational LLM")
    gr.Markdown(
        "Multilingual NCERT-focused educational assistant supporting 11 Indian languages. "
        "Powered by `vedantjadhav701/edu-qwen-1.7b-merged` on ZeroGPU."
    )

    # Standard Chatbot UI for direct Space visitors
    chatbot = gr.Chatbot(label="Vidya", type="messages")
    msg_box = gr.Textbox(placeholder="Ask Vidya anything in English, Hindi, Marathi, Tamil...", label="Your Question")
    clear_btn = gr.ClearButton([msg_box, chatbot])

    def chat_ui(user_msg, chat_hist):
        chat_hist = chat_hist or []
        chat_hist.append({"role": "user", "content": user_msg})
        bot_reply = respond(user_msg, chat_hist[:-1])
        chat_hist.append({"role": "assistant", "content": bot_reply})
        return "", chat_hist

    msg_box.submit(chat_ui, [msg_box, chatbot], [msg_box, chatbot])

    # Direct, dedicated API endpoint for Next.js web application
    api_msg = gr.Textbox(visible=False, label="message")
    api_hist = gr.JSON(visible=False, label="history", value=[])
    api_out = gr.Textbox(visible=False, label="response")
    api_btn = gr.Button("API", visible=False)
    api_btn.click(
        respond,
        inputs=[api_msg, api_hist],
        outputs=api_out,
        api_name="chat",
    )


if __name__ == "__main__":
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860,
        ssr_mode=False,
    )
