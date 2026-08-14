/**
 * Normalizes mathematical notation in Markdown text before rendering
 * to prevent common malformed LaTeX outputs from language models.
 */
export function normalizeMarkdown(text: string): string {
  if (!text) return '';

  let sanitized = text;

  // Fix unescaped LaTeX commands produced by some LLM tokenizer artifacts
  sanitized = sanitized.replace(/\bext\{/g, '\\text{');
  sanitized = sanitized.replace(/\bfrac\{/g, '\\frac{');
  sanitized = sanitized.replace(/\btimes\b/g, '\\times');
  sanitized = sanitized.replace(/\bsqrt\{/g, '\\sqrt{');

  // Normalize single dollar sign delimiters if needed
  return sanitized;
}
