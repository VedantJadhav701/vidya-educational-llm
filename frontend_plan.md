# VIDYA AI — PRODUCTION NEXT.JS FRONTEND

You are building the production frontend for Vidya, a multilingual
educational AI assistant for Indian students.

PROJECT LOCATION:

C:\Users\HP\projects\Vidya-1.7B\frontend-nextjs

IMPORTANT:
Build ONLY the frontend in this directory.

Do NOT modify:
C:\Users\HP\projects\Vidya-1.7B\backend-huggingface

Do NOT modify the existing:
- webapp
- backend-huggingface
- local
- model files
- GGUF files

============================================================
1. PRODUCT IDENTITY
============================================================

Product name:

VIDYA

Tagline:

"Learn deeper. Understand better."

Vidya is an educational AI designed for Indian students.

Core domains:

- Mathematics
- Physics
- Chemistry
- Biology
- Computer Science
- General academics

Primary target:

Indian school and competitive-exam students.

Supported languages:

- English
- Hindi
- Marathi
- Tamil
- Telugu
- Bengali
- Gujarati
- Kannada
- Malayalam
- Punjabi
- Maithili
- Urdu

Do NOT make Vidya look like a generic ChatGPT clone.

The design should communicate:

EDUCATION
INTELLIGENCE
INDIAN STUDENT FOCUS
SCIENCE
KNOWLEDGE
MODERN AI

============================================================
2. TECHNOLOGY STACK
============================================================

Use:

- Next.js latest stable version
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- KaTeX
- react-markdown
- remark-math
- rehype-katex
- rehype-sanitize
- Hugging Face Gradio Client

Use App Router.

Use strict TypeScript.

Use modular React components.

Use server-side API routes where appropriate.

Do not use deprecated Next.js APIs.

============================================================
3. APPLICATION STRUCTURE
============================================================

Create:

frontend-nextjs/

app/
  layout.tsx
  page.tsx

  landing/
    page.tsx

  playground/
    page.tsx

  api/
    chat/
      route.ts

    image/
      route.ts

components/
  landing/
    Hero.tsx
    Features.tsx
    HowItWorks.tsx
    Subjects.tsx
    Languages.tsx
    CTA.tsx
    Footer.tsx

  playground/
    Playground.tsx
    ChatWindow.tsx
    ChatMessage.tsx
    ChatInput.tsx
    TypingIndicator.tsx
    WelcomeScreen.tsx
    SubjectSelector.tsx
    LanguageSelector.tsx
    VisualPanel.tsx
    GraphRenderer.tsx
    ImageCard.tsx
    EmptyState.tsx
    ErrorState.tsx

  ui/
    Button.tsx
    Badge.tsx
    Modal.tsx
    Loading.tsx

lib/
  vidya.ts
  token-limit.ts
  markdown.ts
  types.ts

public/
  ...

.env.example
package.json
tsconfig.json
next.config.ts
tailwind.config.ts

============================================================
4. LANDING PAGE
============================================================

The root page must be a premium landing page.

URL:

/

The landing page should NOT immediately open the chat.

Structure:

------------------------------------------------------------
NAVBAR
------------------------------------------------------------

Left:

VIDYA logo / wordmark.

Center/right navigation:

- Features
- Subjects
- Languages
- About

CTA:

"Enter Playground"

Navbar should be responsive.

On mobile use a compact menu.

------------------------------------------------------------
HERO
------------------------------------------------------------

Create a visually distinctive educational AI hero.

Headline:

"Learn deeper.
Understand better."

Subheadline:

"Vidya is a multilingual educational AI built to help Indian
students understand Mathematics, Physics, Chemistry, Biology and
more."

Primary CTA:

"Enter Vidya Playground"

Secondary CTA:

"Explore Features"

Hero visual:

Create an interactive educational AI visualization.

Do NOT use a generic robot image.

Possible visual:

- floating mathematical equations
- physics vectors
- molecular structures
- DNA
- graphs
- educational cards
- animated knowledge nodes

Use subtle motion.

Avoid excessive animation.

------------------------------------------------------------
TRUST / MODEL SECTION
------------------------------------------------------------

Show:

VIDYA 1.7B

"Multilingual Educational AI"

Mention that Vidya is designed for educational assistance.

Do NOT make unsupported claims such as:

"best educational AI"
"100% accurate"
"human-level reasoning"

------------------------------------------------------------
FEATURES
------------------------------------------------------------

Create cards for:

1. Multilingual Learning
2. Mathematics
3. Physics
4. Chemistry
5. Biology
6. Step-by-Step Explanations
7. Mathematical Rendering
8. Visual Learning

Each card should have:

- icon
- short title
- short explanation
- subtle hover animation

------------------------------------------------------------
SUBJECTS
------------------------------------------------------------

Interactive subject cards:

Mathematics
Physics
Chemistry
Biology
Computer Science

Clicking a subject can navigate to:

/playground?subject=mathematics

etc.

------------------------------------------------------------
LANGUAGES
------------------------------------------------------------

Display supported Indian languages.

Use proper scripts.

Example:

English
हिन्दी
मराठी
தமிழ்
తెలుగు
বাংলা
ગુજરાતી
ಕನ್ನಡ
മലയാളം
ਪੰਜਾਬੀ
मैथिली
اردو

Do NOT falsely imply equal model performance across every language.

------------------------------------------------------------
HOW IT WORKS
------------------------------------------------------------

Show:

Ask
 ↓
Vidya understands
 ↓
Vidya explains
 ↓
Student learns

Use animated transitions.

------------------------------------------------------------
FINAL CTA
------------------------------------------------------------

Headline:

"Start learning with Vidya."

Button:

"Open Playground"

------------------------------------------------------------
FOOTER
------------------------------------------------------------

Include:

Vidya
Educational AI

GitHub
Hugging Face
About

Do not fabricate URLs.

Use placeholder environment/config values if URLs are not known.

============================================================
5. PLAYGROUND
============================================================

URL:

/playground

This is the actual AI application.

The playground should feel like a dedicated educational workspace.

Do NOT simply copy ChatGPT's interface.

============================================================
6. PLAYGROUND LAYOUT
============================================================

Desktop:

----------------------------------------------------
| VIDYA | Subject | Language | ...                  |
----------------------------------------------------
|                                                    |
|                CHAT AREA                           |
|                                                    |
|                                                    |
|                                                    |
|----------------------------------------------------|
|                    CHAT INPUT                      |
-----------------------------------------------------

Optional right panel:

VISUALS & REFERENCES

This panel should appear when relevant.

For example:

- generated graphs
- educational images
- formulas
- references

On mobile:

The visual panel becomes a bottom sheet/modal.

============================================================
7. PLAYGROUND HEADER
============================================================

Show:

VIDYA

Small status:

"Educational AI"

Subject selector:

All
Mathematics
Physics
Chemistry
Biology
Computer Science

Language selector:

Auto
English
Hindi
Marathi
Tamil
Telugu
Bengali
Gujarati
Kannada
Malayalam
Punjabi
Maithili
Urdu

Do not force the user to select a language.

Auto should detect the language.

============================================================
8. WELCOME SCREEN
============================================================

Before the first question, show:

"Welcome to Vidya"

"Ask a question. Explore a concept. Solve a problem."

Example prompt cards:

"Explain Newton's laws simply"

"Solve this quadratic equation"

"Explain photosynthesis"

"Why does entropy increase?"

"Explain DNA replication"

"Help me prepare for JEE"

Clicking a prompt inserts it into the input.

============================================================
9. CHAT EXPERIENCE
============================================================

User messages:

- right aligned
- visually distinct
- clean
- compact

Vidya messages:

- left aligned
- educational appearance
- support Markdown
- support LaTeX
- support lists
- support tables
- support code blocks

Do NOT use giant chat bubbles.

============================================================
10. MARKDOWN
============================================================

Render Markdown safely.

Support:

- headings
- paragraphs
- bold
- italic
- lists
- tables
- blockquotes
- code
- inline code

Sanitize HTML.

Never dangerously inject raw model output.

============================================================
11. MATHEMATICAL RENDERING
============================================================

Use KaTeX.

Support:

Inline:

$E = mc^2$

Block:

$$
F = ma
$$

Handle malformed model output robustly.

The UI must NOT display malformed expressions such as:

ext{Area}

frac{a}{b}

times

egin{aligned}

If the model produces malformed LaTeX, attempt safe normalization before
rendering.

Do not blindly modify valid LaTeX.

============================================================
12. IMAGE FUNCTIONALITY
============================================================

The frontend should support educational image cards.

The backend endpoint:

/api/image

will retrieve educational images.

The UI must support:

[IMAGE: topic]

internally.

The [IMAGE: ...] marker must NEVER appear visibly in the final AI
answer.

Display:

- image
- title
- source attribution where available

Use lazy loading.

Do not hotlink arbitrary unsafe content.

============================================================
13. GRAPH FUNCTIONALITY
============================================================

Support:

[GRAPH: y = x^2]

and similar graph instructions.

The marker must NOT appear in the visible AI response.

Render graphs in the Visuals & References panel.

Use a browser-side graphing library.

Support at minimum:

- y = x
- y = x^2
- y = sin(x)
- y = cos(x)
- simple polynomial functions
- simple exponential functions

Do NOT execute arbitrary JavaScript received from the model.

Parse graph expressions safely.

============================================================
14. HUGGING FACE BACKEND
============================================================

The frontend must communicate with the Hugging Face backend.

Environment variable:

NEXT_PUBLIC_HF_SPACE_ID=vedantjadhav701/vidya-1.7b

Do not hardcode the Space ID throughout the application.

Create:

lib/vidya.ts

This must contain the Hugging Face communication abstraction.

The React components must NOT directly call the Gradio client.

Architecture:

React component
      ↓
lib/vidya.ts
      ↓
Next.js API route if needed
      ↓
Hugging Face Space
      ↓
Vidya 1.7B

Do not expose Hugging Face private tokens to the browser.

If authentication is required, keep it server-side.

============================================================
15. CHAT API
============================================================

Create:

app/api/chat/route.ts

Responsibilities:

1. Validate request.
2. Validate message.
3. Validate conversation history.
4. Apply token/rate limits.
5. Call Hugging Face backend.
6. Return clean JSON.
7. Handle errors.
8. Never expose secrets.

Expected request:

{
  "message": "...",
  "history": [...],
  "language": "...",
  "subject": "..."
}

Expected response:

{
  "answer": "...",
  "usage": {
    "inputTokens": 123,
    "outputTokens": 256,
    "totalTokens": 379
  }
}

Do not expose internal model details unnecessarily.

============================================================
16. TOKEN USAGE / RATE LIMITING
============================================================

IMPORTANT.

Implement backend-side token accounting.

The user should NOT see:

"256 / 4096 tokens"

or:

"Token balance: 12345"

Do not make token usage part of the primary UI.

The system should silently calculate:

- input tokens
- output tokens
- total tokens
- requests
- rolling usage

The backend must enforce limits.

Do NOT rely on client-side JavaScript for security or rate limiting.

============================================================
17. CLAUDE-LIKE USAGE MODEL
============================================================

Implement a server-side usage system inspired by modern AI products.

Do NOT copy Claude branding or UI.

For each anonymous/session user:

Track:

sessionId
requestCount
inputTokens
outputTokens
totalTokens
windowStart
windowEnd

Example internal limits:

MAX_INPUT_TOKENS = 4096

MAX_OUTPUT_TOKENS = 512

MAX_REQUESTS_PER_WINDOW = configurable

MAX_TOTAL_TOKENS_PER_WINDOW = configurable

Make these configurable using environment variables.

Example:

VIDYA_MAX_INPUT_TOKENS=4096
VIDYA_MAX_OUTPUT_TOKENS=512
VIDYA_MAX_REQUESTS_PER_WINDOW=20
VIDYA_MAX_TOTAL_TOKENS_PER_WINDOW=10000

Do NOT hardcode these values in multiple files.

============================================================
18. IMPORTANT: TOKENIZER ACCURACY
============================================================

Do NOT estimate tokens using:

message.length / 4

Do NOT implement a fake token counter.

If possible, use the same tokenizer as the Vidya model on the backend.

If the frontend/server cannot access the model tokenizer, implement a
clearly documented fallback estimator, but isolate it behind:

lib/token-limit.ts

The final production architecture should preferably calculate token
usage using the actual model tokenizer.

============================================================
19. RATE LIMIT STORAGE
============================================================

For local development:

Use an in-memory store.

Clearly document:

This is development-only.

For Vercel production:

Do NOT depend on process memory because serverless instances are
ephemeral.

Create an abstraction:

UsageStore

with methods:

getUsage()
incrementUsage()
resetUsageIfNeeded()

Implement the interface so that Redis/Upstash can be added later.

Do not require Redis just to run the project locally.

============================================================
20. RATE LIMIT RESPONSE
============================================================

If the user exceeds the limit:

Do not reveal internal token accounting.

Return:

"Vidya is temporarily unavailable for this session. Please try again
later."

The frontend should show a clean non-technical error state.

Do not expose:

- token counts
- backend implementation
- Hugging Face errors
- stack traces
- API keys
- internal model errors

============================================================
21. CONVERSATION HISTORY
============================================================

Maintain conversation history in the playground.

Send history to backend in the expected format.

Avoid sending unlimited history.

Implement a configurable history window.

Example:

MAX_HISTORY_MESSAGES=20

Older messages should be trimmed.

Do not silently exceed the model's context window.

============================================================
22. STREAMING
============================================================

If the Hugging Face backend supports streaming:

Implement streaming.

The UI should show:

typing indicator
→ partial response
→ final response

If streaming is unavailable:

Use a clean non-streaming fallback.

Do not fake streaming by splitting a completed answer into characters.

============================================================
23. THINKING
============================================================

Vidya's visible UI must not display internal reasoning.

Never render:

<think>
...
</think>

If the backend accidentally returns a think block:

strip it before rendering.

Do not display:

"Thinking..."

as if it were model reasoning.

A simple UI loading state is allowed:

"Vidya is preparing your answer..."

============================================================
24. ERROR HANDLING
============================================================

Handle:

- backend unavailable
- timeout
- rate limit
- invalid response
- empty response
- network failure
- malformed Markdown
- malformed LaTeX
- invalid graph expression

Use user-friendly messages.

Never display raw exceptions.

============================================================
25. ANIMATIONS
============================================================

Use Framer Motion.

Animation philosophy:

Premium
Educational
Calm
Interactive

Use:

- subtle page transitions
- floating educational elements
- card hover effects
- message entrance animation
- graph reveal animation
- panel transitions
- button micro-interactions

Do NOT use:

- excessive bouncing
- distracting particles
- gaming-style UI
- excessive neon
- infinite animations everywhere

Animations must not reduce accessibility.

Respect:

prefers-reduced-motion.

============================================================
26. VISUAL DESIGN
============================================================

Create a unique Vidya visual language.

Do NOT copy:

ChatGPT
Claude
Gemini
Perplexity

Use an educational visual identity.

Recommended direction:

Modern academic + futuristic learning laboratory.

Visual elements:

- clean typography
- equation motifs
- subtle grid
- knowledge nodes
- mathematical diagrams
- scientific symbols
- cards resembling study notes
- elegant gradients
- subtle depth

Use strong hierarchy.

Avoid visual clutter.

============================================================
27. RESPONSIVE DESIGN
============================================================

Must work properly on:

Desktop
Laptop
Tablet
Mobile

Mobile requirements:

- bottom chat input
- collapsible header
- visual panel becomes drawer
- touch-friendly controls
- no horizontal scrolling

============================================================
28. ACCESSIBILITY
============================================================

Implement:

- semantic HTML
- keyboard navigation
- focus states
- accessible buttons
- aria labels where necessary
- sufficient contrast
- reduced-motion support

============================================================
29. SECURITY
============================================================

Never expose:

HF_TOKEN
HUGGING_FACE_HUB_TOKEN
private API keys
internal backend credentials

Never trust:

- user-provided graph code
- model-generated HTML
- model-generated JavaScript
- arbitrary image URLs

Sanitize model output.

Validate all API inputs server-side.

Implement basic request-size limits.

============================================================
30. ENVIRONMENT VARIABLES
============================================================

Create:

.env.example

Include:

NEXT_PUBLIC_HF_SPACE_ID=vedantjadhav701/vidya-1.7b

VIDYA_MAX_INPUT_TOKENS=4096
VIDYA_MAX_OUTPUT_TOKENS=512
VIDYA_MAX_REQUESTS_PER_WINDOW=20
VIDYA_MAX_TOTAL_TOKENS_PER_WINDOW=10000
MAX_HISTORY_MESSAGES=20

Optional:

HF_TOKEN=

Do not commit actual tokens.

============================================================
31. LOCAL DEVELOPMENT
============================================================

The frontend must run with:

npm install

npm run dev

Expected:

http://localhost:3000

Do NOT use:

127.0.0.1:11434
localhost:11434

Do NOT use:

127.0.0.1:5000
localhost:5000

Do NOT depend on Ollama.

Do NOT depend on Flask.

============================================================
32. PRODUCTION DEPLOYMENT
============================================================

The frontend is intended for:

GitHub → Vercel

The backend is:

Hugging Face Space

The frontend must therefore use production-safe environment variables.

NEXT_PUBLIC_HF_SPACE_ID is allowed to be public.

Private HF authentication tokens must NEVER use NEXT_PUBLIC_.

============================================================
33. ROUTING
============================================================

/

Landing page

/playground

AI playground

/playground?subject=mathematics

Subject-specific playground

/playground?subject=physics

etc.

============================================================
34. UX FLOW
============================================================

User visits:

/

↓

Landing page

↓

Clicks:

"Enter Playground"

↓

/playground

↓

Welcome screen

↓

User selects optional subject/language

↓

User asks question

↓

Frontend sends:

message
history
subject
language

↓

Next.js backend

↓

Hugging Face Vidya API

↓

Vidya response

↓

Markdown + KaTeX rendering

↓

If graph/image detected:

Visuals & References panel

↓

User continues conversation.

============================================================
35. NO FAKE FEATURES
============================================================

Do not create fake:

- search
- web browsing
- citations
- source verification
- live knowledge
- internet access
- image generation

unless an actual backend implementation exists.

Do not display "Powered by..." claims that are not true.

============================================================
36. CODE QUALITY
============================================================

Use:

- reusable components
- typed interfaces
- error boundaries where appropriate
- clean imports
- no unused variables
- no any unless absolutely necessary
- clear function names
- comments only where useful

Avoid giant files.

Separate:

UI
API
state
model communication
usage/rate limiting
rendering utilities

============================================================
37. PERFORMANCE
============================================================

Optimize:

- dynamic imports where appropriate
- image loading
- graph rendering
- Markdown rendering
- bundle size

Do not load large browser libraries unnecessarily on the landing page.

Graph rendering can be dynamically imported.

============================================================
38. SEO
============================================================

Implement metadata:

Title:

Vidya — Educational AI for Indian Students

Description:

"Vidya is a multilingual educational AI assistant designed to help
Indian students learn Mathematics, Physics, Chemistry, Biology and
more."

Add appropriate Open Graph metadata.

============================================================
39. FINAL VALIDATION
============================================================

After implementation run:

npm install

npm run lint

npm run build

Fix all TypeScript errors.

Fix all ESLint errors.

Fix all build errors.

Test:

1. Landing page loads.
2. Playground loads.
3. Navigation works.
4. Chat input works.
5. Backend request works.
6. Conversation history works.
7. Markdown renders.
8. LaTeX renders.
9. <think> blocks are hidden.
10. Graph markers work.
11. Image markers work.
12. Rate limits are enforced server-side.
13. Backend errors are handled.
14. Mobile layout works.
15. Desktop layout works.

============================================================
40. IMPORTANT FINAL REQUIREMENT
============================================================

Do NOT modify the existing backend.

Do NOT modify the existing webapp.

Do NOT delete existing files.

Only create/update files inside:

C:\Users\HP\projects\Vidya-1.7B\frontend-nextjs

At the end provide:

1. Complete file tree.
2. Dependencies installed.
3. Environment variables.
4. Local run commands.
5. Production build command.
6. Vercel deployment instructions.
7. Hugging Face backend integration details.
8. Rate-limit architecture.
9. Any unresolved integration issue.

The final result must feel like a real educational AI product called
VIDYA, not a generic chatbot template.