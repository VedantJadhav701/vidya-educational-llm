const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const chatHistory = document.getElementById('chatHistory');
const sendButton = document.getElementById('sendButton');

let conversationHistory = [
    {
        role: 'system',
        content: `You are Vidya, an advanced interactive educational companion.
CRITICAL RULES:
1. You HAVE access to generate images and graphs via the UI.
2. NEVER say you cannot generate images, pictures, or graphs. NEVER apologize.
3. If the user asks for a picture or image, you MUST output exactly: [IMAGE: search term]
4. If the user asks for a graph or plot, you MUST output exactly: [GRAPH: math expression]
Provide a helpful explanation and always include the tag when appropriate.`
    }
];
const MODEL_NAME = 'vidya-1.7b:latest';
const OLLAMA_API = 'http://127.0.0.1:11434/api/chat';

// Auto-resize textarea
messageInput.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

messageInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event('submit'));
    }
});

function createMessageElement(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    contentDiv.textContent = content;

    messageDiv.appendChild(contentDiv);
    return { messageDiv, contentDiv };
}

function scrollToBottom() {
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.classList.add('message', 'ai-message');
    indicator.id = 'typingIndicator';

    const content = document.createElement('div');
    content.classList.add('message-content', 'typing-indicator');
    
    const textSpan = document.createElement('span');
    textSpan.id = 'thinkingTextSpan';
    textSpan.textContent = 'Thinking...';
    textSpan.classList.add('thinking-text');
    content.appendChild(textSpan);
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.classList.add('typing-dot');
        content.appendChild(dot);
    }

    indicator.appendChild(content);
    chatHistory.appendChild(indicator);
    scrollToBottom();
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

let renderedGraphs = new Set();

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (!message) return;
    
    // Clear graphs for the new message to prevent duplicates
    renderedGraphs.clear();

    // Reset input
    messageInput.value = '';
    messageInput.style.height = 'auto';

    // Add user message to UI
    const { messageDiv: userMsgEl } = createMessageElement(message, 'user-message');
    chatHistory.appendChild(userMsgEl);
    scrollToBottom();

    // Disable input while processing
    messageInput.disabled = true;
    sendButton.disabled = true;
    showTypingIndicator();
    
    const thinkingSpan = document.getElementById('thinkingTextSpan');
    
    // Simulated thinking for 1 second
    if (thinkingSpan) thinkingSpan.textContent = 'Thinking...';
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulated analyzing for 1 second
    if (thinkingSpan) thinkingSpan.textContent = 'Analyzing...';
    await new Promise(resolve => setTimeout(resolve, 1000));

    // FAILSAFE: Detect image/graph requests in case the 1.7B model forgets to output the tag
    const imgMatch = message.match(/(?:picture|image|photo|pic) of (?:the |a )?([a-zA-Z0-9\s]+)/i);
    if (imgMatch) {
        fetchAndDisplayImage(imgMatch[1].trim());
    } else if (message.toLowerCase().includes('generate an image of')) {
        const query = message.toLowerCase().split('generate an image of')[1].trim();
        if (query) fetchAndDisplayImage(query);
    }
    
    const graphMatch = message.match(/(?:graph|plot) (?:of|for) (?:the )?([a-zA-Z0-9\^x\+\-\*\/\(\)\.\s=,]+)/i);
    if (graphMatch) {
        fetchAndDisplayGraph(graphMatch[1].trim());
    }

    // Add to conversation history
    conversationHistory.push({ role: 'user', content: message });

    try {
        const response = await fetch(OLLAMA_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: MODEL_NAME,
                messages: conversationHistory,
                stream: true
            })
        });

        hideTypingIndicator();

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        // Setup streaming UI
        const { messageDiv: aiMsgEl, contentDiv: aiContentEl } = createMessageElement('', 'ai-message');
        chatHistory.appendChild(aiMsgEl);

        let fullResponse = '';

        // Read stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });

            // Ollama streams JSON lines
            const lines = chunk.split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
                try {
                    const data = JSON.parse(line);
                    if (data.message && data.message.content) {
                        fullResponse += data.message.content;
                        
                        // Extract Graph Tags
                        const graphMatch = fullResponse.match(/\[GRAPH:\s*(.+?)\]/i);
                        if (graphMatch) {
                            const expr = graphMatch[1];
                            fullResponse = fullResponse.replace(graphMatch[0], ''); // Hide from chat
                            fetchAndDisplayGraph(expr);
                        }
                        
                        // Extract Image Tags
                        const imageMatch = fullResponse.match(/\[IMAGE:\s*(.+?)\]/i);
                        if (imageMatch) {
                            const query = imageMatch[1];
                            fullResponse = fullResponse.replace(imageMatch[0], ''); // Hide from chat
                            fetchAndDisplayImage(query);
                        }
                        
                        // Parse markdown
                        let displayResponse = fullResponse;
                        // Clean up AI refusal messages if we've handled the image request
                        if (imgMatch && (displayResponse.includes('cannot generate') || displayResponse.includes('unable to') || displayResponse.includes('security policies') || displayResponse.includes('safety policies'))) {
                            displayResponse = displayResponse.replace(/.*?(cannot generate|unable to|security policies|safety policies)[^\.]*\.?/gi, "").trim();
                            if (!displayResponse.startsWith("I've loaded")) {
                                displayResponse = "I've loaded the image for you in the side panel! Here is some information about it:\n\n" + displayResponse.replace(/However, I can |However, /i, "");
                            }
                        }

                        if (window.marked) {
                            aiContentEl.innerHTML = marked.parse(displayResponse);
                        } else {
                            aiContentEl.textContent = fullResponse;
                        }
                        
                        // Render Math if KaTeX is loaded
                        if (window.renderMathInElement) {
                            renderMathInElement(aiContentEl, {
                                delimiters: [
                                    {left: '$$', right: '$$', display: true},
                                    {left: '$', right: '$', display: false},
                                    {left: '\\(', right: '\\)', display: false},
                                    {left: '\\[', right: '\\]', display: true}
                                ],
                                throwOnError: false
                            });
                        }
                        
                        scrollToBottom();
                    }
                } catch (e) {
                    console.error('Error parsing JSON chunk:', e);
                }
            }
        }

        // Save to history
        conversationHistory.push({ role: 'assistant', content: fullResponse });

    } catch (error) {
        hideTypingIndicator();
        console.error('Error:', error);

        let errorMsg = 'Sorry, I encountered an error communicating with Ollama.';
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMsg += ' Is Ollama running on localhost:11434? Note: You need to start Ollama with CORS enabled. In PowerShell, run: $env:OLLAMA_ORIGINS="*"; ollama serve';
        }

        const { messageDiv: errorEl } = createMessageElement(errorMsg, 'system-message');
        chatHistory.appendChild(errorEl);
    } finally {
        messageInput.disabled = false;
        sendButton.disabled = false;
        messageInput.focus();
        scrollToBottom();
    }
});

// Media Panel Functions
function addMediaCard(imageUrl, title, isWikiImage = false) {
    const mediaContent = document.getElementById('media-content');
    const emptyState = document.getElementById('emptyMediaState');
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    const card = document.createElement('div');
    card.classList.add('media-card');
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = title;
    if (isWikiImage) {
        img.classList.add('white-bg');
    }
    // Fallback if image fails to load
    img.onerror = () => { img.style.display = 'none'; };
    
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('media-card-title');
    titleDiv.textContent = title;
    
    card.appendChild(img);
    card.appendChild(titleDiv);
    
    // Add to top of the panel
    mediaContent.insertBefore(card, mediaContent.firstChild);
}

function fetchAndDisplayGraph(expr) {
    if (renderedGraphs.has(expr)) return;
    renderedGraphs.add(expr);
    const url = `http://127.0.0.1:5000/api/graph?expr=${encodeURIComponent(expr)}&t=${Date.now()}`;
    addMediaCard(url, `Graph of: ${expr}`);
}

async function fetchAndDisplayImage(query) {
    try {
        console.log("Fetching image for query:", query);
        const res = await fetch(`http://127.0.0.1:5000/api/image?q=${encodeURIComponent(query)}`);
        if (res.ok) {
            const data = await res.json();
            if (data.url) {
                addMediaCard(data.url, `Image: ${data.title || query}`, true);
            }
        }
    } catch (e) {
        console.error('Error fetching image:', e);
    }
}

// Splash screen logic
document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const progressBar = document.querySelector('.progress-bar');
    const loadingText = document.getElementById('loadingText');

    const loadingMessages = [
        "Initializing Neural Pathways...",
        "Loading Educational Modules...",
        "Calibrating Knowledge Base...",
        "Ready to Learn!"
    ];

    let progress = 0;
    let messageIndex = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;

        progressBar.style.width = `${progress}%`;

        if (progress > 25 && messageIndex === 0) {
            messageIndex++;
            loadingText.textContent = loadingMessages[messageIndex];
        } else if (progress > 60 && messageIndex === 1) {
            messageIndex++;
            loadingText.textContent = loadingMessages[messageIndex];
        } else if (progress >= 100 && messageIndex === 2) {
            messageIndex++;
            loadingText.textContent = loadingMessages[messageIndex];
            clearInterval(interval);

            setTimeout(() => {
                splashScreen.style.opacity = '0';
                splashScreen.style.visibility = 'hidden';
            }, 800);
        }
    }, 300);
});
