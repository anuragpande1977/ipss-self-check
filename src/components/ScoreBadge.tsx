
import React from 'react';

export function ScoreBadge({ total }: { total: number }) {
  let label = 'Mild';
  let color = 'bg-emerald-500';
  if (total >= 8 && total <= 19) { label = 'Moderate'; color = 'bg-amber-500'; }
  else if (total >= 20) { label = 'Severe'; color = 'bg-rose-500'; }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-white text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}
