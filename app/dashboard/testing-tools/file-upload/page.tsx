'use client';

import { useState, useRef } from 'react';
import { ToolLayout } from '../tool-layout';

interface UploadedFile {
  name: string;
  size: string;
  type: string;
  progress: number;
}

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'application/pdf', 'text/plain'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export default function FileUploadTool() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const processFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setError('');

    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`"${file.name}" is not a supported file type. Allowed: PNG, JPG, GIF, PDF, TXT.`);
        return;
      }

      if (file.size > MAX_SIZE) {
        setError(`"${file.name}" exceeds the 5MB size limit.`);
        return;
      }

      newFiles.push({
        name: file.name,
        size: formatSize(file.size),
        type: file.type,
        progress: 0,
      });
    }

    setFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((_, idx) => {
      const fileIndex = files.length + idx;
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30 + 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        setFiles((prev) =>
          prev.map((f, i) => (i === fileIndex ? { ...f, progress: Math.min(100, Math.round(progress)) } : f))
        );
      }, 400);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const handleRemove = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleClear = () => {
    setFiles([]);
    setError('');
  };

  return (
    <ToolLayout
      title="File Upload"
      description="Upload files with drag-and-drop, progress bars, validation, and removal. Practice setInputFiles and file assertions."
      difficulty="Intermediate"
      scenarios={[
        'Upload a valid PNG file using the file input and verify it appears in the list.',
        'Upload a file via drag and drop onto the drop zone.',
        'Upload a file with unsupported type and verify the error message.',
        'Upload a file larger than 5MB and verify the size error.',
        'Verify the progress bar reaches 100% for each uploaded file.',
        'Remove an uploaded file and verify it disappears from the list.',
        'Upload multiple files at once and verify all appear.',
        'Click "Clear All" and verify the list is empty.',
      ]}
    >
      <div className="max-w-lg mx-auto space-y-4">
        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            dragOver ? 'border-sky-400 bg-sky-50' : 'border-slate-300 bg-slate-50'
          }`}
          data-testid="drop-zone"
        >
          <div className="text-3xl mb-2">📁</div>
          <p className="text-sm text-slate-600 mb-2">
            Drag & drop files here, or{' '}
            <button
              onClick={() => inputRef.current?.click()}
              className="text-sky-600 hover:underline font-medium"
              data-testid="browse-button"
            >
              browse
            </button>
          </p>
          <p className="text-xs text-slate-400">PNG, JPG, GIF, PDF, TXT — Max 5MB</p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".png,.jpg,.jpeg,.gif,.pdf,.txt"
            onChange={handleInputChange}
            className="hidden"
            data-testid="file-input"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm" data-testid="upload-error">
            {error}
          </div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2" data-testid="file-list">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700" data-testid="file-count">{files.length} file(s) uploaded</p>
              <button onClick={handleClear} className="text-xs text-red-600 hover:underline" data-testid="clear-all">Clear All</button>
            </div>
            {files.map((file, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3" data-testid={`file-item-${idx}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate" data-testid={`file-name-${idx}`}>{file.name}</p>
                    <p className="text-xs text-slate-500">{file.size} — {file.type}</p>
                  </div>
                  <button onClick={() => handleRemove(idx)} className="text-xs text-red-500 hover:underline ml-3" data-testid={`remove-${idx}`}>
                    Remove
                  </button>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${file.progress === 100 ? 'bg-green-500' : 'bg-sky-500'}`}
                    style={{ width: `${file.progress}%` }}
                    data-testid={`progress-${idx}`}
                    data-progress={file.progress}
                  />
                </div>
                {file.progress === 100 && (
                  <p className="text-xs text-green-600 mt-1" data-testid={`complete-${idx}`}>Upload complete</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
