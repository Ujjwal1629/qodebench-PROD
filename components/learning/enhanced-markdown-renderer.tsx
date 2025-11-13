'use client';

import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { CodeBlockWithCopy } from './code-block-with-copy';
import { CalloutBox } from './callout-box';

interface EnhancedMarkdownRendererProps {
  content: string;
  className?: string;
  skipFirstH1?: boolean; // Skip first H1 to avoid duplicate titles
}

// Remove first H1 heading from markdown content
function removeFirstH1(content: string): string {
  // Match first H1 heading (# Heading or # Heading with trailing content)
  return content.replace(/^#\s+.+$/m, '');
}

// Parse callout syntax (:::type Title\nContent\n:::)
function parseCallouts(content: string): string {
  return content.replace(
    /:::(\w+)(?:\s+([^\n]*))?\n([\s\S]*?):::/g,
    (match, type, title, body) => {
      // Validate callout type
      const validTypes = ['tip', 'warning', 'info', 'success'];
      const calloutType = validTypes.includes(type.toLowerCase())
        ? type.toLowerCase()
        : 'info';

      // Create a unique marker that we can identify in the renderer
      return `\n\n<CALLOUT_${calloutType.toUpperCase()}_START${title ? `_TITLE_${title}` : ''}>\n${body.trim()}\n<CALLOUT_END>\n\n`;
    }
  );
}

// Generate anchor ID from heading text
function generateAnchorId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function EnhancedMarkdownRenderer({
  content,
  className = '',
  skipFirstH1 = true,
}: EnhancedMarkdownRendererProps) {
  // Pre-process content: remove first H1 if needed, then handle callouts
  let processedContent = skipFirstH1 ? removeFirstH1(content) : content;
  processedContent = parseCallouts(processedContent);

  // Track if we're currently inside a callout
  let currentCallout: { type: string; title?: string; content: string[] } | null = null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <ReactMarkdown
        components={{
          // Headings with anchor links
          h1: ({ node, children, ...props }) => {
            const text = children?.toString() || '';
            const id = generateAnchorId(text);
            return (
              <motion.h1
                id={id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="text-4xl font-bold mt-12 mb-6 text-slate-900 border-b-2 border-slate-200 pb-3 scroll-mt-20"
              >
                {children}
              </motion.h1>
            );
          },
          h2: ({ node, children, ...props }) => {
            const text = children?.toString() || '';
            const id = generateAnchorId(text);
            return (
              <motion.h2
                id={id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="text-2xl font-bold mt-12 mb-6 text-sky-700 scroll-mt-20"
              >
                {children}
              </motion.h2>
            );
          },
          h3: ({ node, children, ...props }) => {
            const text = children?.toString() || '';
            const id = generateAnchorId(text);
            return (
              <motion.h3
                id={id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="text-xl font-semibold mt-8 mb-4 text-sky-600 scroll-mt-20"
              >
                {children}
              </motion.h3>
            );
          },
          // Paragraphs with animation
          p: ({ node, children, ...props }) => {
            // Check if this is a callout marker
            const childText = children?.toString() || '';

            // Handle callout start markers
            const calloutStartMatch = childText.match(
              /<CALLOUT_(\w+)_START(?:_TITLE_([^>]*))?>$/
            );
            if (calloutStartMatch) {
              const type = calloutStartMatch[1].toLowerCase() as 'tip' | 'warning' | 'info' | 'success';
              const title = calloutStartMatch[2];
              currentCallout = { type, title, content: [] };
              return null;
            }

            // Handle callout end markers
            if (childText.includes('<CALLOUT_END>')) {
              if (currentCallout) {
                const calloutElement = (
                  <CalloutBox
                    variant={currentCallout.type as 'tip' | 'warning' | 'info' | 'success'}
                    title={currentCallout.title}
                  >
                    {currentCallout.content.join('\n')}
                  </CalloutBox>
                );
                currentCallout = null;
                return calloutElement;
              }
              return null;
            }

            // If inside callout, accumulate content
            if (currentCallout) {
              currentCallout.content.push(childText);
              return null;
            }

            return (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.3 }}
                className="text-base leading-relaxed text-slate-700 mb-6"
              >
                {children}
              </motion.p>
            );
          },
          // Lists with stagger animation
          ul: ({ node, children, ...props }) => (
            <motion.ul
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="space-y-3 list-disc pl-6 my-6"
            >
              {children}
            </motion.ul>
          ),
          ol: ({ node, children, ...props }) => (
            <motion.ol
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="space-y-3 list-decimal pl-6 my-6"
            >
              {children}
            </motion.ol>
          ),
          li: ({ node, children, ...props }) => (
            <motion.li
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2 }}
              className="text-slate-700 leading-relaxed"
            >
              {children}
            </motion.li>
          ),
          // Code blocks with copy functionality
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');

            if (!inline && match) {
              return (
                <CodeBlockWithCopy code={codeString} language={match[1]} />
              );
            }

            // Inline code
            return (
              <code
                className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded text-sm font-mono font-medium"
                {...props}
              >
                {children}
              </code>
            );
          },
          // Enhanced blockquotes
          blockquote: ({ node, children, ...props }) => (
            <motion.blockquote
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="border-l-4 border-sky-500 bg-sky-50 py-4 px-6 my-6 rounded-r-lg italic text-sky-900"
            >
              {children}
            </motion.blockquote>
          ),
          // Links with hover effect
          a: ({ node, children, ...props }) => (
            <a
              className="text-sky-600 underline underline-offset-2 hover:text-sky-700 transition-colors duration-200 font-medium"
              target={props.href?.startsWith('http') ? '_blank' : undefined}
              rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              {...props}
            >
              {children}
            </a>
          ),
          // Strong text
          strong: ({ node, children, ...props }) => (
            <strong className="font-semibold text-slate-900" {...props}>
              {children}
            </strong>
          ),
          // Emphasis
          em: ({ node, children, ...props }) => (
            <em className="italic text-slate-800" {...props}>
              {children}
            </em>
          ),
          // Horizontal rule
          hr: ({ node, ...props }) => (
            <hr className="my-12 border-t-2 border-slate-200" {...props} />
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </motion.div>
  );
}
