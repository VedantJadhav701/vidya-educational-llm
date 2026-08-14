# Vidya 1.7B - Next.js Frontend (`vidya-frontend`)

Vidya is a production-ready Next.js web application for NCERT-focused educational AI support in 11 Indian languages.

## Architecture

```
GitHub (vidya-frontend)
   ↓
Vercel
   ↓
Next.js App Router (Client & API Routes)
   ↓
Hugging Face Space (vedantjadhav701/vidya-1.7b)
   ↓
Vidya 1.7B (vedantjadhav701/edu-qwen-1.7b-merged)
```

## Features

- **Multilingual Support**: 11 Indian languages supported seamlessly with zero forced translation to Hindi.
- **Hugging Face ZeroGPU Backend**: Communicates directly with HF Space `vedantjadhav701/vidya-1.7b`.
- **KaTeX & Markdown Rendering**: Complete support for inline (`$A = l \times w$`) and display math equations (`$$A = l \times w$$`).
- **Visuals & Reference Panel**: Displays educational images from Wikipedia API and interactive mathematical graphs using client-side HTML5 Canvas.
- **No Local Inference Dependencies**: Fully decoupled from local Ollama (`127.0.0.1:11434`) and Flask (`127.0.0.1:5000`).

## Environment Variables

Create `.env.local` or set in Vercel:

```env
NEXT_PUBLIC_HF_SPACE_ID=vedantjadhav701/vidya-1.7b
```

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build & Validation

```bash
# Lint check
npm run lint

# Production build
npm run build
```

## Deployment to Vercel

1. Push this repository to GitHub as `vidya-frontend`.
2. Import project in Vercel dashboard.
3. Set environment variable `NEXT_PUBLIC_HF_SPACE_ID=vedantjadhav701/vidya-1.7b`.
4. Deploy!
