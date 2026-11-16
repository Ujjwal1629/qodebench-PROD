import fs from 'node:fs';
import path from 'node:path';

// Blog posts are Markdown files in content/blog/<slug>.md, with a small
// frontmatter block on top. See content/blog/_template.md for the format.
// Files starting with "_" are ignored, and so are posts with `draft: true`.

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  author: string;
  tags: string[];
  /** Public tool slugs (lib/public-tools.ts) this post links to, and is listed on. */
  tools: string[];
  /** Optional cover image path under /public, e.g. /blog/prompt-injection.png */
  cover?: string;
  draft: boolean;
  content: string;
  readingMinutes: number;
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

// Minimal frontmatter parser: `key: value` lines and `key: [a, b, c]` lists.
// Enough for blog metadata without pulling in a YAML dependency.
function parseFrontmatter(raw: string): { data: Record<string, string | string[]>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };

  const data: Record<string, string | string[]> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (!m) continue;
    const value = m[2].trim();
    const unquote = (v: string) => v.trim().replace(/^["']|["']$/g, '');
    data[m[1]] =
      value.startsWith('[') && value.endsWith(']')
        ? value.slice(1, -1).split(',').map(unquote).filter(Boolean)
        : unquote(value);
  }
  return { data, body: match[2] };
}

const str = (v: unknown) => (typeof v === 'string' ? v : '');
const list = (v: unknown) => (Array.isArray(v) ? v : typeof v === 'string' && v ? [v] : []);

function readPost(file: string): BlogPost {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
  const { data, body } = parseFrontmatter(raw);
  const words = body.split(/\s+/).filter(Boolean).length;
  return {
    slug: file.replace(/\.md$/, ''),
    title: str(data.title) || file,
    description: str(data.description),
    date: str(data.date),
    author: str(data.author) || 'QodeBench Team',
    tags: list(data.tags),
    tools: list(data.tools),
    cover: str(data.cover) || undefined,
    draft: str(data.draft) === 'true',
    content: body.trim(),
    readingMinutes: Math.max(1, Math.round(words / 200)),
  };
}

/** Published posts, newest first. */
export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map(readPost)
    .filter((p) => !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getPostsForTool(toolSlug: string): BlogPost[] {
  return getAllPosts().filter((p) => p.tools.includes(toolSlug));
}

export function formatPostDate(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? date
    : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}
