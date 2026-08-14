SUPPORTED_LANGUAGES = [
    "English",
    "Hindi",
    "Marathi",
    "Tamil",
    "Telugu",
    "Bengali",
    "Gujarati",
    "Kannada",
    "Malayalam",
    "Punjabi",
    "Maithili",
]


def language_instruction():
    return (
        "Answer in exactly the same language as the user's question. "
        "Do not switch to Hindi unless the user asked in Hindi."
    )
