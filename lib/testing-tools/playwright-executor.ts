/**
 * Simulated Playwright Executor
 *
 * Parses a subset of Playwright API calls and executes them against the live DOM.
 * Supports: page.getByTestId, page.getByRole, page.getByText, page.getByLabel,
 *           page.locator, .fill(), .click(), .check(), .uncheck(), .selectOption(),
 *           expect().toBeVisible(), expect().toHaveText(), expect().toContainText(),
 *           expect().toHaveAttribute(), expect().toBeChecked(), expect().not.*
 */

export interface StepResult {
  line: number;
  code: string;
  status: 'pass' | 'fail' | 'skip';
  message?: string;
  duration: number;
}

export interface ExecutionResult {
  steps: StepResult[];
  passed: number;
  failed: number;
  duration: number;
}

// Resolve a locator chain to an HTMLElement within a container
function resolveLocator(chain: string, container: HTMLElement): HTMLElement | null {
  let current: HTMLElement | null = container;

  // Split chain by dots, but respect parentheses
  const calls = parseChain(chain);

  for (const call of calls) {
    if (!current) return null;

    const match = call.match(/^(\w+)\((.*)?\)$/);
    if (!match) return null;

    const [, method, rawArgs] = match;
    const args = rawArgs ? parseArgs(rawArgs) : [];

    current = resolveMethod(method, args, current);
  }

  return current;
}

function parseChain(chain: string): string[] {
  const calls: string[] = [];
  let depth = 0;
  let current = '';

  for (let i = 0; i < chain.length; i++) {
    const ch = chain[i];
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === '.' && depth === 0 && current) {
      calls.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current) calls.push(current);
  return calls;
}

function parseArgs(raw: string): string[] {
  // Handle string args like 'value' or "value" and object args like { name: "x" }
  const args: string[] = [];
  let i = 0;
  while (i < raw.length) {
    if (raw[i] === "'" || raw[i] === '"') {
      const quote = raw[i];
      let j = i + 1;
      while (j < raw.length && raw[j] !== quote) j++;
      args.push(raw.substring(i + 1, j));
      i = j + 1;
    } else if (raw[i] === '{') {
      let j = i + 1;
      let depth = 1;
      while (j < raw.length && depth > 0) {
        if (raw[j] === '{') depth++;
        if (raw[j] === '}') depth--;
        j++;
      }
      args.push(raw.substring(i, j));
      i = j;
    } else {
      i++;
    }
  }
  return args;
}

function parseObjectArg(raw: string): Record<string, string> {
  const result: Record<string, string> = {};
  // Simple parser for { name: "value", key: 'value' }
  const pairs = raw.replace(/^\{|\}$/g, '').split(',');
  for (const pair of pairs) {
    const colonIdx = pair.indexOf(':');
    if (colonIdx === -1) continue;
    const key = pair.substring(0, colonIdx).trim();
    const val = pair.substring(colonIdx + 1).trim().replace(/^['"]|['"]$/g, '');
    result[key] = val;
  }
  return result;
}

function resolveMethod(method: string, args: string[], context: HTMLElement): HTMLElement | null {
  switch (method) {
    case 'getByTestId': {
      return context.querySelector(`[data-testid="${args[0]}"]`) as HTMLElement | null;
    }
    case 'getByText': {
      const text = args[0];
      const walker = document.createTreeWalker(context, NodeFilter.SHOW_ELEMENT);
      let node: Node | null = walker.nextNode();
      while (node) {
        const el = node as HTMLElement;
        if (el.textContent?.trim().includes(text) && el.children.length === 0) {
          return el;
        }
        node = walker.nextNode();
      }
      // Fallback: any element containing the text
      const all = context.querySelectorAll('*');
      for (const el of all) {
        if (el.textContent?.trim().includes(text)) return el as HTMLElement;
      }
      return null;
    }
    case 'getByRole': {
      const role = args[0];
      const opts = args[1] ? parseObjectArg(args[1]) : {};
      const roleMap: Record<string, string> = {
        button: 'button, [role="button"], input[type="submit"], input[type="button"]',
        textbox: 'input[type="text"], input[type="email"], input[type="password"], input:not([type]), textarea',
        checkbox: 'input[type="checkbox"]',
        radio: 'input[type="radio"]',
        link: 'a[href]',
        heading: 'h1, h2, h3, h4, h5, h6',
        listitem: 'li',
        option: 'option',
        combobox: 'select',
        row: 'tr',
      };
      const selector = roleMap[role] || `[role="${role}"]`;
      const candidates = context.querySelectorAll(selector);
      if (opts.name) {
        for (const el of candidates) {
          const elText = (el as HTMLElement).textContent?.trim() || '';
          const ariaLabel = el.getAttribute('aria-label') || '';
          const placeholder = el.getAttribute('placeholder') || '';
          const value = (el as HTMLInputElement).value || '';
          if (elText.includes(opts.name) || ariaLabel.includes(opts.name) || placeholder.includes(opts.name)) {
            return el as HTMLElement;
          }
        }
        return null;
      }
      return (candidates[0] as HTMLElement) || null;
    }
    case 'getByLabel': {
      const labelText = args[0];
      const labels = context.querySelectorAll('label');
      for (const label of labels) {
        if (label.textContent?.trim().includes(labelText)) {
          const forId = label.getAttribute('for');
          if (forId) return context.querySelector(`#${forId}`) as HTMLElement | null;
          return label.querySelector('input, select, textarea') as HTMLElement | null;
        }
      }
      return null;
    }
    case 'getByPlaceholder': {
      return context.querySelector(`[placeholder*="${args[0]}"]`) as HTMLElement | null;
    }
    case 'locator': {
      return context.querySelector(args[0]) as HTMLElement | null;
    }
    case 'first': {
      return context;
    }
    case 'last': {
      return context;
    }
    default:
      return null;
  }
}

// Extract locator from a page.xxx(...) or page.locator(...) expression
function extractLocator(line: string): { locatorChain: string; action: string; actionArgs: string[] } | null {
  // Match: page.getByTestId('x').fill('y')  or  page.locator('.x').click()
  const pageMatch = line.match(/page\.(.+)/);
  if (!pageMatch) return null;

  const full = pageMatch[1];

  // Find the last method call that is an action
  const actions = ['fill', 'click', 'check', 'uncheck', 'selectOption', 'clear', 'press', 'hover', 'focus', 'blur'];

  for (const action of actions) {
    const actionPattern = new RegExp(`\\.${action}\\(([^)]*)\\)\\s*;?\\s*$`);
    const m = full.match(actionPattern);
    if (m) {
      const locatorChain = full.substring(0, full.lastIndexOf(`.${action}(`));
      const rawArgs = m[1];
      const args = rawArgs ? parseArgs(rawArgs) : [];
      return { locatorChain, action, actionArgs: args };
    }
  }

  return null;
}

// Extract assertion from expect(page.xxx).toXxx()
function extractAssertion(line: string): {
  locatorChain: string;
  assertion: string;
  args: string[];
  negated: boolean;
} | null {
  // Match: expect(page.xxx).toBeVisible()  or  expect(page.xxx).not.toBeVisible()
  const m = line.match(/expect\(page\.(.+?)\)\.(not\.)?(\w+)\(([^)]*)\)/);
  if (!m) return null;

  return {
    locatorChain: m[1],
    negated: !!m[2],
    assertion: m[3],
    args: m[4] ? parseArgs(m[4]) : [],
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function executePlaywrightCode(
  code: string,
  containerSelector: string = '[data-testid="tool-container"]'
): Promise<ExecutionResult> {
  const container = document.querySelector(containerSelector) as HTMLElement;
  if (!container) {
    return {
      steps: [{ line: 0, code: 'Setup', status: 'fail', message: 'Tool container not found', duration: 0 }],
      passed: 0, failed: 1, duration: 0,
    };
  }

  const lines = code
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('//') && !l.startsWith('import') && !l.startsWith('test(') && !l.startsWith('});') && !l.startsWith('await page.goto'));

  const steps: StepResult[] = [];
  const startTime = Date.now();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip non-executable lines
    if (line === '{' || line === '}' || line === ');' || line.startsWith('const ') || line.startsWith('let ') || line.startsWith('//')) {
      continue;
    }

    const cleanLine = line.replace(/^await\s+/, '').replace(/;$/, '').trim();
    const stepStart = Date.now();

    // Try action
    const actionInfo = extractLocator(cleanLine);
    if (actionInfo) {
      const el = resolveLocator(actionInfo.locatorChain, container);
      if (!el) {
        steps.push({
          line: i + 1,
          code: line,
          status: 'fail',
          message: `Element not found: ${actionInfo.locatorChain}`,
          duration: Date.now() - stepStart,
        });
        continue;
      }

      try {
        await performAction(el, actionInfo.action, actionInfo.actionArgs);
        // Small delay to let React state update
        await delay(150);
        steps.push({
          line: i + 1,
          code: line,
          status: 'pass',
          duration: Date.now() - stepStart,
        });
      } catch (err: any) {
        steps.push({
          line: i + 1,
          code: line,
          status: 'fail',
          message: err.message,
          duration: Date.now() - stepStart,
        });
      }
      continue;
    }

    // Try assertion (with auto-retry like real Playwright)
    const assertionInfo = extractAssertion(cleanLine);
    if (assertionInfo) {
      const maxRetries = 10;
      const retryDelay = 200; // ms between retries
      let lastResult = { pass: false, message: 'Element not found' };

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        const el = resolveLocator(assertionInfo.locatorChain, container);
        try {
          lastResult = checkAssertion(el, assertionInfo.assertion, assertionInfo.args, assertionInfo.negated);
          if (lastResult.pass) break;
        } catch (err: any) {
          lastResult = { pass: false, message: err.message };
        }
        if (attempt < maxRetries - 1) await delay(retryDelay);
      }

      steps.push({
        line: i + 1,
        code: line,
        status: lastResult.pass ? 'pass' : 'fail',
        message: lastResult.pass ? undefined : lastResult.message,
        duration: Date.now() - stepStart,
      });
      continue;
    }

    // Skip unrecognized lines silently
  }

  const totalDuration = Date.now() - startTime;
  const passed = steps.filter((s) => s.status === 'pass').length;
  const failed = steps.filter((s) => s.status === 'fail').length;

  return { steps, passed, failed, duration: totalDuration };
}

async function performAction(el: HTMLElement, action: string, args: string[]) {
  switch (action) {
    case 'fill': {
      const input = el as HTMLInputElement;
      // Focus the element
      input.focus();
      // Set value via native input setter to trigger React's onChange
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, 'value'
      )?.set;
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(input, args[0] || '');
      } else {
        input.value = args[0] || '';
      }
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      break;
    }
    case 'clear': {
      const input = el as HTMLInputElement;
      input.focus();
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, 'value'
      )?.set;
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(input, '');
      } else {
        input.value = '';
      }
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      break;
    }
    case 'click': {
      el.click();
      break;
    }
    case 'check': {
      const checkbox = el as HTMLInputElement;
      if (!checkbox.checked) checkbox.click();
      break;
    }
    case 'uncheck': {
      const checkbox = el as HTMLInputElement;
      if (checkbox.checked) checkbox.click();
      break;
    }
    case 'selectOption': {
      const select = el as HTMLSelectElement;
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLSelectElement.prototype, 'value'
      )?.set;
      if (nativeSetter) {
        nativeSetter.call(select, args[0] || '');
      } else {
        select.value = args[0] || '';
      }
      select.dispatchEvent(new Event('change', { bubbles: true }));
      break;
    }
    case 'hover': {
      el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      break;
    }
    case 'focus': {
      el.focus();
      break;
    }
    case 'press': {
      el.dispatchEvent(new KeyboardEvent('keydown', { key: args[0] || 'Enter', bubbles: true }));
      el.dispatchEvent(new KeyboardEvent('keyup', { key: args[0] || 'Enter', bubbles: true }));
      if (args[0] === 'Enter') {
        // Submit nearest form
        const form = el.closest('form');
        if (form) form.dispatchEvent(new Event('submit', { bubbles: true }));
      }
      break;
    }
    default:
      throw new Error(`Unsupported action: ${action}`);
  }
}

function checkAssertion(
  el: HTMLElement | null,
  assertion: string,
  args: string[],
  negated: boolean
): { pass: boolean; message: string } {
  let pass = false;
  let message = '';

  switch (assertion) {
    case 'toBeVisible': {
      const visible = el !== null && el.offsetParent !== null && getComputedStyle(el).display !== 'none';
      pass = negated ? !visible : visible;
      message = negated
        ? `Expected element to be hidden but it is visible`
        : `Expected element to be visible but it was ${el ? 'hidden' : 'not found'}`;
      break;
    }
    case 'toBeHidden': {
      const hidden = el === null || el.offsetParent === null || getComputedStyle(el).display === 'none';
      pass = negated ? !hidden : hidden;
      message = negated
        ? `Expected element to be visible but it is hidden`
        : `Expected element to be hidden but it is visible`;
      break;
    }
    case 'toHaveText': {
      if (!el) { pass = negated; message = 'Element not found'; break; }
      const text = el.textContent?.trim() || '';
      const expected = args[0] || '';
      const matches = text === expected;
      pass = negated ? !matches : matches;
      message = `Expected text "${expected}", got "${text}"`;
      break;
    }
    case 'toContainText': {
      if (!el) { pass = negated; message = 'Element not found'; break; }
      const text = el.textContent?.trim() || '';
      const expected = args[0] || '';
      const contains = text.includes(expected);
      pass = negated ? !contains : contains;
      message = negated
        ? `Expected text to NOT contain "${expected}", but it does`
        : `Expected text to contain "${expected}", got "${text}"`;
      break;
    }
    case 'toHaveAttribute': {
      if (!el) { pass = negated; message = 'Element not found'; break; }
      const attr = args[0] || '';
      const expected = args[1];
      const actual = el.getAttribute(attr);
      if (expected !== undefined) {
        const matches = actual === expected;
        pass = negated ? !matches : matches;
        message = `Expected attribute "${attr}" to be "${expected}", got "${actual}"`;
      } else {
        const has = actual !== null;
        pass = negated ? !has : has;
        message = `Expected element to ${negated ? 'not ' : ''}have attribute "${attr}"`;
      }
      break;
    }
    case 'toBeChecked': {
      if (!el) { pass = negated; message = 'Element not found'; break; }
      const checked = (el as HTMLInputElement).checked;
      pass = negated ? !checked : checked;
      message = `Expected element to be ${negated ? 'unchecked' : 'checked'} but it is ${checked ? 'checked' : 'unchecked'}`;
      break;
    }
    case 'toHaveValue': {
      if (!el) { pass = negated; message = 'Element not found'; break; }
      const value = (el as HTMLInputElement).value;
      const expected = args[0] || '';
      const matches = value === expected;
      pass = negated ? !matches : matches;
      message = `Expected value "${expected}", got "${value}"`;
      break;
    }
    case 'toBeEnabled': {
      if (!el) { pass = negated; message = 'Element not found'; break; }
      const disabled = (el as HTMLInputElement).disabled;
      pass = negated ? disabled : !disabled;
      message = `Expected element to be ${negated ? 'disabled' : 'enabled'}`;
      break;
    }
    case 'toBeDisabled': {
      if (!el) { pass = negated; message = 'Element not found'; break; }
      const disabled = (el as HTMLInputElement).disabled;
      pass = negated ? !disabled : disabled;
      message = `Expected element to be ${negated ? 'enabled' : 'disabled'}`;
      break;
    }
    default:
      message = `Unsupported assertion: ${assertion}`;
      pass = false;
  }

  return { pass, message };
}
