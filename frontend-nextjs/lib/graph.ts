export interface GraphSeries {
  expr: string;
  points: { x: number; y: number }[];
  isVertical?: boolean;
  vVal?: number;
}

export function detectGraphExpr(userMessage: string, aiResponse?: string): string | null {
  // Check [GRAPH: ...] tag in AI response
  if (aiResponse) {
    const match = aiResponse.match(/\[GRAPH:\s*(.+?)\]/i);
    if (match && match[1]?.trim()) {
      return match[1].trim();
    }
  }

  // Failsafe: check user message for graph/plot intent
  const graphMatch = userMessage.match(/(?:graph|plot) (?:of|for) (?:the )?([a-zA-Z0-9\^x\+\-\*\/\(\)\.\s=,]+)/i);
  if (graphMatch && graphMatch[1]?.trim()) {
    return graphMatch[1].trim();
  }

  return null;
}

export function evaluateSafeMath(expr: string, xVal: number): number {
  let clean = expr.trim().toLowerCase();
  
  if (clean.startsWith('y=')) {
    clean = clean.substring(2).trim();
  } else if (clean.includes('=')) {
    const parts = clean.split('=');
    if (parts[0].trim() === 'y') clean = parts[1].trim();
    else if (parts[1].trim() === 'y') clean = parts[0].trim();
  }

  return parseAndEvaluate(clean, xVal);
}

function parseAndEvaluate(exprStr: string, x: number): number {
  let s = exprStr.replace(/\^/g, '**');
  s = s.replace(/(\d+)\s*([x\(\math])/gi, '$1*$2');
  s = s.replace(/x\s*(\d+)/gi, 'x*$1');

  try {
    return evalSimpleAST(s, x);
  } catch {
    return NaN;
  }
}

function evalSimpleAST(str: string, x: number): number {
  let i = 0;

  const peek = () => str[i];
  const consume = () => str[i++];

  function parseExpression(): number {
    let left = parseTerm();
    while (i < str.length && (peek() === '+' || peek() === '-')) {
      const op = consume();
      const right = parseTerm();
      if (op === '+') left += right;
      else left -= right;
    }
    return left;
  }

  function parseTerm(): number {
    let left = parsePower();
    while (i < str.length && (peek() === '*' || peek() === '/')) {
      const op = consume();
      const right = parsePower();
      if (op === '*') left *= right;
      else if (op === '/') left = right === 0 ? NaN : left / right;
    }
    return left;
  }

  function parsePower(): number {
    let left = parseFactor();
    if (i < str.length && str.substring(i, i + 2) === '**') {
      i += 2;
      const right = parsePower();
      left = Math.pow(left, right);
    }
    return left;
  }

  function parseFactor(): number {
    while (i < str.length && str[i] === ' ') i++;

    if (peek() === '-') {
      consume();
      return -parseFactor();
    }
    if (peek() === '+') {
      consume();
      return parseFactor();
    }

    if (peek() === '(') {
      consume();
      const val = parseExpression();
      if (peek() === ')') consume();
      return val;
    }

    const funcMatch = str.substring(i).match(/^(sin|cos|tan|log|exp|sqrt|abs)/i);
    if (funcMatch) {
      const funcName = funcMatch[1].toLowerCase();
      i += funcName.length;
      while (i < str.length && str[i] === ' ') i++;
      let arg = 0;
      if (peek() === '(') {
        consume();
        arg = parseExpression();
        if (peek() === ')') consume();
      } else {
        arg = parseFactor();
      }

      switch (funcName) {
        case 'sin': return Math.sin(arg);
        case 'cos': return Math.cos(arg);
        case 'tan': return Math.tan(arg);
        case 'log': return Math.log(arg);
        case 'exp': return Math.exp(arg);
        case 'sqrt': return Math.sqrt(arg);
        case 'abs': return Math.abs(arg);
      }
    }

    if (peek() === 'x' || peek() === 'X') {
      consume();
      return x;
    }

    let numStr = '';
    while (i < str.length && (str[i] >= '0' && str[i] <= '9' || str[i] === '.')) {
      numStr += consume();
    }
    if (numStr.length > 0) {
      return parseFloat(numStr);
    }

    return NaN;
  }

  return parseExpression();
}

export function generateGraphData(rawExprStr: string): GraphSeries[] {
  const expressions = rawExprStr.split(',').map((e) => e.trim()).filter(Boolean);
  const seriesList: GraphSeries[] = [];

  for (const expr of expressions) {
    const clean = expr.toLowerCase();

    if (clean.startsWith('x=') || clean.startsWith('x =')) {
      const vValStr = clean.split('=')[1]?.trim();
      const vVal = parseFloat(vValStr);
      if (!isNaN(vVal)) {
        seriesList.push({ expr, points: [], isVertical: true, vVal });
        continue;
      }
    }

    const points: { x: number; y: number }[] = [];
    const step = 0.2;
    for (let x = -10; x <= 10; x += step) {
      const y = evaluateSafeMath(clean, x);
      if (!isNaN(y) && isFinite(y) && Math.abs(y) <= 100) {
        points.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
      }
    }
    seriesList.push({ expr, points });
  }

  return seriesList;
}
