
import React from 'react';

const SCALE = [0, 1, 2, 3, 4, 5];

export function QuestionCard({
  label, value, onChange
}: { label: string, value: number | undefined, onChange: (v: number) => void }) {
  return (
    <div className="p-3 rounded-xl border border-slate-200">
      <div className="text-sm text-slate-700">{label}</div>
      <div className="mt-2 grid grid-cols-6 gap-2">
        {SCALE.map((v) => (
          <button
            type="button"
            key={v}
            onClick={() => onChange(v)}
            className={`h-9 rounded-lg border text-sm transition ${
              value === v ? 'border-sky-500 bg-sky-50' : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
