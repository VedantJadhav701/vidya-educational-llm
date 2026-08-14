I have an existing Vidya educational AI web application located at:

C:\Users\HP\projects\Vidya-1.7B\webapp

This is the CURRENT working frontend.

IMPORTANT:
Before writing any code, thoroughly inspect the entire existing webapp directory.

Inspect:
- all HTML files
- all CSS files
- all JavaScript files
- assets
- images
- icons
- configuration files
- existing API calls
- existing UI behavior
- existing chat implementation
- graph implementation
- image/reference implementation
- Markdown rendering
- KaTeX/math rendering
- streaming implementation
- loading states
- splash screen
- responsive behavior

Do NOT assume the implementation from the description below.
Use the existing webapp as the source of truth for the current UI and behavior.

============================================================
GOAL
============================================================

Migrate the existing Vidya frontend from vanilla HTML/CSS/JavaScript
to a production-ready Next.js application.

Create the NEW application at:

C:\Users\HP\projects\Vidya-1.7B\frontend-nextjs

DO NOT modify:

C:\Users\HP\projects\Vidya-1.7B\webapp

DO NOT delete, move, rename, or overwrite any files in the existing
webapp directory.

The old webapp must remain completely intact as a reference/fallback.

============================================================
TECHNOLOGY
============================================================

Use:

- Next.js latest stable compatible version
- React
- TypeScript
- Tailwind CSS where useful
- KaTeX
- react-markdown
- remark-math
- rehype-katex

Use the Next.js App Router.

Use client components only where browser interactivity is required.

Keep the architecture modular and production-ready.

============================================================
EXISTING UI/UX
============================================================

The new Next.js application must preserve the existing Vidya design
as closely as practical.

Do NOT redesign the product unnecessarily.

Preserve the existing:

- Vidya branding
- splash screen
- splash animation
- loading/progress behavior
- chat layout
- chat header
- model status indicator
- user message bubbles
- AI message bubbles
- message spacing
- typography
- gradients
- cards
- shadows
- rounded corners
- typing indicator
- send button
- input behavior
- keyboard behavior
- conversation history
- auto-scroll
- Markdown rendering
- mathematical rendering
- Visuals & Reference panel
- image cards
- graph cards
- responsive layout
- desktop layout
- tablet layout
- mobile layout

Reuse existing CSS values, animations, colors, spacing, and UI logic
where appropriate.

Do not blindly copy broken legacy code.
Preserve the intended behavior while implementing it properly in
React/Next.js.

============================================================
IMPORTANT BACKEND CHANGE
============================================================

The old frontend may contain local backend connections.

Remove ALL local Ollama dependencies.

NEVER use:

http://127.0.0.1:11434
http://localhost:11434

Remove ALL local Flask dependencies.

NEVER use:

http://127.0.0.1:5000
http://localhost:5000

The new frontend must not depend on my local computer for inference.

============================================================
ONLINE AI BACKEND
============================================================

The production AI backend is:

Hugging Face Space:

vedantjadhav701/vidya-1.7b

The Space runs:

Vidya 1.7B

Model:

vedantjadhav701/edu-qwen-1.7b-merged

The Hugging Face Space is a Gradio application.

Use the Hugging Face Gradio API/client to communicate with the
Space.

Do NOT download the model into the Next.js project.

Do NOT put model weights into the frontend repository.

Do NOT use Ollama.

Do NOT use a local Python inference server.

============================================================
BACKEND ABSTRACTION
============================================================

Create:

lib/vidya.ts

This file must contain the Hugging Face/Gradio communication logic.

The UI components must NOT directly contain Hugging Face API calls.

The UI should communicate through a clean abstraction such as:

sendMessage(...)
streamMessage(...)
checkBackendHealth(...)

Use strong TypeScript types.

The Hugging Face Space ID must come from:

NEXT_PUBLIC_HF_SPACE_ID

Example:

NEXT_PUBLIC_HF_SPACE_ID=vedantjadhav701/vidya-1.7b

Create:

.env.example

Do NOT commit real secrets.

Do NOT put Hugging Face access tokens into client-side code.

If the Gradio API requires authentication for any operation, keep
the token server-side only.

============================================================
CHAT
============================================================

Implement a proper production chat flow.

Requirements:

- conversation history
- user messages
- assistant messages
- loading state
- error state
- retry behavior
- clear chat
- auto-scroll
- Enter to send
- Shift+Enter for newline
- disabled send button while appropriate
- proper request cancellation if practical
- prevent duplicate submissions
- preserve the existing typing indicator

Use the existing webapp's behavior as the reference.

============================================================
STREAMING
============================================================

Inspect how streaming works in the existing webapp.

If the Hugging Face Gradio endpoint supports streaming compatible with
the required interaction:

Implement streaming.

If streaming is not reliably available through the deployed Gradio
endpoint:

Implement a clean non-streaming fallback.

The UI must work in either case.

Do not fake streaming by artificially splitting a completed response
unless there is no alternative.

============================================================
THINKING MUST BE OFF
============================================================

Vidya is configured to answer without visible thinking.

The frontend must NOT display:

<think>
</think>

or:

Thinking...
Reasoning...
Analysis...
Planning...

If the backend accidentally returns a think block, the frontend must
safely remove the hidden reasoning block before displaying the answer.

Do not expose internal chain-of-thought to the user.

============================================================
MARKDOWN
============================================================

Render assistant responses as Markdown.

Use:

react-markdown
remark-math
rehype-katex

Support:

- headings
- paragraphs
- bold
- italic
- unordered lists
- ordered lists
- code
- code blocks
- blockquotes
- tables where appropriate
- inline mathematics
- display mathematics

Style Markdown to match the existing Vidya UI.

============================================================
MATHEMATICAL FORMULAS
============================================================

Mathematical rendering is important for Vidya.

Use KaTeX.

Correctly support:

Inline:

$A = l \\times w$

Display:

$$
A = l \\times w
$$

Also support common educational equations.

The frontend must NOT render malformed LaTeX.

Examples of malformed model output that should NOT be rendered
literally:

ext{Area}
ext{length}
frac{a}{b}
times

Implement a small safe normalization layer before Markdown/KaTeX
rendering if necessary.

Do NOT blindly modify valid mathematical notation.

Preserve mathematically correct expressions.

============================================================
VISUALS & REFERENCE PANEL
============================================================

Preserve the existing Visuals & Reference side panel.

It should support:

- educational images
- graphs
- image titles
- graph titles
- empty state
- loading state
- responsive behavior
- scrolling

The panel should remain synchronized with the current conversation.

============================================================
IMAGE FUNCTIONALITY
============================================================

The existing webapp has image/reference functionality.

Inspect the current implementation and preserve its intended behavior.

Create:

app/api/image/route.ts

This route should query Wikipedia's public API for educational images.

Return a safe JSON response such as:

{
  "url": "...",
  "title": "..."
}

Do not expose API secrets to the browser.

Use proper URL validation and error handling.

If Wikipedia returns no useful image, return a clean "not found"
response rather than breaking the UI.

============================================================
IMAGE TAGS
============================================================

The existing system uses the concept:

[IMAGE: ...]

Preserve this concept.

If Vidya returns something like:

[IMAGE: Photosynthesis]

the frontend should:

1. detect the image instruction
2. request the image through the Next.js image route
3. display the image in the Visuals & Reference panel
4. remove the [IMAGE: ...] tag from the visible AI answer

The raw tag must NOT appear in the final chat message.

Make parsing robust.

Do not remove legitimate text that happens to contain brackets.

============================================================
GRAPH FUNCTIONALITY
============================================================

The old application uses a Python/Flask graph backend.

The new Next.js frontend must NOT depend on the old Flask backend.

Do not use:

http://127.0.0.1:5000
http://localhost:5000

Implement graph rendering in the browser.

Use an appropriate client-side graphing library.

Prefer an interactive graphing solution suitable for educational
mathematics.

For example:

User:
graph y = x^2

The UI should:

1. detect the graph request/instruction
2. parse the supported equation safely
3. render the graph in the Visuals & Reference panel
4. keep the graph separate from the AI answer
5. remove the internal [GRAPH: ...] instruction from visible text

Preserve the existing [GRAPH: ...] concept if it exists in the
current webapp.

Do NOT use eval() to execute arbitrary mathematical expressions.

Use a safe parser/evaluator.

============================================================
GRAPH SECURITY
============================================================

Never execute arbitrary JavaScript from a model-generated expression.

Do NOT use:

eval()
new Function()

for graph expressions.

Only support a defined mathematical subset.

If an expression cannot be parsed safely, show a clear error rather
than executing it.

============================================================
RESPONSIVE DESIGN
============================================================

The new frontend must work correctly on:

- desktop
- laptop
- tablet
- mobile

Preserve the existing desktop two-panel layout where appropriate.

On smaller screens, adapt the Visuals & Reference panel so it does
not make the chat unusable.

Do not simply shrink the desktop layout.

Use responsive breakpoints.

============================================================
SECURITY
============================================================

Treat model output as untrusted text.

Do not use:

dangerouslySetInnerHTML

unless absolutely necessary and only with proper sanitization.

Do not execute HTML/JavaScript returned by the model.

Do not execute model-generated graph code.

Validate API inputs.

Validate image URLs.

Handle network errors.

Handle Hugging Face Space failures gracefully.

============================================================
ERROR HANDLING
============================================================

Implement proper user-facing states for:

- backend unavailable
- backend waking up
- generation timeout
- generation error
- image search failure
- graph parsing failure
- malformed response
- empty response

Do not expose raw stack traces to the user.

Use useful messages such as:

"Vidya is waking up. Please try again in a moment."

============================================================
PERFORMANCE
============================================================

Optimize the Next.js application.

Requirements:

- avoid unnecessary re-renders
- use client components only where needed
- lazy-load heavy graph components
- do not load KaTeX unnecessarily on unrelated pages
- avoid unnecessary API requests
- debounce or guard expensive UI operations where appropriate
- use proper React keys
- keep the initial bundle reasonable

============================================================
ACCESSIBILITY
============================================================

Add:

- accessible buttons
- aria-labels where needed
- keyboard navigation
- visible focus states
- proper textarea labeling
- accessible loading states

Do not sacrifice accessibility for visual design.

============================================================
PROJECT STRUCTURE
============================================================

Create a clean structure similar to:

frontend-nextjs/

├── app/
│   ├── api/
│   │   └── image/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── Chat/
│   │   ├── Chat.tsx
│   │   ├── Message.tsx
│   │   ├── MessageList.tsx
│   │   └── ChatInput.tsx
│   │
│   ├── Media/
│   │   ├── MediaPanel.tsx
│   │   ├── ImageCard.tsx
│   │   └── GraphCard.tsx
│   │
│   ├── SplashScreen.tsx
│   └── ModelStatus.tsx
│
├── lib/
│   ├── vidya.ts
│   ├── image.ts
│   ├── graph.ts
│   ├── markdown.ts
│   └── types.ts
│
├── public/
│   └── assets/
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── README.md

The exact structure may be adjusted if there is a better
production architecture.

============================================================
ASSETS
============================================================

Inspect the existing:

C:\Users\HP\projects\Vidya-1.7B\webapp

for:

- logos
- icons
- SVGs
- images
- fonts
- other assets

Reuse appropriate assets in:

frontend-nextjs/public/assets/

Do not copy unnecessary files.

Do not copy model files.

============================================================
NO BACKEND MODIFICATION
============================================================

There is an existing backend at:

C:\Users\HP\projects\Vidya-1.7B\backend-huggingface

DO NOT modify it.

The frontend must consume the already deployed Hugging Face Space:

vedantjadhav701/vidya-1.7b

Do not change the backend implementation as part of this task.

============================================================
GITHUB
============================================================

This frontend is intended to become a separate GitHub repository.

Prepare the project so that it can be pushed to GitHub.

Repository name:

vidya-frontend

Do NOT initialize or push to GitHub automatically unless explicitly
requested.

Do NOT push secrets.

Create a useful README explaining:

- project purpose
- architecture
- installation
- environment variables
- local development
- production build
- deployment to Vercel
- Hugging Face backend configuration

============================================================
VERCEL
============================================================

The intended deployment is:

GitHub
   ↓
Vercel
   ↓
Next.js frontend
   ↓
Hugging Face Space
   ↓
Vidya 1.7B

Ensure the application works correctly when deployed to Vercel.

Do not assume localhost URLs.

============================================================
ENVIRONMENT VARIABLES
============================================================

Create:

.env.example

with:

NEXT_PUBLIC_HF_SPACE_ID=vedantjadhav701/vidya-1.7b

If additional server-only variables are required, document them
without exposing them to client components.

Never hardcode tokens.

============================================================
VALIDATION
============================================================

After implementation:

1. Install dependencies:

npm install

2. Run lint:

npm run lint

3. Run production build:

npm run build

4. Run development server:

npm run dev

5. Test:

- English question
- Hindi question
- Marathi question
- Tamil question
- mathematics question
- science question
- multi-turn conversation
- image request
- graph request
- malformed/empty input
- backend unavailable state
- mobile layout

6. Confirm that there are NO references to:

127.0.0.1:11434
localhost:11434
127.0.0.1:5000
localhost:5000
Ollama

Search the entire new project for these strings before finishing.

============================================================
IMPORTANT MODEL TESTS
============================================================

Use these test cases:

1.

What is photosynthesis?

2.

A farmer has a rectangular field that is 80 m long and 50 m wide.
He builds a pathway of width 2 m inside all four sides.
Calculate the area of the field, inner area, area per crop if divided
among 4 crops, and percentage occupied by the pathway.

3.

प्रकाश संश्लेषण क्या है?

4.

प्रकाश संश्लेषण म्हणजे काय?

5.

Explain Newton's three laws of motion.

Verify that the UI preserves the language returned by Vidya and does
not accidentally translate or change it.

============================================================
SOURCE OF TRUTH
============================================================

The existing webapp is the source of truth for:

- visual design
- layout
- UI behavior
- animations
- existing user experience
- existing feature behavior

The Hugging Face Space is the source of truth for:

- AI inference
- model responses

Do not invent replacement UI behavior when the existing webapp already
implements it correctly.

============================================================
DO NOT OVERENGINEER
============================================================

Do not add:

- authentication
- database
- analytics
- payments
- user accounts
- unnecessary backend services
- unnecessary state-management libraries

unless they already exist in the current webapp and are required to
preserve functionality.

The goal is a clean, reliable first production deployment.

============================================================
FINAL REPORT
============================================================

After completing the migration, provide a concise report containing:

1. Existing webapp files inspected.

2. Files created in:

C:\Users\HP\projects\Vidya-1.7B\frontend-nextjs

3. Files/components migrated.

4. Dependencies installed.

5. Environment variables required.

6. Hugging Face backend endpoint/configuration used.

7. Local development command.

8. Production build command.

9. Vercel deployment instructions.

10. Validation results:

npm install
npm run lint
npm run build

11. Test results for:
- English
- Hindi
- Marathi
- Tamil
- mathematics
- image
- graph
- multi-turn chat

12. Any remaining issues.

IMPORTANT:
Do not claim something was tested if it was not actually tested.

============================================================
FINAL CONSTRAINTS
============================================================

DO NOT modify:

C:\Users\HP\projects\Vidya-1.7B\webapp

DO NOT modify:

C:\Users\HP\projects\Vidya-1.7B\backend-huggingface

ONLY create/modify:

C:\Users\HP\projects\Vidya-1.7B\frontend-nextjs

The final result must be a standalone Next.js frontend ready to
become the GitHub repository:

vidya-frontend

and deploy through Vercel.