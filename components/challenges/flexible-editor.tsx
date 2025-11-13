'use client';

import { CodeEditor } from './code-editor';
import { MarkdownEditor } from './markdown-editor';
import { TextEditor } from './text-editor';

interface FlexibleEditorProps {
  responseFormat: 'javascript' | 'typescript' | 'markdown' | 'text' | 'json';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function FlexibleEditor({
  responseFormat,
  value,
  onChange,
  placeholder,
  className = '',
}: FlexibleEditorProps) {
  const editorContent = () => {
    switch (responseFormat) {
      case 'javascript':
      case 'typescript':
      case 'json':
        return (
          <CodeEditor
            value={value}
            onChange={onChange}
            language={responseFormat}
            placeholder={placeholder}
          />
        );

      case 'markdown':
        return (
          <MarkdownEditor
            value={value}
            onChange={onChange}
            placeholder={placeholder || "Write your response in markdown...\n\n## Section Title\n\n- Point 1\n- Point 2\n\n**Important:** Use proper formatting"}
          />
        );

      case 'text':
        return (
          <TextEditor
            value={value}
            onChange={onChange}
            placeholder={placeholder || "Write your response here..."}
          />
        );

      default:
        // Fallback to code editor
        return (
          <CodeEditor
            value={value}
            onChange={onChange}
            language="javascript"
            placeholder={placeholder}
          />
        );
    }
  };

  return <div className={className}>{editorContent()}</div>;
}
