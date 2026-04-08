'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { CodeBlockWithCopy } from './code-block-with-copy';
import { CalloutBox } from './callout-box';
import { InlinePracticeEditor } from './inline-practice-editor';
import { PlaywrightPracticeEditor } from './playwright-practice-editor-v2';
import { PracticeSection } from './practice-section';

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

// Parse callout and practice block syntax (:::type Title\nContent\n:::)
function parseCallouts(content: string): string {
  console.log('🚀 parseCallouts called, content length:', content.length);
  console.log('🔍 Content has :::practice?', content.includes(':::practice'));

  return content.replace(
    /:::(\w+(?:-\w+)*)(?:\s+([^\n]*))?\n([\s\S]*?):::/g,
    (match, type, title, body) => {
      console.log('✅ REGEX MATCHED! Type:', type, 'Title:', title?.substring(0, 50));
      // Handle practice-steps blocks (structured practice with multiple steps)
      if (type.toLowerCase() === 'practice-steps') {
        // Parse JSON configuration
        try {
          // Clean up the JSON content - remove any markdown artifacts
          let jsonContent = body.trim();

          // If it starts with a code fence, extract JSON from it
          if (jsonContent.startsWith('```json') || jsonContent.startsWith('```')) {
            const lines = jsonContent.split('\n');
            // Remove first line (```json or ```) and last line (```)
            jsonContent = lines.slice(1, -1).join('\n').trim();
          }

          const config = JSON.parse(jsonContent);
          // Use btoa for consistent encoding (available in modern Node.js and browsers)
          const encodedConfig = btoa(JSON.stringify(config));
          return `\n\n[PRACTICE_STEPS_START]\n${encodedConfig}\n[PRACTICE_STEPS_END]\n\n`;
        } catch (e) {
          console.error('Failed to parse practice-steps JSON in parseCallouts:', e);
          console.error('Body content:', body.substring(0, 200));
          return match; // Return original if parsing fails
        }
      }

      // Handle playwright-practice blocks (WebContainer execution)
      if (type.toLowerCase() === 'playwright-practice') {
        const params: Record<string, string> = {};

        if (title) {
          title.split('|').forEach((param: string) => {
            const equalIndex = param.indexOf('=');
            if (equalIndex > -1) {
              const key = param.substring(0, equalIndex).trim();
              const value = param.substring(equalIndex + 1).trim();
              params[key] = value;
            }
          });
        }

        const language = params.language || 'typescript';
        const height = params.height || '400px';
        const practiceTitle = params.title || 'Try Playwright';
        const testUrl = params.testUrl || '';

        // Use btoa for consistent encoding (available in modern Node.js and browsers)
        const encodedTitle = btoa(practiceTitle);
        const encodedTestUrl = btoa(testUrl);

        return `\n\n[PLAYWRIGHT_PRACTICE_START_LANG_${language}_HEIGHT_${height}_TITLE_${encodedTitle}_URL_${encodedTestUrl}]\n${body.trim()}\n[PLAYWRIGHT_PRACTICE_END]\n\n`;
      }

      // Handle practice blocks (regular JS/TS eval)
      if (type.toLowerCase() === 'practice') {
        // Extract optional parameters from title (language, height, title)
        const params: Record<string, string> = {};

        if (title) {
          // Split by | and handle key=value pairs
          title.split('|').forEach((param: string) => {
            const equalIndex = param.indexOf('=');
            if (equalIndex > -1) {
              const key = param.substring(0, equalIndex).trim();
              const value = param.substring(equalIndex + 1).trim();
              params[key] = value;
            }
          });
        }

        const language = params.language || 'typescript';
        const height = params.height || '300px';
        const practiceTitle = params.title || 'Try it yourself';

        // Use Base64 encoding for title to avoid special character issues
        // Use btoa for consistent encoding (available in modern Node.js and browsers)
        const encodedTitle = btoa(practiceTitle);

        // Create a unique marker for practice blocks (use special chars that won't be interpreted as markdown)
        return `\n\n[PRACTICE_START_LANG_${language}_HEIGHT_${height}_TITLE_${encodedTitle}]\n${body.trim()}\n[PRACTICE_END]\n\n`;
      }

      // Validate callout type
      const validTypes = ['tip', 'warning', 'info', 'success'];
      const calloutType = validTypes.includes(type.toLowerCase())
        ? type.toLowerCase()
        : 'info';

      // Create a unique marker that we can identify in the renderer (use special chars that won't be interpreted as markdown)
      return `\n\n[CALLOUT_${calloutType.toUpperCase()}_START${title ? `_TITLE_${title}` : ''}]\n${body.trim()}\n[CALLOUT_END]\n\n`;
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

// New approach: Extract practice blocks and render them separately
function extractPracticeBlocks(content: string) {
  const blocks: Array<{ type: 'markdown' | 'practice' | 'practice-steps' | 'playwright-practice'; content: string; props?: any; index: number }> = [];

  // Find all practice and practice-steps blocks with their positions
  const practiceStepsRegex = /:::practice-steps\s*\n([\s\S]*?):::/g;
  const playwrightPracticeRegex = /:::playwright-practice\s+([^\n]*)\n([\s\S]*?):::/g;
  const practiceRegex = /:::practice\s+([^\n]*)\n([\s\S]*?):::/g;

  const allMatches: Array<{ type: 'practice' | 'practice-steps' | 'playwright-practice'; index: number; length: number; content: string; params?: string }> = [];

  // Find all practice-steps matches
  let match;
  while ((match = practiceStepsRegex.exec(content)) !== null) {
    allMatches.push({
      type: 'practice-steps',
      index: match.index,
      length: match[0].length,
      content: match[1].trim()
    });
  }

  // Find all playwright-practice matches
  while ((match = playwrightPracticeRegex.exec(content)) !== null) {
    allMatches.push({
      type: 'playwright-practice',
      index: match.index,
      length: match[0].length,
      content: match[2].trim(),
      params: match[1].trim()
    });
  }

  // Find all practice matches
  while ((match = practiceRegex.exec(content)) !== null) {
    allMatches.push({
      type: 'practice',
      index: match.index,
      length: match[0].length,
      content: match[2].trim(),
      params: match[1].trim()
    });
  }

  // Sort by index to process in order
  allMatches.sort((a, b) => a.index - b.index);

  let lastIndex = 0;

  for (const matchData of allMatches) {
    // Add markdown before this block
    if (matchData.index > lastIndex) {
      blocks.push({
        type: 'markdown',
        content: content.substring(lastIndex, matchData.index),
        index: lastIndex
      });
    }

    if (matchData.type === 'practice-steps') {
      // Parse JSON config for practice-steps
      try {
        const config = JSON.parse(matchData.content);
        blocks.push({
          type: 'practice-steps',
          content: matchData.content,
          props: config,
          index: matchData.index
        });
      } catch (e) {
        console.error('Failed to parse practice-steps JSON:', e);
        console.error('Block content:', matchData.content.substring(0, 200));
        // Still add as markdown if parsing fails
        blocks.push({
          type: 'markdown',
          content: content.substring(matchData.index, matchData.index + matchData.length),
          index: matchData.index
        });
      }
    } else if (matchData.type === 'playwright-practice') {
      // Parse parameters for playwright-practice block
      const params: Record<string, string> = {};
      (matchData.params || '').split('|').forEach(param => {
        const equalIndex = param.indexOf('=');
        if (equalIndex > -1) {
          const key = param.substring(0, equalIndex).trim();
          const value = param.substring(equalIndex + 1).trim();
          params[key] = value;
        }
      });

      blocks.push({
        type: 'playwright-practice',
        content: matchData.content,
        props: {
          language: params.language || 'typescript',
          height: params.height || '400px',
          title: params.title || 'Try Playwright',
          testUrl: params.testUrl || ''
        },
        index: matchData.index
      });
    } else {
      // Parse parameters for regular practice block
      const params: Record<string, string> = {};
      (matchData.params || '').split('|').forEach(param => {
        const equalIndex = param.indexOf('=');
        if (equalIndex > -1) {
          const key = param.substring(0, equalIndex).trim();
          const value = param.substring(equalIndex + 1).trim();
          params[key] = value;
        }
      });

      blocks.push({
        type: 'practice',
        content: matchData.content,
        props: {
          language: params.language || 'typescript',
          height: params.height || '300px',
          title: params.title || 'Try it yourself'
        },
        index: matchData.index
      });
    }

    lastIndex = matchData.index + matchData.length;
  }

  // Add remaining markdown
  if (lastIndex < content.length) {
    blocks.push({
      type: 'markdown',
      content: content.substring(lastIndex),
      index: lastIndex
    });
  }

  return blocks;
}

export function EnhancedMarkdownRenderer({
  content,
  className = '',
  skipFirstH1 = true,
}: EnhancedMarkdownRendererProps) {
  // Remove first H1 if needed
  let processedContent = skipFirstH1 ? removeFirstH1(content) : content;

  // Extract practice blocks
  const blocks = extractPracticeBlocks(processedContent);
  console.log('🚀 Found blocks:', blocks.length, blocks.map(b => b.type));

  // Track if we're currently inside a callout
  let currentCallout: { type: string; title?: string; content: string[] } | null = null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {blocks.map((block, index) => {
        if (block.type === 'playwright-practice') {
          console.log('🎭 Rendering Playwright practice editor!', block.props);
          return (
            <PlaywrightPracticeEditor
              key={`playwright-practice-${index}`}
              initialCode={block.content}
              language={block.props.language}
              title={block.props.title}
              height={block.props.height}
              testUrl={block.props.testUrl}
            />
          );
        }

        if (block.type === 'practice') {
          console.log('🎉 Rendering practice editor!', block.props);
          return (
            <InlinePracticeEditor
              key={`practice-${index}`}
              initialCode={block.content}
              language={block.props.language}
              title={block.props.title}
              height={block.props.height}
            />
          );
        }

        if (block.type === 'practice-steps') {
          console.log('🎯 Rendering practice-steps section!', block.props);
          return (
            <PracticeSection
              key={`practice-steps-${index}`}
              title={block.props.title}
              description={block.props.description}
              goal={block.props.goal}
              steps={block.props.steps}
              language={block.props.language || 'typescript'}
              height={block.props.height || '350px'}
            />
          );
        }

        // Render markdown block
        const markdownContent = block.type === 'markdown' ? parseCallouts(block.content) : block.content;

        return (
          <ReactMarkdown
            key={`markdown-${index}`}
            remarkPlugins={[remarkGfm]}
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
              /\[CALLOUT_(\w+)_START(?:_TITLE_([^\]]+))?\]$/
            );
            if (calloutStartMatch) {
              const type = calloutStartMatch[1].toLowerCase() as 'tip' | 'warning' | 'info' | 'success';
              const title = calloutStartMatch[2];
              currentCallout = { type, title, content: [] };
              return null;
            }

            // Handle callout end markers
            if (childText.includes('[CALLOUT_END]')) {
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

            // Debug: Check if markers are being treated as code
            if (codeString.includes('[PRACTICE_START') || codeString.includes('[PRACTICE_END]')) {
              console.log('⚠️  MARKER IN CODE BLOCK! This is the problem!', codeString.substring(0, 100));
            }

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
          // Tables
          table: ({ node, children, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse rounded-lg overflow-hidden text-sm" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ node, children, ...props }) => (
            <thead className="bg-sky-50" {...props}>
              {children}
            </thead>
          ),
          tbody: ({ node, children, ...props }) => (
            <tbody className="divide-y divide-slate-200" {...props}>
              {children}
            </tbody>
          ),
          tr: ({ node, children, ...props }) => (
            <tr className="hover:bg-slate-50 transition-colors" {...props}>
              {children}
            </tr>
          ),
          th: ({ node, children, ...props }) => (
            <th className="px-4 py-3 text-left font-semibold text-sky-700 border border-slate-200" {...props}>
              {children}
            </th>
          ),
          td: ({ node, children, ...props }) => (
            <td className="px-4 py-3 text-slate-700 border border-slate-200" {...props}>
              {children}
            </td>
          ),
        }}
      >
        {markdownContent}
      </ReactMarkdown>
        );
      })}
    </motion.div>
  );
}
