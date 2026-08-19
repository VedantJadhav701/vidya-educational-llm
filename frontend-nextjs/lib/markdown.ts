/**
 * Normalizes mathematical notation in Markdown text before rendering
 * to prevent common malformed LaTeX outputs from language models.
 */
export function normalizeMarkdown(text: string): string {
  if (!text) return '';

  let sanitized = text;

  // Convert \( and \) to $ ... $ for remark-math compatibility
  sanitized = sanitized.replace(/\\\(/g, '$');
  sanitized = sanitized.replace(/\\\)/g, '$');
  
  // Convert \[ and \] to $$ ... $$ for remark-math compatibility
  sanitized = sanitized.replace(/\\\[/g, '$$$$');
  sanitized = sanitized.replace(/\\\]/g, '$$$$');

  // Fix unescaped LaTeX commands produced by some LLM tokenizer artifacts
  sanitized = sanitized.replace(/\bext\{/g, '\\text{');
  sanitized = sanitized.replace(/\bfrac\{/g, '\\frac{');
  sanitized = sanitized.replace(/\btimes\b/g, '\\times');
  sanitized = sanitized.replace(/\bsqrt\{/g, '\\sqrt{');

  // Strip [IMAGE: ...] and [GRAPH: ...] markers so they do not show in the rendered UI
  sanitized = sanitized.replace(/\[IMAGE:\s*.*?\]/gi, '');
  sanitized = sanitized.replace(/\[GRAPH:\s*.*?\]/gi, '');

  return sanitized.trim();
}
