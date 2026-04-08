'use client';

import { useState, useRef } from 'react';
import { ToolLayout } from '../tool-layout';

const initialItems = [
  { id: 1, text: 'Write test plan' },
  { id: 2, text: 'Set up Playwright' },
  { id: 3, text: 'Create page objects' },
  { id: 4, text: 'Write test cases' },
  { id: 5, text: 'Run tests in CI' },
  { id: 6, text: 'Generate report' },
];

export default function DragAndDropTool() {
  const [items, setItems] = useState(initialItems);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const [moveCount, setMoveCount] = useState(0);

  const handleDragStart = (idx: number) => {
    setDraggedIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setOverIdx(idx);
  };

  const handleDrop = (idx: number) => {
    if (draggedIdx === null || draggedIdx === idx) {
      setDraggedIdx(null);
      setOverIdx(null);
      return;
    }
    const updated = [...items];
    const [moved] = updated.splice(draggedIdx, 1);
    updated.splice(idx, 0, moved);
    setItems(updated);
    setMoveCount((c) => c + 1);
    setDraggedIdx(null);
    setOverIdx(null);
  };

  const handleReset = () => {
    setItems(initialItems);
    setMoveCount(0);
  };

  return (
    <ToolLayout
      title="Drag & Drop"
      description="Reorder items by dragging them. Practice mouse event simulation and position verification."
      difficulty="Advanced"
      scenarios={[
        'Drag the first item to the last position and verify the new order.',
        'Drag "Run tests in CI" above "Write test cases" and verify.',
        'Verify the move counter increments after each drag operation.',
        'Reset the list and verify it returns to the original order.',
        'Verify each item has the correct data-testid attribute.',
        'Drag an item and drop it in the same position — verify no change.',
      ]}
    >
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-600">
            Drag items to reorder. <span className="font-medium" data-testid="move-count">Moves: {moveCount}</span>
          </p>
          <button
            onClick={handleReset}
            className="text-sm text-sky-600 hover:underline"
            data-testid="reset-button"
          >
            Reset
          </button>
        </div>

        <ul className="space-y-2" data-testid="sortable-list">
          {items.map((item, idx) => (
            <li
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={() => handleDrop(idx)}
              onDragEnd={() => { setDraggedIdx(null); setOverIdx(null); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-grab active:cursor-grabbing transition-all select-none ${
                draggedIdx === idx
                  ? 'opacity-50 border-sky-400 bg-sky-50'
                  : overIdx === idx
                  ? 'border-sky-400 bg-sky-50/50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
              data-testid={`item-${item.id}`}
            >
              <span className="text-slate-400 text-lg cursor-grab">&#9776;</span>
              <span className="flex-1 text-sm font-medium text-slate-800">{item.text}</span>
              <span className="text-xs text-slate-400 font-mono" data-testid={`position-${item.id}`}>#{idx + 1}</span>
            </li>
          ))}
        </ul>

        {/* Current Order Display */}
        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-3">
          <p className="text-xs text-slate-500 mb-1 font-medium">Current Order:</p>
          <p className="text-xs text-slate-600 font-mono" data-testid="current-order">
            {items.map((i) => i.id).join(', ')}
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
