'use client';

import React, { useCallback, useRef, useState } from 'react';
import Task from './components/Task';

// Today I did page
export default function HomePage() {
  const [input, setInput] = useState('');
  const [congrats, setCongrats] = useState(false);
  const [tempTask, setTempTask] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const saveTask = useCallback((text: string) => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem('tasks') : null;
      const list = raw ? JSON.parse(raw) : [];
      const item = {
        id: (globalThis.crypto && 'randomUUID' in globalThis.crypto) ? globalThis.crypto.randomUUID() : String(Date.now()),
        text,
        completed: true,
        ts: Date.now(),
      };
      const next = Array.isArray(list) ? [...list, item] : [item];
      window.localStorage.setItem('tasks', JSON.stringify(next));
    } catch (e) {
      // Persisting is best-effort; ignore failures.
      // console.error('Failed to save task', e);
    }
  }, []);

  const handleSubmit = useCallback(() => {
    const text = input.trim();
    if (!text) return;

    saveTask(text);
    setTempTask(text);
    setCongrats(true);
    setInput('');

    // Clear temporary UI after a short delay
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setTempTask(null);
      setCongrats(false);
      timerRef.current = null;
    }, 1800);
  }, [input, saveTask]);

  return (
    <main className="min-h-screen w-full flex items-start justify-center p-6">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-semibold">Today I did</h1>

        <div className="space-y-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Type what you did and press Enter"
            className="input input-bordered w-full"
            autoFocus
          />

          {congrats && (
            <div role="status" className="alert alert-success">
              <span className="font-medium">Congratulations!</span>
            </div>
          )}

          {tempTask && (
            <div className="flex items-center gap-2 text-base-content/70">
              <input type="checkbox" className="checkbox checkbox-success" defaultChecked readOnly aria-hidden="true" />
              <Task>
                <span className="line-through">{tempTask}</span>
              </Task>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

