'use client';

import { useState } from 'react';
import { ToolLayout } from '../tool-layout';

export default function AlertsModalsTool() {
  const [alertResult, setAlertResult] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formSubmitted, setFormSubmitted] = useState('');
  const [nestedModal, setNestedModal] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const handleAlert = () => {
    window.alert('This is a test alert!');
    setAlertResult('Alert was dismissed');
    showToast('Alert handled');
  };

  const handleConfirm = () => {
    const result = window.confirm('Do you want to proceed?');
    setAlertResult(result ? 'Confirmed' : 'Cancelled');
    showToast(result ? 'User confirmed' : 'User cancelled');
  };

  const handlePrompt = () => {
    const result = window.prompt('Enter your name:', 'QA Tester');
    if (result !== null) {
      setAlertResult(`Entered: ${result}`);
      showToast(`Hello, ${result}!`);
    } else {
      setAlertResult('Prompt cancelled');
    }
  };

  const handleFormSubmit = () => {
    setFormSubmitted(formName);
    setFormModalOpen(false);
    setFormName('');
    showToast('Form submitted!');
  };

  return (
    <ToolLayout
      title="Alerts & Modals"
      description="Handle browser alerts, confirms, prompts, and custom modal dialogs with forms and nested modals."
      difficulty="Beginner"
      scenarios={[
        'Click "Alert" and handle the browser alert dialog.',
        'Click "Confirm" and accept — verify "Confirmed" result text.',
        'Click "Confirm" and dismiss — verify "Cancelled" result text.',
        'Click "Prompt", enter a name, and verify the result shows it.',
        'Open the info modal and verify its content, then close it.',
        'Open the confirm modal, click "Confirm Delete" and verify the toast.',
        'Open the form modal, fill in a name, submit, and verify it appears below.',
        'Open the info modal, click "Open Nested" and verify the nested modal appears.',
        'Verify the toast notification auto-disappears after 3 seconds.',
      ]}
    >
      <div className="max-w-lg mx-auto space-y-6">
        {/* Browser Dialogs */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Browser Dialogs</h3>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleAlert} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600" data-testid="trigger-alert">
              Alert
            </button>
            <button onClick={handleConfirm} className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600" data-testid="trigger-confirm">
              Confirm
            </button>
            <button onClick={handlePrompt} className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600" data-testid="trigger-prompt">
              Prompt
            </button>
          </div>
          {alertResult && (
            <p className="mt-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2" data-testid="dialog-result">
              Result: {alertResult}
            </p>
          )}
        </div>

        {/* Custom Modals */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Custom Modals</h3>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setModalOpen(true)} className="px-4 py-2 bg-sky-500 text-white rounded-lg text-sm hover:bg-sky-600" data-testid="open-info-modal">
              Info Modal
            </button>
            <button onClick={() => setConfirmModalOpen(true)} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600" data-testid="open-confirm-modal">
              Confirm Delete
            </button>
            <button onClick={() => setFormModalOpen(true)} className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600" data-testid="open-form-modal">
              Form Modal
            </button>
          </div>
          {formSubmitted && (
            <p className="mt-3 text-sm text-slate-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2" data-testid="form-result">
              Submitted name: {formSubmitted}
            </p>
          )}
        </div>

        {/* Toast */}
        {toastVisible && (
          <div className="fixed top-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl text-sm z-50 animate-in fade-in slide-in-from-top-2" data-testid="toast">
            {toastMessage}
          </div>
        )}

        {/* Info Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40" data-testid="info-modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()} data-testid="info-modal">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Information</h3>
              <p className="text-sm text-slate-600 mb-4">
                This is a custom modal dialog. You can practice opening it, reading its content, and closing it using Playwright.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setNestedModal(true)} className="px-3 py-1.5 bg-purple-500 text-white rounded-lg text-sm" data-testid="open-nested">
                  Open Nested
                </button>
                <button onClick={() => setModalOpen(false)} className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-sm hover:bg-slate-300" data-testid="close-info-modal">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Nested Modal */}
        {nestedModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" data-testid="nested-modal-overlay">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl" data-testid="nested-modal">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Nested Modal</h3>
              <p className="text-sm text-slate-600 mb-4">This modal opened from inside another modal!</p>
              <button onClick={() => setNestedModal(false)} className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-sm" data-testid="close-nested">
                Close
              </button>
            </div>
          </div>
        )}

        {/* Confirm Modal */}
        {confirmModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40" data-testid="confirm-modal-overlay">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl" data-testid="confirm-modal">
              <h3 className="text-lg font-bold text-red-700 mb-2">Delete Item?</h3>
              <p className="text-sm text-slate-600 mb-4">This action cannot be undone. Are you sure?</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setConfirmModalOpen(false)} className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-sm" data-testid="cancel-delete">
                  Cancel
                </button>
                <button onClick={() => { setConfirmModalOpen(false); showToast('Item deleted!'); }} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm" data-testid="confirm-delete">
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form Modal */}
        {formModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40" data-testid="form-modal-overlay">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl" data-testid="form-modal">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Enter Your Name</h3>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Your name"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
                data-testid="modal-name-input"
                autoFocus
              />
              <div className="flex gap-3 justify-end">
                <button onClick={() => { setFormModalOpen(false); setFormName(''); }} className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-sm" data-testid="cancel-form">
                  Cancel
                </button>
                <button onClick={handleFormSubmit} disabled={!formName.trim()} className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm disabled:opacity-50" data-testid="submit-form">
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
