'use client';

import { CodeEditor } from './code-editor';
import { MarkdownEditor } from './markdown-editor';
import { TextEditor } from './text-editor';
import { MergeConflictResolver } from './merge-conflict-resolver';
import type { MergeConflictScenario, MergeConflictScenarioResponse } from '@/types/challenges';

interface FlexibleEditorProps {
  responseFormat: 'javascript' | 'typescript' | 'markdown' | 'text' | 'json' | 'merge_conflict_interactive';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  starterCode?: string;
  onReset?: () => void;
  scenarios?: MergeConflictScenario[];
  onMergeConflictComplete?: (responses: MergeConflictScenarioResponse[]) => void;
  isSubmitting?: boolean;
}

export function FlexibleEditor({
  responseFormat,
  value,
  onChange,
  placeholder,
  className = '',
  starterCode,
  onReset,
  scenarios,
  onMergeConflictComplete,
  isSubmitting = false,
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
            starterCode={starterCode}
            onReset={onReset}
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

      case 'merge_conflict_interactive':
        if (!scenarios || scenarios.length === 0) {
          return (
            <div className="p-8 text-center text-muted-foreground">
              <p>No merge conflict scenarios available for this challenge.</p>
            </div>
          );
        }
        return (
          <MergeConflictResolver
            scenarios={scenarios}
            onComplete={(responses) => {
              if (onMergeConflictComplete) {
                onMergeConflictComplete(responses);
              }
              onChange(JSON.stringify({ scenarios: responses }));
            }}
            value={value}
            onChange={onChange}
            isSubmitting={isSubmitting}
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
